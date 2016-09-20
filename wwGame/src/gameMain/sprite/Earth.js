/**
 * Created by jd on 2014/10/20.
 */
var EARTH = null;
var Earth = cc.Sprite.extend({
    _context: null,
    _hp: 5,
    _alive_flag: 1,
    _aimFlag: 0,
    _menu:null,
    ctor: function (context, hp, zOder) {
        this._super(res.earth_1);
        this._context = context;//传入上下文环境;
        this._hp = hp;
        this.zOrder = zOder;
        this.init();
        EARTH = this;
    },
    /* 初始化*/
    init: function () {
        this.initBornSprite();
        var w = this.width, h = this.height;
        GC.CONTAINER.PLAYER.push(this);//加入全局变量；
    },
    /* 初始化创建精灵*/
    initBornSprite: function () {
        this.x = GC.EARTH_X;
        this.y = GC.EARTH_Y;
        this._alive_flag = 1;
        cc.log("the earth has be created");
    },
    /* 自毁*/
    destroy: function () {

       //Explosion.getOrCreateExplosion(this.x, this.y);
        this._alive_flag = 0;
        this.visible = false;
        this.active = false;
        this.stopAllActions();
        this.unschedule(this.shoot);
    },
    /* 地球旋转*/
    rotate: function (Dir) {
        if (Dir == 1) {
            this.runAction(cc.rotateBy(1, GC.EARTH_ANGLE));
        }
        if (Dir == 0) {
            this.runAction(cc.rotateBy(1, -GC.EARTH_ANGLE));
        }

    },

    addBullBtn:function(){
        var paNormal = new cc.Sprite(res.earth_2);
        var paSelected = new cc.Sprite(res.earth_2);
        var paDisabled = new cc.Sprite(res.earth_2);

        var pa = new cc.MenuItemSprite(
            paNormal, paSelected, paDisabled,
            function () {
                cc.log("点中地球");
                Earth.shoot();

                this.removeBullBtn();
            }, this);
        var menu = new cc.Menu(pa);
        menu.alignItemsHorizontallyWithPadding(10);
        this._menu=menu;
        this.addChild(menu);
        menu.x = this.width/2;
        menu.y = this.height/2;
    },
    removeBullBtn:function(){
        GC.BOOM_COUNT=0;
       this.removeChild(this._menu);
    },
    /* 获取撞击形状*/
    getCollideShape: function (x, y) {
        var w = this.width - 30, h = this.height - 30;
        return cc.rect(x - w / 2, y - h / 2, w, h);
    },
    /* 被撞击*/
    hurt: function (enm) {
        this._hp = this._hp - enm;
        cc.log("earth hp:" + this._hp);
        if (this._hp == 0) {
            this.destroy();
        }
    }
});
Earth.shoot=function(){
    for (var i = 0; i <= GC.BULL_COUNT; i++) {
        var bull = new Bull(GamePanelLayer, 1, 1);
        GC.CONTAINER.BULLET.push(bull);
        GamePanelLayer.addChild(bull);
    }
};