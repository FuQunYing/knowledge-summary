## 二十、Decorator（修饰器）
### 1.类的修饰
  许多面向对象的语言都有修饰器函数，用来修改类的行为，目前，有一个提案将这项功能，引入了ECMAScript：
```javascript
@testable
class MyTestableClalss{....}
function testable(target){
    target.isTestable=true
}
MyTestableClass.isTestable//true
//@testable就是一个装饰器，它修改了MyTestableClass这个类的行为，为它本身加上了静态属性isTestable，testable函数的参数target是MyTestableClass类本身
```
  基本上，修饰器的行为就是下面这样：
```javascript
@decorator
class A{}
//相当于
class A{}
A=decorator(a)||A
//也就是说，修饰器是一个对类进行处理的函数，修饰器函数的第一个参数，就是所要修饰的目标类
function testable(target){.....}//target就是会被修饰的类
```
  如果觉得一个参数不够用，可以在修饰器外面再封装一层函数：
```javascript
function testable(isTestable){
    return function(target){
        target.isTestable=isTestable
    }
}
@testable(true)
class MyTestableClass{}
MyTestableClass.isTestable//true
@testable(false)
class MyClass{}
MyClass.isTestable//false
//修饰器testable可以接受参数，这就等于可以修改装饰器的行为
```
  修饰器对类的行为的改变，是代码编译时发生的，而不是在运行时，这意味修饰器能在编译阶段运行代码，也就是说，修饰器本质就是编译时执行的函数。前面的例子是为类添加一个静态属性，如果想添加实例属性，可以通过目标类的prototype对象操作：
```javascript
function testable(target){
    target.prototype.isTestable=true
}
@testable
class MyTestableClass{}
let obj=new MyTestableClass()
obj.isTestable//true
//修饰器函数testable是在目标类的prototype对象上添加属性，所以可以在实例上调用
```
  一个栗子：
```javascript
//mixins.js
export function mixins(...list){
    return function (target){
        Object.assign(tagret.prototype,...list)
    }
}
//main.js
import {mixins} from './mixins'
const Foo={
    foo(){console.log('foo')}
}
@mixins(Foo)
class MyClass{}
let obj=new MyClass()
obj.foo()//'foo'
//这段代码通过修饰器mixins，把Foo对象的方法添加到了MyClass的实例上面，可以用Object.assign()模拟这个功能
const Foo={
    foo(){console.log('foo')}
}
class MyClass{}
Object.assign(MyClass.prototype,Foo)
let obj=new MyClass()
obj.foo()//'foo'

//实际开发中，React与Redux库结合使用，常常需要写成这样：
class MyReactComponent extends React.Component{}
export default connect(mapStateToProps,mapDispatchToProps)(MyReactComponent)

//有了装饰器，可以改写代码成这样：
@connect(mapStateToProps,mapDispatchToProps)
export default class MyReactComponent extends  React.component{}
```
### 2.方法的修饰
  修饰器不仅可以修饰类，还可以修饰类的属性：
```javascript
class Person{
    @readonly
    name(){return `${this.first} ${this.last}`}
}
//修饰器readonly用来修饰 类 的name方法
```
  修饰器函数readonly一共可以接受三个参数
```javascript
function readonly(target,name,descriptor){
    /*
    	descriptor对象的值如下：
    	{
            value:specifiedFunction,
            enumerable:false,
            configurable:true,
            writable:true
    	}
    */
    descriptor.writable=false;
    return descriptor
}
readonly(Person.prototype,'name',descriptor)
//类似于
Object.defineProperty(Perosn.prototype,'name',descriptor)
```
  修饰器第一个参数是类的原型对象，上面的例子是Person.prototype，修饰器的本意是要 修饰 类的实例，但是这个时候实例还没生成，所以只能去修饰原型（这不同于类的修饰，那种情况时target参数指的是类本身）；第二个参数是所要修饰的属性名，第三个参数是该属性的描述对象。另外，上面的代码说明修饰器readonly会修改属性的描述对象（descriptor），然后被修改的描述对象再用来定义属性。
  下面是一个例子，修改属性描述对象的enumerable属性，使得该属性不可遍历：
```javascript
class Person{
    @nonenumberable
    get kidCount(){return this.children.length}
}
function nonenumerable(target,name,descriptor){
    descriptor.enumerable=false
    return descriptor
}
```
  下面的@log修饰器，可以起到输出日志的作用：
