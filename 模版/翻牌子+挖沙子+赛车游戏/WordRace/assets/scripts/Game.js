cc.Class({
    extends: cc.Component,

    properties: {
        wordImage: cc.Node,
        collect: cc.Label,
        word: cc.Label,
        miss: cc.Label,
        feedback: cc.Node,
        raceAnim: cc.Animation,
        treeNode: cc.Node,
        roadAnim: cc.Animation,
        help: cc.Node,
        progressBar: cc.Node,
        progressPref: cc.Prefab,
        balloon:
        {
            default: null,
            type: cc.Node,
        }
    },

    // use this for initialization
    onLoad: function () {
        var gameData = cc.director.getScene().getChildByName('GameData').getComponent('GameData');
        this.questionArray = gameData.getQuestionArray();
        this.gameDataJs = gameData;

        this.nowWordNum = 0;
        this.collect.string = '0';
        this.word.string = '';
        this.miss.string = '0';

        this.runTime = 3.0;
        this.showTime = 1.5;
        this.nowQuestion = null;
        this.rightAnswer = '';

        this.raceAnim.play();
        this.roadAnim.play();
        this.treeNode.getComponent('TreeRun').treeStartRun();

        for (var index = 0; index < this.questionArray.length; index++) {
            var progress = cc.instantiate(this.progressPref);
            progress.tag = index;
            this.progressBar.addChild(progress);
        }

        

        //添加气球动画
        var balloonOriginalPos = cc.p(this.balloon.x, this.balloon.y);
        var balloonRightAction = cc.moveTo(1.5, cc.p(balloonOriginalPos.x + 63, balloonOriginalPos.y));
        var balloonLeftAction = cc.moveTo(1.5,balloonOriginalPos);
        this.balloon.runAction(cc.repeatForever(cc.sequence(balloonRightAction, balloonLeftAction)));


        //第一次显示帮助
        // var isNotFirst = cc.sys.localStorage.getItem('GAME_IS_NOT_FIRST');
        // if (!isNotFirst) {
        //     gameData.setIsFirst(false);
        //     //存储是否第一次玩游戏
        //     cc.sys.localStorage.setItem('GAME_IS_NOT_FIRST', true);

        //     this.help.active = true;

        //     this.scheduleOnce(function () {
        //         this.help.active = false;
        //         this.startGame();
        //     }, 4.0);
        // } else {
        this.startGame();
        // }
    },

    startGame: function () {
        this.scheduleOnce(function () {
            this.loadGame();
        }, 5.0);
    },

    //播放单词
    loadGame: function () {
        var nowQuestion = this.questionArray[this.nowWordNum];

        this.rightAnswer = nowQuestion.rightAnswer;

        this.word.string = nowQuestion.qescont;

        var runTime = nowQuestion.interactiveJson.runTime;
        var showTime = nowQuestion.interactiveJson.showTime;
        if (parseFloat(runTime) > 0) {
            this.runTime = parseFloat(runTime);
        }
        if (parseFloat(showTime) > 0) {
            this.showTime = parseFloat(showTime);
        }

        if(nowQuestion.quescontsound)
        this.playAudio(nowQuestion.quescontsound);
        this.startShowWord(nowQuestion.optionsArr);
        
        this.balloon.getChildByName("labelOnBalloon").active = true;
        cc.find("Balloon/labelOnBalloon", this.node).getComponent(cc.Label).string = nowQuestion.qescont;
    },

    //播放在线音频
    playAudio: function (audioUrl) {
        cc.audioEngine.stop(this.nowAudio);
        var self = this;
        cc.loader.load(audioUrl, function (error, audio) {
            if (!error) {
                self.nowAudio = cc.audioEngine.play(audio, false, 1);
            }
        });
    },

    //播放本地音频
    playResAudio: function (audioName) {
        cc.audioEngine.stop(this.nowAudio);
        var self = this;
        cc.loader.loadRes('audio/' + audioName, cc.AudioClip, function (error, audio) {
            if (!error) {
                self.nowAudio = cc.audioEngine.play(audio, false, 1);
            }
        });
    },

    startShowWord: function (optionsArr) {
        this.scheduleOnce(function () {
            this.wordImage.getComponent('WordManager').showWordImage(this, optionsArr, this.runTime);
        }, 2.0);
    },

    showWordFinish: function () {
        var nowLane = this.node.getComponent('RaceMove').getNowLane();

        var animState = null;
        if (nowLane == this.rightAnswer) {
            //保存答案记录
            this.gameDataJs.setAnswerInfo(this.nowWordNum, this.runTime, '1', nowLane);

            this.collect.string = parseInt(this.collect.string) + 1;
            var goods = ['excellent', 'perfect', 'amazing'];
            this.playResAudio(goods[Math.floor(Math.random() * 3)]);
            animState = this.feedback.getComponent(cc.Animation).play('Collect');
            this.setProgressImage('right');
        } else {
            //保存答案记录
            this.gameDataJs.setAnswerInfo(this.nowWordNum, this.runTime, '2', nowLane);

            this.miss.string = parseInt(this.miss.string) + 1;
            this.playResAudio('miss');
            animState = this.feedback.getComponent(cc.Animation).play('Miss');
            this.setProgressImage('wrong');
        }
        //更改显示时间
        animState.speed = animState.duration / this.showTime;

        this.scheduleOnce(function () {
            this.showFeedbackFinish();
        }, this.showTime);

        return nowLane;
    },

    showFeedbackFinish: function () {
        this.nowWordNum += 1;
        if (this.nowWordNum >= this.questionArray.length) {
            //保存游戏数据
            var gameData = cc.director.getScene().getChildByName('GameData').getComponent('GameData');
            gameData.setGameData(this.collect.string, this.miss.string);
            //加载gameOver
            cc.director.loadScene('GameOver');
        } else {
            this.loadGame();
        }
    },

    setProgressImage: function (imageName) {
        var sprite = this.progressBar.getChildByTag(this.nowWordNum).getComponent(cc.Sprite);
        cc.loader.loadRes('status/' + imageName, cc.SpriteFrame, function (error, spriteFrame) {
            if (!error) {
                sprite.spriteFrame = spriteFrame;
            }
        });
    },

    goBackClick: function () {
        cc.director.loadScene('ShowWord');
    },

    onDestroy: function () {
        cc.audioEngine.stop(this.nowAudio);
    },
});
