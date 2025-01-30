// import { useState, useEffect } from "react";

// const WGSLParser = () => {
//   const [wgslCode, setWgslCode] = useState(""); // Stores WGSL code input
//   const [ast, setAst] = useState(null); // Stores the generated AST
//   const [wasmInstance, setWasmInstance] = useState(null); // Stores the WASM instance

//   useEffect(() => {
//     const fetchWasm = async () => {
//       const response = await fetch("/api/load-wasm");
//       const wasmBinary = await response.arrayBuffer();

//       const wasmModule = await WebAssembly.instantiate(wasmBinary);
//       const { instance } = wasmModule;

//       setWasmInstance(instance); // Store the WASM instance for later use
//     };

//     fetchWasm().catch(console.error);
//   }, []);

//   const handleParse = () => {
//     if (wasmInstance && wgslCode) {
//       try {
//         const generatedAst = wasmInstance.exports.parseWGSL(wgslCode);
//         setAst(generatedAst);
//       } catch (error) {
//         console.error("Error parsing WGSL:", error);
//         setAst(null);
//       }
//     } else {
//       console.warn("WASM instance or WGSL code is missing.");
//     }
//   };

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
//       {/* WGSL Input Textbox */}
//       <textarea
//         placeholder="Paste WGSL code here"
//         value={wgslCode}
//         onChange={(e) => setWgslCode(e.target.value)}
//         style={{ width: "100%", height: "150px" }}
//       />

//       {/* Parse Button */}
//       <button onClick={handleParse} style={{ padding: "10px 15px" }}>
//         Parse WGSL Code
//       </button>

//       {/* AST Output Textbox */}
//       <textarea
//         placeholder="Generated AST"
//         value={ast ? JSON.stringify(ast, null, 2) : ""}
//         readOnly
//         style={{
//           width: "100%",
//           height: "300px",
//           color: "#333",
//         }}
//       />
//     </div>
//   );
// };

// export default WGSLParser;


// import { useState, useEffect } from "react";

// const WGSLParser = () => {
//   const [wasmInstance, setWasmInstance] = useState(null); // Store the WASM instance
//   const [wgslCode, setWgslCode] = useState(""); // User input WGSL code
//   const [ast, setAst] = useState(null); // Generated AST

//   useEffect(() => {
//     const loadWasm = async () => {
//       try {
//         const response = await fetch("/api/load-wasm"); // Update this path if needed
//         const wasmBinary = await response.arrayBuffer();
        
//         // Pass an empty imports object if the WASM module does not have dependencies
//         const wasmModule = await WebAssembly.instantiate(wasmBinary, {}); 
        
//         setWasmInstance(wasmModule.instance); // Set the WASM instance
//       } catch (error) {
//         console.error("Failed to load WASM:", error);
//       }
//     };
  
//     loadWasm();
//   }, []);
  

//   const handleParse = () => {
//     if (!wasmInstance) {
//       console.error("WASM instance not initialized.");
//       return;
//     }

//     if (!wgslCode.trim()) {
//       console.error("WGSL code is empty.");
//       return;
//     }

//     try {
//       // Assuming `parseWGSL` is the WASM export for parsing WGSL code
//       const generatedAst = wasmInstance.exports.parseWGSL(wgslCode); 
//       setAst(generatedAst);
//     } catch (error) {
//       console.error("Failed to parse WGSL:", error);
//     }
//   };

//   return (
//     <div>
//       <textarea
//         placeholder="Paste WGSL code here"
//         value={wgslCode}
//         onChange={(e) => setWgslCode(e.target.value)} // Update WGSL code state
//         style={{ width: "100%", height: "150px", marginBottom: "10px" }}
//       />
//       <button onClick={handleParse} style={{ marginBottom: "10px" }}>
//         Parse WGSL to AST
//       </button>
//       <textarea
//         placeholder="Generated AST will appear here"
//         value={ast ? JSON.stringify(ast, null, 2) : ""}
//         readOnly
//         style={{ width: "100%", height: "150px", background: "#f4f4f4" }}
//       />
//     </div>
//   );
// };

// export default WGSLParser;



// Failed to load WASM: TypeError: WebAssembly.instantiate(): Import #0 "env": module is not an object or function
//     at captureStackTrace (capture-stack-trace.js:13:23)
//     at console.error (intercept-console-error.js:51:62)
//     at WGSLParser.useEffect.loadWasm (C:\Users\nehab\webgpu\compute_shader_test\components\wgsl_parser.js:158:17)

// need to inspect required imports in WebAssembly.instantiate()

import { useState, useEffect } from "react";

const WGSLParser = () => {
  const [wgslCode, setWgslCode] = useState(""); // WGSL code input
  const [ast, setAst] = useState(""); // AST output
  const [wasmInstance, setWasmInstance] = useState(null); // WASM instance
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    const loadWasm = async () => {
      try {
        const response = await fetch("/api/load-wasm"); // Fetch WASM file
        const wasmBinary = await response.arrayBuffer();

        const wasmModule = await WebAssembly.instantiate(wasmBinary, {}); // Empty imports
        setWasmInstance(wasmModule.instance); // Set the WASM instance
        setIsLoading(false); // Set loading to false
      } catch (error) {
        console.error("Failed to load WASM:", error);
      }
    };

    loadWasm();
  }, []);

  const handleParse = () => {
    if (!wasmInstance) {
      console.error("WASM instance not initialized.");
      return;
    }

    try {
      // Assuming the WASM module exports a `parseWGSL` function
      const parseWGSL = wasmInstance.exports.parseWGSL;
      if (typeof parseWGSL !== "function") {
        throw new Error("parseWGSL function not found in WASM exports.");
      }

      const generatedAst = parseWGSL(wgslCode); // Pass WGSL code
      setAst(generatedAst); // Set the AST
    } catch (error) {
      console.error("Error parsing WGSL:", error);
    }
  };

  return (
    <div>
      <textarea
        placeholder="Paste WGSL code here"
        value={wgslCode}
        onChange={(e) => setWgslCode(e.target.value)}
        style={{ width: "100%", height: "100px", marginBottom: "10px" }}
      />
      <button onClick={handleParse} disabled={isLoading}>
        {isLoading ? "Loading WASM..." : "Parse WGSL"}
      </button>
      <textarea
        placeholder="Generated AST will appear here"
        value={ast}
        readOnly
        style={{ width: "100%", height: "200px", marginTop: "10px" }}
      />
    </div>
  );
};

export default WGSLParser;
