cc.Class({
    extends: cc.Component,

    properties: {

        failBg: cc.Node,
        successBg: cc.Node,

        againButton: cc.Button,
        buttonAudio:cc.AudioClip,
    },

    againButtonClicked: function() {

        if(!this.isLoadingScene)
        {
            this.isLoadingScene = true;
            cc.audioEngine.playEffect(this.buttonAudio, false);
            cc.director.loadScene("Game");
        }
    },

    onLoad: function () 
    {
        window.Global.alreadyPlayOnce = true;

        cc.director.preloadScene("Game");

        this.isLoadingScene = false;
        if(window.Global.gameStatus)
        {
            this.failBg.active = false;
            this.successBg.active = true;
        }
        else
        {
            this.failBg.active = true;
            this.successBg.active = false;
        }
    },

    // update: function (dt) {

    // },
});
