const Parser = require("tree-sitter"); // Import Tree-Sitter
const WGSL = require("C:\\Users\\nehab\\webgpu\\test\\grammar\\build\\Release\\tree_sitter_wgsl_binding.node"); // Load compiled parser


const parser = new Parser(); 
parser.setLanguage(WGSL); // Set WGSL as the parser language

// Example WGSL code snippet to parse-- random1
let safe = `
struct data_index_pair {
    index: i32,
    data: u32,
}

@group(0)
@binding(0)
var<storage, read_write> mem: array<u32>;

@group(0)
@binding(1)
var<storage, read_write> uninit_vars: array<i32>;

@group(0)
@binding(2)
var<storage, read_write> index_buf: array<i32>;

@group(0)
@binding(3)
var<storage, read_write> data_buf: array<u32>;

@group(0)
@binding(4)
var<storage, read_write> output_buf: array<data_index_pair>;

var<workgroup> workgroup_buf: array<u32, 256>;

@compute
@workgroup_size(1)
fn main(@builtin(num_workgroups) num_workgroups: vec3<u32>, @builtin(global_invocation_id) global_invocation_id: vec3<u32>, @builtin(local_invocation_id) local_invocation_id: vec3<u32>) {
    var local_data: array<u32, 8>;
    let total_ids = num_workgroups.x * 1u;
    let pattern_index = global_invocation_id.x * 3u;
    var var_1: u32 = 1u;
    var var_2: u32 = 1u;
    var var_3: u32 = 1u;
    var var_5: u32 = 1u;
    var var_6: u32 = 1u;
    var var_7: u32 = 1u;
    var var_0: u32 = 1u;
    var var_4: u32 = 1u;
    var uninit_var_0: i32;
    var uninit_var_1: i32;
    var uninit_var_2: i32;
    var uninit_var_3: i32;
    var uninit_var_4: i32;
    var uninit_var_5: i32;
    var uninit_var_6: i32;
    var uninit_var_7: i32;
    (uninit_vars)[(global_invocation_id.x * 8u) + 0u] = uninit_var_0;
    (uninit_vars)[(global_invocation_id.x * 8u) + 1u] = uninit_var_1;
    (uninit_vars)[(global_invocation_id.x * 8u) + 2u] = uninit_var_2;
    (uninit_vars)[(global_invocation_id.x * 8u) + 3u] = uninit_var_3;
    (uninit_vars)[(global_invocation_id.x * 8u) + 4u] = uninit_var_4;
    (uninit_vars)[(global_invocation_id.x * 8u) + 5u] = uninit_var_5;
    (uninit_vars)[(global_invocation_id.x * 8u) + 6u] = uninit_var_6;
    (uninit_vars)[(global_invocation_id.x * 8u) + 7u] = uninit_var_7;
    if (local_invocation_id.x < 2u) {
        (workgroup_buf)[0u] = 0u;
    }
    var var_dummy: u32 = mem[(global_invocation_id.x * 8u) + 16u];
    var dummy_index_var: i32 = index_buf[0u];
    var dummy_data_var: u32 = data_buf[0u];
    var dummy_output_var: u32 = output_buf[0u].data;
}
`;

