"use client";

import { useState } from "react";
const Parser = require('web-tree-sitter');
// Parser.init().then(() => { /* the library is ready */ });
// import Parser from "web-tree-sitter";


export default function Home() {
    const [wgslCode, setWgslCode] = useState<string>(""); // State for WGSL code
    const [ast, setAst] = useState<string>("");          // State for AST
    const [loading, setLoading] = useState<boolean>(false); // State for loading UI

    async function initializeParser() {
        await Parser.init({
            locateFile(scriptName: "tree-sitter.wasm", scriptDirectory: 'tree-sitter.wasm') {
            return scriptName;
            },
        });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!wgslCode.trim()) return;

        setLoading(true);
        setAst(""); // Clear previous AST

        try {
            await initializeParser();
            const parser = new Parser;
            const WGSL = await Parser.Language.load('tree-sitter-wgsl.wasm');
            parser.setLanguage(WGSL);

            console.log("parser created properly");
        } catch (error) {
            console.error(error);
            setAst(`Error: ${(error as Error).message}`); // Handle exceptions
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>WGSL AST Parser</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={wgslCode}
                    onChange={(e) => setWgslCode(e.target.value)}
                    placeholder="Paste your WGSL code here"
                    rows={10}
                    style={{ width: "100%", marginBottom: "10px" }}
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Parsing..." : "Generate AST"}
                </button>
            </form>

            {ast && (
                <div>
                    <h2>Generated AST:</h2>
                    <textarea
                        value={ast}
                        readOnly
                        rows={10}
                        style={{ width: "100%", marginTop: "10px" }}
                    />
                </div>
            )}
        </div>
    );
}


