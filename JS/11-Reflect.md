## 十二、Reflect
### 1.概述
  Reflect对象与Proxy对象一样，也是es6为了操作对象而提供的新的api，Reflect对象的设计目的是这样的：
  - 将Object对象的一些明显属于语言内部的方法比如Object.defineProperty这样的，放到Reflect对象上，现阶段，某些方法同时在Object和Reflect对象上部署，未来的新方法将只部署在Reflect对象上，也就是说，从Reflect对象上可以拿到语言内部的方法
  - 修改某些Object方法的返回结果，让其变得更合理。比如，Object.defineProperty(obj, name, desc)在无法定义属性时，会抛出一个错误，而Reflect.defineProperty(obj, name, desc)则会返回false
```javascript
// 老写法
try {
  Object.defineProperty(target, property, attributes);
  //成功
} catch (e) {
  //失败
}
// 新写法
if (Reflect.defineProperty(target, property, attributes)) {
  //成功
} else {
  //失败
}
```
  - 让Object操作都变成函数行为，某些Object操作是命令式，比如name in obj和delete obj[name]，而Reflect.has(obj,name)和Reflect.deleteProperty(obj,name)让它们变成了函数行为：
```javascript
//老写法
'assign' in Object//true
//新写法
Reflect.has(Object,'assign')//true
```
  - Reflect对象的方法与Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法，这就让Proxy对象可以方便地调用对应的Reflect方法，完成默认行为，作为修改行为的基础，也就是说，不管Proxy怎么修改默认行为，也是可以在Reflect上获取默认行为：
```javascript
Proxy(target, {
  set: function(target, name, value, receiver) {
    var success = Reflect.set(target,name, value, receiver);
    if (success) {
      log('property ' + name + ' on ' + target + ' set to ' + value);
    }
    return success;
  }
})
//Proxy方法拦截target对象的属性赋值行为，它采用Reflect.set方法将值赋值给对象的属性，确保完成原有的行为，然后再部署额外的功能
```
  for example：
```javascript
var loggedObj = new Proxy(obj, {
  get(target, name) {
    console.log('get', target, name);
    return Reflect.get(target, name);
  },
  deleteProperty(target, name) {
    console.log('delete' + name);
    return Reflect.deleteProperty(target, name);
  },
  has(target, name) {
    console.log('has' + name);
    return Reflect.has(target, name);
  }
})//每一个Proxy对象的拦截操作（get，delete，has），内部都调用对应的Reflect方法，保证原生行为能够正常执行，添加的工作，就是将每一个操作输出一行日志

//有了Reflect对象以后，很多操作会更易读：
// 老写法
Function.prototype.apply.call(Math.floor, undefined, [1.75]) // 1
// 新写法
Reflect.apply(Math.floor, undefined, [1.75]) // 1
```
### 2.静态方法
  Reflect对象一共有13个静态方法：
  - Reflect.apply(target,this.Arg,args)
  - Reflect.construct(target,arrgs)
  - Reflect.get(target,name,receiver)
  - Reflect.set(target,name,value,receiver)
  - Reflect.defineProperty(target,name,desc)
  - Reflecct.deleteProperty(target,name)
  - Reflect.has(target,name)
  - Reflect.ownKeys(target)
  - Reflect.isExtensible(target)
  - Reflect.preventExtensions(target)
  - Reflect.getOwnPropertyDescriptor(target,name)
  - Reflect.getPrototypeOf(target)
  - Reflect.setPrototypeOf(target,prototype)
  上面这些方法的作用，大部分与Object对象的同名方法的作用都是相同的，而且它与Proxy对象的方法是一一对应的。
#### 2.1 Reflect.get(target,name,receiver)
  Reflect.get方法查找并返回target对象的name属性，如果没有该属性，则返回undefined：
