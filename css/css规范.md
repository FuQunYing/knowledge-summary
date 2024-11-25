# css规范
## 1.书写顺序
1.位置属性(position, top, right, z-index, display, float等)

2.大小(width, height, padding, margin)

3.文字系列(font, line-height, letter-spacing, color- text-align等)

4.背景(background, border等)

5.其他(animation, transition等)

## 2.css书写规范
1.使用css缩写属性

2.去掉小数点前面的0

3.简写命名但要见名知意

4.16进制颜色的代码能缩写尽量缩写

5.连字符选择“-”，不要使用下划线

6.不随意使用ID

7.可以通过is-****来表示状态，更加明了

## 3.css命名规范
- 头：header
- 内容：content/container
- 尾：footer
- 导航：nav
- 侧栏：sidebar
- 栏目：column 
- 页面外围控制整体佈局宽度：wrapper
- 左右中：left right center
- 登录条：loginbar
- 标志：logo
- 广告：banner
- 页面主体：main
- 热点：hot
- 新闻：news
- 下载：download
- 子导航：subnav
- 菜单：menu
- 子菜单：submenu
- 搜索：search
- 友情链接：friendlink
- 页脚：footer
- 版权：copyright
- 滚动：scroll
- 标签：tags
- 文章列表：list
- 提示信息：msg
- 小技巧：tips
- 栏目标题：title
- 加入：joinus
- 指南：guide
- 服务：service
- 注册：register
- 状态：status
- 投票：vote
- 合作伙伴：partner
## 4.注释
```css
/*Header*/
content
/*End Header*/
```
## 5.ID/class的命名
> 同上 css命名规范

## 6.css样式表文件命名
- 主要的 master.css
- 模块 module.css
- 基本共用 base.css
- 布局、版面 layout.css
- 主题 themes.css
- 专栏 columns.css
- 文字 font.css
- 表单 forms.css
- 补丁 mend.css
- 打印 print.css

> ps：一律小写，尽量英文，不加中横线和下划线，除了一眼就明白的单词，其他的尽量不缩写 

# css规范 
## 1.css文件分类方法
- 公共样式，就是网站公用的布局样式，还有reset呗
- 特殊型样式，就是每个页面单独的样式呗
- 皮肤型样式，就是网站如果可以选择主题，统一搁在这里面呗，更改布局，颜色啥的
## 2.css内部的分类及其顺序

2.1 先重置标签的默认样式，然后统一设置网站的公共的初始样式

2.2 统一处理，比如设置统一的背景图，清除浮动等

2.3 页面的布局部分，页头，导航栏，主体，侧边栏，页尾的样式，顺序书写

2.4 模块，比如一些可以重复使用的代码片段的样式

2.5 元件，要重复使用的一些小标签的样式

2.6 功能，将一些使用率比较高的样式单独分离出来，避免重复加载

2.7 皮肤型样式，需要剥离出文字色，背景图，边框色等

2.8 状态，给一些状态类样式加上更加便于识别的前缀

