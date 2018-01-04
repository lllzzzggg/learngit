cc.Class({
    extends: cc.Component,

    properties: {
        wordList: cc.Node,
        optionPref: cc.Prefab,
        label: cc.Label,
        audio: cc.AudioClip,
    },

    preloadGameStartFinish: function()
    {
        // console.log("preloadGameStartFinish");
    },
    // use this for initialization
    onLoad: function () {

        cc.director.preloadScene ("GameStart", this.preloadGameStartFinish);

        this.nowAudio = cc.audioEngine.play(this.audio, false, 1);

        this.lastWord = null;
        this.gameData = cc.director.getScene().getChildByName('GameData').getComponent('GameData');
        var wordList = this.gameData.getWordList();
        for (var index = 0; index < wordList.length; index++) {
            var element = wordList[index];
            var option = cc.instantiate(this.optionPref);
            option.getComponent('WordOption').init(this, element);
            this.wordList.addChild(option);
        }
    },

    selectWord: function (target, wordName, audioUrl) {
        this.label.string = wordName;

        this.playAudio(audioUrl);

        if (this.lastWord) {
            //     this.lastWord.getComponent(cc.Button).interactable = true;
            this.lastWord.setBackgroundSprite('white_line');
        }

        this.lastWord = target;
    },

    playAudio: function (audioUrl) {
        if (this.nowAudio) {
            cc.audioEngine.stop(this.nowAudio);
        }
        var self = this;
        cc.loader.load(audioUrl, function (error, audio) {
            if (!error) {
                self.nowAudio = cc.audioEngine.play(audio, false, 1);
            }
        });
    },

    goBackClick: function () {
        cc.director.loadScene('GameStart');
    },

    startClick: function () {
        cc.director.loadScene('WordRace');
    },

    onDestroy: function () {
        cc.audioEngine.stop(this.nowAudio);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
