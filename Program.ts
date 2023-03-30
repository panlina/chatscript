import type Statement = require('l/Statement');
import type Label = require('l/Label');
import type EventHandler = require('./EventHandler');
type Program = (EventHandler | Statement | Label)[];
export default Program;
