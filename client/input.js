define(function()
{
	"use strict";
	var NYIfunc=function() { console.log("NYI"); };
	var obj = {
		keyDownListeners: {
			up: NYIfunc,
			down: NYIfunc,
			left: NYIfunc,
			right: NYIfunc
		},
		keyUpListeners: {
			up: NYIfunc,
			down: NYIfunc,
			left: NYIfunc,
			right: NYIfunc
		},
		initInput: function()
		{
			addEventListener("keydown", function(e)
			{
				var keyCode = e.keyCode ? e.keyCode : e.which;
				switch(keyCode)
				{
					case 37: e.preventDefault(); obj.keyDownListeners.left(); break;
					case 38: e.preventDefault(); obj.keyDownListeners.up(); break;
					case 39: e.preventDefault(); obj.keyDownListeners.right(); break;
					case 40: e.preventDefault(); obj.keyDownListeners.down(); break;
				}
			});
			addEventListener("keyup", function(e)
			{
				var keyCode = e.keyCode ? e.keyCode : e.which;
				switch(keyCode)
				{
					case 37: e.preventDefault(); obj.keyUpListeners.left(); break;
					case 38: e.preventDefault(); obj.keyUpListeners.up(); break;
					case 39: e.preventDefault(); obj.keyUpListeners.right(); break;
					case 40: e.preventDefault(); obj.keyUpListeners.down(); break;
				}
			});
		}
	};
	return obj;
});
