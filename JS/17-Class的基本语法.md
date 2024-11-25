## 十八、Class的基本语法
### 1.简介
  JavaScript语言中，生成实例对象的传统方法是通过构造函数，举个栗子：
```javascript
function Point(x,y){
    this.x=x;
    this.y=y
}
Point.prototype.toString=function(){
    return '()'+this.x+','+this.y+')'
}
var p=new Point(1,2)
```
  es6提供了更接近传统语言的写法，引入了Class这个概念，作为对象的模板，通过class关键字，可以定义类。基本上，es6的class可以看做只是一个语法糖，它的绝大部分功能，es5都可以做到，新的class写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。上面的代码用es6的class改写，是这样的：
```javascript
//定义类
class Point{
    constructor(x,y){
        this.x=x;
        this.y=y;
    }
    toString(){
        return '()'+this.x+','+this.y+')'
    }
}
//这段代码定义了一个类，里面有一个constructor方法，这个是构造方法，this关键字则代表实例对象，也就是说es5的构造函数Point，对应es6的Point类的构造方法。Point类除了构造方法，还定义了一个toString方法，定义 类 的方法的时候，前面不需要加上function这个关键字，直接把函数定义放进去了就行了。另外，方法之间不需要逗号分割，加了会报错
```
  es6的类，完全可以看作构造函数的另一种写法：
```javascript
class Point{....}
typeof Point//'function'
Point === Point.prototype.constructor//true
//这就表明了，类的数据类型就是函数，类本身就指向构造函数
```
  使用的时候，也是直接对类使用new命令，跟构造函数的用法一致：
```javascript
class Bar{
    doStuff(){}{
        console.log('stuff')
    }
}
var b=new Bar()
b.doStuff()//'stuff'
```
  构造函数的prototype属性，在es6的 类 上面继续存在，类的所有方法都定义在类的prototype属性上面：
```javascript
class Point {
  constructor() {.... }
  toString() {....}
  toValue() {....}
}
// 等同于
Point.prototype = {
  constructor() {},
  toString() {},
  toValue() {},
};
```
  在类的实例上面调用方法，其实就是调用原型上的方法：
```javascript
class B {}
let b=new B{}
b.constructor===B.prototype.constructor//true
//b是B的实例，它的constructor方法就是B类原型的constructor方法
```
  由于类的方法都定义在prototype对象上面，所以类的新方法可以添加在prototype对象上面。Object.assign方法可以很方便地一次向类添加多个方法：
```javascript
class Point{
    constructor(){...}
}
Object.assign(Point.prototype,{
    toString(){},
    toValue(){}
})
```
  prototype对象的constructor属性，直接指向 类 本身，这与es5的行为是一致的：
```javascript
Point.prototype.constructor ===Piont//true
```
  另外，类的内部所有定义的方法，都是不可枚举的：
```javascript
class Point{
    consrtuctor(x,y){....}
    toString(){....}
}
Object.keys(Point.prototype)//[]
Object.getOwnPropertyNames(Point.prototype)//['constructor','toString']
//toString方式Point类内部定义的方法，它是不可枚举的，这一点与es5的行为不一致
var Point=function(x,y){...}
Point.prototype.toString=function(){....}
Object.keys(Point.prototype)//['toString']
Object.getOwnPropertyNames(Point.prototype)//['constructor','toString']
//这里采用es5的写法，toString方法就是可枚举的
```
  类的属性名，可以采用表达式：
```javascript
let methodName='getArea'
class=Aquare{
    constructor(length){...}
    [methodName](){....}
}
//Square类的方法名getArea，是从表达式得到的
```
### 2.严格模式
  类和模块的内部，默认就是严格模式，所以不需要使用use strict 指定运行模式，只要代码写在类或模块之中，就只有严格模式可用。其实以后所有的代码，其实都是运行在模块之中，所以es6实际上是把整个语言升级到了严格模式。
### 3.constructor方法
  constructor方法是类的默认方法，通过new命令生成对象实例时，自动调用该方法。一个类必须有constructor方法，如果没有显式定义，一个空的constructor方法会被默认添加：
