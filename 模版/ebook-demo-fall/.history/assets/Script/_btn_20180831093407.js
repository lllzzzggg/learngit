
cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    

    start () {
        let self = this;

        self.node.on(cc.Node.EventType.MOUSE_ENTER, function(event){
            cc._canvas.style.cursor = 'pointer';
        });
        self.node.on(cc.Node.EventType.MOUSE_LEAVE, function(event){
            cc._canvas.style.cursor = 'default';
        });

    },

    // update (dt) {},
});
