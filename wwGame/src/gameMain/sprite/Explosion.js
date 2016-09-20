var Explosion = cc.Sprite.extend({
    _context:null,
    _active: true,
    animation: null,
    _exp_time:0.5,
    ctor: function (x,y) {
        this._super();
        var ps = cc.Sprite.create("#explosion_01.png");
        this._active=1;
        this.addChild(ps);
        this.x=x;
        this.y=y;
    },
    play: function () {
        this.stopAllActions();
        var animFrames = [];
        var str = "";
        for (var i = 1; i < 35; i++) {
            str = "explosion_" + (i < 10 ? ("0" + i) : i) + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }
        var animation = new cc.Animation(animFrames, 0.01);
        this.animation=cc.animate(animation);
        this.runAction(this.animation);
        this.schedule(this.destroy, this._exp_time);//启动陨石制造；
    },
    destroy: function () {
        var index=this.getIndexFromArr(GC.CONTAINER.EXPLOSION,this);
        GC.CONTAINER.EXPLOSION.splice(index, 1);//从爆炸管理数组中去掉该爆炸；
        this.unschedule(this.shoot);
        this._active=0;
        this.visible = false;
        this.active = false;
        this.stopAllActions();
    },
    getIndexFromArr:function(Arr,con){

        for(var i=0;i<Arr.length;i++){
            if(Arr[i]==con){
                return i;
            }
        }
        return null;
    }
});
Explosion.getOrCreateExplosion = function (x,y) {
    var selChild = Explosion.create(x,y);
    selChild.play();
    return selChild;
};
Explosion.create = function (x,y) {
    var explosion = new Explosion(x,y);
    GC.CONTAINER.EXPLOSION.push(explosion);//加入爆炸管理容器；
    GamePanelLayer.addChild(explosion);
    return explosion;
};
Explosion.destroySelf = function () {
    this.destroy();
};