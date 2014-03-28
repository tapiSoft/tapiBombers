/**
 * Created by Simo on 28-Mar-14.
 */

define(function()
{
    "use strict";
    return function Tile(imagePath, callback)
    {
        var graphics = new Image();
        if(callback) graphics.onload = function()
        {
            callback(this);
        };
        graphics.src = imagePath;

        var terrain;
        var treasure;
        var weapon;

        this.getGraphics=function()
        {
            return graphics;
        }
    };
});
