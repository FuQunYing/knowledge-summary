# 微信小程序开发
  微信小程序是啥就不必多说了，微信开发者工具下载安装坑定也都会，注册小程序账号跟注册别的账号没啥区别，但是用的邮箱必须没有在别的微信账号使用过外加一些扫码信息认证，这些都不赘述。直接开始代码。
## 一、小程序的文件结构
小程序包含一个描述整体程序的app和多个描述各自页面的page。
一个程序主体部分由三个文件组成，必须放在项目的根目录下：
文件 | 必填 | 作用
- | - | -
app.js | 是 | 小程序逻辑
app.json | 是 | 小程序公共设置
app.wxss | 否 | 小程序的公共样式表
  一个小程序页面由四个文件组成，分别是：
文件类型 | 必填 | 作用
- | - | -
js | 是 | 页面逻辑
wxml | 是 | 页面结构
wxss | 否 | 页面样式表
json | 否 | 页面配置
  **ps: 为了减少配置项，描述页面的四个文件必须具有相同的路径与文件名**
### 1.app.js
  App()必写，用来注册一个小程序，接受一个Object参数，其指定小程序的生命周期函数等。
#### 1.1 Object参数说明：
属性 | 类型 | 描述 | 触发时机
- | - | - | -
onLaunch | Function | 生命周期函数-监听小程序初始化|当小程序初始化完成时，会触发onLaunch（全局只会触发一次）
onShow | Function | 生命周期函数-监听小程序显示 | 当小程序启动，或从后台进入前台显示，会触发onShow
onHide | Function | 生命周期函数 -监听小程序隐藏 | 当小程序从前台进入后台，会触发onHide
onError | Function | 错误监听函数 | 当小程序发生脚本错误，或者api调用失败时，会触发onError并带上错误信息
onPageNotFound | Function | 页面不存在监听函数 | 当小程序出现要打开的页面不存在的情况，会带上页面信息回调该函数
其它 | Any | | 开发者可以添加任意的函数或者数据到Object参数中，用this访问
  前台、后台定义：当用户点击左上角关闭，或者按了设备home键离开微信，小程序并没有直接销毁，而是进入了后台，当再次进入微信或者再次打开小程序，又会从后台进入前台，需要注意的是，只有当小程序进入后台一定时间，或者系统资源占用过高，小程序才会被真正的销毁，至于关闭的场景，在后面的运行机制细说。
  示例代码：
```javascript
App({
    onLaunch:function(options){
        //启动的时候，要做什么，全局仅触发一次
    },
    onShow:function(options){
        //页面显示的时候要做什么
    }，
    onHide:function(){
        //页面隐藏要做的事
    }，
    onError:function(msg){
        console.log(msg)//有错误自动调用
    },
    globalData:'全局数据'
})
```
#### 1.2 onLaunch、onShow参数：
字段 | 类型 | 说明
- | - | -
path | String | 打开小程序的路径
query | Object | 打开小程序的query
scene | Number | 打开小程序的场景值
shareTicket | String | 获取更多转发信息
referrerInfo | Object | 当场景为由从一个小程序或公众号或App打开时，返回此字段
referrerInfo.appId | String | 来源小程序或公众号或App的appId
referrerInfo.extraData | Object | 来源小程序传过来的数据，scene=1037或者1038时支持
  **以下场景支持返回referrerInfo.appId：**
场景值 | 场景 | appId含义
- | - | -
1020 | 公众号profile页相关小程序列表 | 返回来源公众号appId
1035 | 公众号自定义菜单 | 返回来源公众号的appId
1036 | App分享消息卡片 | 返回来源应用appId
1037 | 小程序打开小程序 | 返回来源小程序的appId
1038 | 从另一小程序返回 | 返回来源小程序的appId
1043 | 公众号模板消息 | 返回来源公众号appId
#### 1.3 onPageNotFound
  当要打开的页面不存在时，会回调这个监听器，并带上以下信息：
字段 | 类型 | 说明
- | - | -
path | String | 不存在页面的路径
query | Object | 打开不存在页面的query
isEntryPage | Boolean | 是否本次启动的首个页面（比如从分享等入口进来，首个页面是开发者配置的分享页面）
  开发者可以在onPageNotFound回调中进行重定向处理，但必须在回调中同步处理，异步处理无效（比如setTimeOut异步执行）
  示例代码：
```javascript
App({
    onPageNotFound(res){
        wx.redirectTo({//如果是tabbar页面，用wx.switchTab
           url:'pages/....'
        })
    }
})
//如果这人没有添加onPageNotFound监听，当跳转页面不存在时，将推入微信客户端原生的页面不存在提示页面；如果onPageNotFound回调中又重定向到另一个不存在的页面，将推入微信客户端原生的页面不存在提示页面，并且不再回调onPageNotFound
```
#### 1.4 getApp()
  全局的getApp()函数可以用来获取到小程序实例：
```javascript
//随便什么js文件
var appInstance = getApp()
console.log(appInstance.globalData)//全局数据
/*
注意：
App()必须在aoo.js中注册，且不能注册多个
不要在定义于App()内的函数中调用getApp()，使用this就可以拿到app实例
不要在onLaunch的时候调用getCurrentPages，此时page还没有生成
通过getApp()获取实例之后，不要私自调用声明周期函数
*/
```

### 2.app.json
  app.json文件用来对微信小程序进行全局配置，决定页面文件的路径、窗口表现，设置网络超时时间，设置多tab等，下面是一个包含所有配置选项的app.json:
```json
{
    "pages":[
        "pages/index/index",
        "pages/logs/index"
    ],
    "window":{
        "navigationBarTitleText":"Demo"
    },
    "tabBar":{
        "list":[{
            "pagePath":"pages/index/index",
            "text":"首页"
        },{
            "pagePath":"pages/logs/logs",
            "text":"日志"
        }]
    },
    "networkTimeout":{
        "request":10000,
        "downloadFile":10000
    },
    "debug":true
}
```
#### 2.1 app.json的配置项列表：
属性 | 类型 | 必填 | 描述
- | - | - | - 
pages | String Array | 是 | 设置页面路径
window | Object | 否 | 设置默认页面的窗口表现
tabBar | Object | 否 | 设置底部tab的表现
networkTimeout | Object | 否 | 设置网络超时时间
debug | Boolean | 否 | 设置是否开启debug模式
##### 2.1.1 pages
  接受一个数组，每一项都是字符串，来指定小程序由哪些页面组成，每一项代表对应页面的[路径+文件名]信息，数组的第一项代表小程序的初始页面，小程序中新增或者减少页面，都需要对pages数组进行修改，文件名不需要写文件后缀，框架会自动去寻找路径下.json .js .wxml .wxss四个文件进行整合。
##### 2.1.2 window
用于设置小程序的状态栏、导航条、标题、窗口背景颜色：
属性 | 类型 | 默认值 | 描述 | 最低版本
- | - | - | - | - 
navigationBarBackgroundColor | HexColor | #000000 | 导航栏背景颜色，比如"#000" | 
navigationBarTextStyle | String | white | 导航栏标题颜色，仅支持black/white | 
navigationBarTitleText | String | | 导航栏标题文字内容 | 
navigationStyle | Style | default | 导航栏样式，仅支持default和custom，custom模式可自定义导航栏，只保留右上角胶囊装的按钮 | 微信版本 6.6.0
backgroundColor | HexColor | #ffffff | 窗口的背景色 | 
backgroundTextStyle | String | dark | 下拉loading的样式，仅支持dark和light | 
backgroundColorTop | String | #ffffff | 顶部窗口的背景色，仅iOS支持 | 微信版本 6.5.16
backgroundColorBottom | String | #ffffff | 底部窗口的背景色，仅iOS支持 | 微信版本 6.5.16
enablePullDownRefresh | Boolean | false | 是否开启下拉刷新 | 
onReachBottomDistance | Number | 50 | 页面上拉触底事件触发时距页面底部的距离，单位为px | 
  比如app.json:
```json
{
    "window":{
        "navigationBarBackgroundColor":"#ffffff",
        "navigationBarTextStyle":"black",
        "navigationBarTitleText":"微信接口功能演示",
        "backgroundColor":"#eee",
        "backgroundTextStyle":"light"
    }
}
```
  然后，页面就长这样：
  ![图片](config.jpg)
##### 2.1.3 tabBar
如果小程序是一个多tab的应用，可以通过tabBar配置项来指定tab栏的表现，以及tab切换时显示的对应页面。
注意：
- 当设置position为top时，将不会显示icon
 - tabBar中的list是一个数组，只能配置最少2个，最多5个tab，tab按数组的顺序排列。

**属性说明**
属性 | 类型 | 必填 | 默认值 | 描述
- | - | - | - | - 
color | HexColor | 是 | | tab上的文字默认颜色
selectedColor | HexColor | 是 |  | tab上的文字选中时的颜色
backgroundColor | HexColor | 是 |  | tab的背景色
borderStyle | String | 否 | black | tabbar上边框的颜色，仅支持black/white
list | Array | 是 |  | tab的列表
position | String | 否 | bottom | 可选值不bottom top

**其中list接受一个数组，数组中的每个项都是一个对象，属性值如下：**
属性 | 类型 | 必填 | 说明
- | - | - | -
pagePath | String | 是 | 页面路径， 必须在pages数组中先定义
text | String | 是 | tab上按钮的名字
iconPath | String | 否 | 图片路径，icon大小限制为40kb，建议尺寸为 81px * 81px，当 postion 为 top 时，此参数无效，不支持网络图片
selectedIconPath | String | 否 | 图片路径，icon大小限制为40kb，建议尺寸为 81px * 81px，当 postion 为 top 时，此参数无效，不支持网络图片
  ![图片](tabbar.png)
##### 2.1.4 networkTimeout
  用来设置各种网络请求的超时时间：
属性 | 类型 | 必填 | 说明
- | - | - | -
request | Number | 否 | wx.request的超时时间，单位毫秒，默认为：60000
connectSocket | Number | 否 | wx.connectSocket的超时时间，单位毫秒，默认为：60000
uploadFile | Number | 否 | wx.uploadFile的超时时间，单位毫秒，默认为：60000
downloadFile | Number | 否 | wx.downloadFile的超时时间，单位毫秒，默认为：60000
##### 2.1.5 debug
  可以在开发者工具中开启 debug 模式，在开发者工具的控制台面板，调试信息以 info 的形式给出，其信息有Page的注册，页面路由，数据更新，事件触发 。 可以帮助开发者快速定位一些常见的问题。
#### 2.2 page.json
  每一个小程序页面也可以使用.json文件来对本页面的窗口表现进行配置。 页面的配置比app.json全局配置简单得多，只是设置 app.json 中的 window 配置项的内容，页面中配置项会覆盖 app.json 的 window 中相同的配置项。

  页面的.json只能设置 window 相关的配置项，以决定本页面的窗口表现，所以无需写 window 这个键，如：
属性 | 类型 | 默认值 | 描述
- | - | - | -
navigationBarBackgroundColor | HexColor | #000000 | 导航栏背景颜色
navigationBarTextStyle | String | white | 导航栏标题颜色，仅支持 black/white
navigationBarTitleText | String |  | 导航栏标题文字内容
backgroundColor | HexColor | #fffffff | 窗口的背景色
backgroundTextStyle | String | dark | 下拉loading的样式，仅支持dark/light
enablePullDownRefresh | Boolean | false | 是否开启下拉刷新
disableScroll | Boolean | false | 设置为true则页面整体不能上下滚动，只在page.json中有效，无法在app.json中设置该项
onReachBottomDistance | Number | 50 | 页面上拉触底时间触发时距页面底部距离，单位为px

### 3.app.wxss
  就是普通网页的css样式一样，wxss和css的特性大部分都一样，也大部分都能用，但是wxss扩展了尺寸单位和样式导入
#### 3.1 尺寸单位
  rpx（responsive pixel）: 可以根据屏幕宽度进行自适应。规定屏幕宽为750rpx。如在 iPhone6 上，屏幕宽度为375px，共有750个物理像素，则750rpx = 375px = 750物理像素，1rpx = 0.5px = 1物理像素。
设备 | rpx换算px（屏幕宽度/750） | px换算rpx（750/屏幕宽度）
- | - | -
iPhone5 | 1rpx=0.42px | 1px=2.34rpx
iPhone6 | 1rpx=0.5px | 1px=2rpx
iPhone6Plus | 1rpx=0.552rpx | 1px=1.81rpx
#### 3.2 样式导入
  使用@import语句可以导入外联样式表，@import后跟需要导入的外联样式表的相对路径，用 ；表示语句结束

  比如：
```css
/*common.wxss*/
.small-p{padding:5px}
```
```css
/*app.wxss*/
@import "common.wxss";
.middle-p{padding:10px}
```
#### 3.3 内联样式
  框架组件上支持使用style ，class属性来控制组件的样式：
  - style：静态的样式统一写到 class 中。style 接收动态的样式，在运行时会进行解析，请尽量避免将静态的样式写进 style 中，以免影响渲染速度。
```html
<view style="color:{{color}};" />
```
  - class：用于指定样式规则，其属性值是样式规则中类选择器名(样式类名)的集合，样式类名不需要带上.，样式类名之间用空格分隔。
```html
<view class="normal_view" />
```
#### 3.4 选择器
选择器 | 示例 | 示例描述
- | - | -
.class | .intro | 选择所有拥有 class="intro" 的组件
\#id | #firstname | 选择拥有 id="firstname" 的组件
element | view | 选择所有的view组件
element, element | view, checkbox | 选择所有文档的 view 组件和所有的 checkbox 组件
::after | view::after | 在 view 组件后边插入内容
::before | view::before | 在 view 组件前边插入内容
#### 3.5 全局样式与局部样式
  定义在 app.wxss 中的样式为全局样式，作用于每一个页面。在 page 的 wxss 文件中定义的样式为局部样式，只作用在对应的页面，并会覆盖 app.wxss 中相同的选择器。


### 4.JS - Page
  Page()函数用来注册一个页面，接受一个Object参数，指定页面的初始数据，生命周期函数，事件处理函数等
  **object参数说明**
