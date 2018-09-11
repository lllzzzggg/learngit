window.Vipx = {
    score: null,
    scoreNode:null,
    word:null,
    audioUrl:''
};
cc.Class({
    extends: cc.Component,

    properties: {
        audio:{
            url:cc.AudioClip,
            default:null
        },
        beginAudio:{
            url:cc.AudioClip,
            default:null
        },
        audio0:{
            url:cc.AudioClip,
            default:null
        },
        audio3:{
            url:cc.AudioClip,
            default:null
        },
        audio4:{
            url:cc.AudioClip,
            default:null
        },
        audio5:{
            url:cc.AudioClip,
            default:null
        }
        
    },

    start () {   	
        this.timer = null;
        this.time = 0;
        this.flag = false;
        this.audioUrl = '';
        this.circleFlag = false;
        this.init();
    },
    initWord(game,timeout,data){
        let self = this;
        self.host = cc.sys.localStorage.getItem('HOST');
        self.server = cc.sys.localStorage.getItem('server');
        let bone_node = cc.find('card/xingxing_ske',self.node);
        bone_node.opacity = 0;
        if(game){
            self.game = game;
            self.timeout = timeout;
        }
        if(data){
            self.card = data;
            let name = self.card.trim().replace(/\s/g,"_");
            self.audio = `${self.host}${self.server}/${self.game}/audio/${name}.mp3`;

            self.loadCard(data); 
        }
    },
    init(){
    	let self = this;
    	let card = cc.find('card',self.node);
        let os = cc.find('card/label/os',self.node);
        let mask = cc.find('mask',card);
        let button = cc.find('button',self.node);
        let bone_node = cc.find('card/xingxing_ske',self.node);
        bone_node.opacity = 0;
         if(mask){
            mask.x = 0;
            mask.y = -60;
            
            mask.opacity = 0;
         }
    	if(card){
    		card.x = - self.node.x;
    		card.y = 200;
    	}

    	button.on(cc.Node.EventType.TOUCH_END,() => {
            self.triggerTouch()
    	});
        window.voiceCallback = {};
        window.voiceCallback.handleResult = self.handleResult;
        window.handleResult = self.handleResult;


    	self.bindClose();
    	self.bindPlay();
        self.bindVoiceTest();//语音评测
    },
    triggerTouch(){
        let self = this
        let children = self.node.parent.children;
        self.node.zIndex = 8;
        for (let i = 0; i < children.length; i++) {
            if (children[i].uuid !== self.node.uuid) {
                children[i].active = false;
                //children[i].pauseSystemEvents(true);
            }
        }
        self.touchendEvent();
    },
    loadCard(card){
        let self = this;
        let text = cc.find('card/word_bg/text',self.node);
        text.getComponent(cc.Label).string = card;
        
        if(card){
            card = card.trim().replace(/\s/g,"_");
            let url = `${self.host}${self.server}/${ self.game }/img/${card}.jpg`;
            cc.loader.load(url,(err,card)=>{
                if(err) return;
                cc.find('card/card',self.node).getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(card);
            })
        }
    },
    touchendEvent(){
    	let self = this;
    	let card = cc.find('card',self.node);
        let mask = cc.find('mask',card);
        let button1 = cc.find('button',self.node);
        mask.runAction(cc.fadeTo(0.2,120))
        button1.pauseSystemEvents(true);

        //向上派送事件
        self.node.dispatchEvent(new cc.Event.EventCustom('cardOpen', true))

		if(card){
			let action = cc.scaleTo(0.5,1,1).easing(cc.easeCubicActionInOut());
            card.runAction(action);
            self.pausePageBtn();
            
            let text = cc.find('card/word_bg/text',self.node);
            let button = cc.find('button',self.node);
            button.stopAllActions();
            button.runAction(cc.rotateTo(0.2,0));
            self.scheduleOnce(()=>{
                 button.stopAllActions();
            },0.5)
            
            window.Vipx.word = self.node;
            window.Vipx.scoreNode = cc.find('card/label/scores',self.node);
            let children = cc.find('card/btns',self.node).children;
            let play = cc.find('card/word_bg/play',self.node);
            let play_dragon_node = cc.find('card/word_bg/horn_ske',self.node);
            let play_dragon = play_dragon_node.getComponent('dragonBones.ArmatureDisplay');
            let timeout = cc.find('card/word_bg/timeout',self.node);
            
            for(let i = 0;i<children.length;i++){
                children[i].opacity = 0;
            }
			//self.node.off('touchend');
            let score = cc.sys.localStorage.getItem(self.game + '_' + self.card + '_score');

            if(score){
                for(let i = 0;i<children.length;i++){
                    children[i].opacity = 255;
                }
                self.loadStars(score);
            }else{
                let audioId = null;
                play.zIndex = 0;
                timeout.zIndex = 10;
                self.pauseEvent();

                self.scheduleOnce(()=>{
                    play_dragon.playAnimation('loop',-1);
                    audioId = cc.audioEngine.play(self.audio,false,1);
                },1)
                let time = cc.audioEngine.getDuration(audioId) || self.timeout;
                self.scheduleOnce(()=>{
                    play.zIndex = 10;
                    timeout.zIndex = 0;
                    //self.touchstartEv();//开始评测
                   // self.bindStopRecord();
                    play_dragon.playAnimation('static',-1);
                    for(let i = 0;i<children.length;i++){
                        if(children[i].name == 'record' || children[i].name == 'stop'){
                            children[i].opacity = 255;
                        }
                    }
                },time + 1);              
            }
            
		}
    },
    
    bindClose(){
        let self = this;
    	let close = cc.find('card/close',self.node);
    	let card = cc.find('card',self.node);
        let mask = cc.find('mask',card);
        let button1 = cc.find('button', self.node);
        
    	
		if(card){
			close.on(cc.Node.EventType.TOUCH_END,() => {
                cc.audioEngine.stopAll();
                self.unscheduleAllCallbacks();
                self.resumePageBtn();
				let action1 = cc.scaleTo(0.5,0,0).easing(cc.easeCubicActionInOut());;
                card.runAction(action1);
                button1.resumeSystemEvents(true);
                mask.runAction(cc.fadeTo(0.2, 0))
				self.scheduleOnce(()=>{
                    let children = self.node.parent.children;
                    for(let i = 0;i<children.length;i++){
                        if(children[i].uuid !== self.node.uuid){
                            children[i].resumeSystemEvents(true);
                        }
                    }
				},0.5);
			})
		}

    },
    bindPlay(){
    	let self = this;

    	let play = cc.find('card/word_bg/play',self.node);
        let timeout = cc.find('card/word_bg/timeout',self.node);
        let play_dragon_node = cc.find('card/word_bg/horn_ske',self.node);
        let play_dragon = play_dragon_node.getComponent('dragonBones.ArmatureDisplay');

    	play.on(cc.Node.EventType.TOUCH_END,() => {
            cc.audioEngine.stopAll();
            play_dragon.playAnimation('loop',-1);
    		cc.audioEngine.play(self.audio, false, 1);
    		play.zIndex = 0;
    		timeout.zIndex = 10;
    		self.scheduleOnce(() => {
                play_dragon.playAnimation('static',-1);
    			play.zIndex = 10;
    			timeout.zINdex = 0;
    		},1.5)
    	})

    	timeout.on(cc.Node.EventType.TOUCH_END,() => {
    		self.unscheduleAllCallbacks();
    		cc.audioEngine.stopAll();
    		play.zIndex = 10;
    		timeout.zINdex = 0;

    	})
    },
    bindCheck(audioUrl,tokenId){
        let self = this;
        let check = cc.find('card/btns/check',self.node);
        let check_dragon_node = cc.find('card/btns/horn_ske',self.node);
        let check_dragon = check_dragon_node.getComponent('dragonBones.ArmatureDisplay');

        if(audioUrl || tokenId){
            check.opacity = 255;
            check_dragon_node.opacity = 255;
            
            check.off('touchend');
            let id = null;
            check.on('touchend',()=>{
                cc.audioEngine.stopAll();

                let url = 'http://' + audioUrl + '.mp3';
              
                check_dragon.playAnimation('loop',-1);
                if (cc.sys.os == 'Windows') {
                    id = cc.audioEngine.play(url, false, 1);
                    let time = (id ? cc.audioEngine.getDuration(id) : 0) || 2;
                    self.scheduleOnce(()=>{
                        check_dragon.playAnimation('static', -1);
                    }, time);
                }else{
                    self.playAudio(tokenId);
                    self.scheduleOnce(()=>{
                        check_dragon.playAnimation('static', -1);
                    }, 2);
                }
            })
        }else{
            check.opacity = 0;
            check_dragon_node.opacity = 0;
        }
       
    },
    playAudio(token){
         var endMsg = {
             "operateType": "playAudio",
             "body": {
                 "tokenId": token
             }
         };
         // 调起native开始评测
         window.webkit.messageHandlers.VIPXJSSDK.postMessage(endMsg);
    },
    bindVoiceTest(){
        let self = this;

        let record = cc.find('card/btns/record',self.node);
        let stop = cc.find('card/btns/stop',self.node);
        self.circle = cc.find('card/btns/stop/cc',self.node);
        self.c_sprite = self.circle.getComponent(cc.Sprite);
        self.c_sprite.fillRange = 0;
        
        record.on(cc.Node.EventType.TOUCH_END,()=>{
            self.touchstartEv();
        })
        stop.on(cc.Node.EventType.TOUCH_END,()=>{
            self.c_sprite.fillRange = 0;
            self.circleFlag = false;
            self.touchendEv();
        })

    },
    circleAction(){
        let self = this;
        if(self.c_sprite.fillRange > -1){
            self.c_sprite.fillRange -= 1/(self.timeout * 100);
        }else{
            self.circleFlag = false;
            self.unschedule(self.timerCallback);
            self.touchendEv();
        }
    },
    touchstartEv(){
        let self = this;
        let record = cc.find('card/btns/record',self.node);
        let stop = cc.find('card/btns/stop',self.node);
        record.zIndex = 0;
        stop.zIndex = 10;
        cc.audioEngine.play(self.beginAudio,false,1);
        self.scheduleOnce(()=>{
            self.circleFlag = true;
            self.startTimer();
            self.startVoiceTest();
        },0.4);
        
    },
    pauseEvent(){
        let self = this;
        //let close = cc.find('card/close',self.node);
        let play = cc.find('card/word_bg/play',self.node);
        let timeout = cc.find('card/word_bg/timeout',self.node);
        let check = cc.find('card/btns/check',self.node);
        //close.pauseSystemEvents(true);
        play.pauseSystemEvents(true);
        timeout.pauseSystemEvents(true);
        check.pauseSystemEvents(true);
    },
    resumeEvent(){
        let self = this;
        //let close = cc.find('card/close',self.node);
        let play = cc.find('card/word_bg/play',self.node);
        let timeout = cc.find('card/word_bg/timeout',self.node);
        let check = cc.find('card/btns/check',self.node);
        //close.resumeSystemEvents(true);
        play.resumeSystemEvents(true);
        timeout.resumeSystemEvents(true);
        check.resumeSystemEvents(true);
    },
    bindStopRecord(){
        let self = this;

       let stop = cc.find('card/btns/stop',self.node);
        stop.on('touchend',()=>{
            self.c_sprite.fillRange = 0;
            self.circleFlag = false;
            self.touchendEv();
        
        })
    },
    touchendEv(){
        let self = this;
        let record = cc.find('card/btns/record',self.node);
        let stop = cc.find('card/btns/stop',self.node);
        self.circle = cc.find('card/btns/stop/cc',self.node);
        self.c_sprite = self.circle.getComponent(cc.Sprite);
        stop.runAction(cc.sequence(cc.delayTime(0.1),cc.scaleTo(0.3,1,1)));
        self.scheduleOnce(()=>{
            record.zIndex = 10;
            stop.zIndex = 0;
            self.c_sprite.fillRange = 0;
            self.circleFlag = false;
            self.endVoiceTest();
            self.resumeEvent();
        },0.4);
        

    },
    startVoiceTest(){
        let self = this;
        self.flag = false;
        let play = cc.find('card/word_bg/play', self.node);
        let close = cc.find('card/close', self.node);
        close.active = false;
        play.pauseSystemEvents(true);

        //驰生
        self.voice = {};
        self.voice['userId'] = 'vipx';
        self.voice['coreType'] = 'en.sent.score';
        self.voice['refText'] = self.card;
        self.voice['provideType'] = 'cloud';
        self.voice['attachAudioUrl'] = '1';

        //统计答题次数,与finishTime统计答题成功率
        let total = cc.sys.localStorage.getItem('total')||0;
        cc.sys.localStorage.setItem('total',(+total+1));

        let stars_node = cc.find('card/stars', self.node);
        let bone_node = cc.find('card/xingxing_ske', self.node);
        let bone = bone_node.getComponent('dragonBones.ArmatureDisplay');
        stars_node.opacity = 0;
        bone_node.opacity = 0;
        
        if(cc.sys.os === 'Windows'){
            //发送postMessage
            window.parent.postMessage({
                action:'beginRecord',
                voice: JSON.stringify(self.voice),
                handle: 'window.voiceCallback.handleResult'
            }, '*')
            self.result = window.WCRClassRoom.beginRecord(JSON.stringify(self.voice),'window.voiceCallback.handleResult');     
            
        }else if(cc.sys.os === 'iOS'){
            let startMsg = {
                'operateType':'evaluateStart',
                'body':{
                    'type':'read_word',
                    'content':self.card,
                    'timeout':+self.timeout*2
                }
            }
           if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.VIPXJSSDK){
                window.webkit.messageHandlers.VIPXJSSDK.postMessage(startMsg);
            }
        }
    },
    pausePageBtn(){
        let btns = cc.find('Canvas/button').children;
        for(let i = 0;i< btns.length;i++){
            btns[i].pauseSystemEvents(true);
        }
    },
    resumePageBtn(){
        let btns = cc.find('Canvas/button').children;
        for(let i = 0;i< btns.length;i++){
            btns[i].resumeSystemEvents(true);
        }
    },

    endVoiceTest(){

        let self = this;
        let play = cc.find('card/word_bg/play', self.node);
        let close = cc.find('card/close', self.node);
        close.active = true;
        play.resumeSystemEvents(true);
        if(!self.flag){
            self.flag = true;
            if(cc.sys.os === 'Windows'){
                self.result = window.WCRClassRoom.endRecord();
                //发送postMessage
                window.parent.postMessage({
                    action: 'endRecord'
                }, '*')
            }else if(cc.sys.os === 'iOS'){
                let endMsg = {
                    'operateType':'evaluateEnd',
                    'body':{}
                }
                if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.VIPXJSSDK){
                    window.webkit.messageHandlers.VIPXJSSDK.postMessage(endMsg);
                }
            }
        }
    },
    handleResult(result){
        if(result){
            window.Vipx.score = result.result.overall;
            window.Vipx.audioUrl = result.audioUrl;
            window.Vipx.word.getComponent('word').touchendEv();
            window.Vipx.word.getComponent('word').showStars(result.result.overall);
            window.Vipx.word.getComponent('word').audioUrl = result.audioUrl;
            window.Vipx.word.getComponent('word').bindCheck(result.audioUrl,result.tokenId);
        }else{
            score.getComponent(cc.Label).string = 'No data'
        }
       
    },
    showStars(score){
        let self = this;
        score = score || window.Vipx.score;
        score != null && cc.sys.localStorage.setItem(self.game + '_' + self.card + '_score',score);
        score != null && self.loadStars(score,true);
        
    },
    loadStars(score,isTest = false){
        let self = this;
        let num = 'zero';
        let starBone = 'Try_harder';
        cc.audioEngine.stopAll();
        let audio = null;
        let stars_node = cc.find('card/stars',self.node);
        let bone_node = cc.find('card/xingxing_ske',self.node);
        let bone = bone_node.getComponent('dragonBones.ArmatureDisplay');
        stars_node.opacity = 0;
        bone_node.opacity = 0;
        if(score != null){
            if(score <= 0){
                num = 'zero';
                starBone = 'Try_harder';
                audio = self.audio0;
     
            }
            if(0 < score && score < 60){
                num = 'three';
                starBone = 'Keep_trying';
                audio = self.audio3;
                
            }
            if(60 <= score && score < 80){
                num = 'four';
                starBone = 'Good_job';
                audio = self.audio4;
                
            }
            if(80 <= score){
                num = 'five';
                starBone = 'Super';
                audio = self.audio5;
            }
            
            stars_node.opacity = 255;


            if(isTest){ //如果是正在评测，展示动画,播放
                self.scheduleOnce(()=>{
                    cc.audioEngine.play(audio,false,1);
                },0.05);
                bone_node.opacity = 255;
                bone.playAnimation(starBone,1);
            }
            let stars =cc.find('star',stars_node).children;
            for(let i = 0;i < stars.length;i++){
                if(stars[i].name !== num){
                    stars[i].zIndex = 0;
                }else{
                    stars[i].zIndex = 5;
                }
            }

            //用来统计开口次数，大于三颗星都统计
            let openTime = cc.sys.localStorage.getItem('openTime') || 0;
            cc.sys.localStorage.setItem('openTime',(+openTime + 1));
            //统计完成率
            let finishTime = cc.sys.localStorage.getItem('finishTime') ||0;
            cc.sys.localStorage.setItem('finishTime',(+finishTime + 1));
            
        }

    },
    startTimer(){
        let self = this;
        //
        let timer = setInterval(()=>{
            if(self.circleFlag){
                self.circleAction();
            }else{
                clearInterval(timer);
            }
        },10);
        
    },
    timerCallback(){
        let self = this;
        
        if(self.time >= self.timeout){
            //self.unschedule(self.timerCallback);
            //self.touchendEv();
        }else{
            self.time = ((+self.time) + 0.1).toFixed(1);
        }
    },
    update(){
        let self = this;
        // if(self.circleFlag){
        //     self.circleAction();
        // }
    }
});
