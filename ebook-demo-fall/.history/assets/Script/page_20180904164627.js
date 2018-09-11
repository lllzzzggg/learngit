cc.Class({
    extends: cc.Component,

    properties: {
        cover: {
            type: cc.Prefab,
            default: null
        },
        part: {
            type: cc.Prefab,
            default: null
        },
        read: {
            type: cc.Prefab,
            default: null
        },
        choice: {
            type: cc.Prefab,
            default: null
        },
        drag: {
            type: cc.Prefab,
            default: null
        },
        drag_multiple: {
            type: cc.Prefab,
            default: null
        },
        choice_listen: {
            type: cc.Prefab,
            default: null
        },
        choice_look: {
            type: cc.Prefab,
            default: null
        },
        choice_listen_many: {
            type: cc.Prefab,
            default: null
        },
        choice_look_many: {
            type: cc.Prefab,
            default: null
        },
        choice_words: {
            type: cc.Prefab,
            default: null
        },
        choice_words_many: {
            type: cc.Prefab,
            default: null
        },
        choice_sentence: {
            type: cc.Prefab,
            default: null
        },
        choice_sentence_many: {
            type: cc.Prefab,
            default: null
        },
        reread: {
            type: cc.Prefab,
            default: null
        },
        reread_preview: {
            type: cc.Prefab,
            default: null
        },
        learnWord_preview: {
            type: cc.Prefab,
            default: null
        },
        end: {
            type: cc.Prefab,
            default: null
        }
    },

    start() {
        //cocos设置
        cc.game.setFrameRate(30);
        cc.view.resizeWithBrowserSize(true);

        if (!String.prototype.trim) {
            String.prototype.trim = function () {
                return this.replace(/(^[\s\n\t]+|[\s\n\t]+$)/g, "");
            }
        }

        var self = this;
        self.index = 0;
        self.pages = [];
        self.reLoad()
        self.page_num = cc.find('Canvas/page_num');

        // cc.loader.loadRes('test_Review.json', (err, res) => {
        //     if (err) return;
        //     self.initGame(res);
        // });
    },
    initGame(pages) {
        let self = this;
        if (pages) {
            //处理关于预习与复习的逻辑
            let prev = cc.find('button/prev', self.node);
            let next = cc.find('button/next', self.node);
            let btn_js_next = next.getComponent('btn');
            let btn_js = prev.getComponent('btn');
            btn_js && btn_js.initButton(pages.config.review);
            cc.sys.localStorage.setItem('review', pages.config.review);
            btn_js_next && btn_js_next.initButton(pages.config.review);

            //host地址
            // if (window.location.href) {
            //     let host = window.location.href.split('ebook')[0];
            //     if (host.indexOf('8087') !== -1) {
            //         cc.sys.localStorage.setItem('HOST', host + 'resources/');
            //     } else {
            //         cc.sys.localStorage.setItem('HOST', host + 'ebook/resources/');
            //     }
            // }
            cc.sys.localStorage.setItem('HOST', 'http://10.32.31.81/resources/')  //本地测试地址

            cc.sys.localStorage.setItem('server', pages.config.server);
            cc.sys.localStorage.setItem('review', pages.config.review);
            cc.sys.localStorage.setItem('preview_TS', pages.config.preview_TS);
            self.host = cc.sys.localStorage.getItem('HOST');
            self.server = pages.config.server;
            
            let firstTime = cc.sys.localStorage.getItem('firstTime');
            if(!firstTime){
                self.initLocalStorage();
            }
            cc.sys.localStorage.setItem('firstTime', 0);
            

            //part部分控制
            self.pages = pages.pages;
            self.scoreNumFun();

            //统计答题数目
            let total = 0;
            for (let i = 0; i < self.pages.length; i++) {
                let page = self.pages[i];
                if (page.prefab !== 'cover' || page.prefab !== 'part' || page.prefab !== 'end') {
                    if (page.prefab === 'read') {
                        let words = page.words;
                        total += words.length;
                    } else {
                        total += 1;
                    }
                }
            }

            //事件监听

            let messageHandler = (e) => {
                if(e && e.data){
                    window.voiceCallback.handleResult(e.data);
                }
            }
            window.addEventListener('message',messageHandler,false)


            self.page_part = null;

            self.index = +cc.sys.localStorage.getItem('current_page_' + self.server) || 0;

            //预加载音频资源
            self.loadAudios();
            if(self.index == 0){
                self.loadPage();
            }
            
        }
    },
    initLocalStorage(){
        let self = this;
        let readScore = [];
        let jsonScore = JSON.stringify(readScore)

        //结束后统计初始化
        cc.sys.localStorage.setItem('openTime', 0); //跟读统计字段开口次数
        cc.sys.localStorage.setItem('answerTime', 0); //
        cc.sys.localStorage.setItem('finishTime', 0); //完成答题数，答题达到要求才会计入
        cc.sys.localStorage.setItem('total', 0); //total和finishTime用来最后计算答题成功率，总题数，答题一次就统计一次

        cc.sys.localStorage.setItem('wrongTime',0)              //答错次数
        cc.sys.localStorage.setItem('readTime',0)               //语音成功次数
        cc.sys.localStorage.setItem('totalScore',0)             //总分
        cc.sys.localStorage.setItem('ReadScore',jsonScore)      //统计跟读最高分的数组
    },
    scoreNumFun(){
        let self = this;
        let pages = self.pages;
        let scorePrefab = ['reread','choice_sentence_many','choice_words_many','choice_look_many','choice_listen_many','choice_listen','choice_look','choice_words','choice_sentence','read','drag','drag_multiple']
        let scoreNums = 0;
        for(let i = 0;i < pages.length;++i){
            if(scorePrefab.indexOf(pages[i].prefab) >= 0){
                scoreNums++;
            }
        }
        cc.sys.localStorage.setItem('scoreNums',scoreNums)  
    },
    loadPage() {
        let self = this;
        let page_1_data = self.pages[self.index];
        if (page_1_data) {
            let page_1_prefab = self[page_1_data.prefab];
            let page_1_node = cc.instantiate(page_1_prefab);
            page_1_node.name = 'page' + self.index;
            page_1_node.moduleName = page_1_data.prefab;
            self.level = page_1_data.game + '_' + page_1_data.prefab;
            self.preLoadResource(page_1_node, self.index);
            let allPage = cc.find('page', self.node);
            let page_js = page_1_node.getComponent(page_1_data.prefab);
            self.currentPage = page_1_node;

            allPage.addChild(page_1_node);

            self.page_num.getComponent(cc.Label).string = (self.index + 1) + '/' + self.pages.length;
            page_js.initPage && page_js.initPage(page_1_data);
            self.hideButton();
            if(self.index > 0){
                self.prevLoad()
            }
            self.nextLoad();
        }
    },
    loadAudios() {
        let self = this;
        let audioArr = []
        self.host = cc.sys.localStorage.getItem('HOST');
        self.server = cc.sys.localStorage.getItem('server');
        if (self.pages) {
            for (let i = 0; i < self.pages.length; i++) {
                let page = self.pages[i];
                if (page.prefab === 'cover') {
                    let readAudio = `${self.host}${self.server}/${page.game}/audio/cover.mp3`;
                    audioArr.push(readAudio)
                }else if(page.prefab === 'part'){
                    let audio = `${self.host}${self.server}/${page.game}/audio/${page.readAudio}`;
                    audioArr.push(audio)
                } else if (page.prefab === 'read') {

                    let audio = `${self.host}${self.server}/${page.game}/audio/${page.audios[0].readAudio}`;
                    audioArr.push(audio)
                    if (page.words) {
                        for (let i = 0; i < page.words.length; i++) {
                            let word = page.words[i];
                            for(let j = 0;j< word.length;j++){
                                let name = word[j].trim().replace(/\s/g, "_");
                                let audio = `${self.host}${self.server}/${page.game}/audio/${name}.mp3`;
                                audioArr.push(audio)
                            }
                        }
                    }
                } else if (page.prefab === 'drag') {
                    let readAudio = `${self.host}${self.server}/${page.game}/audio/${page.audio.readAudio}`;
                    audioArr.push(readAudio)
                    if (page.readword) {
                        for (let i = 0; i < page.drags.grooves; i++) {
                            if (page.drags.grooves[i] !== '') {
                                let audioUrl = `${self.host}${self.server}/${page.game}/audio/${page.drags.grooves[i]}.mp3`;
                                audioArr.push(audioUrl)
                            }
                        }
                        for (let i = 0; i < page.drags.pictures; i++) {
                            if (page.drags.pictures[i].target !== '') {
                                let audioUrl = `${self.host}${self.server}/${page.game}/audio/${page.drags.pictures[i].img}.mp3`;
                                audioArr.push(audioUrl)
                            }
                        }
                    }
                } else if (page.prefab === 'drag_multiple') {
                    let readAudio = `${self.host}${self.server}/${page.game}/audio/${page.audio}.mp3`;
                    audioArr.push(readAudio)
                } else {
                    if (page.audio) {
                        let audio = `${self.host}${self.server}/${page.game}${page.audio}`;
                        audioArr.push(audio)
                    }
                }
            }
            if (audioArr.length !== 0) {
                let loading = cc.find('Canvas/loading');
                let current_page = cc.sys.localStorage.getItem('current_page_' + self.server) || 0;
                let len = audioArr.length;
                self.num  = len;
                for (let i = 0; i < len; i++) {
                    cc.loader.load(audioArr[i], function (err, result) {
                        //404也通过
                        //if (!err) {
                        cc.audioEngine.stopAll();
                        self.num--;
                        if (self.num == 0) {
                            cc.audioEngine.stopAll();
                            loading.opacity = 0;
                            let page_node = cc.find('page', self.node);
                            let cover = cc.find('page0', page_node);
                            page_node.opacity = 255;
                            
                            if (cover && current_page == 0) {
                                let cover_js = cover.getComponent('cover');
                                cover_js.readAudioFunc();
                            }
                            if(current_page != 0){
                                self.loadPage();
                            }
                        } else {
                            cc.audioEngine.stopAll();
                            loading.opacity = 255;
                            cc.find('content', loading).getComponent('cc.RichText').string = `<outline color=#0e0943 width=8>正在加载中(${Math.round((len - self.num) / len * 100)}%)...</outline>`
                        }
                        //}
                    });
                }
            }
        }
    },
    loadPart() {
        let self = this;
        let part_node = cc.find('button/part', self.node);
        if (self.page_part) {

            let part = 0;
            for (let i = 0; i <= self.index; i++) {
                let page = self.pages[i];
                if (page.prefab === 'part') {
                    part = page.partNum;
                    part_node.opacity = 0;
                } else {
                    part_node.opacity = 255;
                }
            }

            if (part != 0) {
                for (let i = 0; i < self.page_part.children.length; i++) {
                    self.page_part.children[i].opacity = 0;
                    if (i < part) {
                        self.page_part.children[i].opacity = 255;
                    }
                }
            }
        }
    },
    hideButton() {
        let self = this;
        let button = cc.find('button', self.node);
        if (self.index === 0 || self.index === self.pages.length - 1) {
            button.opacity = 0;
            button.pauseSystemEvents(true);
        } else {
            this.scheduleOnce(() => {
                button.opacity = 255;
                button.resumeSystemEvents(true);
            }, 0.1)
        }
    },
    prev() {
        let self = this;
        let cur = cc.find('page/page' + self.index, self.node);
        if (self.index > 0) {
            self.index--;
            let prev = cc.find('page/page' + self.index, self.node);
            let page_js = prev.getComponent(prev.moduleName);
            page_js && page_js.initPage(self.pages[self.index]);
            if (cur && prev) {
                self.transition(prev, cur, false);
                self.loadPart();
                self.page_num.getComponent(cc.Label).string = (self.index + 1) + '/' + self.pages.length;
                self.prevLoad();
            } else {
                self.index++;
            }
        }
    },
    next() {
        let self = this;
        let cur = cc.find('page/page' + self.index, self.node);

        if (self.pages.length > self.index + 1) {
            if (self.index === self.pages.length - 2) {
                let pop_node = cc.find('pop', self.node)
                let yes = cc.find('yes', pop_node)
                let no = cc.find('no', pop_node)
                pop_node.active = true
                
                yes.on(cc.Node.EventType.TOUCH_END, () => {
                    pop_node.active = false
                    self.index++;
                    let next = cc.find('page/page' + self.index, self.node);
                    let page_js = next.getComponent(next.moduleName);
                    page_js && page_js.initPage(self.pages[self.index]);

                    if (cur && next) {
                        self.transition(next, cur, true);
                        self.loadPart();
                        self.page_num.getComponent(cc.Label).string = (self.index + 1) + '/' + self.pages.length;
                        self.nextLoad();
                    } else {
                        self.index--;
                    }
                })
                no.on(cc.Node.EventType.TOUCH_END, () => {
                    pop_node.active = false
                })
            }else{
                self.index++;
                let next = cc.find('page/page' + self.index, self.node);
                let page_js = next.getComponent(next.moduleName);
                page_js && page_js.initPage(self.pages[self.index]);

                if (cur && next) {
                    self.transition(next, cur, true);
                    self.loadPart();
                    self.page_num.getComponent(cc.Label).string = (self.index + 1) + '/' + self.pages.length;
                    self.nextLoad();
                } else {
                    self.index--;
                }
            }
            
        }
    },
   

    prevLoad() {

        let self = this;

        if (self.index > 0) {
            //self.index--;
            let page_prev = self.pages[self.index - 1];
            let page_prev_prefab = self[page_prev.prefab];
            let page_prev_node = cc.instantiate(page_prev_prefab);
            page_prev_node.name = 'page' + (self.index - 1);
            page_prev_node.moduleName = page_prev.prefab;
            page_prev_node.x = -2048;

            self.level = page_prev.game + '_' + page_prev.prefab;

            self.preLoadResource(page_prev_node, self.index - 1);
            let allPage = cc.find('page', self.node);
            let page_js = page_prev_node.getComponent(page_prev.prefab);

            allPage.insertChild(page_prev_node, 0);
            cc.audioEngine.stopAll();
            page_js && page_js.loadDynamicResources && page_js.loadDynamicResources(page_prev);

        }
    },
    nextLoad() {

        let self = this;

        if (self.pages.length > self.index + 1) {

            //self.index++;
            let page_next = self.pages[self.index + 1];

            let page_next_prefab = self[page_next.prefab];
            let page_next_node = cc.instantiate(page_next_prefab);
            page_next_node.name = 'page' + (self.index + 1);
            page_next_node.moduleName = page_next.prefab;
            page_next_node.x = 2048;
            self.level = page_next.game + '_' + page_next.prefab;
            self.preLoadResource(page_next_node, self.index + 1);
            let page_js = page_next_node.getComponent(page_next.prefab);
            let allPage = cc.find('page', self.node);
            allPage.addChild(page_next_node);
            cc.audioEngine.stopAll();
            page_js && page_js.loadDynamicResources && page_js.loadDynamicResources(page_next);

        }
    },
    preLoadResource(node, num) {
        let self = this;
        let pre = self.pages[num];
        let imgs = pre && pre.imgs;
        if (imgs) {
            for (let i = 0; i < imgs.length; i++) {
                for (let k in imgs[i]) {
                    let cNode = cc.find(k + '', node);
                    let url = `${self.host}${self.server}/${pre.game}/img/${imgs[i][k]}`;
                    cNode && self.loadImg(cNode, url);
                }
            }
        }
    },
    loadImg(node, url) {
        if (url) {
            cc.loader.load(url, function (err, img) {
                if (err) return;
                node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(img);
            })
        }
    },
    transition(nodeIn, nodeOut, next) {
        let self = this;
        cc.audioEngine.stopAll();
        self.unscheduleAllCallbacks();
        self.hideButton();
        let slideInAction = null;
        let slideOutAction = null;

        if (next) {
            slideInAction = cc.moveBy(0.2, cc.p(-2048, 0));
            slideOutAction = cc.moveBy(0.2, cc.p(-2048, 0));
        } else {
            slideInAction = cc.moveBy(0.2, cc.p(2048, 0));
            slideOutAction = cc.moveBy(0.2, cc.p(2048, 0));
        }
        nodeIn.runAction(slideInAction);
        nodeOut.runAction(slideOutAction);
        //保留当前页面
        cc.sys.localStorage.setItem('current_page_' + self.server, self.index);

        if (nodeIn.moduleName === 'drag_multiple'){
            let page_js = nodeIn.getComponent(nodeIn.moduleName);
            page_js && page_js.initPage(self.pages[self.index]);
        }
        
        if (nodeOut.moduleName === 'reread' || nodeOut.moduleName === 'reread_preview') {
            let nodeOut_js = nodeOut.getComponent(nodeOut.moduleName);
            nodeOut_js && nodeOut_js.des && nodeOut_js.des();
        }
        let nodeOut_js = nodeOut.getComponent(nodeOut.moduleName);
        nodeOut_js && nodeOut_js.out && nodeOut_js.out();

        let children = cc.find('page', self.node).children;
        self.scheduleOnce(() => {
            if (next) {
                if (children.length >= 3) {
                    let del_prev = cc.find('page/page' + (self.index - 2), self.node);
                    if (del_prev) {
                        let page_js = del_prev.getComponent(del_prev.moduleName);
                        page_js && page_js.des && page_js.des(self.pages[self.index - 2]);
                        del_prev.removeFromParent();
                    }
                }

            } else {
                if (children.length >= 3) {
                    let del_next = cc.find('page/page' + (self.index + 2), self.node);
                    if (del_next) {
                        let page_js = del_next.getComponent(del_next.moduleName);
                        page_js && page_js.des && page_js.des(self.pages[self.index + 2]);
                        del_next.removeFromParent();
                    }
                }
            }

            self.unscheduleAllCallbacks();
        }, 0.5)
    },
    reLoad() {
        let self = this
        let reload = cc.find('reload_every', self.node)
        reload.on('touchend', () => {
            window.location.reload();
            // cc.game.restart()
        })
    },
    onDestroy() {
        cocosAnalytics.onPause(true);
    },
    update() {
        if(self.index === 0 && self.num !== 0){
            cc.audioEngine.stopAll();
        }
    }
});