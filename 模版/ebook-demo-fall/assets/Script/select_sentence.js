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
        rightAudio:{
            url:cc.AudioClip,
            default:null
        },
        wrongAudio:{
            url:cc.AudioClip,
            default:null
        },
        tryAudio:{
            url:cc.AudioClip,
            default:null
        },
        RselectAudio:{
            url:cc.AudioClip,
            default:null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    initPage(data,right,audio,time,pageName){
        let self = this;
        if(data){
            self.questionAudio = audio;
            self.right = right;
            self.rightTime = time;
            self.text = data[0];
            self.data = data[1];
            self.pageName = pageName;
            self.loadText(self.text);
            self.rightSelect();
            self.stopAllCallbacks();

        }
    },
    lastData(name){
        let self = this;
        let right = cc.find('right',self.node);
        let wrong = cc.find('wrong',self.node);
        let ifReview = cc.sys.localStorage.getItem('review');
        let jsonData = cc.sys.localStorage.getItem(name);
        let lastData = JSON.parse(jsonData)

        right.opacity = 0;
        wrong.opacity = 0;

        if(self.data == self.right){
            right.opacity = 255;
        }
        if(ifReview == 'true'){
            if(self.data == self.right == lastData){
                right.opacity = 255;
            }else if(self.data == lastData && self.data !== self.right){
                wrong.opacity = 255;
            }else if(self.data == self.right && self.data !== lastData){
                right.children[0].opacity = 0;
                right.opacity = 255;
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
    loadText(text){
        let self = this;
        // let sub = btn.name.slice(-2)
        if(text){
            cc.find('text',self.node).getComponent(cc.RichText).string = text;
        }

    },
    hornPlay(){
        let self = this;
        let horn = self.node.parent.parent.getChildByName("horn_ske")
        let dragonHorn = horn.getComponent("dragonBones.ArmatureDisplay")

        dragonHorn.playAnimation('loop',0);
        self.scheduleOnce(()=>{
            dragonHorn.playAnimation('static',1);
        },self.rightTime)
    },
    bindSelect(){
        let self = this;
        cc.audioEngine.stopAll();
        let select = self.node
        let right = cc.find('right',self.node);
        let wrong = cc.find('wrong',self.node);
        let ifReview = cc.sys.localStorage.getItem('review');
        right.opacity = 0;
        wrong.opacity = 0;
        let Action = cc.sequence(cc.fadeIn(0.1),cc.fadeOut(0.1),cc.fadeIn(0.1),cc.fadeOut(0.1),cc.fadeIn(0.1));
        let children = self.node.parent.children;
        let read = select.parent.parent.getChildByName('read')
        let choice_sentence = select.parent.parent.getComponent('choice_sentence')
        let horn = select.parent.parent.getChildByName("horn_ske")
        let dragonHorn = horn.getComponent("dragonBones.ArmatureDisplay")

        let canvasF = cc.find('Canvas')
        let local = canvasF.getComponent('local')
        let result = self.data;
        let totalScore = cc.sys.localStorage.getItem('totalScore') || 0;
        let wrongTime = cc.sys.localStorage.getItem('wrongTime') || 0;

        read.on('touchend',()=>{
            cc.audioEngine.stopAll();
            cc.audioEngine.play(self.questionAudio,false,1)
            self.hornPlay()
        });
        if(select){
            self.pointerNode(select);
            select.on('touchstart',()=>{
               select.runAction(cc.scaleTo(0.5, 0.9))
            })
            select.on('touchcancel',()=>{
                select.runAction(cc.scaleTo(0.5, 1)) 
            })
            select.on('touchend',()=>{
                cc.audioEngine.stopAll(); 
                dragonHorn.playAnimation('static',1);
                select.runAction(cc.scaleTo(0.5, 1))  
                let total = cc.sys.localStorage.getItem('total') || 0;
                cc.sys.localStorage.setItem('total', (+total + 1)); 
                
                if(self.data === self.right){
                    right.runAction(Action);
                    cc.audioEngine.play(self.rightAudio,false,1); 
                    cc.sys.localStorage.setItem('nextPage',true)
                    self.successGame()

                    for(let i = 0;i<children.length;i++){
                        let page_js = children[i].getComponent('select_sentence');
                        page_js.unscheduleAllCallbacks();
                    }
                    local.saveResult(self.pageName,result,'choice')
                    if(ifReview == 'true'){
                        cc.sys.localStorage.setItem('totalScore', (+totalScore + 100));
                    }else{
                        choice_sentence.totalScore()
                    }
                }else{
                    choice_sentence.des();
                    read.pauseSystemEvents();
                    wrong.runAction(Action);
                    cc.audioEngine.play(self.wrongAudio,false,1);
                    cc.sys.localStorage.setItem('wrongTime', (+wrongTime + 1));
                    if(ifReview == 'true'){
                        self.reviewSubmit()
                        local.saveResult(self.pageName,result,'choice')
                    }else{
                        self.previewSubmit()
                        choice_sentence.wrongTime++;
                    }    
                }
                for(let i = 0;i<children.length;i++){
                    children[i].off('touchend');
                    children[i].off('touchstart');
                }

            })
        }
    },
    reviewSubmit(){
        let self = this;
        let select = self.node
        let read = select.parent.parent.getChildByName('read')

        self.scheduleOnce(()=>{
            let selects = select.parent.children;
            for(let i = 0;i<selects.length;i++){
                // selects[i].getChildByName('wrong').opacity = 0;
                selects[i].runAction(cc.sequence(cc.moveBy(0.05, -10, 0),cc.moveBy(0.05, 10, 0),cc.moveBy(0.05, -10, 0),cc.moveBy(0.05, 10, 0),))
                read.resumeSystemEvents();
            }
            selects[self.choice].getChildByName('right').getChildByName('look_right').opacity = 0;
            selects[self.choice].getChildByName('right').opacity = 255
            cc.audioEngine.play(self.RselectAudio,false,1);
            cc.sys.localStorage.setItem('nextPage', true)
        },1)
    },
    previewSubmit(){
        let self = this;
        let select = self.node
        let read = select.parent.parent.getChildByName('read')
        self.tryFull = function(){
            let selects = select.parent.children;
            for(let i = 0;i<selects.length;i++){
                let page_js = selects[i].getComponent('select_sentence');
                page_js.bindSelect();
            }
            cc.audioEngine.play(self.tryAudio,false,1);
        }
        self.againFull = function(){
            
            cc.audioEngine.play(self.questionAudio,false,1);
            self.hornPlay()
            read.resumeSystemEvents();
        }
        let selects = select.parent.children;
        for(let i = 0;i<selects.length;i++){
            let page_js = selects[i].getComponent('select_sentence');
            page_js.unscheduleAllCallbacks();
        }
        self.schedule(self.tryFull,0.7,0,0);
        self.schedule(self.againFull,4.4,0,0);
    },
    rightSelect(){
        let self = this;
        let i;
        if(self.right == "A"){
            i = 0;
        }else if(self.right == "B"){
            i = 1;
        }else if(self.right == "C"){
            i = 2;
        }else if(self.right == "D"){
            i = 3;
        }
        self.choice = i;
    },
    successGame(){
        //统计完成率
        let self = this;
        let finishTime = cc.sys.localStorage.getItem('finishTime') || 0;
        cc.sys.localStorage.setItem('finishTime', (+finishTime + 1));
    },
    pointerNode(node){
        node.on(cc.Node.EventType.MOUSE_ENTER, function(event){
            cc._canvas.style.cursor = 'pointer';
        });
        node.on(cc.Node.EventType.MOUSE_LEAVE, function(event){
            cc._canvas.style.cursor = 'default';
        });
    }

    // update (dt) {},
});
