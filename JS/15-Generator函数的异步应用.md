## 十六、Generator函数的异步应用
  es6之前，异步编程的方法，大概有这几种：
  - 回调函数
  - 事件监听
  - 发布/订阅
  - Promise对象
### 1.基本概念
#### 1.1 异步
  异步 ，就是一个任务不是连续完成的，可以理解成该任务被人为分成两段，先执行第一段，然后转而执行其它任务，等做好了准备，再回头执行第二段。比如，有一个任务是读取文件进行处理，任务的第一段是向操作系统发出请求，要求读取文件，然后程序执行其它任务，等到操作系统返回文件，再接着执行任务的第二段（处理文件）。这种不连续的执行，就叫做异步。相应的，连续的执行就叫做同步，由于是连续执行，不能插入其它任务，所以操作系统从硬盘读取文件的这段时间，程序只能干等着~
#### 1.2 回调函数
  JavaScript语言对异步编程的实现，就是回调函数，所谓回调函数，就是把任务的第二段单独写在一个函数里面，等到重新执行这个任务的时候，就直接调用这个函数。
  读取文件进行处理，是这个样子的：
```javascript
fs.readFile('/etc/passwd', 'utf-8', function (err, data) {
  if (err) throw err;
  console.log(data);
});
//readFile函数的第三个参数，就是回调函数，也就是任务的第二段，等到操作系统返回了/etc.passwd这个文件以后，回调函数才会执行
```
  那问题来了，Node约定，回调函数的第一个参数，必须是错误对象err是为啥，原因是执行分成两段，第一段执行完以后，任务所在的上下文环境就已经结束了，在这以后抛出的错误，原来的上下文环境已经无法捕捉，只能当做参数，传入第二段。
#### 1.3 Promise
  回调函数本身并没有问题，它的问题出现在多个回调函数嵌套，假定读取A文件之后，再读取B文件，代码长这样：
```javascript
fs.readFile(fileA,'utf-8',function(err,data){
    fs.readFile(fileB,'utf-8',function(err,data){
        ....
    })
})
//那如果依次读取两个以上的文件，就会出现多重嵌套。代码不是纵向发展，而是横向发展，很快就会乱成一团，无法管理，因为多个异步操作形成了强耦合，只要有一个操作需要修改，它的上层回调函数和下层回调函数，可能都要跟着修改，这种情况就是 callback hell
```
  Promise对象就是为了解决这个问题提出的，它不是新的语法功能，而是一种新的写法，允许将回调函数的嵌套，改成链式调用，采用Promise，连续读取多个文件，写法长这样：
```javascript
var readFile=require('fs-readFile-promise')
readFile(fileA).then(function(data){
    console.log(data.toString())
}).then(function(){
    return readFile(fileB)
}).then(function(data){
    console.log(data.toString())
}).catch(function(err){
    console.log(err)
})
//这段代码，使用fs-readfile-promise模块，它的作用就是返回一个Promise版本的readFile函数。Promise提供then方法加载回调函数，catch方法捕捉执行过程中抛出的错误
```
  其实Promise的写法只是回调函数的改进，使用then方法以后，异步任务的两段执行 看的更清楚了，除此之外，没啥新东西，但是一堆的then看着也不舒服。
### 2.Generator函数
#### 2.1 协程
  传统的编程语言是有异步编程的解决方案的，其中有一种叫做 协程 ，意思是多个线程互相协作，完成异步任务。协程有点像函数，又有点像线程，它的运行流程大致如下：
  - 第一步，协程A开始执行
  - 第二步，协程A执行到一半，进入暂停，执行权转移到协程B
  - 第三步，一段时间后，协程B交还执行权
  - 第四步，协程A恢复执行
    这个流程的协程A，就是异步任务，因为它分成两段或多段执行。
    举例来说，读取文件的协程写法长这样：
```javascript
function* asyncJob() {
  // 其它代码
  var f = yield readFile(fileA);
  //其它代码
}
//这段代码 的函数asyncJob是一个协程，其中的yield命令，表示执行到此处，执行权将交给其它协程，也就是说yield命令是异步两个阶段的分界线
```
  协程遇到yield命令就暂停，等到执行权返回，再从暂停的地方继续往后执行，它的最大优点，就是代码的写法非常像同步操作，去掉yield命令看，差不多一模一样。
