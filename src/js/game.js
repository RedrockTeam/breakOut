/*
 *   16-5-9
 *   慢慢切关卡吧 233
 * */

$(window).on('scroll.elasticity',function (e){e.preventDefault();}).on('touchmove.elasticity',function(e){e.preventDefault();});
/* 禁掉 webview 的拖动 */

$(document).ready(() => {

    $(document).on('touchstart', e => e.preventDefault());

    if (window.innerHeight > 568) {
        document.querySelector("#canvas").height = window.innerHeight;
    }
    /* 如果屏幕比预设值高, 那么更改 canvas 的高度 */

    const $pause = $("#pause");
    $pause.on('touchstart', () => {
        /*
         *   暂停按钮有很多坑 233
         * */
    });

    const $gameBarrier = $("#game-barrier");
    const $gameTimer = $("#game-timer");

    let gameTimer = {
        minute: 0,
        second: 0,
        millisec: 0,
        run () {
            this.millisec += 5;
            if (this.millisec >= 100) {
                this.second++;
                this.millisec = 0;
            }
            if (this.second >= 60) {
                this.minute++;
                this.second = 0;
            }
        },
        getTime () {
            var str = '';

            if (this.minute < 10) {
                str += '0';
            }
            str += this.minute;
            str += " : ";
            if (this.second < 10) {
                str += '0';
            }
            str += this.second;
            str += " : ";
            if (this.millisec < 10) {
                str += '0';
            }
            str += this.millisec;

            return str;

        }
    };

    let controller = {
        timer: null,
        startTime: null,
        totalTime: null,
        stopTimer () {
            window.clearInterval(this.timer);
        }
    };

    /*
     *   上面是关于游戏控制的一些奇怪东西
     *   下面是游戏 canvas 中运行的一些东西
     * */

    let pub = {
        canvas: document.querySelector("#canvas"),
        context: document.querySelector("#canvas").getContext("2d"),
        timer: null,
        run: false,
        isStart: false,
        touchTimer: null,
        currentLevel: 0,
        rolled: 0,
        renderBarrier: [0, 3],
        judgeRender () {
            //if (this.rolled >= 120 && this.rolled < 410) {
            //    this.renderBarrier = [1, 2];
            //} else if (this.rolled >= 410 && this.rolled < 340) {
            //    this.renderBarrier = [2, 3];
            //}
        },
        judgeLevel () {
            const reach = star.reachHeight;

            if (reach <= 150) {
                this.currentLevel = 1;
            }

            if (reach <= -170) {
                this.currentLevel = 2;
            }

            $gameBarrier.text(this.currentLevel);

            /*
             *   妈的里面的数据要手动改
             *   考虑下优雅的写法
             * */
        },
        stopTimer () {
            window.clearInterval(this.timer);
        },
        gameOver () {
            controller.totalTime = new Date() - controller.startTime;
            console.log("Total time is: " + controller.totalTime);

            this.stopTimer();
            controller.stopTimer();
            console.log("Game over");
        }
    };
    /*
     *   pub 伪全局对象
     *   @pub.timer 刷新 canvas 的 interval
     *   @pub.run 游戏是否正在运行
     *   @pub.isStart 是否已经开始了（防止开始之前暂停）
     *   @touchTimer 在整个屏幕没有开始刷新之前, 只对下面小手的区域地方刷新
     *   @currentLevel 记录关卡
     *   @judgeLevel 每次通过一个关卡就加 1
     *   @rolled 被卷去高度
     *   @renderBarrier 控制游戏需要渲染的关卡
     */

    let gameController = [
        [
            'touch.blink()'
        ],

        [
            'barrier_one_sign.paint()',
            'barrier_one_bl.move()',
            'barrier_one_br.move()',
            'star.collision(barrier_one_bl.testPoint, barrier_one_bl.isClose, 10)',
            'barrier_one_tr.move()',
            'barrier_one_tl.move()',
            'star.collision(barrier_one_tl.testPoint, barrier_one_tl.isClose, 10)'
        ],

        [
            'barrier_two_sign.paint()',
            'barrier_two.rotate()',
            'star.collision(barrier_two.testPoint.down.y, barrier_two.testPoint.down.status, 24)',
            'star.collision(barrier_two.testPoint.up.y, barrier_two.testPoint.up.status, 24)'
        ],

        [
            'barrier_three.rotate()',
            'star.collision(barrier_three.testPoint.down.y, barrier_three.testPoint.down.status, 22)',
            'star.collision(barrier_three.testPoint.up.y, barrier_three.testPoint.up.status, 22)'
        ]

    ];
    /*
     *   gameController
     *   二维数组, 第一维的每个元素代表关卡
     *   整个游戏运行所依赖的函数, 运行的时候从这里面取来...eval
     * */

    class Stage {

        constructor () {
            this.context = pub.context;
            this.startX = 0;
            this.startY = 0;
            this.width = 320;
            this.height = document.querySelector("#canvas").height;
            this.upFlag = false;
            this.upPosLow = window.innerHeight / 2.5 ;
            /* canvas 只有一个, 构造的时候不用传参 */
        }

        refresh () {
            this.context.clearRect(this.startX, this.startY, this.width, this.height);
            /* 重绘整个舞台 */
        }

        up (starTop) {
            this.upFlag = (starTop < this.upPosLow);
            /* 判断星星位置,是否向上走 */

            if (this.upFlag) {
                this.context.translate(0, 2);
                this.upPosLow -= 2;
                this.startY -= 2;

                window.innerHeight -= 2;
                pub.rolled += 2;
            }
            /*
             *   @starTop 星星位于屏幕的高度
             *   如果达到向上条件整个屏幕向下拉 3px
             *   减去 window.innerHeight 为了方便判断星星是否跳出屏幕下方
             * */
        }

        run () {
            pub.timer = setInterval(() => {

                stage.refresh();

                stage.up(star.getPos()[1]);

                star.getHighestPos();

                pub.judgeRender();

                for (let i = pub.renderBarrier[0]; i <= pub.renderBarrier[1]; i++) {
                    gameController[i].forEach(item => eval(item));
                }

                /*
                 *   运行整个游戏
                 *   强行变成了 eval 23333
                 * */

                star.fall();

                pub.judgeLevel();

                console.log(pub.rolled);
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
            this.reachHeight = this.top;
        }

        paint () {
            this.context.drawImage(this.img, this.left, this.top);
        }

        jump () {
            this.exp = -3.5;
        }

        fall () {
            this.top += this.exp;
            this.exp += .2;
            /* 模拟匀加速直线运动相同时间内 1 3 5... */
            this.paint();
            this.isEnd();
        }

        isEnd () {
            if (this.top > window.innerHeight) {
                console.log("Fall down game over");
                pub.gameOver();
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

        collision (posY, status, range) {
            let selfY = this.getPos()[1];

            if (Math.abs(posY - selfY) < range && status) {
                console.log("collision");
                pub.gameOver();
            }
        }
        /*
         *   collision
         *   检测星星是否碰撞了
         *   然后这里面也有一些碰撞之后的动作, 待写
         * */

        getHighestPos () {
            const curHeight = this.getPos()[1];

            if (curHeight < this.reachHeight) {
                this.reachHeight = curHeight;
            }

            //console.log("this height: " + this.reachHeight);
        }
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
                    y: this.start.y + 10,
                    zone: zoneUp,
                    status: true
                },
                down: {
                    y: this.start.y - 10 + this.height,
                    zone: zoneDown,
                    status: true
                }
            }
        }
        /*
         *   x, y 和上面星星的 top left 一个道理
         *   rotateDeg 已经旋转角度
         *   initDeg 初始旋转角度, 用在转了一圈之后重新开始转
         *   testPoint 上下检测碰撞的点 为啥 +10 -10 补上宽度的差
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
            //this.context.clearRect(-.5 * this.width, -.5 *this.height, this.width, this.height);
            this.context.restore();
            /* 通过改变画布的相对位置来进行重绘 */

            this.rotateDeg += .02;
            /* 单位时间转过弧度, 越大越快 */

            if(this.rotateDeg >= 2 * Math.PI + this.initDegree) {
                this.rotateDeg = this.initDegree;
            }
            /* 转了一圈之后重新转/判断 */

            //console.log(this.rotateDeg);

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

            this.testPoint = this.top + this.height/2;
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

            //this.context.clearRect(this.left, this.top, this.width, this.height);

            this.zone.map(item => count +=  (center >= item[0] && center <= item[1]));
            this.isClose = (count > 0);
            /* 判断是否能够碰撞 */

            if ((this.direction && center >= this.maxRight) || (!this.direction && center <= this.maxLeft)) {
                this.direction = !this.direction;
            }

            this.direction ? this.left += 2 : this.left -= 2;
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

        eat (starY) {
            var centerY = this.top + this.height / 2;
            console.log(centerY);

            if (Math.abs(centerY - starY) < 5) {
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

            this.scale = 1;
            this.flag = false;
        }

        paint () {
            this.context.drawImage(this.img, this.left, this.top);
        }

        blink () {

            if (this.scale >= 1.3) {
                this.flag = false;
            }
            if (this.scale <= 1) {
                this.flag = true;
            }
            this.flag ? this.scale += 0.005 :  this.scale -= 0.005;
            this.context.drawImage(this.img, this.left-(this.width * this.scale/2), this.top-(this.height * this.scale/2), this.width * this.scale, this.height * this.scale);

        }

        blinkErase () {
            this.context.clearRect(0, this.top - 40, window.innerWidth, window.innerHeight);
        }
        /* blinkErase 在游戏开始前的闪烁 */

    }
    /*
     *   class Sign
     *   标志的构造函数
     *   沿路的路标 下面的小手啥的
     * */

    const imgStar = document.querySelector("#img-star");
    const imgRope = document.querySelector("#img-rope");
    const imgTouch = document.querySelector("#img-touch");
    const imgT1 = document.querySelector("#img-title-1");
    const imgC1 = document.querySelector("#img-circle-1");
    const imgT2 = document.querySelector("#img-title-2");
    const imgC2 = document.querySelector("#img-circle-2");
    const winHeight = window.innerHeight;

    const stage = new Stage();
    const touch = new Sign(167, winHeight - 70, 40, 60, imgTouch);
    const star = new Star(winHeight - 180, 145, 30, 30, imgStar);

    const barrier_one_bl = new Block(0, winHeight - 300, 80, 13, imgRope, true, 40, 120, [[110, 120]]);
    const barrier_one_br = new Block(240, winHeight - 300, 80, 13, imgRope, false, 200, 280, [[200, 215]]);
    const barrier_one_sign = new Sign(110, winHeight - 350, 100, 13, imgT1);
    const barrier_one_tl = new Block(0, winHeight - 400, 80, 13, imgRope, true, 40, 120, [[110, 120]]);
    const barrier_one_tr = new Block(240, winHeight - 400, 80, 13, imgRope, false, 200, 280, [[200, 215]]);
    /* 第一关的五个东西 */

    const barrier_two = new Circle(60, winHeight - 750, 200, 200, imgC1, 0, [[0.7, 2.4]], [[3.9, 5.5]]);
    const barrier_two_sign = new Sign(125, winHeight - 660, 80, 13, imgT2);
    /* 第二关 一个圆 */


    const barrier_three = new Circle(60, winHeight - 1100, 200, 200, imgC2, 0, [[0.5, 1], [2.1, 2.6], [3.6, 4.2], [5.1, 5.7]], [[0.5, 1], [2.1, 2.6], [3.6, 4.2], [5.1, 5.7]]);
    /* 第三关 一个圆 */

    stage.refresh();

    window.setTimeout(() => {
        barrier_one_bl.paint();
        barrier_one_br.paint();
        barrier_one_sign.paint();
        barrier_one_tl.paint();
        barrier_one_tr.paint();
        barrier_two.paint();
        barrier_three.paint();
        star.paint();
    }, 200);

    pub.touchTimer = window.setInterval(function () {
        touch.blinkErase();
        touch.blink();
    }, 1000/60);

    /* 在 refresh 之后延时加载, 避免被擦掉, 只用画第一关, 其他的画了也看不到 */

    $("#container").on("touchstart", function () {

        if (pub.run === false) {

            window.clearInterval(pub.touchTimer);
            /* 不让那小手那一块儿闪了, 跟着整个画布一起刷新 */

            controller.timer = window.setInterval(() => {
                gameTimer.run();
                $gameTimer.text(gameTimer.getTime());
            }, 50);
            /* 不是 canvas 部分的计时器 */

            controller.startTime = new Date();
            /* 真正的游戏计时器 */

            $(document).on('touchstart', function () {
                star.jump();
            });

            stage.run();
            pub.run = true;
            pub.isStart = true;
        }
    });
});