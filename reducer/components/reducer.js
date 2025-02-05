'use client';

import { run_shader } from "./run_shader";
import { analyze } from "./analyze_results";

// using wasm 
const Parser = require('web-tree-sitter');

export const reduce = async (safeShader, racyShader, shaderInfo) => {
    
    // set up  parser
    async function initializeParser() {
        await Parser.init({
            locateFile(scriptName = "tree-sitter.wasm", scriptDirectory = 'tree-sitter.wasm') {
            return scriptName;
            },
        });
    }

    const createParser = async () => {
        await initializeParser();
        const parser = new Parser;
        const WGSL = await Parser.Language.load('tree-sitter-wgsl.wasm');
        parser.setLanguage(WGSL);

        console.log("parser created properly");

        return parser;
    }


    const parser = await createParser();
    // create ASTs
    let safeAST = parser.parse(safeShader);
    let racyAST = parser.parse(racyShader);

    // compound_indexes list keeps track of the child indexes from root to reach the compound statement
    // i.e. tree.rootNode.child(indexes[0]).child(indexes[1]) etc.
    // compound_statement is the stuff inside the @compute block where we can remove lines or blocks
    let [safe_compound_indexes, safe_compound_statement] = find_compound_statement(safeAST, []);

    console.log("found safe compound_statement inside @compute block")
    console.log("indexes leading to the safe compound_statement: " + safe_compound_indexes);
    // console.log("compound statement: " + safe_compound_statement.text);
    
    let [racy_compound_indexes , racy_compound_statement] = find_compound_statement(racyAST, []);

    console.log("found racy compound_statement inside @compute block")
    console.log("indexes leading to the racy compound_statement: " + racy_compound_indexes);
    // console.log("compound statement: " + racy_compound_statement.text);
    
    // start is inside the compound_statement
    let [safe_start_index, safe_start] = find_start(safe_compound_statement);
    let [racy_start_index, racy_start] = find_start(racy_compound_statement);

    console.log("found safe start: \n" + safe_start.text);
    console.log("at " + safe_start_index);
    console.log("found racy start: \n" + racy_start.text);
    console.log("at " + racy_start_index);

    // end is also inside the compound_statement
    let [safe_end_index, safe_end] = find_end(safe_compound_statement, safe_start_index);
    let [racy_end_index, racy_end] = find_end(racy_compound_statement, racy_start_index);

    console.log("found safe end: " + safe_end.text);
    console.log("at " + safe_end_index);
    console.log("found racy end: " + racy_end.text);
    console.log("at " + racy_end_index);

    // originally-- was thinking of a for loop to remove statements, but as things are removed it messes with ordering 
    // plus constantly making new trees to compare
    // so that approach is unfeasable

    // instead-- create an dictionary of removable statements for the safe tree and for the racy tree
      // index: what child is it of compound_statement?
      // text: line of code
      // type: statement, for_statement, etc. 
      // node: compound_statement.child(i)-- the actual node
    // do this for both the safe and racy trees

    let safe_removables = removable_statements(safe_compound_statement, safe_start_index, safe_end_index);
    let racy_removables = removable_statements(racy_compound_statement, racy_start_index, racy_end_index);

    const multiline_types = ["for_statement", "if_statement", "while_statement"];

    // // we will be checking if racy removable statements are also in the safe removable statements
    // // so creating a set of all the text is faster (O(1)) lookup time
    // let safe_removables_text = new Set(safe_removables.map(safeItem => safeItem.text));

    // get starting number of mismatches
    let mismatches = await getMismatches(safeShader, racyShader, shaderInfo);
    mismatches = JSON.stringify(mismatches, null, 2);
    // iterate through racy_removables
    for (let racy_item of racy_removables) {

        // get corresponding item from safe_removables if it exists
        let safe_item = safe_removables.find(safeItem => safeItem.text === racy_item.text) || null;
        
        // try removing the line & see if it affects mismatches, etc.
        let result = await try_remove(racy_item, safe_item, ["for_statement", "if_statement", "while_statement"].includes(racy_item.node.child(0).type), safeShader, racyShader, safeAST, racyAST, mismatches, shaderInfo, parser);
        safeShader = result.safeShader;
        racyShader = result.racyShader;
        safeAST = result.safeAST;
        racyAST = result.racyAST;
        mismatches = result.mismatches;
    }

    return [safeShader, racyShader, safeAST, racyAST, mismatches];
}

  
const try_remove = async (racy_item, safe_item, is_multiline, safeShader, racyShader, safeAST, racyAST, mismatches, shaderInfo, parser) => {
        
    console.log('removing\n', racy_item.text)

    // if the line exists in safe too
    if (safe_item) {
        // remove from both shaders
        console.log("attempting to remove from both")
        let [new_safeAST, new_safeShader] = remove(safe_item.node, safeShader, parser);
        let [new_racyAST, new_racyShader] = remove(racy_item.node, racyShader, parser);

        // check mismatches
        let new_mismatches = await getMismatches(new_safeShader, new_racyShader, shaderInfo);
        if (mismatches === JSON.stringify(new_mismatches, null, 2))  {
            console.log("mismatches did not change, permanently removed statement");
            // if mismatches do not change, permanently remove statement
            return { safeShader: new_safeShader, racyShader: new_racyShader, safeAST: new_safeAST, racyAST: new_racyAST, mismatches };
        }
        // if mismatchs do change, check for multiline
        else {
            console.log("number of mismatches changed: " + JSON.stringify(mismatches, null, 2) + " to " + JSON.stringify(new_mismatches, null, 2));

            if (is_multiline) {
                console.log("statement is multiline, attempting to remove children");
                
                // find compound_statement inside the multiline block
                // if it's a for loop: 
                // statement with one child for_statement  
                    // with children for (for), (), for_header (inside for's ()), (), and compound_statement (stuff inside loop)
                    // compound_statement has children {}, and a bunch of statements
                // if statement: 
                // statement with one child if_statement
                    // with one child if_clause
                        // with children if (if), expression (stuff in if's parenthesis), and compound_statement (stuff inside if)
                // while loop:
                // statement with one child while_statement
                    // with children while (while), expression (stuff in while's parenthesis), and compound_statement (stuff inside loop)
                
                
                // racy_item.node --> get the node
                // .child(0) --> get statement of that node
                // iterate through these chilren to find compound_statement child of statement
                
                console.log("finding if/while/for_statement");
                let multiline_statement_node = racy_item.node;
                for (let i = 0; i < racy_item.node.childCount; i++) {
                    //console.log(racy_item.node.child(i).type);
                    if (["for_statement", "if_statement", "while_statement"].includes(racy_item.node.child(i).type)) {
                        multiline_statement_node = racy_item.node.child(i);
                        multiline_statement_index = i;
                        break;
                    }
                }
                console.log("found if/while/for_statement");
                console.log(multiline_statement_node.type);


                console.log("finding compound_statement inside if/while/for_statement")
                let node = multiline_statement_node;
                let is_if = multiline_statement_node.child(0)?.type === "if_clause";
                // if statements seem to have one extra layer of depth for some reason
                if (is_if) {
                    node = multiline_statement_node.child(0);
                }
                let index = 0;
                console.log("node type " + node.type);
                for (let i = 0; i < node.childCount; i++) {
                    // console.log(node.child(i).type);
                    if (node.child(i).type === "compound_statement") {
                        index = i;
                        break;
                    }
                }
                console.log("found compound_statement inside multiline");
                console.log(node.child(index).type);


                // if the multiline block is shared between safe and racy the compound statement should be at the same index relatively
                racy_node = node.child(index);
                safe_node = safe_item.node.child(multiline_statement_index);
                if (is_if) {
                    safe_node = safe_node.child(0);
                }
                safe_node = safe_node.child(index);

                // try removing child statements, same logic as outer loop where you find statements that you can remove
                let racy_removables = removable_statements(racy_node, 0, racy_node.childCount)
                let safe_removables = removable_statements(safe_node, 0, safe_node.childCount)
                
                for (let racy_item2 of racy_removables) {

                    let safe_child = safe_removables.find(c => c.text === racy_item2.text);
                    
                    let result = await try_remove(racy_item2, safe_child, ["for_statement", "if_statement", "while_statement"].includes(racy_item2.node.child(0).type), safeShader, racyShader, safeAST, racyAST, new_mismatches, shaderInfo);
                    safeShader = result.safeShader;
                    racyShader = result.racyShader;
                    safeAST = result.safeAST;
                    racyAST = result.racyAST;
                    mismatches = result.mismatches;
                }

                console.log("done trying to remove kids");
            }

            return {safeShader, racyShader, safeAST, racyAST, mismatches};
        }
    }
    // only exists in racy
    else {
        console.log("attempting to remove from racy only")
        // remove from racy
        let [new_racyAST, new_racyShader] = remove(racy_item.node, racyShader, parser);

        // check mismatches
        let new_mismatches = await getMismatches(safeShader, new_racyShader, shaderInfo);
        if (mismatches === JSON.stringify(new_mismatches, null, 2)) {
            // if mismatches do not change, permanently remove statement
            console.log("mismatches did not change, permanently removed statement");
            return { safeShader, racyShader: new_racyShader, safeAST, racyAST: new_racyAST, mismatches: mismatches };
        }
        // if mismatchs do change, revert- pretend you never did anything 
        else {
            console.log("number of mismatches changed: " + JSON.stringify(mismatches, null, 2) + " to " + JSON.stringify(new_mismatches, null, 2));
            // unless multiline
            if (is_multiline) {
                console.log("statement is multiline, attempting to remove children");
                // try removing child statements

                console.log("finding if/while/for_statement");
                let multiline_statement_node = racy_item.node;
                let multiline_statement_index = 0;
                for (let i = 0; i < racy_item.node.childCount; i++) {
                    //console.log(racy_item.node.child(i).type);
                    if (["for_statement", "if_statement", "while_statement"].includes(racy_item.node.child(i).type)) {
                        multiline_statement_node = racy_item.node.child(i);
                        multiline_statement_index = i;
                        break;
                    }
                }
                console.log("found if/while/for_statement");
                console.log(multiline_statement_node.type);
                

                console.log("finding compound_statement inside if/while/for_statement")
                let node = multiline_statement_node;
                // if statements seem to have one extra layer of depth for some reason
                if (multiline_statement_node.child(0)?.type === "if_clause") {
                    node = multiline_statement_node.child(0);
                }
                let index = 0;
                // console.log("node type " + node.type);
                for (let i = 0; i < node.childCount; i++) {
                    // console.log(node.child(i).type);
                    if (node.child(i).type === "compound_statement") {
                        index = i;
                        break;
                    }
                }
                console.log("found compound_statement inside multiline");
                console.log(node.child(index).type);

                let racy_removables = removable_statements(node.child(index), 0, node.child(index)?.childCount);
                //console.log("racy removables of multiline " + JSON.stringify(racy_removables, null, 2))
                for (let racy_item2 of racy_removables) {
                    // if the whole block wasn't in safe, neither will the child statements tbh
                    // when iterating through child statements, need to ensure we are checking the correct level
                    // console.log("child type: " + racy_item2.node.child(0).type);
                    // console.log("child text: " + racy_item2.node.child(0).text);
                    // console.log(["for_statement", "if_statement", "while_statement"].includes(racy_item2.node.child(0).type));
                    let result = await try_remove(racy_item2, null, ["for_statement", "if_statement", "while_statement"].includes(racy_item2.node.child(0).type), safeShader, racyShader, safeAST, racyAST, new_mismatches, shaderInfo, parser);
                    racyShader = result.racyShader;
                    racyAST = result.racyAST;
                }

                console.log("done trying to remove kids");
            }
            return {safeShader, racyShader, safeAST, racyAST, mismatches};
        }
    }

    
}

