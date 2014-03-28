require(["util"], function(util)
{
	"use strict";

	var ws = new WebSocket("ws://localhost:8000");

	ws.onopen = function(event)
	{
		console.log("Connected!");
		ws.send("Halloo!");
	};

	ws.onmessage = function(event)
	{
		console.log(event.data);
	};

	util.test();
})();
