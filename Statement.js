var Statement = require('l/Statement');
class Send extends Statement {
	constructor(message, receiver) {
		super('send');
		this.message = message;
		this.receiver = receiver;
	}
}
Statement.Send = Send;
module.exports = Statement;
