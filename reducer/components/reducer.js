'use client';

import { run_shader, run_init, free_gpu } from "./run_shader";
import { analyze } from "./analyze_results";

// using wasm
let Parser = require('web-tree-sitter');
// let Parser;
// async function loadParser() {
//     if (!Parser) {
//         const module = await import('web-tree-sitter');
//         Parser = module.default;
//     }
// }

// prepare for run 
let init = null;

let WGSL = null;
let parser = null;

export const reduce = async (safeShader, racyShader, shaderInfo, mismatchMode, specificMismatches) => {
    // await loadParser();

    // set up  parser
    async function initializeParser() {
        if (!Parser.initialized) {
            console.log("initializing Parser");
            await Parser.init({
                locateFile: (scriptName) => {
                   return `${scriptName}`;
                }

                // locateFile(scriptName = "tree-sitter.wasm", scriptDirectory = 'race-reducer/tree-sitter.wasm') {
                // return scriptName;
                // },
            });
        }
    }

    const createParser = async () => {
        await initializeParser();
        parser = new Parser;
        WGSL = await Parser.Language.load('tree-sitter-wgsl.wasm');
        parser.setLanguage(WGSL);

        console.log("parser created properly");
    }


    await createParser();
    // create ASTs
    let safeAST = parser.parse(safeShader);
    let racyAST = parser.parse(racyShader);
    

    // // prepare for run 
    init = await run_init(shaderInfo);

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

    let safe_removables = removable_statements(safe_compound_statement, safe_start_index + 1, safe_end_index);
    let racy_removables = removable_statements(racy_compound_statement, racy_start_index + 1, racy_end_index);

    // // we will be checking if racy removable statements are also in the safe removable statements
    // // so creating a set of all the text is faster (O(1)) lookup time
    // let safe_removables_text = new Set(safe_removables.map(safeItem => safeItem.text));

    // get starting number of mismatches
    let mismatches = await getMismatches(safeShader, racyShader, shaderInfo);
    console.log("initial mismatches: ", JSON.stringify(mismatches, null, 2))

    // batch objects
    let batched_items = batchConsecutiveObjects(racy_removables, safe_removables);
    // let batched_groups = batchGroupsByN(batched_items, 5);

    const l = batched_items.length;
    // const l = batched_groups.length;
    let i = 1; 

    let mismatches2 = mismatches;
    // iterate through batches
    for (let batch of batched_items) {

        
        console.log(`checking ${i}/${l}`);
        console.log(batch);
        // console.log("\n-----------\n")
        // continue;

        let result = await try_remove(batch[0], batch[1], true, safeShader, racyShader, mismatches, shaderInfo, parser, mismatchMode, specificMismatches, true);
        
        mismatches2 = await getMismatches(result.safeShader, result.racyShader, shaderInfo);
        console.log("checking mismatches a second time: ", mismatches2)
        // console.log("on this safe shader:")
        // console.log(createExpandableLog(safeShader))
        // console.log("and this racy shader:")
        // console.log(createExpandableLog(racyShader))

        if (mismatches2.length > 0) {
            safeShader = result.safeShader;
            racyShader = result.racyShader;
            mismatches = result.mismatches;
        }
        // else {
        //     console.log("empty mismatches, not updating values. however, trying again with a refreshed init")
        //     await free_gpu(init);
        //     init = await run_init(shaderInfo);
        //     mismatches2 = await getMismatches(result.safeShader, result.racyShader, shaderInfo);
        //     console.log("checking mismatches a third time: ", mismatches2)
        // }
        // console.log(createExpandableLog(safeShader));
        // console.log(createExpandableLog(racyShader));

        i += 1;

        await scheduler.yield();
        await new Promise(res => setTimeout(res, 0));

        if (window.requestIdleCallback) {
            requestIdleCallback(() => console.log("Browser had time to run GC"));
        } else {
            setTimeout(() => console.log("Fallback: Browser may run GC"), 100);
        }

    }

    // for (let racy_item of racy_removables) {

    //     // get corresponding item from safe_removables if it exists
    //     let safe_item = safe_removables.find(safeItem => statementsMatch(racy_item, safeItem)) || null;
        
    //     // try removing the line & see if it affects mismatches, etc.
    //     let result = await try_remove(racy_item, safe_item, ["for_statement", "if_statement", "while_statement", "if", "else"].includes(racy_item.node.child(0).type), safeShader, racyShader, mismatches, shaderInfo, parser, mismatchMode, specificMismatches);
    //     safeShader = result.safeShader;
    //     racyShader = result.racyShader;
    //     mismatches = result.mismatches;

    //     await scheduler.yield();
    //     await new Promise(res => setTimeout(res, 0));

    //     if (window.requestIdleCallback) {
    //         requestIdleCallback(() => console.log("Browser had time to run GC"));
    //     } else {
    //         setTimeout(() => console.log("Fallback: Browser may run GC"), 100);
    //     }
    // }

    // get new mismatches
    mismatches2 = await getMismatches(safeShader, racyShader, shaderInfo);
    console.log("final mismatches: ", JSON.stringify(mismatches2, null, 2))
    console.log("expected mismatches: ", JSON.stringify(mismatches, null, 2))

    // clear

    console.log("Memory Usage after execution:", performance.memory.usedJSHeapSize / 1024 / 1024, "MB");

    await free_gpu(init);
    init = null;

    parser.setLanguage(null);
    parser = null;

    WGSL = null;

    console.log("finished")

    return [safeShader, racyShader, mismatches];
}

  
const try_remove = async (racy_item, safe_item, is_multiline, safeShader, racyShader, mismatches, shaderInfo, parser, mismatchMode, specificMismatches, initial = false) => {
        
    console.log('item:\n', racy_item.text)
    console.log(`item:\n ${racy_item[0]?.text} \nto:\n ${racy_item[racy_item.length-1]?.text}`);
    console.log(initial);

    // if the line exists in safe too
    if ((initial && safe_item.length > 0) || (!initial && safe_item)) {

        let can_remove = true;

        // cannot remove full block if it's an if with an else block still there
        if (!initial) {
            let node = racy_item.node;
            let after_if = racyShader.slice(node.endIndex)
            
            if (node.type === "if_clause" && after_if.trim().slice(0,4) === "else") {
                can_remove = false;
                console.log("cannot remove if_clause since it has associated else_clause")
            }
        }

        let keep_same = false;
        let keep_any = false;
        let keep_specific = false;

        let all_new_mismatches = [];
        let new_mismatches = [];

        let new_safeShader = null;
        let new_racyShader = null;

        if (can_remove) {
            // remove from both shaders
            

            // let safeShaderCopy = safeShader;
            // let racyShaderCopy = racyShader;
            new_safeShader = await remove(safe_item, safeShader);
            new_racyShader = await remove(racy_item, racyShader);
            // console.log("making sure removal doesn't affect shaders")
            // console.log(safeShader === safeShaderCopy); // Should be true
            // console.log(racyShader === racyShaderCopy); // Should be true

            // check mismatches
            all_new_mismatches = await getMismatches(new_safeShader, new_racyShader, shaderInfo);
            console.log("all mismatches: ", all_new_mismatches)

            // fatal error
            if (all_new_mismatches === null) {

                console.log("latest safe shader:")
                console.log(createExpandableLog(safeShader))
                console.log("latest racy shader:")
                console.log(createExpandableLog(racyShader))

                window.alert(`
                Failed to create WebGPU Context Provider. This error is unrecoverable.
                    1) Save the current shaders-- available in console.log
                    2) Quit Chrome fully (close all tabs and windows)
                    3) Restart Chrome, paste in currrent shaders, and continue reducing.`)
                
                throw new Error("Fatal");

            }

            // console.log("old mismatches were: ", mismatches);
            
            // check modes
            // if mode is to keep same mismatches-- ensure removing a statement doesn't change the mismatches
            // make sure every run has the same mismatches
            keep_same = (mismatchMode === 0 && all_new_mismatches.every(arr =>
                JSON.stringify(mismatches, null, 2) === JSON.stringify(arr, null, 2))
            );
            // if mode is keep any mismatches -- ensure removing a statement doesn't get rid of all mismatches
            // if any runs were empty, return false
            keep_any = (mismatchMode === 1 && all_new_mismatches.every(arr => arr.length > 0))
            // make sure you still have specific mismatches according to user
            // make sure each run had those specific mismatches
            keep_specific = (mismatchMode === 2 && all_new_mismatches.every(new_mismatches =>
                matchesSpecificMismatches(new_mismatches, specificMismatches))
            );
            console.log(`keep same = ${keep_same}, keep_any = ${keep_any}, keep_specific = ${keep_specific}`); 
        }


        if (keep_same || keep_any || keep_specific)  {
        // if (false) {
            console.log("permanently removed statement");
            // console.log("new safe shader: ")
            // console.log(createExpandableLog(new_safeShader))
            // console.log("new racy shader: ")
            // console.log(createExpandableLog(new_racyShader));
            // if mismatches do not change, permanently remove statement
            return { safeShader: new_safeShader, racyShader: new_racyShader, mismatches: new_mismatches };
        }
        // if mismatches do change, check for multiline
        else {
            console.log("keeping statement");
            
            // console.log("Shader comparison after revert:", prevSafeShader === safeShader, prevRacyShader === racyShader);

            if (is_multiline) {
                console.log("statement is multiline, attempting to remove children");

                let racy_removables = racy_item;
                let safe_removables = safe_item;

                if (! initial) {

                    console.log("finding if/while/for_statement");
                    let multiline_statement_node = racy_item.node;
                    let multiline_statement_index = 0;
                    for (let i = 0; i < racy_item.node.childCount; i++) {
                        //console.log(racy_item.node.child(i).type);
                        if (["for_statement", "if_statement", "while_statement", "if_clause", "else_clause"].includes(racy_item.node.child(i).type)) {
                            multiline_statement_node = racy_item.node.child(i);
                            multiline_statement_index = i;
                            break;
                        }
                    }
                    console.log("found " + multiline_statement_node.type);


                    
                    let node = multiline_statement_node;
                    let is_if = multiline_statement_node.type === "if_statement";
                    let is_if_clause = multiline_statement_node.type === "if_clause";
                    let is_else_clause = multiline_statement_node.type === "else_clause";
                    // console.log("is if clause " + is_if_clause);
                    // console.log("is else clause " + is_else_clause);

                    let racy_node = node;
                    let safe_node = safe_item.node.child(multiline_statement_index);

                    console.log('initial racy and safe node types: ')
                    console.log(racy_node.type)
                    console.log(safe_node.type);

                    if (! is_if) {
                        
                        console.log("finding compound_statement inside while/for_statement or if/else_clause");
                    
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

                        if (is_else_clause || is_if_clause) {
                            console.log("here");
                            racy_node = node.child(index);
                            safe_node = safe_item.node.child(index);
                            //safe_node = safe_node.child(index);
                            console.log("racy node " + racy_node.type)
                            console.log("safe node " + safe_node.type)
                        }
                        else {
                            racy_node = node.child(index);
                            safe_node = safe_item.node.child(multiline_statement_index);
                            safe_node = safe_node.child(index);
                            console.log("racy node " + racy_node.type)
                            console.log("safe node " + safe_node.type)
                        }
                        
                        

                    }
                    

                    // try removing child statements, same logic as outer loop where you find statements that you can remove
                    racy_removables = removable_statements(racy_node, 0, racy_node.childCount)
                    // console.log("recursive racy removables ", racy_removables);
                    safe_removables = removable_statements(safe_node, 0, safe_node.childCount)
                    // console.log("recursive safe removables ", safe_removables)

                }
                
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
                
                
                for (let racy_item2 of racy_removables) {

                    let safe_child = safe_removables.find(safeItem => statementsMatch(racy_item2, safeItem)) || null;
                    // console.log("safe child: ", safe_child);
                    
                    let result = await try_remove(racy_item2, safe_child, ["for_statement", "if_statement", "while_statement", "if", "else"].includes(racy_item2.node.child(0).type), safeShader, racyShader, mismatches, shaderInfo, parser, mismatchMode, specificMismatches);
                    safeShader = result.safeShader;
                    racyShader = result.racyShader;
                    mismatches = result.mismatches;
                }

            }

            console.log("done trying to remove kids");
        }
        

        return {safeShader, racyShader, mismatches};
    }
        
    // only exists in racy
    else {
        console.log("attempting to remove from racy only")

        let can_remove = true;

        if (! initial ) {
            // cannot remove full block if it's an if with an else block still there
            let node = racy_item.node;
            let after_if = racyShader.slice(node.endIndex)
            
            if (node.type === "if_clause" && after_if.trim().slice(0,4) === "else") {
                can_remove = false;
                console.log("cannot remove if_clause since it has associated else_clause")
            }
        }

        let keep_same = false;
        let keep_any = false;
        let keep_specific = false;

        let all_new_mismatches = [];
        let new_mismatches = [];

        let new_racyShader = null;

        if (can_remove) {
        
            // remove from racy
            new_racyShader = await remove(racy_item, racyShader);
            console.log("created new ast and shader to see if mismatches changed");

            // check mismatches
            all_new_mismatches = await getMismatches(safeShader, new_racyShader, shaderInfo);
            console.log("all mismatches: ", all_new_mismatches)

            // fatal error
            if (all_new_mismatches === null) {

                console.log("latest safe shader:")
                console.log(createExpandableLog(safeShader))
                console.log("latest racy shader:")
                console.log(createExpandableLog(racyShader))

                window.alert(`
                Failed to create WebGPU Context Provider. This error is unrecoverable.
                    1) Save the current shaders-- available in console.log
                    2) Quit Chrome fully (close all tabs and windows)
                    3) Restart Chrome, paste in currrent shaders, and continue reducing.`)
                
                throw new Error("Fatal");

            }

            // console.log("old mismatches were: ", mismatches);
            
            // check modes
            // if mode is to keep same mismatches-- ensure removing a statement doesn't change the mismatches
            // make sure every run has the same mismatches
            keep_same = (mismatchMode === 0 && all_new_mismatches.every(new_mismatches =>
                JSON.stringify(mismatches, null, 2) === JSON.stringify(new_mismatches, null, 2))
            );
            // if mode is keep any mismatches -- ensure removing a statement doesn't get rid of all mismatches
            // if any runs were empty, return false
            keep_any = (mismatchMode === 1 && all_new_mismatches.every(arr => arr.length > 0))
            // make sure you still have specific mismatches according to user
            // make sure each run had those specific mismatches
            keep_specific = (mismatchMode === 2 && all_new_mismatches.every(new_mismatches =>
                matchesSpecificMismatches(new_mismatches, specificMismatches))
            );
            console.log(`keep same = ${keep_same}, keep_any = ${keep_any}, keep_specific = ${keep_specific}`); 

        }

        if (keep_same || keep_any || keep_specific) {
        // if (false) {
            // if mismatches do not change, permanently remove statement
            console.log("permanently removed statement");
            // console.log("new racy shader: ")
            // console.log(createExpandableLog(new_racyShader));
            return { safeShader, racyShader: new_racyShader, mismatches: new_mismatches };
        }
        // if mismatches do change, revert- pretend you never did anything 
        else {
            console.log("keeping statement");

            // unless multiline
            if (is_multiline) {
                console.log("statement is multiline, attempting to remove children");
                // try removing child statements

                let racy_removables = racy_item;

                if (! initial) {
                    console.log("finding if/while/for_statement");
                    let multiline_statement_node = racy_item.node;
                    let multiline_statement_index = 0;
                    for (let i = 0; i < racy_item.node.childCount; i++) {
                        //console.log(racy_item.node.child(i).type);
                        if (["for_statement", "if_statement", "while_statement", "if_clause", "else_clause"].includes(racy_item.node.child(i).type)) {
                            multiline_statement_node = racy_item.node.child(i);
                            multiline_statement_index = i;
                            break;
                        }
                    }
                    console.log("found " + multiline_statement_node.type);
                    
                    let node = multiline_statement_node;
                    // if statements seem to have one extra layer of depth for some reason
                    // we also need to do two recursive paths if there is an else
                    let is_if = multiline_statement_node.type === "if_statement";
                    let is_if_clause = multiline_statement_node.type === "if_clause";
                    let is_else_clause = multiline_statement_node.type === "else_clause";
                    
                    
                    if (! is_if) {
                        console.log("finding compound_statement inside while/for_statement or if/else_clause");
                    
                        console.log("node type " + node.type);
                        let index = 0;
                        for (let i = 0; i < node.childCount; i++) {
                            // console.log(node.child(i).type);
                            if (node.child(i).type === "compound_statement") {
                                index = i;
                                break;
                            }
                        }
                        console.log("found compound_statement inside multiline");
                        console.log(node.child(index).type);

                        node = node.child(index);

                    }

                    racy_removables = removable_statements(node, 0, node.childCount);
                }


                //console.log("racy removables of multiline " + JSON.stringify(racy_removables, null, 2))
                for (let racy_item2 of racy_removables) {
                    // if the whole block wasn't in safe, neither will the child statements tbh
                    // when iterating through child statements, need to ensure we are checking the correct level
                    // console.log("child type: " + racy_item2.node.child(0).type);
                    // console.log("child text: " + racy_item2.node.child(0).text);
                    // console.log(["for_statement", "if_statement", "while_statement"].includes(racy_item2.node.child(0).type));
                    let result = await try_remove(racy_item2, null, ["for_statement", "if_statement", "while_statement", "if", "else"].includes(racy_item2.node.child(0).type), safeShader, racyShader, mismatches, shaderInfo, parser, mismatchMode, specificMismatches);
                    safeShader = result.safeShader;
                    racyShader = result.racyShader;
                    mismatches = result.mismatches;

                }

                console.log("done trying to remove kids");
            }
            return {safeShader, racyShader, mismatches};
        }
    }

    
}

