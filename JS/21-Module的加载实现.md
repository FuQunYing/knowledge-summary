## 二十二、Module的加载实现
### 1.浏览器加载
#### 1.1 传统方法
  HTML网页中，浏览器通过<script>标签加载JavaScript脚本：
``` html
<!-- 页面内嵌的脚本 -->
<script type="application/javascript">
  // module code
</script>
<!-- 外部脚本 -->
<script type="application/javascript" src="path/to/myModule.js">
</script>
<!--因为浏览器脚本的默认语言是JavaScript，所以 type那里可以省略-->
```
  默认情况下，浏览器是同步加载JavaScript脚本，即渲染引擎遇到<script>标签就会停下来，等到执行完脚本，再继续向下渲染。如果是外部脚本，还必须加入脚本下载的时间。如果脚本体积很大，下载和执行的时间就会很长，因此造成浏览器堵塞，用户会感觉到浏览器 卡死了，没有任何响应。这种体验就不太好了，所以浏览器允许脚本异步加载，下面就是两种异步加载的语法：
``` html
<script src="path/to/myModule.js" defer></script>
<script src="path/to/myModule.js" async></script>
<!--script标签打开的defer或async属性，脚本就会异步加载，渲染引擎遇到这行命令就会开始下载外部脚本，但不会等它下载和执行，而是直接执行后面的命令-->
```
  defer与async的区别是：defer要等到整个页面在内存中正常渲染结束（DOM结构完全生成，以及其它脚本执行完成），才会执行；async一旦下载完成，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染。总结就是 defer是渲染完再执行，async是下载完就执行。另外，如果有多个defer脚本，会按照它们在页面出现的顺序加载，而多个async脚本是不能保证加载顺序的。
#### 1.2 加载规则
  浏览器加载es6模块，也使用<script>标签，但是要加入type='module'属性，告诉浏览器这是一个es6模块：
```html
<script type="module" src="./foo.js"></script>
```
  浏览器对于带有type="module"的<script>，都是异步加载，不会造成堵塞浏览器，即等到整个页面渲染完，再执行模块脚本，等同于打开了<script>标签的defer属性：
```html
<script type="module" src="./foo.js"></script>
<!-- 等同于 -->
<script type="module" src="./foo.js" defer></script>
```
  如果网页有多个<script type="module">，它们会按照在页面出现的顺序依次执行。<script>标签的async属性也可以打开，这时只要加载完成，渲染引擎就会中断渲染立即执行，执行完成后，再恢复渲染：
```html
<script type="module" src="./foo.js" async></script>
```
  一旦使用了async属性，<script type="module">就不会按照在页面出现的顺序执行，而是只要该模块加载完成，就执行该模块。ES6 模块也允许内嵌在网页中，语法行为与加载外部脚本完全一致。
```html
<script type="module">
  import utils from "./utils.js";
  //.....
</script>
```
  对于外部的模块脚本，需要注意：
  - 代码是在模块作用域之中运行，而不是在全局作用域运行，模块内部的顶层变量，外部不可见
  - 模块脚本自动采用严格模式，不管有没有声明use strict
  - 模块之中，可以使用import命令加载其它模块，也可以使用export命令输出对外接口
  - 模块之中，顶层的this关键字返回undefined，而不是指向window，也就是说，在模块顶层使用this关键字，是无意义的。
  - 同一个模块如果加载多次，将只执行一次
    一个示例模块：
```javascript
import utils from 'https://example.com/js/utils.js';
const x = 1;
console.log(x === window.x); //false
console.log(this === undefined); // true
```
  利用顶层的this等于undefined这个语法点，可以侦测当前代码是否在es6模块之中：
```javascript
const isNotModuleScript = this !== undefined;
```
### 2.es6模块与CommonJS模块的差异
  首先es6模块与CommonJS模块有两个重大差异
  - CommonJS模块输出的是一个值的拷贝，es6模块输出的是值的引用
  - CommonJS模块是运行时加载，es6模块是编译时输出接口
    第二个差异是因为CommonJS加载的是一个对象，该对象只有在脚本运行完才会生成。而es6模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。
    重点说一下第一个差异。
    CommonJS模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值，栗子：
