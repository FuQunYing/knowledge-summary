#Day09
## 三、生命周期钩子
  每个组件都有一个被Angular管理的生命周期，Angular创建它，渲染它，并且创建渲染它的子组件在它被绑定的属性发生变化时检查它，并在它从DOM中被移除前销毁它。Angular提供了生命周期钩子，把这些关键生命时刻暴露出来，然后就可以在这些时候发生事情的时候采取行动了。
### 1.组件生命周期钩子概览
  指令和组件的实例有一个生命周期：新建、更新和销毁。 通过实现一个或多个Angular core库里定义的生命周期钩子接口，开发者就可以介入该生命周期中的这些关键时刻。
  每个接口都有唯一的一个钩子方法，它们的名字是由接口名再加上ng前缀构成的。比如，OnInit接口的钩子方法叫做ngOnInit， Angular在创建组件后立刻调用它，就像这样：
```typescript
    export class PeekABoo implements OnInit {
      constructor(private logger: LoggerService) { }
      // implement OnInit 里面必须要有ngOnInit方法
      ngOnInit() { this.logIt(`OnInit`); }
      logIt(msg: string) {
        this.logger.log(`#${nextId++} ${msg}`);
      }
    }
```
  没有指令或者组件会实现所有这些接口，并且有些钩子只对组件有意义。只有在指令/组件中定义过的那些钩子方法才会被Angular调用。
### 2.生命周期的顺序
  当Angular使用构造函数新建一个组件或指令后，就会按下面的顺序在特定时刻调用这些生命周期钩子方法：
钩子 | 目的和时机
:-- | :-- 
ngOnChanges() | 当Angular（重新）设置数据绑定输入属性时响应。 该方法接受当前和上一属性值的SimpleChanges对象。当被绑定的输入属性的值发生变化时调用，首次调用一定会发生在ngOnInit()之前。
ngOnInit() | 在Angular第一次显示数据绑定和设置指令/组件的输入属性之后，初始化指令/组件。在第一轮ngOnChanges()完成之后调用，只调用一次。
ngDoCheck() | 检测，并在发生Angular无法或不愿意自己检测的变化时作出反应。在每个Angular变更检测周期中调用，ngOnChanges()和ngOnInit()之后。
ngAfterContentInit() | 当把内容投影进组件之后调用。第一次ngDoCheck()之后调用，只调用一次。只适用于组件。
ngAfterContentChecked() | 每次完成被投影组件内容的变更检测之后调用。ngAfterContentInit()和每次ngDoCheck()之后调用。只适合组件。
ngAfterViewInit() | 初始化完组件视图及其子视图之后调用。第一次ngAfterContentChecked()之后调用，只调用一次。只适合组件。
ngAfterViewChecked() | 每次做完组件视图和子视图的变更检测之后调用。ngAfterViewInit()和每次ngAfterContentChecked()之后调用。只适合组件。
ngOnDestroy() | 当Angular每次销毁指令/组件之前调用并清扫。 在这儿反订阅可观察对象和分离事件处理器，以防内存泄漏。在Angular销毁指令/组件之前调用。
### 3.生命周期的练习
  在AppComponent上进行了一些练习，演示一下生命周期的运作方式。遵循的模式是：用子组件演示一个或者多个生命周期钩子方法，父组件被当做子组件的测试台。
  练习描述
组件 | 描述
:-- | :--
Peek-a-boo | 展示每个生命周期钩子，每个钩子方法都会在屏幕上显示一条日志。
Spy | 指令也同样有生命周期钩子。我们新建了一个SpyDirective，利用ngOnInit和ngOnDestroy钩子，在它所监视的每个元素被创建或销毁时输出日志。本例把SpyDirective应用到父组件里的ngFor英雄重复器(repeater)的<div>里面。
OnChanges | 这里将会看到：每当组件的输入属性发生变化时，Angular会如何以changes对象作为参数去调用ngOnChanges()钩子。 展示了该如何理解和使用changes对象。
DoCheck | 实现了一个ngDoCheck()方法，通过它可以自定义变更检测逻辑。 这里将会看到：Angular会用什么频度调用这个钩子，监视它的变化，并把这些变化输出成一条日志。
AfterView | 显示Angular中的视图所指的是什么。 演示了ngAfterViewInit和ngAfterViewChecked钩子。
AfterContent | 展示如何把外部内容投影进组件中，以及如何区分“投影进来的内容”和“组件的子视图”。 演示了ngAfterContentInit和ngAfterContentChecked钩子。
计数器 | 演示了组件和指令的组合，它们各自有自己的钩子。在这个例子中，每当父组件递增它的输入属性counter时，CounterComponent就会通过ngOnChanges记录一条变更。 同时，我们还把前一个例子中的SpyDirective用在CounterComponent上，来提供日志，可以同时观察到日志的创建和销毁过程。
### 4.Peek-a-boo 全部钩子
  在PeekABooComponent组件演示了组件中所有可能存在的钩子。为了直观的打印每一个生命周期钩子下的信息，首先创建一个打印的日志服务：
```typescript
import { Injectable } from '@angular/core';
@Injectable()
export class LoggerService {
  logs: string[] = [];
  prevMsg = '';//上一条消息
  prevMsgCount = 1;//计数用
  log(msg: string)  {
    if (msg === this.prevMsg) {
      // 重复的消息，就用计数更新最后一条日志条目
      this.logs[this.logs.length - 1] = msg + ` (${this.prevMsgCount += 1}x)`;
    } else {
      // 新消息就放到logs数组里面去
      this.prevMsg = msg;
      this.prevMsgCount = 1;
      this.logs.push(msg);
    }
  }
  clear() { this.logs.length = 0; }//清除
  // 刷新视图保证捕获信息
  tick() {  this.tick_then(() => { }); }
  tick_then(fn: () => any) { setTimeout(fn, 0); }
}
```
然后创建PeekABooComponent组件：
```typescript
import {AfterContentChecked,AfterContentInit, AfterViewChecked, AfterViewInit, DoCheck, OnChanges,OnDestroy,OnInit,SimpleChanges} from '@angular/core';//一般谁也用不了这么多...
import { Component, Input } from '@angular/core';
import { LoggerService } from './logger.service';
let nextId=1;
export class PeekABoo implements OnInit {
  constructor(private logger: LoggerService) { }
  // 实施OnInit下的ngOnInit方法
  ngOnInit() { this.logIt(`OnInit`); }
  logIt(msg: string) {
    this.logger.log(`#${nextId++} ${msg}`);
  }
}
@Component({
  selector: 'peek-a-boo',
  template: '<p>给你看看这个人, {{name}}</p>',
  styles: ['p {background: LightYellow; padding: 8px}']
})
export class PeekABooComponent extends PeekABoo implements
             OnChanges, OnInit, DoCheck,
             AfterContentInit, AfterContentChecked,
             AfterViewInit, AfterViewChecked,
             OnDestroy{
  @Input()  name: string;
  private verb = 'initialized';
  constructor(logger: LoggerService) {
    super(logger);
    let is = this.name ? 'is' : 'is not';
    this.logIt(`name ${is} known at construction`);
  }
  ngOnChanges(changes: SimpleChanges) {
  //只有父组件里面设置了有@Input的值的才会调用这个
    let changesMsgs: string[] = [];
    for (let propName in changes) {
      if (propName === 'name') {
        let name = changes['name'].currentValue;
        changesMsgs.push(`name ${this.verb} to "${name}"`);
      } else {
        changesMsgs.push(propName + ' ' + this.verb);
      }
    }
    this.logIt(`OnChanges: ${changesMsgs.join('; ')}`);
    this.verb = 'changed'; // 下次就是一个变化
  }
  //这个经常被调用，检测到angular不愿意检测的变化时就被调用
  ngDoCheck() { this.logIt(`DoCheck`); }
  ngAfterContentInit() { this.logIt(`AfterContentInit`);  }
  //这个也经常被调用，完成被投影组件的内容的变更之后就被调用
  ngAfterContentChecked() { this.logIt(`AfterContentChecked`); }
  ngAfterViewInit() { this.logIt(`AfterViewInit`); }
  //这个也经常被调用，做完组件视图和子组件视图的变更检测之后调用
  ngAfterViewChecked() { this.logIt(`AfterViewChecked`); }
  ngOnDestroy() { this.logIt(`OnDestroy`); }
}
```
创建它的父组件，然后将父组件放到AppComponent上：
```typescript
import { Component } from '@angular/core';
import { LoggerService } from './logger.service';
@Component({
  selector: 'peek-a-boo-parent',
  template: `
  <div class="parent">
    <h2>Peek-A-Boo</h2>
    <button (click)="toggleChild()">
      {{hasChild ? 'Destroy' : 'Create'}} PeekABooComponent
    </button>
    <button (click)="updatePerson()" [hidden]="!hasChild">Update Person</button>
    <peek-a-boo *ngIf="hasChild" [name]="myFavorite">
    </peek-a-boo>
    <h4>-- Lifecycle Hook Log --</h4>
    <div *ngFor="let msg of hookLog">{{msg}}</div>
  </div>
  `,
  styles: ['.parent {background: moccasin}'],
  providers:  [ LoggerService ]
})
export class PeekABooParentComponent{
  hasChild = false;
  hookLog: string[];
  myFavorite = '许嵩';
  private logger: LoggerService;
  constructor(logger: LoggerService) {
    this.logger = logger;
    this.hookLog = logger.logs;
  }
  toggleChild() {
    this.hasChild = !this.hasChild;
    if(this.hasChild) {
       this.myFavorite = '许嵩';
       this.logger.clear();//在创建时清空原来的日志
    }
    this.logger.tick();
  }
  updatePerson() {
    this.heroName += '!';
    this.logger.tick();
  }
}
```
  此时在页面上只有Create PeekABooComponent的按钮，单击此按钮，在Lifecycle Hook Log下方会出现生命周期钩子调用顺序，第几次单击调用结束再点击Destroy PeekABooComponent按钮，最后日志的信息：OnChanges、OnInit、DoCheck (3x)、AfterContentInit、AfterContentChecked (3x)、 AfterViewInit、AfterViewChecked (3x)和OnDestroy；这与钩子的调用顺序一致。
  如果点击Update Person按钮，就会看到另一个OnChanges和至少两组DoCheck、AfterContentChecked和AfterViewChecked钩子。 显然，这三种钩子被触发了很多次，所以必须让这三种钩子里的逻辑尽可能的精简！
### 5.OnInit和OnDestroy
  潜入spy钩子来发现一个元素是什么时候初始化或者销毁的，指令是一个完美的渗透方式，我的人物们也不会知道，注意：
```txt
1.就像对组件一样，Angular也会对指令调用这些钩子方法。
2.一个侦探(spy)指令可以让我们在无法直接修改DOM对象实现代码的情况下，透视其内部细节。 显然，你不能修改一个原生<div>元素的实现代码。 你同样不能修改第三方组件。 但我们用一个指令就能监视它们了。
```
  这个偷偷摸摸的侦探指令很简单，几乎完全由ngOnInit()和ngOnDestroy()钩子组成，它通过一个注入进来的LoggerService来把消息记录到父组件中去。
```typescript
// 监视应用程序中的元素
@Directive({selector: '[mySpy]'})
export class SpyDirective implements OnInit, OnDestroy {
  constructor(private logger: LoggerService) { }
  ngOnInit()    { this.logIt(`onInit`); }
  ngOnDestroy() { this.logIt(`onDestroy`); }
  private logIt(msg: string) {
    this.logger.log(`Spy #${nextId++} ${msg}`);
  }
}
```
  我们可以把这个侦探指令写到任何原生元素或组件元素上，它将与所在的组件同时初始化和销毁。 下面是把它附加到用来重复显示人物数据的这个<div>上。
```html
<div *ngFor="let tmp of lists" mySpy>
  {{tmp}}
