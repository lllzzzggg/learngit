cc.Class({
    extends: cc.Component,

    properties: {
        feedback: cc.Node,
        longxia: cc.Node,
        gongxini: cc.Node,
        yaojiayou: cc.Node,
        shijiandao: cc.Node,
    },

    showFeedback: function (feedbackType) {
        this.longxiaAnim = this.longxia.getComponent(cc.Animation);

        this.feedback.opacity = 255;
        this.longxia.opacity = 255;
        //透明度渐变
        this.feedback.opacity = 0;
        this.feedback.runAction(cc.sequence(cc.fadeTo(1, 255)));

        if (feedbackType === 1) {
            //答对了
            this.longxiaAnim.play('Feedback_1');

            this.gongxini.opacity = 255;
            this.yaojiayou.opacity = 0;
            this.shijiandao.opacity = 0;
        } else if (feedbackType === 2) {
            //答错了
            this.longxiaAnim.play('Feedback_2');

            this.gongxini.opacity = 0;
            this.yaojiayou.opacity = 255;
            this.shijiandao.opacity = 0;
        } else {
            //时间到
            this.longxiaAnim.play('Feedback_3');

            this.gongxini.opacity = 0;
            this.yaojiayou.opacity = 0;
            this.shijiandao.opacity = 255;
        }
    },

    animationStop: function () {
        this.longxiaAnim.stop();

        this.feedback.opacity = 0;
        this.longxia.opacity = 0;
    },
});
