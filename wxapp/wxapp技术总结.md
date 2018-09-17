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

