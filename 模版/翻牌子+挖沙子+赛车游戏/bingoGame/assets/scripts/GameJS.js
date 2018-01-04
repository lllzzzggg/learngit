var BaseGameJS = require("BaseGameJS");

cc.Class({
    extends: BaseGameJS,

    properties: {
        completeAnimBackNode: cc.Node,
        completeAnimNode: cc.Node,
        feedbackLightNode: cc.Node,

        playNode: cc.Node,
        reviewNode: cc.Node,

        bingoSound: cc.AudioClip,
        letsSpell: cc.AudioClip,
        rightSound: cc.AudioClip,
        wrongSound: cc.AudioClip,
        flopSound: cc.AudioClip,
        cheerSound: cc.AudioClip,
        backSound: cc.AudioClip,
    },

    // use this for initialization
    onLoad: function () {

        this._super();
        this.totalTime = 0;
        this.completeAnimBackNode.opacity = 0;
        this.bingoJS = this.node.getComponent('bingoJS');
        // this.backSound = cc.audioEngine.playMusic(this.backSound, true);
        this.current = cc.audioEngine.play(this.letsSpell, false, 1);
    },

    // 资源预加载
    preLoaderResources: function(){
        // window.location.href = 'optionBlank://gameShowLoading';
        var resourceNum = this.interactiveJson.soundArr.length;

        var self = this;
        for(var i = 0; i < this.interactiveJson.soundArr.length; i++){
            cc.loader.load(this.interactiveJson.soundArr[i], function(err, result) {
                if(!err) {
                    resourceNum--;
                    if(resourceNum <= 0){
                        // window.location.href = 'optionBlank://gameHideLoading';
                        self.preLoadImg();
                    }
                }
            });
        }
    },

    preLoadImg: function(){
        // window.location.href = 'optionBlank://gameShowLoading';
        var resourceNum = this.interactiveJson.image.length;
        var self = this;
        for(var i = 0; i < this.interactiveJson.image.length; i++){
            cc.loader.load(this.interactiveJson.image[i], function(err, result) {
                if(!err) {
                    resourceNum--;
                    if(resourceNum <= 0){
                        // window.location.href = 'optionBlank://gameHideLoading';
                    }
                }
            });
        }
    },

    //移除当前所有选项
    deleteOption: function () {

    },

    // PlayGame
    playFunc: function(target) {
        var question = this.questionArr[this.nowQuestionID];
        this.createOption(question);
        this.schedule(this.timeCallback, 1.0);
    },
    // 总时间
    timeCallback: function(){
        this.totalTime++;
        this.network.setTotalTime(this.totalTime);
    },

    //创建选项按钮
    createOption: function () {
        // cc.log("createOption: " + interactiveJson);
        //b.getComponent('brickJS').hideThis();
        var question = this.questionArr[0];
        this.playNode.active = false;
        // this.playNode.x = -2000;
        this.completeAnimBackNode.x = -2000;
        this.isShowFeed = true;
        this.nowQuestionID = 0;
        this.bingoJS.init(this, question, this.question_node, this.nowQuestionID);
        // cc.log("createOption: " + interactiveJson);
    },

    //开始加载选项
    startloadOption: function () {
        // this.isIts && this.questionNumListJS.changeOptionDisable();
        cc.log(this.questionArr);
        var question = this.questionArr[0];

        //this.question = question;
        // this.titlelabel.string = question.qescont;


        // //倒计时
        // let countDown = parseInt(question.interactiveJson['countDown']);
        // if (countDown > 0) {
        //     this.countDown = countDown;
        
        // this.timeLabel.string = '00:' + this.countDown;

        // this.answerTime = 0;
        var interactiveJson = question.interactiveJson;
        this.interactiveJson = interactiveJson;
        
        //this.createOption(question);

        cc.log("startloadOption");
        
        
        this.isShowFeed = true;
        cc.log("startloadOption");
        // 资源预加载
        this.preLoaderResources();
    },
    
    //选中答案
    selectAnswer: function (target, btnString, targetJS) {
        //显示状态过程中不接收事件
        var answerCheck = this.interactiveJson.answerArr;
        var nowRightAnswer = answerCheck[this.nowQuestionID];
        var isRight = (nowRightAnswer === btnString);
        cc.log("this.isShowFeed: "+this.isShowFeed);
        if (this.isShowFeed || this.isShowLossTime) {
            return;
        }

        var self = this;
        this.isShowFeed = true;
        if (isRight) {
            if (CONSOLE_LOG_OPEN) console.log('答对了');
            target.getComponent('brickJS').showRightAnimFunc();
            this.current = cc.audioEngine.play(this.rightSound, false, 1);
            this.createAnswerInfo('1');
            this.nowQuestionID += 1;
            
            var quesLength = this.interactiveJson.answerArr.length;
            this.network.gameLoadProgress(this.nowQuestionID, quesLength);
            this.current = cc.audioEngine.play(this.flopSound, false, 1);

            this.bingoJS.fullAskLabel();
            
            this.scheduleOnce(function () {
                if (this.nowQuestionID >= quesLength) {
                    this.completeAnimBackNode.opacity = 255;
                    this.completeAnimBackNode.x = 342;
                    cc.log("completeAnim");
                    this.current = cc.audioEngine.play(this.cheerSound, false, 1);
                    var completeAnim = this.completeAnimNode.getComponent(cc.Animation);
                    var lightAnim = this.feedbackLightNode.getComponent(cc.Animation);
                    lightAnim.play('feedBacklight');
                    completeAnim.play('completeFeedback');
                    this.network.gameOver(this.answerInfoArr);
                    this.unschedule(this.timeCallback);
                } else {
                    this.current = cc.audioEngine.play(this.flopSound, false, 1);
                    self.bingoJS.showAsk(self.nowQuestionID);
                }
                
            }, .1);
            
        } else {
            if (CONSOLE_LOG_OPEN) console.log('答错了');
            // this.createAnswerInfo('2');
            this.current = cc.audioEngine.play(this.wrongSound, false, 1);
            target.getComponent('brickJS').showWrongAnimFunc();

        }
    },
    

    resetGame: function() {
        cc.log("this.reviewNode.opacity: "+this.completeAnimBackNode.opacity);
        if(this.completeAnimBackNode.opacity === 0) return;
        this.completeAnimBackNode.opacity = 0;
        this.playNode.active = true;
        // this.playNode.x = 0;
    },
});