/** @typedef {import('./Program').default} Program */
var Scope = require('l/Scope');
var EventHandler = require('./EventHandler');
var Value = require('l/Value');
var extractFunctionArgumentNames = require('l/extractFunctionArgumentNames');
class Machine extends require('l/Machine') {
	*_run(program) {
		if (program instanceof Array)
			return yield* super._run(
				program.filter(statement => !(statement instanceof EventHandler))
			);
		else
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
	*emit(event) {
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
	*callEventHandler(eventHandler, argument) {
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