#微信小程序开发
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
  - tabBar中的list是一个数组，只能配置最少2个，最多5个tab，tab按数组的顺序排列
  **属性说明**
属性 | 类型 | 必填 | 默认值 | 描述
color | HexColor | 是 | | tab上的文字默认颜色
selectedColor | HexColor | 是 |  | tab上的文字选中时的颜色
backgroundColor | HexColor | 是 |  | tab的背景色
borderStyle | String | 否 | black | tabbar上边框的颜色，仅支持black/white
list | Array | 是 |  | tab的列表
position | String | 否 | bottom | 可选值不bottom top
  **其中list接受一个数组，数组中的每个项都是一个对象，属性值如下：**
属性 | 类型 | 必填 | 说明
pagePath | String | 是 | 页面路径， 必须在pages数组中先定义























