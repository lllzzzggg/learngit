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
    initPage(data){
        let self = this;
        if(data){
            self.text = data[0];
            self.data = data[1];
            self.loadText(self.text);
        }
    },
    loadText(text){
        let self = this;
        if(text){
            cc.find('text',self.node).getComponent(cc.RichText).string = text;
            cc.find('selection',self.node).getComponent(cc.Label).string = self.data;
        }

    },
    bindSelect(){
        let self = this;
        let select = self.node
        let chosed = cc.find('chosed',self.node);  
        let read = select.parent.parent.getChildByName('read')
        let choice_sentence_many = select.parent.parent.getComponent('choice_sentence_many')
        let horn = select.parent.parent.getChildByName("horn_ske")
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
                choice_sentence_many.unscheduleAllCallbacks();
                cc.audioEngine.stopAll(); 
                dragonHorn.playAnimation('static',1);
                for(let i = 0;i<children.length;i++){
                    children[i].getChildByName("judge").getChildByName("wrong").opacity = 0;
                    children[i].getChildByName("judge").getChildByName("right").opacity = 0;
                }
                if(chosed.opacity == 0){
                    chosed.opacity = 255;
                    choice_sentence_many.pushSelect(select,self.data);
                    select.zIndex = 99;
                }else{
                    select.zIndex = 9;
                    chosed.opacity = 0;
                    choice_sentence_many.deleteSelect(select,self.data);
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
