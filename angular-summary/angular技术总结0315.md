# Observables 和 RxJS
## 一、Observables
  观察对象支持在应用程序中的发布者和订阅者之间传递消息，与其它技术相比，Observable提供的优势在于事件处理、异步编程和处理多个值。可观察对象是声明式的，也就是说，我定义一个用于发布值的函数，但是直到用户订阅它才会执行。订阅的用户接收通知直到函数完成，或者用户取消订阅。
  根据上下文，observable可以传递任何类型文字，消息或事件的多个值。无论这些值是同步传递还是异步传递，用于接收值的API都是相同的。由于setup和teardown逻辑都是由observable处理的，因此我的应用程序代码只需要担心订阅消费值，并且在完成时取消订阅。无论流是键击，HTTP响应还是间隔定时器，用于侦听值并停止侦听的接口都是相同的。
### 1.基本用法和项目条款
  作为发布者，我创建了一个Observable定义订阅者函数的实例。这是用户调用该subscribe()方法时执行的功能。订阅者函数定义了如何获取或生成要发布的值或消息。
  为了执行我创建的observable并开始接收通知，需要调用它的subscribe()方法，传递一个观察者。这是一个JavaScript对象，它为接收到的通知定义处理程序。该subscribe()调用返回一个Subscription对象，该对象具有一个unsubscribe()您调用的用于停止接收通知的方法。
  下面来个demo，通过使用observable来提供地理位置更新：
```typescript
// 当用户订阅的时候创建一个监听地理位置更新的observable
const locations = new Observable((observer) => {
  // 用户订阅以后获得一个错误回调
  const {next, error} = observer;
  let watchId;
  // 精简的地理定位，API检查提供发布的值
  if ('geolocation' in navigator) {
    watchId = navigator.geolocation.watchPosition(next, error);
  } else {
    error('Geolocation not available');
  }
  // 当用户取消订阅的时候，清理掉原来的数据准备下一次的订阅
  return {unsubscribe() { navigator.geolocation.clearWatch(watchId); }};
});
// 回调subscribe()开始监听更新
const locationsSubscription = locations.subscribe({
  next(position) { console.log('当前位置: ', position); },
  error(msg) { console.log('定位错误: ', msg); }
});

// 10s以后停止监听定位
setTimeout(() => { locationsSubscription.unsubscribe(); }, 10000);
```
### 2.定义观察员
  接收可观察通知的处理程序实现Observer接口。它是一个定义回调方法来处理observable可以发送的三种类型的通知的对象：
  通知类型 | 描述
  -- | --
  next | 必须 ， 每个交付价值的处理程序。执行开始后调用零次或多次。
  error | 	可选的。处理错误通知的处理程序。错误会暂停可观察实例的执行。
  complete | 可选的。执行完成通知的处理程序。延迟值可以在执行完成后继续传递到下一个处理程序。
  观察者对象可以定义这些处理程序的任意组合。如果我没有为通知类型提供处理程序，那么观察者将忽略该类型的通知。
### 3.订阅
  Observable只有当某人订阅它时，一个实例才会开始发布值。我通过调用subscribe()实例的方法来订阅，传递观察者对象以接收通知。
```txt
  为了展示订阅的工作方式，需要创建一个新的可观察对象。有一个构造函数用于创建新的实例，但为了说明，我们可以在Observable类上使用一些静态方法来创建常用类型的简单可观察性：
  Observable.of(...items)返回一个Observable同步传递提供的值作为参数的实例。
  Observable.from(iterable)- 将其论点转化为一个Observable实例。此方法通常用于将数组转换为可观察对象。
```
  下面是创建和订阅简单观察者的示例，其中有一个将接收到的消息记录到控制台的观察者：