属性 | 类型 | 描述
- | - | -
data | Object | 页面的初始数据
onLoad | Function | 生命周期函数--监听页面加载
onReady | Function | 生命周期函数--监听页面初次渲染完成
onShow | Function | 生命周期函数--监听页面显示
onHide | Function | 生命周期函数--监听页面隐藏
onUnload | Function | 生命周期函数--监听页面卸载
onPullDownRefresh | Function | 页面相关事件处理函数--监听用户下拉动作
onReachBottom | Function | 页面上拉触底事件的处理函数
onShareAppMessage | Function | 用户点击右上角转发
onPageScroll | Function | 页面滚动触发事件的处理函数
onTabItemTap | Function | 当前是tab页时，点击tab时触发
其他 | Any | 开发者可以添加任意的函数或数据到Object参数中，在页面的函数中用this可以访问
  ps：object内容在页面加载时会进行一次深拷贝，需要考虑数据大小对页面加载的开销
  实例代码：
```javascript
//index.js
Page({
    data:{
        text:'page data'
    },
    onLoad:function(options){//页面加载的时候做点啥},
    onReady:function(){//页面初次渲染完成做点啥},
    onShow:function(){//页面显示了做点啥},
    onHide:function(){//监听页面隐藏},
    onUnload:function(){//页面关闭要做的事},
    onPullDownRefresh:function(){//页面下拉的时候，代码},
    onReachBottom:function(){//触底的时候，代码},
    onShareAppMessage:function(){//当用户分享的时候，返回用户分享数据},
    onPageScroll:function(){//页面滚动的时候你想干啥},
    onTabItemTap(item){
        console.log(item.index)
        console.log(item.pagePath)
        console.log(item.text)
    },
    //事件处理
    viewTap:function(){
        this.setData({
            text:'更新页面的数据'
        },function(){
            //setData 的回调
        })
    },
    customData:{
        hi:'MINA'
    }
})
```
#### 4.1 初始化数据
  初始化数据将作为页面的第一次渲染，data将会以JSON的形式由逻辑层传到渲染层，所以其数据必须是可以转成JSON的格式：字符串、数字、布尔值、对象、数组。

  渲染层可以通过WXML对数据进行绑定：
```html
<view>{{text}}</view>
<view>{{array[0].msg}}</view>
```
```javascript
Page({
    data:{
        text:'init data',
        array:[{msg:'1'},{msg:'2'}]
    }
})
```
#### 4.2 生命周期函数
  - onLoad: 页面加载。
    - 一个页面只会调用一次，可以在 onLoad 中获取打开当前页面所调用的 query 参数。
  - onShow: 页面显示。
    - 每次打开页面都会调用一次。
  - onReady: 页面初次渲染完成。
    - 一个页面只会调用一次，代表页面已经准备妥当，可以和视图层进行交互。
    - 对界面的设置如wx.setNavigationBarTitle要在onReady之后设置
  - onHide: 页面隐藏。
    - 当navigateTo或底部tab切换时调用。
  - onUnload: 页面卸载。
    - 当redirectTo或navigateBack的时候调用。
#### 4.3 页面相关事件处理函数
  - onPullDownRefresh：下拉刷新
    - 监听用户下拉刷新事件
    - 需要在app.json的window选项中或页面配置中开启enablePullDownRefresh
    - 当处理完数据刷新后，wx.stopPullDownRefresh可以停止当前页面的下拉刷新
  - onReachBottom：上拉触底
    - 监听用户上拉触底事件
    - 可以在app.json的window选项中或页面配置中设置触发距离onReachBottomDistance。
    - 在触发距离内滑动期间，本事件只会被触发一次。
  - onPageScroll：页面滚动
    - 监听用户滑动页面事件
    - 参数为Object，包含以下字段
    字段 | 类型 | 说明
    - | - | -
    scrollTop | Number | 页面在垂直方向已滚动的距离，单位是px
  - onShareAppMessage: 用户转发
    - 只有定义了此事件处理函数，右上角菜单才会显示“转发”按钮
    - 用户点击转发按钮的时候会调用
    - 此事件需要 return 一个 Object，用于自定义转发内容
    **自定义转发字段**
    字段 | 说明 | 默认值
    - | - | -
    title | 转发标题 | 当前小程序名称
    path | 转发路径 | 当前页面path，必须是以/开头的完整路径
#### 4.4 事件处理函数
  除了初始化数据和生命周期函数，Page 中还可以定义一些特殊的函数：事件处理函数。在渲染层可以在组件中加入事件绑定，当达到触发事件时，就会执行 Page 中定义的事件处理函数。

  比如：
```html
<view bindtap='viewTap'>click me</view>
```
```javascript
Page({
    viewTap:function(){
        console.log('bulabula')
    }
})
```
#### 4.5 Page.prototype.route
  基础库1.2.0开始支持，route字段可以获取到当前页面的路径
#### 4.6 Page.prototype.setData()
  setData函数用于将数据从逻辑层发送到视图层，同时改变对应的this.data的值
  setData的参数格式
  字段 | 类型 | 必填 | 描述 | 最低版本
  - | - | - | - |-
  data | Object | 是 | 这次要改变的数据 | 
  callback | Function | 否 | 回调函数 | 1.5.0

  object 以 key，value 的形式表示将 this.data 中的 key 对应的值改变成 value。 callback 是一个回调函数，在这次setData对界面渲染完毕后调用。其中 key 可以非常灵活，以数据路径的形式给出，如 array[2].message，a.b.c.d，并且不需要在 this.data 中预先定义。
  
  注意：
  - 直接修改this.data而不调用this.setData是无法改变页面的状态的，还会造成数据不一致
  - 单次设置的数据不能超过1024KB，尽量避免一次设置过多的数据
  - 不要把data中的任何一项的value设为undefined，否则这一项将不被设置并可能遗留一些潜在问题
    **示例代码**
```html
<view>{{text}}</view>
<button bindtap="changeText"> Change normal data </button>
<view>{{num}}</view>
<button bindtap="changeNum"> Change normal num </button>
<view>{{array[0].text}}</view>
<button bindtap="changeItemInArray"> Change Array data </button>
<view>{{object.text}}</view>
<button bindtap="changeItemInObject"> Change Object data </button>
<view>{{newField.text}}</view>
<button bindtap="addNewField"> Add new data </button>
```
```javascript
Page({
    data:{
        text:'init data',
        num:0,
        array:[{text:'init data'}],
        object:{
            text:'init data'
        }
    },
    changeText:function(){
        //this.data.text='changed data '//这样写是不会生效的
        this.setData({
            text:'changed data'
        })
    },
    changeNum:function(){
        this.data.num=1
        this.setData({
            num:this.data.num
        })
    },
    changeItemInArray:function(){
        //可以用这种方法修改danamic数据路径
        this.setData({
            'array[0].text':'changed data'
        })
    },
    changeItemInObject:function(){
        this.setData({
            'object.text':'changed data'
        })
    },
    addNewField:function(){
        this.setData({
            'newField.text':'new data'
        })
    }
})
```
#### 4.7 生命周期
![图片](mina-lifecycle.png)

### 5.WXML
  WXML是框架设计的一套标签语言，结合基础组件、事件系统，可以构建出页面的结构。
#### 5.1 数据绑定
```html
<view>{{msg}}</view>
```
```javascript
Page({
    data:{
        msg:'数据绑定'
    }
})
```
#### 5.2 列表渲染
```html
<view wx:for='{{arr}}'>{{item}}</view>
```
```javascript
Page({
    data:{
        arr:[1,2,3,4]
    }
})
```
#### 5.3 条件渲染
```html
<view wx:if="{{view=='ANGULAR'}}">Angular</view>
<view wx:elif="{{view=='VUE'}}">Vue</view>
<view wx:else="{{view=='REACT}}">React</view>
```
```javascript
Page({
    data:{
        view:'React'
    }
})
```
#### 5.4 模板
```html
<template name='staffName'>
	<view>
		FirstName:{{firstName}},LastName:{{lastName}}
	</view>
</template>
<template is="staffName" data="{{...staffA}}"></template>
<template is="staffName" data="{{...staffB}}"></template>
<template is="staffName" data="{{...staffC}}"></template>
```
```javascript
Page({
    data:{
        staffA:{firstName:'Sherlock',lastName:'Holmes'},
        staffB:{firstName:'Jhon',lastName:'Watson'},
        staffC:{firstName:'Mike',lastName:'Holmes'}
    }
})
```
#### 5.5 事件
```html
<view bindtap='add'>{{count}}</view>
```
```javascript
Page({
    data:{
        count:1
    },
    add:function(e){
        this.setData({
            count:this.data.count+1
        })
    }
})
```

## 二、逻辑层（App Service）
  小程序开发框架的逻辑层由JavaScript编写。
  逻辑层将数据进行处理后发送给视图层，同时接受视图层的事件反馈。
  在JavaScript的基础上，有一些修改，方便开发小程序：
  - 增加App和Page方法，进行程序和页面的注册
  - 增加getApp和getCurrentPage方法，分别用来获取App实例，和当前页面栈
  - 提供丰富的Api，如微信用户数据，扫一扫，支付等微信特有的能力
  - 每个页面有独立的作用域，并提供模块化能力
  - 由于框架并非运行在浏览器中，所以JavaScript在web中的一些能力无法使用，比如document，window等
  - 开发者写的所有代码最终将会打包成一份JavaScript，并在小程序启动的时候运行，直到小程序销魂，类似ServiceWorker，所以逻辑层也称之为App Service。
### 1. 注册程序
#### 1.1 App()
  App()函数用来注册一个小程序，接受一个Object参数，其指定小程序的生命周期函数等
  **object参数说明**
属性 | 类型 | 描述 | 触发时机
- | - | - | -
onLaunch | Function |生命周期函数 -- 监听小程序初始化 | 当小程序初始化完成时，会触发一次onLaunch，全局只触发一次
onShow | Function | 生命周期函数 -- 监听小程序显示 | 当小程序启动，或从后台进入前台显示，会触发onShow
onHide | Function | 生命周期函数 -- 监听小程序隐藏 | 当小程序从前台进入后台，会触发onHide
onError | Function | 错误监听函数 | 当小程序发生脚本错误，或者api调用失败时，会触发onError并带上错误信息
onPageNotFound | Function | 页面不存在监听函数 | 当小程序出现要打开的页面不存在的情况，会带上页面信息回调该函数
其它 | Any |  | 开发者可以添加任意的函数或者数据到Object参数中，用this可以访问
```txt
  前后台的定义：当用户点击左上角关闭，或者按了设备home键离开微信，小程序并没有直接销毁，而是进入了后台，当再次进入微信或再次打开小程序，又会从后台进入前台，只有当小程序进入后台一定时间，或者系统资源占用过高，才会被真正的销毁。
```
#### 1.2 onLaunch，onShow参数
字段 | 类型 | 说明
- | - | -
path | String | 打开小程序的路径
query | Object | 打开小程序的query
scene | Number | 打开小程序的场景值
shareTicket | String | 获取更多转发信息
referrerInfo | Object | 当场景为由另一个小程序或公众号或App打开时，返回此字段
referrerInfo.appId | String | 来源小程序或公众号或App的appId
referrerInfo.extraData | Object | 来源小程序传过来的数据，scene=10337或1038时支持
  **以下场景值返回referrerInfo.appId**
场景值 | 场景 | appId信息含义
- | - | -
1020 | 公众号profile页相关小程序列表 | 返回来源公众号appId
1035 | 公众号自定义菜单 | 返回来源公众号appId
1036 | App分享消息卡片 | 返回来源应用appId
1037 | 小程序打开小程序 | 返回来源小程序appId
1038 | 从另一个小程序返回 | 返回来源小程序appId
1043 | 公众号模板消息 | 返回来源公众号appId
#### 1.3 onPageNotFound
  当要打开的页面并不存在时，会回调这个监听器，并带上以下信息：
字段 | 类型 | 说明
- | - | -
path | String | 不存在的页面路径
query | Objec |  打开不存在页面的query
isEntryPage|Boolean | 是否是本次启动的首个页面
  开发者可以在onPageNotFound回调中进行重定向处理，但是必须是在回调中同步处理，异步处处理无效：
```javascript
App({
    onPageNotFound(res){
        wx.refdirectedTo}{
            url:'pages/.....'
            //如果是tabbar页面，使用wx.switchTab
        }
    }
})
/*
	如果开发者没有添加onPageNotFound监听，当跳转页面不存在时，将推入微信客户端原生的页面不存在提示页面
	如果onPageNotFound回调中又重定向到另一个不存在的页面，将推入微信客户端原生的页面不存在提示页面，并且不再回调onPageNotFound
*/
```
#### 1.4 getApp()
  全局的getApp()函数可以用来获取到小程序实例：
```javascript
// other.js
var appInstance = getApp()
console.log(appInstance.globalData) // I am global data
```
  **注意：**
  - App()必须在app.js中注册，且不能注册多个
  - 不要在定义于App()内的函数中调用getApp()，使用this就可以拿到app实例
  - 不要在onLaunch的时候调用getCurrentPages(),此时page还没有生成
  - 通用getApp()获取实例之后，不要私自调用生命周期函数

### 2.场景值
  当前支持的场景值
场景值ID | 说明
- | -
1001 | 发现栏小程序主入口
1005 | 顶部搜索框的搜索结果页
1006 | 发现栏小程序入口搜索框的搜索结果页
1007 | 单人聊天会话中的小程序消息卡片
1008 | 群聊会话中的小程序消息卡片
1011 | 扫描二维码
1012 | 长按图片识别二维码
1013 | 手机相册选取二维码
1014 | 小程序模板消息
1017 | 前往体验版的入口页
1019 | 微信钱包
1020 | 公众号profile页相关小程序列表
1022 | 聊天顶部置顶小程序入口
1023 | 安卓系统桌面图标
1024 | 小程序profile页
1025 | 扫描一维码
1026 | 附近小程序列表
1027 | 顶部搜索框搜索结果页“使用过的小程序”列表
1028 | 我的卡包
1029 | 卡券详情页
1030 | 自动化测试下打开小程序
1031 | 长按图片识别一维码
1032 | 手机相册选择一维码
1034 | 微信支付完成页
1035 | 公众号自定义菜单
1036 | App分享消息卡片
1037 | 小程序打开小程序
1038 | 从另一个小程序返回
1039 | 摇电视
1042 | 添加好友搜索框的搜索结果页
1043 | 公众号模板消息
1044 | 带shareTicket的小程序消息卡片
1047 | 扫描小程序码
1048 | 长按图片识别小程序码
1049 | 手机相册选取小程序码
1052 | 卡券的适用门店列表
1053 | 搜一搜的结果页
1054 | 顶部搜索框小程序快捷入口
1056 | 音乐播放器菜单
1057 | 钱包中的银行卡详情
1058 | 公众号文章
1059 | 体验版小程序绑定邀请页
1064 | 微信连WiFi状态栏
1067 | 公众号文章广告
1068 | 附近小程序列表广告
1071 | 钱包中的银行卡列表项
1072 | 二维码收款页面
1073 | 客服消息列表下发的小程序消息卡片
1074 | 公众号会话下发的小程序消息卡片
1078 | 连接WiFi成功页
1089 | 微信聊天主界面下拉
1090 | 长按小程序右上角菜单换出最近使用历史
1092 | 城市服务入口
  可以在App的onLaunch和onShow中获取上述场景值，前面也已经写了一些场景值可以获取来源应用、公众号或小程序的appid。
  **ps:**
  由于Android系统限制，目前还无法获取到按Home键退出到桌面，然后再从桌面再次进入小程序的场景值，对于这种情况，或保留上一次的场景值。

