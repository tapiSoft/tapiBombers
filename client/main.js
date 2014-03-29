require(["domReady", "imageloader", "tile", "input", "map"], function(domready, imageloader, Tile, input, Map)
{
	"use strict";

    var canvas = document.getElementById("gameCanvas");
    var ctx = canvas.getContext("2d");
    var chatcanvas = document.getElementById("chatCanvas");
    var chatctx = chatcanvas.getContext("2d");
    chatctx.fillstyle = "blue";
    chatctx.font = "bold 16px Arial";

	domready(function() { fullscreenify(canvas); }, false);
	/*
	 * fullscreenify()
	 * Stretch canvas to size of window.
	 *
	 * Zachary Johnson
	 * http://www.zachstronaut.com/
	 *
	 * See also: https://gist.github.com/1178522
	 */
	function fullscreenify(canvas) {
		var style = canvas.getAttribute('style') || '';
		window.addEventListener('resize', function () {resize(canvas);}, false);

		resize(canvas);

		function resize(canvas) {
			var scale = {x: 1, y: 1};
			scale.x = window.innerWidth / canvas.width;
			scale.y = (window.innerHeight - 120) / canvas.height;
			if (scale.x < 1 || scale.y < 1) {
				scale = '1, 1';
			} else if (scale.x < scale.y) {
				scale = scale.x + ', ' + scale.x;
			} else {
				scale = scale.y + ', ' + scale.y;
			}
			canvas.setAttribute('style', style + ' ' + '-ms-transform-origin: center top; -webkit-transform-origin: center top; -moz-transform-origin: center top; -o-transform-origin: center top; transform-origin: center top; -ms-transform: scale(' + scale + '); -webkit-transform: scale3d(' + scale + ', 1); -moz-transform: scale(' + scale + '); -o-transform: scale(' + scale + '); transform: scale(' + scale + ');');
		}
	}

    input.initInput();

    imageloader.loadImages(function()
    {
        var map = new Map();
        var chatmessages = [];

        var ws = new WebSocket("ws://192.168.1.191:8000");
        ws.onopen = function(event)
        {
            console.log("Connected!");
            var msg = msgpack.encode({type: 'chat', message: "Halloo!"});
            console.log("Sending message " + msg);
            ws.send(msg);
            ws.send(msgpack.encode({type: 'move', xdir: '1', ydir: '1000' }));
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
                    if(message.sender === undefined)
                        message.sender = "[SERVER]";
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
                    handleTapiMessage(msg);
            };
            fileReader.readAsArrayBuffer(event.data);
        };

        input.keyDownListeners.right=function()
        {
            map.movePlayerIcon(0);
            map.draw(ctx);
        }

        input.keyDownListeners.down=function()
        {
            map.movePlayerIcon(1);
            map.draw(ctx);
        }

        input.keyDownListeners.left=function()
        {
            map.movePlayerIcon(2);
            map.draw(ctx);
        }

        input.keyDownListeners.up=function()
        {
            map.movePlayerIcon(3);
            map.draw(ctx);
        }

        map.draw(ctx);
    });
});