const getMismatches = async (safeShader, racyShader, shaderInfo) => {
    try {
        const outputs1 = await run_shader(safeShader, shaderInfo);
        const outputs2 = await run_shader(racyShader, shaderInfo);

        const safeArray = outputs1[0] || [];
        const raceArray = outputs2[0] || [];

        const data_race_info = {
            safe: shaderInfo.safe || [],
            safe_constants: shaderInfo.safe_constants || [],
            constant_locs: shaderInfo.constant_locs || 0,
        };

        const result = analyze(safeArray, raceArray, shaderInfo, data_race_info, 1);
        console.log("get mismatches returns: " + JSON.stringify(result, null, 2));
        return result

    } catch (error) {
        console.log('Error running shaders or analyzing mismatches:', error);
        return null;
    }
};

// helper functions
// tree.rootNode has everything-- struct_decl, global_variable_decl (@group stuff), and function_decl (@compute stuff)
// look at children of rootNode to find the @compute block for each tree

  // inside function_decl @compute block 
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

    // we can start removing lines AFTER 
    // if (local_invocation_id.x < 2u) {
    // 	(workgroup_buf)[0u] = 0u;
    // }
    // but must stop BEFORE
    // the first dummy var (i.e. var var_dummy: u32 = mem[(global_invocation_id.x * 8u) + 16u];\n')
      // basically the first statement with "dummy" in its text