```javascript
//libs.js
var counter=3;
function incCounter(){
    counter++;
}
module.exports={
    counter: counter,
    incCounter: incCounter
}
//这里输出内部变量counter和改写这个变量的颞部方法incCounter，然后在main.js里面加载这个模块
```
```javascript
//main.js
var mod=require('./lib')
console.log(mod.counter)//3
mod.incCounter()
console.log(mod.counter)//3
//这里就说明了，lid.js模块加载以后，它的内部变化就影响不到输出的mod.counter了，这是因为mod.counter是一个原始类型的值，会被缓存，除非写成一个函数，才能得到内部变动后的值
```
```javascript
//lib.js
var counter=3;
function incCounter(){
    counter++;
}
module.exports={
    get counter(){
        return counter
    },
    incCounter:incCounter
}
//这里输出的counter属性实际上是一个取值器函数，现在再执行main.js，就可以正确读取内部变量counter的变动了
$ node main.js
3
4
```
  es6模块的运行机制与CommonJS不一样，JS引擎对脚本静态分析的时候，遇到模块加载命令import，就会生成一个只读应用，等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。换句话说，ES6 的import有点像 Unix 系统的“符号连接”，原始值变了，import加载的值也会跟着变。因此，ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。
  还是上面的栗子：
```javascript
// lib.js
export let counter = 3;
export function incCounter() {
  counter++;
}
// main.js
import { counter, incCounter } from './lib';
console.log(counter); // 3
incCounter();
console.log(counter); // 4
//这里就说明了，es6模块输入的变量counter是活的，完全反应其所在模块lib.js内部的变化
```
  这是一个export里面的栗子：
```javascript
// m1.js
export var foo = 'bar';
setTimeout(() => foo = 'baz', 500);
// m2.js
import {foo} from './m1.js';
console.log(foo);
setTimeout(() => console.log(foo), 500);
//m1.js的变量foo，在刚加载时等于bar，过了 500 毫秒，又变为等于baz

//看一下，m2.js能否正确读取这个变化
$ babel-node m2.js
bar
baz
//这里表明，es6模块不会缓存运行结果，而是动态地去被加载的模块取值，并且变量总是绑定其所在的模块。
```
  由于es6输入的模块变量，只是一个 符号连接，所以这个变量是只读的，对它进行重新赋值就会报错：
```javascript
// lib.js
export let obj = {};
// main.js
import { obj } from './lib';
obj.prop = 123; // OK
obj = {}; // TypeError
//mian.js从lib.js输入变量obj，可以对obj添加属性，但是重新赋值就会报错，因为变量obj指向的地址是只读的，不能重新赋值，这就好比main.js创造了一个名为obj的const变量
```
  最后，export通过接口，输出的是同一个值，不同的脚本加载这个接口口，得到的都是同样的实例：
```javascript
//mod.js
function C(){
    this.sum=0;
    this.add=function(){
        this.sum +=1
    }
    this.show=function(){
        console.log(this.sum)
    }
}
export let c=new C()
//这里的mod.js，输出的是一个c的实例，不同的脚本加载这个模块，得到的都是同一个实例
```
```javascript
//x.js
import {c} from './mode'
c.add()
//y.js
import {c} from './mod'
c.show()
//mian.js
import './x'
import './y'
//现在执行main.js，输出的是1
$ babel-node main.js
1
//这就证明了x.js和y.,js加载的都是c的同一个实例
```
### 3.Node加载
#### 3.1 概述
  Node对es6模块的处理比较麻烦，因为它有自己的CommonJS模块格式，与es6模块格式是不兼容的。目前的解决方案是，将两者分开，es6模块和CommonJS采用各自的加载方案。Node要求es6模块采用.mjs后缀文件名，也就是说，只要脚本文件里面使用import或者export命令，那么就必须采用.mjs后缀名。require命令不能加载.mjs文件，会报错，只有import命令才可以加载mjs文件，反过来，.mjs文件里面也不能使用require命令，必须使用import。
  目前这项功能还在试验阶段，需要安装Node v8.5.0或以上版本，要用--experimental-modules参数才能打开该功能：
