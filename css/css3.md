#CSS3

**CSS练习：https://fuqunying.github.io/** ，今日练习响应式（一个曾经的练手项目），今天的知识从第11节开始，截止今天结束了CSS3的知识点，github.io持续更新。

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
2.:disabled选择器
  “:disabled”选择器刚好与“:enabled”选择器相反，用来选择不可用表单元素。要正常使用“:disabled”选择器，需要在表单元素的HTML中设置“disabled”属性。
```html
<input type="submit" value="禁止点下一步" disabled />
```
```css
input[type="submit"]:disabled  {
  background: #eee;
  border-color: #eee;
  color: #ccc;
}
```
  通过这个给不可用的表单元素设置明显一些的样式。
3.:checked选择器
  在表单元素中，单选按钮和复选按钮都具有选中和未选中状态。（复写这两个按钮默认样式比较困难）。在CSS3中，可以通过状态选择器“:checked”配合其他标签实现自定义样式。而“:checked”表示的是选中状态。
```html
<input type="radio" checked="checked"/>
```
```css
input[type="radio"] + span {
  opacity: 0;

}
input[type="radio"]:checked + span {
  opacity: 1;
}
```
  选中的时候，圆圈中间就会有白色的点了。
4.::selection选择器
  ::selection就是匹配被用户选取的内容的样式
```html
<p>浏览器默认选中是白字蓝底，现在改成红字黄底</p>
```
```css
::selection{
	background-color:yellow;
	color:red;
}
::-moz-selection{...}
```
  火狐浏览器有兼容问题，需要加前缀，而且这个选择器必须是两个冒号。
5.:read-only选择器
  “:read-only”选择器用来指定处于只读状态元素的样式。简单点说就是，元素中设置了“readonly=’readonly’”才行。
```html
<input type="text" name="address" id="address" placeholder="中国上海" readonly="readonly" />
```
```css
textarea:-moz-read-only{
  border: 1px solid #ccc;
  height: 50px;
  resize: none;
  background: #eee;
}
textarea:read-only {
  border: 1px solid #ccc;
  height: 50px;
  resize: none;
  background: #eee;
}
```
  给只读的元素设置醒目的样式，火狐有兼容性，需要加前缀。
6.:read-write选择器
  read-write选择器刚好与:read-only选择器相反，主要用来指定当元素处于非只读状态时的样式。
```html
<input type="text" name="name" id="name" placeholder="大漠" />
```
```css
input[type="text"]:-moz-read-write{
  border:2px solid red;
}
input[type="text"]:read-write{
  border:2px solid red;
}
```
  非只读下的元素就会有红色边框啦。
7.::before和::after
  ::before和::after这两个主要用来给元素的前面或后面插入内容，这两个常和"content"配合使用，使用的场景最多的就是清除浮动。
```css
.clearfix::before, .clearfix::after {
    content: ".";
    display: block;
    height: 0;
    visibility: hidden;
}
.clearfix:after {clear: both;}
.clearfix {zoom: 1;}
```
  或者通过内容生成，给元素添加特效：
```css
.demo::before, .demo::after{
    content:"";
    position:absolute;
    z-index:-1;
    -webkit-box-shadow:0 0 20px rgba(0,0,0,0.8);
    -moz-box-shadow:0 0 20px rgba(0,0,0,0.8);
    box-shadow:0 0 20px rgba(0,0,0,0.8);
    top:50%;
    bottom:0;
    left:10px;
    right:10px;
    -moz-border-radius:100px / 10px;
    border-radius:100px / 10px;
}
```
  上面代码作用在class名叫.demo上的div的前（before）后(after)都添加一个空元素，然后为这两个空元素添加阴影特效。
### 8.CSS3变形
#### 8.1 旋转rotate（）
  旋转rotate()函数通过指定的角度参数使元素相对原点进行旋转。它主要在二维空间内进行操作，设置一个角度值，用来指定旋转的幅度。如果这个值为正值，元素相对原点中心顺时针旋转；如果这个值为负值，元素相对原点中心逆时针旋转。
  语法长这样：
```css
transform:rotate(XXdeg)
```
```txt
3D转换
  属性：perspective，模拟人的眼睛，到3D转换物体的距离，取值越大，表示离物体越远，取值越小，表示离物体越近
    取值：以px为单位的数值
    注意：该属性要加在3D转换元素的父元素上
  3D旋转，transform
    取值：rotateX(xdeg)，以X轴为中心轴，旋转元素
    rotateY(ydeg)，以Y轴为中心轴，旋转元素
    rotateZ(zdeg)，以Z轴为中心轴，旋转元素
    rotate3D(x,y,z,ndeg)，x,y,z取值大于0的话，则该轴参与旋转，x,y,z取值为0的话，则该轴不参与旋转
    	rotate3D(1,0,045deg)==>rotateX(45deg)
```
#### 8.2 扭曲skew（）
  扭曲skew()函数能够让元素倾斜显示。它可以将一个对象以其中心位置围绕着X轴和Y轴按照一定的角度倾斜。这与rotate()函数的旋转不同，rotate()函数只是旋转，而不会改变元素的形状。skew()函数不会旋转，而只会改变元素的形状。
  skew有三种情况
  - skew(x,y)使元素在水平和垂直方向同时扭曲（X轴和Y轴同时按一定的角度值进行扭曲变形）；第一个参数对应X轴，第二个参数对应Y轴。如果第二个参数未提供，则值为0，也就是Y轴方向上无斜切。
  - skewX(x)仅使元素在水平方向扭曲变形（X轴扭曲变形）；
  - skewY(y)仅使元素在垂直方向扭曲变形（Y轴扭曲变形）
    语法长这样：
