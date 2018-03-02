#CSS3

**CSS练习：https://fuqunying.github.io/** 今天的从第7.2开始

## 1.概述
  CSS3是CSS2的升级版本，3只是版本号，它在CSS2.1的基础上增加了很多强大的新功能。 目前主流浏览器chrome、safari、firefox、opera、甚至360都已经支持了CSS3大部分功能了，IE10以后也开始全面支持CSS3了。
  在编写CSS3样式时，不同的浏览器可能需要不同的前缀。它表示该CSS属性或规则尚未成为W3C标准的一部分，是浏览器的私有属性，虽然目前较新版本的浏览器都是不需要前缀的，但为了更好的向前兼容前缀还是少不了的。
前缀 | 浏览器
- | :-: | -:
-webkit | chrome和safari
-moz | firefox
-ms | IE
-o | opera

## 2.新特性
  CSS3把很多以前需要使用图片和脚本来实现的效果、甚至动画效果，只需要短短几行代码就能搞定。比如圆角，图片边框，文字阴影和盒阴影，过渡、动画等。CSS3简化了前端开发工作人员的设计过程，加快页面载入速度。用CSS控制的页面样式，肯定比用JS控制的加载的要快啊。
  **CSS3的新特性**
```txt
	边框、圆角、背景、渐变、文本效果、字体、2D转换、3D转换、过渡、动画、弹性布局、多媒体查询、更多样的选择器等等。
```
## 3.边框
### 3.1 圆角效果 - border-radius
```css
border-radius: 10px;/*四个角都有10px的圆角了*/
border-radius: 10px 8px 6px 4px;/* 四个半径值分别是左上角、右上角、右下角和左下角，顺时针 */
```
  只要是合法值，px，em，rem，百分比都可以，也可以设置单个角：
  - 左上角：border-top-left-radius
  - 右上角：border-top-right-radius
  - 左下角：border-bottom-left-radius
  - 右下角：border-bottom-left-radius
### 3.2 阴影 - box-shadow
  box-shadow是向盒子添加阴影。支持添加一个或者多个。
```css
box-shadow:4px 2px 6px #333333; 
/*box-shadow后面可以跟上六个值，顺序是：X轴偏移量 Y轴偏移量 [阴影模糊半径] [阴影扩展半径] [阴影颜色] [投影方式]，但是不需要全写，加中括号的就是可写可不写*/
```
  属性值解析：
  - X轴偏移量：必须写，水平阴影的位置，正负值都行
  - Y轴偏移量：必须写，垂直阴影的位置，正负值都行
  - 阴影模糊半径：可选，模糊的距离
  - 阴影扩展半径：可选，阴影的尺寸
  - 阴影的颜色：可选，不写默认黑色
  - 投影方式：可选，默认外阴影，inset就是内阴影
    添加多个阴影的话，就在值后面用逗号隔开接着写值就行：
```css
box-shadow:4px 2px 6px #f00, -4px -2px 6px #000, 0px 0px 12px 5px #33CC00 inset;
```
  **阴影模糊半径与阴影扩展半径的区别**
```txt
  阴影模糊半径：此参数可选，其值只能是为正值，如果其值为0时，表示阴影不具有模糊效果，其值越大阴影的边缘就越模糊；
  阴影扩展半径：此参数可选，其值可以是正负值，如果值为正，则整个阴影都延展扩大，反之值为负值时，则缩小；
```
  **X轴偏移量和Y轴偏移量值可以设置为负数**
```txt
  本来全部为正值的时候，X轴阴影在右边，Y轴阴影在下边，变为负值的时候就是反过来啦。
```
### 3.3 为边框应用图片 - border-image
```css
   border-image:url(borderimg.png) 70 repeat 
   /*按照顺序：图片路径，数字就是切割图片的宽度，默认单位为px（所以是px的时候就不要加单位了），也可以写百分比，设置规律和border-radius一样，按照顺时针，最后一个是图片的延伸方式，repeat就是重复，round就是平铺，stretch就是拉伸，效果就想象一下设置桌面背景图的时候的样子吧。。*/
```
## 4.颜色
### 4.1 RGBA
  RGB是一种色彩标准，是由红(R)、绿(G)、蓝(B)的变化以及相互叠加来得到各式各样的颜色。RGBA是在RGB的基础上增加了控制alpha透明度的参数。
  语法：
