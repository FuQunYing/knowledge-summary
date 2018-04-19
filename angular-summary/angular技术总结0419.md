#Day35
###7.注入组件的DOM元素
  有时候需要访问一个组件对应的DOM元素，先看一下代码，这是 在属性型指令HighlightDirective的基础上的一个简化版：
```typescript
import {Directive,ElementRef,HostListener,Input} from '@angular/core';
@Directive({
  selector: '[appHighlight]'
})
export class HightlightDirective{
  @Input('appHighlight') highlightColor: string;
  ptivate el:ElmentRef;
  construtor(el:ElmentRef){
    this.el = el.nativeElement;
  }
  @HostListener('mouseenter') onMouseEnter(){
    this.highlight(this.highlightColor || 'green')
  }
  @HostListener('mouseleave') onMMouseLeave(){
    this.highlight(null);
  }
  private highlight(color:string){
    this.el.style.background = color;
  }
}
```
  当用户把鼠标移到DOM元素上的时候，指令就会把该元素高亮，Angular把构造函数参数el设置为注入的ElementRef，该ElementRef代表了宿主的DOM元素，它的nativeElement属性把该DOM元素暴露给了指令。下面的代码就是把指令的myHighlight属性添加到两个div标签里面，一个没有赋值，一个赋值了颜色：
```html
<div id="highlight"  class="di-component"  appHighlight>
  <h3>Person Bios and Contacts</h3>
  <div appHighlight="yellow">
    <app-person-bios-and-contacts></app-person-bios-and-contacts>
  </div>
</div>
```
### 8.使用提供商定义依赖
  现在看一下如何编写提供商来提供被依赖的服务。给依赖注入器提供令牌来获取服务，之前通常写在构造函数里面，为参数指定类型，让Angular来处理依赖注入，该参数类型就是依赖注入器所需的token，Angular把token传给注入器，然后把得到的结果赋值给参数，看下面的代码：
```typescript
constructor(logger: LoggerService){
  logger.logInfo('正在创建 PersonBioComponent')
}
```
  Angular向注入器请求与LoggerService对应的服务，并将返回值赋值给logger参数。注入器可能在自己内部容器里里得到依赖，如果它没有话，也能在提供商的帮助下新建一个，提供商就是一个用于交付服务的配方，它被关联到一个token上。如果注入器无法根据token在自己的内部找到对应的提供商它便将强求移交给它的父级注入器，这个过程不断反复，直到没有更多注入器为止。如果没有找到，注入器就抛出一个错误，除非这个请求是可选的。
  新建的注入器中没有提供商，Angular会使用一些自带的提供商来初始化这些注入器，所以我必须自己注册属于自己的提供商，通常用组件或者指令元数据中的providers数组进行注册。
```typescript
providers:[LoggerService,UserContextService,UserService]
```
#### 8.1 定义提供商
  简单的类提供商是最典型的例子，只要在providers数值里面提到该类就可以了：
```typescript
providers:[PersonService]
```
  注册类提供商之所以这么简单，是因为最常见的可注入服务就是一个类的实例，但是并不是所有的依赖都只要创建一个类的新实例就可以交付了，还需要其它的交付方式，这意味着还是要用其它方式来指定提供商。
  PersonOfTheMonthComponent例子示范了一些替代方案，展示了为什么需要它们，这个组件很简单，只有一些属性和一个日志输出：
```typescript
import {Component,Inject} from '@angular/core';
import {DateLoggerService} from './date-logger.service';
import {Person} from './person';
import {PersonService} from './person.service';
import {LoggerService} from './logger.service';
import {MinimalLogger} from './minimal-logger.serivce';
import {RUNNERS_UP, runnersUpFactory} from './runner-up';
@Component({
  selector:'app-person-of-the-month',
  templateUrl:'./person-of-the-month.component.html',
  providers:[
    {provide:Person,useValue:somePerson},
    {provide:TITLE,useValue:'Person of the month'},
    {provide:PersonService,useClass:PersonService},
    {provide:LoggerService,useClass:DateLoggerSerivce},
    {provide:MinimalLogger,useExisting:LoggerSerivce},
    {provide: RUNNERS_UP,useFactory:runnersUpFactory(2), deps: [Person,PersonService]}
  ]
})
export class PersonOfTheMonthComponent{
  logs:string[] = [];
  constructor(
  	logger:MinimalLogger,
  	public personOfTheMonth:Person,
  	@Inject(RUNNERS_UP) public runnersUp:string,
  	@Inject(TITLE) public title: string
  ){
    this.logs = logger.log;
    logger.logInfo('开始')
  }
}
```
  - provide对象
