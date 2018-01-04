cc.Class({
    extends: cc.Component,

    properties: {
        collectNum: 0,
        missNum: 0,
        isWin: true,
        isFirst: true,
        Music: cc.AudioClip,
        audioSource: cc.AudioSource,
    },

    // use this for initialization
    onLoad: function () {
        this.wordList = [
            // 'clock', 'flower', 'lemonade',
            // 'mountain', 'painting', 'river',
            // 'sun', 'tree', 'water'
        ];
        //请求数据
        this.network = this.node.getComponent('Network');
        this.network.sendXHR(this);
    },

    startLoadGame: function (questionArr) {
        // var wordList = [];
        // for (var index = 0; index < questionArr.length; index++) {
        //     var element = questionArr[index];
        //     wordList.push(element);
        // }
        // this.wordList = wordList;
        this.audioSource.play();
        
        cc.audioEngine.play(this.Music, true, 0.1);

        this.questionArr = questionArr;

        this.initAnswerInfo(questionArr);

        this.startDate = new Date();  //开始时间
    },

    setIsFirst: function (params) {
        this.isFirst = params;
    },

    getWordList: function () {
        return this.questionArr;
    },

    getQuestionArray: function () {
        return this.questionArr;
    },

    //初始化答案数据
    initAnswerInfo: function (questionArr) {
        this.answerInfoArr = [];
        for (var index = 0; index < questionArr.length; index++) {
            var question = questionArr[index];
            //组装数据
            var answerInfo = {
                answerTime: '0',
                leveLQuestionDetailNum: question.leveLQuestionDetailNum,
                levelQuestionDetailID: question.levelQuestionDetailID,
                answerStatus: '2',
                answerContext: '',
            };

            this.answerInfoArr.push(answerInfo);
        }
    },

    // answerInfo['answerTime'] = '用时多少';
    // answerInfo['leveLQuestionDetailNum'] = 'IPS题目（小题）序号';
    // answerInfo['levelQuestionDetailID'] = 'IPS题目（小题） ID';
    // answerInfo['answerStatus'] = '答题状态 1：正确 2：错误';
    // answerInfo['answerContext'] = 'A/B/C/D';//用户答案选项
    setAnswerInfo: function (index, answerTime, answerStatus, answerContext) {
        var answerInfo = this.answerInfoArr[index];
        //组装数据
        answerInfo.answerTime = answerTime;
        answerInfo.answerStatus = answerStatus;
        answerInfo.answerContext = answerContext;
    },

    setGameData: function (collectNum, missNum) {
        this.collectNum = collectNum;;
        this.missNum = missNum;
        //根据游戏情况生成对应数值,完成度60%以上时，标题写出“干的不错”字样，完成度60%以下时，写出再接再厉字样
        var percent = parseInt(collectNum) / (parseInt(collectNum) + parseInt(missNum));
        this.isWin = (percent >= 0.6);
    },

    gameOver: function () {
        cc.audioEngine.stopAll();
        cc.audioEngine.uncacheAll();

        var endDate = new Date();    //结束时间
        var date = endDate.getTime() - this.startDate.getTime();  //时间差的毫秒数
        this.network.gameOver(Math.round(date / 1000), this.answerInfoArr);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