```javascript
class Point{}
//相当于
class Point{
    constructor(){}
}
//定义空类Point的时候，JavaScript引擎就会自动给它添加一个空的constructor方法
```
  constructor方法默认返回实例的对象（this），完全可以指定返回另外一个对象：
```javascript
class Foo{
    constructor(){
        return Object.xreate(null)
    }
}
new Foo() instanceof Foo//false
//constructor函数返回一个全新的对象，结果导致实例对象并不是Foo类的实例
```
  类必须使用new 调用，否则会报错，这是它跟普通构造函数的一个主要区别，后者不用new也可以执行：
```javascript
class Foo{
    constructor(){
        return Object.create(null)
    }
}
Foo()//报错：Class constructor Foo cannot be  invoked without 'new'
```
### 4.类的实例对象
  生成类的实例对象的写法，与es5完全一样，也是使用new命令，如果忘记加new，是会报错的：
```javascript
class Point{...}
//报错
var  point=Point(2,3)
//正确的
var point=new Point(2,3)
```
  与es5一样，实例的属性除非显式定义在其本身（就是定义在this对象上），否则都是定义在原型上（即定义在class上）
```javascript
//定义类
class Point{
    constructor(x,y){
        this.x=x;
        this.y=y
    }
    toString(){
        return '('+this.x+','+this.y+')'
    }
}
var point=new Point(2,3)
point.toString()//(2,3)
point.hasOwnProperty('x')//true
point.hasOwnProperty('y')//true
point.hasOwnProperty('toString')//false
point.__proto__.hasOwnProperty('toString')//true
//x和y都是实例对象point自身的属性，所以hasOwnProperty方法返回的都是true，而toString是原型对象的属性，所以hasOwnProperty方法返回false
```
  与es5一样，类的所有实例共享一个原型对象：
```javascript
var p1=new Point(2,3)
var p2=new Point(3,2)
p1.__proto===p2.proto//true
//p1和p2都是Point的实例，它们的原型都是Point.prototype，所以__proto__属性是相等的
```
  这也意味着，可以通过实例的\_\_proto\_\_属性为 类 添加方法。\_\_proto\_\_并不是语言本身的特性，这是各大厂商具体实现时添加的私有属性，虽然 目前很多浏览器的JS引擎都提供了这个私有属性，但依旧不建议在生产中使用该属性，避免对环境产生依赖。生产环境中，可以使用Object.getPrototypeOf方法来获取实例对象的原型，然后再来为原型添加方法/属性：
```javascript
var p1=new Point(2,3)
var p2=new Point(3,2)
p1.__proto__.printName=function(){return 'vae'}
p1.printName()//'vae'
p2.printName()//'vae'
var p3=new Point(4,2)
p3.printName()//'vae'
//这段代码在p1的原型上添加了一个printName方法，由于p1的原型就是p2的原型，因此p2也可以调用这个方法，而且此后新建的实例p3也可以调用这个方法，这意味着，使用实例的__proto__属性改写原型，必须相当谨慎，并不推荐使用，因为这回改变 类 的原始定义，影响到所有实例，再说了，孩子都有了，改什么爹啊，要改也是应该在没生孩子之前改哇
```
### 5.Class表达式
  与函数一样，类也可以使用表达式的形式定义：
```javascript
const MyClass=class Vae{
    getClassName(){
        return Vae.name
    }
}
//这里使用表达式定义了一个类，这里类的名字是MyClass而不是Vae，Vae只在Class的内部代码可用，指代当前类
```
```javascript
let inst=new MyClass
inst.getClassName()//Vae
Vae.name// 报错：Vae is not defined，Vae只在Class内部有定义

//如果类的内部没有用到的话，可以省略Vae，也就是可以写成下面的形式：
const MyClass=class{.....}
```
  采用Class表达式，可以写出立即执行的Class：
```javascript
let person=new class{
    constructor(name){
        this.name=name
    }
    sayName(){
        console.log(this.name)
    }
}('张三')
person.sayName()//'张三'，person是一个立即执行的类的实例
```
### 6.不存在变量提升
  类不存在变量提升：
