## 十七、async函数
### 1.含义
  async函数就是Generator函数的语法糖，之前有一个依次读取两个文件的Generator函数：
```javascript
const fs = require('fs');
const readFile = function (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, function(error, data) {
      if (error) return reject(error);
      resolve(data);
    });
  });
};
const gen = function* () {
  const f1 = yield readFile('/etc/fstab');
  const f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```
  写成async函数，就是这样：
```javascript
const asyncReadFile=async function(){
    const f1=await readFile('/etc/fstab')
    const f2=await readFile('/etc/shells')
    console.log(f1.toString())
    console.log(f2.toString())
}
```
  async 函数就是将Generator函数的星号 替换成async，将 yield替换成await。async函数对Generator函数的改进，体现在四点：
  - 内置执行器
```javascript
  //Generator函数的执行必须依靠执行器，所以才有了co模块，而async函数自带执行器，也就是说,async函数的执行，与普通函数一模一样，只要一行
  asyncReadFIle()
  //这里调用了asyncReadFile函数，然后它就会自动执行，输出最后的结果，这完全不像Generator函数，需要调用next方法，或者用co模块，才能真正执行，得到最后的结果
```
  - 更好的语义
    async和await，比起星号和yield，语义要更清楚，async表示函数里有异步操作，await表示紧跟在后面的表达式需要等待结果
  - 更广的适用性
    co模块约定，yield命令后面只能是Thunk函数或Promise对象，而async函数的await命令后面，可以是Promise对象和原始类型的值（数值、字符串和布尔值， 但这时等同于同步操作）
  - 返回值是Promise
    async函数的返回值是Promise对象，这比Generator函数的返回值是Iterator对象方便多了，这样可以用then方法指定下一步的操作
  async函数 完全可以看做多个异步操作，包装成的一个Promise对象，而await命令就是内部then命令的语法糖。
### 2.基本用法
  async函数返回一个Promise对象，可以使用then方法添加回调函数，当函数执行的时候，一旦遇到await就会先返回，等到异步操作完成，再接着执行函数体后面的语句。
  举个栗子：
```javascript
async function getStockPriceByName(name){
    const symbol=await getStockSymbol(name)
    const stockPrice=await getStockPrice(symbol)
    return stockPrice
}
getStockPriceByName('goog').then(function (result){
    console.log(result)
})
//这是一个获取股票报价的函数，函数前面的async关键字，表明该函数内部有异步操作，调用该函数时，会立即返回一个Promise对象
```
  还有一个栗子，指定多少毫秒以后输出一个值：
```javascript
function timeout(ms){
    return new Promise((resolve)=>{
        setTimeout(resolve,ms)
    })
}
async function asyncPrint(value,ms){
    await timeout(ms);
    console.log(value)
}
asyncPrint('luelue',50)
```
  async 函数有多种使用形式：
```javascript
//函数声明
async function foo()
//函数表达式
const foo=async function(){}
//对象的方法
let obj={async foo(){}}
obj.foo().thne(...)
//Class的方法
class Storage{
    constructor(){
        this.cachePromise=caches.open('avatars')
    }
    async getAvatar(name){
        const cache=await this.cachePromise
        return cache.match(`/avatars/${name}.jpg`)
    }
}
const storage=new Storage();
storage.getAvatar('jake').then(....)
//箭头函数
const foo=async()=>{}
```
### 3.语法
#### 3.1 返回Promise对象
  async函数返回一个Promise对象。async函数内部return语句返回的值，会成为then方法回调函数的参数：
```javascript
async function f(){
    return 'hello world'
}
f().then(v => console.log(v))//'hello world'，函数f内部return命令返回的值，会被then方法回调函数接收到
```
  async函数内部抛出错误，会导致返回的Promise对象变为reject状态，抛出的错误对象会被catch方法回调函数接收到：
```javascript
async funcrtion f(){
    throw nnew Error('出错了')
}
f().then(
	v => console.log(v)
	e => console.log(e)
)//Error，出错了
```
#### 3.2 Promise对象的状态变化
  async函数返回的Promise对象，必须等到内部所有await命令后面的Promise对象执行完，才会发生状态改变，除非遇到return语句或者抛出错误，也就是说，只有async函数内部的异步操作执行完，才会执行then方法指定的回调函数。
  举个栗子：
