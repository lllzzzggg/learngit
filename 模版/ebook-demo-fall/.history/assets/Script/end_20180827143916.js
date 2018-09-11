
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
        
        let open_node = cc.find('open',self.node);
        let answer_node = cc.find('answer',self.node);
        let time_node = cc.find('time',self.node);
        let rate_node = cc.find('rate',self.node);
        time_node.getComponent('cc.RichText').string = self.formatText('本次用时: ', self.formatTime(endTime - startTime));
        answer_node.getComponent('cc.RichText').string = self.formatText('完成答题: ', total + '次');
        open_node.getComponent('cc.RichText').string = self.formatText('开口次数: ', openTime + '次');
        rate_node.getComponent('cc.RichText').string = self.formatText('答题成功: ', ) + (Math.round((finishTime / total).toFixed(2) * 100) || 0) + '%'
        
        button.on('touchend',()=>{
            //退出
            cc.sys.localStorage.removeItem('current_page_' + cc.sys.localStorage.getItem('server'));
            cc.sys.localStorage.removeItem('openTime');
            cc.sys.localStorage.removeItem('startTime');
            cc.sys.localStorage.removeItem('answerTime');
            cc.sys.localStorage.removeItem('finishTime');
            cc.sys.localStorage.removeItem('total');
            self.gameClose();
        })
        self.gameSuccess();
        self.initBtn();
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
    initBtn(){
        let self = this;
        let btn = cc.find('left',self.node);
        let canvas = cc.find('Canvas');
        let page_js = canvas.getComponent('page');
        let review = cc.sys.localStorage.getItem('review');
        if(review == 'true'){
            btn.opacity = 0;
        }else{
            btn.off(cc.Node.EventType.TOUCH_END);
            btn.on(cc.Node.EventType.TOUCH_END,()=>{
                
                page_js.prev();
            })
        }
    },
    des(){

    }

    // update (dt) {},
});