#### 2.2 协程的Generator函数实现
  Generator函数是协程在es6的实现，最大的特点就是可以交出函数的执行权就是暂停执行。
  整个Generator函数就是一个封装的异步任务，或者说是异步任务的容器 ，异步操作需要暂停的地方，都用yield语句注明，Generator函数的执行方法如下：
```javascript
function* gen(x){
    var y=yield x+2
    return y
}
var g=gen(1);
g.next()//{value:3,done:false}
g.next()//{value:undefined,done:true}
//这段代码中，调用 Generator 函数，会返回一个内部指针（即遍历器）g。这是 Generator 函数不同于普通函数的另一个地方，即执行它不会返回结果，返回的是指针对象。调用指针g的next方法，会移动内部指针（即执行异步任务的第一段），指向第一个遇到的yield语句，上例是执行到x + 2为止。换言之，next方法的作用是分阶段执行Generator函数。每次调用next方法，会返回一个对象，表示当前阶段的信息（value属性和done属性）。value属性是yield语句后面表达式的值，表示当前阶段的值；done属性是一个布尔值，表示 Generator 函数是否执行完毕，即是否还有下一个阶段。
```
#### 2.3 Generator函数的数据交换和错误处理
  Generator函数可以暂停执行和恢复执行，这是它能封装异步任务的根本原因。除此之外，他还有两个特性，使它可以作为异步编程的完整解决方案：函数体内外的数据交换和错误处理机制。next返回值的value属性，是Generator函数向外输出数据；next方法还可以接受参数，想Generator函数体内输入数据：
```javascript
function* gen(x){
  var y = yield x + 2;
  return y;
}
var g = gen(1);
g.next()// { value: 3, done: false }
g.next(2)// { value: 2, done: true }
//这段代码中，第一个next的方法的value属性，返回表达式x+2的值3，第二个next方法带有参数2，这个参数可以传入Generator函数，作为上个阶段异步任务的返回结果，被函数体内的变量y接收，因此，这一步的value属性，返回的就是2--变量y的值
```
  Generator函数内部还可以部署错误处理代码，捕获函数体外抛出的错误：
```javascript
function* gen(x){
    try{
        var y=yield x+2
    }catch(e){
        console.log(e)
    }
    return y;
}
var g=gen(1)
g.next()
g.throw('出错了')//出错了，Generator函数体外，使用指针对象throw方法抛出的错误，可以被函数体内的try catch代码块捕获。这意味着，出错的代码与处理错误的代码，实现了时间和空间上的分离，这对于异步编程无疑是很重要的
```
#### 2.4 异步任务的封装
  使用Generator函数，执行一个真实的异步任务：
```javascript
var fetch=require('node-fetch')
function* gen(){
    var uri='suibian.url'
    var result=yield fetch(url)
    console.log(result.bio)
}
//这段代码中，Generator函数封装了异步操作，该操作先读取一个远程接口，然后从JSON格式的数据解析信息，就像前面说过的，这段代码非常像同步操作，除了加上yield命令

//执行这段代码的方法如下：
var g=gen()
var result=g.next()
result.value.then(function(data){
    return data.json()
}).then(function(data){
    g.next()
})
//首先执行Generator函数，获取遍历器对象，然后使用next方法，执行异步任务的第一阶段，由于Fetch模块的是一个Promise对象，因此要用then方法调用下一个next方法
```
### 3.Thunk 函数
  Thunk函数是自动执行Generator函数 的一种方法
#### 3.1 参数的求值策略
  编程语言起初关注焦点在于 求值策略，即函数的参数到底应该何时求值：
```javascript
var x=1;
function fun(m){
    return m*2
}
fun(x+5)
//在这里，先定义了函数fun，然后向它传入表达式x+5，那么问题来了，这个表达式应该何时求值
```
  一种意见是传值调用，就是在进入函数体之前，就计算x+5的值，再将这个值传入函数f,相当于直接传6进去；还有就是 传名调用，就是直接将x+5传入进去，只在调用的时候求值。传值调用比较简单，但是对参数求值的时候，实际上还没用到这个参数，有可能造成性能损失，比如：
```javascript
function f(a, b){
  return b;
}
f(3 * x * x - 2 * x - 1, x);//第一个参数是一个复杂的表达式，但是函数体内根本没用到，对于这个参数值，实际上是不必要的
```
#### 3.2 Thunk函数的含义
  编译器的 传名调用 实现，往往是将参数放到一个临时函数之中，再将这个临时函数传入函数体，这个临时函数就叫做Thunk函数：
