/** @typedef {import('l/Expression')} Expression */
/** @typedef {import('./Program').default} Program */
/**
 * @template T
 * @typedef {import('l/Environment')<T>} Environment<T>
 */
/** @typedef {import('l/Value')} Value */
var Sync = require('l/Machine');
/**
 * `send` statement need to be async, but `l.Machine` does not support it.
 * Wrap `l.Machine` and change the interface into async.
 */
class Async {
	/** @param {Environment<Value>} environment */
	constructor(environment) {
		this.sync = new Sync(environment);
	}
	get environment() { return this.sync.environment; }
	set environment(value) { this.sync.environment = value; }
	get current() { return this.sync.current; }
	set current(value) { this.sync.current = value; }
	get return() { return this.sync.return; }
	set return(value) { this.sync.return = value; }
	get callStack() { return this.sync.callStack; }
	set callStack(value) { this.sync.callStack = value; }
	/** @return {Promise<boolean>} */
	async step() {
		for (; ;) {
			var { value: value, done: done } = await this.generator.next();
			if (done)
				this.return = value;
			else {
				this.current = value;
				if (!value.node) continue;
			}
			break;
		}
		return done;
	}
	/**
	 * @param {Program} program
	 * @return {void}
	 */
	run(program) {
		this.callStack = [{ environment: this.environment }];
		this.generator = this.sync._run(program);
	}
	async *_run(program) { return yield* this.sync._run(program); }
	/**
	 * @param {Statement} program
	 * @return {Promise<void>}
	 */
	async execute(program) {
		this.callStack = [{ environment: this.environment }];
		var generator = this.sync._run(program);
		while (!(await generator.next()).done);
	}
	/**
	 * @param {Expression} program
	 * @return {Promise<Value>}
	 */
	async evaluate(program) {
		this.callStack = [{ environment: this.environment }];
		var generator = this._run(program);
		var next;
		while (!(next = await generator.next()).done);
		return next.value;
	}
}
module.exports = Async;
