#### CSS相关
- 选择器的优先级
- 垂直居中的方法
- flex
	- 容器的属性（flex-xxx，justify-content，align-xxx）
	- 项目的属性（order，flex-grow，flex-xxx，align-self，align-items）

#### 浏览器相关
- 浏览器重绘与重排的区别
- 如何触发重绘与重排
#### JS相关
- 原型和原型链
- Eventloop事件循环
> JS是单线程的，为了防止一个函数执行时间过长阻塞后面的代码，所以会先将同步代码压入执行栈中，依次执行，将异步代码推入异步队列，异步队列又分为宏任务队列和微任务队列，因为宏任务队列的执行时间较长，所以微任务队列要优先于宏任务队列。微任务队列的代表就是，Promise.then，MutationObserver，宏任务的话就是setImmediate setTimeout setInterval

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
#### Vue相关
- 父子组件通信
- 生命周期
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

