var assert = require('assert');
var chatscript = require('..');
it('', async () => {
	var script = chatscript`
		let a = 26;
		on receive message do (
			message.text = "ding" ?
				(send "dong" to message.from;) : 0
		);
	`;
	var environment = new chatscript.Environment(new chatscript.Scope({ a: new chatscript.Value.Undefined() }));
	var response;
	var machine = new chatscript.Machine(environment, {
		send: async (message, receiver) => {
			response = { message: message, receiver: receiver };
		}
	});
	machine.run(script);
	while (!await machine.step());
	assert(chatscript.Value.equals(environment.scope.name['a'], new chatscript.Value.Number(26)));
	var g = machine.emit({
		type: 'receive',
		argument: new chatscript.Value.Object({
			text: new chatscript.Value.String('ding'),
			from: new chatscript.Value.Object({
				name: new chatscript.Value.String('a')
			})
		})
	});
	while (!(await g.next()).done);
	assert(chatscript.Value.equals(response.message, new chatscript.Value.String('dong')));
	assert(chatscript.Value.equals(response.receiver.property['name'], new chatscript.Value.String('a')));
});
it('echo', async () => {
	var script = chatscript`
		while 1 do {
			var message;
			var sender;
			receive message from sender;
			send message.text to sender;
		}
	`;
	var environment = new chatscript.Environment(new chatscript.Scope({}));
	var sender = new chatscript.Value.Object({
		name: new chatscript.Value.String('a')
	});
	var message = new chatscript.Value.Object({
		text: new chatscript.Value.String('a'),
		from: sender
	});
	var request = [message, sender];
	var response;
	var machine = new chatscript.Machine(environment, {
		receive: async () => request,
		send: async (message, receiver) => {
			response = { message: message, receiver: receiver };
		}
	});
	machine.run(script);
	while (!await machine.step())
		if (response) break;
	assert(chatscript.Value.equals(response.message, new chatscript.Value.String('a')));
	assert(chatscript.Value.equals(response.receiver.property['name'], new chatscript.Value.String('a')));
});
