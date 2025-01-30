const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Parser = require("tree-sitter");
const WGSL = require("..\\..\\grammar\\build\\Release\\tree_sitter_wgsl_binding.node");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type",
};
app.use(cors(corsOptions)); // Allow requests from React frontend
 

const parser = new Parser();
parser.setLanguage(WGSL);

// API to parse WGSL code into an AST
app.post("/wgsl-to-ast", (req, res) => {
  try {
    const wgslCode = req.body.code; // WGSL code from the request
    const tree = parser.parse(wgslCode);
    res.json({ ast: tree.rootNode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/reduce", async (req, res) => {
  try {
    // different methods of adding statements back in 
    // i.e. any mismatches, even if not the same keep reducing
    // get this from the request potentially-- a button or smth

    // get code from request
    const safeShader = req.body.safeShader;
    const racyShader = req.body.racyShader;

    // get current mismatches from request
    const currentMismatches = req.body.mismatches;
    console.log(currentMismatches);

    // create tree-sitter trees for both & start at root
    let safeAST = parser.parse(safeShader);
    let racyAST = parser.parse(racyShader);

    console.log("created safe and racy abstract syntax trees");
    console.log("\n---------------------------------------------------------------------------------\n")

    // compound_indexes list keeps track of the child indexes from root to reach the compound statement
    // i.e. tree.rootNode.child(indexes[0]).child(indexes[1]) etc.
    // compound_statement is the stuff inside the @compute block where we can remove lines or blocks
    let [safe_compound_indexes, safe_compound_statement] = find_compound_statement(safeAST, []);

    console.log("found safe compound_statement inside @compute block")
    console.log("indexes leading to the safe compound_statement: " + safe_compound_indexes);
    // console.log("compound statement: " + safe_compound_statement.text);
    console.log("\n---------------------------------------------------------------------------------\n")

    let [racy_compound_indexes , racy_compound_statement] = find_compound_statement(racyAST, []);

    console.log("found racy compound_statement inside @compute block")
    console.log("indexes leading to the racy compound_statement: " + racy_compound_indexes);
    // console.log("compound statement: " + racy_compound_statement.text);
    console.log("\n---------------------------------------------------------------------------------\n")

    // start is inside the compound_statement
    let [safe_start_index, safe_start] = find_start(safe_compound_statement);
    let [racy_start_index, racy_start] = find_start(racy_compound_statement);

    console.log("found safe start: \n" + safe_start.text);
    console.log("at " + safe_start_index);
    console.log("found racy start: \n" + racy_start.text);
    console.log("at " + racy_start_index);
    console.log("\n---------------------------------------------------------------------------------\n")
    
    // end is also inside the compound_statement
    let [safe_end_index, safe_end] = find_end(safe_compound_statement, safe_start_index);
    let [racy_end_index, racy_end] = find_end(racy_compound_statement, racy_start_index);

    console.log("found safe end: " + safe_end.text);
    console.log("at " + safe_end_index);
    console.log("found racy end: " + racy_end.text);
    console.log("at " + racy_end_index);
    console.log("\n---------------------------------------------------------------------------------\n")

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

    multiline_types = ["for_statement", "if_statement", "while_statement"];

    // we will be checking if racy removable statements are also in the safe removable statements
    // so creating a set of all the text is faster (O(1)) lookup time
    let safe_removables_text = new Set(safe_removables.map(safeItem => safeItem.text));

    // iterate through racy_removables
    for (let racy_item of racy_removables) {

      // get corresponding item from safe_removables if it exists
      let safe_item = safe_removables.find(safeItem => safeItem.text === racy_item.text) || null;

      let result = try_remove(racy_item, safe_item, multiline_types.includes(racy_item.type), safeShader, racyShader, safeAST, racyAST);
      safeShader = result.safeShader;
      racyShader = result.racyShader;
      safeAST = result.safeAST;
      racyAST = result.racyAST;
    }


    

    res.json("hi");

  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
  start_text = `if (local_invocation_id.x < 2u)`;

  for (let i = 0; i < compound_statement.childCount; i++) {
    let start = compound_statement.child(i);

    if (start.text.includes(start_text)) {
      return [i, start];
    }
  }
}

const find_end = (compound_statement, start_index) => {
      
  end_text = `dummy`;

  // no need to start from the beginning- for efficiency, can start searching after start_index
  for (let i = start_index + 1; i < compound_statement.childCount; i++) {
    let end = compound_statement.child(i);

    if (end.text.includes(end_text)) {
      return [i, end];
    }
  }
}

// remove a line or block represented by node from the shader and regenerate the tree
const remove = (node, code) => {
  
  // get byte positions of the text-- these correspond to the start and end of text to remove from the shader
  let start = node.startIndex; // Byte offset start
  let end = node.endIndex;     // Byte offset end
  let startPos = node.startPosition; // Row/column start
  let endPos = node.endPosition;     // Row/column end
  //console.log(start, end, startPos, endPos);

  // remove from source code
  reduced_code = code.slice(0, start) + code.slice(end);
  
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

  for (let i = end_index - 1; i > start_index; i--) {
    statements.push({
      index: i,
      text: compound_statement.child(i).text,
      type: compound_statement.child(i).type,
      node: compound_statement.child(i)
    });
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


const try_remove = (racy_item, safe_item, is_multiline, safeShader, racyShader, safeAST, racyAST) => {
  
  console.log("removing " + racy_item.text)

  // if the line exists in safe too
  if (safe_item) {
    // remove from both shaders
    console.log("attempting to remove from both")
    let [new_safeAST, new_safeShader] = remove(safe_item.node, safeShader);
    let [new_racyAST, new_racyShader] = remove(racy_item.node, racyShader);

    // check mismatches
    let new_mismatches = analyze(new_safeShader, new_racyShader, shaderInfo, dataRaceInfo);
    if (mismatches === new_mismatches) {
      console.log("mismatches did not change")
      // if mismatches do not change, permanently remove statement
      return { safeShader: new_safeShader, racyShader: new_racyShader, safeAST: new_safeAST, racyAST: new_racyAST };
    }
    // if mismatchs do change, revert- pretend you never did anything 
    else {
      // unless multiline
      if (is_multiline) {
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
        
        // if the multiline block is shared between safe and racy the compound statement should be at the same index
        let index = 0;
        for (let i = 0; i < racy_item.node.child(0).childCount; i++) {
          if (racy_item.node.child(0).child(i).type === "compound_statement") {
            index = i;
            break;
          }
        }

        // try removing child statements
        
        racy_removables = removable_statements(racy_item.node.child(0).child(index), 0, racy_item.node.child(0).child(index).childCount)
        safe_removables = removable_statements(safe_item.node.child(0).child(index), 0, safe_item.node.child(0).child(index).safe_item.node.childCount)
        for (let racy_item2 of racy_removables) {
          let safe_child = safe_removables.find(c => c.text === racy_item2.text);
          let result = try_remove(racy_item2, safe_child, multiline_types.includes(racy_item2.type), safeShader, racyShader, safeAST, racyAST);
          safeShader = result.safeShader;
          racyShader = result.racyShader;
          safeAST = result.safeAST;
          racyAST = result.racyAST;
        }
      }
    }
  }
  // only exists in racy
  else {
    // remove from racy
    let [new_racyAST, new_racyShader] = remove(racy_item.node, racyShader);

    // check mismatches
    let new_mismatches = analyze(safeShader, new_racyShader, shaderInfo, dataRaceInfo);
    if (mismatches === new_mismatches) {
      // if mismatches do not change, permanently remove statement
      return { safeShader, racyShader: new_racyShader, safeAST, racyAST: new_racyAST };
    }
    // if mismatchs do change, revert- pretend you never did anything 
    else {
      // unless multiline
      if (is_multiline) {
        // try removing child statements

        let index = 0;
        for (let i = 0; i < racy_item.node.child(0).childCount; i++) {
          if (racy_item.node.child(0).child(i).type === "compound_statement") {
            index = i;
            break;
          }
        }
        racy_removables = removable_statements(racy_item.node.child(0).child(index), 0, racy_item.node.child(0).child(index).childCount)
        for (let racy_item2 of racy_removables) {
          // if the whole block wasn't in safe, neither will the child statements tbh
          let result = try_remove(racy_item2, null, multiline_types.includes(racy_item2.type), safeShader, racyShader, safeAST, racyAST);
          racyShader = result.racyShader;
          racyAST = result.racyAST;
        }
      }
    }
  }
}


// from cpt-forever
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

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Backend server running on http://localhost:${PORT}`));
