import Parser from 'tree-sitter';
import path from 'path';

export async function POST(req) {
    if (typeof window !== 'undefined') {
        return new Response('This API is server-side only', { status: 400 });
    }

    try {
        const WGSL = require(path.resolve('lib/tree_sitter_wgsl_binding.node'));
        const body = await req.json();

        const parser = new Parser();
        parser.setLanguage(WGSL);

        const tree = parser.parse(body.code);
        return new Response(JSON.stringify({ tree: tree.rootNode.toString() }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        console.error('Error:', err);
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
