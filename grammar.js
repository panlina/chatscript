var fs = require('fs');
var path = require('path');
var ohm = require('ohm-js');
var grammar = ohm.grammar(fs.readFileSync(path.join(__dirname, 'chatscript.ohm'), 'utf8'), { l: require('l/grammar') });
module.exports = grammar;
