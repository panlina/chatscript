var grammar = require('./grammar');
var EventHandler = require('./EventHandler');
var Statement = require('./Statement');
var semantics = grammar.extendSemantics(require('l/semantics')).extendOperation('parse', {
	Program: statement => statement.children.map(s => s.parse()),
	EventHandlerReceive: (on, receive, message, _do, statement) => new EventHandler('receive', message.parse(), statement.parse()),
	StatementSend: (send, message, to, receiver, semicolon) => new Statement.Send(message.parse(), receiver.parse())
});
module.exports = semantics;
