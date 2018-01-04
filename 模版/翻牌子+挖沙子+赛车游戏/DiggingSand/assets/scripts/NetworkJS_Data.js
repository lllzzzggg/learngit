var NetworkJS = require("NetworkJS");

cc.Class({
    extends: NetworkJS,

    properties: {
	},

    //解析转换每一条数据
	analysisDict: function (questionDict) {
		var interactiveJson = questionDict.interactiveJson;
		if (!interactiveJson || interactiveJson.length == 0) {
			//容错不录json的情况
			this.gameLoadFailed(2);
			return;
		} else if (typeof interactiveJson == 'string') {
			interactiveJson = JSON.parse(interactiveJson);
		}
		//每一道小题内容
		var question = {
			answerTime: '0',//答题时间
			levelQuestionDetailID: interactiveJson.questionid,//IPS题目（小题） ID
			leveLQuestionDetailNum: "1",//IPS题目（小题）序号
			// qescont: this.removeSpan(questionDict.qescont),//题干
			interactiveJson: interactiveJson,//格外配置json
		};

		return question;
	},
});
