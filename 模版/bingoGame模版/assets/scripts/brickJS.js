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
        ssLabel: cc.Label,
        btn: cc.Button,
        showAnim: cc.Node,
        wrongSelect: cc.Node,
        rightSelect: cc.Node,

    },

    // use this for initialization
    onLoad: function () {
        // this.ssLabel.opacity = 0;
        this.textAnim = this.showAnim.getComponent(cc.Animation);
        this.wrongAnim = this.wrongSelect.getComponent(cc.Animation);
        this.rightAnim = this.rightSelect.getComponent(cc.Animation);
    },

    init: function(text, target, parent) {
        cc.log("1111====>>>>>");
        this.target = target;
        this.parent = parent;
        // cc.log("brick init");
        // this.ssLabel.opacity = 255;
        this.ssLabel.string = text.toString();
        this.showAnim.opacity = 0;
        this.wrongSelect.opacity = 0;
        this.rightSelect.opacity = 0;

    },

    btnClick: function() {
        cc.log(this.target.isShowFeed);
        this.target.selectAnswer(this.node, this.ssLabel.string, this);
        // this.parent.wordSoundFunc();
    },

    hideThis: function() {
        // cc.log("brick hide");
        var hideSeq = cc.sequence(cc.scaleTo(0.5, 0, 1), cc.removeSelf());
        this.node.runAction(hideSeq);
    },

    showAnimFunc: function() {

        // this.showAnim.enabled = true;
        this.showAnim.opacity = 255;
        this.textAnim.play('showText');
        this.scheduleOnce(function () {
            this.showAnim.opacity = 0;
            this.ssLabel.enabled = true;
            // self.target.isShowFeed = false;
        }, 0.7);

    },

    showRightAnimFunc: function() {

        // this.showAnim.enabled = true;
        this.rightSelect.opacity = 255;
        this.node.runAction(cc.sequence(cc.scaleTo(0.2, 1.06), cc.scaleTo(0.2, 1)));
        this.rightAnim.play('rightSelect');
        cc.log("this.node.name: "+this.node.name);
        this.scheduleOnce(function () {
            this.rightSelect.opacity = 0;
            // this.ssLabel.enabled = true;
            // self.target.isShowFeed = false;
            this.hideThis();
        }, 0.7);

    },

    showWrongAnimFunc: function() {

        // this.showAnim.enabled = true;
        this.wrongSelect.opacity = 255;
        this.wrongAnim.play('wrongSelect');
        this.scheduleOnce(function () {
            this.wrongSelect.opacity = 0;
            // this.ssLabel.enabled = true;
            this.target.isShowFeed = false;
        }, 0.7);

    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
