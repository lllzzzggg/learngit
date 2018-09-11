cc.Class({
    extends: cc.Component,

    properties: {
        img_prefab: {
            type: cc.Prefab,
            default: null
        },
        img_box_prefab:{
            type: cc.Prefab,
            default: null
        },
        text_box_prefab: {
            type: cc.Prefab,
            default: null
        },
        text_high_prefab: {
            type: cc.Prefab,
            default: null
        },
        text_prefab: {
            type: cc.Prefab,
            default: null
        },
        text_drag_prefab: {
            type: cc.Prefab,
            default: null
        },
        title_prefab:{
            type: cc.Prefab,
            default: null
        }
        
    },

    // onLoad () {},

    start () {
        let self = this;
        self.total = 0
        self.num = 1
        self.count = 4
        self.activeCenter = null
        self.blankGrooves = []

        cc.loader.loadRes('config1.json', (err, res) => {
            if (err) return;
            let data = res.pages[0]
            self.initGame(data);
        });
    },
    initGame(data){
        /**
         *  type: img-图片类型的拖拽  text- 文字类型的拖拽
         *  title: { text- 题干文字信息  audio- 题干音频内容？如果需要的话 }
         * 
         * 
        */
        let self = this;
        let title = data.title
        let grooves = data.grooves
        let drags = data.drags
        
        self.data = data
        self.total = 0
        self.num = 1
        self.count = 4
        self.activeCenter = null
        self.blankGrooves = []
        self.type = data.type
        self.centerText = data.title.center
        self.initTitle(title)
        self.initGrooves(grooves)
        self.initDrags(drags)

    },
    initTitle(title){
        let self = this
        let content_node = cc.find('title/content', self.node).getComponent('cc.RichText') 
        let text = title.text;
        content_node.string = `<color=#ffffff>${ text }</c>`
        // if(title.audio){
        //     let audio = title.audio;
        //     cc.audioEngine.stopAll()
        //     cc.audioEngine.play(audio, false, 1)
        // }
    },
    initDrags(data) {
        let self = this
    
        let len = data.length
        let blocks = cc.find(`blocks/${self.type}s`, self.node)
        blocks.active = true
        self.count = self.type === 'img' ? 4 : 2
        self.total = (len % self.count === 0) ? Math.floor(len / self.count) : (Math.floor(len / self.count) + 1)
        blocks.removeAllChildren()
        for(let i = 0;i < len; i++){
            let drag = data[i]
            if(self.type === 'img'){
                let img_box = cc.instantiate(self.img_box_prefab)
                img_box.name = 'img' + i
                img_box.y = 0;
                img_box.x = (img_box.width - blocks.width) / 2 + i * (img_box.width + 80)
                if (drag.content !== '') {
                    let img_node = self.createImgNode(drag.content)
                    img_node.scaleX = 0.6
                    img_node.scaleY = 0.6
                    self.activeDragEvents(img_node)
                    img_box.addChild(img_node)
                
                }
                blocks.addChild(img_box)
            }else{
                let text_box = cc.instantiate(self.text_box_prefab)
                text_box.name = 'text' + i
                text_box.y = 0
                text_box.x = i % 2 == 0 ? -320 : 320
                if (drag.content !== '') {
                    let text_node = self.createTextDragNode(drag.content)
                    self.activeDragEvents(text_node)
                    text_box.addChild(text_node)
                }
                blocks.addChild(text_box)
            }
        }
        self.activeDrags()
        self.activePageButton()
    },
    activePageButton() {
        let self = this
        let left = cc.find('blocks/left', self.node)
        let right = cc.find('blocks/right', self.node)
        left.on(cc.Node.EventType.TOUCH_END, () => {
            if(self.num > 1){
                self.num--
                self.activeDrags()
            }
        })
        right.on(cc.Node.EventType.TOUCH_END, () => {
            if(self.num < self.total){
                self.num++
                self.activeDrags()
            }
        })
        
    },
    activeDrags() {
        let self = this
        let blocks = cc.find(`blocks/${self.type}s`, self.node)
        let page = cc.find('blocks/page', self.node)
        let left = cc.find('blocks/left', self.node)
        let right = cc.find('blocks/right', self.node)
        left.active = self.num > 1
        right.active = self.num < self.total
        page.getComponent('cc.RichText').string = `<color=#ffffff>${ self.num }/${ self.total }</color>`
        blocks.children.map(child => child.active = false)
        blocks.x = self.type === 'img' ? (0 - 1280 * (self.num - 1)) : 0
        let activeChildren = blocks.children.slice((self.num - 1) * self.count, (self.num - 1) * self.count + self.count)
        activeChildren.map(child => child.active = true)
    },
    initGrooves(data){
        let self = this
        let len = data.length
        if(len < 2) return
        if(self.type === 'img' && len > 4) return 
        if(self.type === 'text' && len > 6) return 
        let centers = cc.find('center', self.node)
        centers.children.map(center => center.active = false)
        let center = `${ self.type }_center_${ data.length }`
        self.activeCenter = center
        cc.find(`center/${ center }`, self.node).active = true

        for(let i = 0; i < len; i++){
            let groove = data[i]
            let content = groove.content

            let tip = groove.tip
            let groove_node = null
            if(self.type === 'img'){
                groove_node = cc.find(`center/${ center }/grooves/groove${ i }`, self.node)
                let center_node = cc.find(`center/${ center }/center`, self.node).getComponent('cc.RichText')
                let text_node = cc.find('groove_text', groove_node).getComponent('cc.RichText')
                text_node.string = `<color=#B76558>${ tip }</color>`
                center_node.string = `<color=#ffffff>${ self.centerText }</color>`
            }else{
                groove_node = cc.find(`center/${ center }/grooves/${ len > 5 ? ('text_groove' + i) : ('text_groove_high' + i) }`, self.node)
            }
            if(self.type === 'text' && groove.tip !== ''){
                groove_node.addChild(self.createTitleNode(groove.tip,len))
            }
            if(content !== ''){
                groove_node.addChild(self.type === 'img' ? self.createImgNode(content) : self.createTextNode(content, len))
            }else{
                self.blankGrooves.push(groove_node.name)
            } 
        }
    },
    activeDragEvents(node) {
        let self = this
        node.on(cc.Node.EventType.TOUCH_START, event => {
            //保存原始点位置
            if(self.type === 'text' && node.parent.name.indexOf('grooves') !== -1) return
            node.parentBox = node.parent.name
            let touches = event.getTouches()
            if (touches.length >= 2) return
            let scaleAction = cc.scaleTo(0.05, 1);
            node.runAction(scaleAction);
            //拖拽开始要将节点放到center节点上
            let node_world_point = node.convertToWorldSpace(cc.p(0, 0))
            let groove = cc.find(`center/${ self.activeCenter }/grooves`, self.node)
            let groove_world_point = groove.convertToWorldSpace(cc.p(0,0))
            node.removeFromParent(false)
            //计算相对于groove节点的位置
            node.x = node_world_point.x - groove_world_point.x + node.width * ((node.parentBox.indexOf('img') !== -1) ? 0.6 : 1) / 2 - groove.width / 2
            node.y = node_world_point.y - groove_world_point.y + node.height * ((node.parentBox.indexOf('img') !== -1) ? 0.6 : 1) / 2 - groove.height / 2
            groove.addChild(node)

        })
        node.on(cc.Node.EventType.TOUCH_MOVE, event => {
            var touches = event.getTouches();
            if (touches.length >= 2) return;
            let delta = event.touch.getDelta();

            let moveX = cc.sys.os == 'Windows' ? delta.x / 1 : delta.x;
            let moveY = cc.sys.os == 'Windows' ? delta.y / 1 : delta.y;

            node.x += moveX
            node.y += moveY

        })
        node.on(cc.Node.EventType.TOUCH_END, event => {
            let right_node_name = self.judgeGrooves(node)
            if(right_node_name !== ''){
                let right_node = cc.find(`center/${ self.activeCenter }/grooves/${ right_node_name }`, self.node);
                if(self.type === 'img'){
                    node.removeFromParent(false)
                    let position = node.convertToNodeSpaceAR(right_node.getPosition())
                    node.x = -position.x
                    node.y = -position.y
                    right_node.addChild(node)
                    node.runAction(cc.spawn(cc.moveTo(0.1, cc.p(0, 0)), cc.scaleTo(0.1, 1)));
                    self.activeBorder(node, 'gold')
                }else{
                    node.runAction(cc.fadeOut(0.2))
                    self.scheduleOnce(() => {
                        node.destroy()
                    }, 0.2)
                    let content = cc.find('content', node).getComponent('cc.RichText').string.replace(/<\/?.+?>/g, '')
                    let text = self.createTextNode(content, self.data.grooves.length)
                    text.x = node.x
                    text.y = node.y
                    let position = text.convertToNodeSpaceAR(right_node.getPosition())
                    text.opacity = 0;
                    right_node.insertChild(text)
                    text.x = -position.x
                    text.y = -position.y
                    text.runAction(cc.spawn(cc.moveTo(0.2, cc.p(0, 0)), cc.fadeIn(0.2)));
                    self.activeBorder(text, 'gold')
                }
                node.off('touchstart');
                node.off('touchmove');
                node.off('touchend');
                node.off('touchcancel');
                
                self.blankGrooves.splice(self.blankGrooves.indexOf(right_node_name), 1);
                if(self.blankGrooves.length === 0){

                }
            }else{
                 node.removeFromParent(false);
                 let parent = cc.find(`blocks/${ self.type }s/${ node.parentBox }`, self.node)

                 if (parent) {
                     node.x = 0;
                     node.y = 0;
                     node.runAction(cc.scaleTo(0.2, (node.parentBox.indexOf('img') !== -1) ? 0.6 : 1));
                     parent.addChild(node);
                 }
            }
        })
        node.on(cc.Node.EventType.TOUCH_CANCEL, event => {
            node.removeFromParent(false);
            let parent = cc.find(`blocks/${ self.type }s/${ node.parentBox }`, self.node)
            
            if (parent) {
                node.x = 0;
                node.y = 0;
                node.runAction(cc.scaleTo(0.2, (node.parentBox.indexOf('img') !== -1) ? 0.6 : 1));
                parent.addChild(node);
            }
        })
    },
    activeBorder(node,border){
        let self = this
        let borders = cc.find('border', node).children
        borders.map(border => border.active = false)
        cc.find(`border/${ border }`, node).active = true
    },
    createTitleNode(title, len){
        let self = this
        let title_node = cc.instantiate(self.title_prefab)
        title_node.y = len > 5 ? 100 : 150
        title_node.zIndex = 10
        let content = cc.find('content', title_node).getComponent('cc.RichText')       
        content.string = `<color=#B76558>${ title }</color>`
        return title_node

    },
    createTextNode(data, len){
        let self = this
        let text_node = cc.instantiate(len > 5 ? self.text_prefab : self.text_high_prefab)
        let content = cc.find('content', text_node).getComponent('cc.RichText')
        content.string = `<color=#ffffff>${ data }</color>`
        return text_node
    },
    createTextDragNode(data) {
        let self = this
        let text_node = cc.instantiate(self.text_drag_prefab)
        let content = cc.find('content', text_node).getComponent('cc.RichText')
        content.string = `<color=#ffffff>${ data }</color>`
        return text_node
    },
    createImgNode(data){
        let self = this
        let img_node = cc.instantiate(self.img_prefab)
        let pic = cc.find('pic', img_node)
        self.loadImg(data, pic)
        return img_node
    },
    loadImg(imgUrl, node) {
        cc.loader.loadRes(`falls/drags/${imgUrl}.png`, (err, img) => {
            if(err) return 
            if(img){
                node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(img)
            }
        })
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
        return right ? right : '';

    },
    calcArea: function (target) {
        let self = this;
        let targetNode = cc.find(`center/${ self.activeCenter }/grooves/${ target }`, self.node);
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
    judgeDrag: function (x, y, area) {
        return area ? (x < area[0] && x > area[1] && y < area[2] && y > area[3]) : false;
    },
});