### 3.注册页面
#### 3.1 Page
  page()函数用来注册一个页面，接受一个object参数，其指定页面的初始数据、生命周期函数、事件处理函数等
  **object参数说明**
属性 | 类型 | 描述
- | - | -
data | Object | 页面的初始数据
onLoad | Function | 生命周期函数 -- 监听页面加载
onReady | Function | 生命周期函数 -- 监听页面初次渲染完成
onShow | Function | 生命周期函数 --监听页面显示
onHide | Function | 生命周期函数 -- 监听页面隐藏
onUnload | Function | 生命周期函数 -- 监听页面卸载
onPullDownRefresh | Function | 页面相关事件处理函数--监听用户下拉动作
onReachBottom | Function | 页面上拉触底事件的处理函数
onShareAppMessage | Function | 用户点击右上角转发
onPageScroll | Function | 页面滚动触发事件的处理函数
onTabItemTap | Function | 当前是tab页时，点击tab时触发
其它 | any |  | 开发者可以添加任意的函数或者数据到Object参数中，在页面的函数中用this可以访问
  Object 内容在页面加载时会进行一次深拷贝，需要考虑数据大小对页面加载的开销。
#### 3.2 初始化数据
  初始化数据将作为页面的第一次渲染，data将会以JSON形式由逻辑层传至渲染层，所以其数据必须是可以转成JSON的格式：字符串、数字、布尔值、对象、数组。

  渲染层可以通过WXML对数据进行绑定：

  实例代码，前面写过了，翻回去看。

  卧槽，才意识到，这一节前面都写过了mmp。

### 4.页面路由
  在小程序中所有的路由全部由框架进行管理。
#### 4.1 页面栈
  框架以栈的形式维护了当前的所有页面，当发生路由切换的时候，页面栈的表现如下：
路由方式 | 页面栈表现
- | -
初始化 | 新页面入栈
打开新页面 | 新页面入栈
页面重定向 | 当前页面出栈，新页面入栈
页面返回 | 页面不断出栈，直到目标返回页，新页面入栈
Tab切换 | 页面全部出栈，只留下新的Tab页面
重加载 | 页面全部出栈，只留下新的页面
#### 4.2 getCurrentPages()
  getCurrentPages()函数用于获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面。

  **ps：**
  不要尝试修改页面栈，会导致路由以及页面状态错误
#### 4.3 路由方式
  对于路由的触发方式以及页面生命周期函数如下：
路由方式 | 触发时机 | 路由前页面 | 路由后页面
- | - | - | - 
初始化 | 小程序打开的第一个页面 |  | onLoad，onShow
打开新页面 | 调用 API wx.navigateTo 或使用组件 <navigator open-type="navigateTo"/> | onHide | onLoad，onShow
页面重定向 | 调用 API wx.redirectTo 或使用组件 <navigator open-type="redirectTo"/> | onUnload |  onLoad，onShow
页面返回 | 调用 API wx.navigateBack 或使用组件<navigator open-type="navigateBack">或用户按左上角返回按钮 | onUnload | onShow
Tab切换 | 调用 API wx.switchTab 或使用组件 <navigator open-type="switchTab"/> 或用户切换 Tab |  | 情况参考下表
重启动 | 调用APIwx.reLaunch 或使用组件 <navigator open-type="reLaunch"/> | onUnload| onLoad，onShow
  Tab切换对应的生命周期（以A、B页面为Tabbar页面，C是从A页面打开的页面，D是从C页面打开的页面为例）
当前页面 | 路由后页面 | 触发的生命周期（按顺序）
- | - | -
A | A | 啥也没发生
A | B | A.onHide(),B.onLoad(),B.onShow()
A | B （再次打开） | A.onHide(),B.onShow()
C | A | C.onUnload(),A.onShow()
C | B | C.onUnload(),B.onLoad(),B.onShow()
D | B | D.onUnload(),C.onUnload(),B.onLoad(),B.onShow()
D（从转发进入） | A | D.onUnload(),A.onLoad(),A.onShow()
D（从转发进入） | B | D.onUnload(), B.onLoad(), B.onShow()
  **PS：**
  - navigateTo, redirectTo 只能打开非 tabBar 页面。
  - switchTab 只能打开 tabBar 页面。
  - reLaunch 可以打开任意页面。
  - 页面底部的 tabBar 由页面决定，即只要是定义为 tabBar 的页面，底部都有 tabBar。
  - 调用页面路由带的参数可以在目标页面的onLoad中获取

### 5.模块化
#### 5.1 文件作用域
  在JavaScript文件中声明的变量和函数只在该文件中有效；不同的文件中可以声明相同名字的变量和函数，不会互相影响。
  通过全局函数getApp()可以获取全局的应用实例，如果需要全局的数据可以在App()中设置，如：
```javascript
//app.js
App({
    globalData:1
})
```
```javascript
//a.js
// 本地变量只能在a.js中被使用
var localValue='a';
//得到app实例
var app=getApp()
//拿到全局的data并进行更改
app.globalData++
```
```javascript
//b.js
//可以在b.js中重新定义localValue，不会干扰a.js的localValue
//如果a.js在b.js之前运行，那么这里就会输出2
console.log(getApp().globalData)
```
#### 5.2 模块化
  可以将一些公共的代码抽离成为一个单独的js文件，作为一个模块，模块只有通过module.exports或者exports才能对外暴露接口。
  需要注意：
  - exports是module.exports的一个引用，因此在模块里边随意更改exports的指向会造成未知的错误，所以推荐开发者采用module.exports来暴露模块接口，除非真的非常清晰的知道这两者的关系。
  - 小程序目前不支持直接引入node_moduels，如果需要用到node_modules，那件拷贝出相关的代码到小程序的目录中。
```javascript
//common.js
function sayHello(name) {
  console.log(`hello ${name}`)
}
function sayGoodbye(name){
  console.log(`goodbye ${name}`)
}
module.exports.sayHello=sayHello
exports.sayGoodbye=sayGoodbye
```
  在需要使用这些模块的文件中，使用require(path)将公共代码引入：
```javascript
var common=require('common.js')//require暂时不支持绝对路径
Page({
  helloMINNA:function(){
    common.sayHello('MINNA')
  },
  goodbyeMINNA:function(){
    common.sayGoodbye('MINNA')
  }
  //很像Angular的服务啊
})
```

### 6.API
  小程序开发框架提供丰富的微信原生API，可以方便的调起微信提供的能力，如获取用户信息，本地存储，支付功能等，详细API另起文档。

  通常，小程序API有以下几种类型：
#### 6.1 事件监听API
  约定，以on开头的API用来监听某个事件是否触发：

  比如，wx.onSocketOpen,wx.onCompassChange等。

  这类API接受一个回调函数作为参数，当事件触发时，会调用这个回调函数，并将相关数据以采纳数形式传入。

  代码示例：
  ```javascript
  wx.onCompassChange(function(res){
    console.log(res.direction)
  })
  ```
#### 6.2 同步API
  约定，以Sync结尾的API都是同步API，如wx,setStorgeSync,wx.getSystemInfoSync等，此外也有一些其它的同步API，如wx.createWorker,wx.getBackgroundAudioManager等，详见API文档。
  
  同步API的执行结果，可以通过函数返回值直接获取，如果执行出错，会抛出异常。

  代码示例：
  ```javascript
  try{
    wx.setStorageSync('key','value')
  }catch(e){
    console.error(e)
  }
  ```
#### 6.3 异步API
  大多数API都是异步API，如wx.request，wx.login等，这类API接口通常都能接受一个Object类型的参数，这个参数都支持按需指定以下字段来接收接口调用结果：

  **Object参数说明：**
  参数名 | 类型 | 必填 | 说明
  - | - | - | - 
  success | function | 否 | 接口调用成功的回调函数
  fail | function | 否 | 接口调用失败的回调函数
  complete | function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行）
  其他 | Any | - | 接口定义的其他参数

  **回调函数的参数**

  success、fail、complete函数调用时会传入一个Object类型参数，包含以下字段：
  属性 | 类型 | 说明
  - | - | -
  errMsg | string | 错误信息，如果调用成功返回${apiName}:ok
  errCode | number | 错误码，仅部分API支持，具体含义-详细文档
  其他 | Any | 接口返回的其他数据

  异步API的执行结果需要通过Object类型的参数中传入的对应回调函数获取。部分API也会有返回值，可以用来实现更丰富的功能，如wx.request，wx.connentSockets等
  
  代码示例：
  ```javacript
  wx.login({
    success(res){
      console.log(res.code)
    }
  })
  ```

## 三、视图层View
  框架的视图层由wxml与wxss编写，由组件来进行展示。

  将逻辑层的数据反应成视图，同时将视图层的事件发送给逻辑层。

  wxml（weixin markup language）用于描述页面的结构。

  wxs（weixin script）是小程序的一套脚本语言，结合wxml，可以构建出页面的结构。

  wxss（weixin style sheet）用于描述页面的样式。

  组件（component）是视图的基本组成单位。

### 1.WXML
  WXML是框架设计的一套标签语言，结合基础组件、事件系统，可以构建出页面的结构
#### 1.1 数据绑定
  ```html
  <view>{{message}}</view>
  ```
  ```javascript
  Page({
    data: {
      message: 'Hello minna'
    }
  })
  ```

#### 1.2 列表渲染
##### 1.2.1 wx:for
  在组件上使用wx:for控制属性绑定一个数组，即可使用数组中各项的数据重复渲染该组件。

  默认数组的当前项的下标变量名默认为index，数组当前项的变量名默认为item。
```html
  <view wx:for="{{array}}">{{index}}:{{item.message}}</view>
```
```javascript
  Page({
    data:{
      array:[{
        message: 'foo'
      },
      {
        message: 'bar'
      }
      ]
    }
  })
```
  使用wx:for-item可以指定数组当前元素的变量名。

  使用wx:for-index可以指定数组当前下标的变量名。
```html
<view wx:for="{{array}}" wx:for-index="idx" wx:for-item="itemName">
  {{idx}}: {{itemName.message}}
</view>
```
  wx:for也可以嵌套，比如写一个九九乘法表：
```html
  <view wx:for="{{[1,2,3,4,5,6,7,8,9]}}" wx:for-item="i">
    <view wx:for="{{[1,2,3,4,5,6,7,8,9]}}" wx:for-item="j">
      <view  wx:if="{{i <= j}}">
        {{i}} * {{j}} = {{i * j}}
      </view>
    </view>
  </view>
```
##### 1.2.2 block wx:for
  类似于block wx:if，也可以将wx:for用在\<block/>标签上，以渲染一个包含多个节点的结构块。例如：
```html
  <block wx:for="{{[1, 2, 3]}}">
    <view> {{index}}: </view>
    <view> {{item}} </view>
  </block>
```
##### 1.2.3 wx:key
  如果列表中项目的位置会动态改变或者有新的项目添加到列表中，并且希望列表中的项目保持自己的特征和状态（如\<input/>中的输入内容，\<switch/>的选中状态），需要使用wx:key来制定列表中的项目的唯一的标识符。

  wx:key的值以两种形式提供：

  1.字符串：代表在for循环的array中的item的某个property，该property的值需要是列表中唯一的字符串或数字，且不能动态改变。

  2.保留关键字 \*this代表在for循环中的item本身，这种表示需要item本身是一个唯一的字符串或者数字，如：

    当数据改变触发渲染层重新渲染的时候，会校正带有key的组件，框架会确保他们被重新排序，而不是重新创建，以确保使组件保持自身的状态，并且提高列表渲染时的效率。

  **如不提供wx:key，会报一个warning，如果明确知道该列表是静态的，或者不必关注其顺序，可以选择忽略**

   **示例代码**
```html
<switch   wx:for="{{objectArray}}" wx:key="unique" style="display:block">
{{item.id}}
</switch>
<button bindtap="switch">Switch</button>
<button bindtap="addToFront">Add to the front</button>

<switch wx:for="{{numberArray}}" wx:key="*this" style="display:block">{{item}}</switch>
<button bindtap="addNumberToFront"> add to the front</button>
```
```javascript
Page({
  data: {
    objectArray: [
      {id: 5, unique: 'unique_5'},
      {id: 4, unique: 'unique_4'},
      {id: 3, unique: 'unique_3'},
      {id: 2, unique: 'unique_2'},
      {id: 1, unique: 'unique_1'},
      {id: 0, unique: 'unique_0'},
    ],
    numberArray: [1, 2, 3, 4]
  },
  swtich: function(e) {
    const length = this.data.objectArray.length;
    for (let i = 0; i < length; ++i) {
      const x = Math.floor(Math.random() * length);
      const y = Math.floor(Math.random() * length);
      const temp = this.data.objectArray[x];
      this.data.objectArray[x] = this.data.objectArray[y];
      this.data.objectArray[y] = temp;
    }
    this.setData({
      objectArray: this.data.objectArray
    })
  },
  addToFront: function(e){
    const length = this.data.objectArray.length;
    this.data.objectArray = [{id: length, unique: 'unique_'+length}].concat(this.data.objectArray);
    this.setData({
      objectArray: this.data.objectArray
    })
  },
  addNumberToFront: function(e){
    this.data.numberArray=[this.data.numberArray.length + 1].concat(this.data.numberArray);
    this.setData({
      numberArray: this.data.numberArray
    })
  }
})
```
**注意：**

当wx:for的值为字符串时，会将字符串解析成字符串数组：

```html
<view wx:for="array">{{item}}</view>
```
等同于：
```html
<view wx:for="{{['a','r','r','a','y']}}">
  {{item}}
</view
```
**注意**

如果花括号和引号之间有空格，将最终被解析成为字符串：
```html
<!-- 那不如干脆所有的都不写空格 -->
<view wx:for="{{[1,2,3]}} ">
  {{item}}
</view>
```
等同于：
```html
<view wx:for="{{[1,2,3] + ' '}}" >
  {{item}}
</view>
```