```css
transform:skew(XXdeg);
/*正负的使用和上面那个一样，写一个数字，默认x，y同时扭曲这些角度*/
```
#### 8.3 缩放scale（）
  缩放 scale()函数 让元素根据中心原点对对象进行缩放。
  也有三种情况：
  - scale(X,Y)使元素水平方向和垂直方向同时缩放（也就是X轴和Y轴同时缩放）
  - scaleX(x)元素仅水平方向缩放（X轴缩放）
  - scaleY(y)元素仅垂直方向缩放（Y轴缩放）
    语法长这样：
```css
transform:scale(数字)
/*如果只有一个数字，默认x，y同时放大或缩小这个数字， scale()的取值默认的值为1，当值设置为0.01到0.99之间的任何值，作用使一个元素缩小；而任何大于或等于1.01的值，作用是让元素放大。*/
```
#### 8.4 位移translate（）
  translate()函数可以将元素向指定的方向移动，类似于position中的relative。或以简单的理解为，使用translate()函数，可以把元素从原来的位置移动，而不影响在X、Y轴上的任何Web组件。
  三种情况：
  - translate(x,y)水平方向和垂直方向同时移动（也就是X轴和Y轴同时移动）
  - translateX(x)仅水平方向移动（X轴移动）
  - translateY(Y)仅垂直方向移动（Y轴移动）
    语法长这样：
```css
transform: translate(XX , XX);
/*可以试一下百分比，-50%，可以实现水平垂直 居中*/
```
#### 8.5 矩阵matrix（）
  matrix() 是一个含六个值的(a,b,c,d,e,f)变换矩阵，用来指定一个2D变换，相当于直接应用一个[a b c d e f]变换矩阵。就是基于水平方向（X轴）和垂直方向（Y轴）重新定位元素,此属性值使用涉及到数学中的矩阵，需要深入了解，就需要对数学矩阵有一定的知识。
  - a为元素的水平伸缩量，1为原始大小；
  - b为纵向扭曲，0为不变；
  - c为横向扭曲，0不变；
  - d为垂直伸缩量，1为原始大小；
  - e为水平偏移量，0是初始位置；
  - f为垂直偏移量，0是初始位置
    最后就相当于：matrix(scaleX(),skewX(),skewY(),scaleY(),translateX(),translateY());
    比如通过matrix()函数来模拟transform中translate()位移的效果
```css
transform: matrix(1,0,0,1,50,50);
```
#### 8.6 原点 transform-origin
  任何一个元素都有一个中心点，默认情况之下，其中心点是居于元素X轴和Y轴的50%处。在没有重置transform-origin改变元素原点位置的情况下，CSS变形进行的旋转、位移、缩放，扭曲等操作都是以元素自己中心位置进行变形。但很多时候，可以通过transform-origin来对元素进行原点位置改变，使元素原点不在元素的中心位置，以达到需要的原点位置。
  transform-origin取值和元素设置背景中的background-position取值类似，如下：
  关键词 | 百分比
  -- | --
  top = top center =center top | 50% 0
  right = right center = center right | 100% 或者（100% 50%）
  bottom = bottom center = center bottom | 50% 100%
  left = left center = center left | 0 或者（0 50%）
  center = center center | 50% 或者 （50% 50%）
  top left = left top | 0 0
  right top = top right | 100% 0
  bottom right = right bottom | 100% 100%
  bottom left = left bottom | 0 100%
  语法长这样：
```css
transform-origin: left top/关键词或者百分比;
```
#### 8.7 过渡属性 transition-property
  过渡属性就是通过鼠标的单击、获得焦点，被点击或对元素任何改变中触发，并平滑地以动画效果改变CSS的属性值。在CSS中创建简单的过渡效果可以从以下几个步骤来实现：
  第一，在默认样式中声明元素的初始状态样式；
  第二，声明过渡元素最终状态样式，比如悬浮状态；
  第三，在默认样式中通过添加过渡函数，添加一些不同的样式。
**过渡的四要素**
1.指定过渡属性：指定哪个CSS属性值，在变化时需要使用过渡的效果，当指定的属性值发生变化时，过渡就会被触发
  语法：属性：transition-property
  取值：
	   1.具体的属性名称
	   2.none，默认值
	   3.all
  允许设置过渡的属性：
      1.颜色属性
      2.取值为数字的属性
      3.转换属性-transform
      4.渐变属性
      5.visibility
      6.阴影属性
  2.指定过渡时长，过渡的效果要在多长时间内完成
      属性：transition-duration
      取值：以s/ms为单位的数值
  3.指定过渡的速度时间曲线函数
      属性：transition-timing-function
      取值：ease，默认值，慢速开始，快速变快，慢速结束
           linear，匀速
           ease-in，慢速开始，加速结束
           ease-out，快速开始，减速效果
           ease-in-out，慢速开始和结束，中间先加后减
  4.过渡延迟，当用户激发操作后等待多长时间后再显示效果
      属性：transition-delay
      取值：以s/ms为单位的数值
  5.过渡的简写属性 transition：property duration timing-function delay