```javascript
node --experimental-modules my-app.mjs
```
  为了与浏览器的import加载规则相同，Node的.mjs文件支持url路径：
```javascript
import './foo?query=1'//加载./foo传入参数?query=1,脚本路径带有参数?query=1,Node会按照URL规则解读，同一个脚本只要参数不同，就会被加载多次，并且保存成不同的缓存。由于这个原因，只要文件名中含有：、%、#、？等特殊字符，最好对这些字符进行转义
```
  目前Node的import命令只支持加载本地模块，不支持加载远程模块。如果模块名不含路径，那么import命令失去node_modules陌路寻找这个模块：
```javascript
import 'baz'
import 'abc/123'
```
  如果模块名包含路径，那么import命令会按照路径寻找这个名字的脚本文件：
```javascript
import 'file:///etc/config/app.json'
import './foo'
import './foo?search'
import './/bar'
import '/baz'
//如果脚本文件省略了后缀名，比如import './foo'，Node 会依次尝试四个后缀名：./foo.mjs、./foo.js、./foo.json、./foo.node。如果这些脚本文件都不存在，Node 就会去加载./foo/package.json的main字段指定的脚本。如果./foo/package.json不存在或者没有main字段，那么就会依次加载 ./foo/index.mjs、 ./foo/index.js、 ./foo/index.json、 ./foo/index.node。如果以上四个文件还是都不存在，就会抛出错误。
```
#### 3.2 内部变量
  es6模块应该是通用的，同一个模块不用修改，就可以用在浏览器环境和服务器华宁，为了达到这个目标，Node规定es6模块之中不能使用CommonJS模块的特有的一些内部变量。
  首先，就是this关键字，es6模块之中，顶层的this指向undefined，CommonJS模块的顶层this指向当前模块，这是二者的一个重大差异。
  其次，以下这些顶层变量在es6模块之中都是不存在的：
  - arguments
  - require
  - module
  - exports
  - \_\_filename
  - \_\_dirname
    如果一定要使用这些变量，有一个变通的方法，就是写一个CommonJS模块输出这些变量 ，然后再用es6模块加载这个CommonJS模块。但是这样一来，该es6模块就不能直接用于浏览器环境了，所以不推荐这样做。
```javascript
//expose.js
module.exportts={__dirname}
//use.mjs
import expose from './expose.js'
const {__dirname}=expose
//expose.js是一个CommonJS模块，输出变量__dirname，该变量在es6模块之中不存在，es6模块加载expose.js，就可以得到__dirname.
```
#### 3.3 es6模块加载CommonJS模块
  CommonJS模块的输出都定义在module.exports这个属性上面，Node的import命令加载CommonJS模块，Node会自动将module.exports属性，当做模块的默认输出，即等同于export default xxx
  一个CommonJS模块：
```javascript
//a.js
module.exports={
    foo:'hello',
    bar:'world'
}
//等同于
export default {
    foo:'hello',
    bar:'world'
}
//import命令加载上面的模块，module.exports会被视为默认输出，即import命令实际上输入的是这样一个对象{default:module.exports}
```
  所以一共有三种写法，可以拿到CommonJS模块的module.exports：
```javascript
// 写法一
import baz from './a';
// baz = {foo: 'hello', bar: 'world'};

// 写法二
import {default as baz} from './a';
// baz = {foo: 'hello', bar: 'world'};

// 写法三
import * as baz from './a';
// baz = {
//   get default() {return module.exports;},
//   get foo() {return this.default.foo}.bind(baz),
//   get bar() {return this.default.bar}.bind(baz)
// }
//这三种写法，可以通过baz.default拿到module.exports.foo属性和bar属性就是可以通过这种方法拿到了module.exports
```
  比如：