```txt
  该provide对象需要一个token和一个定义对象，该token通常是一个类，并并非一定是这样。该定义对象有一个必填属性就是useValue，用来标识该提供商会如何新建和返回该服务的单例对象。
```
  - useValue - 值-提供商
```txt
  把一个固定的值，也就是该提供商可以将其作为依赖对象返回的值，赋值给useValue属性。使用该技巧来进行运行期常量设置，比如网站的基础地址和功能标志等，通常都是在单元测试中使用值-提供商，用一个假的或模仿的服务来取代一个生产环境的服务。
  PersonOfTheMonthComponent例子有两个值-提供商，第一个提供了Person类的实例，第二个指定了一个字符串资源：
  {provide:Person,useValue:somePerson}
  {provide:TITLE,useValue:'Person of the month'}
  Person提供商的token是一个类，这是合理的，因为它提供的结果是一个Person实例，并且被注入该英雄的消费者也需要知道它类型信息。TITLE提供商的token不是一个类，它是一个特别类型的提供商查询建叫做Injection Token，我可以把InjectionToken用作任何类型的提供商的令牌，但是它在依赖是简单类型的字符串、数字或者函数的时候会特别有帮助。
  一个值-提供的值必须要立即定义，不能事后再定义它的值，很显然，标题字符串是可以立即可用的，这个例子的somePerson变量是以前在下面这个文件中定义的：
  const somePerson = new Person(01, "许嵩",'今天发新歌啦', '233-233-233')
  其它提供商只在需要注入它们的事后才创建并多次那个加载它们的值。
```
  - useClass - 类-提供商
```txt
  userClass提供商创建并返回一个指定类大的新实例，使用该技术来为公共或默认类提供备选实现。该替代品能实现有一个不同的策略，比如拓展默认类或者在测试的事后假冒真实类。看一下刚刚PersonOfTheMMonthComponent里的例子：
  {provide:PersonService,useClass: PersonService}
  {provide:LoggerService,useClass:DateLoggerService}
  第一个提供商是展开了语法糖的，是一个典型情况的展开，一般来说，被新建的类（PersonService）同时也是该提供商的注入令牌，这里用完整形态来编写它，来反衬受欢迎的缩写形式。
  第二个提供商2使用DateLoggerService来满足LoggerService，该LoggerService在AppComponent级别已经被注册，当这个组件要求LoggerService的时候，它得到的却是DateLoggerService服务。 这个组件及其子组件会得到DateLoggerService实例，这个组件树之外的组件得到的仍是LoggerService实例。
  DateLoggerService从LoggerService继承，它把当前的日期/时间附加到每条信息上：
  
  @Injectable()
  export class DateLoggerService extends LoggerService{
    logInfo(msg:any){super.logInfo(stamp(msg))}
    logDebug(msg: any) { super.logInfo(stamp(msg))}
    logError(msg: any) { super.logError(stamp(msg))}
  }
  function stamp(msg:any){return new Date() + '有新消息' + msg}
```
  - useExisting - 别名-提供商
```txt
  使用useExisting，提供商可以把一个token映射到另一个上面，实际上第一个token是第二个token所对应的服务的别名，创造了访问同一个服务对象的两种方法。
  {provide: MinimalLogger, useExisting: LoggerService}
  通过使用别名接口来把一个API变窄，就像下面的例子使用别名就是这个目的。如果LoggerService有个很大的API接口虽然它只有三个接口一个属性，通过使用MinimalLogger类-接口别名，就能成功的把这个API接口缩小到只暴露两个成员：
  
  export abstract class MinimalLogger{
    logs:string[];
    logInfo:(msg:string)=>void;
  }
  然后在一个简化版的PersonOfTheMonthComponent中使用它：
  
  @Component({
    selector:'app-person-of-the-month',
    templateUrl:'./person-of-the-month.component.html',
    providers: [{ provide: MinimalLogger, useExisting: LoggerService}]
  })
  export class PersonOfTheMonthComponent{
    log:string[] =[];
    constructor(logger:MinimalLogger){
      logger.logInfo('开始')
    }
  }
  PersonOfTheMonthComponent构造函数的logger参数是一个MinimalLogger类型，支持Typescript的编辑器里面就会只看到两个成员logs和logInfo。实际上，Angular确实想把logger参数设置为注入器里LoggerService的完整版本，只是在之前的提供商注册里使用了useClass，所以该完整版本被DateLoggerService取代了。
```
  - useFactory - 工厂-提供商
```txt
  useFactory提供商通过调用工厂函数来新建一个依赖对象，就像下面这样：
  {provide: RUNNERS_UP,    useFactory:  runnersUpFactory(2), deps: [Person, PersonService]}
  使用这个技术，可以用包含了一些依赖服务和本地状态输入的工厂函数来建立一个依赖对象。
```


