```css
color:rgba(r,g,b,a)
/*以上R、G、B三个参数，正整数值的取值范围为：0 - 255。百分数值的取值范围为：0.0% - 100.0%。超出范围的数值将被截至其最接近的取值极限。并非所有浏览器都支持使用百分数值。A为透明度参数，取值在0~1之间，不可为负值。*/
```
### 4.2 渐变色彩
  渐变就是多种颜色逐渐变化的效果。
  **渐变的要素：**
```txt
1.填充方向：从上到下，从左到右，从右到左。。。。
2.色标：包含颜色及其出现的位置
		每个色标表示的是一种颜色，渐变中至少包含两种色标
```
  **渐变的分类：**
```txt
1.线性渐变：按照直线的方向，填充渐变颜色
2.径向渐变：按照圆形的方式填充出来的渐变效果
3.重复渐变：将线性渐变或径向渐变重复实现多次
```
  **线性渐变：**
```css
属性：background-image
取值：linear-gradient(angle,color-point,color-point,,,,);
	angle：渐变的填充方向或角度，取关键字、角度
	关键字：to top：从下向上-----对应0deg
		   to bottom(180deg)/left(270deg)/right(90deg)
		   to top left（从右下到左上）
		   to top right（从左下到右上）
	角度：0deg~360deg
	color-point：色标，颜色出现和结束的位置，可以有多个颜色，逗号隔开
eg：
background-image:linear-gradient(to left, red, orange,yellow,green,blue,indigo,violet);
```
  **径向渐变：**
```txt
取值改为radial-gradient就行啦
```
  **重复渐变：**
```txt
重复线性渐变：repeating-linear-gradient
重复径向渐变：repeating-radial-gradient
```
## 5.文字与字体
### 5.1 text-overflow和word-wrap
  text-overflow用来设置是否使用一个省略标记（...）标示对象内文本的溢出。
  语法长这样：
```css
  tex-overflow:clip/ellipsis
  /*clip表示剪切，ellipsis表示显示省略标记*/
```
  但是text-overflow只是用来说明文字溢出时用什么方式显示，要实现溢出时产生省略号的效果，还须定义强制文本在一行内显示（white-space:nowrap）及溢出内容为隐藏（overflow:hidden），只有这样才能实现溢出文本显示省略号的效果，代码如下：
```css
text-overflow:ellipsis; 
overflow:hidden; 
white-space:nowrap; 
```
  同时，word-wrap也可以用来设置文本行为，当前行超过指定容器的边界时是否断开换行。
```css
word-wrap:normal/break-word;
/*normal为浏览器默认值，break-word设置在长单词或 URL地址内部进行换行，反正属性不常用，用浏览器默认值就行啦。*/
```
### 5.2 嵌入字体@font-face
  @font-face能够加载服务器端的字体文件，让浏览器端可以显示用户电脑里没有安装的字体。
  语法长这样：
```css
@font-face {
    font-family : 字体名称;
    src : 字体文件在服务器上的相对或绝对路径;
}
```
  这样设置之后，就可以像使用普通字体一样在（font-*）中设置字体样式。
  比如：
```css
p {
    font-size :12px;
    font-family : "刚刚设置的字体名称";
    /*必须项，设置@font-face中font-family同样的值*/
}
```
### 5.3文本阴影text-shadow
  text-shadow可以用来设置文本的阴影效果。
  语法长这样：
```css
text-shadow: X-Offset Y-Offset blur color;
/*
X-Offset：表示阴影的水平偏移距离，其值为正值时阴影向右偏移，反之向左偏移； 
Y-Offset：是指阴影的垂直偏移距离，如果其值是正值时，阴影向下偏移，反之向上偏移；
Blur：是指阴影的模糊程度，其值不能是负值，如果值越大，阴影越模糊，反之阴影越清晰，如果不需要阴影模糊可以将blur值设置为0；
Color：是指阴影的颜色，也可以使用rgba色。
*/
```
  比如这样用：
```css
text-shadow: 0 1px 1px #fff
```
## 6.CSS3背景
### 6.1 background-origin
  用来设置元素背景图片的起始位置
  语法长这样：