const batchConsecutiveObjects = (racyArray, safeArray) => {
    let result = [];
    let tempGroup = [];
    let prevWasSafe = false;

    for (let i = 0; i < racyArray.length; i++) {
        let item = racyArray[i];

        // Find matching item in safeArray
        let safeIndex = safeArray.findIndex(safeItem => statementsMatch(item, safeItem));
        let isSafe = safeIndex !== -1;

        if (isSafe) {
            if (!prevWasSafe && tempGroup.length) {
                result.push(tempGroup);
                tempGroup = [];
            }
            prevWasSafe = true;
        } else if (prevWasSafe && tempGroup.length) {
            result.push(tempGroup);
            tempGroup = [];
            prevWasSafe = false;
        }

        tempGroup.push(item);
    }

    if (tempGroup.length) {
        result.push(tempGroup);
    }

    // Create a paired structure of [racyGroup, safeGroup] and remove matched items from both arrays
    return result.map(racyGroup => {
        let safeGroup = [];

        for (let racyItem of racyGroup) {
            let safeMatchIndex = safeArray.findIndex(safeItem => statementsMatch(racyItem, safeItem));
            if (safeMatchIndex !== -1) {
                safeGroup.push(safeArray[safeMatchIndex]);
                safeArray.splice(safeMatchIndex, 1); // Remove matched safe item
            }
        }

        return [racyGroup, safeGroup];
    });
};

