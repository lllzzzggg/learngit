var git = "My first change";
var comm = require("comm");
cc.Class({
    extends: cc.Component,

    properties: {
        getDrag:cc.Node, //拖拽拼图
        area:cc.Node, //拼图放置区域
        star:cc.Node, //星星
        RightAudio: {
            url: cc.AudioClip,
            default: null
        },  //正确音乐
        WrongAudio: {
            url: cc.AudioClip,
            default: null
        },  //错误音乐
    },
    onLoad: function () {
            var drag = this.getDrag;
            this.triggleDrag(drag);
    },
    triggleDrag: function(drag){ 
        var startX = drag.x;         //设置起始坐标
        var startY = drag.y;
        var startIndex = drag.zIndex;
        drag.on(cc.Node.EventType.MOUSE_ENTER, function(event){
            cc._canvas.style.cursor = 'pointer';
        });
        drag.on(cc.Node.EventType.MOUSE_LEAVE, function(event){
            cc._canvas.style.cursor = 'default';
        });
            
            drag.on('touchstart',(ev)=>{
                drag.zIndex = 999;
            });
            drag.on('touchmove',(ev)=>{
                var move = ev.touch.getDelta();
                drag.x += move.x;
                drag.y += move.y;  //拖拽跟随鼠标移动相同位移
            });
            var targetArea = this.calcArea();   //判断区域
            drag.on('touchend',(ev)=>{
                var starAnim = cc.sequence(cc.fadeIn(0.3),cc.scaleTo(0.3,1.7), cc.scaleTo(0.3,1.38));
                drag.zIndex = startIndex;
                var judge = this.judgeDrag(drag.x, drag.y, targetArea);   //判断拖拽是否到达制定区域
                if(judge){
                    comm.times++;
                    this.star.runAction(starAnim);
                    cc.audioEngine.play(this.RightAudio, false, 1);
                    drag.x = this.area.x;
                    drag.y = this.area.y;                   //正确放置于拖拽区域
                    this.finished(drag);                      //正确后不可再次移动
                    this.change();
                }else{
                    cc.audioEngine.play(this.WrongAudio, false, 1);
                    drag.x = startX;
                    drag.y = startY;                          //错误放回原处
                }
            });
            drag.on('touchcancel',(ev)=>{
                cc.audioEngine.play(this.WrongAudio, false, 1);
                drag.x = startX;
                drag.y = startY;
            });
    },
    calcArea: function(){
        var targetNode = this.area;
        if(!targetNode) return null;
        
        var x = targetNode.x;
        var y = targetNode.y;
        var width = targetNode.width;
        var height = targetNode.height;
        
        var ss = [];
        ss.push(x + parseInt(width / 2));
        ss.push(x - parseInt(width / 2));
        ss.push(y + parseInt(height / 2));
        ss.push(y - parseInt(height / 2));
        
        return ss;                          //返回放置区域范围坐标的数组
    },
    judgeDrag: function(x, y, area){
        return area ? (x < area[0] && x > area[1] && y < area[2] && y > area[3]) : false;   //判断拖拽物品知否在放置区域内
    },
    finished:function(evt){
        evt.targetOff('touchstart');
        evt.targetOff('touchmove');
        evt.targetOff('touchend');
        evt.targetOff('touchcancel');  //移除所有拖拽事件
    },
    change:function(){
        console.log(comm.times);
        if(comm.times == 3){
            this.ifIos();
        }
    },
    ifIos:function(){
        if(/macintosh|mac os x/i.test(navigator.userAgent)){
            console.log("IOS");
            this.loadURL('backtoscene://back?over=1&error=0');
        }else if(/windows|win32/i.test(navigator.userAgent)){
            console.log("windows");
        }
    },
    loadURL: function(url) {
        console.log("come here code");
        var iFrame;
        iFrame = document.createElement("iframe");
        iFrame.setAttribute("src", url);
        iFrame.setAttribute("style", "display:none;");
        iFrame.setAttribute("height", "0px");
        iFrame.setAttribute("width", "0px");
        iFrame.setAttribute("frameborder", "0");
        document.body.appendChild(iFrame);
    }


});