```javascript
async function getTitle(url){
    let response=await fetch(url);
    let html=await response.text()
    return html.match(/<title>([\s\s]+)<\/title>/i)[i]
}
getTitle('https://suibian.url').then(console.log)// suibian
//函数getTitle内部有三个操作：抓取网页、取出文本、匹配页面标题，只有这三个操作全部完成，才会then方法里面的consol.log
```
#### 3.3 await命令
  正常情况下，await命令后面是一个Promise，如果不是，会被转成一个立即resolve的Promise对象：
```javascript
async function f(){
    return await 123
}
f().then(v => console.log(v))//123
```
  await命令后面的Promise对象如果变为reject状态，则reject的参数会被catch方法的回调函数接收到：
```javascript
async function f(){
    await Promise.reject('出错了')
}
f().then(v => console.log(v))
	.catch(e => console.log(e))//出错了，await语句前面没有return，但是reject方法的参数依然传入了catch方法的回调函数，这里如果在await前面加上return，效果是一样的
```
  只要一个await语句后面的Promise变为reject，那么整个async函数都会中断执行：
```javascript
async function f(){
    await Promise.reject('出错了')
    await Promise.resolve('hello world')//不会执行，因为第一个await语句状态变成了reject
}
```
  有时会希望即使前一个异步操作失败，也不要中断后面的异步操作，这时可以将第一个await放在try catch结构里面，这样不管这个异步操作是否成功，第二个await都会执行：
```javascript
async function f(){
    try{
        await Promise.reject('出错了')
    }catch(e){}
    return await Promise.resolve('hello world')
}
f().then(v => console.log(v))//hello world
```
  另一种方法是await后面的Promise对象再跟一个catch方法，处理前面可能出现的错误：
```javascript
async function f(){
    await Promise.reject('出错了').catch(e => console.log(e))
    return await Promise.resole('hello world')
}
f().then(v => console.log(v))// 出错了  hello world
```
#### 3.4 错误处理
  如果reject后面的异步操作出错，那么等同于async函数返回的Promise对象被reject：
```javascript
async function f(){
    await new Promise(function(resolve,reject){
        throw new Error('出错啦')
    })
}
f().then(v => console.log(v)).catch(e => console.log(e))//Error： 出错啦
//async函数f执行后，await后面的Promise对象就会抛出一个错误对象，导致catch方法的回调函数被调用，它的参数就是抛出的错误对象。
```
  防止出错的方法，也是将其放在try catch代码块之中：
```javascript
async function f(){
    try{
        await new Promise(function (resolve,reject){
            throw new Error('出错啦')
        })
    }catch(e){}
    return await('hello world')
}
```
  如果有多个await命令，可以统一放在 try catch结构中
```javascript
async function main(){
    try{
        const val1=await firstStep()
        const val2=await seconedStep(val1)
        cosnt val3=await thirdStep(val1,val2)
        console.log('最后：',val3)
    }
    catch(err){console.log(err)}
}
```
  使用try catch结构，实现多次重复尝试：
```javascript
const superagent=require('superagent')
const NUM_RETRIES=2
async function test(){
    let i;
    for(i=0;i<NUM_RETRIES;i++){
        try{
            await superagent.get('suibian.url');
            break;
        }catch(err){}
    }
    console.log(i)//2
}
test()
//如果await成功，就会使用break语句退出循环，如果失败，会被catch语句捕捉，然后进入下一轮循环
```
#### 3.5 使用 ご注意
  第一点，前面说过的，await命令后面的Promise对象，运行结果可能是rejected，所以最好把await命令放在try catch代码中:
```javascript
async function fun(){
    try{
        await somethingThatReturnsAPromise()
    }catch(err){
        console.log(err)
    }
}
//另一种写法
async function fun(){
    await somethingThatReturnsAPromise()
    .catch(function(err){
        console.log(err)
    })
}
```
  第二点，多个await命令后面的异步操作，如果不存在继发关系，最好让它们同时触发：
