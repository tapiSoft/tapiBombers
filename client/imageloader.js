define(function ()
{
    "use strict";

    var imageSources = {
        crate: "../gfx/objects/crate.png"
    };
    var imagesLoaded = 0;

    return {
        loadImages: function(callback)
        {
            for(var imagePath in imageSources)
            {
                var image = new Image();
                image.onload=function()
                {
                    imageSources[imagePath] = image;
                    imagesLoaded++;

                    if(imagesLoaded===Object.keys(imageSources).length)
                        callback();
                }
                image.src = imageSources[imagePath];
            }
        },
        getImage: function(key)
        {
            return imageSources[key];
        }
    };
});