```typescript
// 创建一个简单发出三个值的observable
const myObservable = Observable.of(1,2,3);
//创建observer对象
const myObserver ={
	next: x => console.log('Observer 拿到值: ' + x),
    error: err => console.error('Observer 有个错误: ' + err),
    complete: () => console.log('Observer 结束'),
}
//用观察者对象执行
myObservable.subscribe(myObserver);
/*
最后的输出长这样：
Observer 拿到值：1
Observer 拿到值：2
Observer 拿到值：3
Observer 结束
*/
```
  或者，该subscribe()方法可以接受线回调函数定义，用于next，error和complete处理程序。例如，以下subscribe()调用与指定预定义观察者的调用相同：
```typescript
const myObserver ={
	x => console.log('Observer 拿到值: ' + x),
    err => console.error('Observer 有个错误: ' + err),
    () => console.log('Observer 结束'),
}
```
  无论哪种情况，next都需要一个处理程序。该error和complete处理程序是可选的。请注意next()，根据上下文，函数可以接收消息字符串或事件对象，数值或结构体。作为一个通用术语，我们将由观察者发布的数据称为流。任何类型的值都可以用可观察值来表示，并将值作为流发布。
### 3.创建Observables
  使用Observable构造函数创建任何类型的可观察流。构造函数将observable的subscribe()方法执行时的用户函数作为参数。订阅者函数接收一个Observer对象，并可以将值发布给观察者的next()方法。比如，要创建一个与Observable.of(1, 2, 3)上面相同的可观察对象，可以这样做：
```typescript
//当subscribe()被调用的时候运行该函数
function sequenceSubscribe(observer){
    //同步输出1,2,3，然后结束
    observer.next(1);
    observer.next(2);
    observer.next(3);
    observer.complete();
    //取消订阅的函数不需要了，因为是同步的，一下子就全都执行了
    return {unsubscribe() {}};
    //创建一个将提供上述顺序的新Observable
    const sequence = new Observable(sequenceSubscriber);
    //执行Observable并打印每个通知的结果
    sequence.subscribe({
  		next(num) { console.log(num); },
  		complete() { console.log('sequence 结束'); }
	});
	/*打印出来这样
	1，
	2，
	3，
	sequence 结束
	*/
}
```
  为了进一步说明这个例子，可以创建一个发布事件的可观察事件。在这个例子中，用户功能是内联定义的。
```typescript
function fromEvent(target, eventName) {
  return new Observable((observer) => {
    const handler = (e) => observer.next(e);
    // 为target添加事件处理
    target.addEventListener(eventName, handler);
    return () => {
      // 从target中分离事件处理程序
      target.removeEventListener(eventName, handler);
    };
  });
}
```
  现在就可以使用这个函数来创建一个发布keydown事件的observable：
```typescript
const ESC_KEY = 32;
const nameInput = document.getElementById('name') as HTMLInputElement;
const subscription = fromEvent(nameInput, 'keydown')
  .subscribe((e: KeyboardEvent) => {
    if (e.keyCode === ESC_KEY) {
      nameInput.value = '';
    }
  });
```
### 4.Multicasting(多播)
  一个典型的observable为每个订阅的观察者创建一个新的独立执行。当一个观察者订阅时，可观察的电线连接一个事件处理程序并将值传递给该观察者。当第二个观察者订阅时，观察者然后连接一个新的事件处理程序，并在单独的执行中向第二个观察者传递值。有时候，我不希望每个订阅者都开始独立执行，而是希望每个订阅都获得相同的值 - 即使值已经开始发布。可能出现类似于文档对象点击的情况。
  Multicasting是在一次执行中向多个用户列表广播的做法。使用Multicasting可观察性，就不用在文档上注册多个侦听器，而是重新使用第一个侦听器并将值发送给每个订阅者。当创建一个observable时，就应该确定我希望如何使用observable以及你是否想多点传送它的值。
  看一个从1到3的例子，每个数字发射后有一秒的延迟：