```javascript
let foo=await getFoo()
let bar=await getBar()
//getFoo和getBar是两个独立的操作，被写成继发关系，这样比较耗时，因为只有getFoo完成以后，才会执行getBar，完全可以让它们同时触发

//写法一
let [foo,bar]=await Promise.all([getFoo(),getBar()])
//写法二
let fooPromise=getFoo()
let barPromise=getBar()
let foo=await fooPromise;
let bar=await barPromise
//getFoo和getBar都是同时触发的，这样就会缩短程序的执行时间
```
  第三点，await命令只能用在async函数之中，如果用在普通函数，就会报错：
```javascript
async function dbFuc(db){
    let docs=[{},{},{}]
    //报错
    docs.forEach(function(doc){
        await db.post(doc)
    })
}
//因为await用在普通函数之中，所以报错了吗，但是如果将forEach方法的参数改成async函数，也有问题
function dbFuc(db){//这里不需要async
     let docs=[{},{},{}]
     //可能得到错误结果
     docs.forEach(async function(doc){
         await db.post(doc)
     })
}
//上面的代码可能不会正常工作，原因是这时三个db.post操作将是并发执行，也就是同时执行，而不是继发执行。正确的写法是采用for循环
async function dnFuc(db){
    let docs=[{},{},{}]
    for(let doc of docs){
        await db.post(doc)
    }
}
```
  如果确实希望多个请求并发执行，可以使用Promise.all方法，当三个请求都会resolved时，下面两种写法效果相同：
```javascript
async function dbFuc(db){
    let docs=[{},{},{}]
    let Promises=docs.map((doc)=> db.post(doc))
    let results=await Promise.all(promises)
    console.log(results)
}
//或者使用下面的写法
async function dbFuc(db){
    let docs=[{},{},{}]
    let promises=docs.map((doc)=>db.post(doc))
    let results=[];
    for(let promise of promises){
        results.push(await promise)
    }
    console.log(results)
}
```
  目前@std/esm模块加载器支持顶层await，即await命令可以不放在async函数里面，直接使用：
```javascript
//async函数的写法
const start=async()=>{
    const res=await fetch('xxxx.com')
    return res.text();
}
start().then(console.log)
//顶层await的写法,脚本必须使用@std/esm加载器才会生效
const res=await fetch('xxxx.com')
console.log(await res.text())
```
### 4.async函数的实现原理
  async函数的实现原理，就是将Generator函数和自动执行器，包装在一个函数里：
```javascript
async function fun(args){....}
//等同于
function fun(args){
    return spawn(function*(){....})
}
//所有的async函数都可以写成上面的第二种形式，其中的spawn函数就是自动执行器
```
  spawn函数实现：
```javascript
function spawn(genF){
    return new Promise(function(resole,reject){
        const gen=genF()
        functionstep(nextF){
            let next;
            try{
                next=nextF()
            }catch(e){
                return reject(e)
            }
            if(next.done){
                return resolve(next.value)
            }
            Promise.resolve(next.value).then(function(v){
                step(function(){return gen.next(v)})
            },function(e){
                step(function(){return gen.throw(e)})
            })
        }
        step(function(){return gen.next(undefined)})
    })
}
```
### 5.与其它异步处理方法的比较
  通过下面这个例子，看一下async函数与Promise、Generator函数的比较
  假定某个DOM元素上面，部署了一系列的动画，前一个动画结束，才能开始后一个，如果当中有一个动画出错，就不再往下执行，返回上一个成功执行的动画返回值。
  首先是Promise的写法：
```javascript
function chainAnimationsPromise(elem,animations){
    //变量ret用来保存上一个动画的返回值
    let ret=null;
    //新建一个空的Promise
    let p=Promise.resolve()
    //使用then方法，添加所有动画
    for(let anim of animations){
        p=p.then(functiion(val){
            ret=val;
            return anim(elem)
        })
    }
    //返回一个部署了错误捕捉机制的Promise
    return p.catch(function(e){
        //忽略错误，继续执行
    }).then(function(){
        return ret
    })
}
//虽然Promise的写法比回调函数的写法大大改进，但是一眼看上去，代码完全都是Promise的API，操作本身额语义反而不容易看出来
```
  然后是Generator函数的写法：