const find_compound_statement = (ast, compound_indexes) => {

    for (let i = 0; i < ast.rootNode.childCount; i++) {
          
        let function_decl = ast.rootNode.child(i);
        if (function_decl.type === "function_decl") {
            compound_indexes.push(i);
      
            for (let j = 0; j < function_decl.childCount; j++) {
      
                let compound_statement = function_decl.child(j);
                if (compound_statement.type === "compound_statement") {
                    compound_indexes.push(j);
                    return [compound_indexes, compound_statement];
                }
            }
        }
    }
}
      
// both start and end are inside the compound_statement
const find_start = (compound_statement) => {
    
    // abridged version since multiline was giving issues
    let start_text = `if (local_invocation_id.x < 2u)`;
    
    for (let i = 0; i < compound_statement.childCount; i++) {
        let start = compound_statement.child(i);
    
        if (start.text.includes(start_text)) {
            return [i, start];
        }
    }
}
      
const find_end = (compound_statement, start_index) => {
            
    let end_text = `dummy`;
      
    // no need to start from the beginning- for efficiency, can start searching after start_index
    for (let i = start_index + 1; i < compound_statement.childCount; i++) {
        let end = compound_statement.child(i);
    
        if (end.text.includes(end_text)) {
            return [i, end];
        }
    }
}
      
