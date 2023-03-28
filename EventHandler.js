class EventHandler { }
class Receive extends EventHandler {
	constructor(message, statement) {
		super();
		this.message = message;
		this.statement = statement;
	}
}
module.exports = EventHandler;
module.exports.Receive = Receive;