```javascript
var myObject={
    foo:1,
    bar:2,
    get baz(){
        return this.foo + this.bar
    }
}
Reflect.get(myObject,'foo')//1
Reflect.get(myObject,'bar')//2
Reflect.get(myObject,'baz')//3
```
  如果name属性部署了读取函数--getter，则读取函数的this绑定receiver：
```javascript
var myObject={
    foo:1,
    bar:2,
    get baz(){
        return this.foo+this.bar
    }
}
var myReceiverObject={
    foo:4,
    bar:4,
}
Reflect.get(myObject,'baz',myReceiverObject)//8
//如果第一个参数不是对象，Reflect.get方法会报错：
Reflect.get(1,'foo')//报错
Reflect.get(false,'foo')//报错
```
#### 2.2 Reflect.set(target,name,value,receiver)
  Reflect.set方法设置target对象的name属性等于value：
```javascript
var myObject=={
    foo:1,
    set ba(value){
        return this.foo=value
    }
}
myObject.foo //1
Reflect.set(myObject,'foo',2)
myObject.foo //2
Reflect.set(myObject,'bar',3)
myObject.foo //3
```
  如果name属性设置了赋值函数，则赋值函数的this绑定了receiver：
```javascript
var myObject={
    foo:4,
    set bar(value){
        return this.foo=value;
    }
}
var myReceiverObject={foo:0}
Reflect.set(myObject,'bar',1,myReceiverObject)
myObject.foo// 4
myReceiverrObject.foo// 1
```
  如果Proxy对象和Reflect对象联合使用，前者拦截赋值操作，后者完成赋值的默认行为，而且传入了receiver，那么Reflect.set会触发Proxy.defineProperty拦截
```javascript
let p={a:'a'}
let handler={
    set(target,key,value,receiver){
        console.log('set');
        Reflect.set(target,key,value,receiver)
    },
    defineProperty(target,key,attribute){
        console.log('define')
        Reflect.defineProperty(target,key,attribute)
    }
}
let obj=new Proxy(p,handler)
obj.a='A'// set //define
//这段代码里面，Proxy.set拦截里面使用了Reflect.set，而且传入receiver，导致触发Proxy.defineProperty拦截，这是因为Proxy.set的receiver参数总是指向当前的Proxy实例（即上一个例子的obj），而Reflect.set一旦传入receiver，就会将属性赋值到receiver上面，导致触发defineProperty拦截，如果Reflect.set没有传入receiver，那么就不会触发defineProperty拦截
//比如：
let p = {a: 'a'};
let handler = {
  set(target, key, value, receiver) {
    console.log('set');
    Reflect.set(target, key, value)
  },
  defineProperty(target, key, attribute) {
    console.log('defineProperty');
    Reflect.defineProperty(target, key, attribute);
  }
};
let obj = new Proxy(p, handler);
obj.a = 'A';// set
//如果第一个参数不是对象，Reflect.set会报错
Reflect.set(1, 'foo', {}) // 报错
Reflect.set(false, 'foo', {}) // 报错
```
#### 2.3 Reflect.has(obj,name)
  Reflect.has方法对应name in obj里面的in运算符：
```javascript
var myOject={foo:1}
//旧写法
'foo' in myObject//true
//新写法
Reflect.has(myObject,'foo')//true
//如果第一个参数不是对象，Reflect.hsa和in运算符都会报错
```
#### 2.4 Reflect.deleteProperty(obj,name)
  等同于delete obj[name]，用于删除对象的属性：
```javascript
const myObj = { foo: 'bar' };
// 旧写法
delete myObj.foo;
// 新写法
Reflect.deleteProperty(myObj, 'foo');
```
  该方法返回一个布尔值，如果删除成功，或者删除的属性不存在，返回true，删除失败，被删除的属性依然存在，返回false。
#### 2.5 Reflect.construct(target,args)
  等同于new target(..args)，这提供了一种不使用new，来调用构造函数的方法：