function batchGroupsByN(groupedArray, n) {
    let mixedGroups = [];
    let racyGroups = [];

    // Separate mixed and racy-only groups
    for (let group of groupedArray) {
        let [racyPart, safePart] = group;
        if (safePart.length > 0) {
            mixedGroups.push(group);
        } else {
            racyGroups.push(group);
        }
    }

    // Function to batch groups by n
    function batchGroups(groups, n) {
        let result = [];
        for (let i = 0; i < groups.length; i += n) {
            let batchedRacy = [];
            let batchedSafe = [];

            // Combine `n` groups into one
            for (let j = i; j < i + n && j < groups.length; j++) {
                batchedRacy.push(...groups[j][0]);
                batchedSafe.push(...groups[j][1]);
            }

            result.push([batchedRacy, batchedSafe]);
        }
        return result;
    }

    // Batch mixed and racy-only groups separately
    let batchedMixed = batchGroups(mixedGroups, n);
    let batchedRacy = batchGroups(racyGroups, n);

    // Combine the final result while maintaining order
    let finalResult = [];
    let mixedIndex = 0, racyIndex = 0;

    for (let group of groupedArray) {
        if (group[1].length > 0 && mixedIndex < batchedMixed.length) {
            finalResult.push(batchedMixed[mixedIndex++]);
        } else if (racyIndex < batchedRacy.length) {
            finalResult.push(batchedRacy[racyIndex++]);
        }
    }

    return finalResult.filter(group => group !== undefined); // Remove any remaining undefined values
}

