define(function ()
{
    "use strict";
    return function StatusWindow()
    {
        var chatcanvas = document.getElementById("chatCanvas");
        var chatctx = chatcanvas.getContext("2d");
        var chatmessages = [];
        chatctx.font = "bold 16px Arial";

        this.redraw = function()
        {
            chatctx.clearRect(0, 0, chatcanvas.width, chatcanvas.height);
            for(var i = 1; i <= chatmessages.length; ++i)
            {
                chatctx.fillText(chatmessages[chatmessages.length-i], 0, chatcanvas.height-16*i);
            }
        };

        this.addMessage = function(message)
        {
            chatmessages.push(message.sender + ": " + message.message);
        };
    };
});
