##一、let 和 const
###1.let命令
  es6新增命令let，用来声明变量，用法和var类似，但是let声明的变量仅在当前代码块儿内有效。
```javascript
{
  let a = 1;
  var b = 2;
}
a // 错误：a is not defined，
b // 2
```
  for循环的计数器，用let命令就很好：
```javascript
for (let i =0; i<10; i++){
  // ....do something
}
console.log(i);// i is not defined
```
  上面的代码里面，i就是只在循环体里面有效，如果用var的话：
```javascript
var a = [];
for(var i=0; i<10; i++){
  a[i] = function() {
    console.log(i)
  }
}
a[6]()//10,因为变量i是var声明的，所以在全局范围内都有效，所以全局只有一个变量i，每次循环，变量i的值都会发生改变，而循环内被赋给数组a的函数内部的console.log(i)，里面的i指向全局的i，也就是说，所有数组a的成员里面的i指向的都是一个i，所以最后运行输出的总是最后一轮的i，所以是10.

/*使用let*/
var a = [];
for (let i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i);
  };
}
a[6](); // 6，使用let的话，声明的变量仅在块级作用域内有效，当前i只在本轮循环有效，所以每一次循环i其实都是一个新的变量，所以最后输出的是6.而由于JavaScript引擎内部会记住上一轮循环的值，初始化本轮的变量i的时候，并不会还是从0开始，而是直接在上一轮的循环基础上进行计算。
```
  此外，for循环还有一个特别的地方，设置循环变量的那部分是一个父级作用域，而循环体内部是一个单独的子作用域。
```javascript
  for (let i = 0; i < 3; i++) {
  let i = 'abc';
  console.log(i);//输出三次abc，因为函数内部的变量i与循环变量i不在同一个作用域，有各自单独的作用域
}
```
#### 1.1 不存在声明提前
  var命令会有声明提前的现象，就是变量可以在声明之前使用，值为undefined，这样是比较奇怪的，一般情况下应该是声明之后才能用才对，let改变了这个语法行为，它所声明的变量一定是要在声明之后使用，不然就报错：
```javascript
console.log(a);//undefined,因为a是用var声明的，会被声明提前，在脚本开始运行的时候，a就被提到了代码最前面，但是赋值留在原地，所以输出undefined
var a=0;
console.log(b);//报错，b用let声明，不会发生声明提前，在这个代码用到b的时候，b还不存在，所以直接报错
let b=1;
```
#### 1.2 暂时性死区
  只要块级作用域内存在let命令，它所声明的变量就binding这个区域，不再受外部的影响了：
```javascript
var n=123;
if(1){
  n='123';//引用错误
  let n;
}
/*
  因为存在全局变量n，然后块级作用域内又声明了一个局部变量n，导致后者绑定这个块级作用域，所以在这个if里面，n没有被声明就用了，就报错了。es6明确规定，如果区块中存在let和const命令，这个区块对这些命令声明的变量从一开始就形成了封闭作用域，凡是在声明之前就使用了这些变量，就会报错。
*/
```
  总之，在代码块内，使用let命令声明变量之前，该变量都是不可用的，这在语法上称为“暂时性死区”（temporal dead zone，简称 TDZ）
```javascript
if (1){
  //TDZ开始
  n='123';//引用错误
  console.log(n);;//引用错误
  let n;//TDZ结束
  console.log(n);//undefined，因为还没赋值
  n=123;
  console.log(n)//123
}
```
  在上面的代码中，在let命令声明变量n之前，都属于变量n的死区，“暂时性死区”也意味着typeof也不再是一个安全的操作：
```javascript
typeof x;//引用错误
let x;
//因为x用let声明，在let之前都是x的死区，只要使用就会报错。

typeof suibainVal///如果一个变量没有被声明，反而只是输出undefined
```
  有些死区比较隐蔽，不容易被发现：
```javascript
function fun(x = y, y = 2) {
  return [x, y];
}
fun(); // 报错，因为参数x默认值是y，而y还没有被声明，属于死区

//另一种情况
function fun(x = 2, y = x) {
  return [x, y];
}
fun(); // [2, 2]，但是反过来，因为x已经声明过了，就不会报错
```
  还有这样的：
```javascript
var x = x;//不报错
let x=x;//报错，x is not defined，因为x还没被声明，就要去用它的值，当然会报错。
```
  es6规定暂时性死区和let，const语句不出现声明提前，主要是为了减少运行时的错误，防止变量在声明前就使用这个变量，从而导致意料之外的行为。暂时性死区的本质，就是只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只有等待声明变量的那个代码出现了，才能获取和使用该变量。
#### 1.3 不允许重复声明
  let不允许在相同的作用域内（敲黑板，作用域内~），重复声明同一个变量：
```javascript
function fun() {//报错
  let a=1;
  let a=2;
}
//不要在函数内部重新声明参数：
function fun(arg){
  let arg;;//报错
}
function fun(arg){
  {
    let arg;//不报错
  }
}
```
### 2.块级作用域
#### 2.1 WHY
  es5只有全局作用域和函数作用域，没有块级作用域，这样很不合理：
  第一，内层变量可能会覆盖外层变量：
```javascript
var tmp = new Date();
function f() {
  console.log(tmp);
  if (0) {
    var tmp = 'hello world';
  }
}
f(); // undefined,这个代码本来是if代码块的外部使用外层的tmp变量，内部使用内层的tmp变量，但是函数if执行之后，输出undefined，即使因为声明提前，内层的tmp覆盖掉了外层的tmp。
```
  第二，for循环里面用来计数的变量泄露为全局变量：
```javascript
var s = 'hello';
for (var i = 0; i < s.length; i++) {
  console.log(s[i]);
}
console.log(i); // 5，本来i只用来控制循环，当时循环结束以后i仍然存在，泄露成了全局变量。
```
#### 2.2 es6的块级作用域
  let为JS新增了块级作用域：
```javascript
function f1() {
  let n = 5;
  if (true) {
    let n = 10;
  }
  console.log(n); // 5,函数里面有两个代码块都声明了n，最后运行输出5，说明外层代码块不受内层代码块的影响，如果两次都使用var定义变量n的话，最后输出的就是10了
}
```
  es6允许块级作用域随意嵌套，外层作用域始终无法读取内层作用域的变量，内层作用域可以定义外层作用域的同名变量，有了块级作用域，就不需要再大量使用匿名函数自调了。
#### 2.3 块级作用域与函数声明
  es5规定，函数只能在顶层作用域和函数作用域之中声明，不能在块级作用域中声明：
```javascript
if(1){ // 非法
  function fun(){}
}
try{// 非法
  function fun() {}
} catch(e){}
// 上面这两种函数声明，在es5上都是非法的，但是浏览器没有遵守这个规定，为了兼容以前的旧代码，还是支持在块级作用域之中声明函数，因此上面两种情况实际都能运行，不会报错。
```
  es6引入了块级作用域，明确允许在块级作用域之中声明函数，es6规定，块级作用域之中，函数声明语句的行为类似let，在块级作用域之外不可引用。
```javascript
function fun() {console.log(1)}
(function() {
  if(0){
    // 重复声明一次函数fun
    function fun() {console.log(2)}
  }
  fun();
}());
```
  上面代码在es5中，会输出2，因为在if内声明的函数fun会被声明提前，所以其实真正运行的时候，代码顺序是这样的：
```javascript
function fun(){console.log(1)}
(function() {
  function fun() {console.log(2)}
  if(0){}
  fun();
}())
```
  es6就完全不一样了，理论上会得到1，因为块级作用域内声明的函数类似于let，对作用域之外没有影响，但是如果真的在es6浏览器中运行，是会报错的，因为如果改变了块级作用域内声明的函数的处理规则，显然会对老代码产生很大的影响，为了减轻因此产生的不兼容问题，es6有规定浏览器可以不完全遵守规定，可以有自己的行为方式。
  - 允许在块级作用域内声明函数
  - 函数声明类似于var，即会提升到全局作用域或函数作用域的头部
  - 同时和函数声明还会提升到所在的块级作用域的头部
      不过，这三条规则只对es6的浏览器实现有效，其它环境的实现不用遵守，还是将块级作用域的函数声明当做let处理。
        根据这三条规则，在浏览器的es6环境中，块级作用域内声明函数，行为类似于var声明的变量。
```javascript
//  浏览器的es6环境
function fun() {console.log(1)}
(function () {
  if (0){
  // 重复声明一次函数fun
    function fun() {console.log(2)}
  }
  f();
}());
// 报错 fun is not a function
```
  因为实际运行的时候，代码顺序是这样：
```javascript
function fun() {console.log(1)}
(function() {
  var fun=undefined;
  if(0){
    function fun() {console.log(2)}
  }
  fun();// fun is not a function
}())
```
  考虑到环境导致的行为差异太大，应该避免在块级作用域内声明函数，如果确实需要，也应该写成函数表达式，而不是函数声明语句：
```javascript
// 函数声明语句
{
  let a =1;
  function fun() {
    return a;
  }
}
// 函数表达式
{
  let a = 1;
  let fun = function () {
    return a;
  }
}
```
  另外，还有一个需要注意的地方，es6的块级作用域允许声明函数的规则，只在只用大括号的情况下成立，如果没有使用大括号，就会报错：
```javascript
'use strict';
if(1){
  function fun() {}//不报错
}
'use strict'
if (0) 
  function fun(){}//报错
```
###3.const命令
####3.1 基本用法
  const声明一个只读的常量，一旦声明，常量的值既不能改变：
```javascript
const PPI = 3.14;
PI;//3.14
PI = 3//报错，Assignment to constant variable.
```
  因为const声明的变量不能改变值，所以const一旦声明变量就要立刻初始化，不能留到以后赋值：
```javascript
  const tmp;// 只声明不赋值，Missing initializer in const declaration
```
  const的作用域与let命令一样，只在声明所在的块级作用域内有效：
```javascript
  if(1){
    const NUM = 1;
  }
  NUM;//报错，NUM is not defined
```
  const命令声明的常量也没有声明提前，同样存在暂时性死区，只能在声明的位置后面使用：
```javascript
if(1){
  console.log(NUM);//报错，NUM is not defined
  const NUM=1;
}
```
  const声明的变量，和let一样不可重复声明：
```javascript
var str='緑間どこ'
let num=1;
//下面的都会报错
const str = 'ここです'
const num=1;
```
####3.2 本质
  const实际上保证的，并不是变量的值不能改动，而是变量指向的那个内存地址不得改动，对于简单类型的数据值就保存在变量指向的那个地址，所以相当于是常量。但是对于复合类型的数据，变量指向的那个内存地址，保存的就是一个指向，const只能保证这个指向是固定的，至于它指向的数据结构是不是可变的，就完全不能控制了，看图：
![图片](const.png)
  再比如：
```javascript
cosnt a=[];
a.push(1)//执行
a.length=0;//执行
a=[0]//报错
//常量a作为一个数组，这个数组本身是可写的，但是如果将另一个数组赋值给a，就会报错
```
  如果想将对象冻结的话，应该使用object.freeze方法：
```javascript
const tmp=Object.freeze({})
tmp.num=1;//因为常量tmp是一个被冻结的对象，常规模式，下面一行不起作用，严格模式，改行报错
```
  除了将对象本身冻结，对象的属性也应该被冻结：
```javascript
var freezeFun = (obj)=>{
  Object.freeze(obj);
  Object.keys(obj).forEach((key,i)=>{
    if(typeof obj[key]==='object'){
      freezeFun(obj[key])
    }
  })
}
```
### 4.顶层对象的属性
  顶层对象，在浏览器环境指的是window对象，在Node指的是global，es5中，顶层对象的属性与全局变量是等价的：
```javascript
window.a=1;
a;//1
a=2;
window.a;//2
//顶层对象的属性赋值与全局变量大的赋值，是一样的
```
  顶层对象的属性与全局变量挂钩，会有很大的问题，首先是没办法在编译的时候就报出变量未声明的错误，只有运行的时候才能知道，因为全局变量可能是顶层对象的属性创造的，而属性的创造是动态的；其次如果因为打错字什么的很容易就创建了一个全局变量出来，最后顶层对象的属性是导出可以读写的，这非常不利于模块化编程，另一方面，window对象有实体含义，指的是浏览器的窗口对象。
  es6就规定了，一方面为了保证兼容性，var命令和function命令声明的全局变量，依旧是顶层对象的属性，另一方面let命令、const命令、class命令声明的全局变量，不属于顶层对象的属性。全局变量逐步要与顶层对象属性脱钩。
```javascript
var a=1;
window.a;//1
let b=1;
window.b;//undefined
```
###5.global对象
  es5的顶层对象，本身也是一个问题，因为它在各种实现里面是不统一的
  - 浏览器里面，顶层对象是window，但是node和webworker没有window
  - 浏览器和webworker里面，self也指向顶层独享，但是node没有self
  - node里面，顶层对象是global，但是其它环境都不支持
    同一段代码为了能够在各种环境中都能取到顶层对象，现在一般是使用this变量，但是有局限性：
  - 全局环境中，this会返回顶层对象。但是，Node 模块和 ES6 模块中，this返回的是当前模块。
  - 函数里面的this，如果函数不是作为对象的方法运行，而是单纯作为函数运行，this会指向顶层对象。但是，严格模式下，这时this会返回undefined。
  - 不管是严格模式，还是普通模式，new Function('return this')()，总是会返回全局对象。（如果浏览器用了内容安全政策，那eval，new Function这些方法可能无法使用）
    综上，很难找到一种可以在所有情况下都取到顶层对象的方法，然后有两种可以使用的方法，虽然有点勉强：
```javascript
//一
(typeof window !== 'undefined'?window:
  (typeof process === 'object' && typeof require === 'function' && typeoof global === 'object')? global:this)
  //二、
var getGlobal = function () {
  if (typeof self !== 'undefined') { return self; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  throw new Error('本地全局对象不可用');
}
```
```txt
  某个提案，在语言标准的层面，引入global作为顶层对象。
  比如：
  var global = require('system.global')()
  或者用es6的写法：
  import getGlobal from 'system.global';
  const global = getGlobal();
  这样就把顶层对象放入了变量global里。
```

## 二、变量的解构赋值
### 1.数组的解构赋值
#### 1.1 基本用法
  es6允许按照一定的模式，从数组和对象中提取值，对变量进行赋值，被称为解构：
```javascript
//以前赋值只能这样写：
let a=1;
let b=1;
let c=3;
//es6可以写成这样：
let [a,b.c]=[1,2,3]//这个就表示，可以从数组中提取值，按照对应位置，对变量赋值
```
  本质上这种写法属于“模式匹配”，只要等号两边的模式相同，左边的变量就会被赋予对应的值，嵌套数组进行结构大概有这么几种：