// remove a line or block represented by node from the shader and regenerate the tree
const remove = (node, code, parser) => {
    
    // get byte positions of the text-- these correspond to the start and end of text to remove from the shader
    let start = node.startIndex; // Byte offset start
    let end = node.endIndex;     // Byte offset end
    let startPos = node.startPosition; // Row/column start
    let endPos = node.endPosition;     // Row/column end
    //console.log(start, end, startPos, endPos);
    
    // remove from source code
    let reduced_code = code.slice(0, start) + code.slice(end);
    
    // taking out the below part of the code
    // just editing the tree is faster, but since i want to check mismatches i want both the old and new trees / code
    // no inbuilt function to copy a tree so whatever
    
    // // edit and regenerate tree
    // tree.edit({
    //   // indices = actual byte offsets
    //   startIndex: start,
    //   oldEndIndex: end,
    //   newEndIndex: start, // No new content added, so it's the same as startIndex
    
    //   // positions = row/column positions
    //   startPosition: startPos,
    //   oldEndPosition: endPos,
    //   newEndPosition: startPos, // No new content, so it's the same as startPosition
    // });
    
    // regenerate tree
    let reduced_tree = parser.parse(reduced_code);
    
    return [reduced_tree, reduced_code];
      
}
      
const removable_statements = (compound_statement, start_index, end_index) => {
    let statements = [];
    
    // in the case of multilines, the first child of a compound statement is {} so it's ok that we only go up to startIndex
    
    // start from end, so that first statements removed end up being from the end
    for (let i = end_index - 1; i > start_index; i--) {
        // console.log("text " + compound_statement.child(i).text);
        // console.log("type " + compound_statement.child(i).type);
        // this check is included for the case in which we are finding statements inside multilines
        if (compound_statement.child(i).type === "statement") {
            statements.push({
                index: i,
                text: compound_statement.child(i).text,
                type: compound_statement.child(i).type,
                node: compound_statement.child(i)
            });
        }
    }   
    return statements;
}
      
  
// let safe_removables = removable_statements(safe_compound_statement, safe_start_index, safe_end_index);
// let racy_removables = removable_statements(racy_compound_statement, racy_start_index, racy_end_index);

// multiline_types = ["for_statement", "if_statement", "while_statement"];

// // we will be checking if racy removable statements are also in the safe removable statements
// // so creating a set of all the text is faster (O(1)) lookup time
// let safe_removables_text = new Set(safe_removables.map(safeItem => safeItem.text));

// const try_remove = (safe_removables, racy_removables) {
//   // iterate through racy_removables
//   for (let racy_item of racy_removables) {

//     // does statement exist in safe shader too
//     if (safe_removables_text.has(racy_item.text)) {
//       // if so, try removing from both

//       // get corresponding item from safe_removables
//       let safe_item = safe_removables.find(safeItem => safeItem.text === racy_item.text);
    
//       // remove from both 
//       [new_safeAST, new_safeShader] = remove(safe_item.node, safeShader);
//       [new_racyAST, new_racyShader] = remove(racy_item.node, racyShader);

//       // check number of mismatches
//       let new_mismatches = analyze(new_safeShader, new_racyShader, shaderInfo, dataRaceInfo);
    
//       // if mismatches do not change, permanently remove statement
//       if (mismatches === new_mismatches) {
//         safeShader = new_safeShader;
//         racyShader = new_racyShader;
//         safeAST = new_safeAST;
//         racyAST = new_racyAST;
//       }
//       // if mismatches do change, revert back to old -- pretend you never removed anything and continue loop 
//       else {
//         // unless you removed a multiline statement.. in which case we now have to look at the children of that multiline
//         if (multiline_types.includes(racy_item.type)) {

//         }
//       }

//     }
//     else {
//       // remove from just racy
//       [new_racyAST, new_racyShader] = remove(racy_item.node, racyShader);

//       // if mismatches do not change, permanently remove statement
//       if (mismatches === new_mismatches) {
//         racyShader = new_racyShader;
//         racyAST = new_racyAST;
//       }
//       // if mismatches do change, revert back to old -- pretend you never removed anything and continue loop 
//       // unless you removed a multiline statement.. in which case we now have to look at the children of that multiline


//     }
//   }
// }
      
    