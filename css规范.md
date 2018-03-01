#css规范
##1.书写顺序
1.位置属性(position, top, right, z-index, display, float等)
2.大小(width, height, padding, margin)
3.文字系列(font, line-height, letter-spacing, color- text-align等)
4.背景(background, border等)
5.其他(animation, transition等)
##2.css书写规范
1.使用css缩写属性
2.去掉小数点前面的0
3.简写命名但要见名知意
4.16进制颜色的代码能缩写尽量缩写
5.连字符选择“-”，不要使用下划线
6.不随意使用ID
7.可以通过is-****来表示状态，更加明了
##3.css命名规范
头：header内容：content/container尾：footer导航：nav侧栏：sidebar
栏目：column页面外围控制整体佈局宽度：wrapper左右中：left right center
登录条：loginbar标志：logo广告：banner页面主体：main热点：hot新闻：news
下载：download子导航：subnav菜单：menu子菜单：submenu搜索：search
友情链接：friendlink页脚：footer版权：copyright滚动：scroll内容：content
标签：tags文章列表：list提示信息：msg小技巧：tips栏目标题：title加入：joinus
指南：guide服务：service注册：register状态：status投票：vote合作伙伴：partner
##4.注释
/*Header*/
content
/*End Header*/
##5.ID/class的命名
1.页面结构
容器: container页头：header内容：content/container页面主体：main
页尾：footer导航：nav侧栏：sidebar栏目：column
页面外围控制整体佈局宽度：wrapper左右中：left right center
2.导航
导航：nav主导航：mainnav子导航：subnav顶导航：topnav边导航：sidebar
左导航：leftsidebar右导航：rightsidebar菜单：menu子菜单：submenu
标题: title摘要: summary
3.功能
标志：logo广告：banner登陆：login登录条：loginbar注册：register
搜索：search功能区：shop标题：title加入：joinus状态：status按钮：btn
滚动：scroll标籤页：tab文章列表：list提示信息：msg当前的: current
小技巧：tips图标: icon注释：note指南：guild服务：service热点：hot新闻：news
下载：download投票：vote合作伙伴：partner友情链接：link版权：copyright
##6.css样式表文件命名
主要的 master.css模块 module.css基本共用 base.css布局、版面 layout.css
主题 themes.css专栏 columns.css文字 font.css表单 forms.css补丁 mend.css打印 print.css
ps：一律小写，尽量英文，不加中横线和下划线，除了一眼就明白的单词，其他的尽量不缩写 
#css规范 
##1.css文件分类方法
公共样式，就是网站公用的布局样式，还有reset呗
特殊型样式，就是每个页面单独的样式呗
皮肤型样式，就是网站如果可以选择主题，统一搁在这里面呗，更改布局，颜色啥的
##2.css内部的分类及其顺序
2.1先重置标签的默认样式，然后统一设置网站的公共的初始样式
2.2统一处理，比如设置统一的背景图，清除浮动等
2.3页面的布局部分，页头，导航栏，主体，侧边栏，页尾的样式，顺序书写
2.4模块，比如一些可以重复使用的代码片段的样式
2.5元件，要重复使用的一些小标签的样式
2.6功能，将一些使用率比较高的样式单独分离出来，避免重复加载
2.7皮肤型样式，需要剥离出文字色，背景图，边框色等
2.8状态，给一些状态类样式加上更加便于识别的前缀

