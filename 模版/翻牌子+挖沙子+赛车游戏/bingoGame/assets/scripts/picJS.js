cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        picSprite: cc.Sprite,
    },

    // use this for initialization
    onLoad: function () {

    },

    initTex: function (tex, target) {

        cc.log("pic init");
        this.target = target;
        this.picSprite.spriteFrame = new cc.SpriteFrame(tex);
        // this.node.width = 400;
        // this.node.height = 400;
    },

    onDestroy: function() {
        // cc.log("picSprite: "+this.node.name);
        
        // cc.log(this.target);


        this.sx = 3;
        this.sy = 326;
        this.brickSize = 342;

        var intX = parseInt((this.node.x - this.sx + this.brickSize) / this.brickSize);
        var intY = parseInt((this.sy - this.node.y+10) / this.brickSize);
        // cc.log("int: "+ intX +" "+ intY);
        var ss = intX + intY * 3;
        //cc.log("ss: "+ ss);
        var b = this.target.getChildByName("brick" + ss.toString());
        cc.log("b: "+b+" "+b.name);
        b.getComponent('brickJS').showAnimFunc();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
