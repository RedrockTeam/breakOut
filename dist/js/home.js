"use strict";$(window).on("scroll.elasticity",function(t){t.preventDefault()}).on("touchmove.elasticity",function(t){t.preventDefault()}),$(document).ready(function(){var t=$("#cover"),e=$("#banner");setTimeout(function(){t.addClass("cover-hide")},2e3),setTimeout(function(){e.addClass("banner-bounce"),$(".stars_3").addClass("rotate-linear"),$("#start").addClass("start-after"),$("#intro").addClass("intro-after")},3e3),$("#start").on("touchstart",function(){window.location.href="./game.html"})});