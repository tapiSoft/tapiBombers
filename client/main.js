(function()
{
	"use strict";

	var ws = new WebSocket("ws://localhost:8000");

	ws.onopen = function(event)
	{
		console.log("Connected!");
        var msg = msgpack.encode({type: 'chat', message: "Halloo!"});
        console.log("Sending message " + msg);
		ws.send(msg);
	};

	ws.onmessage = function(event)
	{
        var arrayBuffer;
        var fileReader = new FileReader();
        fileReader.onload = function() {
                arrayBuffer = this.result;
                var msg = msgpack.decode(arrayBuffer);
                console.log("Received message : " + msg);
                console.log("chat message : " + msg.message);
        };
        fileReader.readAsArrayBuffer(event.data);
	};

	window.onload=function()
	{
		alert("hallota");
	}
})();
