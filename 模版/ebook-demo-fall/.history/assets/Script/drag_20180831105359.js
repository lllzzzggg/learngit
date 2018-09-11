cc.Class({
    extends: cc.Component,

    properties: {
        groove: {
            type: cc.Prefab,
            default: null
        },
        picture: {
            type: cc.Prefab,
            default: null
        },

        draginAudio: {
            url: cc.AudioClip,
            default: null
        },
        dragRightAudio: {
            url: cc.AudioClip,
            default: null
        },
        dragWrongAudio: {
            url: cc.AudioClip,
            default: null
        },
        rightAudio: {
            url: cc.AudioClip,
            default: null
        },
        wrongAudio: {
            url: cc.AudioClip,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        let self = this;
        //this.init();

    },
    initPage(data) {
        let self = this;
        if (data) {
            self.configData = data;

            self.dragTime = 0
            self.score = 100
            self.dragSuccessTime = 0;
            self.mode = self.configData.mode ? self.configData.mode : 'regular';
            self.server = cc.sys.localStorage.getItem('server') || 'server'
            self.review = cc.sys.localStorage.getItem('review') || 'false'
            self.successTime = 0;
            self.blankGrooves = [];
            self.local = cc.sys.localStorage.getItem(`${self.server}_${self.configData.game}_drag`) || 'false'
            self.initGrooves();
            self.initPictures();
            self.initRead();

        }
    },
    loadDynamicResources(data) { //提前加载页面时，需要加载出图片资源，
        let self = this;
        if (data) {
            self.configData = data;
            //mode:拖拽模式 value:regular-普通拖拽 order-顺序拖拽
            self.mode = self.configData.mode ? self.configData.mode : 'regular';
            self.blankGrooves = [];
            self.initGrooves();
            self.initPictures();
        }
    },
    bindTitle() {
        let self = this;
        //初始化音频和文字
    },
    initRead() {
        let self = this;
        cc.audioEngine.stopAll();
        let text_node = cc.find('btns/text', self.node);
        let btn = cc.find('btns/play', self.node);
        let dragon_node = cc.find('btns/horn_ske', self.node);
        let dragon = dragon_node.getComponent('dragonBones.ArmatureDisplay');
        let readAudio = self.configData.audio.readAudio;


        let duration = self.configData.audio.time;
        let server = cc.sys.localStorage.getItem('server');
        self.host = cc.sys.localStorage.getItem('HOST');
        let text = self.configData.read_text;
        if (text) {
            text_node.getComponent('cc.RichText').string = text;
            if(text_node.height <= 72){
                text_node.y = 36
            }else if(text_node.height > 72 && text_node.height <= 144){
                text_node.y = 72
            }else{
                text_node.y = 108
            }
        }
        if (readAudio) {
            let time = 0;
            readAudio = `${self.host}${server}/${self.configData.game}/audio/${readAudio}`
            btn.on(cc.Node.EventType.TOUCH_END, () => {
                cc.audioEngine.stopAll();
                self.unscheduleAllCallbacks();
                dragon.playAnimation('loop', -1);
                let audioId = cc.audioEngine.play(readAudio, false, 1);
                time = (audioId ? cc.audioEngine.getDuration(audioId) : 0) || duration;
                self.stopDragon(time);
            })
            self.scheduleOnce(() => {
                dragon.playAnimation('loop', -1);
                let audioId = cc.audioEngine.play(readAudio, false, 1);
                time = (audioId ? cc.audioEngine.getDuration(audioId) : 0) || duration;
                self.stopDragon(time);
            }, 0.1);
        }
    },
    stopDragon(time) {
        let self = this;
        let dragon_node = cc.find('btns/horn_ske', self.node);
        let dragon = dragon_node.getComponent('dragonBones.ArmatureDisplay');
        if (time) {
            self.scheduleOnce(() => {
                dragon.playAnimation('static', -1);
            }, time);
        }
    },
    initGrooves() {
        let self = this;
        let grooves = self.configData.drags.grooves;
        self.dragGrooves = grooves;
        let box = cc.find('grooves', self.node);
        box.removeAllChildren();
        for (let i = 0; i < grooves.length; i++) {
            let item = grooves[i];

            let groove = cc.instantiate(self.groove);
            groove.name = 'groove' + i;
            if (item !== '') {
                //需实现服务器加载
                self.loadImg(item, groove);
            } else {
                self.dragSuccessTime++;
                self.blankGrooves.push(i);
                let img = cc.find('box', groove);
                img.removeFromParent();
            }
            box.addChild(groove);
        }
        self.fixGrooves();
    },
    initPictures() {
        let self = this;
        let pictures = self.configData.drags.pictures;
        let left = cc.find('scrolls/left_arrow', self.node);
        let right = cc.find('scrolls/right_arrow', self.node);
        let content = cc.find('scrolls/scroll', self.node);
        content.removeAllChildren();
        if (pictures) {
            //图片数目大于6个就需要分两页来显示
            if(pictures.length > 6){
                let pictures1 = pictures.slice(0,6)
                let pictures2 = pictures.slice(6)
                self.addPictures(content, pictures1, 'part1', 0)
                self.addPictures(content, pictures2, 'part2', content.width - 200, true)
                left.active = false;
                right.active = true;
            }else{
                self.addPictures(content, pictures,'part1', 0)
                left.active = false;
                right.active = false;
            }
            self.triggerPage();
            
        }
    },
    addPictures(content, pictures, part, prevWidth, hidden){
        let self = this
        for (let i = 0; i < pictures.length; i++) {
            let item = pictures[i];
            let picture = cc.instantiate(self.picture);
            picture.name = 'picture' + i;
            picture.part = part;
            picture.word = item.img;
            picture.target = item.target;
            picture.y = 0;
            let width = content.width - 200;
            picture.x = Math.round((width / 6 * i) - width / 2 + (width / 12)) + prevWidth;

            if (item.img) {
                //需实现服务器加载
                self.loadImg(item.img, picture);
            }
            //数据保留
            if(self.local === 'true' && item.target !== ''){
                let grooves = cc.find('grooves', self.node);
                let groove = cc.find('grooves/groove' + item.target, self.node);
                picture.scaleX = 1
                picture.scaleY = 1
                picture.x = groove.x
                picture.y = groove.y
                grooves.addChild(picture)
                //如果是作业且全部拖拽正确
                let revDrag = cc.sys.localStorage.getItem(`${self.server}_${self.configData.game}_rev_drag`)
                if (revDrag === 'true') {
                    let right = cc.find('right', picture);
                    right.opacity = 255
                }
                
            }else{
                self.triggerDrag(picture, item.target);
                hidden && (picture.active = false);
                content.addChild(picture);
            }
        }
        console.log(content.children)
    },
    triggerPage(){
        let self = this;
        let left = cc.find('scrolls/left_arrow', self.node);
        let right = cc.find('scrolls/right_arrow', self.node);
        let content = cc.find('scrolls/scroll', self.node);
        left.on(cc.Node.EventType.TOUCH_END, (event) => {
            content.x = 0;
            right.active = true;
            left.active = false;
            self.hiddenPictures('part1')
        })
        right.on(cc.Node.EventType.TOUCH_END, (event) => {
            content.x = - content.width + 200;
            right.active = false;
            left.active = true;
            self.hiddenPictures('part2')
        })
    },
    hiddenPictures(part){
        let self = this;
        let content = cc.find('scrolls/scroll', self.node)
        for( let i = 0;i< content.children.length;i++){
            let picture = content.children[i]
            if(picture.part === part){
                picture.active = true
            }else{
                picture.active = false
            }
        }
    },
    fixGrooves() {
        let self = this;
        let grooves = cc.find('grooves', self.node);
        let children = grooves.children;
        let arrow = cc.find('arrow', children[0]);
        if (arrow) arrow.opacity = 0;
        if (!children) return;

        let len = children.length;
        if (len > 0) {
            if (len <= 4) {
                self.initLine(0, children);
            } else if (len === 5) {
                let line1 = children.slice(0, 3);
                let line2 = children.slice(3);
                self.initLine(190, line1);
                self.initLine(-190, line2);
            } else if (len === 6) {
                let line1 = children.slice(0, 4);
                let line2 = children.slice(4);
                self.initLine(190, line1);
                self.initLine(-190, line2);
            }
        }
    },
    initLine(y, arr) {
        let len = arr.length;
        if (len === 2) {
            for (let i = 0; i < len; i++) {
                let groove = arr[i];
                groove.x = -200 + i * 400;
                groove.y = y;
            }
        } else if (len === 3) {
            for (let i = 0; i < len; i++) {
                let groove = arr[i];
                groove.x = -400 + i * 400;
                groove.y = y;
            }
        } else {
            for (let i = 0; i < len; i++) {
                let groove = arr[i];
                groove.x = -600 + i * 400;
                groove.y = y;

            }
        }

    },
    triggerDrag(node, target) {
        let self = this;
        node.startX = node.x;
        node.startY = node.y;

        node.on(cc.Node.EventType.TOUCH_START, function (event) {
            self.initPos = node.getPosition();
            let grooves = cc.find('grooves', self.node);
            node.zIndex = 1000;
            var touches = event.getTouches();

            if (touches.length >= 2) return;
            let scaleAction = cc.scaleTo(0.05, 1);
            node.runAction(scaleAction);
            if (node.parent.name === 'scroll') {

                var sp2 = grooves.convertToWorldSpace(cc.p(0, 0));
                var sp = node.convertToWorldSpace(cc.p(0, 0));
                node.removeFromParent(false);
                node.x = sp.x - sp2.x + node.width / 2 - grooves.width / 2;
                node.y = sp.y - sp2.y + node.height / 2 - grooves.height / 2;

                grooves.addChild(node);
            }
        });

        node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {

            var touches = event.getTouches();
            if (touches.length >= 2) return;
            let delta = event.touch.getDelta();

            let moveX = cc.sys.os == 'Windows' ? delta.x / 1 : delta.x;
            let moveY = cc.sys.os == 'Windows' ? delta.y / 1 : delta.y;

            let result = self.judgeSquare(node.x + moveX, node.y + moveY);

            if (result) {
                node.x += moveX;
                node.y += moveY;
            } else {
                //返回到原来的content中
                self.calcPoint()
                node.removeFromParent(false);

                let content = cc.find('scrolls/scroll', self.node);
                if (content) {
                    node.x = node.startX;
                    node.y = node.startY;
                    node.runAction(cc.scaleTo(0.1, 0.8));
                    content.addChild(node);

                }
            }

        });

        node.on(cc.Node.EventType.TOUCH_END, function (event) {
            cc.audioEngine.stopAll();
            //统计total
            let total = cc.sys.localStorage.getItem('total') || 0;
            cc.sys.localStorage.setItem('total', (+total + 1));

            if (self.mode === 'regular') {
                let targetArea = self.calcArea(target);

                let judge = self.judgeDrag(node.x, node.y, targetArea);
                let curr = new Date().getTime();

                if (judge) {
                    //统计成功率
                    let finishTime = cc.sys.localStorage.getItem('finishTime') || 0;
                    cc.sys.localStorage.setItem('finishTime', (+finishTime + 1));

                    self.dragGrooves[target] = node.word;
                    self.successTime++;
                    let grooves = cc.find('grooves', self.node);
                    let groove = cc.find('grooves/groove' + target, self.node);
                    var x = groove.x;
                    var y = groove.y;
                    node.runAction(cc.spawn(cc.moveTo(0.2, cc.p(x, y)), cc.scaleTo(0.2, 1)));
                    cc.audioEngine.play(self.rightAudio, false, 1);
                    self.scheduleOnce(() => {
                        let name = node.name;
                        node.name = groove.name;
                        groove.name = name;
                    }, 0.3);
                    node.off('touchstart');
                    node.off('touchmove');
                    node.off('touchend');
                    node.off('touchcancel');
                    if (self.successTime === self.dragSuccessTime) {

                        //拖拽完成，保留数据
                        cc.sys.localStorage.setItem(`${self.server}_${self.configData.game}_drag`, true)
                        //统计完成情况
                        let answerTime = cc.sys.localStorage.getItem('answerTime') || 0;
                        cc.sys.localStorage.setItem('answerTime', (+answerTime + 1));

                        let finishTime = cc.sys.localStorage.getItem('finishTime') || 0;
                        cc.sys.localStorage.setItem('finishTime', (+finishTime + 1));

                        cc.audioEngine.play(self.dragRightAudio, false, 1);
                        self.scheduleOnce(() => {
                            self.stopDrag();
                        }, 3)
                    }else{
                        cc.sys.localStorage.setItem(`${self.server}_${self.configData.game}_drag`, false)
                    }

                } else {

                    let wrongTime = cc.sys.localStorage.getItem('wrongTime') || 0;
                    cc.sys.localStorage.setItem('wrongTime', (+wrongTime + 1));
                    self.calcPoint()

                    //返回到原来的content中
                    node.removeFromParent(false);
                    cc.audioEngine.play(self.wrongAudio, false, 1);
                    let content = cc.find('scrolls/scroll', self.node);
                    if (content) {
                        node.x = node.startX;
                        node.y = node.startY;
                        node.runAction(cc.scaleTo(0.2, 0.6));
                        content.addChild(node);
                    }

                }

            } else if (self.mode === 'order') {

                let right = self.judgeGrooves(node);
                if (right !== '') {
                    var x = cc.find('grooves/groove' + right, self.node).x;
                    var y = cc.find('grooves/groove' + right, self.node).y;
                    node.runAction(cc.spawn(cc.moveTo(0.1, cc.p(x, y)), cc.scaleTo(0.1, 1)));
                    cc.audioEngine.play(self.draginAudio, false, 1);
                    node.off('touchstart');
                    node.off('touchmove');
                    node.off('touchend');
                    node.off('touchcancel');
                    self.blankGrooves.splice(self.blankGrooves.indexOf(right), 1);
                    if (self.blankGrooves.length === 0) {
                        self.scheduleOnce(() => {
                            self.calcRightPictureToGrooves();
                        }, 1)
                    }
                } else {
                    
                    node.removeFromParent(false);
                    cc.audioEngine.play(self.wrongAudio, false, 1);
                    let content = cc.find('scrolls/scroll', self.node);
                    if (content) {
                        node.x = node.startX;
                        node.y = node.startY;
                        node.runAction(cc.scaleTo(0.2, 0.6));
                        content.addChild(node);
                    }
                }
            }
        });

        node.on(cc.Node.EventType.TOUCH_CANCEL, function () {
            cc.audioEngine.stopAll();
            //返回到原来的content中
            let wrongTime = cc.sys.localStorage.getItem('wrongTime') || 0;
            cc.sys.localStorage.setItem('wrongTime', (+wrongTime + 1));

            self.calcPoint()
            node.removeFromParent(false);
            let content = cc.find('scrolls/scroll', self.node);
            if (content) {
                node.x = node.startX;
                node.y = node.startY;
                node.runAction(cc.scaleTo(0.2, 0.6));
                content.addChild(node);
            }
        });
    },
    calcRightPictureToGrooves() {
        let self = this;
        let flag = true;
        let pictures = self.configData.drags.pictures;
        for (let i = 0; i < pictures.length; i++) {
            let picture = cc.find('grooves/picture' + i, self.node);
            let right = cc.find('right', picture);
            let wrong = cc.find('wrong', picture);
            right.opacity = 0;
            wrong.opacity = 0;

            if (picture) {
                let target = cc.find('grooves/groove' + picture.target, self.node)
                if (target) {
                    if (Math.round(picture.x) === Math.round(target.x) && Math.round(picture.y) === Math.round(target.y)) {
                        right.opacity = 255;
                    } else {
                        flag = false;
                        wrong.opacity = 255;
                    }
                }
            }
        }
        cc.sys.localStorage.setItem(`${self.server}_${self.configData.game}_drag`, true)
        if (flag) {
            cc.audioEngine.play(self.dragRightAudio, false, 1);
            cc.sys.localStorage.setItem(`${self.server}_${self.configData.game}_rev_drag`,true)
            let finishTime = cc.sys.localStorage.getItem('finishTime') || 0;
            cc.sys.localStorage.setItem('finishTime', (+finishTime + 1));
            //作业正确得100分
            let point = cc.sys.localStorage.getItem('totalScore') || 0
            cc.sys.localStorage.setItem('totalScore', +point + 100)

        } else {
            cc.audioEngine.play(self.dragWrongAudio, false, 1);
            cc.sys.localStorage.setItem(`${self.server}_${self.configData.game}_rev_drag`, false)
            let wrongTime = cc.sys.localStorage.getItem('wrongTime') || 0;
            cc.sys.localStorage.setItem('wrongTime', (+wrongTime + 1));
            //作业有错误0分
            let point = cc.sys.localStorage.getItem('totalScore') || 0
            cc.sys.localStorage.setItem('totalScore', +point + 0)
        }
        self.scheduleOnce(() => {
            self.moveToRightGroove();
        }, 2);
    },
    moveToRightGroove() {
        let self = this;
        let pictures = self.configData.drags.pictures;
        for (let i = 0; i < pictures.length; i++) {
            let picture = cc.find('grooves/picture' + i, self.node);
            let right = cc.find('right', picture);
            let wrong = cc.find('wrong', picture);
            right.opacity = 0;
            wrong.opacity = 0;
            if (picture) {
                let target = cc.find('grooves/groove' + picture.target, self.node);

                if (target) {
                    let moveAction = cc.moveTo(0.5, cc.p(target.x, target.y));
                    picture.runAction(moveAction);

                    self.scheduleOnce(() => {
                        let name = target.name;
                        target.name = picture.name;
                        self.dragGrooves[picture.target] = picture.word;
                        picture.name = name;
                    }, 0.5);
                }
            }
        }
        self.scheduleOnce(() => {
            self.stopDrag();
            cc.sys.localStorage.setItem('nextPage', true);
            //统计完成情况
            let answerTime = cc.sys.localStorage.getItem('answerTime') || 0;
            cc.sys.localStorage.setItem('answerTime', (+answerTime + 1));

        }, 0.5)
    },
    stopDrag() {
        let self = this;
        let server = cc.sys.localStorage.getItem('server');
        let readword = self.configData.readword
        if (readword) {
            let time = 0;
            self.scheduleOnce(() => {
                for (let i = 0; i < self.dragGrooves.length; i++) {
                    let dragGroove = self.dragGrooves[i];

                    let audioUrl = `${self.host}${server}/${self.configData.game}/audio/${dragGroove}.mp3`;

                    if (i == 0) {
                        self.anim(audioUrl, i, readword[i])
                    } else {
                        time += +readword[i - 1];
                        self.scheduleOnce(() => {
                            self.anim(audioUrl, i, readword[i])
                        }, time + 1);
                    }
                }
            }, 1);
        }
        let content = cc.find('scrolls/scroll', self.node);
        content && content.pauseSystemEvents(true);
    },
    calcPoint(){
        let self = this
        self.dragTime++
        let point = 100
        
        if (self.dragTime === 0) {
            point = 100
        } else if (self.dragTime === 1) {
            point = 80
        } else if (self.dragTime === 2) {
            point = 70
        } else {
            point = 60
        }

        
    },
    anim(url, index, time) {
        let self = this;
        let children = cc.find('grooves', self.node).children;
        for (let i = 0; i < children.length; i++) {
            children[i].zIndex = 10;
        }
        cc.find('grooves/groove' + index, self.node).zIndex = 100;
        let node = cc.find('grooves/groove' + index + '/box', self.node);
        if (!node) {
            node = cc.find('grooves/groove' + index, self.node);
        }
        cc.audioEngine.stopAll();
        cc.audioEngine.play(url, false, 1);
        let scaleAction = cc.sequence(
            cc.scaleTo(time / 4, 1.5),
            cc.scaleTo(time / 4, 1),
            cc.scaleTo(time / 4, 1.5),
            cc.scaleTo(time / 4, 1));
        node.runAction(scaleAction);
    },
    judgeGrooves(node) {
        //计算和所有Grooves的位置如果有符合条件的，就返回
        let self = this;
        let right = null;
        if (self.blankGrooves && self.blankGrooves.length > 0) {
            for (let i = 0; i < self.blankGrooves.length; i++) {
                let groove = self.blankGrooves[i];
                let area = self.calcArea(groove);
                if (area) {
                    let result = self.judgeDrag(node.x, node.y, area);
                    if (result) {
                        right = groove;
                    }
                }
            }
        }
        if (right === 0) {
            return right
        } else {
            return right ? right : '';
        }

    },
    calcArea: function (target) {
        let self = this;
        let targetNode = cc.find('grooves/groove' + target, self.node);

        if (!targetNode) return null;

        let x = targetNode.x;
        let y = targetNode.y;
        let width = targetNode.width;
        let height = targetNode.height;

        let ss = [];
        ss.push(x + parseInt(width / 2));
        ss.push(x - parseInt(width / 2));
        ss.push(y + parseInt(height / 2));
        ss.push(y - parseInt(height / 2));

        return ss;
    },
    judgeSquare: function (nodeX, nodeY) {
        let self = this;
        if (!nodeX && !nodeY) return;

        let targetNode = cc.find('bg', self.node);
        if (!targetNode) return;

        let x = targetNode.x;
        let y = targetNode.y;
        let width = targetNode.width;
        let height = targetNode.height;

        let ss = [];
        ss.push(x + parseInt(width / 2));
        ss.push(x - parseInt(width / 2));
        ss.push(y + parseInt(height / 2));
        ss.push(y - parseInt(height / 2));

        return self.judgeDrag(nodeX, nodeY, ss);
    },
    judgeDrag: function (x, y, area) {
        return area ? (x < area[0] && x > area[1] && y < area[2] && y > area[3]) : false;
    },
    loadImg(imgUrl, node) {
        let server = cc.sys.localStorage.getItem('server');
        let host = cc.sys.localStorage.getItem('HOST');
        let page = this.configData.game;
        cc.loader.load(`${host}${server}/${page}/img/${imgUrl}.jpg`, (err, img) => {
            if (img) {
                cc.find(node.parent.name == 'grooves' ? 'box/img' : 'img', node).getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(img);
            }
        })
    },


    des() {
        let self = this;

        self.unscheduleAllCallbacks();
    },
    out() {
    }

    // update (dt) {},
});