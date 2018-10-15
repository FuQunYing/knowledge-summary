## 五、媒体组件
### 1.audio

> 音频， 1.6.0 版本开始，还组件不再维护，建议使用wx.createInnerAudioContext接口

属性名 | 类型 | 默认值 | 说明
- | - | - | - 
id | String | | audio组件的唯一标识符
src | String | | 要播放音频的资源地址
loop | Boolean | false | 是否循环播放
controls | Boolean | false | 是否显示默认控件
poster | String | | 默认控件上的音频封面的图片资源地址，如果controls属性值为false则设置poster无效
name | String | 未知音频 | 默认控件上的音频名字，如果controls属性值为false则设置name无效
author | String | 未知作者 | 默认控件上的作者的名字，如果controls属性值为false则设置author无效
binderror | EventHandle | | 当发生错误时触发error事件，detail={errMsg:MediaError.code}
bindplay | Eventhandle | | 当开始/继续播放时触发play事件
bindpause | EventHandle |  | 当暂停播放时触发pause事件
bindtimeupdate | EventHandle |  | 当播放进度改变时触发timeupdate事件，detail={currentTime,duration}
bindended | EventHandle | | 当播放到末尾时触发ended事件

**MediaError.code**

返回错误码 | 描述
- | -
1 | 获取资源被用户阻止
2 | 网络错误
3 | 解码错误
4 | 不合适资源

```html
<audio poster="{{poster}}" name="{{name}}" author="{{author}}" src="{{src}}" id="myAudio" controls loop></audio>
<button type="primary" bindtap="audioPlay">播放</button>
<button type="primary" bindtap="audioPause">暂停</button>
<button type="primary" bindtap="audio14">设置当前播放时间为14秒</button>
<button type="primary" bindtap="audioStart">回到开头</button>
```
```javascript
Page({
    onReady: function(e) {
        // 使用wx.createAudioConytext获取audio上下文context
        this.audioCtx = wx.createAudioContext('myAudio')
    },
    data: {
        poster : '一个url地址',
        name: '大千世界',
        author: '许嵩',
        src: 'url'
    },
    audioPlay: function() {
        this.audioCtx.play()
    },
    audioPause: function() {
        this.audioCtx.pause()
    },
    audio14: function() {
        this.audioCtx.seek(14)
    },
    audioStart: function() {
        this.audioCtx.seek(0)
    }
})
```