```javascript
class Math{
    @log
    add(a,b){
        return a+b
    }
}
function log(target,name,descriptor){
    var oldValue=descriptor.value;
    descriptor.value=function(){
        console.log(`Calling ${name} with`,arguments)
        return oldValue.apply(this,arguments)
    }
    return descriptor
}
const math=new Math()
//传入参数，就能得到日志了
math.add(2,4)
//@log修饰器的作用就是在执行原始操作之前，执行一次console.log，从而达到输出日志的目的
```
  修饰器有注释的作用：
```javascript
@testable
class Person{
    @readonly
    @nonenumerable
    name(){return `${this.first} ${this.last}`}
}
//Person类是可测试的，而name方法是只读和不可枚举的
```
  一个使用Decorator写的组件：
```javascript
@Component({
    tag:'my-component',
    styleUrl:'my-component.scss'
})
expotr class MyComponent{
    @Prop() first: string
    @Prop() last: string
    @Sate() isVisible:boolean=true
    render(){
        return (
        	<p>hello,his name is {this.first}{this.last}</p>
        )
    }
}
```
  如果同一个方法有多个修饰器，会先从外到内，然后由内向外执行：
```javascript
function dec(id){
    console.log('evaluated',id)
    return (target,property,decriptor)=>console.log('executed',id)
}
class Example{
    @dec(1)
    @dec(2)
    method(){}
}
/*
	evaluated 1
	evaluated 2
	executed 2
	executed 1
	外层修饰器@id(1)先进入，但是内层修饰器@id(2)先执行
*/
```
  除了注释，修饰器还能用来类型检查，所以对于类来说，这项功能相当有用，从长期来看，它将是JavaScript代码静态分析的重要工具。
### 3.为什么修饰器不能用于函数
  修饰器只能用于类和类的方法，不能用于函数，因为存在函数提升：
```javascript
var counter=0;
var add=function(){
    counter++;
}
@add
function foo(){}
//这里本来是想执行后counter等于1，但是实际上结果是counter等于0，因为函数提升，使得实际执行的代码是这样的：
@add
function foo(){}
var counter;
var add;
counter=0;
add=function(){
    counter++
}
```
  一个栗子：
```javascript
var readonly=require('some-decorator')
@readonly
function foo(){}
//实际执行的时候是这样的：
var readonly;
@readonly
function foo(){}
readOnly=require('some-decorator')
```
  所以，总之由于存在函数提升，使得修饰器不能用于函数，类是不会提升的，所以就没有这方面的问题。另一方面，如果一定要修饰函数，可以采用高阶函数的形式直接执行：
```javascript
function doSomething(name){
    console.log('hello'+name)
}
function loggingDecorator(wrapped){
    return function(){
        console.log('starting')
        const result=wrapped.apply(this,arguments)
        console.log('finish')
        return result;
    }
}
const wrapped=loggingDecorator(doSomthing);
```
### 4.core-decorator.js
  core-decorator.js是一个第三方模块，提供了几个常见的修饰器
#### 4.1 @autobind
  autobind修饰器使得方法中的this对象，绑定原始对象：
```javascript
import {autobind} from 'core-decorators'
class Person{
    @autobind
    getPerson(){
        return this
    }
}
let person=new Person()
let getPerson=person.getPerson
getPerson()===person//true
```
#### 4.2 @readonly
  readonly修饰器使得属性或者方法不可写：
```javascript
import (readonly) from 'core-decorators'
class Meal{
    @readonly
    entree='steek'
}
var dinner=new Meal()
dinner.entree='salmon'//Cannot assign to read only property 'entree' of [object Object]
```
#### 4.3 @override
  override修饰器检查子类的方法，是否正确覆盖了父类的同名方法，如果不正确会报错：
```javascript
import {override} from 'core-decorator'
class Parent{
    speak(first,second){}
}
class Child extends Parent{
    @override
    speak(){}//语法错误：Child#speak() does not properly override Parent#speak(first, second)
}
//或者这样
class Child extends Parent{
    @override
    speaks(){}//语法错误：No descriptor matching Child#speaks() was found on the prototype chain....
    
}
```
#### 4.4 @deprecate
  或者叫deprecated也行，这个修饰器会在控制台显示一条警告，表示该方法将废除：
