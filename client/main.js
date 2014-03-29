require(["imageloader", "tile", "input", "map"], function(imageloader, Tile, input, Map)
{
	"use strict";

    var canvas = document.getElementById("gameCanvas");
    var ctx = canvas.getContext("2d");

    input.initInput();

    imageloader.loadImages(function()
    {
        var map = new Map();

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

        map.draw(ctx);
    });
});
