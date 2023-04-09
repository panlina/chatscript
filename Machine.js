/** @typedef {import('./Program').default} Program */
/**
 * @template T
 * @typedef {import('l/Environment')<T>} Environment<T>
 */
/** @typedef {import('l/Value')} Value */
var Scope = require('l/Scope');
var EventHandler = require('./EventHandler');
var Value = require('l/Value');
var extractFunctionArgumentNames = require('l/extractFunctionArgumentNames');
class Machine extends require('./Machine.Async') {
	/** @param {Environment<Value>} environment */
	constructor(environment) {
		super(environment);
	}
	async *_run(program) {
		if (program instanceof Array)
			return yield* super._run(
				program.filter(statement => !(statement instanceof EventHandler))
			);
		else
			return yield* super._run(program);
	}
	assign(expression, value) {
		this.sync.assign(expression, value);
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
