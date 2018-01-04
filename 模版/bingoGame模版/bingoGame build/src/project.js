require=function t(e,i,n){function o(c,a){if(!i[c]){if(!e[c]){var r="function"==typeof require&&require;if(!a&&r)return r(c,!0);if(s)return s(c,!0);var h=new Error("Cannot find module '"+c+"'");throw h.code="MODULE_NOT_FOUND",h}var u=i[c]={exports:{}};e[c][0].call(u.exports,function(t){var i=e[c][1][t];return o(i?i:t)},u,u.exports,t,e,i,n)}return i[c].exports}for(var s="function"==typeof require&&require,c=0;c<n.length;c++)o(n[c]);return o}({BaseGameJS:[function(t,e,i){"use strict";cc._RF.push(e,"0cdcdbQ6MdLT6cxP5fodlmx","BaseGameJS"),cc.Class({"extends":cc.Component,properties:{timeLabel:cc.Label,time_node:cc.Node,question_node:cc.Node,quertionList_node:cc.Node,title_node:cc.Node},onLoad:function(){document.addEventListener("resignActivePauseGame",function(){cc.director.pause(),cc.game.pause(),console.log("app just resign active.")}),document.addEventListener("becomeActiveResumeGame",function(){cc.game.isPaused&&cc.game.resume(),cc.director.isPaused&&cc.director.resume(),console.log("app just become active.")}),this.answerTime=0,this.answerContext="",this.countDown=3,this.nowQuestionID=0,this.questionArr=[],this.answerInfoArr=[],this.questionNumListJS=this.quertionList_node.getComponent("QuestionNumListJS"),this.network=this.node.getComponent("NetworkJS_Data"),this.network.sendXHR(this)},createPaopao:function(){},createAnswerInfo:function(t){var e=this.questionArr[0],i={answerTime:this.answerTime,leveLQuestionDetailNum:e.leveLQuestionDetailNum,levelQuestionDetailID:e.levelQuestionDetailID,answerStatus:t,answerContext:this.answerContext};this.answerInfoArr.push(i),cc.log("answerInfoArr: "+JSON.stringify(this.answerInfoArr))},showFeedback:function(t){},showLossTime:function(){},timeCallbackFunc:function(){var t=function(){this.answerTime+=1,this.scheduleTime+=1;var t=this.countDown-this.answerTime;t<=0?(CONSOLE_LOG_OPEN&&console.log("时间到"),this.isShowFeed=!0,this.answerTime=this.countDown,this.timeLabel.string="00:00",this.createAnswerInfo("2"),this.showFeedback(3),this.answerTime>this.scheduleTime&&this.unschedule(this.timeCallback)):t<10?this.timeLabel.string="00:0"+t:this.timeLabel.string="00:"+t};return t},showSchedule:function(){this.scheduleTime=0,this.schedule(this.timeCallback,1,this.countDown-1)},deleteOption:function(){},createOption:function(t){},selectedOption:function(t){this.nowQuestionID=t,this.startloadOption()},startloadOption:function(){this.isIts&&this.questionNumListJS.changeOptionDisable();this.questionArr[this.nowQuestionID];!this.isIts&&this.showSchedule(),this.isIts&&this.questionNumListJS.changeOptionEnable(),this.isShowFeed=!0},startLoadGame:function(t){this.questionArr=t,this.startloadOption()},selectAnswer:function(t,e){this.isShowFeed||this.isShowLossTime||(e?CONSOLE_LOG_OPEN&&console.log("答对了"):CONSOLE_LOG_OPEN&&console.log("答错了"))},onDestroy:function(){document.removeEventListener("resignActivePauseGame"),document.removeEventListener("becomeActiveResumeGame")},setGameName:function(t){this.title_node.getComponent("TitleJS").init(t)},setPlatform:function(t){this.platform=t,this.isIts="its"==t},resetOption:function(){0!=this.moveOptionTag},changeMoveTag:function(t){return!this.answerOver&&((0===this.moveOptionTag||this.moveOptionTag===t||0===t)&&(this.moveOptionTag=t,!0))}}),cc._RF.pop()},{}],GameJS:[function(t,e,i){"use strict";cc._RF.push(e,"d92c8sRpIBMBKs/RzLIjTLN","GameJS");var n=t("BaseGameJS");cc.Class({"extends":n,properties:{completeAnimBackNode:cc.Node,completeAnimNode:cc.Node,feedbackLightNode:cc.Node,playNode:cc.Node,reviewNode:cc.Node,bingoSound:cc.AudioClip,rightSound:cc.AudioClip,wrongSound:cc.AudioClip,flopSound:cc.AudioClip,cheerSound:cc.AudioClip,backSound:cc.AudioClip},onLoad:function(){this._super(),this.completeAnimBackNode.opacity=0,this.bingoJS=this.node.getComponent("bingoJS"),this.backSound=cc.audioEngine.playMusic(this.backSound,!0),this.current=cc.audioEngine.play(this.bingoSound,!1,1)},deleteOption:function(){},playFunc:function(t){var e=this.questionArr[this.nowQuestionID];this.createOption(e),cc.log("target: "+t.name)},createOption:function(){var t=this.questionArr[0];this.playNode.active=!1,this.completeAnimBackNode.x=-2e3,this.isShowFeed=!0,this.nowQuestionID=0,this.bingoJS.init(this,t,this.question_node,this.nowQuestionID)},startloadOption:function(){cc.log(this.questionArr);var t=this.questionArr[0],e=t.interactiveJson;this.interactiveJson=e,cc.log("startloadOption"),this.isShowFeed=!0,cc.log("startloadOption")},selectAnswer:function(t,e,i){cc.log("ttttt: "+t+"  "+e+"  "+i);var n=this.interactiveJson.answerArr,o=n[this.nowQuestionID],s=o===e;if(cc.log("this.isShowFeed: "+this.isShowFeed),!this.isShowFeed&&!this.isShowLossTime){var c=this;if(this.isShowFeed=!0,s){CONSOLE_LOG_OPEN&&console.log("答对了"),t.getComponent("brickJS").showRightAnimFunc(),this.current=cc.audioEngine.play(this.rightSound,!1,1),this.createAnswerInfo("1"),this.nowQuestionID+=1;var a=this.interactiveJson.answerArr.length;this.network.gameLoadProgress(this.nowQuestionID,a),this.current=cc.audioEngine.play(this.flopSound,!1,1),cc.log("quesLength: "+a),this.scheduleOnce(function(){if(this.nowQuestionID>=a){this.completeAnimBackNode.opacity=255,this.completeAnimBackNode.x=342,cc.log("completeAnim"),this.current=cc.audioEngine.play(this.cheerSound,!1,1);var t=this.completeAnimNode.getComponent(cc.Animation),e=this.feedbackLightNode.getComponent(cc.Animation);e.play("feedBacklight"),t.play("completeFeedback"),this.network.gameOver(this.answerInfoArr)}else this.current=cc.audioEngine.play(this.flopSound,!1,1),c.bingoJS.showAsk(c.nowQuestionID)},1.5)}else CONSOLE_LOG_OPEN&&console.log("答错了"),this.createAnswerInfo("2"),this.current=cc.audioEngine.play(this.wrongSound,!1,1),t.getComponent("brickJS").showWrongAnimFunc()}},resetGame:function(){cc.log("this.reviewNode.opacity: "+this.completeAnimBackNode.opacity),0!==this.completeAnimBackNode.opacity&&(this.completeAnimBackNode.opacity=0,this.playNode.active=!0)}}),cc._RF.pop()},{BaseGameJS:"BaseGameJS"}],LocalSaveJS:[function(t,e,i){"use strict";function n(t){var e="",i=t+"=";if(document.cookie.length>0){var n=document.cookie.indexOf(i);if(n!=-1){n+=i.length;var o=document.cookie.indexOf(";",n);o==-1&&(o=document.cookie.length),e=unescape(document.cookie.substring(n,o))}}return e}function o(t,e,i){var n="";null!=i&&(n=new Date((new Date).getTime()+1e3*i),n="; expires="+n.toGMTString()),n+="; path=/",document.cookie=t+"="+escape(e)+n}cc._RF.push(e,"f4c57nVhA1DEK8uDdBUQDFX","LocalSaveJS"),cc.Class({"extends":cc.Component,properties:{},save:function(t,e){var i=cc.sys.localStorage;i?o(t,e):i.setItem(t,e)},load:function(t){var e=cc.sys.localStorage;return e?n(t):e.getItem(t)}}),cc._RF.pop()},{}],NetworkJS_Data:[function(t,e,i){"use strict";cc._RF.push(e,"8febaBdc6ZNMK6NnHe3UpZb","NetworkJS_Data");var n=t("NetworkJS");cc.Class({"extends":n,properties:{},analysisDict:function(t){var e=t.interactiveJson;if(!e||0==e.length)return void this.gameLoadFailed(2);"string"==typeof e&&(e=JSON.parse(e));var i=(e.answerArr,e.questionArr,e.image);cc.log("imgUrlsArr: "+i);var n={answerTime:"0",levelQuestionDetailID:t.questionid,leveLQuestionDetailNum:t.orderid,qescont:this.removeSpan(t.qescont),interactiveJson:e};return cc.log(n),n}}),cc._RF.pop()},{NetworkJS:"NetworkJS"}],NetworkJS:[function(t,e,i){"use strict";cc._RF.push(e,"cd804MyCfRHi4BLiy+Orkth","NetworkJS");cc.Class({"extends":cc.Component,properties:{},GetQueryString:function(t){var e=new RegExp("(^|&)"+t+"=([^&]*)(&|$)"),i=window.location.search.substr(1).match(e);return null!=i?decodeURI(i[2]):null},sendXHR:function(t){this.racingjs=t;var e=cc.loader.getXMLHttpRequest();this.streamXHREventsToLabel(e,"GET");var i=this.GetQueryString("fileUrl");e.open("GET",i),cc.sys.isNative&&e.setRequestHeader("Accept-Encoding","gzip,deflate"),e.timeout=6e4,e.send()},streamXHREventsToLabel:function(t,e,i){var n=i||function(t){return e+" Response: "+t.substring(0,30)+"..."},o=this;cc.log("streamXHREventsToLabel"),t.onreadystatechange=function(){try{t.readyState===XMLHttpRequest.DONE&&(CONSOLE_LOG_OPEN&&console.log(n(t.responseText)),200===t.status?o.analysisData(t.responseText):(CONSOLE_LOG_OPEN&&console.log("There was a problem with the request."),o.gameLoadFailed(1)))}catch(e){CONSOLE_LOG_OPEN&&console.log("Caught Exception: "+e.description),o.gameLoadFailed(1)}}},analysisData:function(t){var e=JSON.parse(t);if(e||e.length>0){for(var i=[],n=0;n<e.length;++n){var o=this.analysisDict(e[n]);i.push(o)}i&&i.length>0?(this.racingjs.setPlatform(this.GetQueryString("platform")),this.racingjs.setGameName(this.GetQueryString("gameName")),this.racingjs.startLoadGame(i),this.gameLoadSuccess(i.length)):this.gameLoadFailed(2)}else this.gameLoadFailed(2)},analysisDict:function(t){var e=t.interactiveJson;if(!e||0==e.length)return void this.gameLoadFailed(2);"string"==typeof e&&(e=JSON.parse(e));var i={answerTime:"0",levelQuestionDetailID:t.questionid,leveLQuestionDetailNum:t.orderid,qescont:this.removeSpan(t.qescont),interactiveJson:e};return i},removeSpan:function(t){var e=t.replace("<span>","");return e=e.replace("</span>","")},gameLoadFailed:function(t){if(1==t){var e=encodeURI("errcode=10001&errmsg=下载失败");window.location.href="optionBlank://gameLoadFailed?"+e}else{var e=encodeURI("errcode=10002&errmsg=解析失败");window.location.href="optionBlank://gameLoadFailed?"+e}},gameLoadSuccess:function(t){cc.log("gameLoadSuccess");var e=encodeURI("totalNumber="+t);window.location.href="optionBlank://gameLoadSuccess?"+e},gameOver:function(t){var e=encodeURI(JSON.stringify(t));CONSOLE_LOG_OPEN&&console.log("dataJson="+JSON.stringify(t)),window.location.href="optionBlank://gameOver?status=1&data="+e},gameLoadProgress:function(t,e){var i=encodeURI("nowNumber="+t+"&totalNumber="+e);window.location.href="optionBlank://gameLoadProgress?"+i}});cc._RF.pop()},{}],OptionJS:[function(t,e,i){"use strict";cc._RF.push(e,"cec4fBlGJ1Nw5Qzjr1JzrRx","OptionJS"),cc.Class({"extends":cc.Component,properties:{option_node:cc.Node,label:cc.Label},init:function(t,e,i){this.gameJS=t,this.option=e,this.label.string=e.optionContent,this.optionNo=e.optionNo},optionClick:function(){var t=this;t.updateState(!1),this.scheduleOnce(function(){t.gameJS.selectAnswer(t.option)},.2)},updateState:function(t){var e=this.option_node.getComponent(cc.Button);e.interactable=t}}),cc._RF.pop()},{}],PaoPaoJS:[function(t,e,i){"use strict";cc._RF.push(e,"64af7fqo+JH17aITx262Fhi","PaoPaoJS"),cc.Class({"extends":cc.Component,properties:{paopao:cc.Node},onLoad:function(){this.paopao.scale=.7*Math.random()+.3},update:function(t){this.paopao.y+=2,this.paopao.y>=1012&&(this.paopao.scale=.7*Math.random()+.3,this.paopao.y=0)}}),cc._RF.pop()},{}],QuestionNumJS:[function(t,e,i){"use strict";cc._RF.push(e,"511ccnUhPdEV5sMRHkmPNf2","QuestionNumJS"),cc.Class({"extends":cc.Component,properties:{label:cc.Label,selected_node:cc.Node},onLoad:function(){this.isSelect=!1,this.sp=this.node.getComponent("cc.Sprite")},init:function(t,e){this.gameJS=t,this.idx=e;var i=""+(e+1);this.label.string=i,this.selected_node.opacity=0},onClick:function(){this.gameJS.changQustion(this.idx)},setSelected:function(t){this.isSelect=t,this.selected_node.opacity=t?255:0}}),cc._RF.pop()},{}],QuestionNumListJS:[function(t,e,i){"use strict";cc._RF.push(e,"7a656I23ulAK7kDASga7f0X","QuestionNumListJS"),cc.Class({"extends":cc.Component,properties:{lastBtn:cc.Node,nextBtn:cc.Node,quertionNum:cc.Prefab,questionNum_node:cc.Node},onLoad:function(){this.itemPool=new cc.NodePool,this.defaultLen=7,this.targetIdx=0,this.nowQuestionID=0,this.qusetionItemPool=new cc.NodePool,this.qusetionNumJSArr=[],this.selectedQusetionJS=null},init:function(t,e){this.maxlen=t,this.cb=e,t<this.defaultLen?(this.lastBtn.opacity=0,this.nextBtn.opacity=0):(this.lastBtn.opacity=255,this.nextBtn.opacity=255);for(var i=0;i<t;i++){var n=cc.instantiate(this.quertionNum),o=n.getComponent("QuestionNumJS");this.qusetionNumJSArr.push(n),o.init(this,i)}this.changeQustionList(),this.selectedQusetionJS=this.qusetionNumJSArr[this.nowQuestionID].getComponent("QuestionNumJS"),this.selectedQusetionJS.setSelected(!0)},clickLast:function(){this.targetIdx>=this.defaultLen&&(this.targetIdx-=this.defaultLen,this.changeQustionList())},clickNext:function(){this.targetIdx+this.defaultLen<this.maxlen&&(this.targetIdx+=this.defaultLen,this.changeQustionList())},changeQustionList:function(){this.questionNum_node.removeAllChildren();for(var t=this.targetIdx,e=Math.min(this.defaultLen,this.maxlen-t),i=0;i<e;i++){var n=this.qusetionNumJSArr[i+t];this.questionNum_node.addChild(n)}},changQustion:function(t){this.nowQuestionID=t,this.selectedQusetionJS.setSelected(!1),this.selectedQusetionJS=this.qusetionNumJSArr[t].getComponent("QuestionNumJS"),this.selectedQusetionJS.setSelected(!0);var e=this.cb;e&&e(t)},changeOptionEnable:function(){this.questionNum_node.resumeSystemEvents(!0)},changeOptionDisable:function(){this.questionNum_node.pauseSystemEvents(!0)}}),cc._RF.pop()},{}],ShowFeedback:[function(t,e,i){"use strict";cc._RF.push(e,"d71f7iAMRpFbZk1pVUk7ZT9","ShowFeedback"),cc.Class({"extends":cc.Component,properties:{feedback:cc.Node,longxia:cc.Node,gongxini:cc.Node,yaojiayou:cc.Node,shijiandao:cc.Node},showFeedback:function(t){this.longxiaAnim=this.longxia.getComponent(cc.Animation),this.feedback.opacity=255,this.longxia.opacity=255,this.feedback.opacity=0,this.feedback.runAction(cc.sequence(cc.fadeTo(1,255))),1===t?(this.longxiaAnim.play("Feedback_1"),this.gongxini.opacity=255,this.yaojiayou.opacity=0,this.shijiandao.opacity=0):2===t?(this.longxiaAnim.play("Feedback_2"),this.gongxini.opacity=0,this.yaojiayou.opacity=255,this.shijiandao.opacity=0):(this.longxiaAnim.play("Feedback_3"),this.gongxini.opacity=0,this.yaojiayou.opacity=0,this.shijiandao.opacity=255)},animationStop:function(){this.longxiaAnim.stop(),this.feedback.opacity=0,this.longxia.opacity=0}}),cc._RF.pop()},{}],TitleJS:[function(t,e,i){"use strict";cc._RF.push(e,"5b283IiR/BBgLkN+zazJigp","TitleJS"),cc.Class({"extends":cc.Component,properties:{label:cc.Label},init:function(t){this.label.string=t}}),cc._RF.pop()},{}],XingxingJS:[function(t,e,i){"use strict";cc._RF.push(e,"ea220VjaTtGaLQzyud5gsYc","XingxingJS"),cc.Class({"extends":cc.Component,properties:{},onLoad:function(){this.node.scale=Math.random(),this.node.runAction(cc.sequence(cc.spawn(cc.moveBy(.5,cc.p(280*(2*Math.random()-1),280*(2*Math.random()-1))),cc.scaleTo(.5,.5*Math.random()+.5),cc.rotateBy(.5,90*Math.random())),cc.callFunc(function(){this.node.active=!1},this)))}}),cc._RF.pop()},{}],bingoJS:[function(t,e,i){"use strict";cc._RF.push(e,"1fd0eyOq5xJhrmtVVWG1tIl","bingoJS"),cc.Class({"extends":cc.Component,properties:{brick:cc.Prefab,sound:null,picNode:cc.Node,picSprite:cc.Sprite,picSpritePrefab:cc.Prefab,askLabel:cc.Label},onLoad:function(){this.sx=3,this.sy=326,this.brickSize=342,this.firstLoad=!0,this.answers,this.questions,this.sounds;this.updateFlag=!1,this.nextX=this.sx+2*this.brickSize},init:function(t,e,i,n){cc.log(t+"  "+e+"  "+i),this.firstLoad=!0,this.target=t,cc.log("target.isShowFeed: "+this.target.isShowFeed),cc.log(e),this.questNode=i;var o=e.interactiveJson;this.interactiveJson=o;var s=o.introduce;this.introduceUrl=s;var c=JSON.parse(JSON.stringify(o.answerArr));this.answers=this.randomAnswer(c);var a=o.questionArr;this.questions=a;var r=o.soundArr;this.sounds=r,this.nowQuestionNum=n;var h=o.image;this.imgUrlsArr=h;var u,d=c.length;this.firstTex=u;for(var l=0;l<d;l++){var p=cc.instantiate(this.brick);i.addChild(p);var g=parseInt(l%3),m=parseInt(l/3),f=this.sx+this.brickSize*g,S=this.sy-this.brickSize*m,w=c[l];p.name="brick"+l.toString(),p.setPosition(f,S),p.getComponent("brickJS").init(w.toString(),t),p.getComponent("brickJS").ssLabel.enabled=!1}this.showAsk(n)},showAsk:function(t){this.nowQuestionNum=t;var e=this;cc.log("tex: "+e.tex+"   "+e.imgUrlsArr[t]);var i=e.imgUrlsArr[t].toString();cc.loader.load(i,function(t,i){t||(e.firstTex=i,e.firstLoad?(e.picSprite.spriteFrame=new cc.SpriteFrame(i),e.picNode.x=1300,e.movePicNode(e.nowQuestionNum)):(e.picNode.runAction(cc.fadeOut(1)),e.scheduleOnce(function(){e.picSprite.spriteFrame=new cc.SpriteFrame(i),e.movePicNode(e.nowQuestionNum)},1)))})},setString:function(t){cc.log("string: "+t);var e=this.interactiveJson.answerArr,i=e[this.nowQuestionNum];cc.log("answerString: "+i+"  "+e);for(var n=i.length,o=t,s=0;s<n;s++)o+="_";return o},movePicNode:function(t){var e=this;this.firstLoad?(cc.log("firstLoad"),this.picNode.runAction(cc.sequence(cc.moveTo(2,cc.p(-603.3,-13)),cc.callFunc(function(){e.askLabel.string=e.setString(e.questions[t]),e.setString(e.questions[t]),cc.log("self.target.isShowFeed: "+e.target.isShowFeed),e.target.isShowFeed=!1,e.sound=cc.audioEngine.play(cc.url.raw("resources/introduce.mp3"),!1,1),e.showText()}))),this.firstLoad=!1):(cc.log("2 load"),e.picNode.runAction(cc.fadeIn(1)),cc.log("self.target.isShowFeed: "+e.target.isShowFeed),e.target.isShowFeed=!1,e.askLabel.string=e.setString(e.questions[t]),e.wordSoundFunc())},wordSoundFunc:function(){if(!this.target.isShowFeed){cc.log(this.nowQuestionNum+"  "+this.sounds);var t=this.sounds[this.nowQuestionNum];cc.audioEngine.stop(this.sound),this.sound=cc.audioEngine.play(t,!1,1)}},removeSpan:function(t){var e=t.replace("<span>","");return e=e.replace("</span>","")},showText:function(){for(var t=0;t<this.answers.length;t++){var e=this.questNode.getChildByName("brick"+t);e.getComponent("brickJS").showAnimFunc()}},update:function(t){},randomAnswer:function(t){for(var e=0;e<t.length;e++){var i=Math.floor(Math.random()*t.length),n=t[e];t[e]=t[i],t[i]=n}return cc.log("answers: "+t),t}}),cc._RF.pop()},{}],brickJS:[function(t,e,i){"use strict";cc._RF.push(e,"9d022/VbkRAlZdSJbFGy1Qe","brickJS"),cc.Class({"extends":cc.Component,properties:{ssLabel:cc.Label,btn:cc.Button,showAnim:cc.Node,wrongSelect:cc.Node,rightSelect:cc.Node},onLoad:function(){this.textAnim=this.showAnim.getComponent(cc.Animation),this.wrongAnim=this.wrongSelect.getComponent(cc.Animation),this.rightAnim=this.rightSelect.getComponent(cc.Animation)},init:function(t,e){this.target=e,this.ssLabel.string=t.toString(),this.showAnim.opacity=0,this.wrongSelect.opacity=0,this.rightSelect.opacity=0},btnClick:function(){cc.log(this.target.isShowFeed),this.target.selectAnswer(this.node,this.ssLabel.string,this)},hideThis:function(){var t=cc.sequence(cc.scaleTo(.5,0,1),cc.removeSelf());this.node.runAction(t)},showAnimFunc:function(){this.showAnim.opacity=255,this.textAnim.play("showText"),this.scheduleOnce(function(){this.showAnim.opacity=0,this.ssLabel.enabled=!0},.7)},showRightAnimFunc:function(){this.rightSelect.opacity=255,this.node.runAction(cc.sequence(cc.scaleTo(.2,1.06),cc.scaleTo(.2,1))),this.rightAnim.play("rightSelect"),cc.log("this.node.name: "+this.node.name),this.scheduleOnce(function(){this.rightSelect.opacity=0,this.hideThis()},.7)},showWrongAnimFunc:function(){this.wrongSelect.opacity=255,this.wrongAnim.play("wrongSelect"),this.scheduleOnce(function(){this.wrongSelect.opacity=0,this.target.isShowFeed=!1},.7)}}),cc._RF.pop()},{}],config:[function(t,e,i){"use strict";cc._RF.push(e,"cf7e7Hjl8pBApNKVzaPXR0c","config"),window.CONSOLE_LOG_OPEN=!1,cc._RF.pop()},{}],dragOptionJS:[function(t,e,i){"use strict";cc._RF.push(e,"fa5adP1FHZPDLRNaX+1i0Ag","dragOptionJS"),cc.Class({"extends":cc.Component,properties:{option_node:cc.Node,label:cc.Label,canMove:!1},onLoad:function(){this.node.on(cc.Node.EventType.TOUCH_START,this.touch_start.bind(this),this.node),this.node.on(cc.Node.EventType.TOUCH_MOVE,this.touch_move.bind(this),this.node),this.node.on(cc.Node.EventType.TOUCH_END,this.touch_end.bind(this),this.node),this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.touch_cancel.bind(this),this.node)},init:function(t,e,i){this.node.opacity=255,this.gameJS=t,this.option=e,this.label.string=e.optionContent,this.optionNo=e.optionNo},touch_start:function(t){this.canMove=this.gameJS.changeMoveTag(this.node.tag),this.startx=this.node.x,this.starty=this.node.y,this.canMove&&(this.opacity=150)},touch_end:function(t){if(this.canMove){this.node.opacity=255;var e=this.check();e&&this.optionClick(),this.reloadState()}},touch_move:function(t){if(this.canMove){var e=t.touch.getDelta();this.node.x+=e.x,this.node.y+=e.y}},touch_cancel:function(t){this.reloadState()},reloadState:function(){this.node.x=this.startx,this.node.y=this.starty,this.canMove=!1,this.gameJS.changeMoveTag(0)},check:function(){var t=this.questionNode;if(t){var e=this.node,i=t.convertToWorldSpaceAR(cc.p(0,0)),n=this.node.convertToWorldSpaceAR(cc.p(0,0));if(Math.abs(i.x-n.x)<(t.width+e.width)/2&&Math.abs(i.y-n.y)<(t.height+e.height)/2)return!0}return!1},optionClick:function(){this.node.opacity=0;var t=this;t.updateState(!1),this.scheduleOnce(function(){t.gameJS.selectAnswer(t.option)},.2)},updateState:function(t){var e=this.option_node.getComponent(cc.Button);e.interactable=t},setQuestionNode:function(t){this.questionNode=t}}),cc._RF.pop()},{}],picJS:[function(t,e,i){"use strict";cc._RF.push(e,"0d435dlcNlCcLEIUaLTkgJ0","picJS"),cc.Class({"extends":cc.Component,properties:{picSprite:cc.Sprite},onLoad:function(){},initTex:function(t,e){cc.log("pic init"),this.target=e,this.picSprite.spriteFrame=new cc.SpriteFrame(t)},onDestroy:function(){this.sx=3,this.sy=326,this.brickSize=342;var t=parseInt((this.node.x-this.sx+this.brickSize)/this.brickSize),e=parseInt((this.sy-this.node.y+10)/this.brickSize),i=t+3*e,n=this.target.getChildByName("brick"+i.toString());cc.log("b: "+n+" "+n.name),n.getComponent("brickJS").showAnimFunc()}}),cc._RF.pop()},{}]},{},["BaseGameJS","LocalSaveJS","NetworkJS","dragOptionJS","ShowFeedback","OptionJS","PaoPaoJS","QuestionNumListJS","QuestionNumJS","TitleJS","XingxingJS","GameJS","NetworkJS_Data","bingoJS","brickJS","config","picJS"]);