```javascript
//b.js
module.exports=null;
//es.jjs
import foo from './b'
//foo=null
import * as bar from './b'
//bar = {default:null}
//es.js采用第二种写法时，要通过bar.default这样的写法，才能拿到module.exports

//c.js
module.exports=function two(){
    return 2;
}
//es.js
import foo from './c'
foo()//2
import * as bar from './c'
bar.default()//2
bar()//报错，bar is not a function，bar本身是一个对象，不能当做函数电泳，只能通过bar.default调用
```
  CommonJS模块的输出缓存机制，在es6加载方式下依然有效：
```javascript
//foo.js
module.exports=123;
setTimeout(_ => module.exports=null)//对于加载的这个foo.js脚本，module.exports将一直是123，而不会变成null。
```
  由于es6模块是编译时确定输出接口，CommonJS模块是运行时确定输出接口，所以采用import命令加载CommonJS模块时，不允许采用下面的写法：
```javascript
//不正确
import {readFile} from 'fs'//因为fs是CommonJS格式，只有在运行时才能确定readFile接口，而import命令要求编译时就确定这个接口，解决方法就是改为整体输入
// 正确的写法一
import * as express from 'express';
const app = express.default();
// 正确的写法二
import express from 'express';
const app = express();
```
#### 3.4 CommonJS模块加载es6模块
  CommonJS模块加载es6模块，不能使用require命令，而要使用import()函数，es6模块的所有输出接口，会成为输入对象的属性：
```javascript
//es.mjs
let foo={bar:'my-default'}
export default foo;
//cjs.js
const es_namespace=await import ('./es.mjs')
/*
	es_namespace={
        get default(){....}
	}
*/
console.log(es_namespace.default)//{bar:'my-default'}
//这里的代码中，default接口变成了es_namespace.default属性
```
  还有栗子：
```javascript
// es.js
export let foo = { bar:'my-default' };
export { foo as bar };
export function f() {};
export class c {};
// cjs.js
const es_namespace = await import('./es');
/*es_namespace = {
	get foo() {return foo;}
	get bar() {return foo;}
	get f() {return f;}
	get c() {return c;}
}*/
```
### 4.循环加载
  循环加载 指的是，a脚本的执行依赖b脚本，而b脚本的执行又依赖a脚本：
```javascript
//a.js
var b=require('b')
//b.js
var a=require('a')
```
  通常，循环加载表示存在强耦合，如果处理不好，还可能导致递归加载，使得程序无法执行，因此应该避免出现。
  但是实际上，这是很难避免的，尤其是依赖关系复杂的大项目，很容易出现a依赖b，b依赖c，c又依赖a这样的情况。这意味着，模块加载机制必须考虑 循环加载 的情况。对于JavaScript语言来说，目前最常见的两种模块格式CommonJS和es6，处理 循环加载 的方法是不一样的，返回的结果也不一样。
#### 4.1 CommonJS模块的加载原理
  CommonJS的一个模块，就是一个脚本文件，require命令第一次加载该脚本，就会执行整个脚本，然后在内存生成一个对象：
```json
{
    id: '...'
    exports:{....}
    loaded:true,
    .....
}
//这段代码就是Node内部加载模块后生成的一个对象，该对象的id属性是模块名，exports属性是模块输出的各个接口，loaded属性是一个布尔值，表示该模块的脚本是否执行完毕，其它还有很多属性，这里都省略了
```
  以后需要用到这个模块的时候，就会到exports属性上面取值。即使再次执行require命令，也不会再次执行该模块，而是到缓存之中取值。也就是说，CommonJS模块无论加载多少次，都只会在第一次加载时运行一次，以后再加载就返回第一次运行的结果，除非手动清除系统缓存。
#### 4.2 CommonJS模块的循环加载
  CommonJS模块的重要特性是加载时执行，即脚本代码在require的时候，就会全部执行。一旦出现某个模块被 循环加载，就只输出已经执行的部分，还未执行的部分不会输出。
  Node文档里面，脚本文件a.js代码：
