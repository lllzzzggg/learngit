// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        select: {
          type: cc.Prefab,
          default: null    
        },
        rightAudio:{
            url:cc.AudioClip,
            default:null
        },
        wrongAudio:{
            url:cc.AudioClip,
            default:null
        },
        ohAudio:{
            url:cc.AudioClip,
            default:null
        },
        noAllAudio:{
            url:cc.AudioClip,
            default:null
        },
        RselectAudio:{
            url:cc.AudioClip,
            default:null
        },
       
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
    },
    initPage(data){
        let self = this;
        let question = cc.find('bg_question/question',self.node)
        self.server = cc.sys.localStorage.getItem('server');
        self.host = cc.sys.localStorage.getItem('HOST');
        self.server = self.host + self.server + '/';

        self.pageName = cc.sys.localStorage.getItem('server') + '_' + data.game;
        // cc.sys.localStorage.removeItem(self.pageName)
        let lastAnswer = cc.sys.localStorage.getItem(self.pageName);
        if(data){
            self.configData = data;
            self.imgUrl = self.server + self.configData.game;
            self.readAudio = self.server + self.configData.game + self.configData.audio;
            self.selection = self.configData.selection;
            self.rightArr = self.configData.right   
            self.rightTime = self.configData.rightTime
            self.question = self.configData.question
            
            self.initSelection(self.selection);
            question.getComponent(cc.RichText).string = self.question

            let bg2 = cc.find('bg2',self.node)
            self.bg = self.configData.background;
            if(self.bg && self.bg !== ''){
                bg2.active = true;
            }
            self.selectArray = [];
            self.selectNode= [];
            self.wrongTime = 0;
            self.bindBtn();
            self.stopAllCallbacks();

            let answerTime = cc.sys.localStorage.getItem('answerTime') || 0;
            cc.sys.localStorage.setItem('answerTime',(+answerTime + 1));

            let selects = cc.find('selection',self.node).children;
            if(!lastAnswer){
                for(let i = 0;i<selects.length;i++){
                    let page_js = selects[i].getComponent('select_listen_many');
                    page_js.bindSelect();
                }
            }else{
                self.lastData()
            }
            
        }
    },
    loadDynamicResources(data){ //提前加载页面时，需要加载出图片资源，
        let self = this;
        self.server = cc.sys.localStorage.getItem('server');
        self.host = cc.sys.localStorage.getItem('HOST');
        self.server = self.host + self.server + '/';
        if(data){
            self.configData = data;
            self.imgUrl = self.server + self.configData.game;
            self.readAudio = self.server + self.configData.game + self.configData.audio;
            self.selection = self.configData.selection;
            self.rightArr = self.configData.right   
            self.rightTime = self.configData.rightTime
            self.question = self.configData.question


            self.initSelection(self.selection);
            let bg2 = cc.find('bg2',self.node)
            self.bg = self.configData.background;
            if(self.bg && self.bg !== ''){
                bg2.active = true;
            }
        }
    },
    lastData(){
        let self = this;
        let ifReview = cc.sys.localStorage.getItem('review');
        let jsonData = cc.sys.localStorage.getItem(self.pageName);
        let lastData = JSON.parse(jsonData)

        let children = cc.find('selection',self.node).children;

        for(let i = 0;i<children.length;i++){
            let wrong = children[i].getChildByName("judge").getChildByName("wrong")
            let right = children[i].getChildByName("judge").getChildByName("right")
            let text = children[i].getChildByName('word').getChildByName('text').getComponent(cc.Label).string
            let a = self.rightArr.indexOf(text)
            let b = lastData.indexOf(text)

            if(a >= 0){
                right.opacity = 255
                right.children[0].opacity = 255
                if(b < 0){
                    right.children[0].opacity = 0
                }
            }else if(a < 0 && b >= 0){
                if(ifReview == 'true'){
                    wrong.opacity = 255;
                }
            }
            
        }
        
    },
    stopAllCallbacks(){
        let self = this;
        let nextBtn = cc.find('Canvas/button/next')
        nextBtn.on('touchstart',()=>{
            self.unscheduleAllCallbacks();
        })
    },
    bindBtn(){
        let self = this;
        let btn = cc.find('read',self.node);
        

        btn.on(cc.Node.EventType.MOUSE_ENTER, function(event){
            cc._canvas.style.cursor = 'pointer';
        });
        btn.on(cc.Node.EventType.MOUSE_LEAVE, function(event){
            cc._canvas.style.cursor = 'default';
        });
        
        btn.on('touchend',()=>{
            cc.audioEngine.stopAll();
            cc.audioEngine.play(self.readAudio,false,1)
            self.hornPlay()
        });
        btn.pauseSystemEvents()
        self.scheduleOnce(()=>{
            btn.resumeSystemEvents()
        },self.rightTime)
        self.scheduleOnce(()=>{
            cc.audioEngine.play(self.readAudio,false,1);
            self.hornPlay()
        },0.2)
    },
    hornPlay(){
        let self = this;
        let horn = cc.find('horn_ske',self.node);
        let dragonHorn = horn.getComponent("dragonBones.ArmatureDisplay")

        dragonHorn.playAnimation('loop',0);
        self.scheduleOnce(()=>{
            dragonHorn.playAnimation('static',1);
        },self.rightTime)
    },
    initSelection(options){
        let self = this;
        let selection = cc.find('selection',self.node);
        selection.removeAllChildren();
        if(options.length !== 0){
            for(let i = 0;i<options.length;i++){
                let option = options[i];
                let select = cc.instantiate(self.select);
                let select_js = select.getComponent('select_listen_many');
                select_js.initPage(option,self.imgUrl);
                selection.addChild(select);
            }
        }
        if(selection.children.length !== 0){
            self.resize();
        }
    },
    resize(){
        let self = this;
        let selection = cc.find('selection',self.node);
        let children = selection.children;
        let len = children.length;
        let width = 1700;
        let line_up = Math.ceil(len/2) 
        let line_down = Math.floor(len/2) 
    
        if(len <= 3){
            for(let i = 0;i < len;i++){
                let _width = width/len;
                children[i].y = -230;
                children[i].x = _width/2 + _width * i - width/2;
                // children[i].x = (len - 1)/len * width + _width/2 - _width * i
            }
        }else{
            for(let j = 0;j < line_up;j++){
                let _width = width/line_up;
                children[j].y = 0;
                children[j].x = _width/2 + _width * j - width/2;
            }
            for(let k = 0;k < line_down;++k){
                let _width = width/line_down;
                children[k + line_up].y = -430;
                children[k + line_up].x = _width/2 + _width * k - width/2;
            }
        }      
    },
    submitSelect(){
        let self = this; 
        let subBtn = cc.find('button',self.node);

        if(self.selectArray.length > 0){
            self.loadImg(subBtn,'falls/choice/submit')
            self.submitClick()
        }else{
            self.loadImg(subBtn,'falls/choice/unsubmit')
            subBtn.off('touchend')
        }
        
    },
    submitClick(){
        let self = this;
        let subBtn = cc.find('button',self.node);
        let ifReview = cc.sys.localStorage.getItem('review');
        let canvasF = cc.find('Canvas')
        let local = canvasF.getComponent('local')
        let result = self.selectArray;
       
        subBtn.off('touchend')       
        subBtn.on('touchstart',()=>{
            subBtn.runAction(cc.scaleTo(0.5, 0.9))
        })
        
        subBtn.on('touchend',()=>{
            self.loadImg(subBtn,'falls/choice/unsubmit')
            subBtn.off('touchend') 
            subBtn.off('touchstart') 
            subBtn.runAction(cc.scaleTo(0.5, 1))           
            self.unscheduleAllCallbacks();

            let rightIf = self.compareArr(self.selectArray,self.rightArr)
            let totalScore = cc.sys.localStorage.getItem('totalScore') || 0;
            let wrongTime = cc.sys.localStorage.getItem('wrongTime') || 0;
            if(ifReview == 'true'){
                self.reviewSubmit(rightIf)
                local.saveResult(self.pageName,result,'choice')
                cc.sys.localStorage.setItem('nextPage',true)
                if(rightIf == 0){
                    cc.sys.localStorage.setItem('totalScore', (+totalScore + 100));
                }else{
                    cc.sys.localStorage.setItem('totalScore', (+totalScore + 0));
                    cc.sys.localStorage.setItem('wrongTime', (+wrongTime + 1));
                }
            }else{
                self.previewSubmit(rightIf);
                if(rightIf == 0){
                    self.totalScore()
                    local.saveResult(self.pageName,result,'choice')
                }else{
                    self.wrongTime++;
                    cc.sys.localStorage.setItem('wrongTime', (+wrongTime + 1));
                }
            }
            let total = cc.sys.localStorage.getItem('total') || 0;
            cc.sys.localStorage.setItem('total', (+total + 1));
            
        })
    },
    totalScore(){
        let self = this;
        let selfscore = 100;
        let totalScore = cc.sys.localStorage.getItem('totalScore') || 0;

        if(self.wrongTime == 0){
            selfscore = 100;
        }else if(self.wrongTime == 1){
            selfscore = 80;
        }else if(self.wrongTime == 2){
            selfscore = 70;
        }else if(self.wrongTime > 2){
            selfscore = 60;
        }
        cc.sys.localStorage.setItem('totalScore', (+totalScore + selfscore));
    },
    reviewSubmit(ans){
        let self = this; 
        switch(ans)
            {
                case 0:
                for(let i = 0;i < self.selectNode.length;++i){
                    self.selectNode[i].getChildByName("chosed").opacity = 0
                    let right = self.selectNode[i].getChildByName("judge").getChildByName("right")
                    right.getChildByName('look_right').opacity = 255
                    right.runAction(cc.sequence(cc.fadeIn(0.1),cc.fadeOut(0.1),cc.fadeIn(0.1),cc.fadeOut(0.1),cc.fadeIn(0.1)))                  
                }
                self.successGame()
                cc.audioEngine.play(self.rightAudio,false,1);  
                self.pauseEvents(true);
                cc.sys.localStorage.setItem('nextPage', true)
                break;
                case 1:
                for(let i = 0;i < self.selectNode.length;++i){
                    self.selectNode[i].getChildByName("chosed").opacity = 0
                    let right = self.selectNode[i].getChildByName("judge").getChildByName("right")
                    right.getChildByName('look_right').opacity = 255
                    // right.runAction(cc.sequence(cc.fadeIn(0.1),cc.fadeOut(0.1),cc.fadeIn(0.1),cc.fadeOut(0.1),cc.fadeIn(0.1)))
                }
                self.pauseEvents();
                self.reResumeEvents();
                break;
                case 2:
                for(let i = 0;i < self.selectNode.length;++i){
                    let a = self.rightArr.indexOf(self.selectArray[i])
                    if(a >= 0){
                        self.selectNode[i].getChildByName("chosed").opacity = 0
                        let right = self.selectNode[i].getChildByName("judge").getChildByName("right")
                        right.getChildByName('look_right').opacity = 255
                        right.runAction(cc.sequence(cc.fadeIn(0.1),cc.fadeOut(0.1),cc.fadeIn(0.1),cc.fadeOut(0.1),cc.fadeIn(0.1)))
                    }else{
                        self.selectNode[i].getChildByName("chosed").opacity = 0
                        let wrong = self.selectNode[i].getChildByName("judge").getChildByName("wrong")
                        wrong.runAction(cc.sequence(cc.fadeIn(0.1),cc.fadeOut(0.1),cc.fadeIn(0.1),cc.fadeOut(0.1),cc.fadeIn(0.1)))
                    }
                }
                cc.audioEngine.play(self.wrongAudio,false,1);  
                self.pauseEvents();
                self.scheduleOnce(()=>{
                    self.reResumeEvents();
                },0.5)
                break;
            }
    },
    previewSubmit(ans){
        let self = this;  
        switch(ans)
        {
            case 0:
            for(let i = 0;i < self.selectNode.length;++i){
                self.selectNode[i].getChildByName("chosed").opacity = 0
                let right = self.selectNode[i].getChildByName("judge").getChildByName("right")
                right.getChildByName('look_right').opacity = 255
                right.runAction(cc.sequence(cc.fadeIn(0.1),cc.fadeOut(0.1),cc.fadeIn(0.1),cc.fadeOut(0.1),cc.fadeIn(0.1)))                  
            }
            cc.audioEngine.play(self.rightAudio,false,1);  
            self.pauseEvents(true);
            self.successGame();
            break;
            case 1:
            for(let i = 0;i < self.selectNode.length;++i){
                self.selectNode[i].getChildByName("chosed").opacity = 0
                let right = self.selectNode[i].getChildByName("judge").getChildByName("right")
                right.getChildByName('look_right').opacity = 255
                right.runAction(cc.sequence(cc.fadeIn(0.1),cc.fadeOut(0.1),cc.fadeIn(0.1),cc.fadeOut(0.1),cc.fadeIn(0.1)))
            }
            self.pauseEvents();
            self.resumeEvents(6.2);
            cc.audioEngine.play(self.noAllAudio,false,1);
            self.submitSelect();
            break;
            case 2:
            for(let i = 0;i < self.selectNode.length;++i){
                let a = self.rightArr.indexOf(self.selectArray[i])
                if(a >= 0){
                    self.selectNode[i].getChildByName("chosed").opacity = 0
                    let right = self.selectNode[i].getChildByName("judge").getChildByName("right")
                    right.getChildByName('look_right').opacity = 255
                    right.runAction(cc.sequence(cc.fadeIn(0.1),cc.fadeOut(0.1),cc.fadeIn(0.1),cc.fadeOut(0.1),cc.fadeIn(0.1)))
                }else{
                    self.selectNode[i].getChildByName("chosed").opacity = 0
                    let wrong = self.selectNode[i].getChildByName("judge").getChildByName("wrong")
                    wrong.runAction(cc.sequence(cc.fadeIn(0.1),cc.fadeOut(0.1),cc.fadeIn(0.1),cc.fadeOut(0.1),cc.fadeIn(0.1)))
                }
            }
            cc.audioEngine.play(self.wrongAudio,false,1);  
            self.pauseEvents();
            self.schedule(()=>{
                self.resumeEvents(3.2);
                self.submitSelect();
                cc.audioEngine.play(self.ohAudio,false,1);
            },0.5,0,0)
            break;
        }
    },
    pushSelect(add){
        let self = this
        let word = add.getChildByName("word").getChildByName("text").getComponent(cc.Label).string
        
        self.selectArray.push(word);
        self.selectNode.push(add);
        self.submitSelect()
    },
    deleteSelect(pop){
        let self = this
        let word = pop.getChildByName("word").getChildByName("text").getComponent(cc.Label).string
        let a = self.selectArray.indexOf(word);
        
        self.selectArray.splice(a,1)
        self.selectNode.splice(a,1)
        self.submitSelect()
    },
    compareArr(arr1,arr2){
        let self = this
        
        if(arr1.length === arr2.length){
            if(!self.traverseArr(arr1,arr2)){
                return 0           //全对
            }else{
                return 2            //含有错误选项
            }
        }else if(arr1.length < arr2.length){
            if(self.traverseArr(arr1,arr2)){
                return 2          //含有错误选项
            }else{
                return 1          //不含错误选项，但正确选项没选全
            }
        }else if(arr1.length > arr2.length){
            return 2                //多选了错误选项
        }
    },
    traverseArr(arr1,arr2){
        let self = this
        let checkArr = []
        for(let i = 0;i < arr1.length;++i){
            let a = arr2.indexOf(arr1[i])
            checkArr.push(a)
        }
        return checkArr.some(self.checkSome)
    },
    checkSome(a){
        return a < 0
    },
    pauseEvents(c){
        let self = this;
        let read = cc.find('read',self.node);
        let btn = cc.find('button',self.node);
        let children = cc.find('selection',self.node).children;

        btn.pauseSystemEvents(); 
        
        for(let i = 0;i<children.length;i++){
            children[i].pauseSystemEvents();
        }
        if(!c){
            read.pauseSystemEvents(); 
        }
    },
    resumeEvents(time){
        let self = this;
        let btn = cc.find('button',self.node);
        let read = cc.find('read',self.node);
        let children = cc.find('selection',self.node).children;

        self.schedule(()=>{
            cc.audioEngine.play(self.readAudio,false,1)
            self.hornPlay()
            for(let i = 0;i<children.length;i++){
                children[i].getChildByName("judge").getChildByName("wrong").opacity = 0;
                children[i].getChildByName("judge").getChildByName("right").opacity = 0;
                children[i].getChildByName("chosed").opacity = 0;
            }
        },time,0,0)
        for(let i = 0;i<children.length;i++){
            children[i].resumeSystemEvents();
        }
        btn.resumeSystemEvents();
        read.resumeSystemEvents();
        
        
        self.selectArray = []
        self.selectNode= []
    },
    reResumeEvents(){
        let self = this;
        let btn = cc.find('button',self.node);
        let read = cc.find('read',self.node);
        let children = cc.find('selection',self.node).children;

        read.resumeSystemEvents();
        for(let i = 0;i<children.length;i++){
            let wrong = children[i].getChildByName("judge").getChildByName("wrong")
            let right = children[i].getChildByName("judge").getChildByName("right")
            let chosed = children[i].getChildByName("chosed")
            let text = children[i].getChildByName('word').getChildByName('text').getComponent(cc.Label).string
            let a = self.rightArr.indexOf(text)
            // wrong.opacity = 0;
            chosed.opacity = 0;
            children[i].runAction(cc.sequence(cc.moveBy(0.05, -10, 0),cc.moveBy(0.05, 10, 0),cc.moveBy(0.05, -10, 0),cc.moveBy(0.05, 10, 0),))

            if(a >= 0){
                right.opacity = 255
            }
        }
        cc.audioEngine.play(self.RselectAudio,false,1)
        cc.sys.localStorage.setItem('nextPage', true)
        self.selectArray = []
        self.selectNode = []
    },
    loadImg(node,url){
        var self = this;
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            node.getComponent(cc.Sprite).spriteFrame = spriteFrame
        });
    },
    loadResImg(node,url){
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    },
    successGame(){
        //统计完成率
        let self = this;
        let finishTime = cc.sys.localStorage.getItem('finishTime') || 0;
        cc.sys.localStorage.setItem('finishTime', (+finishTime + 1));
    },
    des(){
        this.unscheduleAllCallbacks();
    },
    out() {
        this.unscheduleAllCallbacks();
    }

    // update (dt) {},
});
