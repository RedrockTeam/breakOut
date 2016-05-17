"use strict";function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function t(t,e){for(var i=0;i<e.length;i++){var r=e[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,i,r){return i&&t(e.prototype,i),r&&t(e,r),e}}();$(window).on("scroll.elasticity",function(t){t.preventDefault()}).on("touchmove.elasticity",function(t){t.preventDefault()}),$(document).ready(function(){function randomCircleSpeed(){var t=[.02,.025,.03,.035,.04],e=t.length;return t[Math.floor(Math.random()*e)]}function randomBlockSpeed(){var t=[1.5,1.7,1.8,2,2.2,2.5,3],e=t.length;return t[Math.floor(Math.random()*e)]}$(document).on("touchstart",function(t){return t.preventDefault()}),window.innerHeight>568&&(document.querySelector("#canvas").height=window.innerHeight);var winHeight=window.innerHeight,$pause=$("#pause");$pause.on("touchstart",function(){});var $gameBarrier=$("#game-barrier"),$gameTimer=$("#game-timer"),gameTimer={minute:0,second:0,millisec:0,run:function(){this.millisec+=5,this.millisec>=100&&(this.second++,this.millisec=0),this.second>=60&&(this.minute++,this.second=0)},getTime:function(){var t="";return this.minute<10&&(t+="0"),t+=this.minute,t+=" : ",this.second<10&&(t+="0"),t+=this.second,t+=" : ",this.millisec<10&&(t+="0"),t+=this.millisec}},controller={timer:null,startTime:null,totalTime:0,stopTimer:function(){window.clearInterval(this.timer)}},pub={canvas:document.querySelector("#canvas"),context:document.querySelector("#canvas").getContext("2d"),timer:null,run:!1,isStart:!1,touchTimer:null,currentLevel:0,rolled:0,renderBarrier:[0,3],barrierHeightArr:[winHeight-500-15,winHeight-800-15,winHeight-1200-15,winHeight-1550-15,winHeight-1900-15,winHeight-2300-15,winHeight-2500-15,winHeight-2800-15],judgeRenderArr:[[150,510],[510,800],[800,1200],[1200,1600],[1600,1900],[1900,3e3]],judgeRender:function(){var t=this.rolled,e=0,i=this.judgeRenderArr;i.forEach(function(i,r){i[0]<=t&&i[1]>=t&&(e=r+1)}),this.renderBarrier=[e,3+e]},judgeLevel:function(){var t=star.top,e=this.barrierHeightArr,i=0;e.forEach(function(e,r){e>=t&&(i=r+1)}),i>this.currentLevel&&(this.currentLevel=i,$gameBarrier.text(this.currentLevel))},stopTimer:function(){window.clearInterval(this.timer)},gameOver:function(){controller.totalTime+=new Date-controller.startTime,console.log("Total time is: "+parseInt(controller.totalTime/6e4)+":"+parseInt(controller.totalTime%6e4/1e3)+":"+parseInt(controller.totalTime%6e4%1e3/10)),console.log("Current level: "+pub.currentLevel),this.stopTimer(),console.log("Game over"),localStorage.breakOut_score=pub.currentLevel,localStorage.breakOut_minute=parseInt(controller.totalTime/6e4),localStorage.breakOut_second=parseInt(controller.totalTime%6e4/1e3),localStorage.breakOut_msec=parseInt(controller.totalTime%6e4%1e3/10),window.location.href="./result.html"},isWin:function(t,e){t.top<=e.top+e.height-30&&this.gameOver()}},Stage=function(){function Stage(){_classCallCheck(this,Stage),this.context=pub.context,this.startX=0,this.startY=0,this.width=320,this.height=document.querySelector("#canvas").height,this.upFlag=!1,this.upPosLow=window.innerHeight/2.5}return _createClass(Stage,[{key:"refresh",value:function(){this.context.clearRect(this.startX,this.startY,this.width,this.height)}},{key:"up",value:function(t){this.upFlag=t<this.upPosLow,this.upFlag&&(this.context.translate(0,2),this.upPosLow-=2,this.startY-=2,window.innerHeight-=2,pub.rolled+=2)}},{key:"run",value:function run(){pub.timer=setInterval(function(){stage.refresh(),stage.up(star.getPos()[1]),star.getHighestPos(),pub.judgeRender();for(var i=pub.renderBarrier[0];i<=pub.renderBarrier[1];i++)gameController[i].forEach(function(item){return eval(item)});star.fall(),pub.judgeLevel(),console.log(pub.rolled)},1e3/60)}}]),Stage}(),Star=function(){function t(e){_classCallCheck(this,t),this.context=pub.context,this.top=e.top,this.left=e.left,this.width=e.width,this.height=e.height,this.img=e.img,this.timer=null,this.exp=.1}return _createClass(t,[{key:"paint",value:function(){this.context.drawImage(this.img,this.left,this.top)}},{key:"jump",value:function(){this.exp=-3.5}},{key:"fall",value:function(){this.top+=this.exp,this.exp+=.2,this.paint(),this.isEnd()}},{key:"isEnd",value:function(){this.top>window.innerHeight&&(console.log("Fall down game over"),pub.gameOver())}},{key:"getPos",value:function(){return[this.left+this.width/2,this.top+this.height/2]}},{key:"collision",value:function(t,e,i){var r=this.getPos()[1];Math.abs(t-r)<i&&e&&(console.log("collision"),pub.gameOver())}},{key:"getHighestPos",value:function(){var t=this.getPos()[1];t<this.reachHeight&&(this.reachHeight=t)}}]),t}(),Circle=function(){function t(e){_classCallCheck(this,t),this.context=pub.context,this.start={x:e.x,y:e.y},this.width=e.width,this.height=e.height,this.img=e.img,this.rotateDeg=e.rotateDegree,this.initDegree=e.rotateDegree,this.testPoint={up:{y:this.start.y+10,zone:e.zoneUp,status:!0},down:{y:this.start.y-10+this.height,zone:e.zoneDown,status:!0}},this.rotateSpeed=e.rotateSpeed}return _createClass(t,[{key:"paint",value:function(){this.context.save(),this.context.translate(this.start.x+.5*this.width,this.start.y+.5*this.height),this.context.rotate(this.rotateDeg),this.context.drawImage(this.img,-.5*this.width,-.5*this.height),this.context.restore()}},{key:"rotate",value:function(){var t=this;this.context.save(),this.context.translate(this.start.x+.5*this.width,this.start.y+.5*this.height),this.context.rotate(this.rotateDeg),this.context.restore(),this.rotateDeg+=this.rotateSpeed,this.rotateDeg>=2*Math.PI+this.initDegree&&(this.rotateDeg=this.initDegree);var e=0,i=0;this.testPoint.up.zone.map(function(i){return e+=t.rotateDeg>=i[0]&&t.rotateDeg<=i[1]}),this.testPoint.down.zone.map(function(e){return i+=t.rotateDeg>=e[0]&&t.rotateDeg<=e[1]}),this.testPoint.up.status=!(e>0),this.testPoint.down.status=!(i>0),this.paint()}}]),t}(),Block=function(){function t(e){_classCallCheck(this,t),this.context=pub.context,this.left=e.left,this.top=e.top,this.width=e.width,this.height=e.height,this.img=e.img,this.direction=e.direction,this.speed=e.speed,this.maxLeft=e.maxLeft,this.maxRight=e.maxRight,this.zone=e.zone,this.testPoint=this.top+this.height/2,this.isClose=!0}return _createClass(t,[{key:"paint",value:function(){this.context.drawImage(this.img,this.left,this.top)}},{key:"move",value:function(){var t=this.left+this.width/2,e=0,i=this.speed;this.zone.map(function(i){return e+=t>=i[0]&&t<=i[1]}),this.isClose=e>0,(this.direction&&t>=this.maxRight||!this.direction&&t<=this.maxLeft)&&(this.direction=!this.direction),this.direction?this.left+=i:this.left-=i,this.paint()}}]),t}(),Sign=function(){function t(e){_classCallCheck(this,t),this.context=pub.context,this.left=e.left,this.top=e.top,this.width=e.width,this.height=e.height,this.img=e.img,this.scale=1,this.flag=!1}return _createClass(t,[{key:"paint",value:function(){this.context.drawImage(this.img,this.left,this.top)}},{key:"blink",value:function(){this.scale>=1.3&&(this.flag=!1),this.scale<=1&&(this.flag=!0),this.flag?this.scale+=.005:this.scale-=.005,this.context.drawImage(this.img,this.left-this.width*this.scale/2,this.top-this.height*this.scale/2,this.width*this.scale,this.height*this.scale)}},{key:"blinkErase",value:function(){this.context.clearRect(0,this.top-40,window.innerWidth,window.innerHeight)}}]),t}(),stage=new Stage,touch=new Sign({left:167,top:winHeight-70,width:40,height:60,img:document.querySelector("#img-touch")}),star=new Star({top:winHeight-180,left:145,width:30,height:30,img:document.querySelector("#img-star")}),barrier_one_bl=new Block({left:0,top:winHeight-350,width:80,height:13,img:document.querySelector("#img-rope"),direction:!0,speed:randomBlockSpeed()+.5,maxLeft:40,maxRight:120,zone:[[110,120]]}),barrier_one_br=new Block({left:240,top:winHeight-350,width:80,height:13,img:document.querySelector("#img-rope"),direction:!1,speed:barrier_one_bl.speed,maxLeft:200,maxRight:280,zone:[[200,215]]}),barrier_one_tl=new Block({left:0,top:winHeight-500,width:80,height:13,img:document.querySelector("#img-rope"),direction:!0,speed:3,maxLeft:40,maxRight:120,zone:[[110,120]]}),barrier_one_tr=new Block({left:240,top:winHeight-500,width:80,height:13,img:document.querySelector("#img-rope"),direction:!1,speed:barrier_one_tl.speed,maxLeft:200,maxRight:280,zone:[[200,215]]}),sign_one=new Sign({left:115,top:winHeight-425,width:80,height:13,img:document.querySelector("#img-title-1")}),barrier_two_b=new Block({left:0,top:winHeight-700,width:100,height:18,img:document.querySelector("#img-water-1"),direction:!0,speed:randomBlockSpeed(),maxLeft:50,maxRight:270,zone:[[110,210]]}),barrier_two_t=new Block({left:220,top:winHeight-800,width:100,height:18,img:document.querySelector("#img-water-2"),direction:!0,speed:barrier_two_b.speed,maxLeft:50,maxRight:270,zone:[[110,210]]}),sign_two=new Sign({left:130,top:winHeight-750,width:80,height:13,img:document.querySelector("#img-title-2")}),barrier_three=new Circle({x:85,y:winHeight-1200,width:150,height:150,img:document.querySelector("#img-circle-1"),rotateDegree:0,rotateSpeed:randomCircleSpeed(),zoneUp:[[.8,2.4]],zoneDown:[[3.9,5.5]]}),sign_three=new Sign({left:130,top:winHeight-1125,width:80,height:13,img:document.querySelector("#img-title-3")}),barrier_four=new Circle({x:60,y:winHeight-1550,width:200,height:200,img:document.querySelector("#img-circle-4"),rotateDegree:0,rotateSpeed:randomCircleSpeed()-.01,zoneUp:[[.5,1],[2.1,2.6],[3.6,4.2],[5.1,5.7]],zoneDown:[[.5,1],[2.1,2.6],[3.6,4.2],[5.1,5.7]]}),sign_four=new Sign({left:130,top:winHeight-1450,width:80,height:13,img:document.querySelector("#img-title-4")}),barrier_five=new Circle({x:60,y:winHeight-1900,width:200,height:200,img:document.querySelector("#img-circle-3"),rotateDegree:0,rotateSpeed:randomCircleSpeed(),zoneUp:[[.5,1.6],[2.6,3.7],[4.7,5.7]],zoneDown:[[0,.5],[1.6,2.6],[3.7,4.7],[5.75,7]]}),sign_five=new Sign({left:120,top:winHeight-1800,width:80,height:13,img:document.querySelector("#img-title-5")}),barrier_six=new Circle({x:88,y:winHeight-2300,width:144,height:200,img:document.querySelector("#img-circle-2"),rotateDegree:0,rotateSpeed:randomCircleSpeed(),zoneUp:[[1.1,3.1],[4.2,6.2]],zoneDown:[[1.1,3.1],[4.2,6.2]]}),sign_six=new Sign({left:85,top:winHeight-2200,width:100,height:13,img:document.querySelector("#img-title-6")}),barrier_seven_mountain=new Block({left:220,top:winHeight-2400,width:100,height:21,img:document.querySelector("#img-mountain"),direction:!1,speed:3,maxLeft:50,maxRight:270,zone:[[110,210]]}),barrier_seven_grass=new Block({left:0,top:winHeight-2500,width:100,height:21,img:document.querySelector("#img-grass"),direction:!0,speed:randomBlockSpeed()+.5,maxLeft:50,maxRight:270,zone:[[110,210]]}),sign_seven=new Sign({left:100,top:winHeight-2450,width:80,height:13,img:document.querySelector("#img-title-7")}),barrier_eight=new Circle({x:85,y:winHeight-2800,width:150,height:150,img:document.querySelector("#img-circle-1"),rotateDegree:0,rotateSpeed:randomCircleSpeed()+.02,zoneUp:[[.8,2.4]],zoneDown:[[3.9,5.5]]}),sign_eight=new Sign({left:125,top:winHeight-2725,width:80,height:13,img:document.querySelector("#img-title-8")}),sign_finish=new Sign({left:110,top:winHeight-3e3,width:100,height:47,img:document.querySelector("#img-finish")}),gameController=[["touch.blink()"],["barrier_one_bl.move()","barrier_one_br.move()","barrier_one_tr.move()","barrier_one_tl.move()","sign_one.paint()"],["barrier_two_b.move()","barrier_two_t.move()","sign_two.paint()"],["barrier_three.rotate()","sign_three.paint()"],["barrier_four.rotate()","sign_four.paint()"],["barrier_five.rotate()","sign_five.paint()"],["barrier_six.rotate()","sign_six.paint()"],["barrier_seven_mountain.move()","barrier_seven_grass.move()","sign_seven.paint()"],["barrier_eight.rotate()","sign_eight.paint()"],["sign_finish.paint()","pub.isWin(star, sign_finish)"]];stage.refresh(),window.setTimeout(function(){barrier_one_bl.paint(),barrier_one_br.paint(),barrier_one_tl.paint(),barrier_one_tr.paint(),sign_one.paint(),barrier_two_b.paint(),barrier_two_t.paint(),sign_two.paint(),star.paint()},200),pub.touchTimer=window.setInterval(function(){touch.blinkErase(),touch.blink()},1e3/60),$("#container").on("touchstart",function(){pub.run===!1&&(window.clearInterval(pub.touchTimer),controller.timer=window.setInterval(function(){gameTimer.run(),$gameTimer.text(gameTimer.getTime())},50),controller.startTime=new Date,$(document).on("touchstart",function(){star.jump()}),stage.run(),pub.run=!0,pub.isStart=!0)}),$("#pause").on("touchstart",function(){pub.run&&(controller.totalTime+=new Date-controller.startTime,controller.startTime=null,pub.stopTimer(),controller.stopTimer(),$("#cover").addClass("cover-show"),console.log(controller.totalTime))}),$("#gohome").on("touchstart",function(){window.location.href="./index.html"}),$("#resume").on("touchstart",function(){$("#cover").removeClass("cover-show"),setTimeout(function(){stage.run(),controller.timer=window.setInterval(function(){gameTimer.run(),$gameTimer.text(gameTimer.getTime())},50),controller.startTime=new Date},1e3)})});