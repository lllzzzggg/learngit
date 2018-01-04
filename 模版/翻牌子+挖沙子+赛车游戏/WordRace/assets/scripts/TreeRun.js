cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    treeStartRun: function () {
        for (var index = 1; index <= 9; index++) {
            this.treeRunAnim(index);
        }
    },

    treeRunAnim: function (index) {
        var treeName = 'Tree' + index;
        var treeNode = this.node.getChildByName(treeName);
        // treeNode.active = true;
        if (treeNode.activeInHierarchy) {
            treeNode.getComponent(cc.Animation).play(treeName, index * 0.2);
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
