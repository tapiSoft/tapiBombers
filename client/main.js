require(["util", "tile"], function(util, Tile)
{
	"use strict";

    var canvas = document.getElementById("gameCanvas");
    var ctx = canvas.getContext("2d");

    var mapMatrix = [];

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

	var tile=new Tile("../gfx/objects/crate.png", function(tileGraphics)
    {
        ctx.drawImage(tileGraphics, 0, 0);
    });




})();
