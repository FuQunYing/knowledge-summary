#### 0. HTML相关
- H5有哪些新特性
- 语义化标签：header nav main article section aside footer

#### 1.浏览器相关
- 浏览器重绘与重排的区别
- 如何触发重绘与重排 ---- 
- Cookie、sessionStorage、localStorage 的区别
- 从输入URL到页面加载的全过程
> - 浏览器中输入URL
> - 查找缓存：浏览器先查看浏览器缓存 - 系统缓存 - 路由缓存中是否有该地址页面，如果有则显示页面内容，如果没有则进行下一步
> 	- 浏览器缓存：浏览器会记录DNS一段时间，因此，只是第一个地方解析DNS请求
> 	- 操作系统缓存：如果在浏览器缓存中不包含这个记录，则会使系统调用操作烯烃，获取操作系统的记录（保存最近的DNS查询缓存）
> 	- 路由器缓存：如果上述两个步骤均不能成功获取DNS记录，继续搜索路由器缓存
> 	- ISP缓存：若上述均失败，继续向ISP搜索
> - DNS域名解析：浏览器向DNS服务器发起请求，解析该URL的域名对应的IP地址。DNS服务器是基于UDP的，因此会用到UDP协议
> - 建立TCP连接：解析出IP地址后，根据IP地址和默认80端口，和服务器建立TCP连接
> - 发起HTTP请求：浏览器发起读取文件的HTTP请求，该请求报文作为TCP三次握手的第三次数据发送给服务器
> - 服务器响应请求并返回结果：服务器对浏览器请求做出响应，并把对应的html文件发送给浏览器
> - 关闭TCP连接：通过四次挥手释放TCP连接
> - 浏览器渲染：客户端（浏览器）解析html内容并渲染出来，浏览器接收到数据包后的解析流程为：
> 	- 构建DOM树：词法分析然后解析成DOM树（dom tree），是由dom元素及属性节点组成，树的根是document对象
> 	- 构建CSS规则树：生成CSS规则树（CSS Rule Tree）
> 	- 构建render树：Web浏览器将DOM和CSSOM结合，并构建出渲染树（render tree）
> 	- 布局（Layout）：计算出每个节点在屏幕中的位置
> 	- 绘制（Painting）：即遍历render树，并使用UI后端层绘制每个节点。
> 	

#### 2. CSS相关
- 选择器的优先级
- 垂直居中的方法
- CSS 盒子模型
- flex
	- 容器的属性（flex-xxx，justify-content，align-xxx）
	- 项目的属性（order，flex-grow，flex-xxx，align-self，align-items）
	- 用flex实现一个左侧宽度固定，右侧宽度随窗口大小变化的布局
	
- BFC
> BFC 是块级格式上下文，IFC 是行内格式上下文
> BFC 是 Block Formatting Context 的缩写，即块级格式化上下文。BFC是CSS布局的一个概念，是一个独立的渲染区域，规定了内部box如何布局， 并且这个区域的子元素不会影响到外面的元素，其中比较重要的布局规则有内部 box 垂直放置，计算 BFC 的高度的时候，浮动元素也参与计算。
- BFC 的原理布局规则
	- 内部的box会在垂直方向，一个接一个的放置
	- box垂直方向的距离由margin决定，属于同一个BFC的两个相邻box的margin会发生重叠
	- 每个元素的margin box的左边，与包含块border box的左边相接触（对于从左往右的格式化，否则相反）
	- BFC的区域不会与float box重叠
	- BFC是一个独立容器，容器里面的子元素不会影响到外面的元素
	- 计算BFC的高度时，浮动元素也参与计算高度
	- 元素的类型和display属性，决定了这个box的类型，不同类型的box会参与不同的formatting context
- 如何创建BFC
	- 根元素，即html元素
	- float的值不为none
	- position为absolute或者fixed
	- display的值为inline-block，table-cell，table-caption
	- overflow的值不为visible
- BFC的使用场景
	- 去除边距重叠现象
	- 清除浮动（让父元素的高度包含子浮动元素）
	- 避免某元素被浮动元素覆盖
	- 避免多列布局由于宽度计算四舍五入而自动换行


#### 3.JS相关
- 原型和原型链
- Eventloop事件循环
> JS是单线程的，为了防止一个函数执行时间过长阻塞后面的代码，所以会先将同步代码压入执行栈中，依次执行，将异步代码推入异步队列，异步队列又分为宏任务队列和微任务队列，因为宏任务队列的执行时间较长，所以微任务队列要优先于宏任务队列。微任务队列的代表就是，Promise.then，MutationObserver，宏任务的话就是setImmediate setTimeout setInterval ------

