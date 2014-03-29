define(function ()
{
    "use strict";

    var imageSources = {
        crate: "../gfx/objects/crate.png",
        sand: "../gfx/objects/sand.png"
    };
    var imagesLoaded = 0;

    return {
        loadImages: function(callback)
        {
            function imageLoaded(img, path)
            {
                imageSources[path] = img;
                imagesLoaded++;

                if(imagesLoaded===Object.keys(imageSources).length)
                    callback();
            }
            for(var imagePath in imageSources)
            {
                var image = new Image();
                (function(imgPath)
                {
                    image.onload = function() { imageLoaded(this, imgPath); };
                })(imagePath);
                image.src = imageSources[imagePath];

                // Stackoverflow says this is needed if the image is retrieved from the browser cache
                if(image.complete) imageLoaded(image, imagePath);
            }
        },
        getImage: function(key)
        {
            return imageSources[key];
        }
    };
});