```typescript
function sequenceSubscriber(observer) {
  const seq = [1, 2, 3];
  let timeoutId;
  // 运行一组数字，每秒发出一个值，直到到达数组的末尾
  function doSequence(arr, idx) {
    timeoutId = setTimeout(() => {
      observer.next(arr[idx]);
      if (idx === arr.length - 1) {
        observer.complete();
      } else {
        doSequence(arr, idx++);
      }
    }, 1000);
  }
  doSequence(seq, 0);
  // 取消订阅应清除定时器
  return {unsubscribe() {
    clearTimeout(timeoutId);
  }};
}

// 创建一个能提供上面顺序的新的Observable
const sequence = new Observable(sequenceSubscriber);
sequence.subscribe({
  next(num) { console.log(num); },
  complete() { console.log('sequence 结束'); }
});

/*输出
(1s 的时候): 1
(2s 的时候): 2
(3s 的时候): 3
(3s 的时候): sequence 结束
*/
```
  注意，如果我订阅了两次，就会有两个单独的流，每个流每秒都会传一个值，长这样：
```typescript
// 订阅开始，1s后发出值
sequence.subscribe({
  next(num) { console.log('1st subscribe: ' + num); },
  complete() { console.log('1st sequence finished.'); }
});

// 1/2s后，再次订阅
setTimeout(() => {
  sequence.subscribe({
    next(num) { console.log('2nd subscribe: ' + num); },
    complete() { console.log('2nd sequence finished.'); }
  });
}, 500);

/*输出
(at 1 second): 1st subscribe: 1
(at 1.5 seconds): 2nd subscribe: 1
(at 2 seconds): 1st subscribe: 2
(at 2.5 seconds): 2nd subscribe: 2
(at 3 seconds): 1st subscribe: 3
(at 3 seconds): 1st sequence finished
(at 3.5 seconds): 2nd subscribe: 3
(at 3.5 seconds): 2nd sequence finished
*/
```
  将观察值更改为Multicasting可能如下所示：
```typescript
//创建一个组播用户
function multicastSequenceSubcriber(){
    const seq=[1,2,3];
    //跟踪每个观察者，用于每个有效的订阅
    const observer = [];
    // 仍然只是一个timeoutId，因为只会生成一组值，并且每个订阅者都是组播的
    let timeoutId
    //返回一个订阅者函数，当subscribe()函数被调用的时候调用
    return (obsrever) => {
        obsersers.push(observer);
        //当这是第一次订阅是，开始序列
        if(observers.length === 1){
            timeoutId = doSequence({
                next(val){
                    //遍历观察者并通知所有订阅
                    observers.forEach(obs => obs.next(val))；
                },
                complete(){
                    //通知所有的complete回调
                    observers.forEach(obs => obs.complete());
                }
            },seq,0)
        }
        return {
            unsubscribe(){
            //从观察员数组中清除，不再通知
                observers.splice(observers.indexOf(observer), 1);
                //没有监听就清除
                if(observers.length === 0){
                    clearTimeout(timeoutId);
                }
            }
        }；
    }；
}
//运行一组数字，每秒发出一个值，直到达到数组的末尾。
function doSequence(observer, arr, idx) {
  return setTimeout(() => {
    observer.next(arr[idx]);
    if (idx === arr.length - 1) {
      observer.complete();
    } else {
      doSequence(observer, arr, idx++);
    }
  }, 1000);
}
//创建一个将提供上述顺序的新Observable
const multicastSequence = new Observable(multicastSequenceSubscriber);
//订阅开始，1s后开始发送值
multicastSequence.subscribe({
  next(num) { console.log('1st subscribe: ' + num); },
  complete() { console.log('1st sequence finished.'); }
});
// 1.5s后，再次订阅
setTimeout(() => {
  multicastSequence.subscribe({
    next(num) { console.log('2nd subscribe: ' + num); },
    complete() { console.log('2nd sequence finished.'); }
  });
}, 1500);
/*输出：
(at 1 second): 1st subscribe: 1
(at 2 seconds): 1st subscribe: 2
(at 2 seconds): 2nd subscribe: 2
(at 3 seconds): 1st subscribe: 3
(at 3 seconds): 1st sequence finished
(at 3 seconds): 2nd subscribe: 3
(at 3 seconds): 2nd sequence finished
*/
```
### 6.错误处理
  因为observables异步生成值，所以try / catch不会有效捕获错误。相反，如果我通过error在观察者上指定回调来处理错误。生成一个错误也会导致观察者清理订阅并停止生成值。一个observable可以产生值（调用next回调），或者它可以完成，调用complete或error回调。
