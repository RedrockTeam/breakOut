$(window).on('scroll.elasticity',function (e){e.preventDefault();}).on('touchmove.elasticity',function(e){e.preventDefault();});
/* 禁掉 webview 的拖动 */

$(document).ready(() => {

    if (window.innerHeight > 568) {
        document.querySelector("#canvas").height = window.innerHeight;
    }
    /* 如果屏幕比预设值高, 那么更改 canvas 的高度 */

    const pub = {
        canvas: document.querySelector("#canvas"),
        context: document.querySelector("#canvas").getContext("2d"),
        timer: null,
        run: false,
        isStart: false,
        stopTimer () {
            window.clearInterval(this.timer);
        }
    };
    /*
     *   pub 伪全局对象
     *   @pub.timer 刷新 canvas 的 interval
     *   @pub.run 游戏是否正在运行
     *   @pub.isStart 是否已经开始了（防止开始之前暂停）
     */

    class Stage {

        constructor () {
            this.context = pub.context;
            this.startX = 0;
            this.startY = 0;
            this.width = 320;
            this.height = document.querySelector("#canvas").height;
            this.upFlag = false;
            this.upPosLow = window.innerHeight / 2;
            /* canvas 只有一个, 构造的时候不用传参 */
        }

        refresh () {
            this.context.clearRect(this.startX, this.startY, this.width, this.height);
            /* 重绘整个舞台 */
        }

        up (starTop) {
            this.upFlag = (ballTop < this.upPosLow);
            /* 判断星星位置,是否向上走 */

            if (this.upFlag) {
                this.context.translate(0, 3);
                this.upPosLow -= 3;
                this.startY -= 3;

                window.innerHeight -= 3;
            }
            /*
             *   @starTop 星星位于屏幕的高度
             *   如果达到向上条件整个屏幕向下拉 3px
             *   减去 window.innerHeight 为了方便判断星星是否跳出屏幕下方
             * */

        }

        run () {
            pub.timer = setInterval(() => {
                /*
                *   运行整个游戏
                *   里面的函数根据实际情况写
                * */
            }, 1000/60);
        }
    }
    /*
    *   class Stage
    *   运行整个游戏的舞台
    * */

    class Star {
        constructor (top, left, width, height, img) {
            this.context = pub.context;

            this.top = top;
            this.left = left;
            this.width = width;
            this.height = height;
            this.img = img;

            this.timer = null;
            this.exp = .1;
        }

        paint () {
            this.context.drawImage(this.img, this.left, this.top);
        }

        jump () {
            this.exp = -5;
        }

        fall () {
            this.top += this.exp;
            this.exp += .2;
            /* 模拟匀加速直线运动相同时间内 1 3 5... */
            this.paint();
            this.isEnd();
        }

        isEnd () {
            if (this.top > pub.playgroundHeight) {
                console.log("Fall down game over");
                pub.stopTimer();
            }
        }
        /*
        *   isEnd
        *   判断是否掉落出屏幕外
        *   掉出去之后的动作待写
        * */

        getPos () {
            return [this.left + this.width / 2, this.top + this.height / 2];
        }
        /*
        *   getPos
        *   获取星星中心点的坐标 [x, y]
        * */

        collision (posY, status) {
            let selfY = this.getPos()[1];

            if (Math.abs(posY - selfY) < 10 && status) {
                console.log("collision");
                console.log("game over");

                pub.stopTimer();
            }
        }
        /*
        *   collision
        *   检测星星是否碰撞了
        *   然后这里面也有一些碰撞之后的动作, 待写
        * */
    }
    /*
    *   class Star
    *   很跳的小星星
    * */

    class Circle {
        constructor (x, y, width, height, img, rotateDegree, zoneUp, zoneDown) {
            this.context = pub.context;

            this.start = {
                x,
                y
            };

            this.width = width;
            this.height = height;
            this.img = img;
            this.rotateDeg = rotateDegree;
            this.initDegree = rotateDegree;
            this.testPoint = {
                up: {
                    y: this.start.y,
                    zone: zoneUp,
                    status: true
                },
                down: {
                    y: this.start.y + this.height,
                    zone: zoneDown,
                    status: true
                }
            }
        }
        /*
        *   x, y 和上面星星的 top left 一个道理
        *   rotateDeg 已经旋转角度
        *   initDeg 初始旋转角度, 用在转了一圈之后重新开始转
        *   testPoint 上下检测碰撞的点
        *   zoneUp 和 zoneDown 传二维数组
        * */

        paint () {
            this.context.save();
            this.context.translate(this.start.x + .5 * this.width, this.start.y + .5 * this.height);
            this.context.rotate(this.rotateDeg);
            this.context.drawImage(this.img, -.5 * this.width, -.5 * this.height);
            this.context.restore();
        }

        rotate () {
            this.context.save();
            this.context.translate(this.start.x + .5 * this.width, this.start.y + .5 * this.height);
            this.context.rotate(this.rotateDeg);
            this.context.clearRect(-.5 * this.width, -.5 *this.height, this.width, this.height);
            this.context.restore();
            /* 通过改变画布的相对位置来进行重绘 */

            this.rotateDeg += .02;
            /* 单位时间转过弧度, 越大越快 */

            if(this.rotateDeg >= 2 * Math.PI + this.initDegree) {
                this.rotateDeg = this.initDegree;
            }
            /* 转了一圈之后重新转/判断 */

            let upCount = 0;
            let downCount = 0;

            this.testPoint.up.zone.map(item => upCount += (this.rotateDeg >= item[0] && this.rotateDeg <= item[1]));
            this.testPoint.down.zone.map(item => downCount += (this.rotateDeg >= item[0] && this.rotateDeg <= item[1]));

            this.testPoint.up.status = !(upCount > 0);
            this.testPoint.down.status = !(downCount > 0);
            /*
            *   upCount 判断圆上面的点是否在碰撞范围内
            *   downCount 判断圆下面的点是否在碰撞范围内
            * */

            this.paint();
        }
    }
    /*
    *   Circle
    *   圆形的障碍物的构造函数
    * */

    class Block {
        constructor (left, top, width, height, img, direction, maxLeft, maxRight, zone) {
            this.context = pub.context;

            this.left = left;
            this.top = top;
            this.width = width;
            this.height = height;
            this.img = img;
            this.direction = direction;
            this.maxLeft = maxLeft;
            this.maxRight = maxRight;
            this.zone = zone;
            /*
            *   top 方块左边距画布左边位置
            *   left 方块顶端距画布顶端位置
            *   direction 初始移动方向 true -> 向右移动
            *   zone 空隙区域
            * */

            this.isClose = true;
            /* isClose 能否碰撞 */

            /* 构造函数写完了都用解构赋值重新写一下 */
            //[this.context, this.width, this.height, this.img, this.direction, this.left, this.top] = [...arguments];
        }

        paint () {
            this.context.drawImage(this.img, this.left, this.top);
        }

        move () {
            let center = this.left + this.width / 2;
            let count = 0;
            /*
            *   center 图形的中心点
            *   count 判断碰撞的标记
            * */

            this.context.clearRect(this.left, this.top, this.width, this.height);

            this.zone.map(item => count +=  (center >= item[0] && center <= item[1]));
            this.isClose = (count > 0);
            /* 判断是否能够碰撞 */

            if ((this.direction && center >= this.maxRight) || (!this.direction && center <= this.maxLeft)) {
                this.direction = !this.direction;
            }

            this.direction ? this.left += 1 : this.left -= 1;
            /* 这里的 1 可以改变用来改变速度 越大越快 */

            this.paint();
        }
    }
    /*
     *   Block
     *   左右移动小方块的构造函数
     * */

    class Food {
        constructor (left, top, width, height, img) {
            this.context = pub.context;

            this.left = left;
            this.top = top;
            this.width = width;
            this.height = height;
            this.img = img;
            this.isAte = false;
        }

        paint () {
            this.context.drawImage(this.img, this.left, this.top);
        }

        eat (ballY) {
            var centerY = this.top + this.height / 2;
            console.log(centerY);

            if (Math.abs(centerY - ballY) < 5) {
                this.isAte = true;
            }

            if (!this.isAte) {
                this.paint();
            }
        }
    }
    /*
     *   Food
     *   食物的构造函数
     * */

    class Sign {
        constructor (left, top, width, height, img) {
            this.context = pub.context;

            this.left = left;
            this.top = top;
            this.width = width;
            this.height = height;
            this.img = img;
        }

        paint () {
            this.context.drawImage(this.img, this.left, this.top);
        }

        /* 应该还有点动画效果 */
    }
    /*
    *   class Sign
    *   标志的构造函数
    *   沿路的路标 下面的小手啥的
    * */

});