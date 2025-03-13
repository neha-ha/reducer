
// import WebGPUExample from '../components/compute_shader';

// export default function Home() {
//   return (
//     <div>
//       <WebGPUExample />
//     </div>
//   );
// }

// box to paste in json object & use as params instead of textboxes
// one box for RACY shader and the other for SAFE shader, label
// potential shader db functionality-- or paste in json
// run both with one button-- run one right after the other
// then compare results-- code in app/analyze_results.js
// textbox for compared results

// threads running -- each thread has a few memory locations (locs_per_thread)
// within those memry locations, some are safe (only accessed by that thread) and some are racy (can be accessed by other threads)
// if you have htose data races on one memory location can it affect safe memory locations

// data races are similar to race conditions (war, raw, etc) but are not dependent on the code-- they are inherent to programming language
// becasue hardware and compilers can do tricky optimizations

// register-pressure: limited registers, instead of keeping temp variables it'll spill those registers to memory
// see paper for example + more info
// in shaders,  we have so many variables to increase register pressure

// safe shader operates on safe memory locations
// racy = safe with more lines (b line = safe, c = 1 etc top two lines make it racy)

// reduction
// simple reduction
// cutting out lines and cutting out variables



// have giant shaders, don't know why mismatches are occuring, b
// looking at memory locations and following back (reverse program slicing) --> if the issues are compiler based it wouldnt find it & more complex -- parserf or the language

// implement delta debugging algorithm
// not ddmin, just dd
// starrt with naive implementation
// remove one line at a time
// besides var dummy, and output stuff at the bottom of every shader
// start bylooking at racy shader, remove one statement
  // need to parse the language to ensure that its not just } on a line for example
  // potential? parenthesis counting algorithm to account for nested ifs

  // ast -- abstract syntax tree can remove blocks by cutting branches from the tree
  // work on algorithm to parse shaders into asts
  // find library wgsl ast parser
  // see if codyjohnson or whatever library works 
      // parse should give u ast
      // traverse through ast
      
      // remove one from racy, if safe has it remove it too
      // see if mismatches line up== if they still do then the removed statement is not important, remove it fr
      // otherwise keep it
      // fully reducded -- no longer remove anything and get same result


// darton-yan code??


// get ast for both safe and racy 
// traverse at same time
// start from bottom- but ignore dummy statements
// if only in racy shader OR in both remove and see if mismatches chnage
// if mismatches change keep statement
/// start at satemetne lefvel move up form there
// remove blocks entirely, if needed remove statements inside
// 	if (local_invocation_id.x < 2u) {
//  (workgroup_buf)[0u] = 0u;
//} do not remove

// button to reduce in old frontend
// update shaders in boxes as u do
// progress (number of statements removed)



// ok so what we need
// paste in safe and racy
// reduce button
// when pressed, reduce & run mismatches

// for the algorithm:
// 


'use client';

import React, { useState, useEffect } from "react";
import { run_shader, run_init } from "../components/run_shader";
import { analyze } from "../components/analyze_results";
import { reduce } from "../components/reducer.js";
import axios from "axios";

// using wasm 
const Parser = require('web-tree-sitter');