function createExpandableLog(longString, maxLength = 100) {
    return new Proxy({ fullText: longString }, {
        get(target, prop) {
            return prop === "toString"
                ? () => (longString.length > maxLength ? longString.slice(0, maxLength) + "..." : longString)
                : target[prop];
        }
    });
}





const statementsMatch = (racy_item, safe_item) => {
    // check for an exact match
    if (safe_item.text === racy_item.text) {
        // console.log("text matches exactly");
        return true;
    }

    // if not exact match, check headers of clauses
    if (safe_item.type === "if_clause" && racy_item.type === "if_clause") {
        // then get child 1 (expression)
        let racyCondition = racy_item.node.child(1).text;
        let safeCondition = safe_item.node.child(1).text;
        //console.log("racy if condition ", racyCondition);
        //console.log("safe if condition ", safeCondition);
        return racyCondition === safeCondition;
    }
    else if (safe_item.type === "else_clause" && racy_item.type === "else_clause") {
        return true;
    }

    // otherwise, check multilines
    let racyFirstChild = racy_item.node.child(0);
    let safeFirstChild = safe_item.node.child(0);

    // if the first child is a multiline indicator, compare headers instead of full text
    if (["for_statement", "if_statement", "while_statement"].includes(racyFirstChild.type)) {
        if (racyFirstChild.type === "for_statement" && safeFirstChild.type === "for_statement") {
            // compare for-loop headers
            let racyHeader = racyFirstChild.child(2).text;
            let safeHeader = safeFirstChild.child(2).text;
            //console.log("racy for loop header ", racyHeader);
            //console.log("safe for loop header ", safeHeader);
            return racyHeader === safeHeader;
        } 
        else if (racyFirstChild.type === "if_statement" && safeFirstChild.type === "if_statement") {
            // compare if-statement conditions
            // get child 0 (if-clause)
            // then get child 1 (expression)
            let racyCondition = racyFirstChild.child(0).child(1).text;
            let safeCondition = safeFirstChild.child(0).child(1).text;
            //console.log("racy if condition ", racyCondition);
            //console.log("safe if condition ", safeCondition);
            return racyCondition === safeCondition;
        }
        else if (racyFirstChild.type === "while_statement" && safeFirstChild.type === "while_statement") {
            // compare while-loop conditions
            let racyCondition = racyFirstChild.child(1).text;
            let safeCondition = safeFirstChild.child(1).text;
            //console.log("racy while loop condition ", racyCondition);
            //console.log("safe while loop condition ", safeCondition);
            return racyCondition === safeCondition;
        }
    }

    // console.log("no match");
    return false; // No match found
};


