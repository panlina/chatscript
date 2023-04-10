/** @typedef {import('l/Expression')} Expression */
var Statement = require('l/Statement');
class Send extends Statement {
	constructor(message, receiver) {
		super('send');
		/** @type {Expression} */
		this.message = message;
		/** @type {Expression} */
		this.receiver = receiver;
	}
}
Statement.Send = Send;
module.exports = Statement;
