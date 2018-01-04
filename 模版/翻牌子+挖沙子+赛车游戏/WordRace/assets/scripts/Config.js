//log日志开关
window.CONSOLE_LOG_OPEN = true;

//自定义跳转开关
window.OPTION_BLANK = true;

//注册监听home键事件
document.addEventListener('resignActivePauseGame', function () {
    cc.director.pause();
    cc.game.pause();

    console.log('app just resign active.');
});
document.addEventListener('becomeActiveResumeGame', function () {
    if (cc.game.isPaused) {
        cc.game.resume();
    }
    if (cc.director.isPaused) {
        cc.director.resume();
    }
    console.log('app just become active.');
});