#### 1.3 条件渲染
##### 1.3.1 wx:if
  在框架中，使用wx:if="{{condition}}"来判断是否需要渲染该代码块：
```html
<view wx:if="{{condition}}">True</view>
```
  也可以用wx:elif和wx:else来添加一个else块：
```html
<view wx:if="{{length > 5}}"> 1 </view>
<view wx:elif="{{length > 2}}"> 2 </view>
<view wx:else> 3 </view>
```
##### 1.3.2 block wx:if
  因为wx:if是一个控制属性，需要将它添加到一个标签上，如果要一次性判断多个组件标签，可以使用\<block/>标签将多个组件包装起来，并在上边使用wx:if控制属性：
```html
<block wx:if="{{true}}">
  <view> view1 </view>
  <view> view2 </view>
</block>
```
**注意：**

\<block/>并不是一个组件，它仅仅是一个包装元素，不会在页面中做任何渲染，只接受控制属性（像ng的container？）

**wx:if VS hidden**

  因为wx:if之中的模板也可能包含数据绑定，所以当wx:if的条件值切换时，框架有一个局部渲染的过程，因为它会确保条件块在切换时销毁或重新渲染。

  同时，wx:if也是惰性的，如果初始渲染条件为false，框架什么也不做，在条件第一次变成真的时候能才开始局部渲染。

  相比之下，hidden就简单的多，组件始终会被渲染，只是简单的控制显示与隐藏。

  一般来说，wx:if有更高的切换消耗，而hidden有更高的初始渲染消耗。因此，如果需要频繁切换的场景下，用hidden更好，如果在运行时条件不大可能改变则wx:if较好

#### 1.4 模板
  WXML提供模板（template），可以在模板中定义代码片段，然后在不同的地方调用。
##### 1.4.1 定义模板
  使用name属性，作为模板的名字，然后在\<template/>内定义代码片段，如，
```html
<!--
  index: int
  msg: string
  time: string
-->
<template name="msgItem">
  <view>
    <text> {{index}}: {{msg}} </text>
    <text> Time: {{time}} </text>
  </view>
</template>
``` 
##### 1.4.2 使用模板
  使用is属性，生命需要的使用的模板，然后将模板所需的data传入，如：
```html
<template is="msgItem" data="{{...item}}"/>
```
```javascript
Page({
  data: {
    item: {
      index: 0,
      msg: 'this is a template',
      time: '2016-09-15'
    }
  }
})
```
  is属性可以使用Mustache语法，来动态决定具体需要渲染哪个模板：
```html
<template name="odd">
  <view> odd </view>
</template>
<template name="even">
  <view> even </view>
</template>

<block wx:for="{{[1, 2, 3, 4, 5]}}">
	<template is="{{item % 2 == 0 ? 'even' : 'odd'}}"/>
</block>
```
##### 1.4.3 模板的作用域
  模板拥有自己的作用域，只能使用data传入的数据以及模板定义文件重定义的\<wxs/>模块。

#### 1.5 事件
##### 1.5.1 什么是事件？
- 事件是视图层到逻辑层的通讯方式
- 事件可以将用户的行为反馈到逻辑层进行处理
- 事件可以绑定在组件，当达到触发事件，就会执行逻辑层重对应的事件处理函数
- 事件对象可以携带额外信息，如id，dateset，touches
##### 1.5.2 事件的使用方式
- 在组件中绑定一个事件处理函数。
如bindtap，当用户点击该组件的时候，会在该页面对应的Page中找到相应的事件处理函数。
```html
<view id="tapTest" data-hi="weChat" bindtap="tapname">click me </view>
<!-- wechat就是点击的时候传的参数，data-xxxx就是设置事件传参的，在js里面tapname里面接受 e，就能拿到值 -->
```
- 在相应的Page定义中写上相应的事件处理函数，参数是event：
```javascript
Page({
  tapName: function(event) {
    console.log(event)
  }
})
```
log出来的信息如下：
```json
{
  "type":"tap",
  "timeStamp":895,
  "target": {
    "id": "tapTest",
    "dataset":  {
      "hi":"WeChat"
    }
  },
  "currentTarget":  {
    "id": "tapTest",
    "dataset": {
      "hi":"WeChat"
    }
  },
  "detail": {
    "x":53,
    "y":14
  },
  "touches":[{//但是我点的咋就没有这个，只有changedTouches
    "identifier":0,
    "pageX":53,
    "pageY":14,
    "clientX":53,
    "clientY":14
  }],
  "changedTouches":[{
    "identifier":0,
    "pageX":53,
    "pageY":14,
    "clientX":53,
    "clientY":14
  }]
}
```
##### 1.5.3 事件详解
###### 1.5.3.1 事件分类
事件分为冒泡事件和非冒泡事件：

1.冒泡事件：当一个组件上的事件被触发后，该事件会向父节点传递

2.非冒泡事件：当一个组件上的事件被触发后，该事件不会向父节点传递

**WXML的冒泡事件列表**
类型 | 触发条件 
- | -
touchstart | 手指触摸动作开始
touchmove | 手指触摸后移动
touchcacel | 手指触摸动作被打断，如来电提醒，弹框等
touchend | 手指触摸动作结束
tap | 手指触摸后马上离开
longpress | 手指触摸后，超过350s再离开，如果指定了事件回调函数并触发了这个事件，tap事件将不被触发（1.5.0最低版本）
longtap | 手指触摸后，超过350s再离开（推荐longpress）
transitionend | 会在wxss transition或wx.createAnimation动画结束后触发
animationstart | 会在一个wxss animation动画开始时触发
animationiteration | 会在一个wxss animation一次迭代结束时触发
animationend | 会在一个wxss animation动画完成时触发
touchforcechange | 在支持3DTouch的iPhone设备，重按时会触发

**注意：除上表之外的其他组件，自定义事件如无特殊声明，都是非冒泡事件，如\<form/>的submit事件，\<input/>的input事件，\<scroll-view/>的scroll事件**

###### 1.5.3.2 事件绑定和冒泡
  事件绑定的写法同组件的属性，以key、value的形式。
  - key以bind或catch开头，然后跟上事件的类型，如bindtap、catchtouchstart。自基础库版本1.5.0起，在非原生组件中，bind和catch后可以紧跟一个冒号，其含义不变，如bind:tap、catch:touchstart
  - value是一个字符串，需要在对应的Page中定义同名的函数，不然当触发事件的时候会报错。
  bind事件绑定不会阻止冒泡事件向上冒泡，catch事件绑定可以阻止冒泡事件向上冒泡。
  比如下面的例子，点击inner view会先后调用handleTap3和handleTap2（因为tap事件会冒泡到middle view，而middle view阻止了tap事件继续往外冒泡，不再向父节点传递），点击middle view会触发handleTap2，点击middle view会触发handleTap2，点击outer view会触发handleTap1
```html
<view id="outer" bindtap="handleTap1">
  outer view
  <view id="middle" catchtap="handleTap2">
    middle view
    <view id="inner" bindtap="handleTap3">
      inner view
    </view>
  </view>
</view>
```
###### 1.5.3.3 事件的捕获阶段
  自基础库1.5.0起，触摸类事件支持捕获阶段，捕获阶段位于冒泡阶段之前，且在捕获阶段中，事件到达节点的顺序与冒泡阶段恰好相反。需要在捕获阶段监听事件时，可以采用capture-bind、capture-catch关键字，后者将中断捕获阶段和取消冒泡阶段。
```html
<!-- 点击inner view，会先后调用handleTap2、handleTap4、handleTap1 -->
<view id="outer" bind:touchstart="handleTap1" capture-bind:touchstart="handleTap2">
  outer view
  <view id="inner" bind:touchstart="handleTap3" capture-bind:touchstart="handleTap4">
    inner view
  </view>
</view>

<!-- 如果将上面的代码中的第一个capture-bind改为capture-catch，将只触发handleTap2 -->
<view id="outer" bind:touchstart="handleTap1" capture-catch:touchstart="handleTap2">
  outer view
  <view id="inner" bind:touchstart="handleTap3" capture-bind:touchstart="handleTap4">
    inner view
  </view>
</view>
```
###### 1.5.3.4 事件对象
如无特殊说明，当组件触发事件时，逻辑层绑定该事件的处理函数会收到一个事件对象。<br>

 **BaseEvent基础事件对象属性列表**
属性 | 类型 | 说明
 - | - | -
 type | String | 事件类型
 timeStamp | Integer | 事件生成时的时间戳
 target | Object | 触发事件的组件的一些属性值集合
 currentTarget | Object | 当前组件的一些属性值集合
 **CustomEvent自定义事件对象属性列表（继承BaseEvent）**
 属性 | 类型 | 说明
 - | - | -
 detail | Object | 额外的信息
 **TouchEvent触摸事件对象属性列表（继承BaseEvent）**
 属性 | 类型 | 说明
 - | - | -
 touches | Array | 触摸事件，当前停留在屏幕中的触摸点信息的数组
 changedTouches | Array | 触摸事件，当前变化的触摸点信息的数组
 **特殊事件：\<canvas/>中的触摸事件不可冒泡，所以没有currentTarget。**<br>

 **type：**
 代表事件的类型

 **timeStamp：**
 页面打开 到触发事件所经过的毫秒数

 **target：**
 触发事件的源组件
 属性 | 类型 | 说明
 - | - | -
 id | String | 事件源组件的id
 tagName | String | 当前组件的类型
 dataset | Object | 事件源组件上由data-开头的自定义属性组成的集合
 **currentTarget：**
 事件绑定的当前组件
属性 | 类型 | 说明
 - | - | -
 id | String | 事件源组件的id
 tagName | String | 当前组件的类型
 dataset | Object | 事件源组件上由data-开头的自定义属性组成的集合
 **说明：target和currentTarget可以参考上例中，点击inner view时，handleTap3收到的事件对象target和currentTarget都是inner，而handleTap2收到的事件对象target就是inner，currentTarget就是middle**

**dataset**
  在组件中可以定义数据，这些数据将会通过事件传递给SERVICE，书写方式：以data-开头，多个单词由连字符 - 连接，不能有大写（大写会自动转成小写）如data-element-type，最终在event.currentTarget.dataset中会将连字符转成驼峰elementType。
  比如：
```html
<view data-alpha-beta="1" data-alphaBeta="2" bindtap="bindViewTap">DataSet Test</view>
```
```javascript
Page({
  bindViewTap:function(event){
    event.currentTarget.dataset.alphaBeta === 1 // - 会转为驼峰写法
    event.currentTarget.dataset.alphabeta === 2 // 大写会转为小写
  }
}
```
**touches：**
touches是一个数组，每个元素为一个Touch对象（canvas触摸事件中携带的touches是CanvasTouch数组），表示当前停留在屏幕上的触摸点（所以我那个点击touches为空，因为没有停留的触摸点，点击之后就没了）

**Touche对象**
属性 | 类型 | 说明
- | - | -
identifier | Number | 触摸点的标识符
pageX，pageY | Number | 距离文档左上角的距离，文档的左上角为原点，横向为X轴，纵向为Y轴
clientX，clientY | Number | 距离页面可显示区域（屏幕出去导航条）左上角距离，横向为X轴，纵向为Y轴

**CanvasTouch对象**

属性 | 类型 | 说明
- | - |-
identifier | Number | 触摸点的标识符
x，y | Number | 距离Canvas左上角的距离，Canvas的左上角为原点，横向为X轴，纵向为Y轴

**changedTouches：**
changedTouches 数据格式同 touches。 表示有变化的触摸点，如从无变有（touchstart），位置变化（touchmove），从有变无（touchend、touchcancel）。

**detail：**
自定义事件所携带的数据，如表单组件的提交事件会携带用户的输入，媒体的错误事件会携带错误信息。点击事件的detail带有的x，y同pageX，pageY代表距离文档左上角的距离。


#### 1.6 引用
  WXML提供两种文件引用方式import和include
##### 1.6.1 import
  import可以在该文件中使用目标文件定义的template。如：

  在item.wxml中定义了一个叫item的template：
```html
  <!-- index.wxml -->
  <template name="item">
    <text>{{text}}</text>
  </template>
```
  在index.wxml中引入了item.wxml，就可以使用item模板：
```html
<import src="item.wxml">
<template is="item" data="{{text:'forbar'}}"></template>
```
##### 1.6.2 import 的作用域
  import有作用域概念，即只会import目标文件中定义的template，而不会import目标文件import的template。

  **比如：C import B，B import A，在C中可以使用B定义的template，在B中可以使用A定义的template，但是C不能使用A定义的template**

  ```html
  <!-- A.wxml -->
<template name="A">
  <text> A template </text>
</template>
<!-- B.wxml -->
<import src="a.wxml"/>
<template name="B">
  <text> B template </text>
</template>
<!-- C.wxml -->
<import src="b.wxml"/>
<template is="A"/>  <!-- Error! Can not use tempalte when not import A. -->
<template is="B"/>
  ```

##### 1.6.3 include
  include可以将目标文件除了\<template/> \<wxs/> 外的整个代码引入，相当于是拷贝到include位置，如：
```html
<!-- index.wxml -->
<include src="header.wxml"/>
<view> body </view>
<include src="footer.wxml"/>
<!-- header.wxml -->
<view> header </view>
<!-- footer.wxml -->
<view> footer </view>
```

### 2.WXSS
  WXSS（weixin style sheet）是一套样式语言，用于描述WXML的组件样式。

  WXSS用来决定WXML的组件应该怎么显示。

  与CSS相比，WXSS扩展的特性有：
  - 尺寸单位
  - 样式导入
#### 2.1 尺寸单位
  - rpx（responsive pixel）: 可以根据屏幕宽度进行自适应。规定屏幕宽为750rpx。如在 iPhone6 上，屏幕宽度为375px，共有750个物理像素，则750rpx = 375px = 750物理像素，1rpx = 0.5px = 1物理像素。
  设备 | rpx换算成pc（屏幕宽度/750） | px换算成rpx（750/屏幕宽度）
  - | - | -
  iPhone5 | 1rpx=0.42px | 1px=2.34rpx
  iPhone6 | 1rpx=0.5px | 1px=2rpx
  iPhone6 Plus | 1rpx=0.552px | 1px=1.81rpx

  **建议：**
  开发微信小程序时设计师可以用iPhone6作为视觉稿的标准

  **注意：**
  在较小的屏幕上不可避免会有一些毛刺，开发时要尽量避免。
##### 2.2 样式导入
  使用@import语句可以导入外联样式表，@import后跟需要导入的外联样式表的路径，用；表示语句的结束。
  **示例代码**