```javascript
function Greeting(name){
    this.name=name
}
//new的写法
const instance=new Greeting('Sherlock')
//Reflect.construct的写法
const instance=Reflect.construct(Greeting,['张三'])
```
#### 2.6 Reflect.getProptotypeOf(obj)
  用于读取对象的\_\_proto\_\_属性，对应Object.getPrototypeOf(obj)
```javascript
const myObj = new FancyThing();
// 旧写法
Object.getPrototypeOf(myObj)===FancyThing.prototype;
// 新写法
Reflect.getPrototypeOf(myObj)===FancyThing.prototype

//Reflect.getPrototypeOf和Object.getPrototypeOf的一个区别是，如果参数不是对象，Object.getPrototypeOf会将这个参数转为对象，然后再运行，而Reflect.getPrototypeOf会报错。
Object.getPrototypeOf(1) // Number {[[PrimitiveValue]]: 0}
Reflect.getPrototypeOf(1) // 报错
```
#### 2.7 Reflect.setPrototypeOf(obj,newProto)
  用于设置对象的\_\_proto\_\_属性，返回第一个参数对象，对应Object.setPrototypeOf(obj,newProto)
```javascript
const myObj=new FancyThing()
//旧写法
Object.setPrototypeOf(myObj,OtherThing.prototype)
//新写法
Reflect.setPrototypeOf(myObj,OtherThing.prototype)

//如果第一个参数不是对象，Obejct.setPrototypeOf会返回第一个参数本身，而Reflect.setPrototypeOf会报错
Object.setPrototypeOf(1, {})// 1
Reflect.setPrototypeOf(1, {})//报错: Reflect.setPrototypeOf called on non-object

//如果第一个参数是undefined或null，Object.setPrototypeOf和Reflect.setPrototypeOf都会报错
Object.setPrototypeOf(null, {})
//: Object.setPrototypeOf called on null or undefined
Reflect.setPrototypeOf(null, {})
//报错: Reflect.setPrototypeOf called on non-object
```
#### 2.8 Reflect.apply(fun,thisArg,args)
  等同于Function.prototype.apply.call(fun,thisArg,args),用于绑定this对象后执行给定函数。一般来说，如果要绑定一个函数的this对象，可以这样写fn.apply(obj,args)，但是如果函数定义了自己的apply方法，就只能写成Function.prototype.apply.call(fn,obj,args),采用Reflect对象可以简化这种操作：
```javascript
const ages = [11, 33, 12, 54, 18, 96];
// 旧写法
const youngest = Math.min.apply(Math, ages);
const oldest = Math.max.apply(Math, ages);
const type = Object.prototype.toString.call(youngest);
// 新写法
const youngest = Reflect.apply(Math.min, Math, ages);
const oldest = Reflect.apply(Math.max, Math, ages);
const type = Reflect.apply(Object.prototype.toString, youngest, []);
```
#### 2.9 Reflect.defineProperty(target,propertyKey,attributes)
  这个方法基本等同于Object.defineProperty，用来为对象定义属性：
```javascript
function MyDate(){....}
//旧写法
Object.defineProperty(MyDate,'now',{
    value: ()=>Date.now()
})
//新写法
Reflect.defineProperty(MyDate,'now',{
    value: ()=>Date.now()
})
//如果Reflect.defineProperty的第一个对象不是参数，就会抛出错误，比如Reflect.defineProperty(1,.'foo')

//这个方法可以与Proxy.defineProperty配合使用：
const p = new Proxy({}, {
  defineProperty(target, prop, descriptor) {
    console.log(descriptor);
    return Reflect.defineProperty(target, prop, descriptor);
  }
});
p.foo = 'bar';// {value: "bar", writable: true, enumerable: true, configurable: true}
p.foo // "bar"，Proxy.defineProperty对属性赋值设置了拦截，然后使用Reflect.defineProperty完成了赋值
```
#### 2.10 Reflect.getOwnPropertyDescriptor(target, propertyKey)
  该方法基本等同于Object.getOwnPropertyDescriptor，用于得到指定属性的描述对象，将来会替代掉后者。
