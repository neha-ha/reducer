const Parser = require('tree-sitter');
const WGSL = require('../lib/tree_sitter_wgsl_binding.node');

const parser = new Parser();
parser.setLanguage(WGSL);

module.exports = {
    parseWGSL: (sourceCode) => parser.parse(sourceCode),
};