```css
/** common.wxss **/
.small-p {
  padding:5px;
}
/** app.wxss **/
@import "common.wxss";
.middle-p {
  padding:15px;
}
```

##### 2.3 内联样式
  框架组件上支持使用style、class属性来控制组件的样式
  - style：静态的样式统一写到class中，style接收动态的样式，在运行时会进行解析，尽量避免将静态的样式写进style中，以免影响渲染速度。
```html
<view style="color: {{color}}">
```
  - class：用于指定样式规则，其属性值是样式规则中类选择器名（样式类名）的集合，样式类名不需要带上 . ，样式类名之间用空格分离。
```html
<view class="normal_view">
```
##### 2.4 选择器
  目前支持的选择器有：
  选择器 | 样例 | 样例描述
  - | - | -
  .class | .intro | 选择所有拥有class="intro"的组件
  \#id | #firstname | 选择拥有 id="firstname" 的组件
  element | view | 选择所有view组件
  element, element |	view, checkbox |	选择所有文档的 view 组件和所有的 checkbox 组件
  ::after | 	view::after |	在 view 组件后边插入内容
  ::before |	view::before |	在 view 组件前边插入内容

##### 2.5 全局样式与局部样式
  定义在 app.wxss 中的样式为全局样式，作用于每一个页面。在 page 的 wxss 文件中定义的样式为局部样式，只作用在对应的页面，并会覆盖 app.wxss 中相同的选择器。

### 3.基础组件（详细文档--再说）
  组件：
  - 组件是视图层的基本组成单元
  - 组件自带一些功能与微信风格一致的样式
  - 一个组件通常包括 开始标签 和 结束标签，属性用来修饰这个组件，内容在两个标签之内
```html
<tagname property="value">内容内容内容</tagname>
```
**注意：所有组件与属性都是小写，以连字符-连接**

#### 3.1 属性类型
类型 | 描述 | 注解
- | - | -
Boolean | 布尔值 | 组件上写该属性，不管是什么值都被当做true，只有组件上没有该属性时，属性值才为false。如果属性值为变量，变量的值会被转换为Boolean类型
Number | 数字 | 1，2.5
String | 字符串 | "string"
Array | 数组 | [1,"string"]
Object | 对象 | {key: value}
EventHandler |	事件处理函数名 |	"handlerName" 是 Page 中定义的事件处理函数名
Any | 任意属性

#### 3.2 公共属性
  所有组件都有以下属性：
属性名 | 类型 | 描述 | 注解
- | - | - | -
id | String | 组价的唯一标识 | 保持整个页面唯一
class | String | 组件的样式类 | 在对应的WXSS中定义的样式类
style | String | 组件的内联样式 | 可以动态设置的内联样式
hidden |	Boolean |	组件是否显示 |	所有组件默认显示
data-* |	Any |	自定义属性 |	组件上触发的事件时，会发送给事件处理函数
bind* / catch* |	EventHandler |	组件的事件 |	详见事件

#### 3.3 特殊属性
  几乎所有组件都有各自定义的属性，可以对该组件的功能或样式进行修饰。

### 4.WXS
  WXS（weixin script）是小程序的一套脚本语言，结合WXML，可以构建出页面的结构。
**注意：**
- wxs不依赖于运行时的基础库版本，可以在所有版本的小程序中运行
- wxs与JavaScript是不同的语言，有自己的语法，和JavaScript不一致！！！
- wxs的运行环境和其它JavaScript代码是隔离的，wxs中不能调用其它JavaScript文件中定义的函数，也不能调用小程序提供的API
- wxs函数不能作为组件的事件回调
- 由于运行环境的差异，在IOS设备上小程序内的wxs会比JavaScript代码快2-20倍，在Android设备上二者运行效率无差异。

一些的简单的wxs示例：
**页面渲染**
```html
<!--wxml-->
<wxs module="m1">
var msg = "hello world";

module.exports.message = msg;
</wxs>

<view> {{m1.message}} </view>
<!-- 输出hello world -->
```
**数据处理**
```javascript
// page.js
Page({
  data: {
    array: [1, 2, 3, 4, 5, 1, 2, 3, 4]
  }
})
```
```html
<!-- wxml -->
<!-- 下面的getMax函数，接受一个数组，且返回数组中最大的元素的值 -->
<wxs module="m1">
var getMax=function(array) {
  var max = undefined;
  for (var i = 0; i < array.length; ++i) {
    max = max === undefined ? array[i] : (max >= array[i] ? max : array[i])
  }
  return max
}
module.exports.getMax=getMax;
</wxs>
<!-- 调用wxs里面的getMax函数，参数为page.js里面的array -->
<view> {{m1.getMax(array)}}</view>
<!-- 页面最终显示 5-->
```
#### 4.1 模块
  WXS代码可以编写在wxml文件中的<wxs>标签内，或以.wxs为后缀名的文件内。
##### 4.1.1 模块
  每一个.wxs文件和\<wxs>标签都是一个单独的模块。每个模块都有自己独立的作用域。即在一个模块里面定义的变量与函数，默认为私有的，对其它模块不可见。

  一个模块要想对外暴露其内部的私有变量与函数，只能通过module.exports实现。
##### 4.1.2 .wxs文件
  在微信开发者工具里面，右键可以直接创建.wxs文件，在其中直接编写WXS脚本。

  **示例代码：**
```javascript
// /pages/comm.wxs
var foo="'hello world' from comm.wxs";
var bar=function(d){
  return d;
}
module.exports={
  foo: foo,
  bar: bar
}
//在 /pages/comm.wxs 的文件里面编写了 WXS 代码。该 .wxs 文件可以被其他的 .wxs 文件 或 WXML 中的 <wxs> 标签引用。
```
##### 4.1.3 module对象
  每个wxs模块均有一个内置的module对象。

**属性：**
exports：通过该属性，可以对外共享本模块的私有变量与函数。
```javascript
// /pages/tools.wxs
var foo = "'hello world' from tools.wxs";
var bar = function (d) {
  return d;
}
module.exports = {
  FOO: foo,
  bar: bar,
};
module.exports.msg = "some msg";
```
```html
<!-- page/index/index.wxml -->
<wxs src="./../tools.wxs" module="tools" />
<view> {{tools.msg}} </view>
<view> {{tools.bar(tools.FOO)}} </view>
<!-- 页面输出 some msg 和 'hello world' from tools.wxs -->
```

**require函数：**
  在.wxs模块中引用其他 wxs 文件模块，可以使用 require 函数。

  引用的时候，要注意如下几点：
  - 只能引用.wxs文件模块，且必须使用相对路径
  - wxs模块均为单例，wxs模块在第一次被引用时，会自动初始化为单例对象，多个页面、多个地方，多次引用，使用的都是同一个wxs模块对象。
  - 如果一个wxs模块在定义之后，一直没有被引用，则该模块不会被解析与运行。
```javascript
// /pages/tools.wxs
var foo = "'hello world' from tools.wxs";
var bar = function (d) {
  return d;
}
module.exports = {
  FOO: foo,
  bar: bar,
};
module.exports.msg = "some msg";

// /pages/logic.wxs
var tools = require("./tools.wxs");

console.log(tools.FOO);
console.log(tools.bar("logic.wxs"));
console.log(tools.msg);
```
```html
<!-- /page/index/index.wxml -->
<wxs src="./../logic.wxs" module="logic" />
<!-- 控制台输出：
'hello world' from tools.wxs
logic.wxs
some msg -->
```
##### 4.1.4 \<wxs>标签
属性名 | 类型 | 默认值 | 说明
- | - | - | -
module | String |  | 当前\<wxs>标签的模块名，必填字段
src | String | | 引用.wxs文件的相对路径，仅当本标签为单闭合标签或标签的内容为空时有效

##### 4.1.5 module属性
  module属性是当前\<wxs>标签的模块名，在单个wxml文件内，建议其值唯一，有重复模块名则按照先后顺序覆盖（后者覆盖前者）。不同文件之间的wxs模块名不会相互覆盖。

  module属性值的命名必须符合下面两个规则：
  - 首字符必须是：字母（a-zA-Z），下划线（_）
  - 剩余字符可以是：字母（a-zA-Z），下划线（_）， 数字（0-9）
```html
<!-- wxml -->
<wxs module="foo">
  var some_msg="hello world"
  module.exports={msg:some_msg}
</wxs>
<view>{{foo.msg}}</view>
<!-- 声明了一个名字为 foo 的模块，将 some_msg 变量暴露出来，供当前页面使用。 -->
<!-- 页面输出 hello world -->
```
##### 4.1.6 src属性
  src属性可以用来引用其它的wxs文件模块。
  引用的时候，要注意：
  - 只能引用.wxs文件模块，且必须使用相对路径
  - wxs模块均为单例，wxs模块在第一次被引用时，会自动初始化为单例对象，多个页面、多个地方，多次引用，使用的都是同一个wxs模块对象。
  - 如果一个wxs模块在定义之后，一直没有被引用，则该模块不会被解析与运行。
```javascript
// /pages/index/index.js
Page({
  data: {
    msg: "'hello wrold' from js",
  }
})
```
```html
<!-- /pages/index/index.wxml -->

<wxs src="./../comm.wxs" module="some_comms"></wxs>
<!-- 也可以直接使用单标签闭合的写法
<wxs src="./../comm.wxs" module="some_comms" />
-->

<!-- 调用 some_comms 模块里面的 bar 函数，且参数为 some_comms 模块里面的 foo -->
<view> {{some_comms.bar(some_comms.foo)}} </view>
<!-- 调用 some_comms 模块里面的 bar 函数，且参数为 page/index/index.js 里面的 msg -->
<view> {{some_comms.bar(msg)}} </view>

<!-- 页面输出：
'hello world' from comm.wxs
'hello wrold' from js -->

<!-- 在文件 /page/index/index.wxml 中通过 <wxs> 标签引用了 /page/comm.wxs 模块。 -->
```

**注意：**
- \<wxs> 模块只能在定义模块的 WXML 文件中被访问到。使用 \<include> 或 \<import> 时，\<wxs> 模块不会被引入到对应的 WXML 文件中。
- \<template> 标签中，只能使用定义该 \<template> 的 WXML 文件中定义的 \<wxs> 模块
#### 4.2 变量
##### 4.2.1 概念
  - WXS中的变量均为值的引用
  - 没有声明的变量直接赋值使用，会被定义为全局变量
  - 如果只声明变量而不赋值，则默认值为undefined
  - var 表现与JavaScript一致，会有变量提升
```javascript
var foo = 1;
var bar = "hello world";
var i; // i === undefined
//这里，分别声明了 foo、 bar、 i 三个变量。然后，foo 赋值为数值 1 ，bar 赋值为字符串 "hello world"
```
##### 4.2.2 变量名
  变量名必须符合下面两个规则：
  - 首字符必须是：字母（a-zA-Z），下划线（_）
  - 剩余字符可以是：字母（a-zA-Z），下划线（_）， 数字（0-9）
##### 4.2.3 保留标识符
  以下标识符不能作为变量名：
```txt
delete 、void 、typeof

null 、undefined 、NaN 、Infinity 、var

if 、else 

true 、false

require

this 、function 、arguments、return

for、while、do、break、continue、switch、case、default
```
#### 4.3 注释
  WXS主要有3种注释方法：
```html
<!-- wxml -->
<wxs module="sample">
// 方法一：单行注释
/*
方法二：多行注释
*/
/*
方法三：结尾注释。即从 /* 开始往后的所有 WXS 代码均被注释
var a = 1;
var b = 2;
var c = "fake";
</wxs>
<!-- 上述例子中，所有 WXS 代码均被注释掉了。
方法三 和 方法二 的唯一区别是，没有 */ 结束符。 -->
```
#### 4.4 运算符
##### 4.4.1 基本运算符
  加减乘除和取余，和JS的没区别
##### 4.4.2 一元运算符：
```javascript
var a = 10, b = 20;
// 自增运算
console.log(10 === a++);
console.log(12 === ++a);
// 自减运算
console.log(12 === a--);
console.log(10 === --a);
// 正值运算
console.log(10 === +a);
// 负值运算
console.log(0-10 === -a);
// 否运算
console.log(-11 === ~a);
// 取反运算
console.log(false === !a);
// delete 运算
console.log(true === delete a.fake);
// void 运算
console.log(undefined === void a);
// typeof 运算
console.log("number" === typeof a);
```
##### 4.4.3 位运算符
```javascript
var a = 10, b = 20;
// 左移运算
console.log(80 === (a << 3));
// 无符号右移运算
console.log(2 === (a >> 2));
// 带符号右移运算
console.log(2 === (a >>> 2));
// 与运算
console.log(2 === (a & 3));
// 异或运算
console.log(9 === (a ^ 3));
// 或运算
console.log(11 === (a | 3));
```
##### 4.4.4 比较运算符
  大于、小于、大于等于、小于等于
##### 4.4.5 等值运算符
 ==和！=和===和！==
##### 4.4.6 赋值运算符
*=、/=、+=、-=、%=、<<=、>>=、>>>=、&=、^=、|=
##### 4.4.7 二元逻辑运算符
或 || 、与 &&
##### 4.4.8 其它运算符
```javascript
var a = 10, b = 20;

//条件运算符-三目
console.log(20 === (a >= 10 ? a + 10 : b + 10));
//逗号运算符？？？？
console.log(20 === (a, b));
```
##### 4.4.9 运算符优先级
优先级 | 运算符 | 说明 | 结合性
- | - | - | -
20 | （xxxx） | 括号 | n/a
19 | xx . xx  | 成员访问 | 从左到右
  | xx [xx]  | 成员访问 | 从左到右
  | xx ( xx ) | 函数调用 | 从左到右