```javascript
function chainAnimationsGenerator(elem,animations){
    return spawn(function* (){
        let ret=null;
        try{
            for(let anim of animations){
                ret=yield anim(elem)
            }
        }catch(e){//忽略错误，继续执行}
        return ret;
    })
}
//这段代码使用Generator函数遍历了每个动画，语义化比Promise写法更清晰，用户定义的操作，全部都出现在spawn函数的内部，这个写法的问题在于，必须有一个任务运行期，自动执行Generator函数，上面代码spawn函数就是自动执行器，它返回一个Promise对象，而且必须保证yield语句后面的表达式，必须返回一个Promise
```
  最后是一个async函数的写法：
```javascript
async function chainAniamtionsAsync(elem,animations){
    let ret=null;
    try{
        for(let anim of animations){
            ret=await anim(elem)
        }
    }catch(e){//忽略错误，继续执行}
    return ret
}
//Async函数的实现最简洁有没有，最符合语义，几乎没有语义不相关的代码，它将Generator写法中的自动执行器，改在语言层面提供，不暴露给用户，因此代码量最少，如果使用Generator写法，自动执行器需要用户自己提供
```
### 6.实例：按顺序完成异步操作
  Promise的写法：
```javascript
function logInOrder(urls){
    //远程读取所有url
    const textPromises=urls.map(url => {
        return fetch(url).then(response => response.text())
    })
    //按次序输出
    textPromises.reduce((chain,textPromise) => {
        return chain.then(()=>{textPromise})
        .then(text => console.log(text))
    },Promise.resolve())
}
//这段代码使用fetch方法，同时远程读取一组URL，每个fetch操作都返回一个Promise对象，放入textPromises数组，然后，reduce方法依次处理每个Promise对象，然后使用then，将所有的Promise对象连接起来，因此就可以依次输出结果
```
  这种写法不太直观，可读性比较差，下面是async函数实现：
```javascript
async function logInOrder(urls){
    for (const url of urls){
        const response = await fetch(url)
        console.log(await response.text())
    }
}
//代码简化了很多，但是所有的远程操作都是继发，只有前一个URL返回结果了才会去读取下一个URL，这样做效率很差，非常浪费时间
```
  那就需要并发发出远程请求：
```javascript
async function logInOrder(urls){
    //并发读取远程URL
    const textPromises=urls.map(async url =>{
        cosnt response=await fetch(url)
        return response.text()
    })
    //按次序输出
    for (const textPromise of textPromises){
        console.log(await textPromise)
    }
}
//虽然map方法的参数是async函数，但是它是并发执行的，因为只有async函数内部是继发执行，外部不受影响，后面的for of循环内部使用了await，因此实现了按顺序输出
```
### 7.异步遍历器
  Iterator接口是一种数据遍历的协议，只要调用遍历器对象的next烦恼歌发，就会得到一个对象，表示当前遍历指针所在的那个位置的信息，next方法返回的对象的结构是{value,done},其中value表示当前的数据的值，done是一个布尔值，表示遍历是否结束。这里隐含着一个规定，next方法必须是同步的，只要调用就必须立刻返回值，也就是说，一旦执行next方法，就必须同步的得到value和done这两个属性，如果遍历指针正好指向同步操作，没毛病，但是对于异步操作，就不太合适了，目前的解决方法是，Generator函数里面的异步操作，返回一个Thunk函数或者Promise对象，即value属性是一个Thunk函数或者Promise对象，等待以后返回真正的值，而done属性则还是同步产生的。es2018引入了 异步遍历器，为异步操作提供原生的遍历器接口，即value和done这两个属性都是异步产生。
#### 7.1 异步遍历器的接口
  异步比那里器的最大语法特点，就是调用遍历器的next方法，返回的是一个Promise对象：
