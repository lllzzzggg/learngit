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

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    initPage(data,url){
        let self = this;
        if(data){
            self.data = data;
            self.img = url + '/img/' + data + '.jpg';
            self.loadImg(self.img);
            self.loadText(data);

        }
    },
    loadImg(img){
        let self = this;
        if(img){
            cc.loader.load(img,(err,img)=>{
                if(err) return;
                cc.find('img',self.node).getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(img);
            })
        }
    },
    loadText(text){
        let self = this;
        if(text){
            cc.find('word/text',self.node).getComponent(cc.Label).string = text;
        }

    },
    bindSelect(){
        let self = this;
        let select = self.node
        let chosed = cc.find('chosed',self.node);  
        let choice_listen_many = select.parent.parent.getComponent('choice_listen_many')
        let horn = select.parent.parent.getChildByName("horn_ske")
        let read = select.parent.parent.getChildByName("read")
        let children = select.parent.children;
        let dragonHorn = horn.getComponent("dragonBones.ArmatureDisplay")
        chosed.opacity = 0;

        if(select){
            self.pointerNode(select);
            select.on('touchstart',()=>{
               select.runAction(cc.scaleTo(0.5, 0.9))
            })
            select.on('touchcancel',()=>{
                select.runAction(cc.scaleTo(0.5, 1)) 
            })
            select.on('touchend',()=>{
                read.resumeSystemEvents();
                choice_listen_many.unscheduleAllCallbacks();
                cc.audioEngine.stopAll(); 
                dragonHorn.playAnimation('static',1);
                for(let i = 0;i<children.length;i++){
                    children[i].getChildByName("judge").getChildByName("wrong").opacity = 0;
                    children[i].getChildByName("judge").getChildByName("right").opacity = 0;
                }
                if(chosed.opacity == 0){
                    chosed.opacity = 255;
                    choice_listen_many.pushSelect(select);
                    select.zIndex = 99;
                }else{
                    select.zIndex = 9;
                    chosed.opacity = 0;
                    choice_listen_many.deleteSelect(select);
                }  
                select.runAction(cc.scaleTo(0.5, 1)) 

            })
        }
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
