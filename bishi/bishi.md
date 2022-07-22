###### 构造函数
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
###### 深拷贝和浅拷贝
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
###### vue中data为什么是函数
- 官网原文：当一个组件被定义，data 必须声明为返回一个初始数据对象的函数，因为组件可能被用来创建多个实例。如果 data 仍然是一个纯粹的对象，则所有的实例将共享引用同一个数据对象！通过提供 data 函数，每次创建一个新实例后，我们能够调用 data 函数，从而返回初始数据的一个全新副本数据对象。
	- 如果重复创建了实例，那这个数据对象会被共享，这里的修改就会影响到那里....那一个组件还敢重复使用吗

###### computed和watch的区别
