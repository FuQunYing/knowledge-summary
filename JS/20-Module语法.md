## 二十一、Module语法
### 1.概述
  历史上，JavaScript一直没有模块体系，无法将一个大程序拆分成互相依赖的小文件，再用简单的方法拼装起来。其他语言都有这项功能，比如 Ruby 的require、Python 的import，甚至就连 CSS 都有@import，但是 JavaScript 任何这方面的支持都没有，这对开发大型的、复杂的项目形成了巨大障碍。
  在 ES6 之前，社区制定了一些模块加载方案，最主要的有 CommonJS 和 AMD 两种。前者用于服务器，后者用于浏览器。ES6 在语言标准的层面上，实现了模块功能，而且实现得相当简单，完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案。ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。比如，CommonJS 模块就是对象，输入时必须查找对象属性。
```javascript
//CommonJS模块
let {stat,exists,readFile}=require('fs')
//相当于
let _fs=require('fs')
let stat=_fs.stat;
let exsits=_fs.exists;
let readfile=_fs.readfile
//这里实质是整体加载fs模块，生成一个对象(_fs)，然后再从这个对象上面读取3个方法，这种加载称为 运行时加载，因为只有运行时才能得到这个对象，导致完全咩有办法在编译时做 静态优化。
```
  es6模块不是对象，而是通过export命令显示指定输出的代码，再通过import命令输入：
```javascript
//es6模块
import (stat,exists,readFile) from 'fs'
//这里实质上是从fs模块加载3个方法，其它方法不加载，这种加载称为 编译时加载 或者静态加载，即es6可以在编译时就完成模块加载，效率要比CommonJS模块的加载方式高，当然，这也导致了没法引用es6模块本身，因为它不是对象
```
  由于es6模块是编译时加载，使得静态分析成为可能，有了它，就能进一步拓宽JavaScript的语法，比如引入宏和类型检验这些只能靠静态分析实现的功能。除了静态加载带来的各种好处，es6模块还有以下好处：
  - 不再需要UMD模块格式了，将来服务器和浏览器都会支持es6模块格式，目前，通过各种工具库，其实已经做到了这一点
  - 将来浏览器的新API就能用模块格式提供，不再必须做成全局变量或者navigator对象的属性
  - 不再需要对象作为命名空间（比如Math对象），未来这些功能可以通过模块提供
### 2.严格模式
  es6的模块自动采用严格模式，不管有咩有加 use strict
  严格模式主要有一下限制：
  - 变量不必须声明后再使用
  - 函数的参数不能有同名属性，否则报错
  - 不能使用with语句
  - 不能对只读属性赋值，否则报错
  - 不能使用前缀0表示八进制数，否则报错
  - 不能删除不可删除的属性，否则报错
  - 不能删除变量delete prop，会报错，只能删除属性delete global[prop]
  - eval不会在它的外层作用域引入变量
  - eval和arguments不能被重新赋值
  - arguments不会自动反映函数参数的变化
  - 不能使用arguments.callee
  - 不能使用arguments.caller
  - 禁止this指向全局对象
  - 不能使用fn.caller和fn.arguments获取函数调用的堆栈
  - 增加了保留字（比如protected、static和interface）
  上面这些限制，模块都必须遵守，其中需要注意this的限制，es6模块之中，顶层的this指向undefined，即不应该在顶层代码使用this
### 3.export命令
  模块功能主要由两个命令个构成：export和import。export命令用于规定模块外的接口，import命令用于输入其它模块提供的功能。
  一个模块就是一个独立的文件，该文件内部的所有变量，外部无法获取。如果希望外部能够读取模块内部的某个变量，就必须使用export关键字输出该变量，下面是一个JS文件，里面使用export命令输出变量：
```javascript
//profile.js
export var firstName='Sherlock'
export var lastName='Holmes'
export var year=1880
//在这里用export向外部输出了三个变量
```
  export的写法，除了上面这样写，还有另外一种写法：