17 |	... ++	/  ... --| 后置递增/递减	| n/a
16 |	! .../~ .../+ .../- .../++ .../-- .../typeof .../void ...	/delete ... |	逻辑非/按位非/一元加法/一元减法/前置递增/前置递减/typeof/void/delete |	从右到左
14	| ... * ... /... / ... /... % ...		|	乘法/除法/取模	 | 从左到右
13	|.. + ... /... - ...|	加法 /减法|	从左到右
12	|... << .../... >> .../... >>> ...	|按位左移/按位右移/无符号右移	|从左到右
11 |	... < .../... <= .../... > ... /... >= ...|	小于/小于等于/大于/大于等于	|从左到右
10	| ... == .../... != ...	/... === .../... !== ...		 |等号/非等号/全等号/非全等号	| 从左到右
9	|... & ... |	按位与	|从左到右
8	|... ^ ... |	按位异或 |	从左到右
7	|... ｜ ...	|按位或	|从左到右
6	|... && ...	|逻辑与	|从左到右
5	|... ｜｜ ...|	逻辑或	|从左到右
4	|... ? ... : ...	|条件运算符	|从右到左
3	 |... = ...	不列出了，看上面 |赋值	|从 右到左
0 |	... , ... |	逗号|	从左到右
#### 4.5 语句
##### 4.5.1 if语句
  在wxs中，可以使用以下格式的if语句
  - if (expression) statement ： 当 expression 为 truthy 时，执行 statement。
  - if (expression) statement1 else statement2 : 当 expression 为 truthy 时，执行 statement1。 否则，执行 statement2
  - if ... else if ... else statementN 通过该句型，可以在 statement1 ~ statementN 之间选其中一个执行。
```javascript
// if ...

// if ... else 

// if ... else if ... else ...

//和JS都一样啦
```
##### 4.5.2 switch语句
 和JS一样
 - default分支可以省略不写
 - case 关键词后面只能使用：变量，数字，字符串
##### 4.5.3 for 语句
  和JS一样，普通的for循环
##### 4.5.4 while语句
```javascript
while (表达式)
  语句;
while (表达式){
  代码块;
}
do {
  代码块;
} while (表达式)
//和JS一样，但是挺久没用了，复习一下
//当表达式为true时，循环执行语句或代码块
//支持使用break，continue关键词
```
#### 4.6 数据类型
  WXS有八种数据类型：
  - number ： 数值
  - string ：字符串
  - boolean：布尔值
  - object：对象
  - function：函数
  - array : 数组
  - date：日期
  - regexp：正则
##### 4.6.1 number
  number包括两种数值：整数、小数
  属性 constructor：返回字符串'number'
  方法（使用可参考ES5标准）：
  - toString
  - toLocaleString
  - valueOf
  - toFixed
  - toExponential
  - toPrecision
##### 4.6.2 string
  两种写法：单引号或者双引号

  属性：constructor返回字符串'String'；length

  方法：ES5的方法随便用啊
##### 4.6.3 boolean
  只有true和false

  constructor返回字符串'Boolean'
  
  方法：toString、valueOf
##### 4.6.4 Object
  参考JavaScript
  
  constructor返回字符串'Object'

  toString返回'[object Object]'

##### 4.6.5 function
  参考JavaScript

  arguments关键词支持的属性：
  - length，参数个数
  - [index] 通过index下标可以遍历传递给函数的每个参数
  constructor返回‘'Function';length返回形参个数
  toString返回'[object Object]'
##### 4.6.6 array
  参考JS
##### 4.6.7 date
  生成date对象需要使用getDate函数，返回一个当前时间的对象。
```javascript
getDate()
getDate(milliseconds)
getDate(datestring)
getDate(year, month[, date[, hours[, minutes[, seconds[, milliseconds]]]]])
//不能new Date了
```
  参数
  - milliseconds: 从1970年1月1日00:00:00 UTC开始计算的毫秒数
  - datestring: 日期字符串，其格式为："month day, year hours:minutes:seconds"
```javascript
var date = getDate(); //返回当前时间对象

date = getDate(1500000000000);
// Fri Jul 14 2017 10:40:00 GMT+0800 (中国标准时间)
date = getDate('2017-7-14');
// Fri Jul 14 2017 00:00:00 GMT+0800 (中国标准时间)
date = getDate(2017, 6, 14, 10, 40, 0, 0);
// Fri Jul 14 2017 10:40:00 GMT+0800 (中国标准时间)
```
##### 4.6.8 regexp
  生成regexp对象需要使用getRegExp函数。
```javascript
getRegExp(pattern[, flags])
```
  参数：
  - pattern: 正则表达式的内容。
  - flags：修饰符。该字段只能包含以下字符:
    - g: global
    - i: ignoreCase
    - m: multiline。
```javascript
var a = getRegExp("x", "img");
console.log("x" === a.source);
console.log(true === a.global);
console.log(true === a.ignoreCase);
console.log(true === a.multiline);
```
  方法：exec、test、toString
##### 4.6.9 数据类型判断
  constructor属性用来判断数据类型
```javascript
var number = 10;
console.log( "Number" === number.constructor );
var string = "str";
console.log( "String" === string.constructor );
var boolean = true;
console.log( "Boolean" === boolean.constructor );
var object = {};
console.log( "Object" === object.constructor );
var func = function(){};
console.log( "Function" === func.constructor );
var array = [];
console.log( "Array" === array.constructor );
var date = getDate();
console.log( "Date" === date.constructor );
var regexp = getRegExp();
console.log( "RegExp" === regexp.constructor );
```
  typeof也可以区分部分数据类型：
```javascript
var number = 10;
var boolean = true;
var object = {};
var func = function(){};
var array = [];
var date = getDate();
var regexp = getRegExp();
console.log( 'number' === typeof number );
console.log( 'boolean' === typeof boolean );
console.log( 'object' === typeof object );
console.log( 'function' === typeof func );
console.log( 'object' === typeof array );
console.log( 'object' === typeof date );
console.log( 'object' === typeof regexp );
console.log( 'undefined' === typeof undefined );
console.log( 'object' === typeof null );
```
#### 4.7 基础类库
##### 4.7.1 console
  console只有console.log
##### 4.7.2 Math
  **属性：**
  E、LN10、LN2、LOG2E、LOG10E、PI、SQRT1_2、SQRT2？？？？
  **方法：**
  参考JS
##### 4.7.3 JSON
  **方法：**
  - stringify(object): 将 object 对象转换为 JSON 字符串，并返回该字符串。
  - parse(string): 将 JSON 字符串转化成对象，并返回该对象。
##### 4.7.4 Number
  **属性：**
- MAX_VALUE
- MIN_VALUE
- NEGATIVE_INFINITY
- POSITIVE_INFINITY
##### 4.7.5 Date
  **属性：**
  - parse
  - UTC
  - now
##### 4.7.6 Global
  **属性：**
  - NaN
  - Infinity
  - undefined
  
  **方法：**
  - parseInt
  - parseFloat
  - isNaN
  - isFinite
  - decodeURI
  - decodeURIComponent
  - encodeURI
  - encodeURIComponent
### 5.WXML节点布局相交状态
  节点布局相交状态API可用于监听两个或者多个组件节点在布局位置上的相交状态。这一组API常常可以用于推断某些节点是否可以被用户看见、有多大比例可以被用户看见。

  这一组API设计的主要概念如下：
  - 参照节点：监听的参照节点，取它的布局区域作为参照区域。如果有多个参照节点，则会取它们布局区域的交集作为参照区域。页面显示区域也可作为参照区域之一。
  - 目标节点：监听的目标，默认只能是一个节点（使用selectAll选择时，可以同时监听多个节点
  - 相交区域：目标节点的布局区域与参照区域的相交区域
  - 相交比例：相交区域占参照区域的比例
  - 阈值（临界值）：相交比例如果达到阈值，则会触发监听器的回调函数。阈值可以有多个。
  以下示例代码可以在目标节点（用选择器.target-class指定）每次进入或离开页面显示区域时，触发回调函数：
```javascript
Page({
  onLoad: function() {
    wx.createIntersectionObserver().relativeToViewport().observe('.target-class',(res)=>{
      res.id//目标节点id
      res.dataset // 目标节点 dataset
      res.intersectionRatio // 相交区域占目标节点的布局区域的比例
      res.intersectionRect // 相交区域
      res.intersectionRect.left // 相交区域的左边界坐标
      res.intersectionRect.top // 相交区域的上边界坐标
      res.intersectionRect.width // 相交区域的宽度
      res.intersectionRect.height // 相交区域的高度
    })
  }
})
```
  下面的代码可以在目标节点（用选择器.target-class指定）与参照节点（用选择器.relative-class指定）在页面显示区域内相交或相离，且相交或相离程度达到目标节点布局区域20%和50%时，触发回调函数
```javascript
Page({
  onLoad: function(){
    wx.createIntersectionObserver(this, {
      thresholds: [0.2, 0.5]
    }).relativeTo('.relative-class').relativeToViewport().observe('.target-class', (res) => {
      res.intersectionRatio // 相交区域占目标节点的布局区域的比例
      res.intersectionRect // 相交区域
      res.intersectionRect.left // 相交区域的左边界坐标
      res.intersectionRect.top // 相交区域的上边界坐标
      res.intersectionRect.width // 相交区域的宽度
      res.intersectionRect.height // 相交区域的高度
    })
  }
})
```
### 6.响应显示区域变化
#### 6.1 显示区域尺寸
  显示区域指小程序界面中可以自由布局展示的区域。在默认情况下，小程序显示区域的尺寸自页面初始化起就不会发生变化。

  从小程序基础库版本 2.3.0 开始，在 iPad 上运行的小程序可以支持屏幕旋转。使小程序支持 iPad 屏幕旋转的方法是：在 app.json 中添加 "resizable": true 。
```json
{
  "resizeable": true
}
```
  如果小程序添加了上述声明，则在屏幕旋转时，小程序将随之旋转，显示区域尺寸也会随着屏幕旋转而变化。
#### 6.2 Media Query
  对于不同尺寸的显示区域，页面的布局会有所差异，此时可以使用Media query来解决大多数问题
```css
.my-class {
  width: 40px;
}
@media (min-width: 480px) {
  /* 仅在 480px 或更宽的屏幕上生效的样式规则 */
  .my-class {
    width: 200px;
  }
}
```
#### 6.3 屏幕旋转事件
  有时，仅仅使用media query无法控制一些精细的布局变化，此时可以使用js作为辅助。

  在js中读取页面的显示区域尺寸，可以使用selectorQuery.selectViewport。

  页面尺寸发生改变的事件，可以使用wx.onWindowResize来监听。回调函数中将返回显示区域的尺寸信息。
```javascript
wx.onWindowResize(function(res) {
  res.size.windowWidth // 新的显示区域宽度
  res.size.windowHeight // 新的显示区域高度

  // 触发当前页面的 resized 方法
  var currentPages = getCurrentPages()
  var currentPage = currentPages[currentPages.length - 1]
  if (currentPage != null && typeof currentPage.resized === 'function') {
    currentPage.resized(res.size)
  }
})
```

## 四、自定义组件
从小程序基础库版本1.6.3开始，小程序支持简洁的组件化编程。所有自定义组件相关特性都需要基础库版本1.6.3或更高。

开发者可以将页面内的功能模块抽象成自定义组件，以便在不同的页面中重复使用；也可以将复杂的页面拆分成多个低耦合的模块，有助于代码维护。自定义组件在使用时与基础组件非常相似。


> **自定义组件的创建：**

类似于页面，一个自定义组件由json wxml wxss js4个文件组成。要编写一个自定义组件，首先需要在json文件中进行自定义组件声明（将component字段设为true）：
```json
{
    "component":true
}
```
同时，还要在wxml文件中编写组件模板，在wxss文件中加入组件样式，它们的写法与页面写法类似。
```html
<!-- 这是自定义组件的内部WXML结构 -->
<view class="inner">
  {{innerText}}
</view>
<slot></slot>
```
```css
/* 这里的样式只应用于这个自定义组件 */
.inner {
  color: red;
}
```
**注意：**
在组件wxss中不应使用ID选择器、属性选择器和签名选择器

在自定义组件的js文件中，需要使用Component()来注册组件，并提供组价的属性定义、内部数据和自定义方法。

组件的属性值和内部数据将被用于组件wxml的渲染，其中属性值是可由组件外部传入的。
```javascript
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    innerText: {
      type: String,
      value: 'default value',
    }
  },
  data: {
    // 这里是一些组件内部数据
    someData: {}
  },
  methods: {
    // 这里是一个自定义方法
    customMethod: function(){}
  }
})
```
> **自定义组件的使用**

使用已注册的自定义组件前，首先要在页面的json文件中进行引用声明，此时需要提供每个自定义组件的标签名和对应的自定义组件文件路径：
```json
{
  "usingComponents": {
    "component-tag-name": "path/to/the/custom/component"
  }
}
```
这样，在页面的wxml中就可以像使用基础组件一样使用自定义组件。节点名即自定义组件的标签名，节点属性即传递给组件的属性值。
```html
<view>
  <!-- 以下是对一个自定义组件的引用 -->
  <component-tag-name inner-text="Some text"></component-tag-name>
</view>
```
自定义组件的wxml节点结构在与数据结合之后，将被插入到引用位置内。

**注意：为页面添加usingComponents 会使得页面的逻辑发生一些细微变化（具体而言，页面会具有一些组件的特征）。如果页面比较复杂，需要测试一下页面逻辑是否有变化。**

**Tips：**

  - 对于基础库的1.5.x版本， 1.5.7 也有部分自定义组件支持。
  - 因为WXML节点标签名只能是小写字母、中划线和下划线的组合，所以自定义组件的标签名也只能包含这些字符。
  - 自定义组件也是可以引用自定义组件的，引用方法类似于页面引用自定义组件的方式（使用 usingComponents 字段）。
  - 自定义组件和使用自定义组件的页面所在项目根目录名不能以“wx-”为前缀，否则会报错。
  - 旧版本的基础库不支持自定义组件，此时，引用自定义组件的节点会变为默认的空节点。
### 1.组件模板和样式
  类似于页面，自定义组件拥有自己的wxml模板和wxss样式
#### 1.1 组件模板
  组件模板的写法与页面模板相同，组件模板与组件数据结合后生成的节点树，将被插入到组件的引用位置上。在组件模板中可以提供一个\<slot>节点，用于承载组件引用时提供的子节点。
```html
<!-- 组件模板 -->
<view class="wrapper">
  <view>这里是组件的内部节点</view>
  <slot></slot>
</view>

<!-- 引用组件的页面模版 -->
<view>
  <component-tag-name>
    <!-- 这部分内容将被放置在组件 <slot> 的位置上 -->
    <view>这里是插入到组件slot中的内容</view>
  </component-tag-name>
</view>
```
  注意在模板中引用到的自定义组件及其对应的节点名需要在json文件中显式定义，否则会被当做一个无意义的节点，除此以外，节点名也可以被声明为抽象节点。
#### 1.2 模板数据绑定
  与普通的wxml模板类似，可以使用数据绑定，这样就可以向子组件的属性传递动态数据。
