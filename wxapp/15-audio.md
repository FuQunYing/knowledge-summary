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
### 2.image

> 图片

属性名 | 类型 | 默认值 | 说明
- | - | - | -
src | String | | 图片资源地址，支持云文件ID
mode | String | 'ScaleToFill' | 图片裁剪、缩放的模式
lazy-load | Boolean | false | 图片懒加载，只针对page与scroll-view下的image有效
binderror | handleEvent | | 当错误发生时，发布到AppServer的事件名，事件对象event.detail={errMsg:'something wrong'}
bindLoad | HandleEvent | | 当图片载入完毕时，发布到AppServer的事件名，事件对象event.detail={height:'图片高度px'，width:'图片宽度px'}

> 注1：image组件默认宽度300px，高度225px
> 
> 注2：image组件中二维码/小程序图片不支持长按识别。仅在wx.previewImage中支持长按识别

**mode有效值：**

> mode有13种模式，其中4种是缩放模式，9种是裁剪模式

模式 | 值 | 说明
- | - | -
缩放 | scaleToFill | 不保持纵横比缩放图片，使图片的宽高完全拉伸至填满image元素
缩放 | aspectFit | 保持纵横比缩放图片，使图片的长边能完全显示出来，也就是说，可以完全将图片显示出来
缩放 | aspectFill | 保持纵横比缩放图片，只保证图片的短边能完全显示出来，也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取
缩放 | widthFix | 宽度不变，高度自动变化，保持原图宽高比不变
裁剪 | top | 不缩放图片，只显示图片的顶部区域
裁剪 | bottom | 不缩放图片，只显示图片的底部区域
裁剪 | center | 不缩放图片，只显示图片的中间区域
裁剪 | left | 不缩放图片，只显示图片的左边区域
裁剪 | right | 不缩放图片，只显示图片的右边区域
裁剪 | top left | 不缩放图片,只显示图片的左上区域
裁剪 | top right | 不缩放图片，只显示图片的右上边区域
裁剪 | bottom left | 不缩放图片，只显示图片的左下区域
裁剪 | bottom right | 不缩放图片，只显示图片的右下区域

```html
<view class="page">
  <view class="page__hd">
    <text class="page__title">image</text>
    <text class="page__desc">图片</text>
  </view>
  <view class="page__bd">
    <view class="section section_gap" wx:for="{{array}}" wx:for-item="item">
      <view class="section__title">{{item.text}}</view>
      <view class="section__ctn">
        <image style="width: 200px; height: 200px; background-color: #eeeeee;" mode="{{item.mode}}" src="{{src}}"></image>
      </view>
    </view>
  </view>
</view>
```
```javascript
Page({
  data: {
    array: [{
      mode: 'scaleToFill',
      text: 'scaleToFill：不保持纵横比缩放图片，使图片完全适应'
    }, { 
      mode: 'aspectFit',
      text: 'aspectFit：保持纵横比缩放图片，使图片的长边能完全显示出来'
    }, { 
      mode: 'aspectFill',
      text: 'aspectFill：保持纵横比缩放图片，只保证图片的短边能完全显示出来'
    }, { 
      mode: 'top',
      text: 'top：不缩放图片，只显示图片的顶部区域' 
    }, {      
      mode: 'bottom',
      text: 'bottom：不缩放图片，只显示图片的底部区域'
    }, { 
      mode: 'center',
      text: 'center：不缩放图片，只显示图片的中间区域'
    }, { 
      mode: 'left',
      text: 'left：不缩放图片，只显示图片的左边区域'
    }, { 
      mode: 'right',
      text: 'right：不缩放图片，只显示图片的右边边区域'
    }, { 
      mode: 'top left',
      text: 'top left：不缩放图片，只显示图片的左上边区域' 
    }, { 
      mode: 'top right',
      text: 'top right：不缩放图片，只显示图片的右上边区域'
    }, { 
      mode: 'bottom left',
      text: 'bottom left：不缩放图片，只显示图片的左下边区域'
    }, { 
      mode: 'bottom right',
      text: 'bottom right：不缩放图片，只显示图片的右下边区域'
    }],
    src: '../../resources/cat.jpg'
  },
  imageError: function(e) {
    console.log('image3发生error事件，携带值为', e.detail.errMsg)
  }
})
```
