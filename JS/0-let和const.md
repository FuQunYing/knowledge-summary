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
























