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

		var answerArr = interactiveJson.answerArr;
		var questionArr = interactiveJson.questionArr;
		
		var imgUrlsArr = interactiveJson.image;

		cc.log("imgUrlsArr: "+imgUrlsArr);
		//每一道小题内容
		var question = {
			answerTime: '0',//答题时间
			levelQuestionDetailID: questionDict.questionid,//IPS题目（小题） ID
			leveLQuestionDetailNum: questionDict.orderid,//IPS题目（小题）序号
			qescont: this.removeSpan(questionDict.qescont),//题干
			interactiveJson: interactiveJson,//格外配置json
		};
		return question;
	},
});
