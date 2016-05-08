"use strict";function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}();$(window).on("scroll.elasticity",function(t){t.preventDefault()}).on("touchmove.elasticity",function(t){t.preventDefault()}),$(document).ready(function(){$(document).on("touchstart",function(t){return t.preventDefault()}),window.innerHeight>568&&(document.querySelector("#canvas").height=window.innerHeight);var $pause=$("#pause");$pause.on("touchstart",function(){});var $gameBarrier=$("#game-barrier"),$gameTimer=$("#game-timer"),gameTimer={minute:0,second:0,millisec:0,run:function(){this.millisec+=5,this.millisec>=100&&(this.second++,this.millisec=0),this.second>=60&&(this.minute++,this.second=0)},getTime:function(){var t="";return this.minute<10&&(t+="0"),t+=this.minute,t+=" : ",this.second<10&&(t+="0"),t+=this.second,t+=" : ",this.millisec<10&&(t+="0"),t+=this.millisec}},controller={timer:null,startTime:null,endTime:null,stopTimer:function(){window.clearInterval(this.timer)}},pub={canvas:document.querySelector("#canvas"),context:document.querySelector("#canvas").getContext("2d"),timer:null,run:!1,isStart:!1,touchTimer:null,currentLevel:0,rolled:0,renderBarrier:[0,2],judgeRender:function(){this.rolled>=120&&this.rolled<410?this.renderBarrier=[1,2]:this.rolled>=410&&this.rolled<1e3&&(this.renderBarrier=[2,2])},levelUp:function(){this.currentLevel++},stopTimer:function(){window.clearInterval(this.timer)}},gameController=[["touch.blink()"],["barrier_one_sign.paint()","barrier_one_bl.move()","barrier_one_br.move()","star.collision(barrier_one_bl.testPoint, barrier_one_bl.isClose)","barrier_one_tr.move()","barrier_one_tl.move()","star.collision(barrier_one_tl.testPoint, barrier_one_tl.isClose)"],["barrier_two_sign.paint()","barrier_two.rotate()","star.collision(barrier_two.testPoint.down.y, barrier_two.testPoint.down.status)","star.collision(barrier_two.testPoint.up.y, barrier_two.testPoint.up.status)"]],Stage=function(){function Stage(){_classCallCheck(this,Stage),this.context=pub.context,this.startX=0,this.startY=0,this.width=320,this.height=document.querySelector("#canvas").height,this.upFlag=!1,this.upPosLow=window.innerHeight/2.5}return _createClass(Stage,[{key:"refresh",value:function(){this.context.clearRect(this.startX,this.startY,this.width,this.height)}},{key:"up",value:function(t){this.upFlag=t<this.upPosLow,this.upFlag&&(this.context.translate(0,2),this.upPosLow-=2,this.startY-=2,window.innerHeight-=2,pub.rolled+=2)}},{key:"run",value:function run(){pub.timer=setInterval(function(){stage.refresh(),stage.up(star.getPos()[1]),star.getHighestPos(),pub.judgeRender();for(var i=pub.renderBarrier[0];i<=pub.renderBarrier[1];i++)gameController[i].forEach(function(item){return eval(item)});star.fall()},100/6)}}]),Stage}(),Star=function(){function t(e,i,n,s,r){_classCallCheck(this,t),this.context=pub.context,this.top=e,this.left=i,this.width=n,this.height=s,this.img=r,this.timer=null,this.exp=.1,this.reachHeight=this.top}return _createClass(t,[{key:"paint",value:function(){this.context.drawImage(this.img,this.left,this.top)}},{key:"jump",value:function(){this.exp=-3.5}},{key:"fall",value:function(){this.top+=this.exp,this.exp+=.2,this.paint(),this.isEnd()}},{key:"isEnd",value:function(){this.top>window.innerHeight&&(console.log("Fall down game over"),pub.stopTimer(),controller.stopTimer())}},{key:"getPos",value:function(){return[this.left+this.width/2,this.top+this.height/2]}},{key:"collision",value:function(t,e){var i=this.getPos()[1];Math.abs(t-i)<10&&e&&(console.log("collision"),console.log("game over"),pub.stopTimer(),controller.stopTimer())}},{key:"getHighestPos",value:function(){var t=this.getPos()[1];t<this.reachHeight&&(this.reachHeight=t),console.log("this height: "+this.reachHeight)}}]),t}(),Circle=function(){function t(e,i,n,s,r,o,h,a){_classCallCheck(this,t),this.context=pub.context,this.start={x:e,y:i},this.width=n,this.height=s,this.img=r,this.rotateDeg=o,this.initDegree=o,this.testPoint={up:{y:this.start.y+10,zone:h,status:!0},down:{y:this.start.y-10+this.height,zone:a,status:!0}}}return _createClass(t,[{key:"paint",value:function(){this.context.save(),this.context.translate(this.start.x+.5*this.width,this.start.y+.5*this.height),this.context.rotate(this.rotateDeg),this.context.drawImage(this.img,-.5*this.width,-.5*this.height),this.context.restore()}},{key:"rotate",value:function(){var t=this;this.context.save(),this.context.translate(this.start.x+.5*this.width,this.start.y+.5*this.height),this.context.rotate(this.rotateDeg),this.context.restore(),this.rotateDeg+=.02,this.rotateDeg>=2*Math.PI+this.initDegree&&(this.rotateDeg=this.initDegree);var e=0,i=0;this.testPoint.up.zone.map(function(i){return e+=t.rotateDeg>=i[0]&&t.rotateDeg<=i[1]}),this.testPoint.down.zone.map(function(e){return i+=t.rotateDeg>=e[0]&&t.rotateDeg<=e[1]}),this.testPoint.up.status=!(e>0),this.testPoint.down.status=!(i>0),this.paint()}}]),t}(),Block=function(){function t(e,i,n,s,r,o,h,a,c){_classCallCheck(this,t),this.context=pub.context,this.left=e,this.top=i,this.width=n,this.height=s,this.img=r,this.direction=o,this.maxLeft=h,this.maxRight=a,this.zone=c,this.testPoint=this.top+this.height/2,this.isClose=!0}return _createClass(t,[{key:"paint",value:function(){this.context.drawImage(this.img,this.left,this.top)}},{key:"move",value:function(){var t=this.left+this.width/2,e=0;this.zone.map(function(i){return e+=t>=i[0]&&t<=i[1]}),this.isClose=e>0,(this.direction&&t>=this.maxRight||!this.direction&&t<=this.maxLeft)&&(this.direction=!this.direction),this.direction?this.left+=2:this.left-=2,this.paint()}}]),t}(),Food=function(){function t(e,i,n,s,r){_classCallCheck(this,t),this.context=pub.context,this.left=e,this.top=i,this.width=n,this.height=s,this.img=r,this.isAte=!1}return _createClass(t,[{key:"paint",value:function(){this.context.drawImage(this.img,this.left,this.top)}},{key:"eat",value:function(t){var e=this.top+this.height/2;console.log(e),Math.abs(e-t)<5&&(this.isAte=!0),this.isAte||this.paint()}}]),t}(),Sign=function(){function t(e,i,n,s,r){_classCallCheck(this,t),this.context=pub.context,this.left=e,this.top=i,this.width=n,this.height=s,this.img=r,this.scale=1,this.flag=!1}return _createClass(t,[{key:"paint",value:function(){this.context.drawImage(this.img,this.left,this.top)}},{key:"blink",value:function(){this.scale>=1.3&&(this.flag=!1),this.scale<=1&&(this.flag=!0),this.flag?this.scale+=.005:this.scale-=.005,this.context.drawImage(this.img,this.left-this.width*this.scale/2,this.top-this.height*this.scale/2,this.width*this.scale,this.height*this.scale)}},{key:"blinkErase",value:function(){this.context.clearRect(0,this.top-40,window.innerWidth,window.innerHeight)}}]),t}(),imgStar=document.querySelector("#img-star"),imgRope=document.querySelector("#img-rope"),imgTouch=document.querySelector("#img-touch"),imgT1=document.querySelector("#img-title-1"),imgC1=document.querySelector("#img-circle-1"),imgT2=document.querySelector("#img-title-2"),winHeight=window.innerHeight,stage=new Stage,touch=new Sign(167,winHeight-70,40,60,imgTouch),star=new Star(winHeight-180,145,30,30,imgStar),barrier_one_bl=new Block(0,winHeight-300,80,13,imgRope,!0,40,120,[[110,120]]),barrier_one_br=new Block(240,winHeight-300,80,13,imgRope,!1,200,280,[[200,215]]),barrier_one_sign=new Sign(110,winHeight-350,100,13,imgT1),barrier_one_tl=new Block(0,winHeight-400,80,13,imgRope,!0,40,120,[[110,120]]),barrier_one_tr=new Block(240,winHeight-400,80,13,imgRope,!1,200,280,[[200,215]]),barrier_two=new Circle(60,winHeight-750,200,200,imgC1,0,[[.7,2.4]],[[3.9,5.5]]),barrier_two_sign=new Sign(125,winHeight-660,80,13,imgT2);stage.refresh(),window.setTimeout(function(){barrier_one_bl.paint(),barrier_one_br.paint(),barrier_one_sign.paint(),barrier_one_tl.paint(),barrier_one_tr.paint(),barrier_two.paint(),star.paint()},200),pub.touchTimer=window.setInterval(function(){touch.blinkErase(),touch.blink()},1e3/60),$("#container").on("touchstart",function(){pub.run===!1&&(window.clearInterval(pub.touchTimer),controller.timer=window.setInterval(function(){gameTimer.run(),$gameTimer.text(gameTimer.getTime())},50),$(document).on("touchstart",function(){star.jump()}),stage.run(),pub.run=!0,pub.isStart=!0)})});