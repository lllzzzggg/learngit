var comm = require("comm");
cc.Class({
    extends: cc.Component,

    properties: {
        bgAudio: {
            url: cc.AudioClip,
            default: null
        },  //背景音乐
    },

    // use this for initialization
    onLoad: function () {
        var startBg = cc.find('Canvas/game_01/startBg');
        var button2 = cc.find('Canvas/game_01/startBg/button');
        // var button = cc.find('Canvas/game_01/startBg/button2');
        startBg.on('touchstart',(ev)=>{
            cc.audioEngine.play(this.bgAudio, true, 0.7);
            button2.opacity = 255;
            startBg.runAction(cc.moveBy(1,cc.p(-2059,0)));
        })
        
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
