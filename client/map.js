define(["imageloader"], function(imageloader)
{
    "use strict";

    return function Map()
    {
        var mapMatrix = [];

        var playerPos = [];
        playerPos[0] = 0;
        playerPos[1] = 0;

        for(var i=0; i<36; ++i)
        {
            mapMatrix[i] = [];
            for(var j=0; j<64; ++j)
            {
                mapMatrix[i][j] = imageloader.getImage((Math.floor(Math.random() * 2) === 0) ? "crate" : "sand");
            }
        }
        mapMatrix[playerPos[0]][playerPos[1]] = imageloader.getImage("player");

        this.draw=function(ctx, entities)
        {
            for(var i=0; i<mapMatrix.length; ++i)
            {
                for(var j=0; j<mapMatrix[i].length; ++j)
                {
                    ctx.drawImage(mapMatrix[i][j], j*20, i*20, 20, 20);
                }
            }
            
        };

        this.movePlayerIcon=function(x,y)
        {
            mapMatrix[playerPos[0]][playerPos[1]] = imageloader.getImage("dug");
            playerPos[0] = y;
            playerPos[1] = x;
            mapMatrix[y][x] = imageloader.getImage("player");
//            ctx.drawImage(imageloader.getImage("player"), x*20, y*20, 20, 20);
        }
    };
});