```javascript
function f(m){
    return m*2
}
f(x+5)
//相当于
var thunk=function(){
    return x+5
}
function f(thunk){
    return thunk()*2
}
//函数f的参数x+—5被一个函数替换了，凡是用到原参数的地方，对Thunk函数求值即可
```
  这就是Thunk函数的定义，它是 传名调用的一种实现策略，用来替换某个表达式
#### 3.3 JavaScript语言的Thunk函数
  JavaScript语言是传值调用，它的Thunk函数含义有所不同，在JavaScript语言中，Thunk函数替换的不是表达式，而是多参数函数，将其替换成一个只接受回调函数作为参数的单参数函数：
```javascript
//正常版本的readFile（多参数）
fs.readFile(fileName,callback)
//Thunk版本的readFile（单参数）
var Thunk=function(fileName){
    return function(callback){
        return fs.readFile(fileName,callback)
    }
}
var readFileThunk=Thunk(fileName)
readFileThunk(callback)
//fs模块的readFile方法是一个多参数函数，两个参数分别为文件名和回调函数，经过转换器处理，它变成了一个单参数函数，只接受回调函数作为参数，这个单参数版本，就叫做Thunk函数
```
  任何函数，只要参数有回调函数，就能写成Thunk函数的形式，下面是一个Thunk函数转换器：
```javascript
//es5版本
var Thunk=function(fn){
    return function(){
        var args=Array.prototype.slice.call(arguments)
        return function(callback){
            args.push(callback)
            return fn.apply(this,args)
        }
    }
}
//es6版本
const Thunk=function(fn){
    return function(...args){
        return function(callback){
            return fn.call(this,...args,callback)
        }
    }
}
//使用上面的转换器，生成fs.readFile的Thunk函数
var readFileThunk=Thunk(fs.readFile)
readFile(fileA)(callback)
```
  一个完整的栗子：
```javascript
function f(a,cb){
    cb(a)
}
const ft=Thunk(f)
ft(1)(console.log)//1
```
#### 3.4 Thunkify模块
  生产环境的转换器，建议使用Thunkify模块。
  首先是安装：npm i thunkify
  使用方式如下：
```javascript
var thunkify=require('thunkify')
var fs=require('fs')
var read=thunkify(fs.readFile)
read('package.json')(function(err,str){....})
```
  Thunkify的源码与上一节那个简单的转换器非常像：
```javascript
function thunkify(fn){
    return function(){
        var args=new Array(arguments.length)
        var ctx=this;
        for (var i=0;i<arr.length;i++){
            args[i]=arguments[i]
        }
        return function(done){
            var called;
            args.push(function(){
                if(called) return;
                called=true;
                done.apply(null,arguments)
            })
            try{
                fn.apply(ctx,args)
            }catch(err){
                done(err)
            }
        }
    }
}
```
  它的源码主要多了一个检查机制，变量called确保回调函数只运行一次，这样的设计与下面的Generator函数相关，看个栗子：
```javascript
function f(a,b,callback){
    var sum=a+b
    callback(sum)
    callback(num)
}
var ft=thunkify(f)
var print=console.log.bind(console)
ft(1,2)(print)//3,由于thunkify只允许回调函数执行一次，所以只输出一行结果
```
#### 3.5 Generator函数的流程管理
  Thunk函数可以用于Generator函数的自动流程管理。
  Generator函数可以自动执行：
```javascript
function* gen(){...}
var g=gen()
var res=g.next()
while(!res.reault){
    console.log(res.result)
    res=g.next()
}
```
  上面的代码Generator函数gen会自动执行完所有步骤，但是这不适合异步操作，如果必须保证前一步执行完才能执行后一步，上面的自动执行就不可行，这时，Thunk函数就可以用了，以读取文件为例，下面的Generator函数封装了两个异步操作：
```javascript
var fs=require('fs')
var thunkify=require('thunkify')
var readFileThunk=thunkify(fs.readFile)
var gen=function* (){
    var r1=yield readFileThunk('/etc/fatab')
    console.log(r1.toString())
    var r2=yield readFileThunk('/etc/shells')
    console.log(r2.toString())
}
//这段代码中，yield命令用于将程序的执行权移除Generator函数，那么就需要一种方法，将执行权再交给Generator函数
```
  这种方法就是Thunk函数，因为它可以在回调函数里将执行权交给Generator函数，先看一下如何手动执行上面这个Generator函数：
