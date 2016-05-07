"use strict";function _classCallCheck(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function t(t,i){for(var e=0;e<i.length;e++){var s=i[e];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}return function(i,e,s){return e&&t(i.prototype,e),s&&t(i,s),i}}();$(window).on("scroll.elasticity",function(t){t.preventDefault()}).on("touchmove.elasticity",function(t){t.preventDefault()}),$(document).ready(function(){window.innerHeight>568&&(document.querySelector("#canvas").height=window.innerHeight);var pub={canvas:document.querySelector("#canvas"),context:document.querySelector("#canvas").getContext("2d"),timer:null,run:!1,isStart:!1,touchTimer:null,stopTimer:function(){window.clearInterval(this.timer)}},gameController=["barrier_one_left.move()","barrier_one_right.move()","star.collision(barrier_one_left.top, barrier_one_left.isClose)","barrier_two_left.move()","barrier_two_right.move()","star.collision(barrier_two_left.top, barrier_two_left.isClose)","barrier_one_sign.paint()","barrier_three.rotate()","barrier_two_sign.paint()","star.collision(barrier_three.testPoint.down.y, barrier_three.testPoint.down.status)","star.collision(barrier_three.testPoint.up.y, barrier_three.testPoint.up.status)"],Stage=function(){function Stage(){_classCallCheck(this,Stage),this.context=pub.context,this.startX=0,this.startY=0,this.width=320,this.height=document.querySelector("#canvas").height,this.upFlag=!1,this.upPosLow=window.innerHeight/2}return _createClass(Stage,[{key:"refresh",value:function(){this.context.clearRect(this.startX,this.startY,this.width,this.height)}},{key:"up",value:function(t){this.upFlag=t<this.upPosLow,this.upFlag&&(this.context.translate(0,3),this.upPosLow-=3,this.startY-=3,window.innerHeight-=3)}},{key:"run",value:function run(){pub.timer=setInterval(function(){stage.refresh(),stage.up(star.getPos()[1]),gameController.forEach(function(item){return eval(item)}),touch.blink(),star.fall()},1e3/60),$(document).on("touchstart",function(){star.jump()})}}]),Stage}(),Star=function(){function t(i,e,s,n,h){_classCallCheck(this,t),this.context=pub.context,this.top=i,this.left=e,this.width=s,this.height=n,this.img=h,this.timer=null,this.exp=.1}return _createClass(t,[{key:"paint",value:function(){this.context.drawImage(this.img,this.left,this.top)}},{key:"jump",value:function(){this.exp=-8}},{key:"fall",value:function(){this.top+=this.exp,this.exp+=.3,this.paint(),this.isEnd()}},{key:"isEnd",value:function(){this.top>window.innerHeight&&(console.log("Fall down game over"),pub.stopTimer())}},{key:"getPos",value:function(){return[this.left+this.width/2,this.top+this.height/2]}},{key:"collision",value:function(t,i){var e=this.getPos()[1];Math.abs(t-e)<10&&i&&(console.log("collision"),console.log("game over"),pub.stopTimer())}}]),t}(),Circle=function(){function t(i,e,s,n,h,r,o,a){_classCallCheck(this,t),this.context=pub.context,this.start={x:i,y:e},this.width=s,this.height=n,this.img=h,this.rotateDeg=r,this.initDegree=r,this.testPoint={up:{y:this.start.y+10,zone:o,status:!0},down:{y:this.start.y-10+this.height,zone:a,status:!0}}}return _createClass(t,[{key:"paint",value:function(){this.context.save(),this.context.translate(this.start.x+.5*this.width,this.start.y+.5*this.height),this.context.rotate(this.rotateDeg),this.context.drawImage(this.img,-.5*this.width,-.5*this.height),this.context.restore()}},{key:"rotate",value:function(){var t=this;this.context.save(),this.context.translate(this.start.x+.5*this.width,this.start.y+.5*this.height),this.context.rotate(this.rotateDeg),this.context.clearRect(-.5*this.width,-.5*this.height,this.width,this.height),this.context.restore(),this.rotateDeg+=.02,this.rotateDeg>=2*Math.PI+this.initDegree&&(this.rotateDeg=this.initDegree);var i=0,e=0;this.testPoint.up.zone.map(function(e){return i+=t.rotateDeg>=e[0]&&t.rotateDeg<=e[1]}),this.testPoint.down.zone.map(function(i){return e+=t.rotateDeg>=i[0]&&t.rotateDeg<=i[1]}),this.testPoint.up.status=!(i>0),this.testPoint.down.status=!(e>0),this.paint()}}]),t}(),Block=function(){function t(i,e,s,n,h,r,o,a,c){_classCallCheck(this,t),this.context=pub.context,this.left=i,this.top=e,this.width=s,this.height=n,this.img=h,this.direction=r,this.maxLeft=o,this.maxRight=a,this.zone=c,this.isClose=!0}return _createClass(t,[{key:"paint",value:function(){this.context.drawImage(this.img,this.left,this.top)}},{key:"move",value:function(){var t=this.left+this.width/2,i=0;this.context.clearRect(this.left,this.top,this.width,this.height),this.zone.map(function(e){return i+=t>=e[0]&&t<=e[1]}),this.isClose=i>0,(this.direction&&t>=this.maxRight||!this.direction&&t<=this.maxLeft)&&(this.direction=!this.direction),this.direction?this.left+=1:this.left-=1,this.paint()}}]),t}(),Food=function(){function t(i,e,s,n,h){_classCallCheck(this,t),this.context=pub.context,this.left=i,this.top=e,this.width=s,this.height=n,this.img=h,this.isAte=!1}return _createClass(t,[{key:"paint",value:function(){this.context.drawImage(this.img,this.left,this.top)}},{key:"eat",value:function(t){var i=this.top+this.height/2;console.log(i),Math.abs(i-t)<5&&(this.isAte=!0),this.isAte||this.paint()}}]),t}(),Sign=function(){function t(i,e,s,n,h){_classCallCheck(this,t),this.context=pub.context,this.left=i,this.top=e,this.width=s,this.height=n,this.img=h,this.scale=1,this.flag=!1}return _createClass(t,[{key:"paint",value:function(){this.context.drawImage(this.img,this.left,this.top)}},{key:"blink",value:function(){this.scale>=1.3&&(this.flag=!1),this.scale<=1&&(this.flag=!0),this.flag?this.scale+=.005:this.scale-=.005,this.context.drawImage(this.img,this.left-this.width*this.scale/2,this.top-this.height*this.scale/2,this.width*this.scale,this.height*this.scale)}},{key:"blinkErase",value:function(){this.context.clearRect(0,this.top-40,window.innerWidth,window.innerHeight)}}]),t}(),imgStar=document.querySelector("#img-star"),imgRope=document.querySelector("#img-rope"),imgTouch=document.querySelector("#img-touch"),imgT1=document.querySelector("#img-title-1"),imgC1=document.querySelector("#img-circle-1"),imgT2=document.querySelector("#img-title-2"),winHeight=window.innerHeight,stage=new Stage,touch=new Sign(167,winHeight-70,40,60,imgTouch),star=new Star(winHeight-180,145,30,30,imgStar),barrier_one_left=new Block(0,winHeight-300,80,13,imgRope,!0,40,120,[[110,120]]),barrier_one_right=new Block(240,winHeight-300,80,13,imgRope,!1,200,280,[[200,215]]),barrier_one_sign=new Sign(110,winHeight-350,100,13,imgT1),barrier_two_left=new Block(0,winHeight-400,80,13,imgRope,!0,40,120,[[110,120]]),barrier_two_right=new Block(240,winHeight-400,80,13,imgRope,!1,200,280,[[200,215]]),barrier_three=new Circle(60,winHeight-750,200,200,imgC1,0,[[.7,2.4]],[[3.9,5.5]]),barrier_two_sign=new Sign(125,winHeight-650,80,13,imgT2);stage.refresh(),window.setTimeout(function(){barrier_one_left.paint(),barrier_one_right.paint(),barrier_one_sign.paint(),barrier_two_left.paint(),barrier_two_right.paint(),barrier_three.paint(),star.paint()},200),pub.touchTimer=window.setInterval(function(){touch.blinkErase(),touch.blink()},1e3/60),$("#container").on("touchstart",function(){window.clearInterval(pub.touchTimer),pub.run===!1&&(stage.run(),pub.run=!0,pub.isStart=!0)})});