```javascript
var myObject = {};
Object.defineProperty(myObject, 'hidden', {
  value: true,
  enumerable: false,
});
// 旧写法
var theDescriptor = Object.getOwnPropertyDescriptor(myObject, 'hidden')
// 新写法
var theDescriptor = Reflect.getOwnPropertyDescriptor(myObject, 'hidden')
```
  Reflect.getOwnPropertyDescriptor和Object.getOwnPropertyDescriptor的一个区别是，如果第一个参数不是对象，Object.getOwnPropertyDescriptor(1,'foo')不不报错，返回undefined，而Reflect.getOwnPropertyDescriptor(1,'foo')会抛出错误，表示参数非法
#### 2.11 Reflect.isExtensible(target)
  Reflect.isExtensible方法对应Object.isExtensible，返回一个布尔值，表示当时对象是否可扩展：
```javascript
const myObject={}
//旧写法
Object.isExtensible(myObject) // true
// 新写法
Reflect.isExtensible(myObject) // true
//如果参数不是对象，Object.isExtensible会返回false，因为非对象本来就是不可扩展的，而Reflect.isExtensible会报错。
Object.isExtensible(1) // false
Reflect.isExtensible(1) // 报错
```
#### 2.12 Reflect.preventExtensions(target)
  该方法对应Object.preventExtensions方法，用于让一个对象变为不可扩展。它返回一个布尔值，表示是否操作成功。
```javascript
var myObject = {};
// 旧写法
Object.preventExtensions(myObject) // Object {}
// 新写法
Reflect.preventExtensions(myObject) // true

//如果参数不是对象，Object.preventExtensions在 ES5 环境报错，在 ES6 环境返回传入的参数，而Reflect.preventExtensions会报错。
// ES5 环境
Object.preventExtensions(1) // 报错
// ES6 环境
Object.preventExtensions(1) // 1
// 新写法
Reflect.preventExtensions(1) // 报错
```
#### 2.13 Reflect.ownKeys (target)
  Reflect.ownKeys方法用于返回对象的所有属性，基本等同于Object.getOwnPropertyNames与Object.getOwnPropertySymbols之和。
```javascript
var myObject = {
  foo: 1,
  bar: 2,
  [Symbol.for('baz')]: 3,
  [Symbol.for('bing')]: 4,
};
// 旧写法
Object.getOwnPropertyNames(myObject)// ['foo', 'bar']
Object.getOwnPropertySymbols(myObject)//[Symbol(baz), Symbol(bing)]
// 新写法
Reflect.ownKeys(myObject)// ['foo', 'bar', Symbol(baz), Symbol(bing)]
```
### 3.实例：使用Proxy实现观察者模式
  观察者模式（Observable mode）指的是函数自动观察数据对象，一旦对象有变化，函数会自动执行：
```javascript
const person = observable({
  name: 'Sherlock',
  age: 30
});

function print() {
  console.log(`${person.name}, ${person.age}`)
}

observe(print);
person.name = 'Jhon';// 输出 Jhon 30
//数据对象person是观察者目标，函数print是观察者，一旦数据对象发生变化，print就会自动执行
```
  那使用Proxy写一个观察者模式的最简单实现，即实现observable和observe这两个函数，observable函数返回一个原始对象的Proxy代理，拦截赋值操作，触发充当观察者的各个函数：
```javascript
const queuedObservers = new Set();
const observe = fn => queuedObservers.add(fn);
const observable = obj => new Proxy(obj, {set});
function set(target, key, value, receiver) {
  const result = Reflect.set(target, key, value, receiver);
  queuedObservers.forEach(observer => observer());
  return result;
}
//先定义一个Set集合，所有观察者函数都放进这个集合，然后，observable函数返回原始对象的代理，拦截赋值操作，拦截函数set之中，会自动执行所有观察者
```





