const getMismatches = async (safeShader, racyShader, shaderInfo, retries = 3, delay = 1000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`Attempt ${attempt} to run shaders...`);

            console.log(shaderInfo);

            console.log("latest safe shader:")
            console.log(createExpandableLog(safeShader))
            console.log("latest racy shader:")
            console.log(createExpandableLog(racyShader))

            let outputs1 = [];
            let outputs2 = [];

            let results = [];

            for (let i = 0; i < retries; i++) {
                outputs1 = await run_shader(safeShader, shaderInfo, init);
                console.log("ran shader 1 successfully");
                // init = await run_init(shaderInfo);
                outputs2 = await run_shader(racyShader, shaderInfo, init);
                console.log("ran shader 2 successfully");

                let safeArray = outputs1[0] || [];
                let raceArray = outputs2[0] || [];

                console.log("debug safe: ", outputs1[5])
                console.log("debug racy: ", outputs2[5])

                // console.log(safeArray);
                // console.log(raceArray);
                

                let data_race_info = {
                    safe: shaderInfo.safe || [],
                    safe_constants: shaderInfo.safe_constants || [],
                    constant_locs: shaderInfo.constant_locs || 0,
                };

                results.push(analyze(safeArray, raceArray, shaderInfo, data_race_info, 1));
                console.log(`get mismatches run ${i} returns: ${results[i]}`);

            }


            return results;

        } catch (error) {
            console.error(`Error running shaders (attempt ${attempt}):`, error);

            if (error.message.includes("init is not iterable")) {

                return null;
                
            }

            // If AbortError occurs, retry after a short delay
            if (error.name === "AbortError" && attempt < retries) {
                console.log(`Retrying in ${delay}ms...`);
                await new Promise(res => setTimeout(res, delay)); // Wait before retrying
                init = await run_init(shaderInfo);
            } else {
                console.log("Max retries reached or error not recoverable.");
                return null; // Final failure
            }
        }
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
            
    // let end_text = `dummy`;
    let end_text = `debug`;
      
    // no need to start from the beginning- for efficiency, can start searching after start_index
    for (let i = start_index + 1; i < compound_statement.childCount; i++) {
        let end = compound_statement.child(i);
    
        if (end.text.includes(end_text)) {
            return [i, end];
        }
    }
}
      
