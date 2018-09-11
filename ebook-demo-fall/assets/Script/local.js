
cc.Class({
    extends: cc.Component,

    properties: {
        
    },
    start () {

    },
    saveResult(name,result,type){
        let self = this;
        let saveData;

        switch (type)
        {
            case 'reread':
            saveData = {
                str:result.stringBack || '',               //跟读文本
                score:result.result.overall,               //保存的分数
                audioUrl:result.audioUrl,                  //pc端播放录制音频的url
                tokenId:result.tokenId,                    //ipad端播放录制音频的tokenID
                wavetime:result.result.wavetime,           //录制音频时长
                details:result.result.details,             //返回的每个单词得分
            }
            break;
            case 'choice':
            saveData = result;
            break;
        }
        
        let jsonData = JSON.stringify(saveData)
        // console.log(jsonData)
        self.setItem(name,jsonData)
    },
    setItem(key, value){
        cc.sys.localStorage.setItem(key, value)
    },
    getItem(key){
        return cc.sys.localStorage.getItem(key) || null
    },
    addItem(obj) {
        let self = this
        //如果是数组，就遍历处理
        if(obj.length !== 0 && typeof obj.slice === 'function'){
            obj.map(item => {
                if(typeof item.value === 'number'){
                    self.setStorageNum(item.key, item.value)
                }else if(typeof item.value === 'string'){
                    self.setStorageStr(item.key, item.value)
                }
            })
        }else{
            if(typeof obj.value === 'number'){
                self.setStorageNum(obj.key, obj.value)
            }else if(typeof obj.value === 'string'){
                self.setStorageStr(obj.key, obj.value)
            }
        }
    },
    removeItem(key){
        cc.sys.localStorage.removeItem(key)
    },
    setItemStr(key, value) {
        let _value = cc.sys.localStorage.getItem(key) || '';
        cc.sys.localStorage.setItem(key, _value + ',' + value)
    },
    setItemNum(key, value){
        let _value = cc.sys.localStorage.getItem(key) || 0;
        cc.sys.localStorage.setItem(key, +_value + value)
    },
    clear() {
        //清除所有localStorage
        cc.sys.localStorage.clear()
    }

    // update (dt) {},
});
