"use strict";!function(){window.addEventListener("touchmove",function(e){e.preventDefault()}),document.querySelector("#cover").addEventListener("touchmove",function(e){e.preventDefault()}),setTimeout(function(){document.querySelector("#cover").className+=" cover-hide",setTimeout(function(){document.querySelector("#banner").className+=" banner-bounce",document.querySelector("#start").className+=" start-after",document.querySelector("#intro").className+=" intro-after",document.querySelector("#redrock").className+=" redrock-after"},1e3)},3e3),document.querySelector("#start").addEventListener("touchstart",function(){window.location.href="./game.html"}),document.querySelector("#intro").addEventListener("touchstart",function(){window.location.href="./intro.html"})}();