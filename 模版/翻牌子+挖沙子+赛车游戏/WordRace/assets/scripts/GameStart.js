cc.Class({
    extends: cc.Component,

    properties: {
        gameData: cc.Node,
    },

    // use this for initialization
    onLoad: function () {        
        cc.game.addPersistRootNode(this.gameData);
    },

    startClick: function () {
        cc.director.loadScene('ShowWord');
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