### 9.动画
#### 9.1 动画
  动画指使元素从一种样式逐渐变化为另一种样式的过程，动画是复杂版的过渡效果
  本质：是使用关键帧，来定义动画的每一步
  关键帧：包含运行的时间点以及动作(样式)
####9.2 动画的使用步骤
  1.声明动画 ，指定动画名称以及涉及到的关键帧们
  2.为元素调用动画，指定元素使用哪个动画效果
  3.声明动画的步骤
```txt
样式表中，通过 @keyframes规则来声明动画
@keyframes 动画名称{
    0%{动画开始时，元素的样式，属性：值；属性：值}
    50%{动画执行到一般时，元素的样式}
    100%{动画结束时元素的样式}
}
```
**动画声明的浏览器兼容性**
```txt
Firefox：-moz-
Chrome & Safari ：-webkit-
Opera：-o-
@-moz-keyframes 动画名
@-webkit-keyframes
@-o-keyframes
```
#### 9.3 调用动画
```txt
1.animation-name：要调用的动画名称
2.animation-duration：动画完成一个周期需要的时长，取值为s/ms为单位的数值
3.animation -timing-function：指定动画的速度时间曲线函数
	取值：ease/linear/ease-in/ease-out/ease-in-out
4.animation-delay：指定动画的播放延迟，取值为s/ms为单位的数值
5.animation-iteration-count：指定动画的播放次数
	取值：默认值为1，表示只播放1次/自定义数值/infinite，表示无限次播放
6.animation-direction：指定动画的播放方向
	取值：normal，正向播放，从0%-100% 
		 reverse，逆向播放，从100%-0% 
		 alternate，轮流播放，奇数次数正向播放，偶数次数逆向播放
7.animation：以上六个属性的简写模式
	取值：name duration timing-function delay iteration-count direction；
8.animation-fill-mode：动画的填充模式，指动画在播放之前或播放之后的显示效果
	取值：none，默认值，无任何效果
         forwards，当动画播放完成后，元素将保持在最后一帧的状态上
         backwards，动画播放前，延迟时间内，动画将保持在第一帧的状态上
         both，动画播放前后，分别应用在第一帧和最后一帧的状态上
9.animation-play-state：指定动画是处于播放状态还是暂停状态
	取值：paused，动画暂停
		 running，动画播放
ps：第8和第9不能写到简写模式里面。
```
### 10.布局样式相关
#### 10.1 多列布局-columns
  就是能在Web页面中方便实现类似报纸、杂志那种多列排版的布局，语法长这样：
```css
columns:column-width column-count;
```
  column-width用来定义多列中每列的宽度，column-count用来定义多列中的列数。
  column-width的使用和CSS中的width属性一样，不过不同的是，column-width属性在定义元素列宽的时候，既可以单独使用，也可以和多列属性中其他属性配合使用。语法长这样：
```css
column-width:auto / length;
/*
	auto:如果column-width设置值为auto或者没有显式的设置值时，元素多列的列宽将由其他属性来决定，比如前面的示例就是由列数column-count来决定。
	length:使用固定值来设置元素列的宽度，其主要是由数值和长度单位组成，不过其值只能是正值，不能为负值。
*/
```
  column-count属性主要用来给元素指定想要的列数和允许的最大列数。语法长这样：
```css
column-count:auto / integer;
/*
	auto:此值为column-count的默认值，表示元素只有一列，其主要依靠浏览器计算自动设置。
	integer:此值为正整数值，主要用来定义元素的列数，取值为大于0的整数，负值无效。
*/
```
#### 10.2 列间距column-gap
  column-gap主要用来设置列与列之间的间距，语法长这样：
```css
column-gap:normal / length;
/*
	normal:	默认值，默值为1em（如果你的字号是px，其默认值为你的font-size值）。
	length:此值用来设置列与列之间的距离，其可以使用px,em单位的任何整数值，但不能是负值。
*/
```
#### 10.3 列表边框column-rule
  column-rule主要是用来定义列与列之间的边框宽度、边框样式和边框颜色。简单点说，就有点类似于常用的border属性。但column-rule是不占用任何空间位置的，在列与列之间改变其宽度不会改变任何列的位置。
  语法长这样：
```css
column-rule:column-rule-width column-rule-style column-rule-color;
/*
	column-rule-width:类似于border-width属性，主要用来定义列边框的宽度，其默认值为“medium”，column-rule-width属性接受任意浮点数，但不接收负值。但也像border-width属性一样，可以使用关键词：medium、thick和thin。
	column-rule-style:类似于border-style属性，主要用来定义列边框样式，其默认值为“none”。column-rule-style属性值与border-style属值相同，包括none、hidden、dotted、dashed、solid、double、groove、ridge、inset、outset。
	column-rule-color:类似于border-color属性，主要用来定义列边框颜色，其默认值为前景色color的值，使用时相当于border-color。column-rule-color接受所有的颜色。如果不希望显示颜色，也可以将其设置为transparent
*/
```
#### 10.4 跨列设置column-span
  column-span主要用来定义一个分列元素中的子元素能跨列多少。column-width、column-count等属性能让一元素分成多列，不管里面元素如何排放顺序，他们都是从左向右的放置内容，但有时我们需要基中一段内容或一个标题不进行分列，也就是横跨所有列，语法长这样：
