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
          
        }
       
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    initPage(data){
        let self = this;
        self.server = cc.sys.localStorage.getItem('server');
        self.host = cc.sys.localStorage.getItem('HOST');
        self.server = self.host + self.server + '/';

        self.pageName = cc.sys.localStorage.getItem('server') + '_' + data.game;
        // cc.sys.localStorage.removeItem(self.pageName)
        let lastAnswer = cc.sys.localStorage.getItem(self.pageName);
        cc.log(self.pageName)
        if(data){
            self.configData = data;
            self.imgUrl = self.server + self.configData.game;
            self.readAudio = self.server + self.configData.game + self.configData.audio;
            self.selection = self.configData.selection;
            self.right = self.configData.right;
            self.question = self.configData.question; 
            self.rightTime = self.configData.rightTime
            self.initSelection(self.selection);
            let question = cc.find('bg_question/question',self.node);     
            question.getComponent(cc.RichText).string = self.question

            let bg2 = cc.find('bg2',self.node)
            self.bg = self.configData.background;
            if(self.bg && self.bg !== ''){
                bg2.active = true;
            }
            self.bindBtn();
            let answerTime = cc.sys.localStorage.getItem('answerTime') || 0;
            cc.sys.localStorage.setItem('answerTime',(+answerTime + 1));

            let selects = cc.find('selection',self.node).children;
            
            if(!lastAnswer){
                for(let i = 0;i<selects.length;i++){
                    let page_js = selects[i].getComponent('select_words');
                    page_js.bindSelect();
                }
            }else{
                for(let i = 0;i<selects.length;i++){
                    let page_js = selects[i].getComponent('select_words');
                    page_js.lastData(self.pageName)
                }
            }

            self.wrongTime = 0;
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
            self.right = self.configData.right;
            self.question = self.configData.question;
            self.rightTime = self.configData.rightTime;
            
            self.initSelection(self.selection);
            let bg2 = cc.find('bg2',self.node)
            self.bg = self.configData.background;
            if(self.bg && self.bg !== ''){
                bg2.active = true;
            }
        }
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
    bindBtn(){

        let self = this;

        let btn = cc.find('read',self.node);

        btn.on(cc.Node.EventType.MOUSE_ENTER, function(event){
            cc._canvas.style.cursor = 'pointer';
        });
        btn.on(cc.Node.EventType.MOUSE_LEAVE, function(event){
            cc._canvas.style.cursor = 'default';
        });
        self.scheduleOnce(()=>{
            btn.on('touchend',()=>{
                cc.audioEngine.stopAll();
                cc.audioEngine.play(self.readAudio,false,1)
                self.hornPlay()
            });
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
                let select_js = select.getComponent('select_words');
                
                select_js.initPage(option,self.right,self.readAudio,self.imgUrl,self.rightTime,self.pageName);
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

        let _width = 0; 
        if(width){
            _width = width/2;
        }
        if(len <= 2){
            for(let i = 0;i < len;i++){
                let _width = width/len;
                children[i].y = -200;
                children[i].x = _width/2 + _width * i - width/2;
            }
        }else{
            for(let j = 0;j < line_up;j++){
                let _width = width/line_up;
                children[j].y = 0;
                children[j].x = _width/2 + _width * j - width/2;
            }
            for(let k = 0;k < line_down;++k){
                let _width = width/line_down;
                children[k + line_up].y = -470;
                children[k + line_up].x = _width/2 + _width * k - width/2;
            }
        }
    },
    pauseEvents(){
        let self = this;
        let btn = cc.find('read',self.node);
        btn.pauseSystemEvents();
        let children = cc.find('selection',self.node).children;
        for(let i = 0;i<children.length;i++){
            children[i].pauseSystemEvents();
        }
    },
    resumeEvents(){
        let self = this;
        let btn = cc.find('read',self.node);
        btn.resumeSystemEvents();
        let children = cc.find('selection',self.node).children;
        for(let i = 0;i<children.length;i++){
            children[i].resumeSystemEvents();
        }
    },
    loadImg(node,url){
        cc.loader.load(url,function(err,img){
            if(err) return;
            node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(img);
        })
    },
    loadResImg(node,url){
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    },
    des(){
        this.unscheduleAllCallbacks();
    },
    out() {
        this.unscheduleAllCallbacks();
    }

    // update (dt) {},
});