```javascript
//profile.js
var firstName='Sherlock'
var lastName='Holmes'
var year=1880
export {firstName,lastName,year}
//在export后面，使用大括号指定所要输出的一组变量，它与前一种写法是等价的，但是应该优先考虑这种写法，这个一眼就看出来了要导出的东西
```
  export命令除了输出变量，还可以输出函数或类：
```javascript
export function multiply(x,y){//向外输出一个函数multiply
    return x*y
}
```
  通常情况下，export输出的变量就是本来的名字，但是可以使用as关键字重命名：
```javascript
function v1(){....}
function v2(){....}
export{
    v1 as streamV1,
    v2 as streamV2,
    v2 as streamLatestVersion
}
//这里用as关键字，重名了函数v1和v2的对外接口，重命名以后，v2可以用不同的名字输出两次
```
  需要特别注意的是，export命令规定的是对外的接口，必须与模块内部的变量建立一一对应关系：
```javascript
//报错
export 1//直接输出1了，这是值，不是接口
//报错
var m=1
export m//同理，这不是接口
```
  正确的应该这样写：
```javascript
//写法一
export var m=1
//写法二
var m=1
export {m}
//写法三
var n=1
export {n as m}
//这三种写法都是对的，规定了对外的接口m，其它脚本可以通过这个接口，取到值1，它们的实质是在接口名与模块内部变量之间，建立了一一对应的关系
```
  同样的，function和class的输出，也必须遵守这样的写法：
```javascript
//报错
function f(){}
export f;
//正确
export function f(){}
//正确
function f(){}
export {f}
```
  另外，export语句输出的接口，与其对应的值是动态绑定的关系，即通过该接口，可以取到没模块内部实时的值：
```javascript
export var foo='bar'
setTimeout(()=>foo'baz',500)//输出变量foo，值为bar，500毫秒之后变成baz
```
  最后，export命令可以出现在模块的任意位置，只要处于模块顶层就可以，如果处于块级作用域内，就会报错，等会儿要说的import也是这样，这是因为处于条件代码块之中，就没法做静态优化了，违背了es6模块的设计初衷：
```javascript
function foo(){
    export default 'bar'//语法错误,export不能放在函数里面
}
foo()
```
### 4.import命令
  使用export命令定义了模块的对外接口以后，其它js文件就可以通过import命令加载这个模块：
```javascript
//main.js
import {firstName,lastName,year} from './profile.js'
function setName(element){
    element.textContent=first + ' ' + lastName
}
//import命令用于加载profile文件，并从中输入变量，import命令接受一对大括号，里面指定要从其它模块导入的变量名，大括号里面的变量名，必须与被导入模块对外接口的名称相同
```
  如果想为输入的变量重新取一个名字，import命令要使用as关键字，将输入的变量重命名：
```javascript
import {lastName as surname} from './profile.js'
//import命令输入的变量都是只读的，因为它的本质是输入接口，也就是说，不允许在加载模块的脚本里面，改写接口
import {a} from './xxx.js'
a={}//报错： a is read-only，因为a只是一个只读的接口，不能去改

//但是如果a是一个对象，可以改写a的属性
import {a} from './xxx,js'
a.foo='hello'//这个是合法的，但是这种写法很难查错，所以一般情况下凡是输入的变量都当做完全只读，轻易不要改变它的属性
```
  import后面的from指定模块文件的位置，可以是相对路径，.js后缀可以省略，如果只是模块名，不带有路径，那么必须有配置文件，告诉JavaScript引擎该模块的位置：
```javascript
import {myMethod} from 'util'
//util是模块文件名，由于不带有路径，必须通过配置，告诉引擎怎么取到这个模块
```
  注意，import命令具有提升效果，会提升到整个模块的头部，首先执行：
```javascript
foo()
import {foo} from 'my_module'
//这样并不会报错，因为import的执行早于foo的调用，这种行为的本质是import命令是编译阶段执行的，在代码运行之前
```
  由于import是静态执行，所以不能使用表达式和变量，这些只有在运行时才能得到结果的语法结构：