```javascript
var g=gen()
var r1=g.next()
r1.value(function(err,data){
    if(err) throw err;
    var r2=g.next(data)
    r2.value(function(err,data){
        if(err) throw err
        g.next(data)
    })
})
//变量g是Generator函数的内部指针，表示目前执行到哪一步，next方法负责将指针移动到下一步，并返回该步的信息（value属性和done属性）。
```
  Generator函数的执行过程，其实是将偶同一个回调函数，反复传入next方法的value属性。那就可以用递归来自动完成这个过程
#### 3.6 Thunk函数的自动流程
  Thunk函数最大的作用就是在于可以自动执行Generator函数，一个基于Thunk函数的Generator执行器：
```javascript
function run(fn) {
    var gen=fn();
    function next(err,data){
        var result=gen.next(data);
        if (result.done) return
        result.value(next)
    }
    next()
}
function* g(){.....}
run(g)
//run函数，就是一个Generator函数的自动执行器，内部的next函数就是Thunk的回调函数，next函数先将指针移到Generator函数的下一步（gen.next方法），然后判断Generator函数是否结束（result.done属性），如果没结束，就将next函数再传入Thunk函数（result.value属性），否则就直接退出

//有了这个执行器，执行Generator函数就方便多了，不管内部有多少个异步操作，直接把Generator函数传入run函数就行，前提是每个异步操作，都要是Thunk函数，也就是说跟在yield命令后面的必须是Thunk函数：
var g=function* (){
    var f1=yield readFileThunk('fileA')
    var f2=yield readFileThunk('fileB')
    ....
    var fn=yield readFileThunk('fileN')
}
run(g)
//函数g封装了n个异步的读取文件操作，只要执行run函数，这些操作就会自动完成，这样一来，异步操作不仅可以写的像同步操作，而且一行代码就可以执行
```
  Thunk函数并不是Generator函数自动执行的唯一方案，因为自动执行的关键是必须有一种机制，自动控制Generator函数的流程，接收和交还程序的执行权，回调函数可以做到这一点，Promise对象也可以做到这一点、
### 4.co模块
#### 4.1 基本用法
  co模块用于Generator函数的自动执行，下面是一个Generator函数，用于依次读取两个文件：
```javascript
var gen=function* (){
    var f1=yield readFile('/etc/fstab')
    var f2=yield readFile('/etc/shells')
    console.log(f1.toString())
    console.log(f2.toString())
}
//有co模块，可以不用再编写Generator函数的执行器
var co=require('co')
co(gen)//Generator函数只要传入co函数，就会自动执行
//co函数返回一个Promise对象，因此可以用then方法添加回调函数：
co(gen).then(function(){
    console.log('Generator 函数执行完成')//等到Generator函数执行结束，就会输出一行提示
})
```
#### 4.2 co模块的原理
  Generator就是一个异步操作的容器，它的自动执行需要一种机制，当异步操作有了结果，能够自动交回执行权。
  两种方法可以做到这一点：
  - 回调函数，将异步操作包装成Thunk函数，在回调函数里面交回执行权
  - Promise对象，将异步操作包装成Promise对象，用then方法交回执行权
  co模块其实就是将两种自动执行器，包装成一个模块，使用co的前提条件是，Generator函数的yield命令后面，只能是Thunk函数或Promise对象，如果数组或对象的成员，全部都是Promise对象，也可以使用co
#### 4.3 基于Promise对象的自动执行
  沿用上面的例子，首先把fs模块的readFile方法包装成一个Promise对象：
```javascript
var fs=require('fs')
var readFile=function(fileName){
    return new Promise(function(resolve,reject){
        fs.readFile(fileName,function(error,data){
            if(error) return reject(error)
            resolve(data)
        })
    })
}
var gen=function*(){
    var f1=yield readFile('/etc/fstab')
    var f2=yield readFile('/etc/shells')
    console.log(f1.toString())
    console.log(f2.toString())
}
//然后手动执行上面的Generator函数
var g=gen()
g.next().value.then(function(data){
    g.next(data).value.then(function(data){
        g.next(data)
    })
})
```
  手动执行其实就是用then方法，层层添加回调函数，基于此，可以写一个自动执行器：
