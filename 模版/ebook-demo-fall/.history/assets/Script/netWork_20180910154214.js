cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // use this for initialization
    onLoad: function () {
		var fileUrl = this.GetQueryString('fileUrl');
		this.sendXHR();
		//this.loading = cc.find('Canvas/loading');
	},
	
    sendXHR: function () {

		var xhr = cc.loader.getXMLHttpRequest();
		this.streamXHREventsToLabel(xhr, 'GET');

		var fileUrl = this.GetQueryString('fileUrl');
		fileUrl && xhr.open("GET", fileUrl);

		if (cc.sys.isNative) {
			xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
			// xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
		}
		xhr.timeout = 15000;//timeout

		xhr.send();
    },
    streamXHREventsToLabel: function (xhr, method, responseHandler) {
		var self = this;
		xhr.onreadystatechange = function () {
			try {
				if (xhr.readyState === XMLHttpRequest.DONE) {
					if (xhr.status === 200) {
						cc.log("200");
						self.analysisData(xhr.responseText);
					} else {
						// if (CONSOLE_LOG_OPEN) console.log('There was a problem with the request.');
						//下载失败反馈结果
						self.gameLoadFailed(1);
					}
				}
			}
			catch (e) {
				// if (CONSOLE_LOG_OPEN) console.log('Caught Exception: ' + e.description);
				//下载失败反馈结果
				self.gameLoadFailed(1);
			}
		};

		
		var handler = responseHandler || function (response) {
			return method + " Response: " + response.substring(0, 30) + '...';
		};
	},
	GetQueryString: function (name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return decodeURI(r[2]); return null;
    },
    analysisData: function (responseText) {
		var questions = JSON.parse(responseText);
		if (questions || questions.length > 0) {
			this.game = this.node.getComponent('page');
			this.game.initGame(questions);
		} else {
			this.gameLoadFailed(2);
		}
	},
    //下载解析失败type:1.下载失败，2.解析失败
	gameLoadFailed: function (type) {
		// if (!CONSOLE_LOG_OPEN) {
		if (type == 1) {
			cc.log('errcode=10001&errmsg=下载失败');
		} else {
			cc.log('errcode=10002&errmsg=解析失败');
		}
	},

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