```typescript
myObservable.subscribe({
  next(num) { console.log('下一个数字: ' + num)},
  error(err) { console.log('收到一个错误: ' + err)}
});
```
## 二、RxJS库
  反应式编程是与数据流和变化传播有关的异步编程范例。RxJS（Reactive Extensions for JavaScript）是一个使用observables进行反应式编程的库，可以更容易地编写异步或基于回调的代码。
  RxJS提供了这种Observable类型的实现，直到类型成为语言的一部分，直到浏览器支持它为止。该库还提供了创建和使用observables的实用功能。这些实用功能可用于：
  - 将现有的异步操作代码转换为observables
  - 遍历流中的值
  - 将值映射到不同类型
  - 过滤流
  - 组成多个流
### 1.可观察的创造函数
  RxJS提供了许多可用于创建新观测值的函数。这些函数可以简化从诸如事件，定时器，承诺等事物创建可观察事件的过程。例如：
**从promise创建一个可观察的事物**
```typescript
import {fromPromise} from 'rxjs/observable/fromPromise';
// 从promise中创建一个observable
const data = fromPromise(fetch('/api/endpoint'));
// 订阅开始收听异步结果
data.subscribe({
 next(response) { console.log(response); },
 error(err) { console.error('错误+ err); },
 complete() { console.log('结束
});
```
**从计数器创建一个观察值**
```typescript
import {interval} from 'rxjs/observable/interval';
// 创建一个Observable， 每次计数器都会发布一个值
const secondsCounter = interval(1000);
// 发布值的时候开始订阅
secondsCounter.subscribe(n =>
  console.log(`订阅过了${n}s了`));
```
**从一个事件创建一个observable**
```typescript
import {fromEvent} from 'rxjs/observable/fromEvent';
const el = document.getElementById('my-element');
// 从鼠标移动时事件创建 Observable
const mouseMoves = fromEvent(el, 'mousemove');
// 鼠标移动时订阅
const subscription = mouseMoves.subscribe((evt: MouseEvent) => {
  // 记录鼠标移动
  console.log(`Coords: ${evt.clientX} X ${evt.clientY}`);
  // 当鼠标位于屏幕的左上角时，停止订阅
  if (evt.clientX < 40 && evt.clientY < 40) {
    subscription.unsubscribe();
  }
});
```
**创建一个AJAX请求的observable**
```typescript
import {ajax} from 'rxjs/observable/fom/ajax';
// 创建基于AJAX请求的observable
const apiData = ajax('/api/data');
//创建请求订阅
apiData.subscribe(res => console.log(res.json()))
```
### 2.运营商
  运算符是建立在observables基础之上的函数，可以对集合进行复杂的操作。例如，RxJS定义运营商，如map()，filter()，concat()，和flatMap()。运算符采用配置选项，并返回一个可以观察源的函数。当执行这个返回的函数时，操作符观察源observable的发射值，转换它们，并返回这些转换值的新观察值。比如：
**地图运算符**
```typescript
import {map} from 'rxjs/operators';
const nums = Observable.of(1,2,3);
const squareValus = map(val:number) => val * val;
const squaredNums = squareValues(nums);
squaredNums.subscribe(x => console.log(x))
/*输出：
1，
2，
3
*/
```
  我就可以使用管道将运行商链接在一起，管道可以将多个功能合并为一个功能，该pipe()函数将想要组合的函数作为参数，并返回一个新的函数，该函数在执行时，按顺序运行组合函数。这适用于可观察对象的一组运算符是一个配方-也就是说用于生成自己感兴趣的一组指令，它本身不执行操作，需要回调subscribe()，比如：
