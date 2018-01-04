cc.Class({
    extends: cc.Component,

    properties: {
    
        wordImg: cc.Sprite,
        wordLabel: cc.Label,
    },
    onLoad: function () 
    {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touch, this);
    },

    initGameJS: function (gameJS, imageUrl)
    {
        this.gameJS = gameJS;

        var self = this;
        cc.loader.load(imageUrl, function (err, spriteFrame) {
            if (!err) {
                self.wordImg.spriteFrame = new cc.SpriteFrame(spriteFrame);
                self.wordImg.size = cc.size(282, 282);
            } 
        });
    },


    initLabel: function (content, soundUrl)
    {
        this.wordLabel.string = content;
        this.wordSoundsUrl = soundUrl;

        // if(content.length > 13)
        // {
        //     this.wordLabel.fontSize = 55.0;
        //     this.wordLabel.lineHeight = 65.0;
        //     this.wordLabel.overflow = cc.Label.Overflow.SHRINK;
        // }
        // else
        // {
        //     this.wordLabel.fontSize = 100.0;
        //     this.wordLabel.lineHeight = 100.0;
        //     this.wordLabel.overFlow = cc.Label.Overflow.SHRINK;
        // }
        
    },
    touch: function()
    {
        this.gameJS.playWordSound(this.wordSoundsUrl);
    },

    
});