// remove a line or block represented by node from the shader and regenerate the tree
const remove = async (block, code, retries = 3, delay = 1000) => {

    let start = null;
    let end = null;

    if (Array.isArray(block)) {
        end = block[0].node.endIndex;
        start = block[block.length-1].node.startIndex;
        // console.log("start index array: ", start)
        // console.log("end index array ", end)
    }
    else {
        start = block.node.startIndex;
        end = block.node.endIndex;
    }
    
    console.log(`Attempting to remove: ${code.slice(start, end)}`);

    // // get byte positions of the text-- these correspond to the start and end of text to remove from the shader
    // let start = node.startIndex; // Byte offset start
    // let end = node.endIndex;     // Byte offset end
    // let startPos = node.startPosition; // Row/column start
    // let endPos = node.endPosition;     // Row/column end
    // //console.log(start, end, startPos, endPos);
    
    // remove from source code
    // let reduced_code = code.slice(0, start) + code.slice(end);
    //let reduced_code = fastBufferRemove(code, start, end);
    
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

    // let reduced_tree = parser.parse(reduced_code);
    // return [reduced_tree, reduced_code];

    //return reduced_code;
    return code.substring(0, start) + code.substring(end);


    // for (let attempt = 1; attempt <= retries; attempt++) {
    //     try {
    //         console.log(`Attempt ${attempt} to parse new shader...`);

    //         let reduced_tree = parser.parse(reduced_code);
    //         return [reduced_tree, reduced_code];

    //     } catch (error) {
    //         console.error(`Error parsing shaders (attempt ${attempt}):`, error);

    //         // If AbortError occurs, retry after a short delay
    //         if (error.name === "RuntimeError" && attempt < retries) {
    //             console.log(`Retrying in ${delay}ms...`);
    //             await new Promise(res => setTimeout(res, delay)); // Wait before retrying
    //         } else {
    //             console.log("Max retries reached or error not recoverable.");
    //             return null; // Final failure
    //         }
    //     }
    // }
     
}