**独立管道功能**
```typescript
import {pipe} from 'rxjs/util/pipe';
import {filter,map} from 'rxjs/operators';
const nums = Observable.of(1,2,3,4);
//创建一个接收Observable的函数
const squareOddVals = pipe{
    filter(n = n%2),
    map(n => n*n)
};
// 创建一个Observable，用来运行filter和map的函数
const squareOdd = squareOddVals(nums);
// 订阅运行组合功能
squareOdd.subscribe(x => console.log(x));
```
  该pipe函数也是RxJS上的一个方法Observable，所以可以使用这个比较短的格式来定义相同的操作：
**Observable.pipe函数**
```typescript
import {filter} from 'rxjs/operators/filter';
import {map} from 'rxjs/operators/map';
const squareOdd = Observable.of(1,2,3,4)
				.pipe(
					filter(n => n%2),
					map(n => n*n)
				);
//订阅拿值
squareOdd.subscribe(x => console.log(x))
```
####2.1 常用操作符
适用范围 | 操作符
-- | --
创建 | from , fromPromise , fromEvent , of
组合 | combineLatest , concat , merge , startWith , withLatestFrom , zip
过滤 | debounceTime , distinctUntilChanged , filter , take , takeUntil
转换 | bufferTime , concatMap , map , mergeMap , scan , switchMap
公用 | tap
Multicasting | share
### 3.错误处理
  除了error()在订阅时提供处理程序之外，RxJS还为catchError操作员提供了可处理方法中的已知错误。比如，有一个可观察的事件，它发出API请求并映射到服务器的响应。如果服务器返回错误或者该值不存在，则会产生错误。如果我捕获此错误并提供默认值，流将继续处理值而不是错误：
**catchError**
```typescript
import {ajax} from 'rxjs/observable/dom/ajax';
import {map,catchError} from 'rxjs/operators';
// 从API里面返回 response，如果有错误，就返回空数组
const apiDate = ajax('/api/data').pipe(
  map(res => [
      if(!res.response){
          throw new Error('值发生错误')
      }
      return res.response;
  ]),
  catchError(err => Observable.of([]))
);
apiData.subscribe({
    next(x){console.log('data:'x)},
    error(err){console.log('发生错误')}
})
```
#### 3.1 重试失败的可观察
  如果catchError操作员提供简单的恢复路径，retry操作可以让重试失败的请求。在retry操作面前使用操作catchError。它重新订阅原始源观察值，然后可以重新运行导致错误的全部操作序列。如果这包括HTTP请求，它将重试该HTTP请求。
  改变一下上面的代码，在捕获错误之前重试该请求：
```typescript
const apiData = ajax('/api/data').pipe(
  retry(3), // 捕获错误之前重试3次请求
  map(res => {
    if (!res.response) {
      throw new Error('Value expected!');
    }
    return res.response;
  }),
  catchError(err => Observable.of([]))
);
```
### 4.可观察对象的命名
  因为Angular应用程序大多是typescript写的，所以通知就直接知道这个变量是不是一个Observables，虽然Angular框架没有强制执行observables的命名约定，但经常会看到以尾部“$”标记命名的observables。看代码找可观察的值的时候，这个就很有用，此外，如果想要一个属性存储来自observable的最新值，可以方便的使用同名，或不带"$"，比如：
**命名observables**
```typescript
// 前面的引入略过
export class StopWatchComponent{
    stopwatchValue:number;
    stopwatchValue$:Observable<number>;
    start(){
        this.stopwatchValue$.subscribe(num => {
            this.stopwatchValue = num;
        })
    }
}
```
##三、可视角度
  Angular使用observables作为接口来处理各种常见的异步操作，比如：
  - 在EventEmitter类扩展Observable
  - HTTP模块使用observables来处理AJAX请求和响应
  - 路由器和表单模块使用observables来监听和响应用户输入事件