```javascript
let [a,[[b],c]]=[1,[[2],3]];
a//1
b//2
c//3

let [,, third]=[1,2,3]
third//3

let [x,,y]=[1,2,3]
x//1
y//3

let [a,...b]=[1,2,3,4]
a//1
b//[2,3,4]

let [x,y,...z]=[1]
x//1
y//undefined
z//[]
```
  如果解构不成功，变量的值就等于undefined。
```javascript
let [b]=[]
let [a,b]=[1]
//解构不成功，b的值都是undefined
```
  有的时候出现不完全解构的情况，就是等号左边的模式，只匹配一部分的等号右边的数组，这种情况下，解构依然可以成功：
```javascript
let [x,y]=[1,2,3]
x//1
y//2
let [a,[b],d]=[1,[2,3],4]
a//1
b//2
d//4
```
  如果等号右边不是数组（不能被遍历的解构），就会报错
```javascript
let [a]=1;
let [a]=false;
let [a]=NaN;
let [a]=undefined;
let [a]=null;
let [a]={}
//报错，因为等号右边的值，要么转换为对象以后不具备遍历器节后（前五个就是这样），要么本身不具备遍历器接口（最后一个表达式）
```
  对于set解构，也可以使用数组的解构赋值：
```javascript
let [x,y,z]new Set([1,2,3])
x//1
```
  所以，其实只要是某种数据解构具有遍历器接口，都可以采用数组形式的解构赋值。
```javascript
function* fun() {//Generator函数
  let a=0;
  let b=1;
  while(1){
    yield a;//产出
    [a,b]=[b,a+b]
  }
}
let [one,two,three,four,five,six]=fun()
//fun()是一个Generator函数，原生具有遍历器接口，解构赋值会依次从这个接口获取值
```
#### 1.2 默认值
  解构赋值允许指定默认值：
```javascript
let [a=true]=[];
a//true
let [a,b=1]=[0]
a//0
b//1
let [a, b=1][0,undefined]
a//0
b//1
//es6内部使用 === 运算符判断一个位置是否有值，所以只有当一个数组成员严格等于undefined默认值才会生效
```
```javascript
let [x=1]=[undefined]
x//1
let [x=1]=[null]
x//null
//如果一个数组成员是null，默认值就不会生效，因为null不严格等于undefined
```
  如果默认值是一个表达式，那么这个表达式是惰性求值的，即只有在用到的时候，才会求值：
```javascript
function fun() {
  console.log(1)
}
let [x=fun()]=[1]
x//1,因为x可以在后面取到值，所以函数fun不会被执行，所以执行的时候代码其实是这样的：

let x;
if([1][0]===undefined){
  x=fun()
}else {
  x=[1][0]
}
```
  默认值可以引用解构赋值的其它变量，但是该变量必须已经声明：
```javascript
let [a=1,b=a]=[];//a=1,b=1
let [a=1,b=a]=[2];//a=1,b=2
let [a=1,b=2]=[2];//a=1,b=2
let [a=b,b=1]=[];//报错，b is not defined，用到b的时候，b还没声明出来
```
### 2.对象的解构赋值
  解构同样可以用于对象：
```javascript
let {a,b}={a:1, b:2}
a//1
b//2
```
  对象的解构与数组有一个很大的不同，数组的元素是按照顺序排列的，变量的取值是由位置决定的，而对象的属性没有次序，变量必须与属性同名，才能取到正确的值。
```javascript
let {a,b}={b:2,a:2}//a=2,b=2,等号左边的两个变量的顺序与等号右边的
let {a}={b:1,c:2};
a//undefined，a变量没有对应的同名属性，导致取不到值，所以是undefined
```
  如果变量名与属性名不一致，得写成下面这个样子：
```javascript
let {a:b}={b:1,c:2}
a//1
let obj={x:1,y:2};;
let {x:a,y:b}=obj;
a//1
b//2
//实际上，对象的解构赋值就是这个形式的简写：
let {a:a,b:b}={a:1,b:2}//冒号前后相同时可以只写一个的
```
 也就是说，对象的解构赋值的内部机制，就是先找到同名属性，然后再赋值给对应的变量，真正被赋值的是后者，而不是前者，比如：
```javascript
let {x:a}={x:1,y；2}
a//1
x//报错，x is not defined
//x是匹配的模式，a才是变量，所以真正被赋值的变量是a，不是模式x
```
  与数组一样，解构也可以用于嵌套结构的对象：
```javascript
let obj={
  p:[
    'hello',{y:'world'}
  ]
};
let {p:[x,{y}]}=obj
x//hello
y//world
```
  此时的p是模式，不是变量，因此不会被赋值，如果p也要作为变量赋值，可以写成这样：
```javascript
let obj={
  p:[
    'hello',{y:'world'}
  ]
};
let (p,p:[x,,{y}])=obj
x//hello
y//world
p//['hello',{y:'world'}]
```
```javascript
const node = {
  loc:{
    start:{
      line:1,
      column:5
    }
  }
};
let {loc,loc:{start},loc:{start:{line}}}=node//后两个loc都是模式
line//1
loc//Object{start:Object}
start//Object{line:1,column:5}
//三次解构赋值，分别是对loc、start、line三个属性的解构赋值，最后一次对line属性的解构赋值之中，只有line是变量，loc和start都是模式，不是变量
```
  再看一下嵌套赋值：
```javascript
let obj={}
let arr=[]
({a:obj.prop,b:arr[0]})={a:1,b:true};
obj//{prop:1}
arr//[true]
```
  对象的解构也可以指定默认值：
```javascript
var {x=3}={}
x//3
var {x,y=3}={x=2}
x//2
y//3
var {x:y=3}={}
y//3
var {x:y=3}={x:5}
y//5
var {str:msg='luelueluelue'}={}
msg//luelueluelue
```
  默认生效的条件是，对象的属性值严格等于undefined，
```javascript
var {x=3}={x:undefined}
x//3
var {x=3}={x:null}
x//null
//属性x等于null，因为null与undefined不严格相等，所以是个有效的赋值，导致默认值3不会生效
let {b}={a:1}
b//undefined,如果解构失败，变量的值等于undefined
```
  如果解构模式是嵌套的对象，而且子对象所在的父属性不存在，就会报错：
```javascript
let {a:{b}}={b:1}
//等号左边对象的a属性，对应一个子对象，该子对象的b属性，解构时会不报错，因为此时a等于undefined，再取子属性就会报错

let x;
{x}={x:1}//语法错误，因为JavaScript引擎会将{x}理解成一个代码块，从而发生语法错误，只有不将大括号写在行首，避免JavaScript将其解释为代码块，才能解决这个问题

//正确的写法
let x;
({x}={x:1});
//这个就是将整个解构赋值语句，放在一个圆括号里面，就可以正确执行
```
  关于圆括号与解构赋值的关系，解构赋值允许等号左边的模式之中，不放置任何变量名，因此，可以写出非常古怪的赋值表达式：
```javascript
({} = [true,false])
({}=1234)
({}=[])
//虽然表达式没有意义，但是语法是合法的，可以执行。
```
  对象的解构赋值，可以很方便的将现有对象的方法，赋值到某个变量：
```javascript
let {log,sin,cos}=Math
//将Math对象的对数、正弦、余弦三个方法，赋值到对应的变量上，使用起来就会方便很多
```
  由于数组本质是特殊的对象，因此可以对数组进行对象属性的解构：
```javascript
ket arr=[1,2,3]
let {0:one,[arr.length-1]:two}=arr;
one//1
two//3
//对数组进行对象解构，数组arr的0键对应的值是1，[arr.length-1]就是2键，对应的值是3，方括号这种写法，属于“属性名表达式”
```
### 3.字符串的解构赋值
  字符串也可以解构赋值，因为字符串被转换成了类似数组的对象：
```javascript
const [a, b, c, d, e] = 'hello';
a // "h"
b // "e"
c // "l"
d // "l"
e // "o"
```
  类似数组的对象都有一个length属性，因此还可以对这个属性解构赋值：
```javascript
let {length:len}='hello'
len//5
```
### 4.数值和布尔值的解构赋值
  解构赋值时，如果等号右边是数值和布尔值，则会先转为对象：
```javascript
let {toString:s}=1;
s===Number.prototyoe.toString//true
let {toString:s}true;
s===Boolean.prototype.toString//true
//数值和布尔值的包装对象都有TOSString属性，则会先转为对象
```
  解构赋值的规则是，只要等号右边的值并不是对象或数组，就先将其转换为对象，由于undefined和null无法转为对象，所以对它们进行解构赋值，都会报错
```javascript
let {prop:a}=undefined//报错
let {prop:y}=null//报错
```
### 5.函数参数的解构赋值
  函数的参数也可以使用解构赋值：
```javascript
function add ([x,y]){
  return  x+y;
}
add([1,2])//3
//函数add的参数表面上是一个数组，但是在传入参数的时候，数组参数就被解构成变量x和y，对于函数内部的代码来说，它们能感受到的参数就是x和y
```
  再比如：
```javascript
[[1, 2], [3, 4]].map(([a, b]) => a + b);
// [3,7]
```
  函数参数的解构也可以使用默认值:
```javascript
function move({x = 0,y=0} = {}) {
  return [x,y];
}
move({x: 3, y: 8}); //[3, 8]
move({x: 3}); //[3, 0]
move({}); //[0, 0]
move(); //[0, 0]
//函数move的参数是一个对象，通过对这个对象进行解构，得到变量x和y的值，如果解构失败，x和y等于默认值。
```
  如果写法不同，结果也不同：
```javascript
function move({x, y} = { x: 0, y: 0 }) {
  return [x, y];
}
move({x: 3, y: 8}); //[3, 8]
move({x: 3}); //[3, undefined]
move({}); //[undefined, undefined]
move(); //[0, 0]
//如果是为函数move的参数指定默认值，而不是为变量x和y指定默认值，所以会得到与前一种写法不同的结果
```
  undefined就会触发函数参数的默认值：
```javascript
[1,undefined,3].map((x='yes')=>x)//[1,'yes',3]
```
### 6.圆括号问题
  解构赋值虽然方便，但是解析起来不容易，对于编译器来说，一个式子到底是模式还是表达式，没有办法从一开始就知道，必须解析到或者根本解析不到等号才能知道，带来的问题是，如果模式中出现圆括号怎么处理，es6的规则是，只要有可能导致解构的歧义，就不得使用圆括号。但是这个规则并不那么容易辨别，处理起来很麻烦，所以建议只要有可能，就不要在模式中放置圆括号：
#### 6.1 不能使用圆括号的情况
  - 变量声明语句
```javascript
let [(a)]=[1];
let {x:(c)}={};
let ({x:c})={};
let {(x):c}={}
let { o: ({ p: p }) } = { o: { p: 2 } };
// 6个语句都会报错，因为它们都是变量声明语句，模式不能使用圆括号
```
  - 函数参数
```javascript
// 函数参数也属于变量声明，因此不能带有圆括号
function fun([(z)]){return z}//报错
function fun ([z,(x)]){return x}//报错
```
  - 赋值语句的模式
```javascript
//将代码整个模式放在圆括号里面，报错
({p:a})={p:42}
([a])=[5]
//将代码一部分模式放在圆括号里面，报错
[({p:a}),{x:c}] = [{}, {}];
```
#### 6.2 可以使用圆括号的情况
  可以使用圆括号的情况只有一种：赋值语句的非模式部分，可以使用圆括号：
```javascript
[(b)]=[3];//模式是取数组的第一个成员，跟圆括号无关
({p:(d)}={})//模式是p不是d
[(xx.x)]=[3]//取对象的第一个成员，跟圆括号无关
//这三个都可以正确执行，因为它们都是赋值语句，而不是声明语句，然后它们的圆括号都不属于模式的一部分
```
### 7.用途
  - 交换变量的值
```javascript
let x=1;
let y=2;
[x,y]=[y,x]//交换变量，简洁易懂，语义清晰
```
  - 从函数返回多个值
```javascript
  //函数只能返回一个值，如果要返回多个值，只能将它们放在数组或对象里返回，现在可以这样写
  function fun(){//返回数组
    return [1,2,3]
  }
  let [a,b,c]=fun()
  function fun(){//返回对象
    return {a:1,b:2}
  }
  let {a,b}=fun()
```
  - 函数参数的定义
```javascript
//解构赋值可以方便的将一组参数与变量名对应起来
function fun([a,b,c]){...}
fun([1,2,3])//参数是一组有次序的值
function fun({a,b,c}){...}
fun({c:2,b:1,a:0})
```
  - 提取json数据
```javascript
//解构赋值对提取json对象中的数据很有用
let json={
  name:'许嵩',
  age:32,
  songs:['我乐意']
}
let {name,age,songs:string}=json
console.log(name,aga,string)//许嵩，332，['我乐意'],这不就快速获取到了json数据的值了
```
  -函数参数的默认值
```javascript
jQuery.ajax=function(url,{
  async=true,
  beforeSend=function(){  },
  cache=true,
  complete=function(){},
  crossDomain=false,
  global=true,
  //....
}={}){
  //...
}
//指定参数的默认值，避免了在函数体内部再写var a=config.a...之类的语句了
```
  -遍历map结构
```javascript
  //任何部署了遍历器的接口的独享，都可以用for of循环遍历，map结构原生支持遍历器接口，配合变量的结构赋值，获取键名和键值
  const map =new Map()
  map.set('a',1)
  map.set('b',2)
  for(let [keyy,value] of map){
    console.log(key + ':' + value)//a:1,b:2
  }
  //如果只想获取键名，或者只想拿键值，可以这样：
  for (let [key] of map) {}//获取键名
  for (let [,value] of map) {}//获取键值
```
  - 输入模块的指定方法：
```javascript
//加载模块时，往往需要指定输入哪些方法，结构赋值可以让输入语句更清晰
const {SourceMapConsumer,SourceNode}=require('source-map')
```

## 三、字符串的扩展
### 1.字符的Unicode表示
  JS允许采用\uxxxx形式表示一个字符，其中xxxx表示字符的Unicode码点，比如：
```javascript
'\u0061' //'a'
//但是这种表示法只限于码点在\u0000~\uFFFF之间的字符，超出这个范围，必须用两个双字节的形式表示，比如：
"\uD842\uDFB7" //𠮷，这不是吉，但是和吉的读音一样
'\u20bb7' // ' 7',如果直接在\u后面跟上超过0xFFF的数值，，JS会理解成\u20bb+1，由于\u20bb是一个不可打印的字符，所以只会显示空格 然后后面跟着一个7
```
  es6对这一点做出了改进，只要将码点放入大括号，就能正确解读该字符：