```javascript
import (deprecate) from 'core-decorators'
class Person{
    @deprecate
    facepalm(){}
    @deprecate('wo stopped facepalming')
    faceplamHard(){}
    @deprecate('we stooped facepalming',{url:'https://knowyourname.comm/memes/facepalm'})
}
let person=new Person()
person.facepalm()//// DEPRECATION Person#facepalm: This function will be removed in future versions.
person.facepalmHard();// DEPRECATION Person#facepalmHard: We stopped facepalming
person.facepalmHarder();
/**
DEPRECATION Person#facepalmHarder: We stopped facepalming

See https://knowyourmeme.com/memes/facepalm for more details.
*/
```
#### 4.5 @suppressWarning
  抑制deprecated修饰器导致的console.warn()调用，但是，异步代码发憷的调用除外：
```javascript
import (suppressWarnings) from 'core-decorators'
class Person{
    @deprecated
    facepalm(){}
    @supressWarnings
    facepalmWithoutWarning(){
        this.facepalm()
    }
}
let person=new Person()
person.faepalmWithoutWarning()//nno warrning is logged
```
### 5.使用修饰器实现自动发布事件
  可以使用修饰器，使得对象的方法被调用时，自动发出一个事件：
```javascript
const postal=require('postal/lib.postal.lodash')
export default function publish(topic,channel){
    const channelName=channel||'/'
    const msgChannel=postal.channel(channelName)
    msgChannel.subscribe(topic,v=>{
        console.log('频道：',channelName)
        console.log('事件：',topic)
        console.log('数据：',v)
    })
    return function(target,name,descriptor){
        const fn=descriptor.value
        descriptor.value=function(){
            let value=fn.apply(this,arguments)
            msgChannel.publish(topic,value)
        }
    }
}
//这里定义了一个publish的修饰器，它通过改写descriptor.value，使得原方法被调用时，会自动发出一个事件，它使用的事件  发布/订阅 库是Postal.js
```
  用法如下：
```javascript
//index.js
import publish from './publish'
class FooComponent {
    @publish('foo.some.message','component')
    someMethod(){
        return {my:'data'}
    }
    @publish('foo.some.other')
    anotherMethod(){....}
}
let foo=new FooCOmponent()
foo.someMethod()
foo.anotherMethod()
//以后，只要调用someMethod或者anotherMethod，就会自动发出一个事件
$ bash-node index.js
频道:  component
事件:  foo.some.message
数据:  { my: 'data' }
频道:  /
事件:  foo.some.other
数据:  undefined
```
### 6.Mixin
  在修饰器的基础上，可以实现Mixin模式，所谓Mixin模式。就是对象继承的一种替代方案，中文叫做 混入，意味在一个对象之中混入另外一个对象的方法。
  举个栗子：
```javascript
const Foo={
    foo(){console.log('foo')}
}
class MyClass{}
Object.assign(MyClass.prototype,Foo)
let obj=new MyClass()
obj.f00()//'foo'
//对象Foo有一个foo方法，通过Object.assign方法，可以将foo方法混入MyClass类，导致MyClass的实例obj对象都具有foo方法
```
  写一个通用脚本mixins.js，将Mixin写成一个修饰器：
```javascript
export function mixins(...list){
    return function(target){
        Object.assign(target.prototype,...list)
    }
}
```
  然后，就可以使用上面这个修饰器，为类 混入 各种方法：
```javascript
import {mixins} from './mixins'
const Foo={
    foo(){console.log('foo')}
}
@mixins(Foo)
class MyClass{}
let obj=new MyClass()
obj.foo()//'foo'
//通过mixins这个修饰器，实现了在MyClass类上面  混入 Foo对象的foo方法
```
  不过上面的方法会改写MyClass类的prototype对象，如果不喜欢这一点的话，也可以通过类的继承实现Mixin：