### 1.事件发射器
  Angular提供了一个EventEmitter在通过装饰器发布组件值时使用的类，扩展，添加一个方法，以便它可以发送任意值。当发生回调时，它将发送的值传递给任何订阅观察者的方法。
  @Output()EventEmitterObservableemit()emit()next()
**EventEmitter**
```typescript
@Component({
    selector:'app-zippy',
    template:`
      <div>
        <div (click)="toggle()">Toggle</div>
    	 <div [hidden]="!visible">
      	 <ng-content></ng-content>
        </div>
      </div>
    `
})
export class ZippyComponent{
    visible = true;
    @Output() open = new EventEmitter<any>();
    @Output() close = new EventEmitter<any>();
    toggle(){
        this.visible = !this.visible;
        if(this.visible){
            this.open.emit(null)
        }else{
            this.close.emit(null)
        }
    }
}
```
### 2.HTTP
  Angular的HttpClient返回可以从HTTP方法调用中观察到。例如，http.get(‘/api’)返回一个可观察的。与基于承诺的HTTP API相比，这提供了几个优点：
  - 可观察对象不会改变服务器响应（如通过.then()承诺上的链接调用可能发生的那样）。相反，也可以根据需要使用一系列运算符来转换值。
  - 通过该unsubscribe()方法可以取消HTTP请求。
  - 可以将请求配置为获取进度事件的更新。
  - 失败的请求可以很容易就重试
### 3.异步管道
  该异步管道订阅可观察或者promise，并返回它发出的最新值，当发射一个新值时，管道标记要检查更改的组件，下面的demo就是将timeobservable 绑定到组件视图。观察对象不断用当前时间更新视图。
**使用异步管道**
```typescript
@Component({
    selector:'app-async-observable-pipe',
    template:`<div><code>observable | async</code>
    			Time:{{time | async}}</div>`
})
export class AsyncObservablePipeComponent{
    time = new Observable(observer => 
    	setInterval((=> observer.next(new Date().toString()),1000))
    )
}
```
### 4.路由器
  Router.events将事件提供为可观察的事件，可以使用filter()RxJS中的操作员查找感兴趣的事件，并订阅他们，以便根据导航过程中的事件顺序进行决策，比如下面：
**路由器事件**
```typescript
import {Router,NavigationStart} from '@angular/router';
import {filter} from 'rxjs/operators';
@Component({
    selector:'app-routable',
    templateUrl:'./routable.component.html',
    styleUrls:['./routable.component.css']
})
export class Routable1Component implements OnInit{
    navStart:Observable<NavigationStart>;
    constructor(private router:Router){
        // 创建一个新的Observable，仅发布NavigationStart事件
        this.navStart = router.events.pipe(
          filter(evt => evt instanceof NavigationStart)
        ) as Observable<NavigationStart>;
    }
    ngOnInit(){
        this.navStart.subscribe(evt => console.log('Navigation Started'))
    }
}
```
  该ActivatedRoute是注入路由器服务，它利用观测的，以获取有关路由路径和参数的信息。例如，ActivateRoute.url包含报告路径路径的observable。想下面这样：
```typescript
import {ActivetedRoute} from '@angular/core';
@Component({
  selector: 'app-routable',
  templateUrl: './routable.component.html',
  styleUrls: ['./routable.component.css']
})
export class Routable2Component implements OnInit{
    constructor(private activetedRoute:ActivetedRoute){
    }
    ngOnInit(){
        this.activetedRoute.url
        	.subscribe(url => console.log('地址变成了：'+url))
    }
}
```
### 5.响应式表单
  反应形式具有使用observables监视表单控制值的属性。在FormControl性能valueChanges和statusChanges包含提高改变事件的观测。订阅可观察的表单控件属性是在组件类中触发应用程序逻辑的一种方式，比如这样：