```javascript
//报错
import {'f'+'oo'} from 'my_module'
//报错
let module='my_module'
import {foo} from module
//报错
if(x===1){
    import {foo} from 'module1'
}else{
    import {foo} from 'module2'
}
//这三种写法都用了表达式、变量和if结构，在静态分析阶段，这些语法都是没法得到值的
```
  最后，import语句会执行所加载的模块，因此可以有下面的写法：
```javascript
import 'lodash'//仅仅执行lodash模块，但是不输入任何值
```
  入股多次重复执行同一句import语句，那么只会执行 一次，而不会执行多次：
```javascript
import 'lodash'
import 'lodash'//虽然引入了两次，但是只会执行一次
```
```javascript
import {foo} from 'my_module'
import {bar} from 'my_module'
//相当于
import {foo,bar}from 'my_module'
//虽然前面foo和bar在两个语句中加载，但是它们对应的是同一个my_module实例
```
  目前阶段，通过Babel转码，CommonJS模块的require命令和es6模块的import命令，可以写在同一个模块里面，但是最好不要这样做，因为import在静态解析阶段执行，所以它是一个模块之中最早执行的，下面的代码就可能不会得到预期结果：
```javascript
require('core-js/modules/es6.symbol')
require('core-js/modules/es6.promise')
import React from 'React'
```
### 5.模块的整体加载
  除了指定的加载某个输出值，还可以使用整体加载，即用  星号 指定一个对象，所有输出值都加载在这个对象上面。
```javascript
//circle.js，输出area和circumference两个方法
export function area(radius){
    return Math.PI*radius*radius
}
export function circumference(radius){
    return 2*Math.PI*radius
}
```
```javascript
//main.js 加载上面那个模块
import {area,circumference} from './circle'
console.log('圆面积：'+area(4))
console.log('圆周长：'+circumference(14))
```
  注意，模块整体加载所在的那个对象，应该是可以静态分析的，所以不允许运行时改变，下面的写法都是不允许的：
```javascript
import * as circle from './circle'
//下面两行都是不允许的
circle.foo='hello'
circle.area=function(){}
```
### 6.export default命令
  从前面的那些例子可以看到使用import命令的时候，用户需要知道所要加载变量名或函数名，否则无法加载。为了方便使用，可以用export default命令，为模块指定默认输出：
```javascript
//export-default.js
export default function(){//默认输出一个函数
    console.log('foo')
}
```
  其它模块加载该模块时，import命令可以为该匿名函数指定任意名字：
```javascript
//import-default.js
import customName from './export-default';
customName()//'foo'
//这里import命令，可以用任意名称指向export-default.js输出的方法，这时就不需要知道原模块输出的函数名，需要注意的是，这时import命令后面，不能使用大括号
```
  export default命令用在非匿名函数前，也是可以的：
```javascript
//export-default.js
export default function foo(){
    console.log('foo')
}
//或者写成
function foo(){
    console.log('foo')
}
export default foo;
//foo函数的函数名foo，在模块外部是无效的，加载的时候，视同匿名函数加载
```
  看一下默认输出和正常输出的比较：
```javascript
//第一组
export default function crc32(){//输出
    ....
}
import crc32 from 'crc32';//输入
//第二组
export function crc32(){....}//输出
import {crc32} from 'crc32'//输入
//这两组写法，第一组是使用export default时，对应的import 语句不需要使用大括号，第二组是不使用export default时，对应的import语句需要使用大括号
```
  export default命令用于指定模块的默认输出，一个模块只能有一个默认输出，因此export default命令只能使用一次，所以，import命令后面才不用加大括号，因为只可能唯一对应export default命令。
  本质上，export default就是输出一个叫做default的变量或方法，然后系统允许我为它取任意的名字，所以下面的写法是有效的：
```javascript
//module.js
function add(x,y){
    return x*y
}
export {add as default}
//相当于   export default add

//app.js
import {default as foo} from 'modules'
//相当于  import foo from 'modules'
```
  正是因为export default命令其实只是输出一个叫做default的变量，所以它后面不能跟变量声明语句：
