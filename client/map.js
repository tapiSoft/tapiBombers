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

        this.draw=function(ctx)
        {
            for(var i=0; i<mapMatrix.length; ++i)
            {
                for(var j=0; j<mapMatrix[i].length; ++j)
                {
                    ctx.drawImage(mapMatrix[i][j], j*20, i*20, 20, 20);
                }
            }
        };

        this.insert=function(posX, posY, insertValue)
        {
            mapMatrix[posX][posY] = insertValue;
        }

        this.movePlayerIcon=function(direction)
        {
            mapMatrix[playerPos[0]][playerPos[1]] = imageloader.getImage("sand");
            switch(direction)
            {
                case 0:
                    playerPos[1]+= 1;
                    break;
                case 1:
                    playerPos[0] += 1;
                    break;
                case 2:
                    playerPos[1] -= 1;
                    break;
                case 3:
                    playerPos[0] -= 1;
                    break;
            }
            mapMatrix[playerPos[0]][playerPos[1]] = imageloader.getImage("player");
        }
    };
});