```javascript
asyncIterator.next().then(({value,done})=> //....)
//asyncIterator是一个异步遍历器，调用next方法以后，返回一个Promise对象，因此，可以使用then方法指定，这个Promise对象的状态变为resolve以后的回调函数，回调函数的参数，则是一个具有value和done两个属性的对象，这个跟同步遍历器是一样的
```
  一个对象的同步遍历器的接口，部署在Symbol.iterator属性上面，同样的，对象的异步遍历器接口，部署在Symbol.asyncIterator属性上面，不管是什么样的对象，只要它的Symbol.asyncIterator属性有值，就表示应该对它进行异步遍历。
  一个异步遍历器的栗子：
```javascript
const asyncIterable=createAsyncIterable(['a','b'])
const asyncIterator=asyncIterable[Symbol.asyncIterator]()
asyncIterator.next()
.then(iterResult1 => {
    console.log(iterResult1)//{value:'a',done:false}
    return asyncIterator.next()
}).then(iterResult22 => {
    console.log(iterResult2)//{value:'b',done:false}
    return asyncIterator.next()
}).then(iterResult3 => {
    console.log(iterResult3)//{value: undefined,done:true}
})
//异步遍历器其实返回了两次值，第一次调用的时候，返回一个Promise对象；等到Promise对象resolve了，再返回一个表示当前数据成员信息的对象。这就是说，异步遍历器与同步遍历器最终行为是一致的，只会先返回Promise对象，作为中介
```
  由于异步遍历器的next方法，返回的是一个Promise对象，因此可以把它放在await命令后面：
```javascript
async function f(){
    const asyncIterable=createAsyncIterable(['a','b'])
    const asyncIterator=asyncIterable[Symbol.asynncIterator]()
    console.log(await asyncIterator.next())//{value:'a',done:false}
    console.log(await asyncIterator.next())//{value:'b',done:false}
    console.log(await asyncIterator.next())//{value:undefined,done:true}
    //next方法用await处理以后，就不必使用then方法了，整个流程已经很接近同步处理了
}
```
  注意异步遍历器的next方法是可以连续调用的，不必等到上一步产生的Promise对象resolve以后再调用，这种情况下，next方法会累积起来，自动按照每一步的顺序运行下去。
```javascript
//把所有的next方法放在Promise.all方法里面
const asyncGenObj=createAsyncIterable(['a','b'])
const [{value:v1},{value:v2}]=await Promsie.all([
    asyncGenObj.next(),asyncGenObj.next()
])
console.log(v1,v2)//a b
```
  另一种用法是一次性调用所有的next方法，然后await最后一步操作：
```javascript
async function runner(){
    const writer=openFile('someFile.txt')
    writer.next('hello')
    writer.next('world')
    await writer.return()
}
runner()
```
#### 7.2 for await of
  前面说的，for of循环用于遍历同步的Iterator接口，新引入的for await of 循环则是用于遍历异步的Iterator接口：
```javascript
async function fun(){
    for await(const x of createAsyncIterable(['a','b'])){
        console.log(x)//a //b
    }
}
//createAsyncIterable()返回一个拥有异步遍历器接口的对象，for of循环自动调用这个对象的一步遍历器的next方法，会得到一个Promise对象。await用来出来这个Promise对象，一旦resolve，就把得到的值（x）传入for of的循环体
```
  for await of循环的一个用途，是部署了asyncIterable操作的异步接口，可以直接放入这个循环：
```javascript
let body =''
async function f(){
    for await (const data of req) body+=data
    const parsed=JSON.parse(body)
    console.log('got',parsed)
}
//req是一个asyncIterable对象，用来异步读取数据，可以看到，使用for await of循环的一个用途，是部署了asyncIterable操作的异步接口，可以直接放入这个循环
let body = ''
async function fun() {
    for await(const data of req) body += data
    const parsed=JSON.parse(body)
    console.log('got',parsed)
}
//req是一个asyncIterable对象，用来异步读取数据，使用for await of循环的话，代码会非常简洁
```
  如果next方法返回的Promise对象被reject，for await of就会报错，要用try catch捕捉：
