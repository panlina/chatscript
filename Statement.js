/** @typedef {import('l/Expression')} Expression */
var Statement = require('l/Statement');
class Receive extends Statement {
	constructor(message, sender) {
		super('receive');
		/** @type {Expression} */
		this.message = message;
		/** @type {Expression} */
		this.sender = sender;
	}
}
class Send extends Statement {
	constructor(message, receiver) {
		super('send');
		/** @type {Expression} */
		this.message = message;
		/** @type {Expression} */
		this.receiver = receiver;
	}
}
Statement.Receive = Receive;
Statement.Send = Send;
module.exports = Statement;
