cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {

    },

    showWordImage: function (target, optionsArr, runTime) {
        this.target = target;

        for (var index = 0; index < this.node.children.length; index++) {
            var element = this.node.children[index];
            element.opacity = 0;
            if (optionsArr[index]) {
                var word = optionsArr[index].optioncontimg;
                if (word) {
                    this.loadWordImage(element, word);
                }
            }
        }
        var animState = this.node.getComponent(cc.Animation).play();
        animState.speed = animState.duration / runTime;
    },

    loadWordImage: function (wordNode, wordUrl) {
        cc.loader.load(wordUrl, function (error, image) {
            if (!error) {
                wordNode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(image);
                wordNode.opacity = 255;
            }
        });
    },

    animFinish: function () {
        var nowLane = this.target.showWordFinish();
        //获取碰撞的物品消失
        var collisionNode = this.node.getChildByName(nowLane);
        if (collisionNode) {
            collisionNode.opacity = 0;
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
