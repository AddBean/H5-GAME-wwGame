/**
 * Created by jd on 2014/10/20.
 */
/**
 * Created by jd on 2014/10/20.
 */
var Meteorolite = cc.Sprite.extend({
    _hp: 1,
    _power: 1,
    _context: null,
    _alive_flag: 1,
    _get_p:0,
    ctor: function (from,context,hp) {
        this._super();
        this._context = context;//传入上下文环境;
        this._hp = hp;
        this._from=from;
        this.init();
    },
    init: function () {
        this.initBornSprite();
        this.moveToPoint();

    },
    /* 初始化创造精灵*/
    initBornSprite: function () {

        var sp=null;
        switch(this._from){
            case 0:
                sp= new cc.Sprite(res.mete);
                this._power=1;
                this.scale=1;
                break;
            case 2:
                sp= new cc.Sprite(res.mete2);
                this._power=2;
                this.scale=1.1;
                break;
            case 3:
                sp= new cc.Sprite(res.mete3);
                this._power=3;
                this.scale=1.2;
                break;
            case 4:
                sp= new cc.Sprite(res.mete4);
                this._power=4;
                this.scale=1.3;
                break;
            case 5:
                sp= new cc.Sprite(res.mete5);
                this._power=5;
                this.scale=1.4;
                break;
            case 6://炸弹；
                sp= new cc.Sprite(res.mete6);
                this._power=0;
                break;
            case 7://加生命值
                sp= new cc.Sprite(res.mete7);
                this._power=0;
                break;
            default :
                sp= new cc.Sprite(res.mete);
                this._power=1;
                break;
        }
        this.addChild(sp);
        var p = this.getRandomMumber();
        this.x = p.x;
        this.y = p.y;
        GC.CONTAINER.ENEMIES.push(this);//加入全局变量；
        var angle= Math.atan((this.y-GC.EARTH_Y)/(this.x-GC.EARTH_X));
        // cc.log("angle:"+angle*(180/Math.PI));
        var ang=-(angle/Math.PI)*180+90;
        if(this.x<GC.W/2){
            ang=ang+180;
        }
        this.runAction(cc.rotateBy(0.01,ang));//调整方向
        //cc.log("Meteorolite has be created");
    },
    addParticleEffects:function(){
        var fire = new cc.ParticleMeteor();
        fire.texture = cc.textureCache.addImage(res.fire);
        fire.shapeType = cc.ParticleSystem.BALL_SHAPE;
        this.addChild(fire);
        fire.x=this.x;
        fire.y=this.y;
    },
    /* 撞向地球*/
    moveToPoint: function () {

        if(GC.PE==1){
           this.addParticleEffects();
        }
        this.endX = GC.EARTH_X;
        this.endY = GC.EARTH_Y;
        this.actionMoveDone = new cc.CallFunc(this.spriteMoveFinished, this);
        this.actionMove = cc.moveTo(GC.METE_SPEED, cc.p(this.endX, this.endY));

        this.runAction(cc.sequence(this.actionMove, this.actionMoveDone));
    },
    /* 获取撞击形状*/
    getCollideShape: function (x, y) {
        var w = this.width, h = this.height;
        // cc.log("x,y,w,h",x,y,w,h);
        return cc.rect(this.x - w, this.y - h, w, h);
    },
    /* 获取随机位置*/
    getRandomMumber: function () {
        var a = Math.random() * 360;
        var R=GC.EARTH_Y+100;
        var r_x=R*Math.cos(a)+GC.EARTH_X;
        var r_y=R*Math.sin(a)+GC.EARTH_Y;
        return cc.p(r_x, r_y);
    },
    /* 撞击后*/
    hurt: function () {
        this._hp--;
        if (this._hp == 0) {
            this.destroy();//销毁自己；
        }
    },
    /* 更新*/
    update: function (dt) {
        var x = this.x;
        var y = this.y;
        if ((x < 0 || x > 320) && (y < 0 || y > 480)) {
            this._alive_flag = false;
        }

        if (x < 0 || x > GamePanelLayer.screenRect.width || y < 0 || y > GamePanelLayer.screenRect.height || this.HP <= 0) {
            this._alive_flag = false;
            this.destroy();
        }

    },
    /* 自毁*/
    destroy: function () {
        Explosion.getOrCreateExplosion(this.x, this.y);
        if (GC.SOUND) {
            cc.audioEngine.playEffect(res.explodeEffect_mp3);
        }
        var index = this.getIndexFromArr(GC.CONTAINER.ENEMIES, this);
        GC.CONTAINER.ENEMIES.splice(index, 1);//从陨石管理数组中去掉该陨石；
        this.visible = false;
        this.active = false;
        this.stopAllActions();
        this.unschedule(this);
    },
    getIndexFromArr: function (Arr, con) {
        for (var i = 0; i < Arr.length; i++) {
            if (Arr[i] == con) {
                return i;
            }
        }
        return null;
    }
});
