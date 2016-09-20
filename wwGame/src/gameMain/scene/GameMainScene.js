/**
 * Created by Administrator on 2014/9/30.
 */
/*此为游戏主场景的逻辑控制及层显示初始化*/
var GamePanelLayer = null;
var GMSLayer = cc.Layer.extend({
        _earth: null,
        _lifeTree: null,
        _time: 0,
        _levelManager: null,
        _meteManager: null,
        _meteArr: null,
        _screenRect: null,//屏幕大小；
        _level: 0,
        _score_msg: null,
        _life_msg: null,
        _boom_msg: null,
        _boom_flag: 0,
        ctor: function () {
            this._super();
            this.init();
        },
        /* 初始化添加游戏对象、事件监听*/
        init: function () {
            cc.spriteFrameCache.addSpriteFrames(res.explosion_plist);
            this.initConst();//初始化全局变量；
            this.addControl();//添加控制；
            this.addSetButton();
            this.addBg();//添加背景；
            this.creatEarthAndLife();//创建地球;
            this.addMsg();

            this.schedule(this.creatMete, GC.CREAT_TIME);//启动陨石制造；
            this.scheduleUpdate();//每帧刷新；
            this.schedule(this.levelMang, GC.LEVEL_TIME);//启动陨石制造；

            this.getScreenRect();//获取屏幕大小；
            //Earth.shoot();

        },
        //画上分数；
        addMsg: function () {

            var msg_x = GC.W * 3 / 5 + 20;
            var msg_y = GC.H * 8 / 9 + 20;

            var boom_ico = new cc.Sprite(res.boom);
            boom_ico.x = msg_x - 80;
            boom_ico.y = msg_y + 3;
            this.addChild(boom_ico);

            var score_ico = new cc.Sprite(res.score_ico);
            score_ico.x = msg_x - 20;
            score_ico.y = msg_y + 3;
            this.addChild(score_ico);

            var life_ico = new cc.Sprite(res.life_ico);
            life_ico.x = msg_x + 40;
            life_ico.y = msg_y + 3;
            this.addChild(life_ico);


            //炸弹
            var Boom = new cc.LabelTTF(" " + GC.SCORE, "Arail", 20);
            Boom.x = msg_x - 60;
            Boom.y = msg_y;
            //分数
            var Score = new cc.LabelTTF(" " + GC.SCORE, "Arail", 20);
            Score.x = msg_x;
            Score.y = msg_y;
            //生命值
            var Life = new cc.LabelTTF(" " + GC.LIFE_VALUE, "Arail", 20);
            Life.x = msg_x + 60;
            Life.y = msg_y;
            this._score_msg = Score;
            this._life_msg = Life;
            this._boom_msg = Boom;
            this.addChild(Score);
            this.addChild(Life);
            this.addChild(Boom);
        },
        getScreenRect: function () {
            GamePanelLayer = this;
            var winSize = cc.director.getWinSize();
            this.screenRect = cc.rect(0, 0, winSize.width, winSize.height + 10);
        },
        /* 初始化全局量*/
        initConst: function () {
            cc.log("init const");
            GC.SCORE = 0;

            GC.EARTH_SPEED = 0.2;//地球旋转速度;
            GC.EARTH_ANGLE = 15;//地球旋转角度;
            GC.EARTH_R = 100;//地球半径;
            GC.EARTH_X = 160;//地球半径;
            GC.EARTH_Y = 240;//地球半径;

            GC.METE_SPEED = 8;//陨石速度；
            GC.CREAT_TIME = 1;//创造陨石时间间隔，计时方式也是分数；
            GC.BULL_COUNT = 50;//射出子弹数量；

            GC.LIFE_ANGLE = 0;//当前生命旋转的角度；
            GC.LIFE_H = 30;//生命的高度；
            GC.LIFE_VALUE = 3;//生命值;

            GC.LEVEL_TIME = 5;//关卡升级间隔；
            GC.BOOM_COUNT = 0;//初始炸弹数；
            GC.LEVEL = 1;//关卡；

            GC.SOUND = 1;//声效；
            GC.PE = 0;//粒子特效；
            GC.GRIVITY = 0;//重力控制；

            //角色容器清空
            GC.CONTAINER.ENEMIES = [];
            GC.CONTAINER.PLAYER = [];
            GC.CONTAINER.EXPLOSION = [];//爆炸
            GC.CONTAINER.BULLET = [];
        },
        //添加控制；
        addControl: function () {
            if (GC.GRIVITY == 0) {
                //重新开始按键；
                var paNormal = new cc.Sprite(res.left_btn);
                var paSelected = new cc.Sprite(res.left_btn2);
                var paDisabled = new cc.Sprite(res.left_btn2);

                var pa = new cc.MenuItemSprite(
                    paNormal, paSelected, paDisabled,
                    function () {
                        this._earth.rotate(0);//右转；
                        this._lifeTree.rotate(0);//右转；
                    }, this);


                var shNormal = new cc.Sprite(res.right_btn);
                var shSelected = new cc.Sprite(res.right_btn2);
                var shDisabled = new cc.Sprite(res.right_btn2);

                var sh = new cc.MenuItemSprite(
                    shNormal, shSelected, shDisabled,
                    function () {
                        this._earth.rotate(1);//左转；
                        this._lifeTree.rotate(1);//左转；
                    }, this);
                var menu = new cc.Menu(pa, sh);
                menu.alignItemsHorizontallyWithPadding(50);
                this.addChild(menu, 100, 2);

                menu.x = GC.W / 2;
                menu.y = GC.H / 8;
            } else {
                if ('accelerometer' in cc.sys.capabilities) {
                    // call is called 30 times per second
                    cc.inputManager.setAccelerometerInterval(1 / 30);
                    cc.inputManager.setAccelerometerEnabled(true);
                    cc.eventManager.addListener({
                        event: cc.EventListener.ACCELERATION,
                        callback: function (accelEvent, event) {
                            var target = event.getCurrentTarget();
                            cc.log('Accel x: ' + accelEvent.x + ' y:' + accelEvent.y + ' z:' + accelEvent.z + ' time:' + accelEvent.timestamp);
                            if (accelEvent.x > 10) {
                                this._earth.rotate(0);//左转；
                                this._lifeTree.rotate(0);//左转；
                            } else if (accelEvent.x < -10) {
                                this._earth.rotate(1);//右转；
                                this._lifeTree.rotate(1);//右转；
                            }

                        }
                    }, this);

                } else {
                    cc.log("ACCELEROMETER not supported");
                }
            }
        },
        addSetButton: function () {

            var b1 = new cc.LabelTTF("设置", "Arial", 20);
            var menu1 = new cc.MenuItemLabel(b1, function () {
                cc.log("设置");
                var scene = new cc.Scene();
                scene.addChild(new SetLayer());
                cc.director.runScene(new cc.TransitionFade(1.2, scene));
            });
            var cocos2dMenu1 = new cc.Menu(menu1);
            cocos2dMenu1.alignItemsVerticallyWithPadding(10);
            cocos2dMenu1.x = GC.W / 2 - 120;
            cocos2dMenu1.y = GC.H - 30;
            this.addChild(cocos2dMenu1, 2, 1);

        },
        /* 创建陨石*/
        creatMete: function () {
            // cc.log("创建陨石");
            GC.SCORE++;//每秒加1；
            for (var i = 0; i < GC.LEVEL; i++) {
                var ran = Math.floor(Math.random() * 10);
                var mete = new Meteorolite(ran, this, 1);
                this.addChild(mete);
            }

        },
        /* 难度管理*/
        levelMang: function () {
            switch (this._level) {
                case 0:
                    if (GC.METE_SPEED > 0.3) {
                        GC.METE_SPEED = GC.METE_SPEED - 0.04;
                        GC.LEVEL = 1;
                        cc.log("关卡1");

                    }
                    break;
                case 1:
                    if (GC.METE_SPEED > 0.3) {
                        GC.METE_SPEED = GC.METE_SPEED - 0.08;
                        GC.LEVEL = 2;
                        cc.log("关卡2");

                    }
                    break;
                case 2:
                    if (GC.METE_SPEED > 0.3) {
                        GC.METE_SPEED = GC.METE_SPEED - 0.1;
                        GC.LEVEL = 3;
                        cc.log("关卡3");
                    }
                    break;
                case 3:
                    if (GC.METE_SPEED > 0.3) {
                        GC.METE_SPEED = GC.METE_SPEED - 0.14;
                        GC.LEVEL = 4;
                        cc.log("关卡4");
                    }
                    break;
                default:
                    if (GC.METE_SPEED > 0.3) {
                        GC.METE_SPEED = GC.METE_SPEED - 0.1;

                    }
                    break;
            }
            cc.log("陨石移动速度：" + GC.METE_SPEED);
            this._level++;
        },
        /* 添加背景*/
        addBg: function () {
            cc.log("creating background");
            var BGLayer = new GMSBGLayer();
            this.addChild(BGLayer, 0, 0);
        },
        /* 添加地球和生命*/
        creatEarthAndLife: function () {
            cc.log("creating earth");
            var earth = new Earth(this, 10);
            var lifeTree = new LifeTree(this, GC.LIFE_VALUE);
            this.addChild(earth);
            this.addChild(lifeTree);
            this._earth = earth;
            this._lifeTree = lifeTree;
            LIFE = lifeTree;
        },
        /* 设置精灵位置*/
        setSpriteLoc: function (event) {
            var delta = event.getDelta();
            var curPos = cc.p(this._earth.x, this._earth.y);
            curPos = cc.pAdd(curPos, delta);
            curPos = cc.pClamp(curPos, cc.p(0, 0), cc.p(GC.winSize.width, GC.winSize.height));
            this._earth.x = curPos.x;
            this._earth.y = curPos.y;
        },
        /* 每帧检测*/
        update: function (dt) {
            this.checkIsCollide();
            //cc.log("random:"+Math.random());
        },
        /* 检测撞击*/
        checkIsCollide: function () {
            var earthChild = this._earth;
            //检测陨石与地球相撞；
            if (earthChild._alive_flag == 1) {
                //cc.log("刷新" + GC.CONTAINER.ENEMIES.length);
                for (var i = 0; i < GC.CONTAINER.ENEMIES.length; i++) {
                    var selChild = GC.CONTAINER.ENEMIES[i];
                    if (this.collide(selChild, earthChild)) {
                        // cc.log("检测到撞击地球");
                        //bulletChild.hurt(selChild._power);
//                        this._score_msg.runAction(cc.rotateBy(0.3, 360));//陨石动画
                        selChild.hurt();
                    }
                }
            }
            //检测陨石与生命相撞；
            var lifeChild = this._lifeTree;
            for (var i = 0; i < GC.CONTAINER.ENEMIES.length; i++) {
                var selChild = GC.CONTAINER.ENEMIES[i];
                if (this.collide(selChild, lifeChild)) {
                    cc.log("检测到撞击生命");
                    lifeChild.hurt(selChild._power);
                    selChild.hurt();
                    if (lifeChild._hp <= 0) {//死亡
                        this.gameOver();
                    }
                    if (selChild._from == 7) {//加1生命；
                        this._lifeTree.addHeart(1);
                    }
                    if (selChild._from == 6) {//加炸弹；
                        if (GC.BOOM_COUNT == 0) {
                            GC.BOOM_COUNT = 1;
                            this._earth.addBullBtn();
                        }
                    }
                }
                //检测子弹与陨石相撞；
                for (var j = 0; j < GC.CONTAINER.BULLET.length; j++) {
                    var bullChild = GC.CONTAINER.BULLET[j];
                    if (this.collide2(bullChild, selChild)) {
                        cc.log("子弹击中陨石");
                        selChild.hurt(selChild._power);
                        bullChild.hurt(1);
                    }
                }
            }
            //检测子弹是否打出边界；
            for (var i = 0; i < GC.CONTAINER.BULLET.length; i++) {
                var bullChild = GC.CONTAINER.BULLET[i];
                if (Math.pow(bullChild.x - GC.EARTH_X, 2) + Math.pow(bullChild.y - GC.EARTH_Y, 2) > Math.pow(200, 2)) {
                    bullChild.hurt(1);
                }
            }
            cc.log("lenght:" + GC.CONTAINER.BULLET.length);
            GC.LIFE_VALUE = this._lifeTree._hp;
            //更新分数系统：
            if (this._lifeTree._alive_flag == 1) {
                var score_str = " " + GC.SCORE;
                var life_str = " " + GC.LIFE_VALUE;
                var boom_str = " " + GC.BOOM_COUNT;
                this._score_msg.setString(score_str);
                this._life_msg.setString(life_str);
                this._boom_msg.setString(boom_str);
            } else {
                var life_str = " " + 0;
                this._life_msg.setString(life_str);
            }

        },
        /* 添加子弹*/
        addBull: function () {

        },
        /* 判断撞击*/
        collide: function (a, b) {
            var ax = a.x, ay = a.y, bx = b.x, by = b.y;
            var aRect = a.getCollideShape(ax, ay);
            var bRect = b.getBoundingBox();
            return cc.rectIntersectsRect(aRect, bRect);
        },
        /* 判断撞击*/
        collide2: function (a, b) {
            var aRect = a.getBoundingBox();
            var bRect = b.getBoundingBox();
            return cc.rectIntersectsRect(aRect, bRect);
        },
        gameOver: function () {
            var scene = new cc.Scene();
            var msg = null;
            if (GC.SCORE < 10) {
                msg = "太惨了！";
            } else if (GC.SCORE < 50) {
                msg = "值得努力！";
            } else if (GC.SCORE < 100) {
                msg = "不错！";
            } else if (GC.SCORE < 150) {
                msg = "很好！";
            } else if (GC.SCORE < 200) {
                msg = "非常好！";
            } else if (GC.SCORE < 250) {
                msg = "超神了！";
            } else if (GC.SCORE < 300) {
                msg = "碉堡了！";
            } else if (GC.SCORE < 400) {
                msg = "吊炸天！";
            } else {
                msg = "你已经无敌了！";
            }
            scene.addChild(new GMOLayer(GC.SCORE, msg));
            cc.director.runScene(new cc.TransitionFade(1.2, scene));
        }
    })
    ;
GMSLayer.scene = function () {
    var scene = new cc.Scene();
    var layer = new GMSLayer();
    scene.addChild(layer);
    return scene;
};

