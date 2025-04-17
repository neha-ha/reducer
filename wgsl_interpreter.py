import re
from collections import defaultdict
import math
import builtins
import random


class WGSLInterpreter:
    def __init__(self):
        self.buffers = defaultdict(lambda: defaultdict(lambda: 1))
        self.workgroup_vars = defaultdict(int)
        self.local_vars = defaultdict(int)
        self.structs = {}
        self.state = {
            'num_workgroups': {'x': 1},
            'global_invocation_id': {'x': 0},
            'local_invocation_id': {'x': 0},
        }

    def run(self, code):
        self.parse_structs(code)
        self.init_buffers(code)
        self.execute_main(code)
        #self.print_final_state()

    def parse_structs(self, code):
        struct_pattern = re.compile(r"struct\s+(\w+)\s*{([^}]*)}")
        for match in struct_pattern.finditer(code):
            name = match.group(1)
            fields = [line.strip().strip(",") for line in match.group(2).splitlines() if line.strip()]
            field_defs = [tuple(f.split(":")) for f in (field.strip() for field in fields)]
            self.structs[name] = field_defs
            print(f"Defined struct '{name}' with fields: {field_defs}")

    def init_buffers(self, code):
        var_pattern = re.compile(r"@group\(0\)\s*@binding\((\d+)\)\s*var<[^>]+>\s+(\w+):\s+array<(\w+)(?:,\s*\d+)?>;")
        for match in var_pattern.finditer(code):
            binding = int(match.group(1))
            name = match.group(2)
            dtype = match.group(3)

            if dtype in self.structs:
                self.buffers[name] = defaultdict(lambda: {
                    field: 0 for field, _ in self.structs[dtype]
                })
                print(f"Initialized struct buffer '{name}' of type '{dtype}'")
                print(self.buffers[name][0])
            else:
                self.buffers[name]  # Trigger lazy init (default to 1)
                print(f"Initialized primitive buffer '{name}' of type '{dtype}'")

    def _split_brace_edges(self, lines):
        result = []
        for line in lines:
            stripped = line.strip()
            if stripped.startswith("} else {"):
                result.extend(["}", "else {"])
            elif "} else {" in stripped:
                # Handle inline variant, e.g. "} else {"
                result.extend([part.strip() for part in stripped.split("else") if part.strip()])
                result.append("else {")
            else:
                result.append(line)
        return result

    def execute_main(self, code):
        main_pattern = re.compile(r"fn\s+main\((.*?)\)\s*{(.*)}", re.DOTALL)
        match = main_pattern.search(code)
        if not match:
            print("No main function found.")
            return
        body = match.group(2)
        self.local_vars = defaultdict(int)
        print("Set initial built-in inputs:", self.state)

        raw_lines = body.strip().splitlines()
        self.execute_block(raw_lines)

    def execute_block(self, lines):
        lines = self._split_brace_edges(lines)
        i = 0
        while i < len(lines):
            line = lines[i].strip()
            if not line or line.startswith("//"):
                i += 1
                continue

            if line.startswith("if"):
                i = self.handle_if_block(lines, i)
            elif line.startswith("for"):
                i = self.handle_for_block(lines, i)
            elif line.startswith("var "):
                self.handle_var_declaration(line)
            elif line.startswith("let "):
                self.handle_let_declaration(line)
            elif "=" in line:
                self.handle_assignment(line)

            i += 1

    def handle_if_block(self, lines, start_index):
        lines = self._split_brace_edges(lines)
        header = lines[start_index].strip()

        # Manually parse full condition with paren matching
        if not header.startswith("if"):
            print(f"Invalid if statement: {header}")
            return start_index

        # Find the opening '('
        open_paren = header.find('(')
        if open_paren == -1:
            print(f"Malformed if condition: {header}")
            return start_index

        # Track until we find the matching ')'
        i = open_paren + 1
        depth = 1
        condition = ''
        while i < len(header) and depth > 0:
            c = header[i]
            if c == '(':
                depth += 1
            elif c == ')':
                depth -= 1
            if depth > 0:
                condition += c
            i += 1

        condition = condition.strip()
        condition_result = self.eval_expression(condition)

        # Flip condition randomly if it contains "% total_ids"
        if re.search(r'%\s*total_ids\b', condition):
            if random.random() < 0.5:
                print("🎲 Random flip triggered due to '% total_ids' → flipping result")
                condition_result = not condition_result
            else:
                print("🎲 Random flip skipped despite '% total_ids'")
        print(f"IF condition: '{condition}' → {condition_result}")

        # Continue as before
        i = start_index + 1
        brace_level = 1 if "{" in header else 0
        if_body = []

        while i < len(lines):
            line = lines[i]
            brace_level += line.count("{") - line.count("}")
            if brace_level <= 0:
                break
            if_body.append(line)
            i += 1

        i += 1  # move to next line after '}'
        else_body = []
        if i < len(lines) and lines[i].strip().startswith("else"):
            else_header = lines[i].strip()
            i += 1
            brace_level = 1 if "{" in else_header else 0
            while i < len(lines):
                line = lines[i]
                brace_level += line.count("{") - line.count("}")
                if brace_level <= 0:
                    break
                else_body.append(line)
                i += 1
            i += 1  # skip the final closing brace

        if bool(condition_result):
            print("→ Executing IF branch")
            self.execute_block(if_body)
        elif else_body:
            print("→ Executing ELSE branch")
            self.execute_block(else_body)


        return i - 1

    def handle_for_block(self, lines, start_index):
        lines = self._split_brace_edges(lines)  # Clean up `} else {` style edges
        header = lines[start_index].strip()

        if not header.startswith("for"):
            print(f"Invalid for statement: {header}")
            return start_index

        # === Extract the loop header using parentheses depth ===
        open_paren = header.find("(")
        if open_paren == -1:
            print(f"Malformed for loop: {header}")
            return start_index

        i = open_paren + 1
        depth = 1
        loop_expr = ""
        while i < len(header) and depth > 0:
            c = header[i]
            if c == "(":
                depth += 1
            elif c == ")":
                depth -= 1
            if depth > 0:
                loop_expr += c
            i += 1

        loop_parts = loop_expr.split(";")
        if len(loop_parts) != 3:
            print(f"Malformed for loop components: {header}")
            return start_index

        init_stmt = loop_parts[0].strip()
        cond_expr = loop_parts[1].strip()
        update_stmt = loop_parts[2].strip()

        # === Execute initializer ===
        if init_stmt:
            self.execute_block([init_stmt + ";"])

        # === Parse body lines using brace tracking ===
        i = start_index + 1
        brace_level = 1 if "{" in header else 0
        body_lines = []

        while i < len(lines):
            line = lines[i]
            brace_level += line.count("{") - line.count("}")
            if brace_level <= 0:
                break
            body_lines.append(line)
            i += 1

        # Strip trailing '}' if it's alone
        if body_lines and body_lines[-1].strip() == "}":
            body_lines = body_lines[:-1]

        # === Execute the loop ===
        while True:
            if cond_expr:
                cond_result = self.eval_expression(cond_expr)
                if not cond_result:
                    break
            self.execute_block(body_lines)
            if update_stmt:
                self.execute_block([update_stmt + ";"])

        return i - 1

    def handle_var_declaration(self, line):
        # Example: var i_1: u32 = min(var_159, 10u);
        var_decl = re.match(r"var\s+(\w+):\s+(.+?)(?:\s*=\s*(.+))?;", line)
        if var_decl:
            name, vtype, value_expr = var_decl.groups()
            vtype = vtype.strip()
            if "array" in vtype:
                size_match = re.search(r"array<\w+,\s*(\d+)>", vtype)
                size = int(size_match.group(1)) if size_match else 1
                self.local_vars[name] = [0] * size
                print(f"Declared var '{name}' of type '{vtype}' with size {size}")
            else:
                if value_expr:
                    value = self.trace_eval_expression(value_expr.strip())
                else:
                    value = 0
                self.local_vars[name] = value
                print(f"Declared var '{name}' of type '{vtype}' with value {value}")

    def handle_let_declaration(self, line):
        let_decl = re.match(r"let\s+(\w+)\s*=\s*(.+);", line)
        if let_decl:
            name, expr = let_decl.groups()
            value = self.trace_eval_expression(expr)
            self.local_vars[name] = value
            print(f"Declared let '{name}' = {value}")

    def handle_assignment(self, line):
        line = line.strip().rstrip(";")
        buffer_assign_match = re.match(r"\(?(\w+)\)?\s*\[\s*(.+?)\s*\]\s*=\s*(.+)", line)
        if buffer_assign_match:
            buffer_name = buffer_assign_match.group(1)
            index_expr = buffer_assign_match.group(2)
            rhs_expr = buffer_assign_match.group(3)

            index = self.eval_expression(index_expr)
            value = self.trace_eval_expression(rhs_expr.strip())
            self.buffers[buffer_name][index] = value
            print(f"Assigned: {buffer_name}[{index}] = {value}")
            return

        if "=" in line:
            lhs, rhs = line.split("=", 1)
            lhs = lhs.strip()
            rhs = rhs.strip()
            value = self.trace_eval_expression(rhs)
            self.local_vars[lhs] = value
            print(f"Assigned: {lhs} = {value}")

    def _resolve_buffer_accesses(self, expr):
        result = ""
        i = 0
        while i < len(expr):
            if expr[i].isalpha() or expr[i] == "_":
                # Parse variable or buffer name
                start = i
                while i < len(expr) and (expr[i].isalnum() or expr[i] == "_"):
                    i += 1
                name = expr[start:i]

                if i < len(expr) and expr[i] == "[":
                    i += 1  # skip '['
                    depth = 1
                    index_start = i
                    while i < len(expr) and depth > 0:
                        if expr[i] == "[":
                            depth += 1
                        elif expr[i] == "]":
                            depth -= 1
                        i += 1
                    index_expr = expr[index_start:i-1]
                    index_val = self.eval_expression(index_expr)

                    # Look up buffer value
                    try:
                        value = self.buffers[name][index_val]
                    except KeyError:
                        print(f"Error: Buffer '{name}' not found.")
                        value = 0

                    # Check for optional struct field access
                    if i < len(expr) and expr[i] == ".":
                        i += 1
                        field_start = i
                        while i < len(expr) and expr[i].isalnum():
                            i += 1
                        field_name = expr[field_start:i]

                        if isinstance(value, dict) and field_name in value:
                            value = value[field_name]
                        else:
                            print(f"Warning: tried to access unknown field '{field_name}' on buffer '{name}[{index_val}]'")
                            value = 0

                    result += str(value)
                else:
                    # Just a normal variable name, not buffer access
                    result += name
            else:
                result += expr[i]
                i += 1
        return result

    def _log_expression_values(self, expr):
        # Look for buffer[index] and buffer[index].field
        buffer_accesses = re.findall(r'(\w+)\[(.*?)\](?:\.(\w+))?', expr)
        for buffer_name, index_expr, field in buffer_accesses:
            try:
                index = self.eval_expression(index_expr)
                value = self.buffers[buffer_name][index]
                if field:
                    if isinstance(value, dict) and field in value:
                        print(f"  {buffer_name}[{index}].{field} = {value[field]}")
                    else:
                        print(f"  {buffer_name}[{index}].{field} = <invalid>")
                else:
                    print(f"  {buffer_name}[{index}] = {value}")
            except Exception as e:
                print(f"  {buffer_name}[{index_expr}] = <error: {e}>")

        # Look for plain variable names
        var_names = re.findall(r'\b[a-zA-Z_]\w*\b', expr)
        for name in set(var_names):
            if name in self.local_vars:
                print(f"  {name} = {self.local_vars[name]}")


    def trace_eval_expression(self, expr, context=""):
        print(f"Evaluating {context}: '{expr}'")
        # Print all variable lookups
        self._log_expression_values(expr)
        result = self.eval_expression(expr)
        print(f"→ Result: {result}\n")
        return result


    def eval_expression(self, expr):
        expr = expr.replace("num_workgroups.x", str(self.state['num_workgroups']['x']))
        expr = expr.replace("global_invocation_id.x", str(self.state['global_invocation_id']['x']))
        expr = expr.replace("local_invocation_id.x", str(self.state['local_invocation_id']['x']))
        expr = re.sub(r'(\d+)u\b', r'\1', expr)

        # Evaluate all buffer lookups: manually parse and replace all `name[expr]` cases
        expr = self._resolve_buffer_accesses(expr)
        expr = self._resolve_buffer_accesses(expr)
        for name in sorted(self.local_vars.keys(), key=len, reverse=True):
            expr = re.sub(rf'\b{name}\b', str(self.local_vars[name]), expr)

        # Add support for `min()` if used
        eval_globals = {"__builtins__": {}}
        eval_locals = {"min": min, "max": max}

        try:
            result = eval(expr, eval_globals, eval_locals)
            return result
        except Exception as e:
            print(f"Failed to evaluate expression '{expr}': {e}")
            return 0

    def print_final_state(self):
        print("\n--- Final State ---")
        print("\nLocal Variables:")
        for name, value in self.local_vars.items():
            print(f"  {name} = {value}")
        print("\nWorkgroup Variables:")
        for name, value in self.workgroup_vars.items():
            print(f"  {name} = {value}")
        print("\nBuffers:")
        for name, contents in self.buffers.items():
            max_index = max(contents.keys(), default=-1)
            buffer_data = [contents[i] for i in range(max_index + 1)]
            print(f"  {name}: {buffer_data}")

# --- Run the interpreter ---

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python wgsl_interpreter.py <filename.wgsl>")
        sys.exit(1)

    filename = sys.argv[1]
    try:
        with open(filename, 'r') as f:
            wgsl_code = f.read()
    except FileNotFoundError:
        print(f"Error: File '{filename}' not found.")
        sys.exit(1)

    interpreter = WGSLInterpreter()
    interpreter.run(wgsl_code)
