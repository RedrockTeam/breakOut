"use strict";function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function t(t,e){for(var i=0;i<e.length;i++){var r=e[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,i,r){return i&&t(e.prototype,i),r&&t(e,r),e}}();$(window).on("scroll.elasticity",function(t){t.preventDefault()}).on("touchmove.elasticity",function(t){t.preventDefault()}),$(document).ready(function(){$(document).on("touchstart",function(t){return t.preventDefault()}),window.innerHeight>568&&(document.querySelector("#canvas").height=window.innerHeight);var $pause=$("#pause");$pause.on("touchstart",function(){});var $gameBarrier=$("#game-barrier"),$gameTimer=$("#game-timer"),gameTimer={minute:0,second:0,millisec:0,run:function(){this.millisec+=5,this.millisec>=100&&(this.second++,this.millisec=0),this.second>=60&&(this.minute++,this.second=0)},getTime:function(){var t="";return this.minute<10&&(t+="0"),t+=this.minute,t+=" : ",this.second<10&&(t+="0"),t+=this.second,t+=" : ",this.millisec<10&&(t+="0"),t+=this.millisec}},controller={timer:null,startTime:null,totalTime:null,stopTimer:function(){window.clearInterval(this.timer)}},pub={canvas:document.querySelector("#canvas"),context:document.querySelector("#canvas").getContext("2d"),timer:null,run:!1,isStart:!1,touchTimer:null,currentLevel:0,rolled:0,renderBarrier:[0,5],judgeRender:function(){},judgeLevel:function(){var t=star.reachHeight;150>=t&&(this.currentLevel=1),-170>=t&&(this.currentLevel=2),$gameBarrier.text(this.currentLevel)},stopTimer:function(){window.clearInterval(this.timer)},gameOver:function(){controller.totalTime=new Date-controller.startTime,console.log("Total time is: "+controller.totalTime),this.stopTimer(),controller.stopTimer(),console.log("Game over")}},gameController=[["touch.blink()"],["barrier_one_sign.paint()","barrier_one_bl.move()","barrier_one_br.move()","star.collision(barrier_one_bl.testPoint, barrier_one_bl.isClose, 10)","barrier_one_tr.move()","barrier_one_tl.move()","star.collision(barrier_one_tl.testPoint, barrier_one_tl.isClose, 10)"],["barrier_two_sign.paint()","barrier_two.rotate()","star.collision(barrier_two.testPoint.down.y, barrier_two.testPoint.down.status, 24)","star.collision(barrier_two.testPoint.up.y, barrier_two.testPoint.up.status, 24)"],["barrier_three.rotate()","star.collision(barrier_three.testPoint.down.y, barrier_three.testPoint.down.status, 22)","star.collision(barrier_three.testPoint.up.y, barrier_three.testPoint.up.status, 22)","barrier_three_sign.paint()"],["barrier_four.rotate()","star.collision(barrier_four.testPoint.down.y, barrier_four.testPoint.down.status, 22)","star.collision(barrier_four.testPoint.up.y, barrier_four.testPoint.up.status, 22)","barrier_four_sign.paint()"],["barrier_five.rotate()","star.collision(barrier_five.testPoint.up.y, barrier_five.testPoint.up.status, 22)","star.collision(barrier_five.testPoint.down.y, barrier_five.testPoint.down.status, 22)"]],Stage=function(){function Stage(){_classCallCheck(this,Stage),this.context=pub.context,this.startX=0,this.startY=0,this.width=320,this.height=document.querySelector("#canvas").height,this.upFlag=!1,this.upPosLow=window.innerHeight/2.5}return _createClass(Stage,[{key:"refresh",value:function(){this.context.clearRect(this.startX,this.startY,this.width,this.height)}},{key:"up",value:function(t){this.upFlag=t<this.upPosLow,this.upFlag&&(this.context.translate(0,2),this.upPosLow-=2,this.startY-=2,window.innerHeight-=2,pub.rolled+=2)}},{key:"run",value:function run(){pub.timer=setInterval(function(){stage.refresh(),stage.up(star.getPos()[1]),star.getHighestPos(),pub.judgeRender();for(var i=pub.renderBarrier[0];i<=pub.renderBarrier[1];i++)gameController[i].forEach(function(item){return eval(item)});star.fall(),pub.judgeLevel()},1e3/60)}}]),Stage}(),Star=function(){function t(e,i,r,n,s){_classCallCheck(this,t),this.context=pub.context,this.top=e,this.left=i,this.width=r,this.height=n,this.img=s,this.timer=null,this.exp=.1,this.reachHeight=this.top}return _createClass(t,[{key:"paint",value:function(){this.context.drawImage(this.img,this.left,this.top)}},{key:"jump",value:function(){this.exp=-3.5}},{key:"fall",value:function(){this.top+=this.exp,this.exp+=.2,this.paint(),this.isEnd()}},{key:"isEnd",value:function(){this.top>window.innerHeight&&(console.log("Fall down game over"),pub.gameOver())}},{key:"getPos",value:function(){return[this.left+this.width/2,this.top+this.height/2]}},{key:"collision",value:function(t,e,i){var r=this.getPos()[1];Math.abs(t-r)<i&&e&&(console.log("collision"),pub.gameOver())}},{key:"getHighestPos",value:function(){var t=this.getPos()[1];t<this.reachHeight&&(this.reachHeight=t)}}]),t}(),Circle=function(){function t(e,i,r,n,s,o,a,h,c){_classCallCheck(this,t),this.context=pub.context,this.start={x:e,y:i},this.width=r,this.height=n,this.img=s,this.rotateDeg=o,this.initDegree=o,this.testPoint={up:{y:this.start.y+10,zone:h,status:!0},down:{y:this.start.y-10+this.height,zone:c,status:!0}},this.rotateSpeed=a}return _createClass(t,[{key:"paint",value:function(){this.context.save(),this.context.translate(this.start.x+.5*this.width,this.start.y+.5*this.height),this.context.rotate(this.rotateDeg),this.context.drawImage(this.img,-.5*this.width,-.5*this.height),this.context.restore()}},{key:"rotate",value:function(){var t=this;this.context.save(),this.context.translate(this.start.x+.5*this.width,this.start.y+.5*this.height),this.context.rotate(this.rotateDeg),this.context.restore(),this.rotateDeg+=this.rotateSpeed,this.rotateDeg>=2*Math.PI+this.initDegree&&(this.rotateDeg=this.initDegree),console.log(this.rotateDeg);var e=0,i=0;this.testPoint.up.zone.map(function(i){return e+=t.rotateDeg>=i[0]&&t.rotateDeg<=i[1]}),this.testPoint.down.zone.map(function(e){return i+=t.rotateDeg>=e[0]&&t.rotateDeg<=e[1]}),this.testPoint.up.status=!(e>0),this.testPoint.down.status=!(i>0),this.paint()}}]),t}(),Block=function(){function t(e,i,r,n,s,o,a,h,c){_classCallCheck(this,t),this.context=pub.context,this.left=e,this.top=i,this.width=r,this.height=n,this.img=s,this.direction=o,this.maxLeft=a,this.maxRight=h,this.zone=c,this.testPoint=this.top+this.height/2,this.isClose=!0}return _createClass(t,[{key:"paint",value:function(){this.context.drawImage(this.img,this.left,this.top)}},{key:"move",value:function(){var t=this.left+this.width/2,e=0;this.zone.map(function(i){return e+=t>=i[0]&&t<=i[1]}),this.isClose=e>0,(this.direction&&t>=this.maxRight||!this.direction&&t<=this.maxLeft)&&(this.direction=!this.direction),this.direction?this.left+=2:this.left-=2,this.paint()}}]),t}(),Food=function(){function t(e,i,r,n,s){_classCallCheck(this,t),this.context=pub.context,this.left=e,this.top=i,this.width=r,this.height=n,this.img=s,this.isAte=!1}return _createClass(t,[{key:"paint",value:function(){this.context.drawImage(this.img,this.left,this.top)}},{key:"eat",value:function(t){var e=this.top+this.height/2;console.log(e),Math.abs(e-t)<5&&(this.isAte=!0),this.isAte||this.paint()}}]),t}(),Sign=function(){function t(e,i,r,n,s){_classCallCheck(this,t),this.context=pub.context,this.left=e,this.top=i,this.width=r,this.height=n,this.img=s,this.scale=1,this.flag=!1}return _createClass(t,[{key:"paint",value:function(){this.context.drawImage(this.img,this.left,this.top)}},{key:"blink",value:function(){this.scale>=1.3&&(this.flag=!1),this.scale<=1&&(this.flag=!0),this.flag?this.scale+=.005:this.scale-=.005,this.context.drawImage(this.img,this.left-this.width*this.scale/2,this.top-this.height*this.scale/2,this.width*this.scale,this.height*this.scale)}},{key:"blinkErase",value:function(){this.context.clearRect(0,this.top-40,window.innerWidth,window.innerHeight)}}]),t}(),imgStar=document.querySelector("#img-star"),imgRope=document.querySelector("#img-rope"),imgTouch=document.querySelector("#img-touch"),imgT1=document.querySelector("#img-title-1"),imgC1=document.querySelector("#img-circle-1"),imgT2=document.querySelector("#img-title-2"),imgC2=document.querySelector("#img-circle-2"),imgT3=document.querySelector("#img-title-3"),imgC3=document.querySelector("#img-circle-3"),imgT4=document.querySelector("#img-title-4"),imgC4=document.querySelector("#img-circle-4"),winHeight=window.innerHeight,stage=new Stage,touch=new Sign(167,winHeight-70,40,60,imgTouch),star=new Star(winHeight-180,145,30,30,imgStar),barrier_one_bl=new Block(0,winHeight-300,80,13,imgRope,!0,40,120,[[110,120]]),barrier_one_br=new Block(240,winHeight-300,80,13,imgRope,!1,200,280,[[200,215]]),barrier_one_sign=new Sign(110,winHeight-350,100,13,imgT1),barrier_one_tl=new Block(0,winHeight-400,80,13,imgRope,!0,40,120,[[110,120]]),barrier_one_tr=new Block(240,winHeight-400,80,13,imgRope,!1,200,280,[[200,215]]),barrier_two=new Circle(60,winHeight-750,200,200,imgC1,0,.02,[[.7,2.4]],[[3.9,5.5]]),barrier_two_sign=new Sign(125,winHeight-660,80,13,imgT2),barrier_three=new Circle(60,winHeight-1100,200,200,imgC2,0,.01,[[.5,1],[2.1,2.6],[3.6,4.2],[5.1,5.7]],[[.5,1],[2.1,2.6],[3.6,4.2],[5.1,5.7]]),barrier_three_sign=new Sign(130,winHeight-1e3,80,13,imgT3),barrier_four=new Circle(60,winHeight-1500,200,200,imgC3,0,.02,[[.5,1.6],[2.6,3.7],[4.7,5.7]],[[0,.5],[1.6,2.6],[3.7,4.7],[5.75,7]]),barrier_four_sign=new Sign(125,winHeight-1400,80,13,imgT4),barrier_five=new Circle(60,winHeight-2e3,215,300,imgC4,0,.04,[[1,3],[4.3,6.15]],[[1,3],[4.3,6.15]]);stage.refresh(),window.setTimeout(function(){barrier_one_bl.paint(),barrier_one_br.paint(),barrier_one_sign.paint(),barrier_one_tl.paint(),barrier_one_tr.paint(),barrier_two.paint(),barrier_three.paint(),star.paint()},200),pub.touchTimer=window.setInterval(function(){touch.blinkErase(),touch.blink()},1e3/60),$("#container").on("touchstart",function(){pub.run===!1&&(window.clearInterval(pub.touchTimer),controller.timer=window.setInterval(function(){gameTimer.run(),$gameTimer.text(gameTimer.getTime())},50),controller.startTime=new Date,$(document).on("touchstart",function(){star.jump()}),stage.run(),pub.run=!0,pub.isStart=!0)})});