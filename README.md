# chatscript

A script language for chatbots

```chatscript
on receive message do (
	message.text = "ding" ?
		(send "dong" to message.from;) : 0
);
```