```css
column-span:none / all
/*
	none:此值为column-span的默认值，表示不跨越任何列。
	all:这个值跟none值刚好相反，表示的是元素跨越所有列，并定位在列的Ｚ轴之上。
*/
```
#### 10.5 盒子模型
  CSS中有一种基础设计模式叫盒模型，盒模型定义了Web页面中的元素中如何来解析。CSS中每一个元素都是一个盒模型，包括html和body标签元素。在盒模型中主要包括width、height、border、background、padding和margin这些属性，而且他们之间的层次关系可以相互影响，来看一张盒模型的3D展示图：
![图片](http://img.mukewang.com/5365d7b10001e8d506350529.jpg)
  从图中可以看出padding属性和content属性层叠background-image属性，层叠background-color属性，这个是存在的，它们四者之间构成了Ｚ轴（垂直屏幕的坐标）多重层叠关系。但是border属性与margin属性、padding属性三者之间应该是平面上的并级关系，并不能构成Ｚ轴的层叠关系。
  **box-sizing**
  在CSS中盒模型被分为两种，第一种是w3c的标准模型，另一种是IE的传统模型，它们相同之处都是对元素计算尺寸的模型，具体说不是对元素的width、height、padding和border以及元素实际尺寸的计算关系，它们不同之处是两者的计算方法不一致，原则上来说盒模型是分得很细的，这里所看到的主要是外盒模型和内盒模型，如下面计算公式所示：
  1.W3C标准盒模型
```txt
外盒尺寸计算（元素空间尺寸）
    element空间高度＝内容高度＋内距＋边框＋外距
    element空间宽度＝内容宽度＋内距＋边框＋外距
内盒尺寸计算（元素大小）
    element高度＝内容高度＋内距＋边框（height为内容高度）
    element宽度＝内容宽度＋内距＋边框（width为内容宽度）
```
  2.IE传统下盒模型（IE6以下，不包含IE6版本，QuirkesMode下IE5.5+）
```txt
外盒尺寸计算（元素空间尺寸）
    element空间高度＝内容高度＋外距（height包含了元素内容宽度、边框、内距）
    element宽间宽度＝内容宽度＋外距（width包含了元素内容宽度、边框、内距）
内盒尺寸计算（元素大小）
    element高度＝内容高度（height包含了元素内容宽度、边框、内距）
    element宽度＝内容宽度（width包含了元素内容宽度、边框、内距）
```
  box-sizing的语法长这样：
```css
box-sizing:content-box / border-box / inherit
/*
	content-box:默认值，其让元素维持W3C的标准盒模型，也就是说元素的宽度和高度（width/height）等于元素边框宽度（border）加上元素内距（padding）加上元素内容宽度或高度（content width/ height），也就是element width/height = border + padding + content width / height
	border-box:	重新定义CSS2.1中盒模型组成的模式，让元素维持IE传统的盒模型（IE6以下版本和IE6-7怪异模式），也就是说元素的宽度或高度等于元素内容的宽度或高度。从上面盒模型介绍可知，这里的内容宽度或高度包含了元素的border、padding、内容的宽度或高度（此处的内容宽度或高度＝盒子的宽度或高度—边框—内距）。
	inherit:使元素继承父元素的盒模型。
*/
```
  最为关键的是，box-sizing中content-box和border-box的区别，看图说话
  ![图片](http://img.mukewang.com/5365d98000018fa606460416.jpg)
### 11.弹性布局
  弹性布局就是设置某元素内的子元素的布局方式。
  弹性布局容器：简称"容器"，一般指的是父元素
  弹性布局项目：简称"项目"，想实现布局效果的元素
  主轴 ：元素排列方向的一根轴，默认是横轴(x轴)
  交叉轴 ：与主轴对应的轴，如果主轴为横轴的话，那么交叉轴就是纵轴；如果主轴为纵轴的话，那么交叉轴就是横轴
  **使用方法**
  为容器元素增加属性display,设置完成后，子元素自动会变为弹性布局的项目
  属性：display
  取值：
    1、flex：将 块级元素 变为弹性布局的容器
    2、inline-flex：将 行内元素 变为弹性布局的容器
    注意：
    	1、容器中的项目们，自动会变为 块级元素，允许修改尺寸
    	2、项目们的 float,clear,vertical-align 全部失效
    	3、容器的 text-align 属性 也会失效
  **容器的属性**
```txt
1.flex-direction
    作用：决定主轴，以及在主轴的排列方向
    取值：
        1、row：默认值，主轴为 横轴，起点在左端(项目从左向右排列)
        2、row-reverse：主轴为 横轴，起点在右端(项目从右向左排列)
        3、column：主轴为 纵轴，起点在顶端(项目从上到下排列)
        4、column-reverse：主轴为 纵轴，起点在底端(项目从下到上排列)
2.flex-wrap：在一根轴上排列不下所有项目时，如何换行
    取值：nowrap，默认值，不换行，但是项目会缩小
    	 wrap，换行
    	 wrap-reverse，换行，第一行在下方
3.flex-flow：是flex-direction和flex-wrap的简写属性
	取值：row nowrap，默认值
		 direction wrap
4.justify-content：指定项目在主轴上的对齐方式
    取值：flex-start，在轴的起点对齐
         flex-end，在轴的终点对齐
         center ，居中对齐
         space-between，两端对齐，项目之间的间隔都是相等的
         space-around，每个项目两边的空白间距是相等的
5.align-items：定义项目在交叉轴上的对齐方式
    取值：flex-start，在交叉轴的起点对齐
    	 flex-end，在交叉轴的终点对齐
    	 center，交叉轴的中间对齐
    	 baseline，基线对齐
    	 stretch，默认值，如果项目未设置高度时，那么项目将占满整个容器的高度
6.align-content：当项目有多根主轴的时候，指定项目们在交叉轴上的对齐方式以及项目们的边距
取值：flex-start，在交叉轴的起点对齐
     flex-end，在交叉轴的终点对齐
     center，交叉轴的中间对齐
     space-between，在交叉轴的两端对齐
     space-around，每根轴线两侧的间隔都是相等的
```
  **项目属性**
```txt
1.order，定义项目的排列顺序，值越小越靠前，默认值为0
	取值：整数数字
2.flex-grow，定义项目的放大比例，主轴有剩余空间时有效，默认为0即不放大
	取值：整数数字
3.flex-shrink，定义项目的缩小比例，默认为1。当主轴空间不足时，项目们如何缩小
	取值：整数数字，取值为0，则不缩小
4.flex-basis，定义项目在主轴上的空间大小
	取值：auto（默认值）
		 length，自定义大小，等同于width或height
5.flex，grow、shrink、basis的简写版本
	取值：auto：即1 1 auto
		 none：即0 0 auto
         grow，	shrink，		  basis
         1			0			auto
         0			1			auto
6.align-self，定义当前项目与其他项目不一样的交叉轴对齐方式
    取值：flex-start
         flex-end
         center
         baseline
         stretch
         auto，默认值，即采用容器的align-item的值
```
### 12.媒体查询
  Media Queries是CSS3新增加的一个模块功能，通过CSS3来查询媒体，然后调用对应的样式。
#### 12.1 媒体类型
  值 | 设备类型
  -- | --
  All | 所有设备
  Braille | 盲人用点字法触觉回馈设备
  Embossed | 盲文打字机
  Handheld | 便携设备
  Print | 打印用纸或者打印预览视图
  Projection | 各种投影设备
  Screen | 电脑显示器
  Speech | 语音或音频合成器
  Tv | 电视机类型设备
  Tty | 使用固定密度字母栅格的媒介，比如电传打字机和终端
  其中Screen、All、Print最常见，然而我只用过Screen啊...
#### 12.2 媒体类型的引用方法
  1.link方法
   link方法引入媒体类型其实就是在<link>标签引用样式的时候，通过link标签中的media属性来指定不同的媒体类型，就是说当屏幕符合指定的类型的时候，去引用那个css文件，长这样：
```html
<link rel="stylesheet" type="text/css" href="style.css" media="screen" />
<link rel="stylesheet" type="text/css" href="print.css" media="print" />
```
  2.@inport方法
   @import可以引用样式文件，同样也可以用来引用媒体类型。@import引入媒体类型主要有两种方式，一种是在样式中通过@import调用另一个样式文件；另一种方法是在<head></head>标签中的<style></style>中引入，但这种使用方法在IE6~7都不被支持，如样式文件中调用另一个样式文件时，就可以指定对应的媒体类型。可以长这样：
```javascript
@importurl(reset.css) screen;   
@importurl(print.css) print;
```
   在<head>中的<style>标签中引入媒体类型方法。也可以长这样：
```html
<head>
    <style type="text/css">
        @importurl(style.css) all;
    </style>
</head>
```
  3.@media方法，这个常用
   @media是CSS3中新引进的一个特性，被称为媒体查询。在页面中也可以通过这个属性来引入媒体类型。@media引入媒体类型和@import有点类似也具有两方式。
   语法长这样：
```css
@media screen {
   选择器{/*样式代码写在这里…*/}
}
```
#### 12.3 Media Queries的使用方法
  Media Queries能在不同的条件下使用不同的样式，使页面在不同在终端设备下达到不同的渲染效果。前面简单的介绍了Media Queries如何引用到项目中，但Media Queries有其自己的使用规则。具体来说,Media Queries的使用方法如下。
```css
@media 媒体类型and （媒体特性）{你的样式}
/*
	注意：使用Media Queries必须要使用“@media”开头，然后指定媒体类型（也可以称为设备类型），随后是指定媒体特性（也可以称之为设备特性）。媒体特性的书写方式和样式的书写方式非常相似，主要分为两个部分，第一个部分指的是媒体特性，第二部分为媒体特性所指定的值，而且这两个部分之间使用冒号分隔。例如：(max-width: 480px)
	从前面表中可以得知，主要有十种媒体类型和13种媒体特性，将其组合就类似于不同的CSS集合。但与CSS属性不同的是，媒体特性是通过min/max来表示大于等于或小于做为逻辑判断，而不是使用小于（<）和大于（>）这样的符号来判断。接下来一起来看看Media Queries在实际项目中常用的方式。
*/
```
  1.最大宽度max-width
  “max-width”是媒体特性中最常用的一个特性，其意思是指媒体类型小于或等于指定的宽度时，样式生效。就像这样：
```css
@media screen and (max-width:480px){
 .ads {
   display:none;
  }
}
/*
	上面表示的是：当屏幕小于或等于480px时,页面中的广告区块（.ads）都将被隐藏。
*/
```
  2.最小宽度min-width
  “min-width”与“max-width”相反，指的是媒体类型大于或等于指定宽度时，样式生效。长这样：
```css
@media screen and (min-width:900px){
.wrapper{width: 980px;}
}
/*
	上面表示的是：当屏幕大于或等于900px时，容器“.wrapper”的宽度为980px。
*/
```
  3.多个媒体特性使用
  Media Queries可以使用关键词"and"将多个媒体特性结合在一起。也就是说，一个Media Query中可以包含0到多个表达式，表达式又可以包含0到多个关键字，以及一种媒体类型。
  当屏幕在600px~900px之间时，body的背景色渲染为“#f5f5f5”，如下所示。
```css
@media screen and (min-width:600px) and (max-width:900px){
  body {background-color:#f5f5f5;}
}
```
  4.设备屏幕的输出宽度Device Width
  在智能设备上，比如iPhone、iPad等，可以根据屏幕设备的尺寸来设置相应的样式，或者调用相应的样式文本，对于屏幕设备同样的可以使用“min/max”对应参数，如“min-device-width”或者“max-device-width”：
```html
<link rel="stylesheet" media="screen and (max-device-width:480px)" href="iphone.css" />
```
  上面的代码指的是“iphone.css”样式适用于最大设备宽度为480px，比如说iPhone上的显示，这里的“max-device-width”所指的是设备的实际分辨率，也就是指可视面积分辨率。
  5.not关键词
  使用关键词“not”是用来排除某种制定的媒体类型，也就是用来排除符合表达式的设备。换句话说，not关键词表示对后面的表达式执行取反操作，如：
```css
@media not print and (max-width: 1200px){样式代码}
/*
	上面代码表示的是：样式代码将被使用在除打印设备和设备宽度小于1200px下所有设备中。
*/
```
  6.only关键词
  only用来指定特定的媒体类型，可以用来排除不支持媒体查询的浏览器，其实only很多事或是用来对那些不支持Media Query但却支持Media Type的设备隐藏样式表的。主要有，支持媒体特性的设备，正常调用样式，此时就当only不存在；表示不支持媒体的特性但是但又支持媒体类型的设备，这样就会不读样式，因为会先读only而不是screen，不支持MediaQuery的浏览器，不论是否支持only样式都不会被采用。比如：
```html
<linkrel="stylesheet" media="only screen and(max-device-width:240px)" href ="XXX.css"
```
  在Media Query中如果没有指定Media Type，默认为All，比如：
```html
<linkrel="stylesheet" media="(min-width:701px) and (max-width:900px)" href="mediu.css" />
```
  另外在样式中，还可以使用多条语句来将同一个样式应用于不同的媒体类型和媒体特性中，指定方式长这样：
```html
<linkrel="stylesheet" type="text/css" href="style.css" media="handheld and (max-width:480px), screen and (min-width:960px)">
```
  上面代码中style.css样式被用在宽度小于或等于480px的手持设备上，或者被用于屏幕宽度大于或等于960px的设备上。
### 13.响应式 Responsive
  维基百科的响应式描述：“Responsive设计简单的称为RWD，是精心提供各种设备都能浏览网页的一种设计方法，RWD能让你的网页在不同的设备中展现不同的设计风格。”从这一点描述来说，RWD不是流体布局，也不是网格布局，而是一种独特的网页设计方法。
  响应式设计要考虑元素布局的秩序，而且还需要做到“有求必应”，那就需要满足以下三个条件：网站必须建立灵活的网格基础；引用到网站的图片必须是可伸缩的；不同的显示风格，需要在Media Queries上写不同的样式。
#### 13.1 Responsive的术语：
  1.流体网格
  流体网格是一个简单的网格系统，这种网格设计参考了流体设计中的网格系统，将每个网格格子使用百分比单位来控制网格大小。这种网格系统最大的好处是让你的网格大小随时根据屏幕尺寸大小做出相对应的比例缩放。
  2.弹性图片
  弹性图片指的是不给图片设置固定尺寸，而是根据流体网格进行缩放，用于适应各种网格的尺寸。而实现方法是比较简单，一句代码就能搞定的事情。就像这样：
```css
img{max-width:100%}
```
  但是这个代码在IE8里面有个严重的问题，会让图片失踪。为每一个断点提供不同的图片，这是一个比较头痛的事情，因为Media Queries并不能改变图片“src”的属性值。使用background-image给元素使用背景图片，显示/隐藏父元素，给父元素使用不同的图片，然后通过Media Queries来控制这些图片显示或隐藏。可以解决这个问题：
  断点解决图片自适应的HTML：
```html
<img src="img.jpg" data-src-600px="image-600px.jpx" data-src-800px="image-800px.jpg">
```
  css长这样：
```css
@media (min-device-width:600px){
    img[data-src-600px]{content:attr(data-src-600px,url)}
}
@media (max-device-width:800px){
    img[data-src-800px]{content:attr(data-src-800px,url)}
}
/*但是这只是一种思路，没有真正用过*/
```
  3.媒体查询
  媒体查询在CSS3中得到了强大的扩展。使用这个属性可以让我的设计根据用户终端设备适配对应的样式。这也是响应式设计中最为关键的。可以说Responsive设计离开了Medial Queries就失去了他生存的意义。简单的说媒体查询可以根据设备的尺寸，查询出适配的样式。Responsive设计最关注的就是：根据用户的使用设备的当前宽度，我的Web页面将加载一个备用的样式，实现特定的页面风格。
  4.屏幕分辨率
  屏幕分辨简单点说就是用户显示器的分辨率，深一点说，屏幕分辨率指的是用户使用的设备浏览您的Web页面时的显示屏幕的分辨率，比如说智能手机浏览器、移动电脑浏览器、平板电脑浏览器和桌面浏览器的分辨率。Responsive设计利用Media Queries属性针对浏览器使用的分辨率来适配对应的CSS样式。因此屏幕分辨率在Responsive设计中是一个很重要的东西，因为只有知道Web页面要在哪种分辨率下显示何种效果，才能调用对应的样式。
  5.主要断点
  就是，设备宽度的临界点。在Media Queries中，其中媒体特性“min-width”和“max-width”对应的属性值就是响应式设计中的断点值。简单点说，就是使用主要断点和次要断点，创建媒体查询的条件。而每个断点会对应调用一个样式文件（或者样式代码），如下图所示：
  ![图片](http://img.mukewang.com/53660bc60001051601200357.jpg)
  上图的style.css样式文件运用在Web页面中，但这个样式文件包括了所有风格的样式代码，也就是说所有设备下显示的风格都通过这个样式文件下载下来。当然，在实际中还可以使用另一种方法，也就是在不同的断点加载不同的样式文件，如下图所示。
  ![图片](http://img.mukewang.com/53660c230001fb9603190203.jpg)
  上图主要显示的是主要断点，主要断点加载的不同样式文件直接将影响Web的效果。除了主要断点之外，为了满足更多效果时，还可以在这个基础上添次要断点。不过主要断点和次要断点增加之后，需要维护的样式也相应的增加，成本也相对应的增加。因此在实际使用中，需要根据自身产品需求，决定断点。
  综合下来，设置断点应把握三个要点
  - 满足主要的断点
  - 有可能的话添加一些别的断点
  - 设置高于1024的桌面断点
#### 13.2 响应式布局技巧
  需要丢弃的：
```txt
    尽量少用无关紧要的div；
    不要使用内联元素（inline）；
    尽量少用JS或flash；
    丢弃没用的绝对定位和浮动样式；
    摒弃任何冗余结构和不使用100%设置。
```
  建议：
```txt
    使用HTML5 Doctype和相关指南；
    重置好你的样式（reset.css）；
    一个简单的有语义的核心布局；
    给重要的网页元素使用简单的技巧，比如导航菜单之类元素。
    使用这些技巧，无非是为了保持HTML简单干净，而且在页面布局中的关键部分（元素）不要过分的依赖现代技巧来实现，比如说CSS3特效或者JS脚本。
    快速测试页面整洁的方法，先禁掉页面中所有的样式（以及与样式相关的信息），在浏览器中打开，如果内容排列有序，方便阅读，那么这个结构就不差。
```
#### 13.3 meta标签
  meta标签在响应式布局里面必写，没有的话别的都白搭，meta标签被称为可视区域meta标签，其使用方法如下：
```html
<meta name="viewport" content="">
```
  **content中的属性值：**
  content属性值 | 详细描述
  -- | --
  width | 可视区域的宽度，值可以是一个具体数字或者关键词device-width
  height | 可视区域的高度 ，值可以是一个具体数字或者关键词device-height
  initial-scale | 页面首次显示时可视区域的缩放级别，取值为1.0时将使页面按照实际尺寸显示，无任何缩放
  minimun-scale | 可视区域的最小缩放级别，表示用户可以将页面缩小的程度，取值1.0则禁止用户将页面缩小至实际尺寸一下
  maximun-scale | 可视区域的最大缩放级别，表示用户可以将页面放大的程度，取值1.0则禁止用户将页面放大至实际尺寸以上
  user-scaleable | 指定用户是否可以对页面进行缩放，yes就是可以，no就是 不行
  在实际项目中，为了让Responsive设计在智能设备中能显示正常，也就是浏览Web页面适应屏幕的大小，显示在屏幕上，可以通过这个可视区域的meta标签进行重置，告诉他使用设备的宽度为视图的宽度，也就是说禁止其默认的自适应页面的效果，具体设置长这样，以后就写这个就行：
```html
<meta name="viewport" content="width=device-width,initial-scale=1.0">
```
  另外一点，由于Responsive设计是结合CSS3的Media Queries属性，才能尽显Responsive设计风格，但是，在IE6-8中完全是不支持CSS3 Media。下面来看看CSS3 Meida Queries在标准设备上的运用，以后可以把这些样式加到样式文件中，或者单独创建一个名为“responsive.css”文件，并在相应的条件中写上自己的样式，让他适合自己的设计需求。
  脚本下载地址：
```html
media-queries.js(http://code.google.com/p/css3-mediaqueries-js/)      
respond.js(https://github.com/scottjehl/Respond)
<!—[if lt IE9]>
<scriptsrc=http://css3-mediaqueries-js.googlecode.com/svn/trunk/css3-mediaqueries.js></script>
<![endif]>
```
#### 13.4不同设备的分辨率（敲黑板）
  1.1024px显屏
```css
@media screen and (max-width : 1024px) {                    
/* 样式写在这里 */          
}
```
  2.800px显屏
```css
@media screen and (max-width : 800px) {              
/* 样式写在这里 */          
}
```
  3.640px显屏
```css
@media screen and (max-width : 640px) {              
/* 样式写在这*/            
}
```
  4.iPad横板显屏
```css
@media screen and (max-device-width: 1024px) and (orientation: landscape) {              
/* 样式写在这 */            
}
```
  5.iPad竖板显屏
```css
@media screen and (max-device-width: 768px) and (orientation: portrait) {      /* 样式写在这 */            
}
```
  6.iPhone 和 Smartphones
```css
@media screen and (min-device-width: 320px) and (min-device-width: 480px) {              
/* 样式写在这 */            
}
```
```txt
PS:bootstrap的分屏：
@media (max-width: 480px) { ... }              			   xs
@media (max-width: 768px) { ... }              			   sm
@media (min-width: 768px) and (max-width: 980px) { ... }   md   
@media (min-width: 1200px) { .. } 						   lg
```
### 14.其它属性
#### 14.1 自由缩放属性 resize
  它允许用户通过拖动的方式来修改元素的尺寸来改变元素的大小。到目前为止，可以使用overflow属性的任何容器元素。resize属性主要是用来改变元素尺寸大小的，其主要目的是增强用户体验。语法长这样：
```css
resize: none / both / horizontal / vertical / inherit
/*
	none:用户不能拖动元素修改尺寸大小。
	both:用户可以拖动元素，同时修改元素的宽度和高度。
	horizontal：用户可以拖动元素，仅可以修改元素的宽度，但不能修改元素的高度。
	vertical：用户可以拖动元素，仅可以修改元素的高度，但不能修改元素的宽度。
	inherit：继承父元素的resize属性值。
*/
```
#### 14.2 外轮廓属性
  外轮廓outline在页面中呈现的效果和边框border呈现的效果极其相似，但和元素边框border完全不同，外轮廓线不占用网页布局空间，不一定是矩形，外轮廓是属于一种动态样式，只有元素获取到焦点或者被激活时呈现。outline属性早在CSS2中就出现了，主要是用来在元素周围绘制一条轮廓线，可以起到突出元素的作用。但是并未得到各主流浏览器的广泛支持，在CSS3中对outline作了一定的扩展，在以前的基础上增加新特性。语法长这样：
```css
outline: ［outline-color］  [outline-style]  [outline-width]  [outline-offset] / inherit
/*
	outline-color：定义轮廓线的颜色，属性值为CSS中定义的颜色值。在实际应用中，可以将此参数省略，省略时此参数的默认值为黑色。
	outline-style：定义轮廓线的样式，属性为CSS中定义线的样式。在实际应用中，可以将此参数省略，省略时此参数的默认值为none，省略后不对该轮廓线进行任何绘制。
	outline-width:定义轮廓线的宽度，属性值可以为一个宽度值。在实际应用中，可以将此参数省略，省略时此参数的默认值为medium，表示绘制中等宽度的轮廓线。
	outline-offset：定义轮廓边框的偏移位置的数值，此值可以取负数值。当此参数的值为正数值，表示轮廓边框向外偏离多少个像素；当此参数的值为负数值，表示轮廓边框向内偏移多少个像素。
	inherit：元素继承父元素的outline效果。
*/
```
  从语法中可以看出outline和border边框属性的使用方法极其类似。outline-color相当于border-color、outline-style相当于border-style，而outline-width相当于border-width，只不过CSS3给outline属性增加了一个outline-offset属性。
#### 14.3 内容生成
  在Web中插入内容，在CSS2.1时代依靠的是JavaScript来实现。但进入CSS3进代之后可以通过CSS3的伪类“:before”，“:after”和CSS3的伪元素“::before”、“::after”来实现，其关键是依靠CSS3中的“content”属性来实现。不过这个属性对于img和input元素不起作用。
  content配合CSS的伪类或者伪元素，一般可以做以下四件事情：
  - none：不生成任何内容。
  - attr：插入标签属性值。
  - url：使用指定的绝对或相对地址插入一个外部资源（图像，声频，视频或浏览器支持的其他任何资源）
  - string：插入字符串。
    比如炒鸡常用的清除浮动“clearfix”。而这个“clearfix”方法就中就使用了“content”，只不过只是在这里插入了一个空格，代码长这样：
```css
.clearfix:before,.clearfix:after {
       content:””;
       display:table;
}
.clearfix:after {
       clear:both;
       overflow:hidden;
}
```
  假如要插入元素，原本有一个元素长这样：
```html
<a href="##" title="我是一个title属性值，我插在你的后面">我是元素</a>
```
  可以通过”:after”和”content:attr(title)”将元素的”title”值插入到元素内容“我是元素”之后：
```css
a:after{
    content:attr(title);
    color:#f00;
}
```
  那title里面的文字就会显示在a元素文字的后面啦，还是红色的。