```javascript
class MyClass extends MyBaseClass{.....}
//MyClass继承了MyBaseClass，如果想在MyClass里面 混入 一个foo方法，一个方法是在MyClass和MyBaseClass之间插入一个混入类，这个类具有foo方法，并且继承了MyBaseClass的所有方法，然后MyClass再继承这个类

let MyMixin=(superclass)=>class extends superclass{
    foo(){
        console.log('foo from MyMixin')
    }
}
//MyMixin是一个混入类生成器，接受superclass作为参数，然后返回一个继承superclass的子类，该子类包含一个foo方法

//接着目标类再去继承这个混入类，就达到了 混入 foo方法的目的
class MyClass extends MyMixin(MyBaseClass){....}
let c=new MyClass()
c.foo()//'foo from MyMixin'

//如果需要 混入 多个方法，就生成多个混入类
clas MyClass extends MiXin1(Mixin2(MyBaseClass)){.....}

//这种写法的好处是可以调用super，因此可以避免在 混入 过程中覆盖父类的同名方法
let Mixin1=(superclass)=>class extends superclass{
    foo(){
        console.log('foo from Mixin1')
        if (super.foo) super.foo()
    }
}
let Mixin2=(superclass)=>class extends superclass{
    foo(){
        console.log('foo from Mixin2')
        if(super.foo) super.foo()
    }
}
class s{
    foo(){
        console.log('fo from s')
    }
}
class C extends Mixin1(Mixin2(S)){
    foo(){
        console.log('foo from C')
        super.foo()
    }
}
//这段代码里，每次 混入 发生时，都调用了父类的super.foo方法，导致父类的同名方法没有被覆盖该，行为被保留了下来
new C().foo()
/*
	foo from c
	foo from Mixin1
	foo from Mixin2
	foo from S
*/
```
### 7.Trait
  Trait也是一种修饰器，效果与Mixin类似，但是提供更多的功能没比如防止同名方法的冲突、排除混入某些方法、为混入的方法起别名等。
  下面采用traits-decorator这第三方模块作为例子，这个模块提供的traits修饰器，不仅可以接受对象，还可以接受es6类作为参数：
```javascript
import {traits} from 'traits-decorator'
class TFoo{
    foo(){console.log('bar')}
}
@traits(TFoo,TBBar)
class MyClsass{}
let obj=new MyClass()
obj.foo()//foo
obj.bar()//bar
//通过traits修饰器，在MyClass类上面 混入 了TFoo类的foo方法和TBar对象的bar方法
```
  Trait不允许 混入 同名方法：
```javascript
import {traits} from 'traits-decorator'
class TFoo{
    foo(){
        console.log('foo')
    }
}
const TBar={
    bar(){console.log('bar')},
    foo(){console.log('foo')}
}
@traits(TFoo,TBar)
class MyClass{}
/*
	报错
	throw new Error('Method named: ' + methodName + ' is defined twice.');
		   ^
	Error: Method named: foo is defined twice.
	这段代码中，TFoo和TBar都有foo方法，结果traits修饰器报错
*/

//一种解决方法是排除TBar的foo方法
import {traits,excludes} from 'traits-decorator'
class TFoo{
    foo(){console.log('foo')}
}
const TBar={
    bar(){console.log('bar')},
    foo(){console.log('foo')}
}
@traits(TFoo,TBar::excludes('foo'))//使用 ::绑定运算符，混入时就不报错了
class MyClass{}
let obj=new MyClass()
obj.foo()//foo
obj.bar()//bar

//另一种方法是为TBar的foo方法起一个别名
import{traits,alias} from 'traits-decorator'
class TFoo{
    foo(){console.log('foo')}
}
const TBar={
    bar(){console.log('bar')}
    foo(){console.log('foo')}
}
@traits(TFoo,TBar::alias({foo:'aliasFoo'}))//在这儿起了别名，MyClass也可以混入TBar的foo方法了
class MyClass{}
let obj=new MyClass()
obj.foo()//foo
obj.aliasFoo//foo
obj.bar //bar
```
  alias和excludes方法，可以结合起来使用：
```javascript
@traits(TExample::excludes('foo','bar')::alias({baz:'exampleBaz'}))
class MyClass{}
//排除了TExample的foo方法和bar方法，为baz方法起了别名exampleBaz
```
  as方法则为上面的代码提供了另一种写法：
```javascript
@traits(TExample::as({excludes:['foo','bar'],alias:{baz:'exampleBaz'}}))
class MyClass{}
```
### 8.Babel转码器
  目前Babel转码器已经支持Decorator了。
  首先安装babel-core和babel-plugin-transform-decorators，由于后者包括在babel-preset-stage-0之中，所以改为安装babel-preset-stage-0亦可。
```javascript
npm install babel-core babel-plugin-transform-decorators
//然后设置配置文件.babelrc
{
    'plugins':['transform-decorators']
}
//这时，Babel就可以对Decorator转码了

//脚本中打开的命令如下：
babel.transform('code',{plugins:['transform-decorators']})
```


















