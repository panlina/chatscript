/** @typedef {import('l/Expression')} Expression */
/** @typedef {import('./Statement')} Statement */
class EventHandler {
	/**
	 * @param {string} type
	 * @param {Expression} argument
	 * @param {Statement} statement
	 */
	constructor(type, argument, statement) {
		/** @type {string} */
		this.type = type;
		/** @type {Expression} */
		this.argument = argument;
		/** @type {Statement} */
		this.statement = statement;
	}
}
module.exports = EventHandler;
