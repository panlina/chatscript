var grammar = require('./grammar');
var semantics = require('./semantics');
var ParseError = require('l/ParseError');
module.exports = (text, startRule) => {
	var matchResult = grammar.match(text, startRule);
	if (matchResult.failed()) throw new ParseError(matchResult);
	return semantics(matchResult).parse();
};
