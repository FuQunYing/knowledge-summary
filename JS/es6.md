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
````
  这种写法太复杂了，错一个引号就慢慢找去吧，模板字符串就很好用了：
```javascript
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









\
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