```css
background-origin ： border-box /padding-box /content-box;
/*参数分别表示背景图片是从边框，还是内边距（默认值），或者是内容区域开始显示。但是，如果背景不是no-repeat，这个属性无效，它会从边框开始显示。*/
```
### 6.2 background-clip
  用来将背景图片做适当的裁剪以适应实际需要。
  语法长这样：
```css
background-clip ： border-box /padding-box/content-box/ no-clip
/*参数分别表示从边框、或内填充，或者内容区域向外裁剪背景。no-clip表示不裁切，和参数border-box显示同样的效果。backgroud-clip默认值为border-box。*/
```
### 6.3 background-size
  设置背景图片的大小，以长度值或百分比显示，还可以通过cover和contain来对图片进行伸缩。
  语法长这样：
```css
background-size: auto /<长度值> /<百分比> / cover / contain
/*
auto：默认值，不改变背景图片的原始高度和宽度；
<长度值>：成对出现如200px 50px，将背景图片宽高依次设置为前面两个值，当设置一个值时，将其作为图片宽度值来等比缩放；
<百分比>：0％~100％之间的任何值，将背景图片宽高依次设置为所在元素宽高乘以前面百分比得出的数值，当设置一个值时同上；
cover：顾名思义为覆盖，即将背景图片等比缩放以填满整个容器；
contain：容纳，即将背景图片等比缩放至某一边紧贴容器边缘为止。
*/
```
### 6.4 multiple backgrounds
  多重背景，也就是CSS2里background的属性外加origin、clip和size组成的新background的多次叠加，缩写时为用逗号隔开的每组值；用分解写法时，如果有多个背景图片，而其他属性只有一个（例如background-repeat只有一个），表明所有背景图片应用该属性值。
  语法长这样：
```css
background ： [background-color] /[background-image] /[background-position]/[background-size] /[background-repeat] / [background-attachment] / [background-clip] / [background-origin],...
```
  也可以拆写成这样：
```css
background-image:url1,url2,...,urlN;
background-repeat : repeat1,repeat2,...,repeatN;
backround-position : position1,position2,...,positionN;
background-size : size1,size2,...,sizeN;
background-attachment : attachment1,attachment2,...,attachmentN;
background-clip : clip1,clip2,...,clipN;
background-origin : origin1,origin2,...,originN;
background-color : color;
/*
用逗号隔开每组 background 的缩写值；
如果有 size 值，需要紧跟 position 并且用 "/" 隔开；
如果有多个背景图片，而其他属性只有一个（例如 background-repeat 只有一个），表明所有背景图片应用该属性值。
background-color 只能设置一个。*/
```
### 7.CSS3的选择器
#### 7.1 属性选择器
  即允许使用元素所附带的属性及其值，来匹配页面元素
  这么多的属性：
```html
  <a id="" class="" title="" target="_blank"></a>
```
  语法：**核心：[ ]**
  1.[attr],attr表示任意的属性名称，匹配附带attr属性的元素
```txt
  ex：[id]：匹配有id属性的元素
  [title]：匹配有title属性的元素
```
  2.elem[attr]
