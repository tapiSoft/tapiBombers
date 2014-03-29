define(["imageloader"], function(imageloader)
{
    "use strict";

    return function Map()
    {
        var mapMatrix = [];

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
                ctx.drawImage(img, Math.round(e.x*20), Math.round(e.y*20), 20, 20);
            }
        };

        this.initializeMap = function(width, height)
        {
            mapMatrix = [];
            for(var i = 0; i < height; ++i)
            {
                var tmp = [];
                for(var j = 0; j < width; ++j)
                    tmp.push(0);
                mapMatrix.push(tmp);
            }
        }

        this.setTile = function(x, y, model, durability)
        {
            mapMatrix[y][x] = imageloader.getImage(model);
        }
    };
});
