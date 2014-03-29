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
                    ctx.drawImage(mapMatrix[i][j], i*20, j*20, 20, 20);
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
            for(var i = 0; i < width; ++i)
            {
                var tmp = [];
                for(var j = 0; j < height; ++j)
                    tmp.push(0);
                mapMatrix.push(tmp);
            }
        }

        this.setTile = function(x, y, model, durability)
        {
            mapMatrix[y][x] = imageloader.getImage(model);
        }

        this.appendRow = function(row)
        {
            mapMatrix.push(row);
        }
    };
});
