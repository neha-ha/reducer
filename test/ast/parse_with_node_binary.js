const Parser = require("tree-sitter"); // Import Tree-Sitter
const WGSL = require("C:\\Users\\nehab\\webgpu\\test\\grammar\\build\\Release\\tree_sitter_wgsl_binding.node"); // Load compiled parser


const parser = new Parser(); 
parser.setLanguage(WGSL); // Set WGSL as the parser language

// Example WGSL code snippet to parse-- random1
let code = `
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
	var var_0: u32 = 1u;
	var var_3: u32 = 1u;
	var var_4: u32 = 1u;
	var var_7: u32 = 1u;
	var var_1: u32 = 1u;
	var var_2: u32 = 1u;
	var var_5: u32 = 1u;
	var var_6: u32 = 1u;
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
	var_2 = mem[(((global_invocation_id.x + 515u) % total_ids) * 8u) + 16u] + mem[10u];
	for (var i_1: u32 = min(var_7, 10u); i_1 > 0u; i_1 = i_1 - 1u) {
    var_1 = (1u + mem[15u]) + mem[(global_invocation_id.x * 8u) + 22u];
    var_7 = mem[(global_invocation_id.x * 8u) + 20u] + mem[(global_invocation_id.x * 8u) + 19u];
    var_2 = var_7 + mem[1u];
}
	var_1 = var_3 + var_2;
	var_0 = mem[(global_invocation_id.x * 8u) + 20u] + 0u;
	(mem)[(global_invocation_id.x * 8u) + 17u] = var_4 + var_0;
	var var_dummy: u32 = mem[(global_invocation_id.x * 8u) + 19u];
	var dummy_index_var: i32 = index_buf[0u];
	var dummy_data_var: u32 = data_buf[0u];
	var dummy_output_var: u32 = output_buf[0u].data;
}
`;

// Parse the code and generate the AST
let tree = parser.parse(code);

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
let node = tree.rootNode.child(13).child(3).child(30)
console.log("node"  + node);
// let node = tree.rootNode
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

// // test removing a random statement-- 
// let nodee = tree.rootNode.child(13).child(3).child(30);
// // console.log(nodee.text)
// // console.log(nodee.type)
// // console.log(nodee)

// console.log('')

// // get byte positions of the text-- these correspond to the start and end of text to remove from the shader
// let start = nodee.startIndex; // Byte offset start
// let end = nodee.endIndex;     // Byte offset end
// let startPos = nodee.startPosition; // Row/column start
// let endPos = nodee.endPosition;     // Row/column end
// //console.log(start, end, startPos, endPos);

// // remove from source code
// code = code.slice(0, start) + code.slice(end)

// // regenerate tree
// // tree = parser.parse(code);

// // edit and regenerate tree
// tree.edit({
// 	// indices = actual byte offsets
// 	startIndex: start,
// 	oldEndIndex: end,
// 	newEndIndex: start, // No new content added, so it's the same as startIndex

// 	// positions = row/column positions
// 	startPosition: startPos,
// 	oldEndPosition: endPos,
// 	newEndPosition: startPos, // No new content, so it's the same as startPosition
// });

// tree = parser.parse(code);

// console.log("new @compute children")
// node = tree.rootNode.child(13).child(3)
// for (let i = 0; i < node.childCount; i++) {
// 	console.log(node.child(i).text);
// 	console.log("");
// 	console.log(node.child(i).type);
// 	console.log(i);
// 	console.log("------------------------------------------------------------")
// }


// // different modes of adding statements back in
// // any mismatches, even if not the same keep reducing
// // 