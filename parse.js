var grammar = require('./grammar');
var semantics = require('./semantics');
var ParseError = require('l/ParseError');
/** @typedef {import('./Program').default} Program */
/**
 * @param {string} text
 * @param {string} [startRule]
 * @returns {Program}
 */
module.exports = (text, startRule) => {
	var matchResult = grammar.match(text, startRule);
	if (matchResult.failed()) throw new ParseError(matchResult);
	return semantics(matchResult).parse();
};
