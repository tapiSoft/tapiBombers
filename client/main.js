require(["imageloader", "tile", "input", "map"], function(imageloader, Tile, input, Map)
{
	"use strict";

    var canvas = document.getElementById("gameCanvas");
    var ctx = canvas.getContext("2d");
    var chatcanvas = document.getElementById("chatCanvas");
    var chatctx = chatcanvas.getContext("2d");
    chatctx.fillstyle = "blue"
    chatctx.font = "bold 16px Arial"

    input.initInput();

    imageloader.loadImages(function()
    {
        var map = new Map();
        var chatmessages = []

        var ws = new WebSocket("ws://localhost:8000");
        ws.onopen = function(event)
        {
            console.log("Connected!");
            var msg = msgpack.encode({type: 'chat', message: "Halloo!"});
            console.log("Sending message " + msg);
            ws.send(msg);
            ws.send(msgpack.encode({type: 'move', xdir: '1', ydir: '1000' }))
        };

        var redrawChatBox = function()
        {
            chatctx.clearRect(0, 0, chatcanvas.width, chatcanvas.height)
            for(var i = 1; i <= chatmessages.length; ++i)
            {
                chatctx.fillText(chatmessages[chatmessages.length-i], 0, chatcanvas.height-16*i);
            }

        }

        var handleTapiMessage = function(message)
        {
            switch(message.type)
            {
                case 'chat':
                    if(message.sender == undefined)
                        message.sender = "[SERVER]"
                    chatmessages.push(message.sender + ": " + message.message);
                    redrawChatBox();
                    break;
            }

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
                    handleTapiMessage(msg)
            };
            fileReader.readAsArrayBuffer(event.data);
        };

        map.draw(ctx);
    });
});