```html
<!-- 引用组件的页面模版 -->
<view>
  <component-tag-name prop-a="{{dataFieldA}}" prop-b="{{dataFieldB}}">
    <!-- 这部分内容将被放置在组件 <slot> 的位置上 -->
    <view>这里是插入到组件slot中的内容</view>
  </component-tag-name>
</view>
<!--  组件的属性propA和propB将收到页面传递的数据。页面可以通过setData来改变绑定的数据字段。 -->
```

  **注意：**
  这样的数据绑定只能传递JSON兼容数据。自基础库版本2.0.9开始，还可以在数据中包含函数（但这些函数不能在wxml中直接调用，只能传递给子组件）
#### 1.3 组件wxml的slot
  在组件的wxml中可以包含slot节点，用于承载组件使用者提供的wxml结构。
  默认情况下，一个组件的wxml中只能有一个slot，需要使用多个slot时，可以在组件js中声明启用。
```javascript
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: { /* ... */ },
  methods: { /* ... */ }
})
```
  此时，可以在这个组件的wxml中使用多个slot，以不同的name来区分。
```html
<!-- 组件模板 -->
<!-- 组件模板 -->
<view class="wrapper">
  <slot name="before"></slot>
  <view>这里是组件的内部细节</view>
  <slot name="after"></slot>
</view>


<!-- 使用时，用 slot 属性来将节点插入到不同的slot上。 -->

<!-- 引用组件的页面模版 -->
<view>
  <component-tag-name>
    <!-- 这部分内容将被放置在组件 <slot name="before"> 的位置上 -->
    <view slot="before">这里是插入到组件slot name="before"中的内容</view>
    <!-- 这部分内容将被放置在组件 <slot name="after"> 的位置上 -->
    <view slot="after">这里是插入到组件slot name="after"中的内容</view>
  </component-tag-name>
</view>
```
#### 1.4 组件样式
  组件对应wxss文件的样式，只对组件wxml内的节点生效。编写组件样式时，需要注意：
  - 组件和引用组件的页面不能使用id选择器（#a）、属性选择器（[a]）和标签名选择器，请改用class选择器。
  - 组件和引用组件的页面中使用后代选择器（.a .b）在一些极端情况下会有非预期的表现，如遇，请避免使用。
  - 子元素选择器（.a>.b）只能用于 view 组件与其子节点之间，用于其他组件可能导致非预期的情况。
  - 继承样式，如 font 、 color ，会从组件外继承到组件内。
  - 除继承样式外， app.wxss 中的样式、组件所在页面的的样式对自定义组件无效。
```css
#a{}/*在组组件中不能使用*/
[a]{}/*在组组件中不能使用*/
button{}/*在组组件中不能使用*/
.a > .b {}/*除非.a是view组件节点，否则不一定会生效*/
/*除此以外，组件可以指定它所在节点的默认样式，使用:host选择器*/
/*组件custom-component.wxss*/
:host{
  color:yellow
}
```
```html
<!-- 页面的WXML -->
<custom-component>这段文本是黄色的</custom-component>
```
#### 1.5 外部样式类
  有时，组件希望接受外部传入的样式类（类似于view组件的hover-class属性）。此时可以在Component中用externalClasses定义段 定义若干个外部样式类。这个特性从小程序基础库版本1.9.90开始支持。
  **注意：**
  在同一个节点上使用普通样式类和外部样式类时，两个类的优先级时未定义的，因此最好避免这种情况：
```javascript
/* 组件 custom-component.js */
Component({
  externalClasses: ['my-class']
})
```
```html
<!-- 组件 custom-component.wxml -->
<custom-component class="my-class">这段文本的颜色由组件外的 class 决定</custom-component>
```
#### 1.6 全局样式类
  使用外部样式类可以让组件使用指定的组件外样式类，如果 希望组件外样式类能够完全影响组件内部，可以将组件构造器中的options.addGlobalClass字段置为true。这个特性从小程序基础库版本 2.2.3 开始支持。

> 当开放了全局样式类，存在外部样式污染组件样式的风险，请谨慎选择。

**代码示例：**
```javascript
 //组件custom-component.js
 Component({
   options:{
     addGlobalClass:true
   }
 })
```
```html
<!-- 组件custom-component.wxml -->
<text class="red-text">这段文本由组件外的class决定</text>
```
```css
/*组件外的样式定义*/
.red-text{color:#f00}
```
### 2.Component构造器
#### 2.1 定义段与示例方法
  Component构造器可用于定义组件，调用Component构造器时可以指定组件的属性、数据、方法等

定义段 | 类型 | 是否必填 | 描述
- | - | - | - 
properties | Object Map | 否 | 组件的对外属性，是属性名到属性设置的映射表，属性设置可包含三个字段，type表示属性类型、value表示属性初始值、observer表示属性值被更改时的响应函数。
data | Object | 否 | 组件的内部数据，和properties一同用于组件的模板渲染
methods | Object | 否 | 组件的方法，包括事件响应函数和任意的自定义方法
behavior | String Array | 否 | 类似于mixins和traits的组件间代码复用机制
created | Function | 否 | 组件生命周期函数，在组件实例进入页面节点树时执行，注意此时不能调用setData
attached | Function | 否 | 组件生命周期函数，在组件实例进入页面节点树时执行
ready | Function | 否 | 组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息（使用SelectorQuery）
moved | Function | 否 | 组件生命周期函数，在组件实例被移动到节点树另一位置时执行
detached | Function | 否 | 组件生命周期函数，在组件实例被页面节点树移除时执行
relations | Object | 否 | 组件间关系定义
externalClasses	 | String Array | 	否	 | 组件接受的外部样式类
options	 | Object Map |	否 |	一些选项（文档中介绍相关特性时会涉及具体的选项设置，这里暂不列举）
lifetimes |	Object |	否	| 组件生命周期声明对象，组件的生命周期：created、attached、ready、moved、detached将收归到lifetimes字段内进行声明，原有声明方式仍旧有效，如同时存在两种声明方式，则lifetimes字段内声明方式优先级最高
pageLifetimes |	Object |	否 |	组件所在页面的生命周期声明对象，目前仅支持页面的show和hide两个生命周期
definitionFilter |	Function |	否	| 定义段过滤器，用于自定义组件扩展，参见 自定义组件扩展

生命的组件实例可以在组件的方法、生命周期函数和属性observer中通过this访问。组件包含一些通用属性和方法：
属性 | 类型 | 描述
- | - | -
is | String | 组件的文件路径
id | String | 节点id
dataset | String | 节点dataset
data | String | 节点dataset
data | Object | 组件数据，包括内部数据和属性值
properties | Object | 组件数据，包括内部数据和属性值（与data一致）

方法名 | 参数 | 描述
- | - | -
setData | Object newData | 设置data并执行视图层渲染
hasBehavior | Object behavior | 检查组件是否具有behavior（检查时会递归检查被直接或间接引入的所有behavior）
triggerEvent | String name、Object detail，Object options | 触发事件，参见组件事件
createSelectorQuery | | 创建一个SelectorQuery对象，选择器选取范围为这个组件示例内
selectComponent | String selector | 使用选择器选择组件实例节点，返回匹配到的第一个组件实例对象（会被wx://component-export影响）
selectAllComponents |	String selector |	使用选择器选择组件实例节点，返回匹配到的全部组件实例对象组成的数组
getRelationNodes | String relationKey | 获取所有这个关系对应的所有关联节点

**代码示例：**
```javascript
Component({
  behaviors: [],
  properties: {
    myProperty: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function(newVal, oldVal, changedPath) {
         // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
         // 通常 newVal 就是新设置的数据， oldVal 是旧数据
      }
    },
    myProperty2: String // 简化的定义方式
  },
  data: {}, // 私有数据，可用于模版渲染
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () { },
    moved: function () { },
    detached: function () { },
  },
  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () { }, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function() { },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { },
  },
  methods: {
    onMyButtonTap: function(){
      this.setData({
        // 更新属性和数据的方法与更新页面数据的方法类似
      })
    },
    // 内部方法建议以下划线开头
    _myPrivateMethod: function(){
      // 这里将 data.A[0].B 设为 'myPrivateData'
      this.setData({
        'A[0].B': 'myPrivateData'
      })
    },
    _propertyChange: function(newVal, oldVal) {
    }
  }
})
```
**注意：**
在properties定义段中，属性名采用驼峰写法（propertyName）；在wxml中，指定属性值时则对应使用连字符写法（component-tag-name property-name="attr value"），应用于数据绑定时采用驼峰写法（attr = "{{propertyName}}"）
#### 2.2 使用Component构造器构造页面
事实上，小程序的页面也可以视为自定义组件。因而，页面也可以使用 Component 构造器构造，拥有与普通组件一样的定义段与实例方法。但此时要求对应 json 文件中包含 usingComponents 定义段。

此时，组件的属性可以用于接收页面的参数，如访问页面 /pages/index/index?paramA=123&paramB=xyz ，如果声明有属性 paramA 或 paramB ，则它们会被赋值为 123 或 xyz 。

**代码示例：**
```json
{
    "usingComponents":{}
}
```
```javascript
Component({
    properties: {
        paramA: Number,
        paramB: String
    },
    methods: {
        onLoad: function() {
            this.data.paramA // 页面参数 paramA 的值
            this.data.paramB // 页面参数 paramB 的值
        }
    }
})
```
**Bug & Tips：**
- 使用this.data可以获取内部数据和属性值，但不要直接修改，应使用setData
- 生命周期函数无法在组件方法中通过this访问到
- 属性名应避免以data开头，即不要命名成dataXyz这样的形式，因为在wxml中，data-xyz=""会被作为节点dataset来处理，而不是组件属性
- 在一个组件的定义和使用时，组件的属性名和data字段相互间都不能冲突（尽管它们位于不同的定义中）
- bug：对于type为Object或Array的属性，如果通过该组件自身的this.setData来改变属性值的一个子字段，则依旧会触发属性observer，且observer接收到的newVal是变化的那个子字段的值，oldVal为空，changedPath包含子字段的字段名相关信息。
### 3.组件间通信与事件
#### 3.1 组件间通信
组件间的基本通信方式有以下几种：
- WXML数据绑定：用于父组件向子组件的指定属性设置数据，仅能设置JSON兼容数据
- 事件：用于子组件向父组件传递数据，可以传递任何数据
- 如果以上两种方式不足以满足需求，父组件还可以通过this.selectComponent方法获取子组件实例对象，这样就可以直接访问组件的任意数据和方法
#### 3.2 监听事件
事件系统是组件间通信的主要方式之一。自定义组件可以触发任意的事件，引用组件的页面可以监听这些事件
监听自定义组件事件的方法与监听基础组件事件的方法完全一致
**代码示例：**
```html
<!-- 当自定义组件触发myevent事件时，调用onMyEvent方法 -->
<component-tag-name bindmyevent="onMyEvent"/>
<!-- 或者可以写成 -->
<component-tag-name bind:myevent="onMyEvent"/>
```
```javascript
Page({
  onMyEvent: function(e) {
    e.detail;//自定义组件触发事件时提供的detail对象
  }
})
```
#### 3.3 触发事件
自定义组件触发事件时，需要使用triggerEvent方法，指定事件名、detail对象和事件选项：
**代码示例：**
```html
<!-- 在自定义组件中 -->
<button bindtap="onTap"> 点击这个按钮触发myevent事件</button>
```
```javascript
Component({
  properties: {},
  methods: {
    onTap:function(){
      var myEventDetail = {};//detail对象，提供给事件监听函数
      var meEventOption={}//触发事件的选项
      this.triggerEvent('myevent',myEventDetail,myEventOption)
    }
  }
})
```
**触发事件的选项包括：**
选项名 | 类型 | 是否必填 | 默认值 | 描述
- | - | - | -| -
bubbles | Boolean | 否 | false | 事件是否冒泡
composed | Boolean | 否 | false | 事件是否可以穿越组件边界，为false时，事件将只能在引用组件的节点树上触发，不进入其它任何组件内部
capturePhase | Boolean | 否 | false | 事件是否拥有捕获阶段

**代码示例：**
```html
<!-- 页面page.wxml -->
<another-component bindcustomevent="pageEventListener1">
  <my-component bindcustomevent="pageEventListener2"></my-component>
</another-component>

<!-- 组件 another-component.wxml -->
<view bindcustomevent="anotherEventListener">
  <slot/>>
</view>

<!--组件 my-component.wxml-->
<view bindcustomevent="myEventListener">
  <slot/>>
</view>
```
```javascript
//组件my-component.js
Component({
  methods:{
    onTap:function() {
      this.triggerEvent('customevent',{})//只会触发pageEventListener2
      this.triggerEvent('customevent',{},{bubbles: true})//会依次触发pageEventListener2、pageEventListener1
      this.triggerEvent('customevent', {}, { bubbles: true, composed: true }) // 会依次触发 pageEventListener2 、 anotherEventListener 、 pageEventListener1
    }
  }
})
```
### 4.behaviors
#### 4.1 定义和使用behaviors
  behaviors是用于组件间代码共享的特性，类似于一些编程语言中的mixins或者traits。

  每个behavior可以包含一组属性、数据、生命周期函数和方法，组件引用它时，它的属性、数据和方法会被合并到组件中，生命周期函数也会在对应时机被调用。每个组件可以引用多个behavior。behavior也可以引用其它behavior。

  behavior需要使用Behavior()构造器定义。

  **代码示例：**
  ```javascript
  //my-behavior.js
  module.exports=Behavior({
    behaviors:[],
    properties:{
      meBehaviorProperty:{
        type: String
      }
    },
    data: {
      meBehaviorData:{}
    }
    attached:function() {},
    methods:{
      myBehaviorMethod:function(){}
    }
  })
  ```
组件引用时，在behaviors定义段中将它们逐个列出即可。

**代码示例：**
```javascript
//my-component.js
var myBehavior=require("my-behavior")
Component({
  behaviors:[myBehavior],
  properties:{
    myProperty:{
      type:String
    }
  },
  data:{
    myData:{}
  },
  attached:function() {},
  methods；{
    myMethods:function() {}
  }
})
//在这里，my-component组件定义中加入了my-behavior，而my-behavior中包含有myBehaviorProperty属性，myBehaviorData 数据字段、 myBehaviorMethod 方法和一个 attached 生命周期函数。这将使得 my-component 中最终包含 myBehaviorProperty 、 myProperty 两个属性， myBehaviorData 、 myData 两个数据字段，和 myBehaviorMethod 、 myMethod 两个方法。当组件触发 attached 生命周期时，会依次触发 my-behavior 中的 attached 生命周期函数和 my-component 中的 attached 生命周期函数。
```