```typescript
export class XXComponent implements OnInit{
    nameChangeLog:string[]=[];
    personForm:FormGroup;
    ngOnInit(){
        this.logNameChange();
    }
    logNameChange(){
        const nameControl = this.personForm.get('name');
        nameControl.valueChanges.forEach(
          (value:string) => this.nameChangeLog.push(value)
        )
    }
}
```
##四、实际用法
###1.提前输入建议 
  Observable可以简化提前输入提示的实现。通常，提前输入必须执行一系列单独的任务：
  - 从输入中收听数据
  - 修剪该值并确保它是最小长度
  - 去抖动以便不发送每个击键的API请求，而是等待击键的中断
  - 如果值保持不变，就不要发送请求
  - 如果其结果将被更新后的结果无效，就取消正在进行的AJAX请求
    如果用JS写上面的程序代码会涉及很多，有了observables，就可以使用简单的RxJS操作符：
```typescript
import {fromEvent} from 'rxjs/observable/fromEvent';
import {ajax} from 'rxjs/observable/dom/ajax';
import {map, filter, debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
const searchBox = document.getElementById('search-box');
const typeahead = fromEvent(searchBox, 'input').pipe(
  map((e: KeyboardEvent) => e.target.value),
  filter(text => text.length > 2),
  debounceTime(10),
  distinctUntilChanged(),
  switchMap(() => ajax('/api/endpoint'))
);

typeahead.subscribe(data => {
 // 在这儿处理数据
});
```
###2.指数退避
  指数退避是一种在失败后重试API的技术，在每次连续失败之后，重试之间的时间会更长，并且最大重试次数会超过该次数，然后请求被视为失败，使用承诺和其他跟踪AJAX调用来的方法来实现这个可能相当复杂，但是用Observable就比较容易了：
```typescript
import {ajax} deom 'rxjs/observerble/dom/ajax';
import {range} from 'rxjs/observerble/range';
import {timer} from 'rxjs/observerble/timer';
import {pipe} from 'rxjs/utile/pipe';
import {retryWhen,zip,map,mergeMap} from 'rxjs/operators';
function backoff(maxTries,ms){
    return pipe(
      retryWhen(attempts => range(1,naxTries))
      	.pipe(
      	  zip(attempts,i => i),
      	  map(i => i*i),
      	  mergeMap(i => timer(i*ms))
      	)
    );
}
ajax('/api/endpoint')
	.pipe(backof(3,250))
	.subscribe(data => handleData(data))
function handleData(data){
    //数据处理
}
```
## 五、Observables与其它技术相比
### 1.Observables相比promise
  - observables是陈述性的，计算直到订阅开始，承诺在创建时立即执行，这使得observables可用于定义在需要结果时运行的方法
  - Observable提供了许多值，promise只提供一个，这使得observables对于对于随着时间的推移获取多个值很有用。
  - observables区分链接和订阅，promise只有.then()条款，这使得observables可用于创建复杂的转化配方供系统的其他部分使用，而不会导致工作被执行。
  - observables的subscribe()负责处理错误，promise将错误推向了child的promise，这使得observables可用于集中和可预测的错误处理
#### 1.1 创建和订阅
  observables在用户订阅之前不会被执行。在subscribe()执行一次定义的行为，它可以再次被调用。每个订阅都有自己的计算。重新订阅会导致重新计算值。
```typescript
// 创建一个发布操作
new Observable((observer) => { subscriber_fn });
// 开始执行
observable.subscribe(() => {
      // 观察员处理通知
    });
```
  promise立即执行，只是一次。结果的计算在创建承诺时开始。没有办法重新开始工作。所有then子句（订阅）共享相同的计算。
```typescript
// 开始执行
new Promise((resolve, reject) => { executer_fn });
// 处理返回值
promise.then((value) => {
      // 处理操作放在这
    });
```
#### 1.2 链接
  observables区分诸如map和订阅之类的转换功能。只有订阅才会激活订阅者功能以开始计算值。
```typescript
observable.map((v) => 2*v);
```
  不区分最后.then条款（相当于订阅）和中间.then条款（相当于map）。
