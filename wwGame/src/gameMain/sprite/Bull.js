/**
 * Created by jd on 2014/10/20.
 */
var Bull = cc.Sprite.extend({
    _hp: 1,
    _power: 1,
    _context: null,
    _alive_flag: 1,
    _angle:0,
    toX:0,
    toY:0,
    ctor: function (context, hp, power) {
        this._super(res.bull);
        this._context = context;//传入上下文环境;
        this._hp = hp;
        this._power=power;
        this.init();
    },
    init: function () {
        this.initBornSprite();
        this.shoot();
    },
    /* 初始化创造子弹*/
    initBornSprite: function () {
        this.x = GC.EARTH_X;
        this.y = GC.EARTH_Y;

    },
    /* 撞向陨石*/
    shoot: function () {
        var p=this.getRandomMumber();
        this.endX = p.x;
        this.endY = p.y;
        this.actionMoveDone = new cc.CallFunc(this.spriteMoveFinished, this);
        this.actionMove = cc.moveTo(4, cc.p(this.endX,this.endY));
        this.runAction(cc.sequence(this.actionMove, this.actionMoveDone));
    },
    /* 获取随机位置*/
    getRandomMumber: function () {
        var a = Math.random() * 360;
        var R=GC.EARTH_Y+100;
        var r_x=R*Math.cos(a)+GC.EARTH_X;
        var r_y=R*Math.sin(a)+GC.EARTH_Y;
        return cc.p(r_x, r_y);
    },
    /* 获取撞击形状*/
    getCollideShape: function (x, y) {
        var w = this.width, h = this.height;
        return cc.rect(this.x - w, this.y - h, w, h);
    },
    /* 撞击后*/
    hurt: function () {
         this.destroy();//销毁自己；
    },
    /* 自毁*/
    destroy: function () {
        this.deleFromArr();
        this.visible = false;
        this.active = false;
        this.stopAllActions();
        this.unschedule(this);
    },
    deleFromArr: function () {
        for (var i = 0; i < GC.CONTAINER.BULLET.length; i++) {
            if (GC.CONTAINER.BULLET[i] == this) {
                GC.CONTAINER.BULLET.splice(i, 1)
            }
        }
        return null;
    }
});