```javascript
new Foo()//ReferenceEror
class Foo{}
//Foo类使用在前，定义在后，这样会报错，因为es6不会把类的声明提升到代码头部，这种规定的原因是与下面要说的继承有关，必须保证子类在父类之后定义
```
```javascript
{
    let Foo=class {}
    class Bar extends Foo{}
}
//这里不会报错，因为Bar继承Foo的时候，Foo已经有定义了，但是如果存在class的提升，上面的代码就会报错，因为class会被提升到代码头部，而let命令是不提升的，所以导致Bar继承Foo的时候，Foo还没有定义
```
### 7.私有方法和私有属性
#### 7.1 现有的方法
  私有方法是常见的需求，但是es6不提供，只能通过变通方法模拟实现，一种做法是在命令上加以区别：
```javascript
class Widget{
    //公有方法
    foo(baz){
        this._bar(baz)
    }
    //私有方法
    _bar(baz){
        return this.snaf=baz;
    }
    //...
}
//这段代码中_bar方法前面的下划线，表示这只是一个只限于内部使用的私有方法，但是这种命名是不保险的，在类的外部，还是可以调用到这个方法
```
  另一种方法就是索性将私有方法移出模块，因为模块内部的所有方法都是对外可见的：
```javascript
class Widget{
    foo(baz){
        bar.call(this,baz)
    }
    //...
}
function bar(baz){
    return this.snaf=baz
}
//foo是公有方法，内部调用了bar.call(this,baz)，这使得bar实际上成为了当前模块的私有方法
```
  还有一种方法是利用Symbol值的唯一性，将私有方法的名字命名为一个Symbol值：
```javascript
const bar=Symbol('bar')
const snaf=Symbol('snaf')
export default class myClass{
    //公有方法
    foo(baz){
        this[bar](baz)
    }
    //私有方法
    [bar](baz){
        return this[snaf]=baz
    }
    //....
}
//bar和snaf都是Symbol的值，导致第三方无法获取到它们，因此达到了私有方法和私有属性的效果
```
#### 7.2 私有属性的提案
  与私有方法一样，es6不支持私有属性，目前有提案，为class加了私有属性，方法是在属性名之前，使用#表示：
```javascript
class Point{
    #x;
    constructor(x=0){
        #x=+x;//写成this.#x也可以
    }
    get x(){return #x}
    set x(value)(#x=+value)
}
//这个代码里面，#x就是私有属性，在Point类之外是读取不到这个属性的，由于#是属性名的一部分，使用时必须带有#一起使用，所以#x和x是两个不同的属性
```
  私有属性可以指定初始值，在构造函数执行时进行初始化：
```javascript
class Point{
    #x=0;
    constructor(){
        #x;//0
    }
}
```
  之所以要引入一个新的前缀#表示私有属性，而没有采用private关键字，是因为JavaScript是一种动态语言，使用独立的符号似乎是比较可靠的方法，能够准确的区分一种属性是否为私有属性。另外，Ruby语言使用@表示私有属性，es6没有用这个符号而使用#，是因为@已经被留给了Decorator，这种写法 不仅可以写私有属性，还可以用来写私有方法：
```javascript
class Foo{
    #a;
    #b;
    #sum(){return #a+#b}
    printSum(){console.log(#sum())}
    constructor(a,b){#a=a;#b=b}
}
//#sum就是一个私有方法。
```
  另外，私有属性也可以设置getter和setter方法：
```javascript
class Counter{
    #xValue=0;
    get #x(){return #xValue}
    set #x(value){
        this.#xValue=value
    }
    constructor(){
        super()
        //.....
    }
}
//#x是一个私有属性，它的读写都通过get #x()和set #x()来完成
```
#### 7.3 this的指向
  类的方法内部如果含有this，它默认指向类的实例，但是必须非常小心，如果一旦单独使用该方法，很可能报错:
```javascript
class Logger{
    printName(name='there'){
        this.print(`hello${name}`)
    }
    print(text){
        console.log(text)
    }
}
const logger=new Logger()
const {printName}=logger
printName()//报错：Cannot read property 'print' of undefined
//printName方法中的this，默认指向Logger类的实例，但是如果将这个方法提取出来单独使用，this会指向该方法运行时所在的环境，因为找不到print方法而导致报错
```
  一个比较简单的解决方法是，在构造方法中绑定this，这样就不会找不到print方法了：
