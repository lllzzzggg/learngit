var BaseGameJS = require("BaseGameJS");
window.Global = 
{
    gameStatus: true,
    alreadyPlayOnce: false,
};
cc.Class({
    extends: BaseGameJS,

    properties: {
        
        sea: cc.Node,
        chanzi: cc.Node,
        hand: cc.Node,

        dakuan: cc.Node,

        box: cc.Node,
        boom: cc.Node,
        shell: cc.Node,
        can: cc.Node,
        conch: cc.Node,
        wordPrefab: cc.Prefab,
        
        payAttention: cc.Node,

        bombLastPic: cc.SpriteFrame,

        boxFrame: cc.SpriteFrame,
        boomFrame: cc.SpriteFrame,
        shellFrame: cc.SpriteFrame,
        canFrame: cc.SpriteFrame,
        conchFrame: cc.SpriteFrame,

        shakengFrame_1: cc.SpriteFrame,
        shakengFrame_2: cc.SpriteFrame,

        audio: cc.AudioClip,

        startBg: cc.Node,

        bgmAudio:cc.AudioClip,
        boomAudio:cc.AudioClip,
        buttonAudio:cc.AudioClip,
        digAudio:cc.AudioClip,
        emptyAudio:cc.AudioClip,
        failAudio:cc.AudioClip,
        seaAudio:cc.AudioClip,
        treasureAudio:cc.AudioClip,
        yunAudio:cc.AudioClip,
        payattentionAudio:cc.AudioClip,
        letsSearchAudio:cc.AudioClip,
        goobJobAudio:cc.AudioClip,
        timesUpAudio:cc.AudioClip,

        particleNode:cc.Prefab,

        progressBarBg:cc.Node,
        progressBar:cc.Node,

        guideNode:cc.Node,
    },

    onLoadChild: function () {
        this._super();
        
        // cc.director.setDisplayStats(true);

        // cc.game.addPersistRootNode(this);

        window.Global.gameStatus = false;
        this.isDiggingEnable = false;

        this.holeIndex = -1;
        this.digWordNum = 0;
        this.timerCount = 0;

        this.totalTime = 0;

        this.chanziAnimation = this.chanzi.getComponent(cc.Animation);
        this.chanzi.setLocalZOrder(2000);

        this.seaAnim = this.sea.getComponent(cc.Animation);
        this.boxAnim = this.box.getComponent(cc.Animation);
        this.boomAnim = this.boom.getComponent(cc.Animation);
        this.shellAnim = this.shell.getComponent(cc.Animation);
        this.canAnim = this.can.getComponent(cc.Animation);
        this.conchAnim = this.conch.getComponent(cc.Animation);

        this.chanziAnimation.on("finished", this.chanziAnimationFinished, this);
        this.seaAnim.on("finished", this.seaAnimationFinished, this);

        this.shellAnim.on("finished", this.createWordAnimation, this);
        this.boxAnim.on("finished", this.createWordAnimation, this);
        this.conchAnim.on("finished", this.createWordAnimation, this);
        this.boomAnim.on("finished", this.boomAnimFinished, this);
        this.canAnim.on("finished", this.canAnimFinished, this);

        this.progressBar.scaleX = 0.0;

        if(window.Global.alreadyPlayOnce)
        {
            this.startBg.active = false;
        }
    },

    payAttentionGuide: function()
    {
        cc.audioEngine.play(this.payattentionAudio, false);
        this.payAttention.active = true;
        var action1 = cc.moveTo(0.5,cc.p(0,420));
        var action2 = cc.moveTo(9.0,cc.p(0,420));
        var action3 = cc.moveTo(0.5,cc.p(-1635,420));
        var func = cc.callFunc(this.destroyPayAttetionNode, this);
        this.payAttention.runAction(cc.sequence(action1,action2,action3,func));
    },
    destroyPayAttetionNode: function()
    {
        this.payAttention.destroy();
    },
    dakuanPlayAnimation: function(type)
    {
        switch(type)
        {
            case 0:
                this.dakuanArmature.playAnimation("happy",3);
            break;
            case 1:
                this.dakuanArmature.playAnimation("happy",3);
            break;
            case 2:
                this.dakuanArmature.playAnimation("happy",3);
            break;
            case -1:
                this.dakuanArmature.playAnimation("boom",1);
            break;
            case -2:
                this.dakuanArmature.playAnimation("yun",1);
                cc.audioEngine.playEffect(this.yunAudio, false);
            break;
            case -3:
                this.dakuanArmature.playAnimation("yun",1);
                cc.audioEngine.playEffect(this.yunAudio, false);
            break;
        }
    },
    daKuanAnimationComplete: function()
    {
        this.dakuanArmature.playAnimation("start",0);
    },

    shuffle: function(inputArray)
    {
        for (let i = inputArray.length-1; i >=0; i--) 
        {
            var randomIndex = Math.floor(Math.random()*(i+1)); 
            var itemAtIndex = inputArray[randomIndex]; 
            inputArray[randomIndex] = inputArray[i]; 
            inputArray[i] = itemAtIndex;
        }
    },

    playWordSound: function (wordString)
    {
        if(this.isDiggingEnable)
        {   
            if(wordString !== null)
            {
                this.playAudio(wordString);
            }
        }
    },

    createParticleEffect: function()
    {
        var particle = cc.instantiate(this.particleNode);
        this.node.addChild(particle);
        particle.setPosition(cc.p(this.rectArray[this.holeIndex].objectPoint.x - 1024,this.rectArray[this.holeIndex].objectPoint.y - 768));
        particle.setLocalZOrder(3000);
        particle.runAction(cc.moveTo(1.2, cc.p(460 + this.digWordNum / this.typeArray.length * 565,600)));
    },
    
    createWordAnimation: function ()
    {
        this.shell.active = false;
        this.conch.active = false;
        this.box.active = false;
        

        this.progressBar.runAction(cc.scaleTo(1.5, this.digWordNum / this.typeArray.length, 1.0));

        var word = cc.instantiate(this.wordPrefab);
        word.getComponent("WordJS").initLabel(this.words[this.holeIndex].word, this.words[this.holeIndex].wordsound);
        word.getComponent("WordJS").initGameJS(this,this.words[this.holeIndex].wordimg);
        
        var originalScale = 0.24;
        var showFinalScale = 1.2;
        var middleScale = 0.9;


        word.scale = originalScale;
        word.setPosition(cc.p(this.rectArray[this.holeIndex].shakengrect.x - 878,this.rectArray[this.holeIndex].shakengrect.y - 625));
        word.setLocalZOrder(1000);
        this.node.addChild(word);

        var moveForwardAction = cc.moveTo(0.5,cc.p(0,0));
        var moveBackAction = cc.moveTo(0.5,cc.p(this.rectArray[this.holeIndex].shakengrect.x - 878,this.rectArray[this.holeIndex].shakengrect.y - 625));
        var scaleForwardAction = cc.scaleTo(0.5,showFinalScale);
        var scaleForwardAction2 = cc.scaleTo(0.15,middleScale);


        var scaleBackAction = cc.scaleTo(0.15,1.0);
        var scaleBackAction2 = cc.scaleTo(0.5,originalScale);

        var pauseAction = cc.scaleTo(2.0,middleScale);

        var spwanForwardAction = cc.spawn(moveForwardAction, scaleForwardAction);
        var spwanBackAction = cc.spawn(moveBackAction, scaleBackAction2);

        var func = cc.callFunc(this.wordGuiWei, this);

        var sequence1 = cc.sequence(spwanForwardAction, scaleForwardAction2);
        var sequence2 = cc.sequence(scaleBackAction,spwanBackAction);


        var soundFunc = cc.callFunc(this.delayPlaySound, this);
        var spawnPauseAndPlayWord = cc.spawn(pauseAction,soundFunc);

        word.runAction(cc.sequence(sequence1,spawnPauseAndPlayWord,sequence2,func));

    },
    delayPlaySound: function()
    {
        this.playAudio(this.words[this.holeIndex].wordsound, 0.1);
    },
    wordGuiWei: function()
    {
        this.isDiggingEnable = true;

        this.schedule(this.timerCountMethod, 1.0);

        if(this.digWordNum === this.typeArray.length)
        {
            window.Global.gameStatus = true;
            this.isDiggingEnable = false;
            cc.audioEngine.playEffect(this.goobJobAudio, false);
            this.dakuanArmature.playAnimation("happy",10);
            this.scheduleOnce(this.loadGameOverScene, 3.0);
        }
    },
    timerCountMethod: function()
    {
        if(this.timerCount === 5)
        {
            this.timerCount = 0;
            this.unschedule(this.timerCountMethod);
            this.createHand();
        }
        else
        {
            this.timerCount++;
        }
    },
    loadGameOverScene: function()
    {
        // if(window.Global.gameStatus === true)
        // {
            this.gameOverForData(this.totalTime, window.Global.gameStatus);
        // }

        cc.director.loadScene("GameOver");
    },
    canAnimFinished: function()
    {
        // this.isDiggingEnable = true;
        this.createShakengAction(false);
        this.can.active = false;
        // this.schedule(this.timerCountMethod, 1.0);
    },
    boomAnimFinished: function()
    {
        this.isDiggingEnable = true;
        var node = new cc.Node('Sprite');
        var sp = node.addComponent(cc.Sprite);
        sp.spriteFrame = this.bombLastPic;
        node.parent = this.node;
        node.setPosition(cc.p(this.rectArray[this.holeIndex].objectPoint.x - 1024,this.rectArray[this.holeIndex].objectPoint.y - 768));
        this.boom.active = false;


        this.schedule(this.timerCountMethod, 1.0);

    },
    chanziAnimationFinished: function()
    {
        this.chanzi.active = false;

        if(this.rectArray[this.holeIndex].objectType >= 0)
        {
            this.digWordNum++;

            this.createParticleEffect();

            if(this.digWordNum === this.typeArray.length)
            {
                this.unschedule(this.countDownTimerCallBack);
            }
        }
        switch(this.rectArray[this.holeIndex].objectType)
        {
            case 0:
                this.shell.active = true;
                this.shell.setPosition(cc.p(this.rectArray[this.holeIndex].objectPoint.x - 1024,this.rectArray[this.holeIndex].objectPoint.y - 768));
                this.createShellAnimation();
                this.dakuanPlayAnimation(this.rectArray[this.holeIndex].objectType);
            break;
            case 1:
                this.box.active = true;
                this.box.setPosition(cc.p(this.rectArray[this.holeIndex].objectPoint.x - 1024,this.rectArray[this.holeIndex].objectPoint.y - 768));
                this.createBoxAnimation();
                this.dakuanPlayAnimation(this.rectArray[this.holeIndex].objectType);
            break;
            case 2:
                this.conch.active = true;
                this.conch.opacity = 0;
                this.conch.setPosition(cc.p(this.rectArray[this.holeIndex].objectPoint.x - 1024,this.rectArray[this.holeIndex].objectPoint.y - 768));
                this.createConchAnimation();
                this.dakuanPlayAnimation(this.rectArray[this.holeIndex].objectType);
            break;
            case -1:
                this.boom.active = true;
                this.boom.opacity = 0;
                this.boom.setPosition(cc.p(this.rectArray[this.holeIndex].objectPoint.x - 1024,this.rectArray[this.holeIndex].objectPoint.y - 768));
                this.createBombAnimation();
                this.scheduleOnce(function() 
                {
                    this.dakuanPlayAnimation(this.rectArray[this.holeIndex].objectType);
                    // this.dakuanPlayAnimation(-2);
                }, 1.0);
            break;
            case -2:
                this.can.active = true;
                this.can.opacity = 0;
                this.can.setPosition(cc.p(this.rectArray[this.holeIndex].objectPoint.x - 1024,this.rectArray[this.holeIndex].objectPoint.y - 768));
                this.createCanAnimation();
                this.dakuanPlayAnimation(this.rectArray[this.holeIndex].objectType);
            break;
            case -3:
                this.createShakengAction(true);
            break;

            
        }
    },

    createShakengAction: function (isPlayEffect)
    {
        var rNum = Math.ceil(Math.random() * 10000) % 2;

        var node = new cc.Node('Sprite');
        var sp = node.addComponent(cc.Sprite);
        switch(rNum)
        {
            case 0:
                sp.spriteFrame = this.shakengFrame_1;
            break;
            case 1:
                sp.spriteFrame = this.shakengFrame_2;
            break;
        }
        node.parent = this.node;
        node.opacity = 0;
        node.setPosition(cc.p(this.rectArray[this.holeIndex].objectPoint.x - 1024,this.rectArray[this.holeIndex].objectPoint.y - 768));
        var fadeAction = cc.fadeTo(1.0, 255);
        var func = cc.callFunc(this.shakengActionFinished, this);

        node.runAction(cc.sequence(fadeAction, func));

        if(isPlayEffect)
        {
            cc.audioEngine.playEffect(this.emptyAudio, false);
        }
    },
    
    shakengActionFinished: function()
    {
        this.isDiggingEnable = true;
        this.schedule(this.timerCountMethod, 1.0);
    },
    seaAnimationFinished: function()
    {
        this.isDiggingEnable = true;
        this.progressBarBg.active = true;
        this.createHand();
        this.schedule(this.countDownTimerCallBack, 1.0);
    },
    createHand: function()
    {
        for(let i = 0; i < this.rectArray.length; i ++)
        {
            var option = this.rectArray[i];
            if(option.objectType !== -1 && option.objectType !== -2 && option.objectType !== -3)
            {
                if(option.isDigged === false)
                {
                    this.hand.active = true;
                    this.hand.setPosition(cc.p(this.rectArray[i].objectPoint.x - 1024 + 80,this.rectArray[i].objectPoint.y -768 - 70));
                    this.hand.stopAllActions();
                    this.hand.runAction(cc.repeatForever(cc.blink(1,1)));
                    this.hand.setLocalZOrder(1001);
                    break;
                }
            }
        }
    },
    createShellAnimation: function()
    {
        this.shellAnim.play("shellAnim");

        cc.audioEngine.playEffect(this.treasureAudio, false);
    },
    createBoxAnimation: function()
    {
        this.boxAnim.play("boxAnim");
        
        cc.audioEngine.playEffect(this.treasureAudio, false);
    },
    createConchAnimation: function()
    {
        this.conchAnim.play("conchAnim");

        cc.audioEngine.playEffect(this.treasureAudio, false);
    },

    createCanAnimation: function()
    {
        this.canAnim.play("canAnim");
    },

    createBombAnimation: function()
    {
        this.boomAnim.play("boomAnim");

        cc.audioEngine.playEffect(this.boomAudio, false);
    },
    createSeaAnimation: function()
    {
        this.seaAnim.play("sea");

        cc.audioEngine.playEffect(this.seaAudio, false);
    },

    createDiggingAnimation: function()
    {
        this.chanziAnimation.play("chanzi");

        cc.audioEngine.playEffect(this.digAudio, false);
    },

    createObjectByType: function(type)
    {
        switch(type)
        {
            case 0:
                return this.shellFrame;
            break;
            case 1:
                return this.boxFrame;
            break;
            case 2:
                return this.conchFrame;
            break;
            case -1:
                return this.boomFrame;
            break;
            case -2:
                return this.canFrame;
            break;
        }
    },
    createAllObjectsFirstTime: function()
    {
        for(let i = 0; i < this.rectArray.length; ++i)
        {
            var node = new cc.Node('Sprite');
            var sp = node.addComponent(cc.Sprite);
            // console.log(this.rectArray[i].objectType);
            sp.spriteFrame = this.createObjectByType(this.rectArray[i].objectType);
            node.parent = this.node;
            node.tag = 999 + i;
            node.setPosition(cc.p(this.rectArray[i].objectPoint.x - 1024,this.rectArray[i].objectPoint.y -768));
        }
    },
    deleteFirstTimeObject: function()
    {
        for (let i = 0; i < this.rectArray.length; ++i) 
        {
            var node = this.node.getChildByTag(999 + i);
            node.opacity = 0;
        }   
    },
    comeOutAllObjects: function()
    {
        this.hand.active = false;
        for (let i = 0; i < this.rectArray.length; ++i) 
        {
            var node = this.node.getChildByTag(999 + i);
            var rectOption = this.rectArray[i];
            if(rectOption.objectType === 0 || rectOption.objectType === 1 || rectOption.objectType === 2)
            {
                if(!rectOption.isDigged)
                {
                    node.runAction(cc.fadeTo(1.0, 255));
                }
            }
        }   
        this.scheduleOnce(this.gameOver, 3.0);
    },
    createSandHole: function()
    {
        //开始画线
        var xWidth = 302;
        var yWidth = 287

        this.rectArray = [];
        // for (let i = 0; i < 4; i++)
        // {
        //     var xLine = this.node.getComponent(cc.Graphics);
        //     xLine.lineWidth = 2;
        //     xLine.moveTo(26, 1194 - i * yWidth);
        //     xLine.lineTo(5 * 302, 1194 - i * yWidth);
        //     xLine.stroke();
        // }
        
        // for (let i = 0; i < 6; i++)
        // {
        //     var yLine = this.node.getComponent(cc.Graphics);
        //     yLine.lineWidth = 2;
        //     yLine.moveTo(26 + (xWidth - 5) * i, 1194);
        //     yLine.lineTo(26 + (xWidth - 5) * i, 1194 - yWidth * 3);
        //     yLine.stroke();
        // }

        var typeIndex = 0;

        for (let i = 0; i < 3; i++)
        {
            for(let j = 0; j < 5; j++)
            {
                // var g = this.node.getComponent(cc.Graphics);
                // g.rect(26 + 2 + j * (302 - 5), 1194 + 4 - i * 287 - 287 , 293 , 280);
                // g.fillColor = cc.Color.GREEN;
                // g.fill();

                var rect = new cc.Rect(26 + 2 + j * (302 - 5), 1194 + 4 - i * 287 - 287 , 293 , 280);

                // var g2 = this.node.getComponent(cc.Graphics);
                // g2.rect(rect.x + 150 + cc.randomMinus1To1()*30, rect.y + 150 + cc.randomMinus1To1()*30 , 10 , 10);
                // g2.fillColor = cc.Color.RED;
                // g2.fill();


                var point = cc.p(rect.x + 150 + cc.randomMinus1To1()*30, rect.y + 150 + cc.randomMinus1To1()*30);
                var wordContent = this.words[j + i * 5].word;
                var type;
                if(wordContent !== "emptyZp" && wordContent !== "canZp" && wordContent !== "bombZp")
                {
                    type = this.typeArray[typeIndex];
                    typeIndex++;
                }
                else if(wordContent === "emptyZp")
                {
                    type = -3;
                }
                else if(wordContent === "canZp")
                {
                    type = -2;
                }
                else if(wordContent === "bombZp")
                {
                    type = -1;
                }
                
                var shakengOption = {
                    shakengrect: rect,
                    isDigged: false,
                    objectPoint: point,
                    objectType: type
                };
                this.rectArray.push(shakengOption);
                // console.log(shakengOption);
            }
        }

        this.createAllObjectsFirstTime();
        this.payAttention.setLocalZOrder(500);
        this.sea.setLocalZOrder(501);
        
        this.scheduleOnce(function()
        {
            this.createSeaAnimation();
        },10);

        this.scheduleOnce(function()
        {
            this.deleteFirstTimeObject();
        },11.5);

        this.node.on(cc.Node.EventType.TOUCH_START, function(event)
        {
            // console.log(event.touch._point.x);
            // console.log(event.touch._point.y); 

            for (let i = 0; i < this.rectArray.length; i ++)
            {
                var option = this.rectArray[i];
                if(option.shakengrect.contains(event.touch._point))
                {
                    if(this.isDiggingEnable && option.isDigged === false)
                    {
                        option.isDigged = true;
                        this.hand.active = false;
                        this.holeIndex = i;
                        this.timerCount = 0;
                        // console.log("点击到了第 %d 个沙块", i + 1);
                        // console.log("点击到了 %s", this.words[i].word);
                        // console.log("声音url： %s", this.words[i].wordsound);
                        // console.log("物品位置在：%d,%d",option.objectPoint.x, option.objectPoint.y);
                        // console.log("type = %d", option.objectType);
                        this.isDiggingEnable = false;
                        // this.chanzi.setPosition(cc.p(event.touch._point.x - 2000 + 270,event.touch._point.y - 2000 + 500));
                        this.chanzi.setPosition(cc.p(option.shakengrect.x + 150  - 2000 + 270 , option.shakengrect.y + 150 - 2000 + 500 ));
                        this.chanzi.active = true;
                        this.createDiggingAnimation();
                    }
                    
                }
            }
        }, this);

    },

    //移除当前所有选项
    deleteOption: function () {

    },

    //创建选项按钮
    createOption: function (interactiveJson) {

    },

    gameOver: function()
    {
        this.timeLabel.string = this.countDown.toString();
        window.Global.gameStatus = false;

        cc.audioEngine.playEffect(this.timesUpAudio, false);
        this.loadGameOverScene();
    },

    showGuide: function()
    {
        if(this.startBg)
        {
            this.startBg.active = false;
            this.startBg.destroy();
        }

        this.guideNode.on(cc.Node.EventType.TOUCH_END, this.gameBegin, this);
        this.guideNode.active = true;
    
    },  
    gameBegin: function()
    {
        // this.startBg.active = false;
        // this.startBg.destroy();

        this.guideNode.active = false;

        this.dakuan.active = true;

        this.dakuanArmature = this.dakuan.getComponent(dragonBones.ArmatureDisplay);
        
        this.dakuanArmature.playAnimation("start",0);
    
        this.dakuanArmature.addEventListener(dragonBones.EventObject.COMPLETE, this.daKuanAnimationComplete, this);

        this.payAttentionGuide();
        this.createSandHole();

        this.countDownTimerCallBack = function () {
            if (this.countDown === 1)
            {
                this.unschedule(this.countDownTimerCallBack);
            }
                this.countDown--;
                this.timeLabel.string = this.countDown.toString();
                this.totalTime++;
                
            if (this.countDown === 0)
            {
                this.scheduleOnce(this.updateTimeLableAndDigStatus, 1.0);
            }
            
        }

        this.guideTimerCallBack = function () {
            if (this.guideTime === 1) {
                this.unschedule(this.guideTimerCallBack);
                // this.schedule(this.countDownTimerCallBack, 1.0);
            }
                this.guideTime--;
                this.timeLabel.string = this.guideTime.toString();
                
                if(this.guideTime === 0)
                {
                    this.scheduleOnce(this.updateTimeLabelToCountTime, 1.0);
                }   
        }
        this.schedule(this.guideTimerCallBack, 1.0);

    },
    updateTimeLabelToCountTime: function()
    {
        this.timeLabel.string = this.countDown.toString();
    },
    preloadFinish: function()
    {
        // console.log("preloadFinish");
    },
    //开始加载选项
    startloadOption: function () {

        cc.audioEngine.stopAll();
        
        this.isIts && this.questionNumListJS.changeOptionDisable();
        
        var question = this.questionArr[this.nowQuestionID];

        // this.titlelabel.string = question.qescont;

        // this.createOption(question.interactiveJson);

        // //倒计时
        let countDown = parseInt(question.interactiveJson['countDown']);
        if (countDown > 0) {
            this.countDown = countDown;
        }

        this.words = question.interactiveJson['words'];
        this.emptySandNum = 0;

        for(let i = 0; i < this.words.length; ++i)
        {
            cc.audioEngine.preload(this.words[i].wordsound, this.preloadFinish.bind(this));
        }

        var type = [0, 1 ,2];
        this.typeArray = [];
        this.a = parseInt(this.words.length / 3);
        this.b = parseInt((this.words.length - this.a) / 2);
        this.c = this.words.length - this.a - this.b;
        // console.log(this.a, this.b, this.c);

        for(let i = 0; i < this.a; ++i)
        {
            this.typeArray.push(type[0]);
        }

        for(let i = 0; i < this.b; ++i)
        {
            this.typeArray.push(type[1]);
        }

        for(let i = 0; i < this.c; ++i)
        {
            this.typeArray.push(type[2]);
        }

        // console.log(this.typeArray);
        this.shuffle(this.typeArray);
        // console.log(this.typeArray);

        var bombOption = {
            word:"bombZp",
            wordsound:""
        };
        var canOption = {
            word:"canZp",
            wordsound:""
        };
        var emptyOption = {
            word: "emptyZp",
            wordsound: ""
        };

        if(this.words.length === 0)
        {
            // console.log("题目配置error：没有配置单词");
        }
        else
        {
            if(this.words.length <= 12)
            {
                this.emptySandNum = 15 - 3 - this.words.length;
                this.words.push(bombOption);
                this.words.push(bombOption);
                this.words.push(canOption);
                for (let i = 0; i < this.emptySandNum; ++i) 
                {
                    this.words.push(emptyOption);
                }     
            }
            else if(this.words.length > 12)
            {
                this.emptySandNum = 0;
                this.badSandNum = 15 - this.words.length;
                for (let i = 0; i < this.badSandNum; ++i) 
                {
                    this.words.push(bombOption);
                }
            }
            // console.log("题目配置: 一共%d个单词", this.words.length);
            // console.log("题目配置: 一共%d个空沙坑", this.emptySandNum);
        }
   
        // console.log(this.words);
        this.shuffle(this.words);
        // console.log(this.words);

        if(window.Global.alreadyPlayOnce)
        {
            this.gameBegin();
        }
        else
        {
            cc.audioEngine.playEffect(this.letsSearchAudio, false);
            // this.startBg.on(cc.Node.EventType.TOUCH_END, this.showGuide, this);   
            this.showGuide();
        }
        cc.audioEngine.play(this.bgmAudio, true, 0.5);
        
        this.timeLabel.string = 10;

        this.guideTime = 10;

        this.answerTime = 0;

        // !this.isIts && this.showSchedule();
        this.isIts && this.questionNumListJS.changeOptionEnable();
        this.isShowFeed = false;
    },
    
    updateTimeLableAndDigStatus: function()
    {
        this.timeLabel.string = this.countDown.toString();
        this.isDiggingEnable = false;
        this.comeOutAllObjects();
    },


    //选中答案
    selectAnswer: function (target, isRight) {
        //显示状态过程中不接收事件
        if (this.isShowFeed || this.isShowLossTime) {
            return;
        }

        if (isRight) {
            if (CONSOLE_LOG_OPEN) console.log('答对了');

            this.rightSelect += 1;

            target.showParticle();

            //题打完了
            if (this.rightSelect >= this.count) {
                //取消定时器
                this.unschedule(this.timeCallback);

                this.isShowFeed = true;

                this.createAnswerInfo('1');

                this.scheduleOnce(function () {
                    this.showFeedback(1);
                }, 1.0);
            }
        } else {
            if (CONSOLE_LOG_OPEN) console.log('答错了');

            this.showLossTime();
        }
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
        cc.audioEngine.stop(this.audio);
        var self = this;
        cc.loader.loadRes('audio/' + audioName, cc.AudioClip, function (error, audio) {
            if (!error) {
                self.audio = cc.audioEngine.play(audio, false, 1);
            }
        });
    },
});