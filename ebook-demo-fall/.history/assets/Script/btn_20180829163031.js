cc.Class({
    extends: cc.Component,

    properties: {
     },
    start () {
        //let config = require('./config.js')
        //this.right = config.game_3.right;
        //this.initButton();
        this.timer = null;
    },
    initButton(review){
        let self = this;
        review = false
        self.node.on(cc.Node.EventType.MOUSE_ENTER, function(event){
            cc._canvas.style.cursor = 'pointer';
        });
        self.node.on(cc.Node.EventType.MOUSE_LEAVE, function(event){
            cc._canvas.style.cursor = 'default';
        });

        self.bindBtn(review);

    },
    bindBtn(review){
        let self = this;
        review = false
        if(review){
            if(self.node.name == 'prev'){
                self.node.active = false;
            }

            self.timer = setInterval(()=>{
                self.watchBtn();
            },100);
        }
        self.flag = true;
        self.node.on(cc.Node.EventType.TOUCH_END,()=>{
            if(self.flag){
                self.clickEvent(review);
                self.flag = false;
            }
        })
    },
    watchBtn(){
        let self = this;
        let nextPage = cc.sys.localStorage.getItem('nextPage');
        if(nextPage == 'true'){
            clearInterval(self.timer);
            if(self.node.name == 'next'){
                self.node.active = true;
            }
        }
    },
    clickEvent(review){
        let self = this;
        review = false
        let page = cc.find('Canvas').getComponent('page');
        let nextpage = cc.sys.localStorage.getItem('nextPage')

        self.scheduleOnce(()=>{
            self.flag = true;
        },1);

        if(self.node.name === 'prev'){
            if(!review){
                page.prev();
            }
        }else{
            if(review){
                if(nextpage == 'true'){
                    page.next();
                    if(self.node.name == 'next'){
                       self.node.active = false;
                    }
                    cc.sys.localStorage.setItem('nextPage', false);
                    self.timer = setInterval(()=>{
                        self.watchBtn();
                    },100);
                }
            }else{
                page.next();
            }
        }
        
    }    
});