```typescript
promise.then((v) => 2*v);
```
#### 1.3 取消
  observables订阅是可取消的。取消订阅将删除监听器接收更多值，并通知订阅者功能取消工作。
```typescript
const sub = obs.subscribe(...);
sub.unsubscribe();
```
  promise不可取消
#### 1.4 错误处理
  observables的执行错误被传递给订户的错误处理程序，并且订户自动退出可观察项。
```typescript
obs.subscribe(() => {
  throw Error('错误');
});
```
  promise将错误推向子级的promise
```typescript
promise.then(() => {
      throw Error('错误');
});
```
#### 1.5 对比表格
操作 | observables | promise
-- | -- | --
创建 | new Observable((observer) => { observer.next(123);}); | new Promise((resolve, reject) =>{resolve(123);});
转换 | obs.map((value) => value * 2 ); | promise.then((value) => value * 2);
订阅 | sub = obs.subscribe((value) => console.log(value)}); | promise.then((value) => {console.log(value);});
取消订阅 | sub.unsubscribe(); | 不能取消订阅
### 2.Observables和事件API
  Observables与使用事件API的事件处理程序非常相似。这两种技术都定义了通知处理程序，并使用它们来处理随时间推移而传递的多个值 订阅observable相当于添加事件侦听器。一个显着的区别是可以配置一个observable来在将事件传递给处理程序之前转换事件。使用observables来处理事件和异步操作可以在HTTP请求等上下文中具有更高的一致性。
**对比表格**
操作 | observables | 事件API
-- | -- | --
创建和取消 | // 设置<br /> let clicks=fromEvent(button, ‘click’);<br /> // 开始监听<br />let subscription = clicks$.subscribe(e => console.log(‘Clicked’, e))<br /> // 停止监听<br /> subscription.unsubscribe(); | function handler(e) {console.log(‘Clicked’, e);}<br />// 设置并开始监听 <br />button.addEventListener(‘click’, handler);<br /> // 停止监听<br />button.removeEventListener(‘click’, handler); 
订阅 | observable.subscribe（（）=> { //通知处理程序在这里}）; |element.addEventListener（eventName，（event）=> { //通知处理程序}）;
配置 | //监 听按键，但提供一个代表输入值的流。<br />fromEvent（inputEl，'keydown'）。pipe（map（e => e.target.value））; |element.addEventListener（eventName，（event）=> { // 在到达处理程序之前，不能将传递的事件更改为另一个值）;}
### 3.Observable与数组相比
  Observable随着时间的推移而产生值。一个数组被创建为一组静态值。从某种意义上说，在数组同步的情况下，可观察数是异步的。在下面的表格里，➞意味着异步值传递。
操作 | Observable | Array
-- | -- | --
given | obs: ➞1➞2➞3➞5➞7<br/>obsB: ➞'a'➞'b'➞'c' | arr: [1, 2, 3, 5, 7]<br/>arrB: ['a', 'b', 'c']
concat() | obs.concat(obsB)<br/>➞1➞2➞3➞5➞7➞'a'➞'b'➞'c' | arr.concat(arrB)<br/>[1,2,3,5,7,'a','b','c']
filter() | obs.filter((v) => v>3)<br/>➞5➞7 | arr.filter((v) => v>3)<br/>[5, 7]
find() | obs.find((v) => v>3)<br/>➞5 | arr.find((v) => v>10) <br/>5
findIndex() | obs.findIndex((v) => v>3)<br/>➞3| arr.findIndex((v) => v>3) <br/>3
forEach() | obs.forEach((v) => {console.log(v);// 1,2,3...}) | arr.forEach((v) => {console.log(v); //1,2,3...})
map() | obs.map((v) => -v) <br/>➞-1➞-2➞-3➞-5➞-7 | arr.map((v) => -v)<br/>[-1, -2, -3, -5, -7]
reduce() | obs.scan((s,v)=> s+v, 0)<br/>➞1➞3➞6➞11➞18 | arr.reduce((s,v) => s+v, 0) <br/>18

  
























