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

        brick: cc.Prefab,
        sound: null,
        picNode: cc.Node,
        picSprite: cc.Sprite,
        picSpritePrefab: cc.Prefab,
        askLabel: cc.Label,
    },

    // 添加下划线
    getHeadline: function(num){
        var headline = "";
        for(var i = 0; i < num; i++){
            headline = headline+"_";
        }
        return headline;
    },

    // use this for initialization
    onLoad: function () {
        this.sx = 3;
        this.sy = 326;
        this.brickSize = 342;
        this.firstLoad = true;

        this.answers;

        this.questions;

        this.sounds;

        // var texsArr = texs;
        // this.texsArr = texsArr;

        // this.nowQuestionNum = nowQuestionNum;

        
        // this.imgUrlsArr = imgUrlsArr;

        var ssArr = [];

        var answerArr = [];
        

        this.updateFlag = false;
        this.nextX = this.sx + this.brickSize*2;
    },

    init: function(target, question, questNode, nowQuestionNum) {

        cc.log(target+"  "+question+"  "+questNode);
        this.firstLoad = true;
        this.target = target;

        // this.isShowFeed = true;
        cc.log("target.isShowFeed: "+this.target.isShowFeed);

        cc.log(question);
        this.questNode = questNode;
        var interactiveJson = question.interactiveJson;
        this.interactiveJson = interactiveJson;
        var introduceUrl = interactiveJson.introduce;
        this.introduceUrl = introduceUrl;

        var answers = JSON.parse(JSON.stringify(interactiveJson.answerArr));
        this.noRandomAnswer = JSON.parse(JSON.stringify(interactiveJson.answerArr));
        this.answers = this.randomAnswer(answers);

        var questions = interactiveJson.questionArr;
        this.questions = questions;

        var sounds = interactiveJson.soundArr;
        this.sounds = sounds;

        this.nowQuestionNum = nowQuestionNum;

        var imgUrlsArr = interactiveJson.image;
        this.imgUrlsArr = imgUrlsArr;

        var brickNum = answers.length;

        var firstTex;
        this.firstTex = firstTex;

        // cc.log("brickNum: " + brickNum);
        for(var i = 0; i < brickNum; i++) {
            var b = cc.instantiate(this.brick);
            questNode.addChild(b);
            var xx = parseInt(i%3);
            var yy = parseInt(i/3);
            var tx = this.sx + this.brickSize * xx;
            var ty = this.sy - this.brickSize * yy;
            
            var answer = answers[i];
            b.name = "brick" + i.toString();
            b.setPosition(tx, ty);
            cc.log("2222====>>>>>");
            b.getComponent('brickJS').init(answer.toString(), target, this);
            b.getComponent('brickJS').ssLabel.enabled = false;
        }
        // var tex = texs.getContent(imgUrlsArr[(nowQuestionNum)]);
        // this.tex = tex;
        // cc.log("tex11111: "+this.tex);

        this.showAsk(nowQuestionNum);
    },

    showAsk: function(nowQuestionNum) {
        this.nowQuestionNum = nowQuestionNum;
        var self = this;
        var imgUrl = self.imgUrlsArr[nowQuestionNum].toString();
        // imgUrl = "http://localhost/bingoGame/"+imgUrl;
        cc.loader.load(imgUrl, function(err, newtexture) {
            if(!err) {

                self.firstTex = newtexture;
                if(!self.firstLoad)
                {
                    self.picNode.runAction(cc.fadeOut(1.0));
                    self.scheduleOnce(function () {
                        self.picSprite.spriteFrame = new cc.SpriteFrame(newtexture);
                        self.movePicNode(self.nowQuestionNum);
                    }, 1.0);
                }
                else
                {
                    self.picSprite.spriteFrame = new cc.SpriteFrame(newtexture);
                    self.picNode.x = 1300;
                    self.movePicNode(self.nowQuestionNum);
                }
            }
        });
    },

    fullAskLabel: function(){
        var answerCheck = this.interactiveJson.answerArr;
        var nowRightAnswer = answerCheck[this.nowQuestionNum];
        cc.log("111===>>>"+this.questions[this.nowQuestionNum]);
        cc.log("222===>>>"+nowRightAnswer);
        this.askLabel.string = this.questions[this.nowQuestionNum]+nowRightAnswer;
    },

    setString: function(string) {
        cc.log("string: "+string);
        var answerCheck = this.interactiveJson.answerArr;
        var nowRightAnswer = answerCheck[this.nowQuestionNum];
        // cc.log("111answerString: "+nowRightAnswer+"  "+answerCheck);
        var ss = nowRightAnswer.length;
        var newString = string;
        for(var i=0; i<ss; i++) {
            newString = newString+"_";
        }
        return newString;
    },

    movePicNode: function(nowQuestionNum) {

        var self = this;
        if(this.firstLoad)
        {
            cc.log("firstLoad");
            this.picNode.runAction(cc.sequence(cc.moveTo(2, cc.p(-603.3, -13)), cc.callFunc(function(){
                cc.log("aaa===>>>"+self.setString(self.questions[nowQuestionNum]));
                self.askLabel.string = self.setString(self.questions[nowQuestionNum]);
                self.setString(self.questions[nowQuestionNum]);
                cc.log("self.target.isShowFeed: "+self.target.isShowFeed);
                self.target.isShowFeed = false;
                self.sound = cc.audioEngine.play(cc.url.raw("resources/introduce.mp3"), false, 1);
                self.showText();
            })));
            // this.updateFlag = true;
            this.firstLoad = false;
        }
        else
        {
            // self.picNode.runAction(cc.fadeIn(1));
            // cc.log("self.target.isShowFeed: "+self.target.isShowFeed);
            // self.target.isShowFeed = false;
            // self.askLabel.string = self.setString(self.questions[nowQuestionNum]);
            // self.wordSoundFunc();
            self.picNode.runAction(cc.fadeIn(1));
            self.target.isShowFeed = false;
            var headline = self.getHeadline(self.noRandomAnswer[nowQuestionNum].length);
            cc.log("bbb===>>>"+self.questions[nowQuestionNum]+headline);
            self.askLabel.string = self.questions[nowQuestionNum]+headline;
            self.wordSoundFunc();
        }
    },

    wordSoundFunc: function() {
        if(this.target.isShowFeed) return;
        cc.log("wordSoundFunc===>>>");
        cc.log(this.nowQuestionNum +"  "+ this.sounds);
        var soundUrl = this.sounds[this.nowQuestionNum];
        cc.audioEngine.stop(this.sound);
        this.sound = cc.audioEngine.play(soundUrl, false, 1);
    },

    //过滤标签
    removeSpan: function (spanString) {
        var newStr = spanString.replace('<span>', '');
        newStr = newStr.replace('</span>', '');

        return newStr;
    },

    showText: function() {
        for(var i = 0; i < this.answers.length; i++)
        {
            var b = this.questNode.getChildByName("brick" + i);
            b.getComponent('brickJS').showAnimFunc();
        }
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        
    },

    randomAnswer: function(answers){
        for(var i = 0; i<answers.length; i++)
        {
            var rr = Math.floor(Math.random()*answers.length);
            var temp = answers[i];
            answers[i] = answers[rr];
            answers[rr] = temp;
        }
        cc.log("answers: "+answers);
        return answers;
    },

});