```javascript
class Logger{
    constructor(){
        this.printName=this.printName.bind(this)
    }
}
```
  另一种解决方法是使用箭头函数：
```javascript
class Logger{
    constructor(){
        this.printName=(name = 'there') => {
            this.print(`hello${name}`)
        }
    }
}
```
  还要一种解决方法是使用Proxy，获取方法的时候，自动绑定this：
```javascript
function selfish(target){
    const cache=new WeakMap();
    const  handler={
        get (target,key){
            const value=Reflect.get(target,key)
            if(typeof value !== 'function'){
                return value
            }
            if(!cache.has(value)){
                cache.set(value,value.bind(target))
            }
            return cache.get(value)
        }
    }
    const proxy=new Proxy(target,handler)
    return proxy
}
const logger=selfish(new Logger())
```
### 9.name属性
  由于本质上，es6的类只是es5的构造函数的一层包装，所以函数的许多特性都被Class继承，包括name属性：
```javascript
class Point{}
Point.name //'Point'
```
  name属性总是返回紧跟在class关键字后面的类名。
### 10.Class的 getter 和 setter
  与es5一样，在 类 的内部可以使用get和set关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为：
```javascript
class MyClass{
    conostructor(){....}
    get prop(){return 'getter'}
    set prop(value){console.log('setter:'+value)}
}
let inst=new MyClass()
inst.prop=123//setter:123
inst.prop //'getter'
//prop属性有对应的寸值函数和取值函数，因此赋值和去读行为都被自定义了
```
  寸值函数和取值函数是设置在属性的Descriptor对象上的：
```javascript
class CustomHTMLElement{
    constructor(elment) {
        this.element=element
    }
    get html(){
        return this.element.innerHTML;
    }
    set html(value){
        this.element.innerHTML=value
    }
}
var descriptor=Object.getOwnPropertyDescriptor(
	CunstomHTMLElement.prototype,'html'
)
'get' in descriptor//true
'set' in descriptor//true
//寸值函数和取值函数是定义在html属性的描述对象上面的，和es5一致
```
### 11.Class的Generator方法
  如果某个方法之前加上 星号，就表示该方法是一个Generator函数：
```javascript
class Foo {
  constructor(...args) {
    this.args = args;
  }
  * [Symbol.iterator]() {
    for (let arg of this.args) {
      yield arg;
    }
  }
}
for (let x of new Foo('hello', 'world')) {
  console.log(x);
}
// hello
// world
//Foo类的Symbol.iterator方法前有一个星号，表示该方法是一个 Generator 函数。Symbol.iterator方法返回一个Foo类的默认遍历器，for...of循环会自动调用这个遍历器。
```
### 12.Class的静态方法
  类相当于实例的原型，所以在类中定义的方法，都会被实例继承，如果在一个方法前，加上static关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就成为 静态 方法
```javascript
class Foo {
  static classMethod() {
    return 'hello';
  }
}
Foo.classMethod() // 'hello'
var foo = new Foo();
foo.classMethod()// 报错: foo.classMethod is not a function
//Foo类的classMethod方法前有static关键字，表明该方法是一个静态方法，可以直接在Foo类上调用（Foo.classMethod()），而不是在Foo类的实例上调用。如果在实例上调用静态方法，会抛出一个错误，表示不存在该方法。
```
  注意，如果静态方法包含this关键字，这个this指的是类，而不是实例：
```javascript
class Foo {
  static bar () {
    this.baz();
  }
  static baz () {
    console.log('hello');
  }
  baz () {
    console.log('world');
  }
}
Foo.bar() // hello
//静态方法bar调用了this.baz，这里的this指的是Foo类，而不是Foo的实例，等同于调用Foo.baz。另外，从这个例子还可以看出，静态方法可以与非静态方法重名。
```
  父类的静态方法，可以被子类继承：
```javascript
class Foo {
  static classMethod() {
    return 'hello';
  }
}
class Bar extends Foo {}
Bar.classMethod() // 'hello'
```
  静态方法也是可以从super对象上调用的：