```javascript
//正确
export var a=1
//正确
var a=1
export default a
//错误
export default var a=1
//export default a的含义是将变量a的值赋值给变量default，所以最后一种写法会报错。

//同样的，因为export default命令的本质是将后面的值赋给default变量，所以可以直接将一个值写在export default之后
//正确
export default 42
//报错，因为没有指定对外的接口，上一句指定了对外接口为default
export 42
```
  有了export default命令，输入模块时就非常直观了，以输入ladash模块为例：
```javascript
import _ from 'lodash'
```
  如果想在一条import语句中，同时输入默认方法和其它接口，可以这样写：
```javascript
import _, {each,each as forEach} from 'lodash'
//对应的export语句长这样
export default function (obj) {....}
export function each(obj,iterator,context){....}
export {each as forEach}//这里的意思是指，暴露出forEach接口，默认指向each接口，即forEach和each指向同一个方法
```
  export default 也可以用来输出类：
```javascript
//MyClass.js
export default class {...}
//main.js
import MyClass from 'myClass'
let o=new MyClass()
```
### 7.export 与 import 的复合写法
  如果在一个模块之中，先输入后输出同一个模块，import语句可以与export语句写在一起：
```javascript
export {foo,bar} from 'my_module'
//可以理解为
import {foo,bar} from 'my_module'
export {foo,bar}
//export和import可以结合在一起，写成一行，但需要注意的是，写成一行以后，foo和bar实际上并没有被导入当前的模块，只是相对于对外转发了这两个接口，导致当前模块不能直接使用foo和bar
```
  模块的接口改名和整体输出，也可以采用这种写法：
```javascript
// 接口改名
export { foo as myFoo } from 'my_module';
// 整体输出
export * from 'my_module';

//默认接口的写法如下。
export { default } from 'foo';

//具名接口改为默认接口的写法如下。
export { es6 as default } from './someModule';

// 等同于
import { es6 } from './someModule';
export default es6;
//同样地，默认接口也可以改名为具名接口。
export { default as es6 } from './someModule';

//下面三种import语句，没有对应的复合写法。
import * as somedentifier from "someModule";
import someIdentifier from "someModule";
import someIdentifier, { namedIdentifier } from "someModule";

//为了做到形式的对称，现在有提案，提出补上这三种复合写法。
export * as someIdentifier from "someModule";
export someIdentifier from "someModule";
export someIdentifier, { namedIdentifier } from "someModule";
```
### 8.模块的继承
  模块之间也可以继承。
  假设有一个circleplus模块，继承了circle模块：
```javascript
//circleplus.js
export * from 'circle'
export var e=2.71828182846
export default function(x){
    return Math.exp(x)
}
//export * 表示再输出circle模块的所有属性和方法，注意，export* 命令会忽略circle模块的default方法，然后上面代码又输出了自定义的e变量和默认方法
```
  这时，也可以将circle的属性或方法，改名后再输出：
```javascript
//circleplus.js
export {area as circleArea} from 'circle'//这里表示，只输出circle模块的area方法，且将其改名为circleArea
```
  加载上面模块的写法如下：
```javascript
//main.js
import * as math from 'circleplus';
import exp from 'circleplus'/*/表示将circleplus模块的默认方法加载为exp方法
console.log(exp(math.e))
```
### 9.跨模块常量
  之前说const的时候说过const声明的常量只在当前代码块有效。如果想设置跨模块的常量或者说一个值要被多个模块共享，可以这样写：
```javascript
//constants.js模块
export const A=1;
export const B=3;
export const c=4
//test1.js模块
import * as constants from './constants'
console.log(constants.A)//1
console.log(constants.B)//3

//test2.js模块
import {A,B} from './constants'
console.log(A)//1
console.log(B)//3
```
  如果要使用的常量非常多，可以建一个专门的constants目录，将各种常量写在不同的文件里面，保存在该目录下：
```javascript
//constants.db.js
export const db={
    url: 'suibian.url',
    admin_username:'admin',
    admin_password:'admin password'
}
//constants/user.js
export const users=['root','admin','staff','ceo','chief','moderator']
```
  然后将这些文件输出的常量，合并在index.js里面：
