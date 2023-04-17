/**
 * @file `send` statement need to be async, but `l.Machine` does not support it.
 * There is no way to wrap a recursive generator method into async at runtime.
 * The only way is to transform the source code and generate a new file.
 */
var fs = require('fs');
var path = require('path');
var file = require.resolve('l/Machine');
var source = fs.readFileSync(file, 'utf8');
source = source.replace("step() {", "async step() {")
	.replace("this.generator.next()", "await this.generator.next()")
	.replace("*_run(program) {", "async *_run(program) {")
	.replace("*runStatements(statement, expression) {", "async *runStatements(statement, expression) {")
	.replace("execute(program) {", "async execute(program) {")
	.replace("evaluate(program) {", "async evaluate(program) {");
fs.writeFileSync(path.join(path.dirname(file), 'Machine.async.js'), source, 'utf8');
module.exports = require('l/Machine.async');
