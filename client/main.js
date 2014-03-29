require(["imageloader", "tile", "input", "map"], function(imageloader, Tile, input, Map)
{
	"use strict";

    var canvas = document.getElementById("gameCanvas");
    var ctx = canvas.getContext("2d");
    var chatcanvas = document.getElementById("chatCanvas");
    var chatctx = chatcanvas.getContext("2d");
    chatctx.fillstyle = "blue";
    chatctx.font = "bold 16px Arial";

    input.initInput();

    imageloader.loadImages(function()
    {
        var map = new Map();
        var chatmessages = [];
        var entities = {};

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
            chatctx.clearRect(0, 0, chatcanvas.width, chatcanvas.height);
            for(var i = 1; i <= chatmessages.length; ++i)
            {
                chatctx.fillText(chatmessages[chatmessages.length-i], 0, chatcanvas.height-16*i);
            }

        };

        var handleTapiMessage = function(message)
        {
            switch(message.type)
            {
                case 'chat':
                    if(message.sender == undefined)
                        message.sender = "[SERVER]";
                    chatmessages.push(message.sender + ": " + message.message);
                    redrawChatBox();
                    break;
                case 'move':
                    map.movePlayerIcon(message.x, message.y);
                    break;
                case 'newentity':
                    entities[message.entityid] = new Entity(message.x, message.y, message.model);
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

        input.keyDownListeners.right=function()
        {
            changeDirection(1,0);
            map.draw(ctx);
        }

        input.keyDownListeners.down=function()
        {
            changeDirection(0,-1);
            map.draw(ctx);
        }

        input.keyDownListeners.left=function()
        {
            changeDirection(-1,0);
            map.draw(ctx);
        }

        input.keyDownListeners.up=function()
        {
            changeDirection(0,1);
            map.draw(ctx);
        }

        var changeDirection=function(xDir, yDir)
        {
            ws.send(msgpack.encode({type: 'move', xdir: xDir, ydir: yDir }));
        }

        map.draw(ctx);
    });
});
