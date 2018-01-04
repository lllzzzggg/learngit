cc.Class({
    extends: cc.Component,

    properties: {
        option_node: cc.Node,
        label: cc.Label,
        canMove: false,
    },
    onLoad: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touch_start.bind(this), this.node);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touch_move.bind(this), this.node);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touch_end.bind(this), this.node);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touch_cancel.bind(this), this.node);
    },
    init: function (gameJS, option, optionLength) {
        this.node.opacity = 255;
        this.gameJS = gameJS;
        this.option = option;//选项（选项，选项答案）
        this.label.string = option.optionContent;//读取选项答案
        this.optionNo = option.optionNo;
    },
    touch_start: function(evt){
        this.canMove = this.gameJS.changeMoveTag(this.node.tag);
        this.startx = this.node.x;
        this.starty = this.node.y;
        if (!this.canMove) {
            return;
        }
        this.opacity = 150;
    },
    touch_end:function(evt){
        if (!this.canMove) {
            return;
        }
        this.node.opacity = 255;
        var isTouch = this.check();
        //isTouch && this.optionClick();
        if(isTouch){
            this.optionClick();
        }
        //else{
            // this.node.x = this.startx;
            // this.node.y = this.starty;
            this.reloadState();
        //}
    },
    touch_move:function(evt){
        if (!this.canMove) {
            return;
        }
        var delta = evt.touch.getDelta();
        this.node.x += delta.x;
        this.node.y += delta.y; 
    },
    touch_cancel: function (evt) {
        this.reloadState();
    },
    reloadState: function () {
        this.node.x = this.startx;
        this.node.y = this.starty;

        this.canMove = false;

        this.gameJS.changeMoveTag(0);
    },
    check:function(){
        var qNode = this.questionNode;
        if(qNode){           
            var self = this.node;
            var nodePosition = qNode.convertToWorldSpaceAR(cc.p(0, 0));
            var selfPosition = this.node.convertToWorldSpaceAR(cc.p(0, 0));
            if( Math.abs(nodePosition.x - selfPosition.x) < (qNode.width + self.width) / 2 
                && Math.abs(nodePosition.y - selfPosition.y) < (qNode.height + self.height) / 2){
                return true;
            }
        }
        return false;
    },
    optionClick: function () {
        this.node.opacity = 0;
        var self = this;
        self.updateState(false);
        this.scheduleOnce(function () {
            self.gameJS.selectAnswer(self.option);
        }, 0.2);
    },
    //按钮是否可点击
    updateState: function (interactable) {
        var buttonCom = this.option_node.getComponent(cc.Button);
        buttonCom.interactable = interactable;
    },
    setQuestionNode: function(questionNode){
        this.questionNode = questionNode;
    }
});