```javascript
class Foo {
  static classMethod() {
    return 'hello';
  }
}
class Bar extends Foo {
  static classMethod() {
    return super.classMethod() + ', too';
  }
}
Bar.classMethod() // "hello, too"
```
### 13.Class的静态属性和实例属性
  静态属性指的是Class本身的属性，即Class.propName，而不是定义在实例对象上的属性：
```javascript
class Foo {
}
Foo.prop = 1;//Foo类定义静态属性prop
Foo.prop // 1
```
  目前，只有这种写法可行，因为es6明确规定，Class内部只要静态方法，没有静态属性：
```javascript
//以下两种写法都无效
class Foo{
    //写法一
    prop:2
    //写法二
    static prop:2
}
Foo.prop //undefined
```
  目前有一个静态属性的提案，对实例属性和静态属性都规定了新的写法
  - 类的实例属性
```javascript
//类的实例属性可以用等式，写入类的定义之中。
class MyClass {
  myProp = 42;
  constructor() {
    console.log(this.myProp); // 42
  }
}
//myProp就是MyClass的实例属性。在MyClass的实例上，可以读取这个属性。

//以前，定义实例属性，只能写在类的constructor方法里面。
class ReactCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
}
//构造方法constructor里面，定义了this.state属性。

//有了新的写法以后，可以不在constructor方法里面定义。
class ReactCounter extends React.Component {
  state = {
    count: 0
  };
}
//这种写法比以前更清晰。

//为了可读性的目的，对于那些在constructor里面已经定义的实例属性，新写法允许直接列出。
class ReactCounter extends React.Component {
  state;
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
}
```
  - 类的静态属性
```javascript
//类的静态属性只要在上面的实例属性写法前面，加上static关键字就可以了。
class MyClass {
  static myStaticProp = 42;
  constructor() {
    console.log(MyClass.myStaticProp); // 42
  }
}
//同样的，这个新写法大大方便了静态属性的表达。

// 老写法
class Foo {....}
Foo.prop = 1;
// 新写法
class Foo {
  static prop = 1;
}
//老写法的静态属性定义在类的外部。整个类生成以后，再生成静态属性。这样让人很容易忽略这个静态属性，也不符合相关代码应该放在一起的代码组织原则。另外，新写法是显式声明（declarative），而不是赋值处理，语义更好。
```
### 14.new.target属性
  new是从构造函数生成实例对象的命令。es6为 new命令引入了一个new.target属性，该属性一般用在构造还是那会之后，返回new命令作用于的那个构造函数，如果构造函数不是通过new命令调用的，new.target会返回undefined，因此这个属性可以用来确定构造函数是怎么调用的:
```javascript
function Person(name) {
  if (new.target !== undefined) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 命令生成实例');
  }
}
// 另一种写法
function Person(name) {
  if (new.target === Person) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 命令生成实例');
  }
}
var person = new Person('张三'); // 正确
var notAPerson = Person.call(person, '张三');  // 报错
//这段代码确保构造函数只能通过new命令调用。

//Class 内部调用new.target，返回当前 Class。
class Rectangle {
  constructor(length, width) {
    console.log(new.target === Rectangle);
    this.length = length;
    this.width = width;
  }
}
var obj = new Rectangle(3, 4); // 输出 true

//需要注意的是，子类继承父类时，new.target会返回子类。
class Rectangle {
  constructor(length, width) {
    console.log(new.target === Rectangle);
    // ...
  }
}
class Square extends Rectangle {
  constructor(length) {
    super(length, length);
  }
}
var obj = new Square(3); // 输出 false
```
```javascript
//上面代码中，new.target会返回子类。利用这个特点，可以写出不能独立使用、必须继承后才能使用的类。
class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new Error('本类不能实例化');
    }
  }
}
class Rectangle extends Shape {
  constructor(length, width) {
    super();
    // ...
  }
}

var x = new Shape();  // 报错
var y = new Rectangle(3, 4);  // 正确
//Shape类不能被实例化，只能用于继承。注意，在函数外部，使用new.target会报错。
```























