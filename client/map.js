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
                mapMatrix[i][j] = imageloader.getImage((Math.floor(Math.random() * 2) === 0) ? "crate" : "sand");
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
                ctx.drawImage(img, Math.round(e.x*20), Math.round(e.y*20), 20, 20);
            }
        };
    };
});
