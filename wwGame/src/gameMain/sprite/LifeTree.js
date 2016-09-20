/**
 * Created by jd on 2014/10/20.
 */
var LIFE=null;
var LifeTree = cc.Sprite.extend({
    _alive_flag:1,
    _hp: 5,
    _context: null,
    _pathArr: new Array(),
    _lifeTree:null,
    _pos_x:null,
    _pos_y:null,
    ctor: function (context, hp) {
        this._super(res.lifetree);
        this._context = context;//传入上下文环境;
        this._hp = hp;
        this.init();

    },
    init: function () {
        this.initBornSprite();
        GC.CONTAINER.PLAYER.push(this);//加入全局变量；
    },
    initBornSprite: function () {
        this._alive_flag=1;
        this.x = GC.EARTH_X;
        this.y = GC.EARTH_Y;
        //this._lifeTree.runAction(cc.rotateBy(0.1,45));//调整方向
        this.anchorX =1.6;
        this.anchorY =1.6;
        //cc.log("the life has be created");
    },
    /* 自毁*/
    destroy: function () {
        Explosion.getOrCreateExplosion(this.x, this.y);
        if (GC.SOUND) {
            cc.audioEngine.playEffect(res.destroyEffect_mp3);
        }
        this._alive_flag=0;
        this.visible = false;
        this.active = false;
        this.stopAllActions();
        this.unschedule(this.shoot);
    },

    move: function () {
        for (var i = 0; i < 360 / GC.EARTH_ANGLE; i++) {
            this._pathArr[i] = cc.p(GC.EARTH_R * Math.cos(i * GC.EARTH_ANGLE) + GC.EARTH_X,
                    GC.EARTH_R * Math.sin(i * GC.EARTH_ANGLE) + GC.EARTH_Y);

        }
        var delay = cc.delayTime(0.25);
        var action1 = cc.cardinalSplineBy(10, this._pathArr, 0);
        var seq = cc.sequence(action1, delay);
        this.x = 50;
        this.y = 50;
        this.runAction(seq);
    },
    addHeart:function(xp){
        this._hp=this._hp+xp;
    },
    rotate: function (Dir) {
//        var draw = new cc.DrawNode();
//        draw.drawRect(cc.p(0 ,0),cc.p(this.x ,this.y),  cc.color(200, 200, 250, 50), 1, cc.color(200, 200, 250, 50));
//        this.addChild(draw);
        var action2=cc.rotateBy(GC.EARTH_SPEED, -GC.EARTH_ANGLE);
        var action1=cc.rotateBy(GC.EARTH_SPEED, GC.EARTH_ANGLE);
        if (Dir == 0) {
            GC.LIFE_ANGLE=GC.LIFE_ANGLE+GC.EARTH_ANGLE;
            this.runAction(action1.clone());
        }
        if (Dir == 1) {
            GC.LIFE_ANGLE=GC.LIFE_ANGLE-GC.EARTH_ANGLE;
            this.runAction(action2.clone());
        }
    },
    getCollideShape: function (x, y) {
        var w = 10, h = 10;
//        var px=this.x+(GC.EARTH_R+GC.LIFE_H)*Math.cos(GC.LIFE_ANGLE);
//        var py=this.y+(GC.EARTH_R+GC.LIFE_H)*Math.sin(GC.LIFE_ANGLE);
        return cc.rect(x - w, y - h, w, h);
    },
    hurt: function (power) {
        this._hp=this._hp-power;
        cc.log("life tree:"+this._hp);
        if(this._hp<=0){
            this.destroy();
        }
    }

});
