import type Value = require('l/Value');
interface Implementation {
	receive(): Promise<[message: Value, sender: Value]>;
	send(message: Value, receiver: Value): Promise<void>;
}
export default Implementation;
