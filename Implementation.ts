import type Value = require('l/Value');
interface Implementation {
	send(message: Value, receiver: Value): Promise<void>;
}
export default Implementation;