```javascript
function run(gen){
    var g=gen()
    function next(data){
        var result = g.next(data)
        if(result.done) return result.value
        result.value.then(function(data){
            next(data)
        })
    }
    next()
}
run(gen)//只要Generator函数还没执行到最后一步，next函数就调用自身，以此实现自动执行
```
#### 4.4 co模块的源码
  co就是上面那个自动执行器的扩展，源码有几十行，简单毛线。
  首先，co函数接受Generator函数作为参数，返回一个Promise对象：
```javascript
function co(gen){
    var ctx=this;
    return new Promise(function(resolve,reject){
        if (typeof gen === 'function') gen = gen.call(ctx)
        if(!gen || typeof gen.next !== 'function') return resolve(gen)
    })
}
```
  接着，co将Generator函数的内部指针对象的next方法，包装成onFulfilled函数，这主要是为了能够捕捉抛出的错误：
```javascript
function co(gen){
    var ctx=this;
    return new Promise(function(resolve,reject){
        if (typeof gen === 'function') gen=gen.call(ctx)
        if(!gen || typeof gen.next !=='function') return resolve(gen)
        onFulfilled()
        function onFulfilled(res){
            var ret;
            try{
                ret=gen.next(res)
            }catch(e){
                return reject(e)
            }
            next(ret)
        }
    })
}
```
  最后就是next函数，它会反复调用自身：
```javascript
function next(ret){
    if(ret.done) return resolve(ret.value)
    var value=toPromise.call(ctx,ret.value)
    if(value && isPromise(value)) return value.then(onFulfilled,onRejected)
    return onRejected(
      new TypeError('You may only yield a function, promise, generator, array, or object, but the following object was passed: "'+ String(ret.value)+ '"')
    )
}
```
  上面代码中，next函数的内部代码，一共只有四行命令，第一行检查当前是否为Generator函数的最后一步，如果是就返回；第二行确保每一步的返回值，都是Promise对象；第三行使用then方法，为返回值加上回调函数，然后通过onFulfilled函数再次调用next函数；第四行，在参数不符合要求的情况下（参数非Thunk函数和Promise对象），将Promise对象的状态改为rejected，从而终止运行。
#### 4.5 处理并发的异步操作
  co支持并发的异步操作，即允许某些操作同时进行，等到它们全部完成，才进行下一步。这时，要把并发的操作都放在数组或对象里面，跟在yield语句后面
```javascript
//数组的写法:
co(function* (){
    var res=yield[
        Promise.resolve(1),
        Promise.resolve(2)
    ]
    console.log(res)
}).cactch(onerror)
//对象的写法
co(function* (){
    var res=yield{
        1:Promise.resolve(1),
        2:Promise.resolve(2)
    }
    console.log(res)
}).catch(onerror)
```
  另一个栗子：
```javascript
co(function* (){
    var values=[n1,n2,n3]
    yield values.map(suibianAsync)
})
function* suibianAsync(x){
    //....
    return y
}
//这里允许并发三个suibianAsync异步操作，等到它们全部完成，才会进行下一步
```
#### 4.6 实例：Stream
  Node提供Stream面膜是读写数据，特点是一次只处理数据的一部分，数据分成一块一块依次处理，就好像 数据流 一样，这对于处理大规模数据非常有利，Stream模式使用EventEmitterAPI，会释放三个事件：
  - data事件：下一块数据块已经准备好了
  - end事件：整个  数据流  处理  完了
  - error事件：发生错误
  使用Promise.race()函数，可以判断这三个事件之中哪个最先发生，只有当data事件最先发生时，才进入下一个数据块的处理，从而，可以通过一个while循环，完成所有的数据读取：
```javascript
const co=require('co')
const fs=require('fs')
const stream=fs.createReadStream('./les_miserables.txt')
let valjeanCount=0
co(function*(){
    while(true){
        const res=yield Promise.race([
            new Promsie(resolve => stream.once('data',resolve))
            new Promise(resolve => stream.once('end',resolve))
            new Promsie((resolve,reject)=>stream.once('error',reject))
        ])
        if(!res) break;
        stream.removeAllListeners('data')
        stream.removeAllListeners('end')
        stream.removeAllListeners('error')
        valjeanCount += (res.toString().match(/valjean/ig) || []).length
    }
    console.log('count:',valjeanCount)//count:1120
})
 //这里采用stream模式读取 悲惨世界 的文本文件，对于每个数据都使用stream.once方法，在data、end、error三个事件上添加一次性回调函数，变量res只有在data事件发生时才有值，然后累加每个数据块之中valjean这个词出现的次数
```




















