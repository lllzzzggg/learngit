cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        this.node.scale = Math.random();
        //运行动画
        this.node.runAction(cc.sequence(
            cc.spawn(
                cc.moveBy(0.5, cc.p(280 * (Math.random() * 2 - 1), 280 * (Math.random() * 2 - 1))),
                cc.scaleTo(0.5, Math.random() * 0.5 + 0.5),
                cc.rotateBy(0.5, Math.random() * 90)
            ),
            cc.callFunc(function () {
                this.node.active = false;
            }, this),
        ));
    },
});