const fastBufferRemove = (code, start, end) => {
    let encoder = new TextEncoder();
    let decoder = new TextDecoder();

    let bytes = encoder.encode(code);
    let newBytes = new Uint8Array(bytes.length - (end - start));

    newBytes.set(bytes.subarray(0, start), 0);
    newBytes.set(bytes.subarray(end), start);

    return decoder.decode(newBytes);
};

const removable_statements = (compound_statement, start_index, end_index) => {
    let statements = [];
    
    // in the case of multilines, the first child of a compound statement is {} so it's ok that we only go up to startIndex
    
    let node = null;
    // start from end, so that first statements removed end up being from the end
    for (let i = end_index - 1; i >= start_index; i--) {
        // console.log("text " + compound_statement.child(i).text);
        // console.log("type " + compound_statement.child(i).type);
        // this check is included for the case in which we are finding statements inside multilines
        node = compound_statement.child(i);
        let type = node.type;
        if (type === "statement" || type === "if_clause" || type === "else_clause") {
            statements.push({
                index: i,
                text: node.text,
                type: node.type,
                node: node
            });
        }
    }
    return statements;
}

// helper function to compare with specific mismatches
const matchesSpecificMismatches = (currentMismatches, specificMismatches) => {
    if (!specificMismatches) return false;
  
    // Ensure every specific mismatch is found in the current mismatches
    return specificMismatches.every((specific) => 
      currentMismatches.some((current) =>
        // current.rep === specific.rep &&
        // current.thread === specific.thread &&
        // current.index === specific.index &&
        current.expected === specific.expected &&
        current.actual === specific.actual
      )
    );
  };
  

//  need next build and next export to export site
// outputes[0] fix 
// npm run build working (remove tree-sitter dependency
// creates an out folder
// zip it, ignore node_modules


// ssh gpuharbor@gpuharbor.soe.ucsc.edu
// put files inside race-reducer

// ssh neabbas@gateway.soe.ucsc.edu
