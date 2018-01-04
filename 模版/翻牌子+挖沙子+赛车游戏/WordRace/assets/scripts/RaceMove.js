cc.Class({
    extends: cc.Component,

    properties: {
        race: cc.Node,
        canMove: false,
    },

    // use this for initialization
    onLoad: function () {
        this.canMove = true;
        this.nowlane = 'B';
        this.time = 0.25;

        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove.bind(this));

    },

    touchMove: function (event)
    {
        if (this.canMove) {
            this.changeRacePositionForMove(event);
        }
    },
    changeRacePositionForMove: function(event)
    {

        this.canMove = false;
        this.scheduleOnce(function () {
            this.canMove = true;
        }, 0.05);

        var touchPoint = event.getTouches()[0];
        //触点位置判断
        var touchPos = this.node.convertTouchToNodeSpaceAR(touchPoint);
        if (touchPos.y < 0 && touchPos.y > -628) {
            if (Math.abs(touchPos.x) <= 210) {
                this.race.runAction(cc.spawn(
                    cc.moveTo(0.05, cc.p(0, -389)),
                    cc.skewTo(0.05, 0, 0)
                ));
                this.nowlane = 'B';
            } else if (Math.abs(touchPos.x) <= 700) {
                if (touchPos.x > 0) {
                    this.race.runAction(cc.spawn(
                        cc.moveTo(0.05, cc.p(410, -389)),
                        cc.skewTo(0.05, -15, 15)
                    ));
                    this.nowlane = 'C';
                } else {
                    this.race.runAction(cc.spawn(
                        cc.moveTo(0.05, cc.p(-410, -389)),
                        cc.skewTo(0.05, 15, -15)
                    ));
                    this.nowlane = 'A';
                }
            }
        }
    },
    touchEnd: function (event) {
        if (this.canMove) {
            this.changeRacePosition(event);
        }
    },

    changeRacePosition: function (event) {
        this.canMove = false;
        this.scheduleOnce(function () {
            this.canMove = true;
        }, this.time);

        var touchPoint = event.getTouches()[0];
        //触点位置判断
        var touchPos = this.node.convertTouchToNodeSpaceAR(touchPoint);

        if (touchPos.y < 0 && touchPos.y > -628) {
            if (Math.abs(touchPos.x) <= 210) {
                this.race.runAction(cc.spawn(
                    cc.moveTo(this.time, cc.p(0, -389)),
                    cc.skewTo(this.time, 0, 0)
                ));
                this.nowlane = 'B';
            } else if (Math.abs(touchPos.x) <= 700) {
                if (touchPos.x > 0) {
                    this.race.runAction(cc.spawn(
                        cc.moveTo(this.time, cc.p(410, -389)),
                        cc.skewTo(this.time, -15, 15)
                    ));
                    this.nowlane = 'C';
                } else {
                    this.race.runAction(cc.spawn(
                        cc.moveTo(this.time, cc.p(-410, -389)),
                        cc.skewTo(this.time, 15, -15)
                    ));
                    this.nowlane = 'A';
                }
            }
        }
    },

    //当前车道
    getNowLane: function () {
        return this.nowlane;
    },
});