##### 构造函数 & 原型链
```javascript
function fun1(name) {
    if(name) this.name = name;
}
function fun2(name) {
    this.name = name;
}
function fun3(name) {
    this.name = name || 'Jhon'
}
fun1.prototype.name = 'Tom';
fun2.prototype.name = 'Tom';
fun3.prototype.name = 'Tom';

console.log(
    new fun1().name,//new 未传值，没有经过赋值的那一步，所以属性中不存在name，就去问它爹要，它爹有name属性，其值为 Tom，所以输出Tom
    new fun2().name,//new 未传值，但是不管怎样，构造函数内进行了赋值，存在name属性，由于传入的参数无值，所以被赋值为undefined
    new fun3().name)//new 未传值，当没有参数传入时，构造函数内的name属性被赋值为 Jhon，所以输出Jhon。
```
##### 深拷贝和浅拷贝
- 浅拷贝只拷贝数据对象的第一层，深层次的数据值与原始数据值会互相影响。
	- 常见的浅拷贝方式：Object.assign()，扩展运算符。
	- 只是修改了拷贝了对象的指针而已
- 深拷贝就不管数据对象有多少层了，改变拷贝后的值都不会影响原始数据的值。拷贝后的数据已经与原数据没关系了
	- 常见的深拷贝方式：JSON.parse()和JSON.stringify()配合使用，只针对了对象、数组等，无法正确处理函数和正则
```javascript
// 手写深拷贝的方法
function deepClone(source) {
  // null数据需要特殊处理
  if (source === null) {
    return source
  }
  // 校验要拷贝的数据是对象还是数组
  const target = Array.isArray(source) ? [] : {}
  for (const k in source) {
    const val = source[k]
    const valueType = typeof val
    // 校验拷贝的数据类型
    if (valueType === 'function') {
      target[k] = new Function(`return ${val.toString()}`)()
    } else if (valueType === 'object') {
      target[k] = deepClone(val)
    } else {
      target[k] = val
    }
  }
  return target
}

const obj1 = { name: 'dog', info: { age: 3 }, fn: function () {} }
const obj2 = deepClone(obj1)
obj2.name = 'cat'
obj2.info.age = 4
console.log(obj1) // { name: 'dog', info: { age: 3 }, fn: function(){} }
console.log(obj2) // { name: 'cat', info: { age: 4 }, fn: function(){} } 
```
#### 4.Vue相关
- 父子组件通信
- 生命周期
- Vue2和Vue3双向数据绑定的区别
- Vue3新特性
- 平常v-for循环渲染的时候，为什么不建议用index作为循环项的key呢
- vuex
- vue.config跨域配置
> // TODO 跨域 === 这里重写的baseUrl，请求会被转到vue.config.js中配置的代理地址，但是网络请求源的头与自己配置的host相同，此时请求网址与请求标头中的http://xxxx 是相同的，自然cookie就可以保存了
// 问题出现的原因：requestUrl 与 Origin 不同源

##### vue中data为什么是函数
- 官网原文：当一个组件被定义，data 必须声明为返回一个初始数据对象的函数，因为组件可能被用来创建多个实例。如果 data 仍然是一个纯粹的对象，则所有的实例将共享引用同一个数据对象！通过提供 data 函数，每次创建一个新实例后，我们能够调用 data 函数，从而返回初始数据的一个全新副本数据对象。
	- 如果重复创建了实例，那这个数据对象会被共享，这里的修改就会影响到那里....那一个组件还敢重复使用吗

##### computed和watch的区别
- computed是计算属性，根据所依赖的数据动态显示新的计算结果。计算结果会被缓存，如果数据没有发生改变则使用缓存，不会重新加载。
	- 也就是说，依赖于data中的某个值，重新设了一个新的值出来，可以在页面上直接使用，当被依赖的data做出修改时，这个计算后的值，也会直接被修改，且重新渲染dom
- watch是用来监听数据的，主要用法是当某个数据变化后，做一些操作。当监听的数据发生变化时，有一个回调函数，带有俩参数，一个修改后的new value，一个之前的old value
	- immediate：true，表示让值最初的时候就执行watch
	- deep表示对对象里面的变化也进行深度监听
	- 不支持缓存，数据有变化会直接触发相应的操作
- 如果一个值依赖多个属性（多对一），用computed计算过后再使用，会比较方便
- 如果一个值变化后会引起一系列操作，或者一个值变化会引起一系列值得变化（一对多），用watch更加方便一些

#### webpack相关
- 构建流程
- loader和plugin的区别
- 常见loader
- 常见plugin
> loader 只用来处理文件，plugin是对功能进行了扩展 -----

#### 其它
- 前端性能优化
- echarts
- highcharts
- antv
- ts
- angular？

自动化 - 自学前端
南站
位置OK

18 - 20k

