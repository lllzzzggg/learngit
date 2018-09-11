cc.Class({
    extends: cc.Component,

    properties: {

    },



    start() {

    },
    initPage(data) {
        let self = this;
        if (data) {
            self.configData = data;
            self.init();
            self.initPart();
            self.host = cc.sys.localStorage.getItem('HOST');
            self.server = cc.sys.localStorage.getItem('server');


        }

    },
    init() {
        let self = this;
        cc.audioEngine.stopAll();
        cc.sys.localStorage.setItem('nextPage', true);
        if (self.configData && self.configData.readAudio) {
            self.scheduleOnce(() => {
                let audio = `${self.host}${self.server}/${self.configData.game}/audio/${self.configData.readAudio}`;
               
                cc.sys.localStorage.setItem('nextPage', true)
                cc.audioEngine.play(audio, false, 1);
            }, 0.6);
        }
    },
    loadDynamicResources(data) {
        let self = this;
        let img_node = cc.find('img', self.node);
        let title_node = cc.find('title', self.node);
        let ip = cc.find('ip', self.node);
        if (data && data.title) {
            title_node.getComponent('cc.RichText').string = `<outline color=#000557 width=15><color>${data.title}</color></outline>`;
        }
        if (data && data.img) {
            if (data.img.indexOf('part1') === -1) {
                ip.opacity = 0;
            }
            cc.loader.loadRes(data.img, (err, img) => {
                if (err) return;
                img_node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(img);
            })
        }
    },
    initPart() {
        let self = this;
        let img_node = cc.find('img', self.node);
        let title_node = cc.find('title', self.node);
        let ip = cc.find('ip', self.node);
        if (self.configData && self.configData.title) {
            title_node.getComponent('cc.RichText').string = `<outline color=#000557 width=15><color>${self.configData.title}</color></outline>`;
        }
        if (self.configData && self.configData.img) {
            if (self.configData.img.indexOf('part1') === -1) {
                ip.opacity = 0;
            }
            cc.loader.loadRes(self.configData.img, (err, img) => {
                if (err) return;
                img_node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(img);
            })
        }
    },
    des() {

    },
    out() {
    }

    // update (dt) {},
});