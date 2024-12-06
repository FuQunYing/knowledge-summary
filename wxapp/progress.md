1.小程序API：
​	目前在唱吧K歌和唱吧比赛中见到的API已经掌握（大概占常用小程序API总量的40%），可以实现基础的使用，复杂场景下的坑还没踩。

2.唱吧K歌和唱吧比赛
​	代码结构与逻辑已经过完，已经学会录音、播放、画图、保存至相册、转发分享、上传、进度条；

3.小程序组件与API
​	组件除地图、开放能力以外，别的已经大致掌握。
​	API掌握较好的有网络请求、文件类、媒体类、数据缓存、动画、画布、转发；设备、位置、地图以及系统相关API还未涉及。

4.小程序开发最好的10个博客、论坛、网站，取best5
目前个人觉得最好的两个：
​	1.微信小程序社区：http://www.wxapp-union.com
​	2.微信小程序开发资源汇总：https://github.com/justjavac/awesome-wechat-weapp.git
​	3.微信开放社区：https://developers.weixin.qq.com/
​	4.掘金微信小程序：https://juejin.im/tag/%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F
​	5.又一个社区：http://wxopen.club/

5.从250个案例库中找出典型交互，取best5
​	目前个人发现功能齐全、页面多、交互丰富、值得借鉴的有：
​	1.豆瓣电影：https://github.com/bruintong/wechat-webapp-douban-movie
​	2.github今日榜单：https://github.com/jae-jae/weapp-github-trending
​	3.豆瓣同城：https://github.com/bruintong/wechat-webapp-douban-location
​	4.滑动换页交互： https://github.com/jectychen/wechat-v2ex
​	5.经典商城-仿网易：https://github.com/tumobi/nideshop-mini-program
6.uni-app VS wxapp

<table border="1">
    <tr  style="text-align:center">
    	<td>对比</td>
        <td>uni-app</td> 
        <td>wxapp</td> 
    </tr>
    <tr>
    	<td>同</td>
    	<td colspan="2" style="text-align:center">
    		1.全局配置都是通过page.json,决定页面的路径、窗口表现、设置tab等 <br>
    		2.可用组件大致相同、可用接口大致相同(名字的写法会有一些不同)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>
    		3.都不支持纯HTML 和 部分复杂的JavaScript渲染表达式&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    	</td>    
    </tr>
    <tr>
    	<td>异</td>
    	<td>
    		1.开发平台依赖于HbuilderX，通过编译来达到运行于各个平台的目的<br>
    		2.通过Vue来开发项目，在数据绑定和显示上与wxapp原生开发有差异<br>
			(比如wxapp所有的动态绑定都是通过'{{}}}'，uni-app会用到'{}'、'[]'、'{{}}')<br>
    		3.新增很多模板，比如折叠面板、卡片视图、选项卡等<br>
    		4.样式使用upx作为单位
    	</td>
    	<td>
    		1.开发平台多样<br>
    		2.通过微信自己封装起来的JS来开发项目，有一些JS语法不适用<br>
    		3.样式使用rpx作为单位<br>
    	</td>
    </tr>
    <tr>
    	<td>优</td>
    	<td>
    		1.利用框架，可以比较快速的实现一个简单项目<br>
    		2.如果可以熟练使用Vue，通过uni-app甚至可以不太需要懂小程序，也可以进行开发<br>
    		3.封装代码块，输出指定的关键词再回车，就可以生成代码，非常方便易用<br>
    		4.提供了很多页面模板，基本上很多效果不需要自己再写<br>
    		5.一套代码，可以编译到APP和小程序环境下使用，减少开发量<br>
    		6.组件和API与wxapp几乎相同，改变一下名字的写法就可以了，不需要进行额外学习<br>
    		7.相对于wxapp的代码，uni-app的代码结构更清晰<br>
    	</td>
    	<td>
    		1.只针对微信环境，有针对性，不需要考虑对其它环境的兼容<br>
    		2.小程序·云开发的出现，使小程序的开发更简单<br>
    		3.掌握了前端知识，小程序很好学，容易上手<br>
    		4.小程序与小程序之间的跳转很方便<br>
    	</td>
    </tr>
    <tr>
    	<td>劣</td>
    	<td>
    		1.如果程序不考虑跨平台，只针对微信小程序，使用uni-app就有点多余了<br>
    		2.通过uni-app，不知道该如何操作两个小程序之间的跳转<br>
    		3.想要熟练使用，需要熟悉Vue<br>
    		4.跟小程序的云开发不接轨<br>
    		5.运行时，因为代码被编译，不容易定位到错误<br>
    	</td>
    	<td>
    		1.使用JS的时候有限制<br>
    		2.只能在微信环境下运行，不适用与其它任何平台<br>
    		3.不使用框架，初始开发缓慢-就像一个web网站不用jQuery，用原生DOM&BOM操作来控制页面一样<br>
    		4.当程序页面较多的时候，很容易造成代码混乱，不易维护<br>
    	</td>
    </tr>
</table>

























