cc.Class({
    extends: cc.Component,

    properties: {
        timeLabel: cc.Label,
        // paopao_node: cc.Node,//泡泡背景
        // paopao_pref: cc.Prefab,//泡泡预制
        // feedback_node: cc.Node,//龙虾反馈
        // feedback_pref: cc.Prefab,//龙虾预制
        // loseTime_node: cc.Node,//减时间
        // loseTime: 0,//减时间3秒
        time_node: cc.Node,
        
        question_node: cc.Node,
        // questionNum_node: cc.Node,
        // quertionNum:cc.Prefab,
        quertionList_node: cc.Node,
        title_node: cc.Node,

    },

    // use this for initialization
    onLoad: function () {
        //注册监听home键事件
        document.addEventListener('resignActivePauseGame', function () {
            cc.director.pause();
            cc.game.pause();

            console.log('app just resign active.');
        });
        document.addEventListener('becomeActiveResumeGame', function () {
            if (cc.game.isPaused) {
                cc.game.resume();
            }
            if (cc.director.isPaused) {
                cc.director.resume();
            }
            console.log('app just become active.');
        });

        //创建龙虾
        // var feedback = cc.instantiate(this.feedback_pref);
        // this.feedback_node.addChild(feedback);
        //反馈
        // this.feedbackJS = feedback.getComponent('ShowFeedback');
        //气泡
        // this.createPaopao();
        //答题时间
        this.answerTime = 0;
        //'A/B/C/D',用户答案选项
        this.answerContext = '';
        //倒计时
        this.countDown = 3;
        //倒计时回调
        // this.timeCallback = this.timeCallbackFunc();
        //是否在显示减时间
        // this.isShowLossTime = false;
        //当前题目序号
        this.nowQuestionID = 0;
        //题目列表
        this.questionArr = [];
        //收集数据
        this.answerInfoArr = [];
        //列表js
        this.questionNumListJS = this.quertionList_node.getComponent("QuestionNumListJS");
        // //问题数组
        // this.qusetionNumJSArr = [];
        // //选中题目
        // this.selectedQusetionJS = null;
        //请求数据
        this.network = this.node.getComponent('NetworkJS_Data');
        this.network.sendXHR(this);
    },

    //加载泡泡
    createPaopao: function () {
        //左边
        // let width = this.node.width;
        // let height = 1012.0;
        // let paopaoX = [120, 40, 160, 80, 200];
        // let posY = height / (paopaoX.length);
        // for (var index = 0; index < paopaoX.length; index++) {
        //     var paopao = cc.instantiate(this.paopao_pref);
        //     paopao.x = paopaoX[index];
        //     paopao.y = - posY * index;
        //     this.paopao_node.addChild(paopao);
        // }
        // //右边
        // for (var index = 0; index < paopaoX.length; index++) {
        //     var paopao = cc.instantiate(this.paopao_pref);
        //     paopao.x = width - paopaoX[index];
        //     paopao.y = - posY * index;
        //     this.paopao_node.addChild(paopao);
        // }
    },

    // answerInfo['answerTime'] = '用时多少';
    // answerInfo['leveLQuestionDetailNum'] = 'IPS题目（小题）序号';
    // answerInfo['levelQuestionDetailID'] = 'IPS题目（小题） ID';
    // answerInfo['answerStatus'] = '答题状态 1：正确 2：错误';
    // answerInfo['answerContext'] = 'A/B/C/D';//用户答案选项
    createAnswerInfo: function (answerStatus) {
        var question = this.questionArr[0];

        //组装数据
        var answerInfo = {
            answerTime: this.answerTime,
            leveLQuestionDetailNum: question.leveLQuestionDetailNum,
            levelQuestionDetailID: question.levelQuestionDetailID,
            answerStatus: answerStatus,
            answerContext: this.answerContext,
        };

        this.answerInfoArr.push(answerInfo);
    },

    //龙虾反馈
    showFeedback: function (type) {
        //龙虾反馈
        // this.feedbackJS.showFeedback(type);

        // this.nowQuestionID += 1;
        // //显示进度
        // this.network.gameLoadProgress(this.nowQuestionID, this.questionArr.length);

        // this.scheduleOnce(function () {
        //     if (this.nowQuestionID >= this.questionArr.length) {
        //         if (CONSOLE_LOG_OPEN) console.log('答完了');

        //         this.network.gameOver(this.answerInfoArr);
        //     } else {
        //         this.feedbackJS.animationStop();
        //         //移除当前所有选项
        //         this.deleteOption();
        //         //开始下一题
        //         this.startloadOption();
        //     }
        // }, 2.0);
    },

    //显示减时间
    showLossTime: function () {
        // this.answerTime += this.loseTime;

        // this.isShowLossTime = true;
        // //透明度渐变
        // this.loseTime_node.opacity = 255;

        // var callFunc = cc.callFunc(function (target) {
        //     this.isShowLossTime = false;
        //     this.loseTime_node.opacity = 0;
        // }, this);

        // this.loseTime_node.runAction(cc.sequence(cc.fadeTo(1.0, 0), callFunc));
    },

    //倒计时回调
    timeCallbackFunc: function () {
        var timeCallback = function () {
            //用户答题时间
            this.answerTime += 1;
            //倒计时次数
            this.scheduleTime += 1;

            var timeString = this.countDown - this.answerTime;

            if (timeString <= 0) {
                //时间到
                if (CONSOLE_LOG_OPEN) console.log('时间到');

                this.isShowFeed = true;

                this.answerTime = this.countDown;
                this.timeLabel.string = '00:00';

                this.createAnswerInfo('2');

                this.showFeedback(3);

                //是减时间，取消定时器,放在showFeedback，要不然会不执行scheduleOnce
                if (this.answerTime > this.scheduleTime) {
                    //取消定时器
                    this.unschedule(this.timeCallback);
                }
            } else if (timeString < 10) {
                this.timeLabel.string = '00:0' + timeString;
            } else {
                this.timeLabel.string = '00:' + timeString;
            }
        }
        return timeCallback;
    },

    //显示倒计时
    showSchedule: function () {
        this.scheduleTime = 0;
        this.schedule(this.timeCallback, 1.0, this.countDown - 1);
    },

    //移除当前所有选项
    deleteOption: function () {

    },

    //创建选项按钮
    createOption: function (interactiveJson) {

    },
    //选择指定题目
    selectedOption: function(questionID) {
        this.nowQuestionID = questionID;
        this.startloadOption();
    },
    //开始加载选项
    startloadOption: function () {
        this.isIts && this.questionNumListJS.changeOptionDisable();
        
        var question = this.questionArr[this.nowQuestionID];

        // this.titlelabel.string = question.qescont;

        // this.createOption(question.interactiveJson);

        // //倒计时
        // let countDown = parseInt(question.interactiveJson['countDown']);
        // if (countDown > 0) {
        //     this.countDown = countDown;
        
        // this.timeLabel.string = '00:' + this.countDown;

        // this.answerTime = 0;

        !this.isIts && this.showSchedule();
        this.isIts && this.questionNumListJS.changeOptionEnable();
        this.isShowFeed = true;
    },

    //题目下载完成，开始游戏
    startLoadGame: function (questionArr) {
        this.questionArr = questionArr;
        // this.title_node.opacity = this.isIts ? 255 : 0; 
        // this.quertionList_node.opacity = this.isIts ? 255 : 0;
        // this.time_node.opacity = this.isIts ? 0 : 255;
        //its
        // this.isIts && questionArr && questionArr.length > 0 
        // && this.questionNumListJS.init(questionArr.length, this.selectedOption.bind(this)); 
        //开始加载题目
        this.startloadOption();
    },
    
    //选中答案
    selectAnswer: function (target, isRight) {
        //显示状态过程中不接收事件
        if (this.isShowFeed || this.isShowLossTime) {
            return;
        }

        if (isRight) {
            if (CONSOLE_LOG_OPEN) console.log('答对了');

            // this.rightSelect += 1;

            // target.showParticle();

            // //题打完了
            // if (this.rightSelect >= this.count) {
            //     //取消定时器
            //     this.unschedule(this.timeCallback);

            //     this.isShowFeed = true;

            //     this.createAnswerInfo('1');

            //     this.scheduleOnce(function () {
            //         this.showFeedback(1);
            //     }, 1.0);
            // }
        } else {
            if (CONSOLE_LOG_OPEN) console.log('答错了');

            // this.showLossTime();
        }
    },

    onDestroy: function () {
        document.removeEventListener('resignActivePauseGame');
        document.removeEventListener('becomeActiveResumeGame');
    },
    //设置游戏标题名
    setGameName: function(val){
        this.title_node.getComponent("TitleJS").init(val);
    },

    //its 兼容
	setPlatform: function( val ){
        this.platform = val;
        this.isIts = val == "its";
    },
    
    //复位
    resetOption: function () {
        if (this.moveOptionTag != 0) {
            // var moveOption = this.optionArea.getChildByTag(this.moveOptionTag);
            // var optionJs = moveOption.getComponent('Option');
            // optionJs.reloadState();
            // this.moveOptionTag = 0;
        }
    },

    //moveTag
    changeMoveTag: function (tag) {
        if (this.answerOver) {
            return false;
        }
        if (this.moveOptionTag === 0 || this.moveOptionTag === tag || tag === 0) {
            this.moveOptionTag = tag;

            return true;
        } else {
            return false;
        }
    },
});