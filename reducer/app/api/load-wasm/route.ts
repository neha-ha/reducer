import fs from "fs";
import path from "path";

export async function GET() {
  const wasmPath = path.join(process.cwd(), "public/tree-sitter-wgsl.wasm");
  const wasm = await fs.promises.readFile(wasmPath);
  return new Response(wasm, {
    headers: { "Content-Type": "application/wasm" },
  });
}