```txt
  elem：表示页面中任意元素
  ex：1.匹配页面中，附带class属性的p元素：p[class]
  	2.匹配页面中，附带class属性和id属性的div元素：div[class][id]
  	3. .container[title]：附带title属性的class为container的元素
```
  3.[attr=value],value：可以表示任意的属性
    1.div[id=container]<==>#container
    2匹配页面中所有的文本框
    input[type=text]{border:1px solid #000}
  4.[class~=value]-------非重点
    <p class="c1 c2 c3 c4"></p>
    作用：匹配class的属性值是一个值列表，并且value是该列表中的一个独立选择器的元素
    ex：1.匹配class是列表中包含c3选择器的p元素
    p[class~=c3]
  5.[attr^=value]：匹配attr属性值是以value字符作为开始的元素
    <div class="col-md-1"></div>
    <div class="col-d-1"></div>
    <div class="col-m-1"></div>
    <div class="col-s-1"></div>
    <div class="col-md-2"></div>
    <div class="col-d-2"></div>
    <div class="col-m-2"></div>
    <div class="col-s-2"></div>
    ex:1.匹配所有class属性值是以col作为开始的元素：[class^=col]
  6.[attr $= value]：匹配attr属性值是以value字符作为结尾的元素
    ex：1.匹配所有class属性值以-1作为结尾的属性值：[class $= "-1"];//数字或标点符号都要使用“”引起来
  7.[attr *= value]：匹配attr属性值中包含value字符的元素
    ex：匹配class属性值中包含md字符的元素：[class &= md]
#### 7.2 伪类选择器
1.:root选择器
    :root选择器，从字面上我们就可以很清楚的理解是根选择器，他的意思就是匹配元素E所在文档的根元素。在HTML文档中，根元素始终是<html>。
    “:root”选择器等同于<html>元素，简单点说：
    :root{background:orange}
    html {background:orange;}
    两个效果是一样的。
    建议使用:root方法，直接写HTML不太好。
2.否定伪类
	作用：将指定选择器匹配上的元素排除出去
	语法：:not(selector)
		eg:td:not(:first-child ){...}
3.:empty
	匹配没有子元素的元素（没有子元素，没有文本，没有回车或空格）,反正不能有任何的东西。
4.目标选择器
	:target选择器称为目标选择器，用来匹配文档(页面)的url的某个标志符的目标元素
  比如想要点击链接显示隐藏的段落
```html
<h2><a href="#brand">Brand</a></h2>
<div class="menuSection" id="brand">
    content for Brand
</div>
```
```css
.menuSection{
  display: none;
}
:target{/*这里的:target就是指id="brand"的div对象*/
  display:block;
}
```
```txt
	ps:具体来说，触发元素的URL中的标志符通常会包含一个#号，后面带有一个标志符名称，上面代码中是：#brand，：target就是用来匹配id为“brand”的元素（id="brand"的元素）,上面代码中是那个div元素。
	如果是多个url（多个target）：
	就像上面的例子，#brand与后面的id="brand"是对应的，当同一个页面上有很多的url的时候可以取不同的名字，只要#号后对的名称与id=""中的名称对应就可以了。
```
5.:first-child
  为了说明后面的每个child，先来一段html
```html
<div id="d1">
    <div class="c1"></div>
    <div class="c2"></div>
    <div class="c3"></div>
</div>
<div id="d2">
    <div class="c1"></div>
    <div class="c2"></div>
    <div class="c3"></div>
</div>
```
  :first-child：匹配属于其父元素中的首个子元素
  比如，div:first-child{匹配到“d1”，两个“c1”}
6.:last-child：匹配属于其父元素中的最后一个子元素
  比如，div:last-child{匹配到“d2”，两个“c3”}
7.:nth-child：匹配其属于父元素中的第n个子元素
  比如，:nth-child(2)，就是匹配第二个元素
  div:nth-child(1)<==>:first-child  
  参数n的起始值始终是1，而不是0。也就是说，参数n的值为0时，选择器将选择不到任何匹配的元素。关键词odd表示奇数，even表示偶数。
8.:nth-last-child(n) 选择器和前面的“:nth-child(n)”选择器非常的相似，只是这里多了一个“last”，所起的作用和“:nth-child(n)”选择器有所区别，从某父元素的最后一个子元素开始计算，来选择特定的元素。就是倒数，用法相同。
9.first-of-type选择器
  “:first-of-type”选择器类似于“:first-child”选择器，不同之处就是指定了元素的类型,其主要用来定位一个父元素下的某个类型的第一个子元素。
  div:first-of-type{父元素下第一个div元素}
10.last-of-type选择器
  “:last-of-type”选择器类似于“:last-child”选择器，只不过是指定了元素类型
11.nth-of-type选择器，同理，不多赘述
12.:only-child：匹配属于其父元素的唯一子元素
13.:only-of-type选择器用来选择一个元素是它的父元素的唯一一个相同类型的子元素。这样说或许不太好理解，换一种说法。“:only-of-type”是表示一个元素他有很多个子元素，而其中只有一种类型的子元素是唯一的，使用“:only-of-type”选择器就可以选中这个元素中的唯一一个类型子元素。
#### 7.3 其它选择器
1.:enabled选择器
  在Web的表单中，有些表单元素有可用（“:enabled”）和不可用（“:disabled”）状态，比如输入框，密码框，复选框等。在默认情况之下，这些表单元素都处在可用状态。那么就可以通过伪选择器“:enabled”对这些表单元素设置样式。
  选择器:enabled{...}
2.
















```

```