const ShaderRunner = () => {
  const [shader1, setShader1] = useState('');
  const [shader2, setShader2] = useState('');
  // const [shader1, setShader1] = useState(() => localStorage.getItem("safeShader") || '');
  // const [shader2, setShader2] = useState(() => localStorage.getItem("racyShader") || '');
  const [shader1Output, setShader1Output] = useState(null);
  const [shader2Output, setShader2Output] = useState(null);
  const [workgroupSize, setWorkgroupSize] = useState('9');
  const [workgroups, setWorkgroups] = useState('60');
  const [jsonInput, setJsonInput] = useState('');
  const [shaderInfo, setShaderInfo] = useState({
    workgroup_size: workgroupSize,
    workgroups: workgroups,
    locs_per_thread: 1,
    constant_locs: 0,
    uninit_vars: 1,
    race_val_strat: 'Even',
    safe: [], 
    safe_constants: [],
    safe_vars: [],
    data_buf_size: 256,
    pattern_slots: 3,
  });
  // const [shaderInfo, setShaderInfo] = useState(() => localStorage.getItem("safeShader") || {
  //   workgroup_size: workgroupSize,
  //   workgroups: workgroups,
  //   locs_per_thread: 1,
  //   constant_locs: 0,
  //   uninit_vars: 1,
  //   race_val_strat: 'Even',
  //   safe: [], 
  //   safe_constants: [],
  //   safe_vars: [],
  //   data_buf_size: 256,
  //   pattern_slots: 3,
  // });
  const [mismatches, setMismatches] = useState(null);
  const [ast, setAst] = useState('');
  const [reducedSafeShader, setReducedSafeShader] = useState(null);
  const [reducedRacyShader, setReducedRacyShader] = useState(null);
  const [reducedMismatches, setReducedMismatches] = useState(null);
  const [mismatchMode, setMismatchMode] = useState(1);
  const [specificMismatches, setSpecificMismatches] = useState(null);
  // track whether shaders were restored or not
  const [restoredFromStorage, setRestoredFromStorage] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved_shader1 = localStorage.getItem("safeShader")
      const saved_shader2 = localStorage.getItem("racyShader")
      const saved_shaderInfo = localStorage.getItem("shaderInfo")
      setShader1(saved_shader1 || '');
      setShader2(saved_shader2 || '');
      setShaderInfo(JSON.parse(saved_shaderInfo) || {
        workgroup_size: workgroupSize,
        workgroups: workgroups,
        locs_per_thread: 1,
        constant_locs: 0,
        uninit_vars: 1,
        race_val_strat: 'Even',
        safe: [], 
        safe_constants: [],
        safe_vars: [],
        data_buf_size: 256,
        pattern_slots: 3,
      })

      if (saved_shader1 && saved_shader2 && saved_shaderInfo) {
        setRestoredFromStorage(true);
      }
    }
  }, []);

  // auto reduce on reload
  useEffect(() => {
    if (restoredFromStorage && shader1.trim() !== "" && shader2.trim() !== "") {
      console.log("Shaders found in localStorage, auto-reducing...");
      (async () => {
        await reduceWGSL();
        setRestoredFromStorage(false);
      })();
    }
  }, [restoredFromStorage, shader1, shader2]);

  // clear local storage after initializations
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("safeShader");
      localStorage.removeItem("racyShader");
      localStorage.removeItem("shaderInfo");
    }
  }, []);
  

  const runShader = async (shader, setOutput) => {
    try {
      let init = await run_init(shaderInfo);
      const outputs = await run_shader(shader, shaderInfo, init);
      if (!outputs || outputs.length === 0) {
        setOutput('No outputs were generated by the shader.');
        return;
      }
      setOutput(outputs.map((arr) => Array.from(arr).join(', ')).join('\n\n'));
      return;
    } catch (error) {
      console.error('Error running shader:', error);
      setOutput('Error running shader');
    }
  };

  const getMismatches = async () => {
    try {
      let init = await run_init(shaderInfo);
      // console.log(shader1);
      // console.log(shader2);
      const outputs1 = await run_shader(shader1, shaderInfo, init);
      // init = await run_init(shaderInfo);
      const outputs2 = await run_shader(shader2, shaderInfo, init);

      const safeArray = (outputs1[0]) || [];
      const raceArray = (outputs2[0]) || [];

      console.log("safe array ", safeArray);
      console.log("racy array ", raceArray);

      console.log("debug safe: ", outputs1[5])
      console.log("debug racy: ", outputs2[5])

      const data_race_info = {
        safe: shaderInfo.safe || [],
        safe_constants: shaderInfo.safe_constants || [],
        constant_locs: shaderInfo.constant_locs || 0,
      };

      console.log(shaderInfo);

      const result = analyze(safeArray, raceArray, shaderInfo, data_race_info, 1);
      console.log(result);
      return result;

    } catch (error) {
      console.error('Error running shaders or analyzing mismatches:', error);
      return [];
    }
  };

  const handleRunBothAndAnalyze = async() => {
    const result = await getMismatches();
    setMismatches(JSON.stringify(result, null, 2));
  }

  const handleJsonInputChange = (e) => {
    try {
      const parsedJson = JSON.parse(e.target.value);
      setShaderInfo((prev) => ({ ...prev, ...parsedJson }));
      setJsonInput(e.target.value);

      const newState = { ...shaderInfo, ...parsedJson };
      console.log("New shaderInfo:", newState);
      setShaderInfo(newState);
    } catch (error) {
      console.error('Invalid JSON:', error);
    }
  };

  const parseSpecificMismatches = (input) => {
    if (!input) return null; // Handle empty or null input
  
    try {
      const trimmedInput = input.trim();
  
      if (trimmedInput.startsWith('{') && trimmedInput.endsWith('}')) {
        return [JSON.parse(trimmedInput)];
      }
  
      const objects = trimmedInput.split(/\}\s*,\s*\{/).map((obj, index, arr) => {
        if (index === 0) obj = obj + '}';
        else if (index === arr.length - 1) obj = '{' + obj;
        else obj = '{' + obj + '}';
  
        return JSON.parse(obj);
      });
  
      return objects;
    } catch (error) {
      console.error('Invalid JSON format:', error);
      return null;
    }
  };
  
  // // Example usage with null check
  // const handleMismatchInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   const input = e.target.value;
  //   const parsed = input ? parseSpecificMismatches(input) : null;
  
  //   if (parsed) {
  //     console.log(parsed);
  //   } else {
  //     console.error('Invalid input');
  //   }
  // };
  
  

  // const reduceWGSL = async () => {
  //   let [safeShader, racyShader, safeAST, racyAST, new_mismatches] = await reduce(shader1, shader2, shaderInfo);
    
  //   console.log("new safe shader "+ safeShader);
  //   console.log("new racy shader "+ racyShader);

  //   // set reduced outputs
  //   setReducedSafeShader(safeShader);
  //   setReducedRacyShader(racyShader);
  //   setReducedMismatches(JSON.stringify(new_mismatches, null, 2));
  // };

  const reduceWGSL = async () => {
    let spec_mismatches = parseSpecificMismatches(specificMismatches);
    console.log("specific mismatches ", spec_mismatches)

    console.log("mismatch mode: ", mismatchMode);

    let [safeShader, racyShader, new_mismatches] = await reduce(shader1, shader2, shaderInfo, mismatchMode, spec_mismatches);

    // let i = 0;
    // if (new_mismatches.length > 1 && i < 3) {
    //   localStorage.setItem("safeShader", safeShader);
    //   localStorage.setItem("racyShader", racyShader);
    //   localStorage.setItem("shaderInfo", JSON.stringify(shaderInfo));

    //   i += 1;

    //   // ✅ Reload the page to reset WebGPU
    //   window.location.reload();
    
    // }
    
    // while (new_mismatches.length > 1) {
    //   [safeShader, racyShader, new_mismatches] = reduce(safeShader, racyShader, shaderInfo, mismatchMode, spec_mismatches);
    //   console.log("final mismatches: ", JSON.stringify(mismatches, null, 2))
      
    //   await scheduler.yield();
    //   await new Promise(res => setTimeout(res, 0));
    // }

    // console.log("new safe shader:", safeShader);
    // console.log("new racy shader:", racyShader);
    console.log("page tsx new mismatches: ", new_mismatches);
    console.log("page tsx new mismatches: ", JSON.stringify(new_mismatches, null, 2));

    if (!safeShader || !racyShader) {
      console.log("safeShader or racyShader is null!");
    }

    // set reduced outputs
    setReducedSafeShader(safeShader);
    setReducedRacyShader(racyShader);
    setReducedMismatches(JSON.stringify(new_mismatches, null, 2));
    // setReducedMismatches(new_mismatches);
  };
  

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Shader Runner</h1>
      <div style={styles.mainRow}>
        {/* Left Configuration Panel */}
        <div style={styles.configContainer}>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="workgroups">Workgroups:</label>
            <textarea
              id="workgroups"
              style={styles.thinTextArea}
              value={workgroups}
              onChange={(e) => setWorkgroups(e.target.value)}
              placeholder="Enter workgroups"
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="workgroupSize">Workgroup Size:</label>
            <textarea
              id="workgroupSize"
              style={styles.thinTextArea}
              value={workgroupSize}
              onChange={(e) => setWorkgroupSize(e.target.value)}
              placeholder="Enter workgroup size"
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="jsonObject">JSON Object:</label>
            <textarea
              id="jsonObject"
              style={styles.largeTextAreaWrapText}
              value={jsonInput}
              onChange={handleJsonInputChange}
              placeholder="Paste JSON here"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="mismatchMode">Mismatch Mode:</label>
            <select
              id="mismatchMode"
              style={styles.thinTextArea}
              value={mismatchMode}
              onChange={(e) => setMismatchMode(Number(e.target.value))}
            >
              <option value={0}>Keep Same Mismatches</option>
              <option value={1}>Keep Any Mismatches</option>
              <option value={2}>Keep Specific Mismatches</option>
            </select>
          </div>

          {mismatchMode === 2 && (
            <div style={styles.inputGroup}>
              <label style={styles.label} htmlFor="specificMismatches">Paste Specific Mismatches:</label>
              <textarea
                id="specificMismatches"
                style={styles.largeTextAreaWrapText}
                value={specificMismatches || ""}
                onChange={(e) => setSpecificMismatches(e.target.value)}
                placeholder="Paste specific mismatches as a sequence of JSON objects not in []..."
              />
            </div>
          )}
        </div>

        {/* Right Shader Panel */}
        <div style={styles.shaderPanel}>
          <div style={styles.row}>
            <div style={styles.column}>
              <h2 style={styles.subTitle}>Safe Shader</h2>
              <textarea
                style={styles.largeTextArea}
                value={shader1}
                onChange={(e) => setShader1(e.target.value)}
                placeholder="Paste WGSL shader code here"
              />
              <button style={styles.greenButton} onClick={() => runShader(shader1, setShader1Output)}>
                Run Safe Shader
              </button>
              <div style={styles.output}>
                <pre style={styles.code}>{shader1Output || 'Safe Shader Output will appear here...'}</pre>
              </div>
            </div>

            <div style={styles.column}>
              <h2 style={styles.subTitle}>Racy Shader</h2>
              <textarea
                style={styles.largeTextArea}
                value={shader2}
                onChange={(e) => setShader2(e.target.value)}
                placeholder="Paste WGSL shader code here"
              />
              <button style={styles.greenButton} onClick={() => runShader(shader2, setShader2Output)}>
                Run Racy Shader
              </button>
              <div style={styles.output}>
                <pre style={styles.code}>{shader2Output || 'Racy Shader Output will appear here...'}</pre>
              </div>
            </div>
          </div>

          <br />
          <div style={{ ...styles.analyzeSection, ...styles.column }}>
            <button style={{ ...styles.greenButton, ...styles.wideButton }} onClick={handleRunBothAndAnalyze}>
              Analyze Mismatches
            </button>
            
            <div style={styles.output}>
              <pre style={styles.code}>{mismatches || 'Run Analyze to see mismatches...'}</pre>
            </div>
          </div>   
           
          <br />
          <div style={{ ...styles.analyzeSection, ...styles.column }}>
            <button style={{ ...styles.greenButton, ...styles.wideButton }} onClick={reduceWGSL}>
              Generate AST and Reduce
            </button>

            {/* <div style={styles.output}>
              <pre style={styles.code}>{ast || 'Generate AST...'}</pre>
            </div> */}

          </div>   

          <br />

          
          <div style={styles.row}>
            <div style={styles.column}>
              <h2 style={styles.subTitle}>Reduced Safe Shader</h2>
              <textarea
                style={styles.largeTextAreaWrapText}
                value={reducedSafeShader || ""}
                readOnly
                placeholder="Reduced Safe Shader Output..."
              />
            </div>

            <div style={styles.column}>
              <h2 style={styles.subTitle}>Reduced Racy Shader</h2>
              <textarea
                style={styles.largeTextAreaWrapText}
                value={reducedRacyShader || ""}
                readOnly
                placeholder="Reduced Racy Shader Output..."
              />
            </div>

          </div>
          

          {/* Mismatches Output */}
          <div style={{ ...styles.analyzeSection, ...styles.column }}>
            <div style={styles.output}>
              <pre style={styles.code}>{reducedMismatches || 'Mismatches after reduction...'}</pre>
            </div>
          </div>
          <br />
          <br />
          <br />
          
        </div>
      </div>
    </div>
  );
  };

  const styles = {
  container: {
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflowX: 'auto',
    overflowY: 'auto',
  },
  title: {
    fontSize: '36px',
    textAlign: 'center',
    color: '#000',
    marginBottom: '20px',
  },
  mainRow: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    gap: '20px',
  },
  configContainer: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    minWidth: '250px',
  },
  shaderPanel: {
    flex: '2',
    display: 'flex',
    flexDirection: 'column',
    padding: '10px 20px',
    boxSizing: 'border-box',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    width: '100%',
  },
  column: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '10px 20px',
    boxSizing: 'border-box',
  },
  subTitle: {
    fontSize: '18px',
    color: '#000',
    marginBottom: '10px',
  },
  largeTextArea: {
    width: '100%',
    height: '300px',
    borderRadius: '8px',
    border: 'none',
    padding: '10px',
    fontFamily: 'monospace',
    fontSize: '14px',
    backgroundColor: '#f0f0f0',
    color: '#333',
    resize: 'vertical',
    overflowY: 'auto',
    overflowX: 'auto',
    maxWidth: '600px',
    whiteSpace: 'pre', // prevents long lines from wrapping
  },
  largeTextAreaWrapText: {
    width: '100%',
    height: '300px',
    borderRadius: '8px',
    border: 'none',
    padding: '10px',
    fontFamily: 'monospace',
    fontSize: '14px',
    backgroundColor: '#f0f0f0',
    color: '#333',
    resize: 'vertical',
    overflowY: 'auto',
    overflowX: 'auto',
    maxWidth: '600px',
  },
  thinTextArea: {
    width: '100%',
    height: '37px',
    borderRadius: '8px',
    border: 'none',
    padding: '10px',
    fontFamily: 'monospace',
    fontSize: '14px',
    backgroundColor: '#f0f0f0',
    color: '#333',
    resize: 'none',
  },
  greenButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s',
  },
  wideButton: {
    width: '100%',
    padding: '10px',
    boxSizing: 'border-box',
  },
  output: {
    marginTop: '20px',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    padding: '10px',
    overflow: 'auto',
    maxHeight: '300px',
    width: '100%',
    boxSizing: 'border-box',
  },
  code: {
    fontFamily: 'monospace',
    fontSize: '14px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    color: '#333',
  },
  analyzeSection: {
    flex: '2',
    display: 'flex',
    flexDirection: 'column',
    padding: '10px 20px',
    boxSizing: 'border-box',
  },
  label: {
    fontSize: '14px',
    marginBottom: '5px',
    color: '#000',
  },
  };

export default ShaderRunner;