/**
 * Created by Administrator on 2014/9/22.
 */

var GC = GC || {};

GC.winSize = cc.size(320, 480);
GC.H = GC.winSize.height;
GC.W = GC.winSize.width;
GC.SCORE=0;

GC.EARTH_SPEED = 0.2;//地球旋转速度;
GC.EARTH_ANGLE = 15;//地球旋转角度;
GC.EARTH_R = 100;//地球半径;
GC.EARTH_X = 160;//地球半径;
GC.EARTH_Y = 240;//地球半径;

GC.METE_SPEED = 8;//陨石速度；
GC.CREAT_TIME = 1;//创造陨石时间间隔，计时方式也是分数；
GC.BULL_COUNT=50;//射出子弹数量；

GC.LIFE_ANGLE=0;//当前生命旋转的角度；
GC.LIFE_H=30;//生命的高度；
GC.LIFE_VALUE=3;//生命值;

GC.LEVEL_TIME=5;//关卡升级间隔；
GC.BOOM_COUNT=0;//初始炸弹数；
GC.LEVEL=1;//关卡；

GC.SOUND=1;//声效；
GC.PE=0;//粒子特效；
GC.GRIVITY=0;//重力控制；



//角色容器
GC.CONTAINER = {
    ENEMIES: [],
    PLAYER: [],
    EXPLOSION:[],//爆炸
    BULLET:[]
}
;
