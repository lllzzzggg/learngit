cc.Class({
    extends: cc.Component,

    properties: {
   
    },

    start () {
    },
   
    initPage(data){
        let self = this;
        self.server = cc.sys.localStorage.getItem('server');
        self.host = cc.sys.localStorage.getItem('HOST');
        self.server = self.host + self.server + '/';
        
        if(data){
            self.configData = data;
            self.word = self.configData.word
            self.example = self.configData.example;
            self.readAudio = self.server + self.configData.game + self.configData.audio;
            self.audioTime = self.configData.audioTime;
            self.img = self.server + self.configData.game + self.configData.image;

            let img = cc.find('image',self.node)
            let word = cc.find('text/word',self.node)
            let text = cc.find('text',self.node)

            self.loadImg(img,self.img)
            word.getComponent(cc.Label).string = self.word  

            if(self.example){
                text.opacity = 255
                self.richText()
            }else{
                text.opacity = 0
            }

            self.scheduleOnce(()=>{
                self.wordPlay()
            },self.audioTime)
            self.scheduleOnce(()=>{
                cc.audioEngine.play(self.readAudio,false,1);
                self.hornPlay()
            },0.2)
        }
        
    },
    loadDynamicResources(data){ //提前加载页面时，需要加载出图片资源，
        let self = this;
        self.server = cc.sys.localStorage.getItem('server');
        self.host = cc.sys.localStorage.getItem('HOST');
        self.server = self.host + self.server + '/';
        if(data){
            self.configData = data;
            self.word = self.configData.word
            self.example = self.configData.example;
            self.readAudio = self.server + self.configData.game + self.configData.audio;
            self.audioTime = self.configData.audioTime;
            self.img = self.server + self.configData.game + self.configData.image;

            let img = cc.find('image',self.node)
            self.loadImg(img,self.img)
        }
    },
    hornPlay(){
        let self = this;
        let horn = cc.find('button/horn_ske',self.node);
        let dragonHorn = horn.getComponent("dragonBones.ArmatureDisplay")

        dragonHorn.playAnimation('loop',0);
        self.scheduleOnce(()=>{
            dragonHorn.playAnimation('static',1);
        },self.audioTime)
    },
    wordPlay(){
        let self = this
        let btn = cc.find('button',self.node)

        btn.on('touchend',()=>{
            cc.audioEngine.stopAll();
            cc.audioEngine.play(self.readAudio,false,1);
            self.hornPlay()
        })
    },
    richText(){
        let self = this
        let eg = cc.find('text/eg',self.node)

        let str = self.example
        let word = self.word
        let strOnly = self.example.replace(/[.?!]/," ")
        let strArr = strOnly.split(' ')
        let wordIndex = strArr.indexOf(word) 
        let wordIndexUp = str.toLowerCase().indexOf(word) 
        let reg_word = new RegExp(word,"ig")
        cc.log(str)

        if(wordIndexUp == 0){
            let wordUpper = strArr[0].substr(0,1).toUpperCase() + strArr[0].substring(1);
            str = str.replace(strArr[0],"<outline color=#2ad4f3 width=5>"+ wordUpper +"</outline>")
        }
        if(wordIndex > 0){  
            str = str.replace(reg_word,"<outline color=#2ad4f3 width=5>"+ word +"</outline>")
        }
        

        eg.getComponent(cc.RichText).string = 'EX:' + str
    },
    des(){
        let self = this;
        self.unscheduleAllCallbacks();
        let game = self.configData.game;
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
