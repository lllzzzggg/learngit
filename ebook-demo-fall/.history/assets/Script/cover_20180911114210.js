cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    start () {

    },
    initPage(data){
        let self = this;
        if(data){
            self.configData = data;
            self.host = cc.sys.localStorage.getItem('HOST');
            self.server = cc.sys.localStorage.getItem('server')
            self.loadTitle();
            self.initBtn();
        }
    },
    loadTitle(){
        let self = this;
        let title = cc.find('title',self.node)
        let text_node = cc.find('text',title);
        let author_node = cc.find('author',title);
        self.readAudio = `${self.host}${self.server}/${self.configData.game}/audio/cover.mp3`;
        
        if(self.configData){
            let text = self.configData.title.text;
            let author = self.configData.title.author;
            if(text){
                text_node.getComponent(cc.Label).string = text;
            }
            if(author){
                author_node.getComponent(cc.Label).string = 'by ' +author;
            }
        }
        //self.readAudio()
        title.on(cc.Node.EventType.TOUCH_END,()=>{
            cc.audioEngine.stopAll();
            cc.audioEngine.play(self.readAudio,false,1);
        })
    },
    readAudioFunc(){
        let self = this;
        cc.audioEngine.stopAll();
        self.scheduleOnce(() => {
            cc.audioEngine.play(self.readAudio, false, 1);
        }, 0.6)
    },
    initBtn(){
        let self = this;
        let btn = cc.find('play',self.node);
        let canvas = cc.find('Canvas');
        let page_js = canvas.getComponent('page')
        let scaleAction = cc.repeatForever(cc.sequence(cc.scaleTo(1,1.2),cc.scaleTo(1,0.9)));
        btn.runAction(scaleAction);
        btn.off(cc.Node.EventType.TOUCH_END);
        btn.on(cc.Node.EventType.TOUCH_END,()=>{
            let startTime = new Date().getTime();
            cc.sys.localStorage.setItem('startTime',startTime);
            page_js.next();
            btn.pauseSystemEvents(true)
            console.log('pause system')
            self.scheduleOnce(()=>{
                btn.resumeSystemEvents(true)
            },1)
        })
       
    },
    des(){
        
    },
    out(){
    }
});