```javascript
exports.done=false;
var b=require('./b.js')
console.log('在a.js中，b.done=$j',b.done);
exports.done=true
console.log('a.js执行完毕')
//a.js脚本先输出一个done变量，然后加载另一个脚本文件b.js，注意，此时a.js代码就停在这里，等待b.js执行完毕，再往下执行
```
  脚本文件b.js的代码：
```javascript
exports.done=false;
var a=require('./a.js')
console.log('在b.js中，a.done=$j',a.done)
exports.done=true
console.log('b.js执行完毕')
//这段代码之中，b.js执行到第二行，就会去加载a.js，这时，就发生了 循环加载，系统 就会去a.js模块对应的exports属性取值，可是因为a.js还没有执行完，从exports属性只能取回已经执行的部分，而不是最后的值

//a.js已经执行的部分，只有一行
exports.done=false
//因此对于b.js来说，它从a.js只输入一个变量done，值为false。

//然后b.js接着往下执行，等到全部执行完毕，再把执行权交还给a.js，于是，a.js接着往下执行，直到执行完毕。可以写一个脚本main.js，验证这个过程：
var a=require('./a.js')
var b=require('./b.js')
console.log('在 main.js 之中, a.done=%j, b.done=%j', a.done, b.done);
//执行main.js，运行结果如下。
$ node main.js
在 b.js 之中，a.done = false
b.js 执行完毕
在 a.js 之中，b.done = true
a.js 执行完毕
在 main.js 之中, a.done=true, b.done=true
//这里验证了两件事，一是在b.js之中，a.js没有执行完毕，只是执行了第一行。而是main.js执行到第二行时，不会再次执行b.js，而是输出缓存的b.js的执行结果，即它的第四行
exports.done=true
//总之，CommonJS输入的是被输出值的拷贝，不是引用
```
  另外，由于CommonJS模块遇到循环加载时，返回的是当前已经执行的部分的值，而不是代码全部执行后的值，两者可能会有差异，所以输入变量的时候，必须非常小心：
```javascript
var a = require('a'); // 安全的写法
var foo = require('a').foo; // 危险的写法

exports.good = function (arg) {
  return a.foo('good', arg); // 使用的是 a.foo 的最新值
};

exports.bad = function (arg) {
  return foo('bad', arg); // 使用的是一个部分加载时的值
};
//如果发生循环加载，require('a').foo的值很可能后面会被改写，改用require('a')会更保险一点。
```
#### 4.3 es6模块的循环加载
  es6处理 循环加载 与CommonJS有本质的不同，es6模块是动态引用，如果使用import从一个模块加载变量（即import foo from 'foo'），那些变量不会被缓存，而是成为一个指向被加载模块的引用，需要开发者自己保证，真正取值的时候能够取到值。
  一个栗子：
```javascript
// a.mjs
import {bar} from './b';
console.log('a.mjs');
console.log(bar);
export let foo = 'foo';
// b.mjs
import {foo} from './a';
console.log('b.mjs');
console.log(foo);
export let bar = 'bar';
//a.mjs加载b.mjs，b.mjs又加载a.mjs，构成循环加载。执行a.mjs，结果如下。
$ node --experimental-modules a.mjs
b.mjs// ReferenceError: foo is not defined
```
  报错了。一行行看，es6循环加载是怎么处理的，首先，执行a.mjs以后，引擎发现它加载了b.mjs，因此会优先执行b.mjs，然后再执行a.mjs。接着，执行b.mjs的时候，已知它从a.mjs输入了foo接口，这时不会去执行a.mjs，而是认为这个接口已经存在了，继续往下执行。执行到第三行console.log(foo)的时候，才发现这个接口根本没定义，因此报错。解决这个问题的方法，就是让b.mjs运行的时候，foo已经有定义了。这可以通过将foo写成函数来解决。