</div>
```
  每个“侦探”的出生和死亡也同时标记出了存放英雄的那个<div>的出生和死亡。添加一个新的人物就会产生一个新的div，指令的ngOnInit()记录了这个事件。Reset按钮清除了这个lists列表。 Angular从DOM中移除了所有人物的div，并且同时销毁了附加在这些div上的侦探指令。 侦探的ngOnDestroy()方法汇报了它自己的临终时刻。
#### 5.1 OnInit()钩子
  使用ngOnInit的原因：
  - 在构造函数之后马上执行复杂的初始化逻辑。
  - 在Angular设置完输入属性之后，对该组件进行准备。 
    在组件创建完毕需要处理复杂的逻辑，初始化数据，对绑定属性进行赋值，都应该放在ngOnInit里面。
#### 5.2 OnDestroy()钩子
  一些清理逻辑必须在Angular销毁指令之前运行，把它们放在ngOnDestroy()中。这是在该组件消失之前，可用来通知应用程序中其它部分的最后一个时间点。
  这里是用来释放那些不会被垃圾收集器自动回收的各类资源的地方。 取消那些对可观察对象和DOM事件的订阅。停止定时器。注销该指令曾注册到全局服务或应用级服务中的各种回调函数。 如果不这么做，就会有导致内存泄露的风险。
### 6.OnChanges()钩子
  一旦检测到该组件(或指令)的输入属性发生了变化，Angular就会调用它的ngOnChanges()方法。
  练习中监控OnChanges钩子：
```typescript
ngOnChanges(changes: SimpleChanges) {
  for (let propName in changes) {
    let chng = changes[propName];
    let cur  = JSON.stringify(chng.currentValue);
    let prev = JSON.stringify(chng.previousValue);
    this.changeLog.push(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
  }
}
```
  ngOnChanges()方法获取了一个对象，它把每个发生变化的属性名都映射到了一个SimpleChange对象， 该对象中有属性的当前值和前一个值。然后我们在这些发生了变化的属性上进行迭代，并记录它们。
  这个例子中的OnChangesComponent组件有两个输入属性：person和power。
```typescript
@Input() person: Person;
@Input() power: string:
```
  宿主OnChangesParentComponent绑定了它们，就像这样：
```html
<on-changes [person]='person' [power]="power"></on-changes>
```
  在此方法里面，当power的属性值改变的时候，就会触发相应的方法，打印日志，但是ngOnChanges捕捉不到person.name的变化。Angular只会在输入属性类的值发生变化时调用这个钩子，而person属性的值是一个到对象的引用，Angular不会关注这个对象的name属性的变化，这个人物对象的引用没有发生变化，所以在Angular的视角来看，也就没有什么要报告的变化了。
### 7.DoCheck()钩子
  使用DoCheck钩子来检测那些Angular自身无法捕获的变更并采取行动。用这个方法来检测那些被Angular忽略的更改。
```typescript
ngDoCheck() {
  if (this.person.name !== this.oldPersonName) {
    this.changeDetected = true;
    this.changeLog.push(`DoCheck: 人名改成了 "${this.person.name}" 从"${this.oldPersonName}"`);
    this.oldPersonName = this.person.name;
  }

  if (this.power !== this.oldPower) {
    this.changeDetected = true;
    this.changeLog.push(`DoCheck: 这个人的能力改成了 "${this.power}" 从 "${this.oldPower}"`);
    this.oldPower = this.power;
  }

  if (this.changeDetected) {
      this.noChangeCount = 0;
  } else {
      // 当没有更改的时候调用
      let count = this.noChangeCount += 1;
      let noChangeMsg = `DoCheck called ${count}x when no change to hero or power`;
      if (count === 1) {
        // 添加新的 “no change”消息
        this.changeLog.push(noChangeMsg);
      } else {
        // 更新最近的“no change”消息
        this.changeLog[this.changeLog.length - 1] = noChangeMsg;
      }
  }

  this.changeDetected = false;
}
```
  该代码检测一些相关的值，捕获当前值并与以前的值进行比较。 当人物或它的能力发生了非实质性改变时，就往日志中写一条特殊的消息，然后你就会看到哗啦哗啦一大片的日志，被调用的频率非常大。
  虽然ngDoCheck()钩子可以可以监测到英雄的name什么时候发生了变化。但我们必须小心。 这个ngDoCheck钩子被非常频繁的调用 —— 在每次变更检测周期之后，发生了变化的每个地方都会调它。 在这个例子中，用户还没有做任何操作之前，它就被调用了超过二十次。大部分检查的第一次调用都是在Angular首次渲染该页面中其它不相关数据时触发的。 仅仅把鼠标移到其它<input>中就会触发一次调用。 只有相对较少的调用才是由于对相关数据的修改而触发的。 显然，我们的实现必须非常轻量级，否则将损害用户体验。
### 8.AfterView钩子
  AfterView例子展示了AfterViewInit()和AfterViewChecked()钩子，Angular会在每次创建了组件的子视图后调用它们。
  下面是一个子视图，它用来把人物的名字显示在一个<input>中：
```typescript
@Component({
  selector: 'app-child-view',
  template: '<input [(ngModel)]="person">'
})
export class ChildViewComponent {
  person = '山田凉介';
}
```
  AfterViewComponent把这个子视图显示在它的模板中：
```html
template: `
  <div>-- 子组件视图开始 --</div>
    <app-child-view></app-child-view>
  <div>-- 子组件视图结束 --</div>`
```
  下列钩子基于子视图中的每一次数据变更采取行动，那就只能通过带@ViewChild装饰器的属性来访问子视图。
```typescript
export class AfterViewComponent implements  AfterViewChecked, AfterViewInit {
  private prevPerson = '';
  // 查询出来视图类型ChildViewComponent的子组件
  @ViewChild(ChildViewComponent) viewChild: ChildViewComponent;
  ngAfterViewInit() {
    // viewChild设置后，视图也初始化
    this.logIt('AfterViewInit');
    this.doSomething();
  }
  ngAfterViewChecked() {
    // viewChild已经检查更新
    if (this.prevPerson === this.viewChild.person) {
      this.logIt('AfterViewChecked (no change)');
    } else {
      this.prevPerson = this.viewChild.person;
      this.logIt('AfterViewChecked');
      this.doSomething();
    }
  }
  // ...
}
```
#### 8.1 遵循单向数据流规则
  当人物的名字超过的10个字符时，doSomething()方法就会更新屏幕
```typescript
// 替代实际业务逻辑的语句设置了“注释”
private doSomething() {
  let c = this.viewChild.person.length > 10 ? `That's a long name` : '';
  if (c !== this.comment) {
    // 这个就要等一会，因为组件的视图已经被检查过了
    this.logger.tick_then(() => this.comment = c);
  }
}
```
```txt
Q: 为什么在更新comment属性之前，doSomething()方法要等上一拍(tick)？
  Angular的“单向数据流”规则禁止在一个视图已经被组合好之后再更新视图。 而这两个钩子都是在组件的视图已经被组合好之后触发的。如果我们立即更新组件中被绑定的comment属性，Angular就会抛出一个错误。 LoggerService.tick_then()方法延迟更新日志一个回合（浏览器JavaScript周期回合），这样就够了。
  注意，Angular会频繁的调用AfterViewChecked()，甚至在并没有需要关注的更改时也会触发。 所以务必把这个钩子方法写得尽可能精简，以免出现性能问题。
```
### 9.AfterContent钩子
  AfterContent例子展示了AfterContentInit()和AfterContentChecked()钩子，Angular会在外来内容被投影到组件中之后调用它们。
#### 9.1 内容投影
  内容投影是从组件外部导入HTML内容，并把它插入在组件模板中指定位置上的一种途径。
  对比前一个例子考虑这个变化。 这次不再通过模板来把子视图包含进来，而是改从AfterContentComponent的父组件中导入它。下面是父组件的模板：
```html
<after-content>
   <app-child></app-child>
 </after-content>
```
  注意，<my-child>标签被包含在<after-content>标签中。 永远不要在组件标签的内部放任何内容，除非你是想把这些内容投影进这个组件中。
  然后是<after-content>组件的模板：
```html
template: `
  <div>-- 内容开始啦 --</div>
    <ng-content></ng-content>
  <div>-- 内容结束啦 --</div>`
```
  <ng-content>标签是外来内容的占位符。 它告诉Angular在哪里插入这些外来内容。 在这里，被投影进去的内容就是来自父组件的<my-child>标签。
```txt
Tips:下面迹象表明存在着内容投影
· 在组件的元素标签中有HTML
· 组件的模板中出现了<ng-content>标签
```
#### 9.2 AfterContent钩子
  AfterContent钩子和AfterView相似。关键的不同点是子组件的类型不同。
  - AfterView钩子所关心的是ViewChildren，这些子组件的元素标签会出现在该组件的模板里面。
  - AfterContent钩子所关心的是ContentChildren，这些子组件被Angular投影进该组件中。
#### 9.3 AfterContent里的数据流
  使用AfterContent时，无需担心单向数据流规则，该组件的doSomething()方法立即更新了组件被绑定的comment属性。 它不用等下一回合。Angular在每次调用AfterView钩子之前也会同时调用AfterContent。 Angular在完成当前组件的视图合成之前，就已经完成了被投影内容的合成。 随意还是仍然有机会去修改那个视图。






























