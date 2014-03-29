/**
 * Created by Simo on 28-Mar-14.
 */

define(function()
{
    "use strict";

    return function Entity(posX, posY, model)
    {
        this.x = posX;
        this.y = posY;
        this.model = model;
    };
});
