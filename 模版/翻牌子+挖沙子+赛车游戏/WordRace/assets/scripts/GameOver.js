cc.Class({
    extends: cc.Component,

    properties: {
        winBG: cc.Node,
        lostBG: cc.Node,
        winTips: cc.Node,
        lostTips: cc.Node,
        collectLabel: cc.Label,
        missLabel: cc.Label,
        winHeader: cc.Node,
        winRightHand: cc.Node,
        winLeftHand: cc.Node,
        lostHeader: cc.Node,
        animNode: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        var gameDataJs = cc.director.getScene().getChildByName('GameData').getComponent('GameData');
        this.gameDataJs = gameDataJs;
        if (gameDataJs && gameDataJs.isWin) {
            this.winBG.active = true;
            this.lostBG.active = false;
            //赢了的动作
            this.winAnim();
        } else {
            this.winBG.active = false;
            this.lostBG.active = true;
            //输了的动作
            this.lostAnim();
        }
        this.nomalAnim();

        this.collectLabel.string = 'collected:' + gameDataJs.collectNum;
        this.missLabel.string = 'missed:' + gameDataJs.missNum;

        this.gameDataJs.gameOver();
    },

    nomalAnim: function () {
        //共同的动作
        this.animNode.getChildByName('Clock').runAction(cc.spawn(
            cc.sequence(
                cc.rotateTo(0.2, -13),
                cc.rotateTo(0.16, 13),
                cc.rotateTo(0.16, 0),
            ),
            cc.sequence(
                cc.scaleTo(0.16, 1.2),
                cc.scaleTo(0.08, 1),
            ),
        ));
        this.animNode.getChildByName('TimeUp').runAction(
            cc.sequence(
                cc.moveTo(0.2, cc.p(1463, 45)),
                cc.moveTo(0.2, cc.p(1463, -543)),
                cc.moveTo(0.12, cc.p(1463, -537)),
            ),
        );
    },

    winAnim: function () {
        this.winBG.getChildByName('header').runAction(cc.repeatForever(cc.sequence(
            cc.delayTime(2.0),
            cc.moveTo(0.2, cc.p(465, -373)),
            cc.moveTo(0.2, cc.p(465, -360)),
            cc.moveTo(0.2, cc.p(465, -373)),
            cc.moveTo(0.2, cc.p(465, -360)),
        )));
        this.winRightHand.runAction(cc.repeatForever(cc.sequence(
            cc.delayTime(2.0),
            cc.rotateTo(0.2, 24),
            cc.rotateTo(0.2, -1),
            cc.rotateTo(0.2, 24),
            cc.rotateTo(0.2, -1),
        )));
        this.winLeftHand.runAction(cc.repeatForever(cc.sequence(
            cc.delayTime(2.0),
            cc.rotateTo(0.2, -23),
            cc.rotateTo(0.2, 5),
            cc.rotateTo(0.2, -23),
            cc.rotateTo(0.2, 5),
        )));
        this.winHeader.getChildByName('left_ brow').runAction(cc.repeatForever(cc.sequence(
            cc.moveTo(0.36, cc.p(-80, 111)),
            cc.moveTo(0.16, cc.p(-80, 127)),
            cc.moveTo(0.16, cc.p(-80, 111)),
            cc.moveTo(0.16, cc.p(-80, 127)),
            cc.moveTo(0.16, cc.p(-80, 111)),
            cc.delayTime(2.0),
        )));
        this.winHeader.getChildByName('right_ brow').runAction(cc.repeatForever(cc.sequence(
            cc.moveTo(0.36, cc.p(80, 110)),
            cc.moveTo(0.16, cc.p(80, 127)),
            cc.moveTo(0.16, cc.p(80, 110)),
            cc.moveTo(0.16, cc.p(80, 127)),
            cc.moveTo(0.16, cc.p(80, 110)),
            cc.delayTime(2.0),
        )));
        this.winTips.runAction(
            cc.sequence(
                cc.scaleTo(0.44, 0),
                cc.scaleTo(0.24, 1.2),
                cc.scaleTo(0.12, 0.95),
                cc.scaleTo(0.12, 1),
            ),
        );
    },

    lostAnim: function () {
        this.lostHeader.getChildByName('lost_left_brow').runAction(cc.repeatForever(cc.sequence(
            cc.moveTo(0.44, cc.p(-80, 111)),
            cc.moveTo(0.28, cc.p(-80, 127)),
            cc.moveTo(0.28, cc.p(-80, 111)),
            cc.delayTime(2.0),
        )));
        this.lostHeader.getChildByName('lost_right_brow').runAction(cc.repeatForever(cc.sequence(
            cc.moveTo(0.44, cc.p(80, 110)),
            cc.moveTo(0.28, cc.p(80, 127)),
            cc.moveTo(0.28, cc.p(80, 110)),
            cc.delayTime(2.0),
        )));
        this.lostTips.runAction(
            cc.sequence(
                cc.scaleTo(0.44, 0),
                cc.scaleTo(0.24, 1.2),
                cc.scaleTo(0.12, 0.95),
                cc.scaleTo(0.12, 1),
            ),
        );
    },

    playAgain: function () {
        cc.director.loadScene('WordRace');
    },

    review: function () {
        cc.director.loadScene('ShowWord');
    },

    nextGame: function () {
        this.node.pauseSystemEvents(true);

        // this.gameDataJs.gameOver();
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