let racy = `
struct data_index_pair {
    index: i32,
    data: u32,
}

@group(0)
@binding(0)
var<storage, read_write> mem: array<u32>;

@group(0)
@binding(1)
var<storage, read_write> uninit_vars: array<i32>;

@group(0)
@binding(2)
var<storage, read_write> index_buf: array<i32>;

@group(0)
@binding(3)
var<storage, read_write> data_buf: array<u32>;

@group(0)
@binding(4)
var<storage, read_write> output_buf: array<data_index_pair>;

var<workgroup> workgroup_buf: array<u32, 256>;

@compute
@workgroup_size(1)
fn main(@builtin(num_workgroups) num_workgroups: vec3<u32>, @builtin(global_invocation_id) global_invocation_id: vec3<u32>, @builtin(local_invocation_id) local_invocation_id: vec3<u32>) {
    var local_data: array<u32, 8>;
    let total_ids = num_workgroups.x * 1u;
    let pattern_index = global_invocation_id.x * 3u;
    var var_1: u32 = 1u;
    var var_2: u32 = 1u;
    var var_3: u32 = 1u;
    var var_5: u32 = 1u;
    var var_6: u32 = 1u;
    var var_7: u32 = 1u;
    var var_0: u32 = 1u;
    var var_4: u32 = 1u;
    var uninit_var_0: i32;
    var uninit_var_1: i32;
    var uninit_var_2: i32;
    var uninit_var_3: i32;
    var uninit_var_4: i32;
    var uninit_var_5: i32;
    var uninit_var_6: i32;
    var uninit_var_7: i32;
    (uninit_vars)[(global_invocation_id.x * 8u) + 0u] = uninit_var_0;
    (uninit_vars)[(global_invocation_id.x * 8u) + 1u] = uninit_var_1;
    (uninit_vars)[(global_invocation_id.x * 8u) + 2u] = uninit_var_2;
    (uninit_vars)[(global_invocation_id.x * 8u) + 3u] = uninit_var_3;
    (uninit_vars)[(global_invocation_id.x * 8u) + 4u] = uninit_var_4;
    (uninit_vars)[(global_invocation_id.x * 8u) + 5u] = uninit_var_5;
    (uninit_vars)[(global_invocation_id.x * 8u) + 6u] = uninit_var_6;
    (uninit_vars)[(global_invocation_id.x * 8u) + 7u] = uninit_var_7;
    if (local_invocation_id.x < 2u) {
        (workgroup_buf)[0u] = 0u;
    }
    if (mem[7u] > mem[4u]) {
        var_4 = var_2 + 2u;
        for (var i_2: u32 = min(3u, 10u); i_2 > 0u; i_2 = i_2 - 1u) {
            if (var_0 < var_6) {
                var_4 = var_7 + var_6;
                (mem)[(((global_invocation_id.x + 842u) % total_ids) * 8u) + 21u] = 3u + mem[(global_invocation_id.x * 8u) + 22u];
                (mem)[(global_invocation_id.x * 8u) + 17u] = 3u;
                var_0 = var_4 + 3u;
            }
        }
    }
    var var_dummy: u32 = mem[(global_invocation_id.x * 8u) + 16u];
    var dummy_index_var: i32 = index_buf[0u];
    var dummy_data_var: u32 = data_buf[0u];
    var dummy_output_var: u32 = output_buf[0u].data;
}
`;

// Parse the code and generate the AST
let safe_tree = parser.parse(safe);
let racy_tree = parser.parse(racy);


const outputs1 = await run_shader(shader1, shaderInfo);
      const outputs2 = await run_shader(shader2, shaderInfo);

      const safeArray = outputs1[0] || [];
      const raceArray = outputs2[0] || [];

      const data_race_info = {
        safe: shaderInfo.safe || [],
        safe_constants: shaderInfo.safe_constants || [],
        constant_locs: shaderInfo.constant_locs || 0,
      };

      const result = analyze(safeArray, raceArray, shaderInfo, data_race_info, 1);

	  
// determine mismatches
function analyze(safe_array, race_array, parameters, data_race_info, rep) {
    let mismatches = [];
    for (let const_index = 0; const_index < parameters.constant_locs; const_index+=1) {
        if (data_race_info.safe_constants.includes(const_index) && safe_array[const_index] != race_array[const_index]) {
            mismatches.push({
                rep: rep,
                thread: null,
                index: const_index,
                expected: safe_array[const_index],
                actual: race_array[const_index],
            })
        }
        if (parameters.race_val_strat == "Even" && race_array[const_index] % 2 != 0) {
            mismatches.push({
                rep: rep,
                thread: null,
                index: const_index,
                expected: "Even",
                actual: race_array[const_index]
            })
        }
    }

    let num_threads = parameters.workgroups * parameters.workgroup_size;
    for (let thread_id = 0; thread_id < num_threads; thread_id+=1) {
        for (let offset = 0; offset < parameters.locs_per_thread; offset++) {
            let index  = (thread_id * parameters.locs_per_thread) + offset + data_race_info.constant_locs;

            // check if there's a mismatch between safe/racy. Discard 0s since the racy shader might have crashed
            if (data_race_info.safe.includes(offset) && safe_array[index] != race_array[index] && race_array[index] != 0)  {
                mismatches.push({
                    rep: rep,
                    thread: thread_id,
                    index: index,
                    expected: safe_array[index],
                    actual: race_array[index]
                })
            }
            if (parameters.race_val_strat == "Even" && race_array[index] % 2 != 0) {
                mismatches.push({
                    rep: rep,
                    thread: thread_id,
                    index: index,
                    expected: "Even",
                    actual: race_array[index]
                })
            } 
        }
    }
    return mismatches;
}