#### 4.2 字段的覆盖和组合规则
  组件和它引用的behavior中可以包含同名的字段，对这些字段的处理方法如下：
  - 如果有同名的属性或方法，组件本身的属性或方法会覆盖 behavior 中的属性或方法，如果引用了多个 behavior ，在定义段中靠后 behavior 中的属性或方法会覆盖靠前的属性或方法；
  - 如果有同名的数据字段，如果数据是对象类型，会进行对象合并，如果是非对象类型则会进行相互覆盖；
  - 生命周期函数不会相互覆盖，而是在对应触发时机被逐个调用。如果同一个 behavior 被一个组件多次引用，它定义的生命周期函数只会被执行一次。
#### 4.3 内置behaviors
  自定义组件可以通过引用内置的behavior来获得内置组件的一些行为。

  **代码示例：**
```javascript
Component({
  behaviors:['wx://form-field']
})
```
  在上例中，wx://form-field代表一个内置behavior，它使得这个自定义组件有类似于表单控件的行为。内置behavior往往会为组件添加一些属性，在没有特殊说明时，组件可以覆盖这些属性来改变它的type或添加observer。
##### 4.3.1 wx://form-field
  使自定义组件有类似于表单控件的行为，form组件可以识别这些自定义组件，并在submit事件中返回组件的字段名及其对应字段值。这将为它添加一下两个属性：
  属性名 | 类型 | 描述 
  - | - | -
  name | String | 在表单中的字段名
  value | 任意 | 在表单中的字段值

##### 4.3.2 wx://component-export
  使自定义组件支持export定义段。这个定义段可以用于指定组件被selectComponent调用时的返回值。

  未使用这个定义段，selectComponent将返回自定义组件的this（插件的自定义组件将返回null）。使用这个定义段，将以这个定义段的函数返回值代替。
```javascript
//自定义组件ny-component的内部
  Component({
    behaviors:['wx://component-export'],
    export() {
      return {
        myField: 'myValue'
      }
    }
  })
```
```html
<!-- 使用自定义组件时 -->
<my-component id="the-id"/>
```
```javascript
this.selectComponent('#the-id')//等于 {myField: 'myValue'}
```
### 5.组件间关系
#### 5.1 定义和使用组件间关系
有时需要实现这样的组件：
```html
<custom-ul>
  <custom-li> item 1 </custom-li>
  <custom-li> item 2 </custom-li>
</custom-ul>
```
  这个例子中，custom-ul和custom-li都是自定义组件，它们有相互间的关系，相互间的通信往往比较复杂，此时在组件定义时加入relations定义段，可以解决这样的问题。示例：
```javascript
//path/to/custom-ul.js
Component({
  relations:{
    './custom-li': {
      type: 'child', // 关联的目标节点应为子节点
      linked: function(target) {
        // 每次有custom-li被插入时执行，target是该节点实例对象，触发在该节点attached生命周期之后
      },
      linkChanged: function(target) {
        // 每次有custom-li被移动后执行，target是该节点实例对象，触发在该节点moved生命周期之后
      },
      unlinked: function(target) {
        // 每次有custom-li被移除时执行，target是该节点实例对象，触发在该节点detached生命周期之后
      }
    }
  },
  methods:{
    _getAllLi:function() {
       // 使用getRelationNodes可以获得nodes数组，包含所有已关联的custom-li，且是有序的
      var nodes = this.getRelationNodes('path/to/custom-li')
    }
  },
  ready: function() {
    this._getAllLi();
  }
})

// path/to/custom-li.js
Component({
  relations: {
    './custom-ul': {
      type: 'parent', // 关联的目标节点应为父节点
      linked: function(target) {
        // 每次被插入到custom-ul时执行，target是custom-ul节点实例对象，触发在attached生命周期之后
      },
      linkChanged: function(target) {
        // 每次被移动后执行，target是custom-ul节点实例对象，触发在moved生命周期之后
      },
      unlinked: function(target) {
        // 每次被移除时执行，target是custom-ul节点实例对象，触发在detached生命周期之后
      }
    }
  }
})
//注意，必须在两个组件定义中都加入relations定义，否则不会生效
```
#### 5.2 关联一类组件
  有时，需要关联的是一类组件，如：
```html
<custom-form>
  <view>
    input
    <custom-input></custom-input>
  </view>
  <custom-submit> submit </custom-submit>
</custom-form>
```
custom-form 组件想要关联custom-input和custom-submit两个组件，此时，如果这两个组件都有一个behavior：
```javascript
// path/to/custom-form-controls.js
module.exports = Behavior({
  // ...
})

// path/to/custom-input.js
var customFormControls = require('./custom-form-controls')
Component({
  behaviors: [customFormControls],
  relations: {
    './custom-form': {
      type: 'ancestor', // 关联的目标节点应为祖先节点
    }
  }
})

// path/to/custom-submit.js
var customFormControls = require('./custom-form-controls')
Component({
  behaviors: [customFormControls],
  relations: {
    './custom-form': {
      type: 'ancestor', // 关联的目标节点应为祖先节点
    }
  }
})

//则在 relations 关系定义中，可使用这个behavior来代替组件路径作为关联的目标节点：
// path/to/custom-form.js
var customFormControls = require('./custom-form-controls')
Component({
  relations: {
    'customFormControls': {
      type: 'descendant', // 关联的目标节点应为子孙节点
      target: customFormControls
    }
  }
})
```

#### 5.3 relations 定义段
  relations定义段包含目标组件路径及其对应选项，可包含的选项见下表
选项 | 类型 | 是否必填 | 描述
- | - | - | - 
type | String | 是 | 目标组件的相对关系，可选的值为parent、child、ancestor、descendant
linked | Function | 否 | 关系生命周期函数，当关系被建立在页面节点树中时触发，触发时机在组件attached生命周期之后
linkChanged | Function | 否 | 关系生命周期函数，当关系在页面节点树中发生改变时触发，触发时机在组件moved生命周期之后
unlinked | Function | 否 | 关系生命周期函数，当关系脱离页面节点树时触发，触发时机在组件detached生命周期之后
target | String | 否 | 如果这一项被设置，则它表示关联的目标节点所应具有的behavior，所有拥有这一behavior的组件节点都会被关联

### 6.抽象节点
#### 6.1 在组件中使用抽象节点
  有时，自定义组件模板中的一些节点，其对应的自定义组件不是由自定义组件本身确定的，而是自定义组件的调用者确定的。这时可以把这个节点声明为”抽象节点“

  例如，现在来实现一个“选框组”（selectable-group）组件，它其中可以放置单选框（custom-radio）或者复选框（custom-checkbox）。这个组件的 wxml 可以这样编写：
```html
<!-- selectable-group.wxml -->
<view wx:for="{{labels}}">
  <label>
    <selectable disabled="{{false}}"></selectable>
    {{item}}
  </label>
</view>
```
其中,”selectable“不是任何在json文件的usingComponents字段中声明的组件，而是一个抽象节点，它需要在componentGenerics字段中声明：
```json
{
  "ComponentGenerics":{
    "selectable":true
  }
}
```
#### 6.2 使用包含抽象节点的组件
  在使用selectable-group组件时，必须指定“selectable”具体是哪个组件：
```html
<selectable-group generic:selectable="custom-radio" />
```
  这样，在生成这个selectable-group组件的实例时，”selectable“节点会生成”custom-radio“组件实例。类似地，如果这样使用:
```html
<selectable-group generic:selectable="custom-checkbox" />
```
“selectable”节点则会生成“custom-checkbox”组件实例。

注意：上述的 custom-radio 和 custom-checkbox 需要包含在这个 wxml 对应 json 文件的 usingComponents 定义段中。

```json
{
  "usingComponents": {
    "custom-radio": "path/to/custom/radio",
    "custom-checkbox": "path/to/custom/checkbox"
  }
}
```
#### 6.3 抽象节点的默认组件
  抽象节点可以指定一个默认组件，当具体组件未被指定时，将创建默认组件的实例，默认组件可以在componentGenerics字段中指定：
```json
{
  "componentGenerics": {
    "selectable": {
      "default": "path/to/default/component"
    }
  }
}
```
**Tips:**
节点的 generic 引用 generic:xxx="yyy" 中，值 yyy 只能是静态值，不能包含数据绑定。因而抽象节点特性并不适用于动态决定节点名的场景。
### 7.自定义组件扩展
#### 7.1 扩展后的效果
```javascript
// behavior.js
module.exports = Behavior({
  definitionFilter(defFields) {
    defFields.data.from = 'behavior'
  },
})

// component.js
Component({
  data: {
    from: 'component'
  },
  behaviors: [require('behavior.js')],
  ready() {
    console.log(this.data.from) // 此处会发现输出 behavior 而不是 component
  }
})
//通过例子可以发现，自定义组件的扩展其实就是提供了修改自定义组件定义段的能力，上述例子就是修改了自定义组件中的data定义段里的内容
```
#### 7.2 使用扩展
  Behavior()构造器提供了新的定义段definitionFilter，用于支持自定义组件扩展，definitionFilter是一个函数，在被调用时会注入两个参数，第一个参数是使用该behavior的component/behavior的定义对象，第二个参数是该behavior所使用的behavior的definitionFilter函数列表。比如：
```javascript
// behavior3.js
module.exports = Behavior({
    definitionFilter(defFields, definitionFilterArr) {},
})

// behavior2.js
module.exports = Behavior({
  behaviors: [require('behavior3.js')],
  definitionFilter(defFields, definitionFilterArr) {
    // definitionFilterArr[0](defFields)
  },
})

// behavior1.js
module.exports = Behavior({
  behaviors: [require('behavior2.js')],
  definitionFilter(defFields, definitionFilterArr) {},
})

// component.js
Component({
  behaviors: [require('behavior1.js')],
}


```
  这里的代码中，声明了1个自定义组件和3个behavior，每个behavior都使用了definitionFilter 定义段。那么按照声明的顺序会有如下事情发生：

  1.当进行 behavior2 的声明时就会调用 behavior3 的 definitionFilter 函数，其中 defFields 参数是 behavior2 的定义段， definitionFilterArr 参数即为空数组，因为 behavior3 没有使用其他的 behavior 。

  2.当进行 behavior1 的声明时就会调用 behavior2 的 definitionFilter 函数，其中 defFields 参数是 behavior1 的定义段， definitionFilterArr 参数是一个长度为1的数组，definitionFilterArr[0] 即为 behavior3 的 definitionFilter 函数，因为 behavior2 使用了 behavior3。用户在此处可以自行决定在进行 behavior1 的声明时要不要调用 behavior3 的 definitionFilter 函数，如果需要调用，在此处补充代码 definitionFilterArr[0](defFields) 即可，definitionFilterArr 参数会由基础库补充传入。
  
  3.同理，在进行 component 的声明时就会调用 behavior1 的 definitionFilter 函数。
  
  简单概括，definitionFilter 函数可以理解为当 A 使用了 B 时，A 声明就会调用 B 的 definitionFilter 函数并传入 A 的定义对象让 B 去过滤。此时如果 B 还使用了 C 和 D ，那么 B 可以自行决定要不要调用 C 和 D 的 definitionFilter 函数去过滤 A 的定义对象

#### 7.2 真实案例
  利用扩展简单实现自定义组件的计算属性功能：
```javascript
//behavior.js
module.exports=Behavior({
  lifetimes: {
    created() {
      this._originalSetData = this.setData//原始setData
      this.setData = this._setData//封装后的setData
    }
  },
  definitionFilter(defFields) {
    const computed = defField.computed || {}
    const computedKeys = Object.keys(computed);
    const computedCache = {}
    //计算computed
    const calcCoputed = (scope,insertToData) => {
      const needUpdate = {}
      const data = defFields.data = defFields.data || {}
      for (let key of computedKeys) {
        const value =computed[key].call(scope)//计算新值
        if(computedCache[key]!==value) needUpdate[key] = computedCache[key] = value;
        if (insertToData) data[key] = needUpdate[key]//直接插入到data中，初始化时才需要的操作
      }
      return needUpdate;
    }
    //重写setData 方法
    defFields.methods = defFields.methods || {}
    defFields.methods._setData = function(data, callback) {
      const originalSetData = this._originalSetData // 原始 setData
      originalSetData.call(this, data, callback) // 做 data 的 setData
      const needUpdate = calcComputed(this) // 计算 computed
      originalSetData.call(this, needUpdate) // 做 computed 的 setData
    }
    //初始化computed
    calcComputed(defFields,true)//计算computed
  }
})
```
在组件中使用：
```javascript
const beh = require('./behavior.js')
Component({
  behaviors: [beh],
  data: {
    a: 0,
  },
  computed: {
    b() {
      return this.data.a + 100
    },
  },
  methods: {
    onTap() {
      this.setData({
        a: ++this.data.a,
      })
    }
  }
})
```
```html
<view>data: {{a}}</view>
<view>computed: {{b}}</view>
<button bindtap="onTap">click</button>
<!-- 实现原理很简单，对已有的setData进行二次封装，在每次setData的时候计算出computed里各字段的值，然后设到data中，已经达到计算属性的效果 -->
```
### 8.开发第三方自定义组件
#### 8.1 准备
开发一个开源的自定义组件包给他人使用，首先需要明确他人是要如何使用这个包的，如果只是拷贝小程序目录下直接使用的话，可以跳过此文档。此文档中后续内容是以 npm 管理自定义组件包的前提下进行说明的。

在开发之前，要求开发者具有基础的 node.js 和 npm 相关的知识，同时需要准备好支持 npm 功能的开发者工具。
#### 8.2 下载模板
为了方便开发者能够快速搭建好一个可用于开发、调试、测试的自定义组件包项目，官方提供了一个项目模板，下载使用模板的方式有三种：

- 直接从 github 上下载 zip 文件并解压。
- 直接将 github 上的仓库 clone 下来。
- 使用官方提供的命令行工具初始化项目，下面会进行介绍。

项目模板中的构建是基于 gulp + webpack 来执行的，支持开发、构建、测试等命令，详情可参阅项目模板的 README.md 文件。

#### 8.3 命令行工具
官方提供了命令行工具，用于快速初始化一个项目。执行如下命令安装命令行工具：
```
npm install -g @wechat-miniprogram/miniprogram-cli
```
然后新建一个空目录作为项目根目录，在此根目录下执行：
```
miniprogram init --type custom-component
```
命令执行完毕后会发现项目根目录下生成了许多文件，这是根据官方的项目模板生成的完整项目，之后开发者可直接在此之上进行开发修改。

命令行工具的更多用法可以查看 github 仓库上的 README.md 文件。

