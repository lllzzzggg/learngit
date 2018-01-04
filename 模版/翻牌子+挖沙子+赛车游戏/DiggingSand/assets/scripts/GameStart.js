cc.Class({
    extends: cc.Component,

    properties: {
    
    },

    onLoad: function () {

        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);

    },

    touchEnd: function()
    {
        cc.director.loadScene("Game");
    },
    // update: function (dt) {

    // },
});
