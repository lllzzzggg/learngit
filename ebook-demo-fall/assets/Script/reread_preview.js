window.Vipx = {
    word:null
};
cc.Class({
    extends: cc.Component,

    properties: {
        star34_Audio:{
            url:cc.AudioClip,
            default:null
        },
        star5_Audio:{
            url:cc.AudioClip,
            default:null
        },
        wrong_Audio:{
            url:cc.AudioClip,
            default:null
        },
        start_Audio:{
            url:cc.AudioClip,
            default:null
        }
    },

    start () {
    },
   
    initPage(data){
        let self = this;
        let str = '';
        
        self.server = cc.sys.localStorage.getItem('server');
        self.host = cc.sys.localStorage.getItem('HOST');
        self.server = self.host + self.server + '/';
        self.ifRev = cc.sys.localStorage.getItem('review');
        self.data = data;

        let pageName = cc.sys.localStorage.getItem('server') + '_' + data.game;
        cc.sys.localStorage.removeItem(pageName);

        let lastAnswer = cc.sys.localStorage.getItem(pageName);
        
        if(data){
            self.configData = data;
            str = self.configData["texts"][0].read_text;
            self.text = self.configData["texts"][0].read_text;
            self.readAudio = self.server + self.configData.game + self.configData.audio;
            self.audioTime = self.configData.audioTime;
            self.img = self.server + self.configData.game + self.configData.image;
            self.readTime = self.configData.readTime;
            if(self.configData["texts"][1]){
                self.example = self.configData["texts"][1].example_text
            }
            let img = cc.find('image',self.node);
            let back = cc.find('text/back_text',self.node);
            let record = cc.find('button/record',self.node)
            self.loadImg(img,self.img)
            if(str){
                back.getComponent(cc.Label).string = str;
            }
            
            if(lastAnswer){
                self.lastResult(data)
                self.clickPlayAudio()
                if(self.ifRev == 'true'){
                    record.active = false;
                }else{
                    self.mcphone()
                }
            }else{
                self.gameStart();
            }

            window.voiceCallback = {};
            window.voiceCallback.handleResult = self.handleResult;
            window.handleResult = self.handleResult;      
            window.Vipx.word = self.node;

        }
        
    },
    loadDynamicResources(data){ //提前加载页面时，需要加载出图片资源，
        let self = this;
        self.server = cc.sys.localStorage.getItem('server');
        self.host = cc.sys.localStorage.getItem('HOST');
        self.server = self.host + self.server + '/';
        if(data){
            self.configData = data;
            self.text = self.configData["texts"][0].read_text;
            self.readAudio = self.server + self.configData.game + self.configData.audio;
            self.audioTime = self.configData.audioTime;
            self.img = self.server + self.configData.game + self.configData.image;

            let img = cc.find('image',self.node);
            let back = cc.find('text/back_text',self.node);
            let str = self.configData["texts"][0].read_text;
            self.loadImg(img,self.img)
            if(str){
                back.getComponent(cc.Label).string = str;
            }   
        }
    },
    gameStart(){
        let self = this;
        let result = cc.find('text/result_text',self.node);
        let back = cc.find('text/back_text',self.node);
        let button = cc.find('button',self.node)
        let record = cc.find('button/record',self.node)

        back.opacity = 255;    
        button.active = true;
        record.active = true;
        result.getComponent(cc.RichText).string = '';
        self.readAudioId = null;
        cc.audioEngine.stopAll();
        self.schedule(()=>{          
            self.readAudioId = cc.audioEngine.play(self.readAudio,false,1);
            self.mcphone()
            self.hornPlay();
        },0.2,0,0)

        let answerTime = cc.sys.localStorage.getItem('answerTime') || 0;
        cc.sys.localStorage.setItem('answerTime',(+answerTime + 1));
    },
    mcphone(){
        let self = this
        let buttons = cc.find('button',self.node)
        let submit = cc.find('submit',self.node)
        let submitOff = cc.find('submit/reread_un',self.node)
        let record = cc.find('button/record',self.node)
        let recording = cc.find('recording',self.node)
        let recording_size = cc.find('recording/size',self.node)
        let horn = cc.find('button/radio/horn_ske',self.node);
        let dragonHorn = horn.getComponent("dragonBones.ArmatureDisplay") 
        let dragonRecording = recording.getComponent("dragonBones.ArmatureDisplay");

        record.on('touchend',()=>{
            buttons.active = false
            recording.active = true
            dragonHorn.playAnimation('static',1);
            dragonRecording.playAnimation('newAnimation',0)
            self.unscheduleAllCallbacks()
            self.startVoiceTest()
            self.minTimeout();
        })
        recording_size.on('touchend',()=>{
            if(self.ifRev == 'true'){
                submit.active = true;
            }
            recording.active = false;
            dragonRecording.playAnimation('None',0)
            self.unscheduleAllCallbacks()
            self.endVoiceTest()
            self.clickPlayAudio()
        })
        submitOff.on('touchend',()=>{
            buttons.active = false
            submit.active = false;
            recording.active = true;
            dragonRecording.playAnimation('newAnimation',0)
            self.unscheduleAllCallbacks()
            self.startVoiceTest()
            self.minTimeout();
        })

    },
    minTimeout(){
        let self = this;
        let submit = cc.find('submit',self.node)
        let recording = cc.find('recording',self.node)
        let horn = cc.find('button/radio/horn_ske',self.node);
        let dragonHorn = horn.getComponent("dragonBones.ArmatureDisplay") 
        let dragonRecording = recording.getComponent("dragonBones.ArmatureDisplay");

        self.schedule(()=>{
            if(self.ifRev == 'true'){
                submit.active = true;
            }
            recording.active = false;
            dragonRecording.playAnimation('None',0)
            self.unscheduleAllCallbacks()
            self.endVoiceTest()
            self.clickPlayAudio()
            cc.log('60 over')
        },60,0,0)
    },
    startVoiceTest(){
        let self = this;
        self.flag = false;
        self.voice = {};
        self.voice['userId'] = 'vipx';
        self.voice['coreType'] = 'en.sent.score';
        self.voice['refText'] = self.text;
        self.voice['provideType'] = 'cloud';
        self.voice['attachAudioUrl'] = '1';
        cc.audioEngine.stopAll();
        cc.audioEngine.play(self.start_Audio,false,1)
        self.pausePageBtn()
        if(cc.sys.os === 'Windows'){
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
                    'type':'read_sentence',
                    'content':self.text,
                    'timeout':60
                }
            }
           if(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.VIPXJSSDK){
                window.webkit.messageHandlers.VIPXJSSDK.postMessage(startMsg);
            }
        }
    },
    endVoiceTest(){
        let self = this;
        self.resumePageBtn();
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
        let self = this; 
        let timer = setInterval(()=>{
            
            if(result){
                clearInterval(timer);
                //测试时用解密base64
                result = window.base64.decode(result);
                result = eval('(' + result + ')')
                    console.log(result)
                    window.Vipx.word.getComponent('reread_preview').tokenId = result.tokenId;
                    window.Vipx.word.getComponent('reread_preview').audioUrl = result.audioUrl;
                    window.Vipx.word.getComponent('reread_preview').showResult(result.result,result.audioUrl,result.tokenId);
                    window.Vipx.word.getComponent('reread_preview').saveResult(result)   //保存结果
            }else{
                score.getComponent(cc.Label).string = 'No data'
            }
        },100)
       
    },
    saveResult(result){
        let self = this;
        let className = cc.sys.localStorage.getItem('server');
        let pageName = className  + '_' +  self.data.game

        let canvasF = cc.find('Canvas')
        let local = canvasF.getComponent('local')
        result.stringBack = self.text;
        
        local.saveResult(pageName,result,'reread')
       
    },
    lastResult(gameData){
        let self = this;
        let className = cc.sys.localStorage.getItem('server');
        let pageName = className  + '_' +  gameData.game

        let json = cc.sys.localStorage.getItem(pageName)
        let data  = JSON.parse(json)

        self.richText(data.details,data.str)
        self.bindCheck(data,data.audioUrl,data.tokenId);
    },
    showResult(result,audioUrl,tokenId){
        let self = this;
        let submit = cc.find('submit',self.node)
        let button = cc.find('button',self.node)
        let record = cc.find('button/record',self.node)
        let submitOn = cc.find('submit/reread_submit',self.node)
        let back = cc.find('text/back_text',self.node)
        let str = back.getComponent(cc.Label).string;
        if(self.ifRev == 'true'){
            button.active = true;
            record.active = false;
            self.bindCheck(result,audioUrl,tokenId);
            submitOn.on('touchend',()=>{
                submit.active = false;
                self.clickPlayAudio();
                self.showStars(result.overall);
                self.statistic(result.overall);
                self.richText(result.details,str)
                self.mostScore(result.overall)
            })
        }else{
            self.clickPlayAudio();
            self.showStars(result.overall);
            self.statistic(result.overall);
            self.bindCheck(result,audioUrl,tokenId);
            self.richText(result.details,str)
            self.mostScore(result.overall)
        }
        
    },
    mostScore(score){
        let self = this;
        let className = cc.sys.localStorage.getItem('server');
        let jsonScore = cc.sys.localStorage.getItem('ReadScore');
        let ReadScore =  JSON.parse(jsonScore)
        let scoreName = className  + '_' +  self.data.game + 'reread';
        let newScore = {
            name:scoreName,
            score:score
        }

        if(ReadScore.length !== 0){
            for(let i = 0;i < ReadScore.length; ++i){
                if(ReadScore[i].name === scoreName){
                    if(newScore.score > ReadScore[i].score){
                        ReadScore[i].score = newScore.score;
                    }
                }else{
                    ReadScore.push(newScore)
                }
            }
        }else{
            ReadScore.push(newScore)
        }
        
        let newJsonScore = JSON.stringify(ReadScore)
        cc.sys.localStorage.setItem('ReadScore',newJsonScore)
    },
    clickPlayAudio(){
        let self = this;
        let btn = cc.find('button/radio',self.node);
        btn.on('touchend',()=>{
            cc.audioEngine.stopAll();
            cc.audioEngine.play(self.readAudio,false,1);
            self.hornPlay()
        })
    },
    hornPlay(){
        let self = this;
        let horn = cc.find('button/radio/horn_ske',self.node);
        let dragonHorn = horn.getComponent("dragonBones.ArmatureDisplay")

        dragonHorn.playAnimation('loop',0);
        self.scheduleOnce(()=>{
            dragonHorn.playAnimation('static',1);
        },self.audioTime)
    },
    showStars(score){
        let self = this;
        let result = cc.find('result',self.node)
        let button = cc.find('button',self.node)
        let mask = cc.find('result/mask',self.node)
        let stars = cc.find('result/stars',self.node)
        let star_dragon = stars.getComponent("dragonBones.ArmatureDisplay")

        result.active = true;
        mask.on('touchend',()=>{
            result.active = false;
            button.active = true;
        })
        if(score >= 30 && score <= 69){
            cc.audioEngine.play(self.star34_Audio,false,1)
            star_dragon.playAnimation('VR_pass_once',1)
        }else if(score >= 70 && score <= 100){
            cc.audioEngine.play(self.star5_Audio,false,1)
            star_dragon.playAnimation('VR_super_once',1)
        }
    },
    statistic(score){
        let self = this;
        let stars = cc.find('result/stars',self.node)
        let star_dragon = stars.getComponent("dragonBones.ArmatureDisplay")
        let total = cc.sys.localStorage.getItem('total') || 0;
        cc.sys.localStorage.setItem('total', (+total + 1));
        
        if(score <= 30){
            star_dragon.playAnimation('VR_fail_once',1)
            cc.audioEngine.play(self.wrong_Audio,false,1)
        }else{
            //用来统计开口次数，大于三颗星都统计
            let openTime = cc.sys.localStorage.getItem('openTime') || 0;
            cc.sys.localStorage.setItem('openTime',(+openTime + 1));
            //统计完成率
            let readTime = cc.sys.localStorage.getItem('readTime') || 0;
            cc.sys.localStorage.setItem('readTime', (+readTime + 1));
        }
    },
    richText(arr,str){
        let self = this;
        let result_text = cc.find('text/result_text',self.node)
        let back = cc.find('text/back_text',self.node)
        let strArr  = str.split(' ');
        let newStr = '';

        if(arr){
            back.opacity = 0
            for(let i = 0;i < strArr.length;++i){
                let score = arr[i].score
                let _str = '';
                let word = strArr[i];
                if(score <= 40){
                    _str = "<outline color=#ff4d97 width=5>"+ word+"</outline>"
                }else if(score >= 61){
                    _str = "<outline color=#2ad4f3 width=5>"+ word+"</outline>"
                }else{
                    _str = word;
                }
                newStr += _str + ' ';

            }
            result_text.getComponent(cc.RichText).string = newStr;
        }
    },
    bindCheck(result,audioUrl,tokenId){
        let self = this;
        let myRecord = cc.find('button/myRecord',self.node);
        let audio = cc.find('button/myRecord/record_play',self.node);
        let audio_children = audio.children;
        let anim = cc.find('button/myRecord/record',self.node);
        let record_dragon = anim.getComponent("dragonBones.ArmatureDisplay") 
        let stop = cc.find('button/myRecord/record_stop',self.node);
        let recording_time = result.wavetime/1000;
        let score = result.score;
        console.log(score)

        if(score < 30){
            audio_children[0].active = true;
            audio_children[1].active = false;
            audio_children[2].active = false;
        }else if(score >= 30 && score < 70){
            audio_children[0].active = false;
            audio_children[1].active = false;
            audio_children[2].active = true;
        }else if(score >= 70 && score <= 100){
            audio_children[0].active = false;
            audio_children[1].active = true;
            audio_children[2].active = false;
        }

        if(audioUrl || tokenId){
            audio.off('touchend');
            audio.on('touchend',()=>{
                anim.active = true;
                stop.active = true;
                audio.active = false;
                cc.audioEngine.stopAll();
                self.myRecordShow(score)
                if (cc.sys.os == 'Windows') {
                    cc.audioEngine.play('http://' + audioUrl + '.mp3',false,1);
                }else{
                    self.playAudio(tokenId);
                }
                self.scheduleOnce(()=>{
                    anim.active = false;
                    stop.active = false;
                    audio.active = true;
                    record_dragon.playAnimation('None',1)
                },recording_time)
                
            })
            stop.on('touchend',()=>{
                anim.active = false;
                audio.active = true
                stop.active = false
                record_dragon.playAnimation('None',1)
                cc.audioEngine.stopAll();
            })

        }else{
            myRecord.active = false;
        }
       
    },
    myRecordShow(score){
        let self = this;
        let anim = cc.find('button/myRecord/record',self.node);
        let record_dragon = anim.getComponent("dragonBones.ArmatureDisplay") 

        if(score < 30){
            record_dragon.playAnimation('record1',0)
        }else if(30 <= score && score < 70){
            record_dragon.playAnimation('record3',0)
        }else if(70 <= score && score <= 100){
            cc.log(score)
            record_dragon.playAnimation('record2',0)
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
    pausePageBtn(){
        let btns = cc.find('Canvas/button').children;
        let nextBtn = cc.find('Canvas/button/next');
        nextBtn.active = false;
        for(let i = 0;i< btns.length;i++){
            btns[i].pauseSystemEvents(true);
        }
    },
    resumePageBtn(){
        let btns = cc.find('Canvas/button').children;
        let nextBtn = cc.find('Canvas/button/next');
        nextBtn.active = true;
        for(let i = 0;i< btns.length;i++){
            btns[i].resumeSystemEvents(true);
        }
    },
    des(){
        let self = this;
        self.unscheduleAllCallbacks();
    },
    loadImg(node,url){
        cc.loader.load(url,function(err,img){
            if(err) return;
            node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(img);
        })
    },
    onDestroy(){
        let self = this;
        
    }


    // update (dt) {},
});