```javascript
async function(){
    try{
        for await(const x of createRejectingIterable()){
            console.log(x)
        }
    }catch(e){
        console.log(e)
    }
}
```
  注意，for await of 循环也可以用于同步遍历器：
```javascript
(async function(){
    for await(const x of ['a','b']){
        console.log(x)//a //b
    }
})()
```
  Node V10支持异步遍历器，Stream就部署了这个接口，下面是读取文件的传统写法与异步遍历器写法的差异：
```javascript
//传统写法
function main(inputFilePath){
    const readStream=fs.createReadStream(inputFilePath,{encoding:'utf8',highWaterMark:1024});
    readStream.on('data',(chunk)=>{
        console.log('>>>'+chunk)
    });
    readStream.on('end',()=>{
        console.log('### DONE ###')
    })
}
//异步遍历器写法
async function main(inputFilePath){
    const readStream=fs.createReadStream(inputFilePath,{encoding:'utf8',highWaterMark:1024});
    for await (const chunk of readStream){
        console.log('>>>'+chunk)
    }
    console.log('### DONE ###')
}
```
#### 7.3 异步Generator函数
  就像Generator函数返回一个同步遍历器对象一样，异步Generator函数的作用，是返回一个异步遍历器对象。在语法上，异步Generator函数就是async函数与Generator函数的结合：
```javascript
async function* gen(){
    yield 'hello'
}
const genObj=gen()
genObj.next().then(x => console.log(x))//{value:'hello',done:false}
//gen是一个异步Generator函数，执行后返回一个异步Iterator对象，对该对象调用next方法，返回一个Promise对象
```
  异步遍历器的设计目的之一，就是Generator函数处理同步操作和异步操作时，能够使用同一套接口：
```javascript
//同步Generator函数
function* map(iterable,func){
    const iter=iterable[Symbol.iterator]()
    while(true){
        const {value,done}=iter.next()
        if(done) break
        yield func(value)
    }
}
//异步Generator函数
async function* map(iterable,func){
    cosnt iter=iterable[Symbol.asyncIterator]()
    while(true){
        const {value,done}=await iter.next()
        if(done) break;
        yield func(value)
    }
}
//map是一个Generator函数，第一个参数是可遍历对象Iterable，第二个参数是一个回调函数func。map的作用是将Iterable每一步返回的值，使用func进行处理，这里有两个版本的map，前一个处理同步遍历器，后一个处理异步遍历器，两个版本的写法基本上一样
```
  另一个异步Generator函数的例子：
```javascript
async function* readLines(path){
    let file=await fileOpen(path)
    try{
        while(!file.EOF){
            yield await file.readLine()
        }
    }finally{
        await file.close()
    }
}
//这段代码中，异步操作前面使用的await关键字表明，即await后面的操作，应该返回Promise对象，凡是使用yield关键字的地方，就是next方法停下来的地方，它后面的表达式的值（即await file.readLine()的值），会作为 next()返回对象的value属性，这一点是与同步Generator函数是一致的
```
  异步Generator函数内部，能够同时使用await和yield命令，可以理解为，await 命令用于将操作产生的值输入函数内部，yield命令用于将函数内部的值输出。上面代码定义的Generator函数的用法如下：
```javascript
(async function(){
    for await (const line of readLines(filePath)){
        console.log(line)
    }
})()
```
  异步Generator函数可以与for await of 循环结合起来使用：
