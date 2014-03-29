define(["imageloader"], function(imageloader)
{
    "use strict";

    return function Map()
    {
        var mapMatrix = [];

        for(var i=0; i<36; ++i)
        {
            mapMatrix[i] = [];
            for(var j=0; j<64; ++j)
            {
                var img = imageloader.getImage((Math.floor(Math.random() * 2) === 0) ? "crate" : "sand");
                var canvas = document.createElement("canvas");
                canvas.width=20;
                canvas.height=20;
                canvas.getContext("2d").drawImage(img, 0, 0, 20, 20);
                mapMatrix[i][j] = canvas;
            }
        }

        this.draw=function(ctx, entities)
        {
            for(var i=0; i<mapMatrix.length; ++i)
            {
                for(var j=0; j<mapMatrix[i].length; ++j)
                {
                    ctx.drawImage(mapMatrix[i][j], j*20, i*20, 20, 20);
                }
            }
            for(var i in entities)
            {
                var e = entities[i];
                var img = imageloader.getImage(e.model);
                ctx.drawImage(img, e.x*20, e.y*20, 20, 20);
            }
        };
    };
});