```javascript
//constants/index.js
export {db} from './db'
export {user} from './users'
```
  使用的时候，直接加载index.js就可以了：
```javascript
//script/js
import {db,users} from './index'
```
### 10.import()
#### 10.1 简介
  前面说的import命令会被JavaScript引擎静态分析，先于模块内的其它语句执行，所以下面的代码会报错：
```javascript
if(x===2){
    import MyModule from './myModule'
}
//引擎处理import语句是在编译时，这时不会去分析或执行if语句，所以import语句放在if代码块之中毫无意义，因此会报句法错误，而不是执行时错误。也就是说，import和export命令只能在模块的顶层，不能在代码块之中
```
  这样的设计，固然有利于编译器题号效率，但也导致无法在运行时加载模块，在语法上，条件加载就不可能实现，如果import命令是要取代Node的require方法，这就形成了一个障碍，因为require是运行时加载模块，import命令无法取代require的动态加载功能：
```javascript
const path='./'+fileName
const myModule=require(path)//这里就是动态加载，require到底加载哪个模块，只有运行时才知道，import命令做不到这一点
```
  所以有个提案，引入import()，完成动态加载
```javascript
import(specifier)//import函数的参数specifier，指定所要加载的模块的位置。import命令能够接受什么参数，import()函数就能接受什么参数，两者区别主要是后者为动态加载。
```
  import()返回一个Promise对象，举个栗子：
```javascript
const main=document.querySelector('main')
import(`./section-modules/${someVariable}.js`)
  .then(module => {
    module.loadPageInto(main);
  })
  .catch(err => {
    main.textContent = err.message;
  });
//import()函数可以用在任何地方，不仅仅是模块，非模块的脚本也可以使用。它是运行时执行，也就是说，什么时候运行到这一句，就会加载指定的模块。另外，import()函数与所加载的模块没有静态连接关系，这点也是与import语句不相同。import()类似于 Node 的require方法，区别主要是前者是异步加载，后者是同步加载。
```
#### 10.2 适用场合
##### 10.2.1 按需加载
  import()可以在需要的时候，再加载某个模块：
```javascript
button.addEventListener('click', event => {
  import('./dialogBox.js')
  .then(dialogBox => {
    dialogBox.open();
  }).catch(error => {
    //错误处理
  })
});
//import()方法放在click事件的监听函数之中，只有用户点击了按钮，才会加载这个模块。
```
##### 10.2.2 条件加载
  import()可以放在if代码块，根据不同的情况，加载不同的模块：
```javascript
if (condition) {
  import('moduleA').then(...);
} else {
  import('moduleB').then(...);
}
//如果满足条件，就加载模块 A，否则加载模块 B。
```
##### 10.2.3 动态的模块路径
  import()允许模块路径动态生成：
```javascript
import(f()).then(....)//根据函数f的返回结果，加载不同的模块
```
#### 10.3 注意点
  import()加载模块完成以后，这个模块会作为一个对象，当做then方法的参数，因此可以使用对象结构赋值的语法，获取输出接口：
```javascript
import('./myModule.js').then(({export1, export2}) => {
  // ...·
});
//export1和export2都是myModule.js的输出接口，可以解构获得。

//如果模块有default输出接口，可以用参数直接获得。
import('./myModule.js').then(myModule => {
  console.log(myModule.default);
});

//上面的代码也可以使用具名输入的形式。
import('./myModule.js').then(({default: theDefault}) => {
  console.log(theDefault);
});

//如果想同时加载多个模块，可以采用下面的写法。
Promise.all([
  import('./module1.js'),
  import('./module2.js'),
  import('./module3.js'),
]).then(([module1, module2, module3]) => {
   ···
});

//import()也可以用在 async 函数之中。
async function main() {
  const myModule = await import('./myModule.js');
  const {export1, export2} = await import('./myModule.js');
  const [module1, module2, module3] =
    await Promise.all([
      import('./module1.js'),
      import('./module2.js'),
      import('./module3.js'),
    ]);
}
main();
```






