```javascript
async function* prefixLines(asyncIterable){
    for await (const line of asyncIterable){
        yield '>'+line
    }
}
//异步Generator函数的返回值是一个异步Iterator，即每次调用它的next方法，会返回一个Promise对象，也就是说，跟在yield命令后面的，应该是一个Promise对象，如果像上面那个例子那样，yield命令后面是一个字符串，会被自动包装成一个Promise对象
function fetchRandom() {
  const url = 'https://www.random.org/decimal-fractions/'
    + '?num=1&dec=10&col=1&format=plain&rnd=new';
  return fetch(url);
}
async function* asyncGenerator() {
  console.log('Start');
  const result = await fetchRandom(); // (A)
  yield 'Result: ' + await result.text(); // (B)
  console.log('Done');
}
const ag = asyncGenerator();
ag.next().then(({value, done}) => {
  console.log(value);
})
```
  上面代码中，ag是asyncGenerator函数返回的异步遍历器对象，调用ag.next()以后，上面代码的执行顺序如下：
  1.ag.next()立刻返回一个Promise对象
  2.asyncGenerator函数开始执行，打印出Start
  3.await命令返回一个Promise对象，asyncGenerator函数停在这里
  4.A处变成fulfilled状态，产生的值放入result变量，asyncGenerator函数继续往下执行
  5.函数在B处的yield暂停执行 ，一旦yield命令取到值，ag.next()返回的那个Promise对象变成fullfilled状态
  6.ag.next()后面的then方法指定的回调函数开始执行，该回调函数的参数是一个对象{value,done},其中value的值是yield命令后面的那个表达式的值，done的值是false
  A和 B 两行的作用类似于下面的代码：
```javascript
return new Promise((resolve,reject)=>{
    fetchRandom().then(result => result.text())
    	.then(result => {
            resolve({
                value:'结果：'+result
                done: false
            })
    	})
})
//如果异步Generator函数抛出错误，会导致Promise对象的状态变为reject，然后抛出的错误被catch方法捕获
async function* asyncGenerator(){
    throw new Error('有毛病啊')
}
asyncGenerator().next().catch(err => console.log(err))//Error:有毛病啊
```
  普通的async函数返回的是一个Promise对象，而异步Generator函数返回的是一个异步Iterator对象，可以这样理解：async函数和异步Generator函数，是封装异步操作的两种方法，都用来达到同一种目的。区别在于，前者自带执行器，后者通过for await of 执行，或者自己编写执行器。下面是一个异步Generator函数的执行器：
```javascript
async function takeAsync(asyncIterable,count=Infinity){
    const result=[]
    const iterator=asyncIterable[Symbol.asyncIterator]()
    while(result.length<count){
        const {value,done}=await iterator.next()
        if(done) break
        result.push(value)
    }
    return result
}
//异步 Generator函数产生的异步遍历器，会通过while循环自动执行，每当await Iterator.next()完成，就会进入下一轮循环，一旦done属性变为true，就会跳出循环，异步遍历器执行结束
```
  自动执行器的一个使用实例：
```javascript
async function fun(){
    async function* gen(){
        yield 'a'
        yield 'b'
        yield 'c'
    }
    return await takeAsync(gen())
}
fun().then(function(result){
    console.log(result)//['a','b','c']
})
//异步Generator函数出现以后，JavaScript就有了四种函数形式：普通函数、async函数、Generator函数和异步Generator函数。基本上，如果是一系列按照顺序执行的异步操作（比如读取文件，然后写入新内容，再存入硬盘），可以使用async函数；如果是一系列相同数据结构的异步操作（比如一行一行读取文件），可以使用异步Generator函数
```
  异步Generator函数也可以通过next方法的参数，接受外部传入的数据：
```javascript
const writer=openFile('suibian.txt')
writer.next('hello')//立即执行
writer.next('world')//立即执行
await writer.return()//等待写入结束
//这段代码中，openFile是一个异步Generator函数，next方法的参数，向该函数内部的操作传入数据，每次next方法都是同步执行的，最后的await命令用于等待整个写入操作结束
```
  最后，同步的数据结构，也可以使用异步Generator函数：
```javascript
async function* createAsyncIterable(syncIterable){
    for(const elem of syncIterable){
        yield elem
    }
}
// 这段代码里面，本来没有异步操作，所以也就没有使用await关键字
```
#### 7.4 yield\*语句
  yield\*语句也是一个异步遍历器：
```javascript
async function* gen1(){
    yield 'a'
    yield 'b'
    return 2
}
async function* gen2(){
    //result最终会等于2
    const result=yield* gen1()//gen2这里的result变量，最后的值是2
}
```
  与同步Generator函数一样，for await of循环会展开yield\*：
```javascript
(async function(){
    for await (const x of gen2()){
        console.log(x)
    }
})
```
