```javascript
// a.mjs
import {bar} from './b';
console.log('a.mjs');
console.log(bar());
function foo() { return 'foo' }
export {foo};
// b.mjs
import {foo} from './a';
console.log('b.mjs');
console.log(foo());
function bar() { return 'bar' }
export {bar};
//这时再执行a.mjs就可以得到预期结果。
$ node --experimental-modules a.mjs
b.mjs
foo
a.mjs
bar
//这是因为函数具有提升作用，在执行import {bar} from './b'时，函数foo就已经有定义了，所以b.mjs加载的时候不会报错。这也意味着，如果把函数foo改写成函数表达式，也会报错。
// a.mjs
import {bar} from './b';
console.log('a.mjs');
console.log(bar());
const foo = () => 'foo';
export {foo};
//上面代码的第四行，改成了函数表达式，就不具有提升作用，执行就会报错。
```
  再看一下es6模块加载器SystemJS的栗子：
```javascript
// even.js
import { odd } from './odd'
export var counter = 0;
export function even(n) {
  counter++;
  return n === 0 || odd(n - 1);
}
// odd.js
import { even } from './even';
export function odd(n) {
  return n !== 0 && even(n - 1);
}
//even.js里面的函数even有一个参数n，只要不等于 0，就会减去 1，传入加载的odd()。odd.js也会做类似操作。

//运行上面这段代码，结果如下。
$ babel-node
> import * as m from './even.js';
> m.even(10);
true
> m.counter
6
> m.even(20)
true
> m.counter
17
//参数n从 10 变为 0 的过程中，even()一共会执行 6 次，所以变量counter等于 6。第二次调用even()时，参数n从 20 变为 0，even()一共会执行 11 次，加上前面的 6 次，所以变量counter等于 17。
```
  这个栗子要是改成CommonJS，就根本无法执行，会报错：
```javascript
// even.js
var odd = require('./odd');
var counter = 0;
exports.counter = counter;
exports.even = function (n) {
  counter++;
  return n == 0 || odd(n - 1);
}

// odd.js
var even = require('./even').even;
module.exports = function (n) {
  return n != 0 && even(n - 1);
}
//even.js加载odd.js，而odd.js又去加载even.js，形成“循环加载”。这时，执行引擎就会输出even.js已经执行的部分（不存在任何结果），所以在odd.js之中，变量even等于undefined，等到后面调用even(n - 1)就会报错。
$ node
> var m = require('./even');
> m.even(10)
//TypeError: even is not a function
```
### 5.es6模块的转码
#### 5.1 es6 module transpiler
  ES6 module transpiler是 square 公司开源的一个转码器，可以将 ES6 模块转为 CommonJS 模块或 AMD 模块的写法，从而在浏览器中使用。
```javascript
  //首先，安装这个转码器。
	$ npm install -g es6-module-transpiler
  //然后，使用compile-modules convert命令，将 ES6 模块文件转码。
	$ compile-modules convert file1.js file2.js
  //-o参数可以指定转码后的文件名。
	$ compile-modules convert -o out.js file1.js
```
#### 5.2 SystemJS
  另一种解决方法是使用 SystemJS。它是一个垫片库（polyfill），可以在浏览器内加载 ES6 模块、AMD 模块和 CommonJS 模块，将其转为 ES5 格式。它在后台调用的是 Google 的 Traceur 转码器。使用时，先在网页内载入system.js文件。
```html
	<script src="system.js"></script>
```
  然后，使用System.import方法加载模块文件。
```html
<script>
  System.import('./app.js');
</script>
```
  上面代码中的./app，指的是当前目录下的 app.js 文件。它可以是 ES6 模块文件，System.import会自动将其转码。需要注意的是，System.import使用异步加载，返回一个 Promise 对象，可以针对这个对象编程。下面是一个模块文件。
```javascript
// app/es6-file.js:
export class q {
  constructor() {
    this.es6 = 'hello';
  }
}
```
  然后，在网页内加载这个模块文件。
```html
<script>
System.import('app/es6-file').then(function(m) {
  console.log(new m.q().es6); // hello
});
</script>
<!--System.import方法返回的是一个 Promise 对象，所以可以用then方法指定回调函数。-->
```





















