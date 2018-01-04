cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        this.scheduleOnce(function () {
            cc.director.loadScene('WordRace');
        }, 3);
    },
});
