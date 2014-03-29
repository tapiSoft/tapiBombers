require(["domReady", "imageloader", "tile", "input", "map", "statuswindow", "entity"], function(domready, imageloader, Tile, input, Map, StatusWindow, Entity)
{
	"use strict";

    var canvas = document.getElementById("gameCanvas");
    var ctx = canvas.getContext("2d");
	var status = new StatusWindow();

    window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
            alert("This should not happen.");
        };
    })();


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
            scale.y = (window.innerHeight-120) / canvas.height;
            if (scale.x < 1 || scale.y < 1) {
                scale = '1, 1';
            } else if (scale.x < scale.y) {
                scale = scale.x + ', ' + scale.x;
            } else {
                scale = scale.y + ', ' + scale.y;
            }
            canvas.setAttribute('style', style + ' ' + '-ms-transform-origin: left top; -webkit-transform-origin: left top; -moz-transform-origin: left top; -o-transform-origin: left top; transform-origin: left top; -ms-transform: scale(' + scale + '); -webkit-transform: scale3d(' + scale + ', 1); -moz-transform: scale(' + scale + '); -o-transform: scale(' + scale + '); transform: scale(' + scale + ');');
        }
    }

    input.initInput();

    imageloader.loadImages(function()
    {
        var map = new Map();
        var entities = {};

        function draw()
        {
            map.draw(ctx, entities);
            status.redraw();
            setTimeout(function()
            {
                window.requestAnimFrame(draw);
            }, 1000/30);
        }


        var ws = new WebSocket("ws://192.168.1.191:8000");
        ws.onopen = function(event)
        {
            //console.log("Connected!");
            var msg = msgpack.encode({type: 'chat', message: "Halloo!"});
            //console.log("Sending message " + msg);
            ws.send(msg);
            ws.send(msgpack.encode({type: 'move', xdir: '1', ydir: '1000' }));
        };

        var handleTapiMessage = function(message)
        {
            //console.log("Received tapimessage of type: " + message.type);
            switch(message.type)
            {
                case 'chat':
                    if(message.sender === undefined)
                        message.sender = "[SERVER]";
                    status.addMessage(message);
                    break;
                case 'move':
                    entities[message.entityid].x = message.x;
                    entities[message.entityid].y = message.y;
                    break;
                case 'newentity':
                    var e = message.entity;
                    entities[e.id] = new Entity(e.x, e.y, e.model);
                    break;
                case 'entities':
                    entities = {};
                    for(var i in message.entities)
                    {
                        var e = message.entities[i];
                        entities[e.id] = new Entity(e.x, e.y, e.model);
                    }
                    break;
                case 'diff':
                    for(var i in message.diff)
                    {
                        var e = message.diff[i];
                        entities[e.id].x = e.x
                        entities[e.id].y = e.y
                    }
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
                    //console.log("Received message : " + msg);
                    handleTapiMessage(msg);
            };
            fileReader.readAsArrayBuffer(event.data);
        };

        input.keyDownListeners.right=function()
        {
            changeDirection(1,0);
        };

        input.keyDownListeners.down=function()
        {
            changeDirection(0,1);
        };

        input.keyDownListeners.left=function()
        {
            changeDirection(-1,0);
        };

        input.keyDownListeners.up=function()
        {
            changeDirection(0,-1);
        };

        var changeDirection=function(xDir, yDir)
        {
            ws.send(msgpack.encode({type: 'move', xdir: xDir, ydir: yDir }));
        };

        window.requestAnimFrame(draw);
    });
});
