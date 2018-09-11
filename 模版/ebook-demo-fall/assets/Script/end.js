
cc.Class({
    extends: cc.Component,

    properties: {
        endAudio:{
            url:cc.AudioClip,
            default:''
        }
    },

    start () {
    },
    initPage(data){
        let self = this;
        cc.audioEngine.stopAll();
        self.scheduleOnce(()=>{
            cc.audioEngine.play(self.endAudio,false,1);
        },0.3);
        let button = cc.find('out',self.node);
        let openTime = cc.sys.localStorage.getItem('openTime') || 0;
        let startTime = cc.sys.localStorage.getItem('startTime');
        let endTime = new Date().getTime();

        let answerTime = cc.sys.localStorage.getItem('answerTime');
        let finishTime = cc.sys.localStorage.getItem('finishTime');
        let total = cc.sys.localStorage.getItem('total');

        let wrongTime = cc.sys.localStorage.getItem('wrongTime');   //答错次数
        let readTime = cc.sys.localStorage.getItem('readTime');     //语音成功次数
        
        let read_node = cc.find('read',self.node);
        let wrong_node = cc.find('wrong',self.node);
        let right_node = cc.find('right',self.node);
        let time_node = cc.find('time',self.node);
        right_node.getComponent('cc.RichText').string = self.formatText('答对次数 : ', finishTime + ' 次');
        wrong_node.getComponent('cc.RichText').string = self.formatText('答错次数 : ', wrongTime + ' 次');
        read_node.getComponent('cc.RichText').string = self.formatText('语音成功 : ', readTime + ' 次');
        time_node.getComponent('cc.RichText').string = self.formatText('消耗时长 : ', self.formatTime(endTime - startTime));
        
        button.on('touchend',()=>{
            //退出
            cc.sys.localStorage.clear()
            self.gameClose();
        })
        self.gameSuccess();
        self.totalShow();
    },
    totalShow(){
        let self = this;
        let anim_node = cc.find('Complete', self.node)
        let anim = anim_node.getComponent('dragonBones.ArmatureDisplay');
        let totalScore = cc.sys.localStorage.getItem('totalScore');     //总分，除跟读题外
        let jsonArr = cc.sys.localStorage.getItem('ReadScore');       //跟读题分数的数组
        let quesNum = cc.sys.localStorage.getItem('scoreNums')  
        let ReadArr = JSON.parse(jsonArr)
        let readScore = 0;

        if(ReadArr.length > 0){
            for(let i = 0;i < ReadArr.length;++i){
                readScore += ReadArr[i].score
            }
        }
        totalScore = readScore + (+totalScore);
        totalScore = totalScore/(+quesNum);
        cc.log(totalScore)
        if(totalScore >= 0 && totalScore < 20){
            anim.playAnimation('Complete01-once',1)
        }else if(totalScore >= 20 && totalScore < 40){
            anim.playAnimation('Complete02-once',1)
        }else if(totalScore >= 40 && totalScore < 60){
            anim.playAnimation('Complete03-once',1)
        }else if(totalScore >= 60 && totalScore < 80){
            anim.playAnimation('Complete04-once',1)
        }else if(totalScore >= 80 && totalScore < 100){
            anim.playAnimation('Complete05-once',1)
        }
    },
    formatText(title,content){
        return `<color=#FFFFFF>${title}</c><color=#FFD408>${content}</color>`
    },
    formatTime(time){
        time = time/1000;
        let hour = Math.floor(time/3600);
        let min = Math.floor(time%3600/60);
        let second = Math.floor(time%3600%60) + 1;
        
        return ((hour>9?hour:('0'+hour)) + ':' + (min>9?min:('0'+min)) + ':' + (second>9?second:('0'+second)));
    },
    gameClose:function(){
        if(/macintosh|mac os x/i.test(navigator.userAgent)){
            this.loadURL('backtoscene://back?over=1&error=0');  
            return false;
        }else if(/windows|win32/i.test(navigator.userAgent)){
            window.top.postMessage({
                action: 'closeGame',
                type: 'game',
            }, "*");
        }
    },
    gameSuccess:function(){
        if(/macintosh|mac os x/i.test(navigator.userAgent)){
            this.loadURL('havedoneprepare://prepare?done=1')
            return false;
        }else if(/windows|win32/i.test(navigator.userAgent)){
            window.top.postMessage({
                action: 'submitGame',
                type: 'game',
            }, "*");
        }
    },
    loadURL: function(url) {
        var iFrame;
        iFrame = document.createElement("iframe");
        iFrame.setAttribute("src", url);
        iFrame.setAttribute("style", "display:none;");
        iFrame.setAttribute("height", "0px");
        iFrame.setAttribute("width", "0px");
        iFrame.setAttribute("frameborder", "0");
        document.body.appendChild(iFrame);
    },
    des(){

    }

    // update (dt) {},
});
