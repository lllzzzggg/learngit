cc.Class({
    extends: cc.Component,

    properties: {

        readAudio: {
            url: cc.AudioClip,
            default: ''
        },
        word: {
            type: cc.Prefab,
            default: null
        }
    },

    start() {
        let self = this;
        self.node.on('cardOpen', (e) => {
            e.stopPropagation();
            self.cancelWrite();
        });

    },

    initPage(data) {
        let self = this;



        let str = '';
        self.host = cc.sys.localStorage.getItem('HOST');
        self.server = cc.sys.localStorage.getItem('server');
        window.Vipx = {
            score: null,
            scoreNode: null,
            word: null,
            audioUrl: ''
        };
        if (data) {
            self.configData = data;
            str = self.configData["texts"][0].read_text;
            self.readAudio = self.host + self.server + '/' + self.configData.game + '/audio/' + self.configData.audios[0].readAudio;

            self.audioTime = self.configData.audios[0].time;
            self.write_str = '';

            //let dot = cc.find('word_bar/dot', self.node);
            ///dot.opacity = 0;
            //let dragon_node = cc.find('word_bar/word_card_Icon_ske', self.node);
            //let dragonBones = dragon_node.getComponent('dragonBones.ArmatureDisplay');
            //dragonBones.playAnimation('static', -1);

            if (str) {
                self.write_str = self.initLabel(str);
            }
            self.scheduleOnce(() => {
                self.touendEvent(self.write_str);
            }, 0.2)

           // self.initWords();
        }

    },
    touendEvent(write_str) {
        let self = this;
        cc.audioEngine.stopAll();
        let up = cc.find('text/up_text', self.node);
        //up.getComponent(cc.Label).string = '';
        //up.cleanup();
        //self.write(write_str);
    },
    cancelWrite() {
        let self = this;
        cc.audioEngine.stopAll();
        let up = cc.find('text/up_text', self.node);
        up.getComponent(cc.Label).string = '';
        up.cleanup();
        self.unscheduleAllCallbacks();
    },

    write() {
        let self = this;
        let btn = cc.find('button/check', self.node);
        let dragon_node = cc.find('button/horn_ske', self.node);
        let dragon = dragon_node.getComponent('dragonBones.ArmatureDisplay');

        let up = cc.find('text/up_text', self.node);
        let back = cc.find('text/back_text', self.node);
        let dot = cc.find('word_bar/dot', self.node);
        let audio = cc.audioEngine.play(self.readAudio, false, 1);
        dragon.playAnimation('loop', -1);
        let time_length = cc.audioEngine.getDuration(audio) || self.configData.audios[0].time;
        let str = back.getComponent(cc.Label).string;
        let time = time_length / str.length;
        let index = 0;
        let words_node = cc.find('words', self.node);

        words_node.pauseSystemEvents(true);

        let func = function () {
            if (index <= str.length) {
                up.getComponent(cc.Label).string = str.substr(0, index);
                index++;
            }
            self.unschedule(func);
        }
        self.unscheduleAllCallbacks();

        self.schedule(() => {
            func()
        }, time)

        btn.on(cc.Node.EventType.MOUSE_ENTER, function (event) {
            cc._canvas.style.cursor = 'pointer';
        });
        btn.on(cc.Node.EventType.MOUSE_LEAVE, function (event) {
            cc._canvas.style.cursor = 'default';
        });
        self.scheduleOnce(() => {
            dot.opacity = 255;
            dragon.playAnimation('static', -1);
            btn.on('touchend', () => {
                self.touendEvent(self.write_str);
            });
            self.bindDragon();
        }, time_length);
    },

    initLabel(str) {

        let self = this;
        let content = cc.find('text/content', self.node);
        content.getComponent('cc.RichText').string = newStr;
    },
    initWords() {
        let self = this;
        let words = self.configData.words;

        let game = self.configData.game;
        let timeout = self.configData.timeout || 8;
        let words_node = cc.find('words', self.node);
        let bar = cc.find('word_bar', self.node);
        words_node.opacity = 0;
        if (words && words.length !== 0) {

            let answerTime = cc.sys.localStorage.getItem('answerTime') || 0;
            cc.sys.localStorage.setItem('answerTime', (+answerTime + words.length));


            let num = cc.find('dot/num', bar);
            num.getComponent(cc.Label).string = words.length;
            bar.opacity = 255;

            words_node.removeAllChildren();
            let xVal = 0,
                xWidth = 0;
            for (let i = 0; i < words.length; i++) {
                let word = words[i];
                let word_node = cc.instantiate(self.word);
                let text = cc.find('button/text', word_node);
                text.getComponent('cc.RichText').string = `<outline color=#000557 width=8><color>${word}</color></outline>`;
                let word_js = word_node.getComponent('word');

                xVal = (i == 0 ? 0 : (xWidth + text.width / 2)) + 50 * i;
                xWidth += i == 0 ? (text.width / 2) : (text.width);
                word_js.initWord(game, timeout, word);
                word_node.x = -900 + xVal;
                words_node.addChild(word_node);
            }

        } else {
            bar.opacity = 0;

        }
    },
    bindDragon() {
        let self = this;
        let dragon_node = cc.find('word_bar/word_card_Icon_ske', self.node);
        let words_node = cc.find('words', self.node);
        let children = words_node.children;
        let button = cc.find('word_bar/button', self.node);
        if (dragon_node) {
            let dragonBones = dragon_node.getComponent('dragonBones.ArmatureDisplay');
            dragonBones.playAnimation('motion', -1);
            button.on('touchend', () => {
                words_node.resumeSystemEvents(true);
                dragonBones.playAnimation('static', -1);
                let fadeAction = cc.sequence(cc.fadeIn(0.1), cc.fadeOut(0.1), cc.fadeIn(0.1), cc.fadeOut(0.1), cc.fadeIn(0.1));
                words_node.runAction(fadeAction);
                button.off('touchend');
                self.scheduleOnce(() => {
                    for (let i = 0; i < children.length; i++) {
                        let button = cc.find('button', children[i]);
                        let repeatAction = cc.repeatForever(cc.sequence(cc.rotateTo(1, 15), cc.rotateTo(1, -15)));
                        button.runAction(repeatAction);
                    }
                }, 0.6)

            })
        }
    },
    getIndexOfSpace(newStr, flags, node) {
        let num = 0;
        while (node.width > 1200) {
            newStr = newStr.substring(0, flags[flags.length - 1 - num] + 1) + '\n' + newStr.substring(flags[flags.length - 1 - num] + 1, newStr.length);
            node.getComponent(cc.Label).string = newStr
            num++;
        }
        return flags.length - 1 - num;
    },
    des(data) {
        let self = this;

        self.unscheduleAllCallbacks();
        if (data) {
            let words = data.words;
            let game = data.game;

            window.Vipx.score = null;
            window.Vipx.audioUrl = null;
            window.Vipx.word = null;

            if (words) {
                for (let i = 0; i < words.length; i++) {
                    let key = game + '_' + words[i] + '_score';
                    cc.sys.localStorage.removeItem(key);
                }
            }
        }


    },
    out() {

        let self = this;

        self.unscheduleAllCallbacks();
        let words = self.configData.words;
        let game = self.configData.game;

        window.Vipx.score = null;
        window.Vipx.audioUrl = null;
        window.Vipx.word = null;

        if (words) {
            for (let i = 0; i < words.length; i++) {
                let key = game + '_' + words[i] + '_score';
                cc.sys.localStorage.removeItem(key);
            }
        }
         
    },
    onDestroy() {
        let self = this;

    }
    // update (dt) {},
});