```javascript
'\u{20bb7}' //𠮷
'\u{41}\u{42}\u{43}'  //'ABC'
'\u{1F680}' === '\uD83D\uDE80' //true
// 这个等式2为true，表示大括号表示法与四字节的UTF-16编码是等价的，所以现在就有六种方法表示一个字符
'\z' === 'z' //true
'\172' === 'z'//true
'\x7A' === 'z'//true
'\u007A' === 'z'//true
'\u{7A}' === 'z'//true
```
### 2.codePointAt()
  JS内部，字符以UTF-16的格式储存，每个字符固定为2个字节，对于那些需要4个字节储存的字符，JS会认为它们是两个字符：
```javascript
var s='𠮷';
s.length //2
s.charAt(0)// ''
s.charCodeAt(0)//55362
s.charCodeAt(1)//57271
// '𠮷'的码点是0x220bb7，UTF-16编码为0xD842 0xDFB7，上面打印出来的是十进制的，需要四个字节存储，对于这种4个字节的字符，JS不能正确处理，字符串长度会认为是2，而且chartAt方法无法读取整个字符，charCodeAt方法只能分别返回前两个字节和后两个字节的值。
```
  es6提供了codePointAt方法，来正确处理4个字节储存的字符，返回一个字符的码点：
```javascript
let s='𠮷a';
s.codePointAt(0)//134071
s.codePointAt(1)//57271
s.codePointAt(2)//97
// codePointAt方法的参数，是字符在字符串中的位置，JS将'𠮷a'视为三个字符，codePointAt方法在第一个字符上，正确的识别了'𠮷'，返回了十进制码点134071,在第二个字符就是'𠮷'的后两个字节上和第三个字符a上，codePointAt方法的结果和charCodeAt方法相同。

//codePointAt方法返回的是十进制的码点，要是要十六进制的，可以使用toString
let s='𠮷a';
s.codePointAt(0).toString(16) //"20bb7"
s.codePointAt(2).toString(16) //"61"

//但是，这里有个问题就是a在字符串里的位置是1，但是得向codePointAt方法传入2，所以需要用for of循环，来识别32位的UTF-16字符:
lets ='𠮷a';
for (let ch of s) {
  console.log(ch.codePointAt(0).toString(16));// 20bb7,61
}
```
  codePointAt方法是测试一个字符是由两个字节还是由四个字节组成的最简单的办法：
```javascript
function is32(c){
  return c.codePointAt(0)>0xFFFF
}
is32('𠮷')///true
is332('a')//false
```
### 3.String.fromCodePoint()
  es5有String.fromCharCode方法，用于从码点返回对应的字符，但是它不能识别32位的UTF-16字符：
```javascript
String.fromCharCode(0x20bb7)//'ஷ'，因为不能识别大鱼0xFFFF的码点，所以最高位的2被舍弃了，最后码点返回的是u+0bb7对应的字符，反正也不认识
```
  es6提供String.formCodePoint方法，可以识别大于0xFFFF的字符：
```javascript
String.fromCodePoint(0x20BB7)//"𠮷"
String.fromCodePoint(0x78, 0x1f680, 0x79) === 'x\uD83D\uDE80y'//true
//如果String.formCodePoint方法有多个参数，则会被合并成一个字符串返回，
//fromCodePoint方法定义在string对象上，codePointAt定义在字符串本身上
```
### 4.字符串的遍历器接口
  es6为字符串添加了遍历器接口，字符串也可以使用for of循环：
```javascript
for (let tmp of 'vae') {
  console.log(tmp)// v , a, e
}
```
  除了遍历字符串，这个遍历器最大的优点是可以识别大于0xFFFF的码点，传统的for循环无法识别这样的码点。
```javascript
let text=String.fromCodePoint(0x20BB7);
for (let i=0; i<text.length; i++) {
  console.log(text[i]);
}
// " "
// " "

for (let i of text) {
  console.log(i);// "𠮷"
}
 // 字符串text只有一个字符，但是for循环会认为它包含两个字符，而for of循环会正确识别出这一个字符
```
### 5.at()
  es5对字符串对象提供charAt方法，返回字符串给定位置的字符，该方法不能识别码点大于0xFFFF的字符：
```javascript
'abc'.charAt(0) // "a"
'𠮷'.charAt(0) // "\uD842"
// 第二条语句，charAt方法期望返回的是用2个字节表示的字符，但是这个汉字占了4个字符，charAt(0)表示获取这4个字节中的前2个字节，所以无法正常显示，目前有一个字符串实例的at方法，可以识别Unicode编号大于0xFFFF的字符，返回正确的字符：
'abc'.at(0) // "a"
'𠮷'.at(0) // "𠮷"
```
### 6.normalize()
  许多欧洲语言有语调符号和重音符号，为了表示它们，Unicode提供了两种方法，一种是直接提供带重音符号的字符，另一种是提供合成符号，就是原字符与重音符号的合成，两个字符合成一个字符，这两种表示方法在视觉和语义上 都等价，但是JavaScript不能识别：
```javascript
  '\u01d1'==='\u004f\u030c' //false
  '\u01d1'.length//1
  '\u004f\u030c'.length //2
  // 上面代码表示，JavaScript将和合成字符视为两个字符，导致了两种表示方法不相等
```
  es6提供字符串实例的normalize()方法，用来将字符大的不同表示方法统一为同样的形式，这称为Unicode正规化：
```javascript
  '\u01D1'.normalize() === '\u004F\u030C'.normalize()// true
```
  normalize方法可以接受一个参数来指定normalize的方式，参数可选值有：
  - NFC，默认参数，表示 标准等价合成，，返回多个简单字符的合成字符，标准的能加指的就是视呵呵语义上的等价。Normalization Form Canonical Composition
  - NFD，表示 标准等价分解，就是在标准等价的前提下，返回合成字符分解的多个简单字符。Normalizattion Form Canonical Decomposition
  - NFKC，表示 兼容等价合成，返回合成字符，兼容等价指的是语义上存在等价，但视觉上不等价，Normalization Form Compatibility Composition。
  - NFKD，表示 兼容等价分解，就是在兼容等价的前提下，返回合成字符分解的多个简单 字符，Normalization Form Compatibility Decomposition
```javascript
'\u004F\u030C'.normalize('NFC').length // 1
'\u004F\u030C'.normalize('NFD').length // 2
// 这两行代码表示，NFC参数返回字符的合成形式，NFD参数返回字符的分解形式，不过，normalize方法目前不能识别三个或者三个以上的字符，这种情况下，就还是用正则表达式，通过Unicode编号区间判断
```
### 7.includes() startsWith() endsWith()
  以前，JavaScript只有indexOf方法，可以用来确定一个字符串是否包含在另一个字符串中，es6提供了新的三种方法：
  - includes() 返回布尔值，表示是否找到了参数字符转
  - startsWith() 返回布尔值，表示参数字符串是否在原字符串的头部
  - endsWith() 返回布尔值，表示参数字符串是否在原字符串的尾部
```javascript
let str='hello world!'
str.startsWith('h')//true
str.endsWith('!')//true
str.includes(d)//true
// 这三个方法都支持第二个参数，表示从第n位开始查找
let str='hello vae!'
str.startsWith('vae', 6)//true
str.endsWith('hello',5)//true
str.includes('hello', 6)//false
// 这样写就表示使用第二个参数nn时，endsWith的行为与其它两个方法有所不同，它针对前n个字符，而其它两个方法针对从第n个位置直到字符串结束
```
### 8.repeat()
  repeat方法返回一个新的字符串，表示将原字符串重复n次
```javascript
'x'.repeat(3)//'xxx'
'vae'.repeat(2)//'vaevae'
'no'.repea(0)//''
// 参数如果是小数，会被取整
'no'.repeat(2.9)//'nono'
// 如果repeat的参数是负数或者Infinity，会报错
'vae'.repeat(Infinity)//RangeError
'vae'.repeat(-1)//RangeError
//但是如果参数是0到-1之间的小数，则等同于0，这是因为会先进行取整运算，0到-1之间的小数，取整以后等于-0，repeat相当于0
'no'.repeat(-0.9)//''
//参数NaN等同于0
'no'.repeat(NaN)//0
//如果repeat的参数是字符串，就先转为数字
'no'.repeat('ai') // ""
'no'.repeat('3') // "nonono"
```
### 9.padStart() padEn()
  es6引入了字符串补全长度的功能，如果某个字符串不够指定长度，会在头部或者尾部补全，padStart用于头部补全，padEnd用于尾部补全：
```javascript
'x'.padStart(5, 'ab')//'ababx'
'x'.padStart(4, 'ab')//'abax'
'x'.padEnd(5, 'ab')//'xabab'
'x'.padEnd(4, 'ab')//'xaba'
//padStart和padEnd一共接受两个参数，第一个参数用来指定字符串的最小长度，第二个参数是用来补全的字符串

//如果原字符串的长度，等于或大于指定的最小长度，则返回原字符串
'xxx'.padStart(2, 'ab') // 'xxx'
'xxx'.padEnd(2, 'ab') // 'xxx'

//如果用来补全的字符串与原字符串，二者的长度之和超过了指定的最小长度，则会截去超出位数的补全字符串
'ab'.padStart(10,'0123456789')//'01234567ab'

//如果省略第二个参数，默认使用空格补全长度
'x'.padStart(44)//'    x'
'x'.padEnd(4)//'x    '

//padStart的常见用途是为数值补全指定位数，比如这样：
'1'.padStart(10, '0') // "0000000001"
'12'.padStart(10, '0') // "0000000012"
'123456'.padStart(10, '0') // "0000123456"

//另一个用途是提示字符串格式
'12'.padStart(10, 'YYYY-MM-DD') // "YYYY-MM-12"
'09-12'.padStart(10, 'YYYY-MM-DD') // "YYYY-09-12"
```
### 10.matchAll() 
  matchAll方法返回一个正则表达式在当前字符串的所有匹配
### 11.模板字符串
  以前的JavaScript语言，输出模板通常这样写：
```javascript
$('#result').append(
	'你说啥<b>'+person.name+'</b>'+
	'听不见'+person.name+'瞎了'+person.year+'年了'
)
​````
  这种写法太复杂了，错一个引号就慢慢找去吧，模板字符串就很好用了：
​```javascript
$('#result').append(
	`你说啥<b>${person.name}</b>听不见，${person.name}瞎了${person.year}年了`
)
```
  模板字符串是增强版的字符串，用反引号标识，他可以当做普通字符串使用，也可以用来定义多行字符串，或者在字符串中嵌入变量：
```javascript
`潇洒如我最近确变得有点敏感'\n'半小时收不到你讯息就会坐立不安`//普通字符串

`都说别爱的太满 这道理知易行难
我还挺乐意享受这份甜中微酸`//多行字符串

//字符串嵌入变量
let name='你' , thing ='西瓜'
`${name}的笑像${thing}最中间那一勺的口感，点亮了一整个夏天星空也为你斑斓`

//模板字符串都是用反引号表示，如果在模板字符串中需要使用反引号，那就要用\转译
let greeting = `\`Yo\` World!`

//如果使用模板字符串表示多行字符串，所有的空格和缩进都会被保留在输出之中
$('#list').html(`
<ul>
  <li>壹</li>
  <li>贰</li>
</ul>
`);

//上面这样写，所有的模板字符串的空格和换行，都是被保留的，比如ul标签前面会有一个换行，如果也要消除这个换行，可以使用trim方法消除：
$('#list').html(`
<ul>
  <li>壹</li>
  <li>贰</li>
</ul>
`.trim());

