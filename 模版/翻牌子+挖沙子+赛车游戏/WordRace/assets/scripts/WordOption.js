cc.Class({
    extends: cc.Component,

    properties: {
        imageSprite: cc.Sprite,
    },
    // use this for initialization
    onLoad: function () {
    },

    init: function (target, word) {
        this.target = target;
        this.wordName = word.qescont;
        this.audioUrl = word.quescontsound;

        var self = this;
        cc.loader.load(word.quescontimg[0], function (error, spriteFrame) {
            if (!error) {
                self.imageSprite.spriteFrame = new cc.SpriteFrame(spriteFrame);
            }
        });
    },

    optionClick: function () {
        this.target.selectWord(this, this.wordName, this.audioUrl);
        // this.node.getComponent(cc.Button).interactable = false;
        this.setBackgroundSprite('white_back');
    },

    setBackgroundSprite: function (url) {
        var self = this;
        cc.loader.loadRes('word/' + url, cc.SpriteFrame, function (error, spriteFrame) {
            if (!error) {
                self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            }
        });
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