// Function to recursively print the AST
function printNode(node, depth = 0) {
    const indent = "  ".repeat(depth);
    console.log(`${indent}${node.text}`);

    // Recursively print child nodes
    for (let i = 0; i < node.childCount; i++) {
        printNode(node.child(i), depth + 1);
    }
}

// Print the AST
// printNode(tree.rootNode);
console.log("inside @compute")
let node = tree.rootNode.child(13).child(3)
for (let i = 0; i < node.childCount; i++) {
	console.log(node.child(i).text);
	console.log("");
	console.log(node.child(i).type);
	console.log(i);
	console.log("------------------------------------------------------------")
}


// struct_decl = struct data_index_pair {} = DO NOT REMOVE
// global_variable_decl =  @group0 stuff = DO NOT REMOVE
// ; = ; = do not remove
// function_decl = @compute block = DO NOT REMOVE

// find rootNode's function_decl child and remove lines from there

// inside function_decl:: 
// attribute = @compute = DO NOT REMOVE
// function_header = fn main(@builtin(num_workgroups) num_workgroups: vec3<u32>, @builtin(global_invocation_id) global_invocation_id: vec3<u32>, @builtin(local_invocation_id) local_invocation_id: vec3<u32>) = DO NOT REMOVE
// compound_statement = everything inside function

// inside compound_statement:: 
// literally everything inside is a statement-- for blocks, if blocks, and var declarations / operations
	// for example, all of the below are statements

	// var uninit_var_7: i32;

	// (uninit_vars)[(global_invocation_id.x * 8u) + 0u] = uninit_var_0;

	// if (local_invocation_id.x < 2u) {
	// 	(workgroup_buf)[0u] = 0u;
	// }

	// for (var i_1: u32 = min(var_7, 10u); i_1 > 0u; i_1 = i_1 - 1u) {
	// 	var_1 = (1u + mem[15u]) + mem[(global_invocation_id.x * 8u) + 22u];
	// 	var_7 = mem[(global_invocation_id.x * 8u) + 20u] + mem[(global_invocation_id.x * 8u) + 19u];
	// 	var_2 = var_7 + mem[1u];
	// }

	// var dummy_data_var: u32 = data_buf[0u];

// let's look inside a dummy thing to find the type associated with the name:: child 34, 35, 36, 37
// var var_dummy: u32 = mem[(global_invocation_id.x * 8u) + 19u]; --> whole thing is a variable_or_value_statement besides the ; which is its own child
// same for everything
// to avoid removing dummies we can just check if a statement's node.text has "dummy" in it

// to avoid removing 
// if (local_invocation_id.x < 2u) {
// 	(workgroup_buf)[0u] = 0u;
// }
// we can just check if a statement's node.text is this

// can remove everything normally between this and dummies 

// tree-sitter doesn't have a function to remove nodes bruh
// must instead edit the source code and then reparse it to generate an updated syntax tree
	// tree-sitter lets you edit and reparse a specific section if that's the only thing you edit

// test removing a random statement-- 
let nodee = tree.rootNode.child(13).child(3).child(30);
// console.log(nodee.text)
// console.log(nodee.type)
// console.log(nodee)

console.log('')

// get byte positions of the text-- these correspond to the start and end of text to remove from the shader
let start = nodee.startIndex; // Byte offset start
let end = nodee.endIndex;     // Byte offset end
let startPos = nodee.startPosition; // Row/column start
let endPos = nodee.endPosition;     // Row/column end
//console.log(start, end, startPos, endPos);

// remove from source code
code = code.slice(0, start) + code.slice(end)

// regenerate tree
tree = parser.parse(code);

// edit and regenerate tree
tree.edit({
	// indices = actual byte offsets
	startIndex: start,
	oldEndIndex: end,
	newEndIndex: start, // No new content added, so it's the same as startIndex

	// positions = row/column positions
	startPosition: startPos,
	oldEndPosition: endPos,
	newEndPosition: startPos, // No new content, so it's the same as startPosition
});

tree = parser.parse(code);

console.log("new @compute children")
node = tree.rootNode.child(13).child(3)
for (let i = 0; i < node.childCount; i++) {
	console.log(node.child(i).text);
	console.log("");
	console.log(node.child(i).type);
	console.log(i);
	console.log("------------------------------------------------------------")
}


// different modes of adding statements back in
// any mismatches, even if not the same keep reducing
// 