//模板字符串中嵌入变量，需要将变量名写在${}里面
function authorize(user, action) {
  if (!user.hasPrivilege(action)) {
    throw new Error(
      // 传统写法为
      // 'User '+ user.name+ ' is not authorized to do '+ action+ '.'
      `User ${user.name} is not authorized to do ${action}.`);
  }
}
```
  大括号里面可以放任意的JavaScript表达式，可以进行运算，以及引用对象属性，在大括号里面也可以调用函数。
  如果大括号中的值不是字符串，将按照一般的规则转为字符串，比如大括号中是一个对象，将默认调用对象的toString方法，如果模板字符串中的变量没有声明，将报错：
```javascript
// 变量name没有声明
let msg = `Hello, ${name}`// 报错
```
  由于模板字符串的大括号内部就是执行JavaScript代码，所以要是大括号内部是一个字符串，就直接输出了：
```javascript
`hello ${'worrld'}`//hello world
```
  模板字符串也可以嵌套：
```javascript
const tmp=addr=>`
	<table>
		${addr.map(addr=>`
			<tr><td>${addr.first}</td></tr>
			<tr><td>${addr.last}</td></tr>
		`).join('')}
	</table>
`
//这个就是在模板字符串的变量中，又嵌入了另一个模板字符串，这样用：
const data =[
  {first:'baker',last:'street'}
  {first: 221,last:'B'}
]
console.log(tmp(data))
/*
<table>
	<tr><td>baker</td></tr>
	<tr><td>sreet</td></tr>
	<tr><td>221</td></tr>
	<tr><td>B</td></tr>
</table>
*/
```
  如果需要引用模板字符串本身，在需要时执行，可以这样写：
```javascript
//一、
let str='return'+'`hello ${name}`'
let fun=new Function('name',str)
fun('vae')//hello vae
//二、
let str='(name)=>`hello ${name}`'
let fun=eval.call(null,str)
fun('vae')//hello vae
```
### 12.标签模板
  除了上面的功能，它还可以紧跟在一个函数名后面，该函数将被用来处理这个模板字符串，被称为“标签模板”功能
```javascript
alert `123` //等同于
alert (123)
```
  标签模板其实不是模板，而是函数调用的一种特殊形式，标签 指的的就是函数，紧跟在后面的模板字符就是它的参数，但是如果模板字符里面有变量，就不是简单的调用了，而是会将模板字符串先处理成多个参数，再调用函数：
```javascript
let a=1;
let b=2;
tag`hello ${a+b}world${a*b}`
tag(['hello','world','',3,2])
//这里面模板字符串前面有一个标识名tag，它是一个函数，整个表达式的返回值就是tag函数处理模板字符串后的返回值，函数tag又一次会接收到多个参数：
function tag(strArr,val1,val2){//...}//等同于
function tag(strArr,...vals){//...}
```
  tag函数的第一个参数是一个数组，该数组的成员是模板字符串中的那些没有变量替代的部分，也就是说，变量替换只发生在数组的第一个成员与第二个成员之间、第二个成员与第三个成员之间，以此类推。tag函数的其它参数，都是模板字符串各个变量被替换后的值，上面的例子里面，模板字符串包含有两个变量，因此tag会接收到val1和val2两个参数。
  tag函数所有参数的实际值是这样的：
  - 第一个参数 :['hello','world','']
  - 第二个参数:3
  - 第三个参数:2
    所以也就是说tag函数实际以下面的形式调用：
```javascript
tag(['Hello ', ' world ', ''], 3, 2)
```
  可以按照需要编写tag的代码，下面是tag函数的一种写法以及运行结果：
```javascript
let a=1;
let b=2;
function tag(s,v1,v2){
  console.log(s[0]);
  console.log(s[1]);
  console.log(s[2]);
  console.log(v1);
  console.log(v2);
  return "OK";
}
tag`Hello ${a+b} world ${a*b}`;// hello//world//''//3//2//ok
```
  一个更复杂的例子：
```javascript
let total = 30;
let msg = passthru`总价${total} (含税：${total*1.05})`;

function passthru(literals) {
  let result = '';
  let i = 0;
  while (i<literals.length) {
    result+=literals[i++];
    if (i<arguments.length) {
      result+=arguments[i];
    }
  }
  return result;
}

msg // "总价30 (含税31.5)"
//这个例子展示了，如何将各个参数按照原来的位置拼合回去
```
  passthru函数采用rest参数的写法长这样：
```javascript
function passthru(literals, ...values) {
  let output = "";
  let index;
  for (index = 0; index<values.length; index++) {
    output += literals[index]+values[index];
  }
  output+=literals[index]
  return output;
}
```
  标签模板的一个重要应用，就是过滤HTML字符串，防止用户恶意输入：
```javascript
let message = SaferHTML`<p>${sender}给你发了个消息</p>`
function SaferHTML(tmpData){
  let s=tmpData[0];
  for(let i=1;i<arguments.length;i++){
    let arg=String(arguments[i])
     s+=arg.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");//避开替换中的特殊字符
     s+=tmpData[i]//不避开模板中中的特殊字符
  }
  return s;;
}
//其中sender变量往往是用户提供的，经过SaferHTML函数处理，里面的特殊字符都会被转义
let sender = '<script>alert("abc")</script>'; // 恶意代码
let message = SaferHTML`<p>${sender} 给你发了个消息</p>`;
message//<p>&lt;script&gt;alert("abc")&lt;/script&gt; 给你发了个消息</p>
```
  标签模板的另一个应用，就是多语言转换：
```javscript
i18n`欢迎访问 ${siteName},您是第 ${visitorNumber}位访问者!`
// "欢迎访问xxx，您是第xxxx位访问者！"
```
  模板字符串本身并不能取代Mustache之类的模板库，因为没有条件判断和循环处理功能，但是通过标签函数，可以自己添加这些功能：
```javascript
// 下面的hashTemplate函数是一个自定义的模板处理函数
let libraryHtml=hashTemplate`
  <ul>
    #for book in ${myBooks}
      <li><i>#{book.title}</i> by #{book.author}</li>
    #end
  </ul>
`;
```
  此外，也可以使用标签模板，在JS里里面呢嵌入其它语言：
```javascript
jsx`<div>
    <input ref='input' onChange='${this.handleChange}'  defaultValue='${this.state.value}' /> ${this.state.value} </div>
`
//通过jsx函数，将一个DON字符串转为React对象。
```
  假如在JS的代码里面运行Java代码：
```javascript
java`
class HelloWorldApp {
  public static void main(String[] args) {
    System.out.println(“Hello World!”); // 打印该字符串
  }
}
`
HelloWorldApp.main();
//模板处理函数的第一个参数，还有一个raw属性
console.log`123`//['123', raw: Array[1]]
//console.log接受的参数，实际上是一个数组。该数组有一个raw属性，保存的是转义后的原字符串。
```
  又有一个例子：
```javascript
tag`第一行的\n第二行的`

function tag(strings) {
  console.log(strings.raw[0]);
  // strings.raw[0] 为 "第一行的\\n第二行的"
  // 打印输出 "第一行的\n第二行的"
}
//这里面，tag函数的第一个参数strings，有一个raw属性，也指向一个数组。该数组的成员与strings数组完全一致。比如，strings数组是["第一行的\n第二行的"]，那么strings.raw数组就是["第一行的\\n第二行的"]。两者唯一的区别，就是字符串里面的斜杠都被转义了。比如，strings.raw 数组会将\n视为\\和n两个字符，而不是换行符。
```
### 13.String.raw()
  es6为原生的String对象，提供了raw方法。String.raw方法，往往用来充当模板字符串的处理函数，返回一个斜杠都被转义（即斜杠前面再加一个斜杠）的字符串，对应于替换变量后的模板字符串。
```javascript
String.raw`Hi\n${2+2}!`;// 返回 "Hi\\n4!"
String.raw`Hi\u000A!`;// 返回 "Hi\\u000A!"
//如果原字符串的斜杠已经转义，那么String.raw会进行再次转义。
String.raw`Hi\\n` // 返回 "Hi\\\\n"
```
  String.raw方法可以作为处理模板字符串的基本方法，它会将所有变量替换，而且对斜杠进行转义，方便下一步作为字符串来使用。String.raw方法也可以作为正常的函数使用。这时，它的第一个参数，应该是一个具有raw属性的对象，且raw属性的值应该是一个数组。
```javascript
String.raw({ raw: 'test' }, 0, 1, 2);// 't0e1s2t'
// 等同于
String.raw({ raw: ['t','e','s','t'] }, 0, 1, 2);
```
  作为函数，String.raw的代码实现长这样：
```javascript
String.raw = function (strings, ...values) {
  let output = '';
  let index;
  for (index=0; index<values.length; index++) {
    output+=strings.raw[index]+values[index];
  }
  output+=strings.raw[index]
  return output;
}
```
### 14.模板中字符串的限制
  标签模板里面，可以内嵌其它语言，但是，模板字符串默认会将字符串转义，导致无法嵌入其他语言。
  比如，标签模板里面可以嵌入LaTEX语言（什么鬼？~）
```javascript
//一段不知道是什么语言的代码
function latex(strings) {
  // ...
}

let document = latex`
\newcommand{\fun}{\textbf{Fun!}}  // 正常工作
\newcommand{\unicode}{\textbf{Unicode!}} // 报错
\newcommand{\xerxes}{\textbf{King!}} // 报错
Breve over the h goes \u{h}ere // 报错
`
//这里面，变量document内嵌的模板字符串，对于 LaTEX 语言来说完全是合法的，但是 JavaScript 引擎会报错。原因就在于字符串的转义。模板字符串会将\u00FF和\u{42}当作 Unicode 字符进行转义，所以\unicode解析时报错；而\x56会被当作十六进制字符串转义，所以\xerxes会报错。也就是说，\u和\x在 LaTEX 里面有特殊含义，但是 JavaScript 将它们转义了。
```
  为了解决这个问题，ES2018 放松了对标签模板里面的字符串转义的限制。如果遇到不合法的字符串转义，就返回undefined，而不是报错，并且从raw属性上面可以得到原始字符串。
```javascript
function tag(strs) {
  strs[0] === undefined
  strs.raw[0] === "\\unicode and \\u{55}";
}
tag`\unicode and \u{55}`
//这里面，模板字符串原本是应该报错的，但是由于放松了对字符串转义的限制，所以不报错了，JavaScript 引擎将第一个字符设置为undefined，但是raw属性依然可以得到原始字符串，因此tag函数还是可以对原字符串进行处理。

//注意，这种对字符串转义的放松，只在标签模板解析字符串时生效，不是标签模板的场合，依然会报错。
let bad = `bad escape sequence: \unicode`; // 报错
```

## 四、正则的扩展
### 1.RegExp构造函数
  在es5中，RegExp构造函数的参数有两种情况，第一种情况是参数是字符串，这时第二个参数表示正则表达式的修饰符（flag）
```javascript
var regex=new RegExp('xyz','i')//等价于
var regex=/xyz/i  // i ignore，忽略大小写
```
  第二种情况是，参数是一个正则表达式，这时会返回一个原有正则表达式的拷贝：
```javascript
var regex=new RegExp(/xyz/i) // 等价于
var regex=/xyz/i
```
  但是es5不允许此时使用第二个参数添加修饰符，否则就会报错：
```javascript
var regex=new RegExp(/xyz/, ''i'')//报错，从另一个RegExp构建一个RegExp时不支持修饰符
```
  es6改变了这种行为，如果RegExp构造函数第一个参数是一个正则对象，那么可以使用第二个参数指定修饰符吗，而且返回的正则表达式会忽略原有的正则表达式的修饰符，只使用新的指定的修饰符：
```javascript
new RegExp(/abc/ig,'i').flags//原有正则对象的修饰符是ig，但是会被后面的i覆盖
```
### 2.字符串的正则方法
  字符串对象共有4个方法，可以使用正则表达式：match()、replace()、search()和split()。es6将这4个方法，在语言内部全部调用RegExp的实例方法，从而做到所有与正则相关的方法全都定义在RegExp对象上：
  - String.prototype.match调用RegExp.prototype[Symbol.match]
  - String.prototype.replace调用RegExp.prototype[Symbol.replace]
  - String.prototype.split调用RegExp.prototype[Symbol.split]
### 3.u修饰符
  es6对正则表达式添加了u修饰符，含义就是Unicode模式，用来正确处理大于\uuFFFF的Unicode字符，就是说，会正确处理四个字节的UTF-16编码。
```javascript
/^\uD83D/u.test('\uD83D\uDC2A') //false
/^\uD83D/.test('\uD83D\uDC2A') //true
//这里面，\uD83D]\uDC2A是一个四字节的UUTF-16编码，代表一个字符，但是es5不支持四个字节的UTF-16编码，会将其识别为两个字符，导致第二行代码的结果为true，加了u修饰符以后，es6就会识别其为一个字符，所以第一行的就是true
```
  加上u修饰符，就会修改下面这些正则表达式的行为：
  - 点字符
    点( . )字符在正则表达式中，含义是除了换行符以外的任意单个字符，对于码点大于0xFFFF的Unicode字符，点字符不能识别，必须加上u修饰符
```javascript
var s = '𠮷';
/^.$/.test(s) //false
/^.$/u.test(s) //true
//如果不添加u修饰符，正则表达式就会认为字符串为两个字符，从而匹配失败
```
  - Unicode字符表示法
    es6新增了使用大括号表示Unicode字符，这种表示方法在正则表达式中必须加上u修饰符，才能识别当中的大括号，否则会被解释为量词：
```javascript
/\u{61}/.test('a') //false
/\u{61}/u.test('a') //true
/\u{20BB7}/u.test('𠮷') //true
//如果不加修饰符，正则表达式无法识别\u{61}这种表示法，只会认为匹配61个连续的u
```
  - 量词
    使用u修饰符后，所有的量词都会正确识别码点大于0xFFFF的Unicode字符：
```javascript
/a{2}/.test('aa') //true
/a{2}/u.test('aa') //true
/𠮷{2}/.test('𠮷𠮷') //false
/𠮷{2}/u.test('𠮷𠮷') //true
```
  - 预定义模式
    u修饰符也影响到预定义模式，能否正确识别码点大于0xFFFF的Unicode字符：
```javascript
/^\S$/.test('𠮷') //false
/^\S$/u.test('𠮷') //true
//\s是预定义模式，匹配所有的非空白字符，只有加了u修饰符，才能正确匹配码点大于0xFFFF的Unicode字符，利用这一点，可以写出一个正确返回字符串长度的函数
function codePointLength(text) {
  var result=text.match(/[\s\S]/gu);
  return result?result.length:0;
}
var s='𠮷𠮷';
s.length // 4
codePointLength(s) // 2
```
  - i修饰符
    有些Unicode字符的编码不同，但是字型很接近，比如\u0048和\u212A都是大写的K：
```javascript
/[a-z]/i.test('\u212A') //false,不加u就无法识别非规范的K字符
/[a-z]/iu.test('\u212A') //true
```
### 4.y修饰符
  除了u修饰符，es6还为正则表达式添加了y修饰符，叫做sticky修饰符，y修饰符与g修饰符类似，也是全局匹配，后一次匹配都从上一次匹配成功的下一个位置开始，不同之处在于，g修饰符只要剩余位置中存在匹配就可以，但是y修饰符确保匹配必须从剩余的第一个位置开始：
```javascript
var s='aaa_aa_a';
var r1=/a+/g;
var r2=/a+/y;
r1.exec(s) //["aaa"]
r2.exec(s) //["aaa"]
r1.exec(s) //["aa"]
r2.exec(s) //null
//这个代码里面有两个正则表达式，一个使用g修饰符，一个使用y修饰符，这连个正则表达式个执行了一次，第一次执行的时候，二者行为相同，剩余字符串都是_aa_a，由于g修饰没有位置要求，所以第二次执行会返回结果，而y修饰符要求匹配必须从头部开始，所以返回null，如果改一下正则表达式，保证每次都能头部匹配，y修饰符就会返回结果了：
var s='aaa_aa_a';
var r=/a+_/y;
r.exec(s) //["aaa_"]
r.exec(s) //["aa_"]

//使用lastIndex属性，来更好的说明y修饰符
const REGEX=/a/g
REGEX.lastInedx=2;//指定从2号位置开始匹配
const match=REGEX.exec('xaya')
match.index//3
REGEX.lastInndex//4
REGEX.exec('xaya')//null，4号位置开始匹配失败
//这个代码里面，lastIndex属性指定每次搜索的开始位置，g修饰符从这个位置开始向后搜索，知道发现匹配为止。

//y修饰符同样遵守lastIndex属性，但是要求必须在lastIndex指定的位置发现匹配
const REGEX = /a/y;
REGEX.lastIndex = 2;// 指定从2号位置开始匹配
REGEX.exec('xaya') // null，不是粘连，匹配失败
REGEX.lastIndex = 3;// 指定从3号位置开始匹配
const match = REGEX.exec('xaya');// 3号位置是粘连，匹配成功
match.index // 3
REGEX.lastIndex // 4
```
  其实，y修饰符符号隐含了头部匹配的标志^ 
```javascript
/b/y.exec('abc')//null,由于不能保证头部匹配，所以返回null，y修饰符的设计本意，就是让头部匹配的标志^在全局匹配中都有效

//字符串对象的replace方法的例子：
const REGEX = /a/gy;
'aaxa'.replace(REGEX, '-') //'--xa'
//这个代码里最后一个a因为不是出现在下一次匹配的头部，所以不会被替换。

//单单一个y修饰符对match方法，只能返回第一个匹配，必须与g修饰符连用，才能返回所有匹配
'a1a2a3'.match(/a\d/y) // ['a1']
'a1a2a3'.match(/a\d/gy) // ['a1','a2','a3']
```
  y修饰符的一个应用，是从字符串提取token，y修饰符确保了匹配之间不会有漏掉的字符：
```javascript
const TOKEN_Y=/\s*(\+|[0-9]+)\s*/y;
const TOKEN_G=/\s*(\+|[0-9]+)\s*/g;
tokenize(TOKEN_Y, '3 + 4')// [ '3', '+', '4' ]
tokenize(TOKEN_G, '3 + 4')// [ '3', '+', '4' ]
function tokenize(TOKEN_REGEX, str) {
  let resul =[];
  let match;
  while (match=TOKEN_REGEX.exec(str)) {
    result.push(match[1]);
  }
  return result;
}

//如果字符串里面没有非法字符，y修饰符与g修饰符的提取结果是一样的，但是一旦出现非法字符，两者的行为就不一样了：
tokenize(TOKEN_Y, '3x + 4')// [ '3' ]
tokenize(TOKEN_G, '3x + 4')// [ '3', '+', '4' ]
//g修饰符会忽略非法字符，y不会，就很容易发现错误了
```
### 5.sticky属性
  与y修饰符相匹配，es6的正则对象多了sticky属性，表示是否设置了y修饰符
```javascript
var r = /hello\d/y;
r.sticky // true
```
### 6.flags属性
  es6为正则表达式新增了flags属性，会返回正则表达式的修饰符：
```javascript
/abc/ig.source //'abc',es5的source属性，返回正则表达式的正文
/abc/ig.flags//’gi，es6的flags属性，返回正则表达式的修饰符
```
### 7.s修饰符：dotAll模式
  正则表达式中，点（.）是一个特殊字符，代表任意的单个字符，但是有两个例外，一个是四个字节的UTF-16字符，这个可以用u修饰符解决，另一个是行终止符，该字符表示一行的终结，以下四个字符属于“行终止符”
  - U+000A换行符（\n）
  - U+000D 回车符（\r）
  - U+2028 行分隔符（line separator）
  - U+2029 段分隔符（paragraph separator）
```javascript
/foo.bar/ .test('foo\nbar')//false,因为 . 不匹配\n，所以正则返回false
//但是，很多时候就想匹配的是任意单个字符，可以变通一下写法
/foo[^]bar/.test('foo\nbar')// true，就是看着有点别扭
```
  es2018引入s修饰符，使得.可以匹配任意单个字符
```javascript
/foo.bar/s .test('foo\nbar') // true
//这被称为dotAll模式，即点（.）代表一切字符，所以正则表达式还引入了dotAll属性，返回一个布尔值，表示该正则表达式是否处于dotAll模式
const re = /foo.bar/s; // 另一种写法
// const re = new RegExp('foo.bar', 's');
re.test('foo\nbar') // true
re.dotAll // true
re.flags // 's'
///s修饰符和多行修饰符/m不冲突,二者一起使用的情况下，. 匹配所有字符，而^和$匹配每一行的行首和行尾。
```

## 五、数值的扩展
### 1.二进制和八进制表示法
  es6提供了二进制和八进制数值的新的写法，分别用前缀0b和0o表示：
```javascript
0b111110111 === 503 //true
0o767 === 503 //true
```
  从es5开始，在严格模式之中，八进制就不再允许使用前缀0表示，es6进一步明确要使用前缀0o表示：
```javascript
// 非严格模式
(function(){
  console.log(0o11 === 011);
})() //true
// 严格模式
(function(){
  'use strict';
  console.log(0o11 === 011);
})()//报错，
```
  如果要将0b和0o前缀的字符串数值转为十进制，要使用Number方法：
```javascript
Number('0b111')//7
Number('0o10')//8
```
### 2.Number.isFinite(),Number.isNaN()
  Number.isFinite()用来检查一个数值是否为有限的（finite），即不是Infinity。
```javascript
Number.isFinite(15); // true
Number.isFinite(0.8); // true
Number.isFinite(NaN); // false
Number.isFinite(Infinity); // false
Number.isFinite(-Infinity); // false
Number.isFinite('foo'); // false
Number.isFinite('15'); // false
Number.isFinite(true); // false
//如果参数类型不是数值，Number.isFinite一律返回false
```
  Number.isNaN()用来检查一个值是否为NaN：
```javascript
Number.isNaN(NaN) // true
Number.isNaN(15) // false
Number.isNaN('15') // false
Number.isNaN(true) // false
Number.isNaN(9/NaN) // true
Number.isNaN('true' / 0) // true
Number.isNaN('true' / 'true') // true
//如果参数类型不是NaN，Number.isNaN一律返回false
```
  它们与传统的全局方法isFinite()和isNaN()的区别在于，传统方法先调用Number()将非数值的值转为数值，再进行判断，而这两个新方法只对数值有效，Number.isFinite()对于非数值一律返回false, Number.isNaN()只有对于NaN才返回true，非NaN一律返回false。
```javascript
isFinite(25) // true
isFinite("25") // true
Number.isFinite(25) // true
Number.isFinite("25") // false
isNaN(NaN) // true
isNaN("NaN") // true
Number.isNaN(NaN) // true
Number.isNaN("NaN") // false
Number.isNaN(1) // false
```
### 3.Number.parseInt(),Number.parseFloat()
  ES6 将全局方法parseInt()和parseFloat()，移植到Number对象上面，行为完全保持不变。
```javascript
// ES5的写法
parseInt('12.34') // 12
parseFloat('123.45#') // 123.45
// ES6的写法
Number.parseInt('12.34') // 12
Number.parseFloat('123.45#') // 123.45
//看上去没啥区别，这样做是逐步减少全局性方法，使得语言逐步模块化
Number.parseInt === parseInt // true
Number.parseFloat === parseFloat // true
```
### 4.Number.isInteger()
  此方法用来判断一个数值是否为整数：
```javascript
Number.isInteger(25) // true
Number.isInteger(25.1) // false

//JavaScript 内部，整数和浮点数采用的是同样的储存方法，所以 25 和 25.0 被视为同一个值。
Number.isInteger(25) // true
Number.isInteger(25.0) // true

//如果参数不是数值，Number.isInteger返回false。
Number.isInteger() // false
Number.isInteger(null) // false
Number.isInteger('15') // false
Number.isInteger(true) // false
```
  注意，由于JavaScript数值存储为4位双精度格式，数值精度最多可以达到53个二进制位（1个隐藏位与52个有效位），如果数值的精度超过这个限度，第54位以及后面的位就会被丢弃，这种情况下，isInteger可能会误判
```javascript
Number.isInteger(3.0000000000000002) // true
//上面代码中，Number.isInteger的参数明明不是整数，但是会返回true。原因就是这个小数的精度达到了小数点后16个十进制位，转成二进制位超过了53个二进制位，导致最后的那个2被丢弃了。

//类似的情况还有，如果一个数值的绝对值小于Number.MIN_VALUE（5E-324），即小于 JavaScript 能够分辨的最小值，会被自动转为 0。这时，Number.isInteger也会误判。
Number.isInteger(5E-324) // false
Number.isInteger(5E-325) // true
//上面代码中，5E-325由于值太小，会被自动转为0，因此返回true。
```
  所以，如果对数据精度要求较高，不建议使用Number.isInteger()判断一个数值是否为整数。
### 5.Number.EPSILON
  es6在Number对象上面，新增一个极小的常量Number.EPSILON，根据规格，它表示1与大于1的最小浮点数之间的差。对于64位浮点数来说，大于1的最小浮点数相当于二进制的1.00..001，小数点后面有连续51个零，这个值减去1之后，就等于2的-52次方。
```javascript
Number.EPSILON === Math.pow(2, -52)// true
Number.EPSILON// 2.220446049250313e-16
Number.EPSILON.toFixed(20)// "0.00000000000000022204"
//Numebr.EPSILON实际上是JavaScript能够表示的最小精度，误差如果小于这个值，就可以认为已经没有意义了，即不存在误差了
```
  引入这么小的量的目的，在于为浮点数计算，设置一个误差范围，因为浮点数计算是不精确的：
```javascript
0.1 + 0.2//0.30000000000000004
0.1 + 0.2 - 0.3// 5.551115123125783e-17
5.551115123125783e-17.toFixed(20)// '0.00000000000000005551'
//这样就知道了吧，0.2+0.1与0.3的结果是false
0.1+0.2===0.3//false
```
  Number.EPSILON可以用来设置“能够接受的误差范围”，比如，误差范围设为2的-50次方，即如果两个浮点数的差小于这个值，就认为这两个浮点数相等：
```javascript
5.551115123125783e-17 < Number.EPSILON * Math.pow(2, 2)// true
```
  所以，Number.EPSILON的实质是一个可以接受的最小误差的范围
```javascript
function withinErrorMargin(left,right){//误差检查函数
    return Math.abs(left-right)<Number.EPSILON*Math.pow(2,2)
}
0.1+0.2===0.3//false
withinErrorMargin(0.1+0.2,,0.3)//true
1.1 + 1.3 === 2.4 // false
withinErrorMargin(1.1 + 1.3, 2.4) // true
```
### 6.安全整数和Number.isSafeInteger()
  JavaScript能够准确表示的整数范围在-2^53到2^53之间，不含两个端点，超过这个范围无法精确表示这个值：
```javascript
Math.pow(2,53)// 9007199254740992
9007199254740992  // 9007199254740992
9007199254740993  // 9007199254740992
Math.pow(2, 53) === Math.pow(2, 53) + 1// true,看看，这一个数就不精确了
```
  es6引入了Number,MAX_SAFE_INTEGER和Number.MIN_SAFE_INTEGER这两个常量，用来表示这个范围的上下限：
```javascript
Number.MAX_SAFE_INTEGER === Math.pow(2, 53) - 1// true
Number.MAX_SAFE_INTEGER === 9007199254740991// true
Number.MIN_SAFE_INTEGER === -Number.MAX_SAFE_INTEGER// true
Number.MIN_SAFE_INTEGER === -9007199254740991// true
//这可以看到JavaScript能够精确表示的极限

//Number.isSafeInnteger()则是用来判断一个整数是否落在这个范围之内：
Number.isSafeInteger('a') // false
Number.isSafeInteger(null) // false
Number.isSafeInteger(NaN) // false
Number.isSafeInteger(Infinity) // false
Number.isSafeInteger(-Infinity) // false
Number.isSafeInteger(3) // true
Number.isSafeInteger(1.2) // false
Number.isSafeInteger(9007199254740990) // true
Number.isSafeInteger(9007199254740992) // false
Number.isSafeInteger(Number.MIN_SAFE_INTEGER - 1) // false
Number.isSafeInteger(Number.MIN_SAFE_INTEGER) // true
Number.isSafeInteger(Number.MAX_SAFE_INTEGER) // true
Number.isSafeInteger(Number.MAX_SAFE_INTEGER + 1) // false

//这个函数的实现很简单，就是跟安全整数的两个边界值比较一下
Number.isSafeInteger = function (n) {
  return (typeof n === 'number'&&Math.round(n) === n&&Number.MIN_SAFE_INTEGER <= n&&n <= Number.MAX_SAFE_INTEGER);
}
//实际使用这个函数的时候，需要注意验证运算结果是否落在安全整数的范围内，不要只验证运算结果，而要同时验证参与运算的每个值：
Number.isSafeInteger(9007199254740993)// false
Number.isSafeInteger(990)// true
Number.isSafeInteger(9007199254740993 - 990)// true
9007199254740993 - 990// 返回结果 9007199254740002，正确答案应该是 9007199254740003
//这里面，9007199254740993不是一个安全整数，但是Number.isSafeInteger会返回结果，显示计算结果是安全的，这是因为这个数超出了精度范围，导致在计算机内部以9007199254740992的形式储存
9007199254740993 === 9007199254740992// true

//所以，如果只验证运算结果是否为安全整数，很可能得到错误结果，下面的函数可以同时验证两个运算数和运算结果
function trusty(left,rigth,result){
    if(Number.isSafeInteger(left))&&Number.isSafeInteger(right)&&Number.isSafeInteger(result){
        return result;
    }
    throw new RangeError('不被信任的操作')
}
trusty(9007199254740993, 990, 9007199254740993 - 990)//报错：操作不被信任
trusty(1,2,3)//3
```
### 7.Math对象的扩展
  es6在Math对象上新增了17个（！！！！）与数学相关的方法，所有的这些方法都是静态的，只能在Math对象上调用：
#### 7.1 Math.trunc()
  Math.trunc方法用于去除一个数的小数部分，返回整数部分：
```javascript
Math.trunc(4.1) // 4
Math.trunc(4.9) // 4
Math.trunc(-4.1) // -4
Math.trunc(-4.9) // -4
Math.trunc(-0.1234) // -0
```
  对于非数值，Math.trunc内部使用Number方法将其先转换为数值：
```javascript
Math.trunc('123.456')//123
Math.trunc(true)//1
Math.trunc(false)//0
Math.trunc(null) // 0
```
  对于空值和无法取整数的值，返回NaN：
```javascript
Math.trunc(NaN)//NaN
Math.trunc('foo')// NaN
Math.trunc()// NaN
Math.trunc(undefined) // NaN
```
  对于没有部署这个方法的环境，可以用下面的代码模拟：
```javascript
Math.trunc=Math.trunc||function(x){
    return x<0?Math.ceil(c):Math.floor(x)
}
```
#### 7.2 Math.sign()
  Math.sign方法用来判断一个数到底是正数、负数还是零。对于非数值，会先将其转换为数值，它会返回五种值：
  - 参数为正数，返回+1
  - 参数为负数，返回-1
  - 参数为0，返回0
  - 参数为-0，返回-0
  - 其它值，返回NaN
```javascript
Math.sign(-5) // -1
Math.sign(5) // +1
Math.sign(0) // +0
Math.sign(-0) // -0
Math.sign(NaN) // NaN
```
  如果参数是非数值，会自动转换为数值，对于那些无法转为数值的值，会返回NaN：
```javascript
Math.sign('') // 0
Math.sign(true)// +1
Math.sign(false)// 0
Math.sign(null)// 0
Math.sign('9')// +1
Math.sign('foo')// NaN
Math.sign()// NaN
Math.sign(undefined)// NaN
```
  对于没有部署这个方法的环境，可以自己写一个啊：
```javascript
Math.sign=Math.sign||function(x){
    x= +x;
    if(x===0 || isNaN(x)){
        return x
    }
    rreturn x>0?1:-1;
}
```
#### 7.3 Math.cbrt()
  Math.cbrt方法用于计算一个数的立方根：
```javascript
Math.cbrt(-1)// -1
Math.cbrt(0)// 0
Math.cbrt(1)// 1
Math.cbrt(2)// 1.2599210498948734
```
  对于非数值，Math.cbrt方法内部也是先使用Number方法将其转为数值：
```javascript
Math.cbrt('8')//2
Math.cbrt('luelue')//NaN
```
  对于没有部署这个方法的环境，可以用下面的代码模拟：
```javascript
  Math.cbrt=Math.cbrt || function(x){
    var y=Math.pow(Math.abs(x),1/3)
    return x<0?-y:y
}
```
#### 7.4 Math.clz32()
  JavaScript的整数使用32位二进制形式表示，Math.clz32方法返回一个数的32位无符号整数形式有多少个前导0：
```javascript
Math.clz32(0) // 32
Math.clz32(1) // 31
Math.clz32(1000) // 22
Math.clz32(0b01000000000000000000000000000000) // 1
Math.clz32(0b00100000000000000000000000000000) // 2
//这里面，0的二进制形式全为0，所以有32个前导0,1的二进制形式是0b1，只占1位，所以32位之中有31个前导0,1000的二进制形式是0b1111101000，一共有10位，所以32位之中有22个前导0
```
  clz32这个函数名就来自”count leading zero bits in 32-bit binary representation of a number“（计算一个数的 32 位二进制形式的前导 0 的个数）的缩写。左移运算符(<<)与Math.clz32方法直接相关：
```javascript
Math.clz32(0)// 32
Math.clz32(1)// 31
Math.clz32(1<<1)// 30
Math.clz32(1<<2)// 29
Math.clz32(1<<29)// 2
```
  对于小数，Math.clz32方法只考虑整数部分：
```javascript
Math.clz32(3.2)//30
Math.clz32(3.9)//30
```
  对于空值或其它类型的值，Math.clz32方法会将它们先转为数值，然后再计算：
```javascript
Math.clz32()// 32
Math.clz32(NaN)// 32
Math.clz32(Infinity)// 32
Math.clz32(null)// 32
Math.clz32('foo')// 32
Math.clz32([])// 32
Math.clz32({})// 32
Math.clz32(true)// 31
```
#### 7.5 Math.imul()
  这个方法返回两个数以32位带符号整数形式相乘的结果，返回的也是一个32位的带符号整数：
```javascript
Math.imul(2, 4)   // 8
Math.imul(-1, 8)  // -8
Math.imul(-2, -2) // 4
```
  如果只考虑最后32位，大多数情况下，Math.imul(a,b)与a\*b的结果是相同的，即该方法等同于(a\*b)|0的效果，超过32位的部分溢出，之所以需要部署这个方法，是因为JavaScript有精度限制，超过2的53次方的值无法精确表示，这就是说，对于那些很大数的乘法，低位数值往往是不准确的，Math.imul方法可以返回正确的低位数值：
```javascript
(0x7fffffff * 0x7fffffff)|0 // 0，由于这两个二进制数的最低位都是 1,这个返回结果肯定不对的，因为根据二进制的乘法，计算结果的二进制最低位应该也是1，这个错误就是因为它们的乘积超过了2的53次方，JavaScript无法保存额外的精度，就把低位值变成0，Math.imul方法可以返回正确的1：
Math.imul(0x7fffffff, 0x7fffffff) // 1
```
#### 7.6 Math.founnd()
  此方法返回一个数的32位单精度浮点数形式，对于32位单精度格式来说，数值精度是24个二进制位，所以对于-2^24^至2^24^之间的整数，返回结果与参数本身一致:
```javascript
Math.fround(0)// 0
Math.fround(1)// 1
Math.fround(2 ** 24 - 1)// 16777215
//如果参数的绝对值大于2^24^，返回的结果便开始丢失精度
Math.fround(2 ** 24)// 16777216
Math.fround(2 ** 24 + 1)// 16777216
```
  Math.fround方法的主要作用，是将64位双精度浮点数转为32位 单精度浮点数，如果小数的精度超过24个二进制位，返回值就会不同于原值，否则返回值不变，就还是和64位双精度值一致：
```javascript
// 未丢失有效精度
Math.fround(1.125)// 1.125
Math.fround(7.25)// 7.25
// 丢失精度
Math.fround(0.3)// 0.30000001192092896
Math.fround(0.7)// 0.699999988079071
Math.fround(1.0000000123) // 1
```
  对于NaN和Infinity，此方法返回原值，对于其它类型的非数值，Math.fround方法会先将其转为数值，再返回单精度浮点数：
```javascript
Math.fround(NaN)// NaN
Math.fround(Infinity)// Infinity
Math.fround('5')// 5
Math.fround(true)// 1
Math.fround(null)// 0
Math.fround([])// 0
Math.fround({})// NaN
```
  对于没有部署这个方法的环境，可以模拟一下：
```javascript
Math.fround=Math.fround||function(x){
    return new Float32Arrat([x])[0]
}
```
#### 7.7 Math.hypot()
  此方法返回所有参数的平方和的平方根：
```javascript
Math.hypot(3, 4)// 5
Math.hypot(3, 4, 5)// 7.0710678118654755
Math.hypot()// 0
Math.hypot(NaN)// NaN
Math.hypot(3, 4, 'foo')// NaN
Math.hypot(3, 4, '5')// 7.0710678118654755
Math.hypot(-3) // 3
//如果参数不是数值，Math.hypot方法会将其转为数值，只要有一个参数无法转为数值，就会返回NaN
```
#### 7.8 对数 方法
##### 7.8.1 Math.expm1()
  Math.expm1()返回e^x^-1即Math.exp(x)-1（高中的对数函数什么来着？？）
```javascript
Math.expm1(-1)// -0.6321205588285577
Math.expm1(0)// 0
Math.expm1(1)// 1.718281828459045
```
  对于没有部署这个方法的环境，可以写个函数模拟：
```javascript
Math.expm1=Math.expm1||function(x){
    return Math.exp(x)-1
}
```
##### 7.8.2 Math.log1p()
  这个方法返回1+x的自然对数，即Math.log(1+x)，如果x小于-1，返回NaN：
```javascript
Math.log1p(1)// 0.6931471805599453
Math.log1p(0)// 0
Math.log1p(-1)// -Infinity
Math.log1p(-2)// NaN
```
  对于没有部署这个方法的环境，可以自己写一个：
```javascript
Math.log1p=Math.log1p||function(x){
    return Math.log(1+x)
}
```
##### 7.8.3 Math.log10()
  返回以10为底的x的对数。如果x小于0，则返回NaN：
```javascript
Math.log10(2)// 0.3010299956639812
Math.log10(1)// 0
Math.log10(0)// -Infinity
Math.log10(-2)// NaN
Math.log10(100000) // 5
```
  没有这个方法的环境，自己写：
```javascript
Math.log10=Math.log10||function(x){
    return Math.log(x)/Math.LN10
}
```
##### 7.8.4 Math.log2()
  返回以2为底的对数，如果x小于0，则返回NaN：
```javascript
Math.log2(3)// 1.584962500721156
Math.log2(2)// 1
Math.log2(1)// 0
Math.log2(0)// -Infinity
Math.log2(-2)// NaN
Math.log2(1024)// 10
Math.log2(1 << 29)// 29
```
  没有这个方法的，自己动手，丰衣足食：
```javascript
Math.log2=Math.log2||function(x){
    return Math.log(x)/MMath.LN2
}
```
#### 7.9 双曲函数方法
  - Math.sinh(x)返回x的双曲正弦
  - Math.cosh(x)返回x的双曲余弦
  - Math.tanh(x)返回x的双曲 正切
  - Math.asinh(x)返回x的反双曲正弦
  - Math.acosh(x)返回x的反双曲余弦
  - Math.atanh(x)返回x的反双曲正切
  - 这是记住了方法也不知道用在哪里 系列
### 8.指数运算符
  新增的 指数运算符： \*\*
```javascript
  2**2//4
  2**3//8
```
  指数运算符可以与等号结合，形成一个新的赋值运算符(\*\*=)
```javascript
let a=10
a**=2//100，,相当于a=a*a
let b=4;
b**+3//48,相当于b=b*b*b
```
  在V8引擎中，指数运算符与Math.pow的实现不相同，对于特别大的运算结果，两者会有细微的差异：
```javascript
Math.pow(99,99)//3.697296376497263e+197
99 ** 99// 3.697296376497268e+197
//运算结果的最后一位有效数字是有差异的
```

## 六、函数的扩展
### 1.函数参数的默认值
#### 1.1 基本用法
  es6之前，是不能直接给函数的参数指定默认值的，只能采用变通的方法：
```javascript
function log(x, y) {
  y = y || 'World';
  console.log(x, y);
}
log('Hello') // Hello World
log('Hello', 'China') // Hello China
log('Hello', '') // Hello World
//这个代码里面检查函数log的参数y有没有赋值，如果没有，则指定默认值为world，这种写法的缺点在于，如果参数y赋值了，但是对应的布尔值为false，则该赋值不起作用。就像上面代码的最后一行，参数y等于空字符，结果被改为默认值。

//为了避免这个问题，通常需要先判断一下参数y是否被赋值，如果没有，再等于默认值。
if(typeof y === 'undefined'){
    y='world'
}
```
  es6允许为函数的参数设置默认值，即直接写在参数定义的后面：
```javascript
function log(x,y='world'){
    console.log(x,y)
}
log('Hello') // Hello World
log('Hello', 'China') // Hello China
log('Hello', '') // Hello
//es6的写法比es5简洁很多，而且非常自然：
function Point(x = 0, y = 0) {
  this.x = x;
  this.y = y;
}
const p = new Point();
p // { x: 0, y: 0 }
```
  除了简洁，es6的写法还有两个好处，首先，阅读代码的人可以立刻意识到哪些参数是可以省略的，不用查看函数体或者文档，其次有利于将来的代码优化，即使未来的版本在对外接口中，彻底拿掉这个参数，也不回导致以前的代码无法运行。
  参数变量是默认声明的，所以不能用let或者const再次声明：
```javascript
function foo(x=s){
    let x=1//error
    const x=2//error
}
//这个代码里面，参数变量x是默认声明的，在函数体中，不能用let或者const再次声明，否则会报错
```
  使用参数默认值时，函数不能有同名参数：
```javascript
//不报错
function foo(x,x,y){...}
//报错:Duplicate parameter name not allowed in this context
function foo(x,x,y=1){....}
```
  另外一个容易忽略的地方是，参数默认值不是传值的，而是每次都重新计算默认值表达式的值。也就是说参数默认值是惰性求值的
```javascript
let x = 99;
function foo(p = x + 1) {
  console.log(p);
}
foo() // 100
x = 100;
foo() // 101
//上面代码中，参数p的默认值是x+1。这时，每次调用函数foo，都会重新计算x+1，而不是默认p等于100。
```
#### 1.2 与结构赋值默认值结合使用
  参数默认值可以与解构赋值的默认值，结合起来使用：
```javascript
function foo({x, y = 5}) {
  console.log(x, y);
}
foo({}) // undefined 5
foo({x: 1}) // 1 5
foo({x: 1, y: 2}) // 1 2
foo() // TypeError: Cannot read property 'x' of undefined
//这段代码只使用了对象的解构赋值默认值，没有使用函数参数的默认值，只有当函数foo的参数是一个对象时，变量x和y才会通过解构赋值生成，如果函数foo调用时没有提供参数，变量x和y就不会生成，从而报错。通过提供函数参数的默认值，就可以避免这种情况
function foo({x, y = 5} = {}) {
  console.log(x, y);
}
foo() // undefined 5
//如果没有提供参数，函数foo的参数默认为一个空对象
```
  下面是另一个解构赋值默认值的例子：
```javascript
function fetch(url, { body = '', method = 'GET', headers = {} }) {
  console.log(method);
}
fetch('http://example.com', {})// "GET"
fetch('http://example.com')// 报错
//这段代码里，如果函数fetch的第二个参数是一个对象，就可以为它的三个属性设置默认值。这种写法不能省略第二个参数，如果结合函数参数的默认值，就可以省略第二个参数。这时，就出现了双重默认值
function fetch(url, { body = '', method = 'GET', headers = {} } = {}) {
  console.log(method);
}
fetch('http://example.com')// "GET"
//上面代码中，函数fetch没有第二个参数时，函数参数的默认值就会生效，然后才是解构赋值的默认值生效，变量method才会取到默认值GET。
```
  看一下下面两种写法有什么区别？
```javascript
// 写法一
function m1({x = 0, y = 0} = {}) {
  return [x, y];
}
// 写法二
function m2({x, y} = { x: 0, y: 0 }) {
  return [x, y];
}
//两种写法都对函数的参数设定了默认值，区别是写法一函数参数的默认值是空对象，但是设置了对象解构赋值的默认值；写法二函数参数的默认值是一个有具体属性的对象，但是没有设置对象解构赋值的默认值。

// 函数没有参数的情况
m1() // [0, 0]
m2() // [0, 0]

// x 和 y 都有值的情况
m1({x: 3, y: 8}) // [3, 8]
m2({x: 3, y: 8}) // [3, 8]

// x 有值，y 无值的情况
m1({x: 3}) // [3, 0]
m2({x: 3}) // [3, undefined]

// x 和 y 都无值的情况
m1({}) // [0, 0];
m2({}) // [undefined, undefined]

m1({z: 3}) // [0, 0]
m2({z: 3}) // [undefined, undefined]
```
#### 1.3 参数默认值的位置
  通常情况下，定义了默认值的参数，应该是函数的尾参数，因为这样比较容易看出来，到底省略了哪些参数，如果非尾部的参数设置默认值，实际上这个参数是没法省略的。
```javascript
// 例一
function f(x = 1, y) {
  return [x, y];
}
f() // [1, undefined]
f(2) // [2, undefined])
f(, 1) // 报错
f(undefined, 1) // [1, 1]

// 例二
function f(x, y = 5, z) {
  return [x, y, z];
}
f() // [undefined, 5, undefined]
f(1) // [1, 5, undefined]
f(1, ,2) // 报错
f(1, undefined, 2) // [1, 5, 2]
//ほら、有默认值的参数都不是尾参数，这时，无法只省略该参数，而不省略它后面的参数，除非显示输入undefined。如果传入undefined，将触发该参数等于默认值，null则没有这个效果
function foo(x = 5, y = 6) {
  console.log(x, y);
}
foo(undefined, null)// 5 null
//上面代码中，x参数对应undefined，结果触发了默认值，y参数等于null，就没有触发默认值
```
#### 1.4 函数的length属性
  指定了默认值以后，函数的length属性将返回没有指定默认值的参数个数，也就是说指定了默认值以后，length属性将失真。
```javascript
(function (a) {}).length // 1
(function (a = 5) {}).length // 0
(function (a, b, c = 5) {}).length // 2
//这段代码中，length属性的返回值，等于函数的参数个数减去了指定了默认值参数个数，比如上面最后一个函数，定义了3个参数，其中有一个参数c指定了默认值，因此length属性等于3-1，最后得到2。

//这是因为length属性的含义是，该函数预期传入的参数个数，某个参数指定默认值以后，预期传入的参数个数就不包括这个参数了，同理后面的rest参数也不会计入length属性：
(function(...args) {}).length // 0

//如果设置了默认值的参数不是尾参数，那么length属性也不再计入后面的参数了
(function (a = 0, b, c) {}).length // 0
(function (a, b = 1, c) {}).length // 1
```
#### 1.5 作用域
  一旦设置了参数的默认值，函数进行声明初始化时，参数会形成一个单独的作用域，等到初始化结束，这个作用域就会消失，这种语法行为，在不设置参数默认值时是不会出现的：
```javascript
var x=1;
function fun(x,y=x){
    console.log(y)
}
fun(2)//2
//这个代码中，参数y的默认值等于变量x，调用函数f时，参数形成一个单独的作用域，在这个作用域里面，默认值变量x指向第一个参数x，而不是全局变量x，所以输出是2

//再看一个
let x=1;
function fun(y=x){
    let x=2;
    console.log(y)
}
fun()//1
//函数fun调用的时候，参数y=x形成一个单独的作用域，这个作用域里面，变量x本身没有定义，所以指向外层的全局变量x，函数调用时，函数体内部的局部变量x影响不到默认值变量x，如果此时全局变量x不存在，就会报错
function fun(y=x){
    let x=2;
    console.log(y)
}
fun()//报错，x is not defined

//下面这样写，也会报错
var x=1;
function fun(x=x){...}
fun()//报错 x is not defined
//这里面参数x=x形成一个单独的作用域，实际执行的是let x=x，由于暂时性死区的原因，这行代码会报错“x未定义”
```
  如果参数的默认值是一个函数，该函数的作用域也遵守这个规则，看下这个例子：
```javascript
let foo = 'outer';
function bar(func = () => foo) {
  let foo = 'inner';
  console.log(func());
}
bar(); // outer
//这段代码里，函数bar的参数func的默认值是一个匿名函数，返回值为变量foo，函数参数形成的单独作用域里面，并没有定义变量foo，所以foo指向外层的全局变量foo，因此输出outer

//如果写成下面这样，就会报错
function bar(func=() => foo){
    let foo='inner';
    console.log(func())
}
bar()//报错，foo is not defined，匿名函数里面的foo指向函数外层，但是函数外层并没有声明变量foo，所以报错
```
  这里有一个更复杂一些的例子：
```javascript
var x = 1;
function foo(x, y = function() { x = 2; }) {
  var x = 3;
  y();
  console.log(x);
}
foo() // 3
x // 1
//函数foo的参数形成一个单独的作用域，这个作用域里面，首先声明了变量x，然后声明了变量y，y的默认值是一个匿名函数，这个函数内部的变量x指向同一个作用域的第一个参数x，函数foo内部又声明了一个内部变量x，该变量与第一个参数x由于不是同一个作用域，所以不是同一个变量，因此执行y后，内部变量x和外部全局变量x的值都没变，如果将var x = 3的var去除，函数foo的内部变量x就指向第一个参数x，与匿名函数内部的x是一致的，所以最后输出的就是2，而外层的全局变量x依然不受影响。
var x=1;
function foo(x,y=function(){x=2}){
    x=3;
    y();
    console.log(x)
}
foo()//2
x//1
```
#### 1.6 应用
  利用参数默认值，可以指定某一个参数不得省略，如果省略就抛出一个错误：
```javascript
function throwIfMissing() {
  throw new Error('Missing parameter');
}
function foo(mustBeProvided = throwIfMissing()) {
  return mustBeProvided;
}
foo()// Error: Missing parameter
//foo函数如果调用的时候没有参数，就会调用默认值throwIfMissing函数，从而抛出一个错误。从上面代码还可以看到，参数mustBeProvided的默认值等于throwIfMissing函数的运行结果（注意函数名throwIfMissing之后有一对圆括号），这表明参数的默认值不是在定义时执行，而是在运行时执行。如果参数已经赋值，默认值中的函数就不会运行。另外，可以将参数默认值设为undefined，表明这个参数是可以省略的。
function foo(optional = undefined) { ··· }
```
### 2.rest参数
  es6引入rest参数（形式为...变量名），用于获取函数的多余参数，这样就不需要使用arguments对象了，rest参数搭配的变量是一个数组，该变量将多余的参数放入数组中。
```javascript
function add(...values){
    let sum=0;
    for (var val of values){
        sum += val
    }
    return sum
}
add(1,2,3)//6
//add是一个求和参数，利用rest参数，可以向该函数传入任意数目的参数
```
  看一个rest参数代替arguments变量的例子：
```javascript
//arguments变量的写法
function sortNumbers(){
    return Array.prototype.slice.call(arguments).sort()
}
//rest参数写法
const sortNumber=(...numbers)=>numbers.sort()//明显这个更简洁啊
```
  arguments对象不是数组，而是一个类似数组的对象，所以为了使用数组的方法，必须使用Array.prototype.slice.call先将其转为数组，rest参数就不存在这个问题，它就是一个真正的数组，数组特有的方法都可以使用，看一个利用rest参数改写数组push方法的例子。
```javascript
function push(array,...items){
    items.function(function(item){
        array.push(item);
        console.log(item)
    })
}
var arr=[];
push(arr,1,2,3)
//rest参数之后不能再有其它参数，它只能是最后一个参数，否则会报错
//函数的length属性，不包括rest参数
(function(a) {}).length  // 1
(function(...a) {}).length  // 0
(function(a, ...b) {}).length  // 1
```
### 3.严格模式
  从es5开始，函数内部可以设定为严格模式：
```javascript
function doSomething(a, b) {
  'use strict';
  //代码
}
```
  es6做了一点修改，规定只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错：
```javascript
// 报错
function doSomething(a, b = a) {
  'use strict';
  //....
}
// 报错
const doSomething = function ({a, b}) {
  'use strict';
  // ....
};
// 报错
const doSomething = (...a) => {
  'use strict';
  // ....
};
const obj = {
  // 报错
  doSomething({a, b}) {
    'use strict';
    // ....
  }
};
//这样规定的原因是，函数内部的严格模式，同时适用于函数体和函数参数，但是函数执行的时候，先执行函数参数，然后再执行函数体，这样就有一个不合理的地方，只有从函数体之中，才能知道参数是否应该以严格模式执行，但是参数却应该先于函数体执行

function doSomething(value = 070) {// 报错
  'use strict';
  return value;
}
//这段代码中，参数value的默认值是八进制数070，但是严格模式下不能用前缀0表示八进制，所以应该报错，但是实际上，JavaScript引擎会先执行value=070，然后进入函数体内部，发现需要用严格模式执行，这时才会报错。
```
  虽然可以先解析函数体代码，再执行参数代码，但是这样无疑就增加了复杂性。因此，标准索性禁止了这种用法，只要参数使用了默认值、解构赋值、或者扩展运算符，就不能显式指定严格模式。
  两种方法可以规避这种限制。第一种是设定全局性的严格模式，这是合法的。
```javascript
'use strict';
function doSomething(a,b=a){...}
```
  第二种是把函数包在一个无参数的立即执行函数里面：
```javascript
const doSomething = (function () {
  'use strict';
  return function(value = 42) {
    return value;
  };
}());
```
### 4.name属性
  函数的name属性，返回该函数的函数名：
```javascript
function foo(){}
foo.name// 'foo'
//这个属性早就被浏览器广泛支持，但是直到es6才将其写入标准
```
  需要注意的是，es6对这个属性的行为做出了一些修改，如果将一个匿名函数赋值给一个变量，es5的name属性，会返回空字符串，es6的name属性会返回实际的函数名
```javascript
var fun=function(){}
//es5
fun.name //''
//es6
fun.name //'fun'
//变量fun就等于一个匿名函数，es5和es6属性返回的值不一样
```
  如果将一个具名函数赋值给一个变量，那es5和es6都返回这个具名函数原本的名字：
```javascript
const bar = function baz() {};
// ES5
bar.name // 'baz'
// ES6
bar.name // 'baz'
```
  Function构造函数返回的函数实例，name属性的值为anonymous：
```javascript
(new Function).name//'anonymous'
```
  bind返回的函数，name属性值会加上bound前缀：
```javascript
function foo() {};
foo.bind({}).name // "bound foo"
(function(){}).bind({}).name // "bound "
```
### 5.箭头函数
#### 5.1 基本用法
  es6允许使用 “=>”定义函数：
```javascript
var fun = v=>v;
//等同于
var fun=function(v){return v}
```
  如果箭头函数不需要参数或需要多个参数，就使用一个圆括号代表参数部分：
```javascript
var fun=()=>5
//等同于
var fun =function(){return 5}
var sum=(num1,num2)=>num1+num2
//等同于
var sum=functionn(num1,num2){return num1+num2}
```
  如果箭头函数的代码块部分多于一条语句，就要使用大括号将它们括起来，并且使用return语句返回。
```javascript
var sum=(num1,num2)=>{return num1+num2}
```
  由于大括号被解释为代码块，所以如果箭头函数直接返回一个对象，必须在对象外面加上括号，否则会报错：
```javascript
let getTempItem = id => { id: id, name: "Temp" };//报错
let getTempItem = id => ({ id: id, name: "Temp" });//不报错
```
  下面是一种特殊情况，虽然可以运行，但会得到错误的结果：
```javascript
let foo=()=>{a:1}
foo()//undefined,原始意图是返回一个对象{a:1}，但是由于引擎认为大括号是代码块，所以执行了一行语句a:1,这时，a可以被解释为语句的标签，因此实际执行的语句是1，然后函数就结束了，没有返回值。

//如果箭头函数只有一行语句，且不需要返回值，可以采用下面的写法，就不用写大括号了：
let fn = () => void doesNotReturn();
```
  箭头函数可以与变量解构结合使用：
```javascript
const full = ({ first, last }) => first + ' ' + last;
// 等同于
function full(person) {
  return person.first + ' ' + person.last;
}
```
  箭头函数使得表达更加简洁：
```javascript
const isEven = n => n % 2 == 0;
const square = n => n * n;
//只用了两行，就定义了两个简单的工具函数，如果不用箭头函数，可能就要占用多行，而且还不如现在这样写的醒目
```
  箭头函数的一个用处就是简化回调函数
```javascript
// 正常函数写法
[1,2,3].map(function (x) {
  return x * x;
});
// 箭头函数写法
[1,2,3].map(x => x * x);

//另一个例子是：
// 正常函数写法
var result = values.sort(function (a, b) {
  return a - b;
});
// 箭头函数写法
var result = values.sort((a, b) => a - b);
```
  下面是rest参数与箭头函授结合的例子：
```javascript
cosnt numbers=(...nums)=>nums;
numbers(1,2,3,4,5)//[1,2,3,4,5]
const headAndTail=(head,...tail)=>[head,tail]
headAndTail(1,2,3,4,5)//[1,[2,3,4,5]]
```
#### 5.2 使用注意点
  箭头函数有几个使用注意点：
  - 函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象
  - 不可以当做构造函数，也就是说，不可以使用new命令，否则会抛出错误
  - 不可以使用arguments对象，该对象在函数体内不存在，如果要用，可以用rest参数代替
  - 不可以使用yield命令，因此箭头函数不能用作Generator函数
  第一点注意一下，this对象的指向是可变的，但是在箭头函数中，它是固定的：
```javascript
function foo(){
    setTimeout(()=>{
        console.log('id:',this.id)
    },100)
}
var id =14;
foo.call({id:24})//id:24
//setTimeout的参数是一个箭头函数，这个箭头函数的定义生效是在foo函数生成的时候，而它真正执行要等到100毫秒后，如果是普通函数，执行this应该指向全局对象window，这时应该输出21，但是箭头函数导致this总是指向函数定义生效时所在的对象（就是{id:24}），所以输出24。
```
  箭头函数可以让setTimeout里面的this，绑定定义时所在的作用域，而不是指向运行时所在的作用域：
```javascript
function Timer(){
    this.s1=0;
    this.s2=0;;
    //箭头函数
    setInterval(()=>this.s1++,1000);
    //普通函数
    setInterval(function(){
        this.s2++;
    },1000)
}
var timer=new Timer();
setTimeout(()=>console.log('s1:',timer.s1),3100)//s1:3
setTimeout(()=>console.log('s2:',timer.s2),3100)//s2:0
//Timer函数内部设置了两个定时器，分别使用了箭头函数和普通函数。前者的this绑定定义时所在的作用域（即Timer函数），后者的this指向运行时所在的作用域（即全局对象），所以31100毫秒之后，timer.s1被更新了三次，而timer.s2一次都没更新
```
  箭头函数可以让this指向固定化，这种特性很有利于封装回调函数，看下面这个例子，DOM事件的回调函数封装在一个对象里面：
```javascript
var handler={
    id:'123456',
    init:function({  document.addEventListener('click',event=>this.doSomething(event.type),false)
    },
    doSomething:function(type){
        console.log('handling'+type+'for'+this.id)
    }
}
//init方法中，使用了箭头函数，这导致这个箭头函数里面的this，总是指向handler对象，否则，回调函数运行时，this.doSomething这一行会报错，因为此时this指向document对象。
```
  this指向的固定化，并不是因为镜头函数内部有绑定this的机制，实际原因是箭头函数没有自己的this，导致内部的this就是外层代码的this，正是因为它没有this，所以也就不能用作构造函数：
  所以箭头函数转成es5的代码长这样：
```javascript
//es6
function foo(){
    setTimeout(()=>{
        console.log('id',this.id)
    },100)
}
//es5
function foo(){
    var _this=this;
    setTimeout(function(){
        console.log('id:',_this.id)
    },100)
}
//转换后的es5代码能看出来，箭头函数里面根本没有自己的this，而是引用的外层this
```
  那么问题来了，下面的代码之中有几个this？
```javascript
function foo(){
    return ()=>{
        return ()=>{
            return ()=>{
                console.log('id:',this.id)
            }
        }
    }
}
var f=foo.call({id:1})
var t1 = f.call({id: 2})()(); // id: 1
var t2 = f().call({id: 3})(); // id: 1
var t3 = f()().call({id: 4}); // id: 1
//只有一个this，就是函数foo的this，所以t1，t2，t3都输出同样的结果，因为所有的内层函数都是箭头函数，都没有自己的this，它们的this其实都是最外层foo函数的this
```
  除了this，以下三个变量在箭头函数之中也是不存在的，指向外层函数的对应变量：arguments、super、new.target
```javascript
function foo(){
    setTimeout(()=>{
  		console.log('args:',arguments)
    },100)
}
foo(1,2,3,4)//args:[1,2,3,4]，箭头函数内部的变量arguments，其实是函数foo的arguments变量
```
  另外，由于箭头函数没有自己的this，所以当然也就不能用call()、apply()、bind()这些方法去改变this的指向（敲黑板）
```javascript
(function(){
    return [
        (()=>this.x).bind({x:'inner'})()
    ]
}).call({x:'outer'})//['outer']，因为箭头函数没有自己的this，所以bind方法无效，内部的this指向外部的this。
```
#### 5.3 嵌套的箭头函数
  箭头函数内部，还可以再使用箭头函数，es5语法的多重嵌套函数长这样：
```javascript
function insert(value){
    return {into:function(array){
        return {after:function(afterValue){
            array.splice(array.indexOf(afterValue)+1,0,value);
            return array;
        }}
    }}
}
insert(2).into([1,3]).after(1)//[1,2,3]
```
  使用箭头函数改写：
```javascript
let insert=(value)=>({into:(array)=>({after:(afterValue)=>{
    array.aplice(array.indexOf(afterValue)+1,0,value);
    return array;
}})});
insert(2).into([1,3]).after(1)//[1,2,3]
```
  看一个部署管道机制的例子，即前一个函数的输出是后一个函数的输入：
```javascript
const pipeline=(...funs)=>val=>funs.reduce((a,b)=>b(a),val);
const plus1=a=>a+1;
const mult2=a=>a*2;
const addThenMult=pipeline(plus1,mult2);
addThenMult(5)//12

//如果觉得可读性差，可以这样写
const plus1 = a => a + 1;
const mult2 = a => a * 2;
mult2(plus1(5))// 12
```
  箭头函数还有一个功能，就是可以很方便地改写λ演算(一套用于研究函数定义，函数应用和递归的形式系统，，所以怎么用？？？？啥时候能用这个？？？？)：
```javascript
// λ演算的写法
fix = λf.(λx.f(λv.x(x)(v)))(λx.f(λv.x(x)(v)))
// ES6的写法
var fix = f => (x => f(v => x(x)(v)))
               (x => f(v => x(x)(v)));
```
### 6.双冒号运算符
  箭头函数可以绑定this对象，大大减少了显示绑定this对象的写法（call，apply，bind），但是，箭头函数并不适用于所有场合，所以有一个提案，提出了“函数绑定”运算符，用来取代call，apply，bind调用。函数绑定运算符是并排的两个冒号（::），双冒号左边是一个对象，右边是一个函数，该运算符会自动将左边的对象，作为上下文环境（就是this对象），绑定到右边的函数上面：
```javascript
foo::bar;
//相当于
bar.bind(foo)

foo::bar(...arguments)
//相当于
bar.apply(foo,arguments)

const hasOwnProperty=Object.prototype.hasOwnProperty;
function hasOwn(obj,key){
    return obj::hasOwnProperty(key)
}
```
  如果双冒号左边为空，右边是一个对象的方法，则等于将该方法绑定在该对象上面：
```javascript
var method=obj::obj.foo;
//等同于
var method=::obj.foo

let log=::console.log
//等同于
var log=console.log.bind(console)
```
  如果双冒号运算符的运算结果，还是一个对象，就可以采用链式写法：
```javascript
import { map, takeWhile, forEach } from "iterlib";
getPlayers()
::map(x => x.character())
::takeWhile(x => x.strength > 100)
::forEach(x => console.log(x));
```
### 7.尾调用优化
  尾调用就是指某个函数 的最后一步是调用另一个函数：
```javascript
function fun(x){
    return g(x) 
}
//函数fun的最后一步是调用函数g，这就是尾调用
```
  以下三种情况，都不属于尾调用：
```javascript
// 情况一,调用函数g之后还有赋值操作
function f(x){
  let y = g(x);
  return y;
}
// 情况二，调用之后还有运算
function f(x){
  return g(x) + 1;
}
// 情况三
function f(x){
  g(x);
}
//情况三等同于下面这样
function f(x){
    g(x);
    return undefined;
}
```
  尾调用不一样出现在函数尾部，只要是最后一步操作即可：
```javascript
function f(x) {
  if (x > 0) {
    return m(x)
  }
  return n(x);
}
//上面代码中，函数m和n都属于尾调用，因为它们都是函数f的最后一步操作。
```
#### 7.1 尾调用优化
  尾调用之所以与其它调用不同，就在与它特殊的调用位置。函数调用会在内存形成一个“调用记录”，又称“调用帧”，保存调用位置和内部变量等信息。如果在函数A的内部调用函数B，那么在A的调用帧上方，还会形成一个B的调用帧。等到B运行结束，将结果返回到A，B的调用帧才会消失。如果函数B内部还调用函数C，那就还有一个C的调用帧，以此类推。所有的调用帧，就形成一个“调用栈”。尾调用由于是函数的最后一步操作，所以不需要保留外层函数的调用帧，因为调用位置、内部变量等信息都不会再用到了，只要直接用内层函数的调用帧，取代外层函数的调用帧就可以了。
```javascript
function f() {
  let m=1;
  let n=2;
  return g(m + n);
}
f();
// 等同于
function f(){
  return g(3);
}
f();
// 等同于
g(3);
/*如果函数g不是尾调用，函数f就需要保存内部变量m和n的值、g的调用位置等信息。但由于调用g之后，函数f就结束了，所以执行到最后一步，完全可以删除f(x)的调用帧，只保留g(3)的调用帧。
  这就叫做“尾调用优化”，即只保留内层函数的调用帧。如果所有函数都是尾调用，那么完全可以做到每次执行时，调用帧只有一项，这将大大节省内存。这就是“尾调用优化”的意义。
  注意，只有不再用到外层函数的内部变量，内层函数的调用帧才会取代外层函数的调用帧，否则就无法进行“尾调用优化”。*/
  
  function addOne(a){
  var one = 1;
  function inner(b){
    return b+one;
  }
  return inner(a);//不会进行尾调用优化，因为内层函数inner用到了外层函数addOne的内部变量one。
}
```
#### 7.2 尾递归
  函数调用自身，称为递归，如果尾调用自身，就称为尾递归。递归非常消耗内存，因为需要同时保存成千上百个调用帧，很容易发生栈溢出错误，但对于尾递归来说，由于只存在一个调用帧，所以永远不会发生栈溢出错误：
```javascript
function factorial(n) {
  if (n === 1) return 1;
  return n * factorial(n - 1);
}
factorial(5) // 120
//这里计算n的阶乘，最多需要保存n个调用记录，复杂度O(n)
```
  如果改写成尾递归，只保留一个调用记录，复杂度O(1)
```javascript
function factorial(n, total) {
  if (n === 1) return total;
  return factorial(n - 1, n * total);
}
factorial(5, 1) // 120
```
  可以用计算斐波那契数列来看一下尾递归优化，非尾递归的斐波那契数列 实现长这样：
```javascript
function Fibonacci (n) {
  if ( n <= 1 ) {return 1};
  return Fibonacci(n - 1) + Fibonacci(n - 2);
}
Fibonacci(10) // 89
Fibonacci(100) // 堆栈溢出
Fibonacci(500) // 堆栈溢出,50都算的慢死了，别500了
```
  尾递归优化过的斐波那契数列数列实现长这样：
```javascript
function Fibonacci2 (n , ac1 = 1 , ac2 = 1) {
  if( n <= 1 ) {return ac2};
  return Fibonacci2 (n - 1, ac2, ac1 + ac2);
}
Fibonacci2(100) // 573147844013817200000
Fibonacci2(1000) // 7.0330367711422765e+208
Fibonacci2(10000) //报错，Maximum call stack size exceeded
```
#### 7.3 递归函数的改写
  尾递归的实现，往往需要改写递归函数，确保最后一步只调用自身。做到这一点的方法，就是把所有用到的内部不变量改写成函数的参数。比如上面，阶乘函数factorial需要用到一个中间变量total，那就把这个中间变量改写成函数的参数，这样做的缺点就是不太直观，一下子很难看出来，为什么计算5的阶乘，需要传入两个参数5和1呢
  两个方法可以解决这个问题，方法一就是是在尾递归函数之外，再提供一个正常形式的函数：
```javascript
function tailFactorial(n, total) {
  if (n === 1) return total;
  return tailFactorial(n - 1, n * total);
}
function factorial(n) {
  return tailFactorial(n, 1);
}
factorial(5) //120,通过一个正常形式的阶乘函数factorial，调用尾递归函数tailFactorial，看起来就正常多了
```
  函数式编程有一个概念，叫做柯里化，意思是将参数的函数转换成单参数的形式，这里也可以使用柯里化：
```javascript
function currying(fn, n) {
  return function (m) {
    return fn.call(this, m, n);
  };
}
function tailFactorial(n, total) {
  if (n === 1) return total;
  return tailFactorial(n - 1, n * total);
}
const factorial = currying(tailFactorial, 1);
factorial(5) //120,通过柯里化，将尾递归函数tailFactorial变为只接受一个参数的factorial
```
  第二种方法就简单多了，直接用es6 的函数默认值：
```javascript
function factorial(n,total=1){
    if(n===1) return total;
    return factorial(n-1,n*total)
}
factorial(5)//120，参数total有默认值1，所以调用的时候不用提供这个值。
```
  总结一下，递归本质上是一种循环操作。纯粹的函数式编程语言没有循环操作命令，所有的循环都用递归实现，这就是为什么尾递归对这些语言极其重要。对于其他支持“尾调用优化”的语言（比如 ES6），只需要知道循环可以用递归代替，而一旦使用递归，就最好使用尾递归。
#### 7.4 严格模式
  es6的尾调用优化只在严格模式下开启，正常模式是无效的。这是因为在正常模式下，函数内部有两个变量，可以跟踪函数的调用栈：
  - func.arguments：返回调用时函数的参数
  - func.caller：返回调用当前函数的那个函数
  尾调用优化发生时，函数的调用栈会改写，因此上面连个变量就会失真，严格模式禁止用这两个变量，所以尾调用模式仅在严格模式下生效：
```javascript
function restricted() {
  'use strict';
  restricted.caller;    // 报错
  restricted.arguments; // 报错
}
restricted();
```
#### 7.5 尾递归优化的实现
  尾递归优化只在严格模式下生效，那么正常模式下，或者不支持该功能的环境中，就得自己实现尾递归优化。原理很简单，尾递归之所以需要优化，原因是调用栈太多，造成溢出，那么只要减少调用栈，就不会溢出，这时候需要用循环换掉递归：
```javascript
//正常的递归函数
function sum(x,y){
    if(y>0){
        return sum(x+1,y-1)
    }else {
        return x
    }
}
sum(1,10000)//报错，Maximum call stack size exceeded
//sum是一个递归函数，参数x是需要累加的值，参数y控制递归次数。一旦指定sum递归 100000 次，就会报错，提示超出调用栈的最大次数。

//蹦床函数（trampoline）可以将递归执行转为循环执行。
function trampoline(f) {
  while (f && f instanceof Function) {
    f = f();
  }
  return f;
}
//蹦床函数接受一个函数f作为参数，只要f执行后返回一个函数就继续执行，注意这里是返回一个函数，然后执行该函数，而不是函数里面调用函数，这样就避免了递归执行，从而就消除了调用栈过大的问题。然后，要做的就是将原来的递归函数，改写为每一步返回另一个函数。
function sum(x, y) {
  if (y > 0) {
    return sum.bind(null, x + 1, y - 1);
  } else {
    return x;
  }
}
//sum函数的每次执行，都会返回自身的另一个版本。现在，使用蹦床函数执行sum，就不会发生调用栈溢出。
trampoline(sum(1, 100000))// 100001
```
  蹦床函数并不是真正的尾递归优化，下面的才是：
```javascript
function tco(f){
    var value;
    var active=false;
    var accumulated=[];
    retrun function accumulator(){
        accumulated.push(arguments);
        if(!active){
            active=true;
            while(accumulated.length){
                value=f.apply(this,accumulated.shift())
            }
            active=false;
            return value
        }
    }
}
var sum=tco(function(x,y){
    if(y>0){
        return sum(x+1,y-1)
    }else{
        return x
    }
})
sum(1,100000)//100001
//tco函数是尾递归优化的实现，它的奥妙就在于状态变量active。默认情况下，这个变量是不激活的。一旦进入尾递归优化的过程，这个变量就激活了。然后，每一轮递归sum返回的都是undefined，所以就避免了递归执行；而accumulated数组存放每一轮sum执行的参数，总是有值的，这就保证了accumulator函数内部的while循环总是会执行。这样就很巧妙地将“递归”改成了“循环”，而后一轮的参数会取代前一轮的参数，保证了调用栈只有一层。
```
### 8.函数参数的尾逗号
  es2017允许函数的最后一个参数有尾逗号，此前，函数定义和调用时，都不允许最后一个参数后面出现逗号：
```javascript
function clownsEveryWhere(param1,param2){...}
clownsEverywhere(
  'foo',
  'bar'
)//如果在param2后面或者bar后面加一个逗号，就会报错
```
  如果像上面这样，将参数写成多行（即每个参数占据一行），以后修改代码的时候，想为函数clownsEverywhere添加第三个参数，或者调整参数的次序，就势必要在原来最后一个参数后面添加一个逗号。这对于版本管理系统来说，就会显示添加逗号的那一行也发生了变动。这看上去有点冗余，因此新的语法允许定义和调用时，尾部直接有一个逗号。
```javascript
function clownsEverywhere(
  param1,
  param2,
) { /*代码*/ }
clownsEverywhere(
  'foo',
  'bar',
)//这样的规定使得函数参数与数组和对象的尾逗号规则，保持一致了
```

## 七、数组的扩展