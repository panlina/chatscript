/** @typedef {import('./Program').default} Program */
/**
 * @template T
 * @typedef {import('l/Environment')<T>} Environment<T>
 */
/** @typedef {import('l/Value')} Value */
/** @typedef {import('./Implementation').default} Implementation */
var Scope = require('l/Scope');
var Statement = require('l/Statement');
var EventHandler = require('./EventHandler');
var Value = require('l/Value');
var extractFunctionArgumentNames = require('l/extractFunctionArgumentNames');
class Machine extends require('./Machine.async') {
	/**
	 * @param {Environment<Value>} environment
	 * @param {Implementation} implementation
	 */
	constructor(environment, implementation) {
		super(environment);
		/** @type {Implementation} */
		this.implementation = implementation;
	}
	async *_run(program) {
		if (program instanceof Array)
			return yield* super._run(
				program.filter(statement => !(statement instanceof EventHandler))
			);
		else if (program instanceof Statement) {
			var statement = program;
			switch (statement.type) {
				case 'receive':
					yield statement;
					var [$message, $sender] = await this.implementation.receive();
					// TODO: check $message, $sender
					this.assign(statement.message, $message);
					this.assign(statement.sender, $sender);
					break;
				case 'send':
					var $message = yield* this._run(statement.message);
					var $receiver = yield* this._run(statement.receiver);
					// TODO: check $message, $receiver
					yield statement;
					await this.implementation.send($message, $receiver);
					break;
				default:
					yield* super._run(statement);
			}
		} else
			return yield* super._run(program);
	}
	run(program) {
		super.run(program);
		/** @type {Program} */
		this.program = program;
	}
	/**
	 * @param {Object} event
	 * @param {string} event.type
	 * @param {Value} event.argument
	 */
	async *emit(event) {
		/** @type {EventHandler[]} */
		var eventHandler = this.program.filter(
			statement =>
				statement instanceof EventHandler
				&&
				statement.type == event.type
		);
		for (var eventHandler of eventHandler)
			yield* this.callEventHandler(eventHandler, event.argument);
	}
	/**
	 * @param {EventHandler} eventHandler
	 * @param {Value} argument
	 */
	async *callEventHandler(eventHandler, argument) {
		this.callStack.unshift({ current: eventHandler, environment: this.environment });
		var environment = this.environment;
		this.environment = this.environment.push(new Scope({}));
		for (var name of extractFunctionArgumentNames(eventHandler.argument))
			this.environment.scope.name[name.identifier] = new Value.Undefined();
		this.assign(eventHandler.argument, argument);
		yield* this._run(eventHandler.statement);
		this.environment = environment;
		this.callStack.shift();
	}
}
module.exports = Machine;
