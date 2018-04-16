#Day32
### 9.服务提供商们
  服务提供商提供依赖值的一个具体的、运行时的版本，注入器依靠提供商来创建服务的实例，注入器再将服务的实例注入组件、管道或者其它服务。必须为注入器注册一个服务的提供商，否则它就不知道该如何创建该服务。下面就解释指定提供商的多种方式，几乎所有的代码片段都是从范例应用的providers.component.ts文件中提取出来的。
#### 9.1 把类作为它自己的提供商
  有很多方式可以提供一些实现Logger类的东西，Logger类本身是一个显而易见且自然而然的提供商。
```typescript
providers: [Logger]
```
  但它不是唯一的途径，可以用其它备选提供商来配置注入器，只要它们能交付一个行为类似于Logger的对象就可以。可以提供一个替代类，那我可以提供一个类似日志的对象，可以给它一个提供商，让它调用可以创建日志服务的工厂函数，所有这些方法，只要用在正确的场合就都可以。重点是当注入器需要一个Logger时，它得先有一个提供商。
#### 9.2 provide对象字面量
  下面是类提供商的另一种语法：
```typescript
providers: [Logger]
```
  这其实是用于注册提供商的简写表达方式，使用的是一个带有两个属性的提供商对象字面量：
```typescript
[{provide: Logger, useClass: Logger}]
```
  provide属性保存的是token，它作为key使用，用于定位依赖值和注册提供商。第二个是一个提供商定义对象，可以把它看作是知道如何创建依赖值的配方。
#### 9.3 备选的类提供商
  某些时候，我会去请求一个不同的类来提供服务你，下面的代码就用来告诉注入器，当有人请求Logger的时候，返回BetterLogger。
```typescript
[{provide:Logger, useClass: BetterLogger}]
```
#### 9.4 带依赖的提供商
  假设EventBetterLogger可以在日志消息中显示用户名，这个日志服务从注入的UserService中取得用户，UserService通常也会在应用级注入：
```typescript
@Injectable()
ecport class EventBBetterLogger extends Logger{
  constructor (private userService: UserService){super();}
  log(message: string){
    let name = this.userService.user.name;
    super.log(`To ${name}:${message}`)
  }
}
```
  就像之前在BetterLogger中那样配置它：
```typescript
[UserService,
	{provide:Logger,useClass:EventBetterLogger}
]
```
#### 9.5 别名类提供商
  假设某个就组建依赖一个OldLogger类，OldLogger和NewLogger具有相同的接口，但是由于某些原因，不能升级这个旧组件并使用它。当旧组件想要使用OldLogger记录消息时，那到时候就改用NewLogger的单例对象来记录。
  不管组件请求的是新的还是就得日志服务，依赖注入器注入的都应该是同一个单例对象，也就是说OldLogger应该是NewLogger的别名。那我当然不希望应用中有两个不同的NewLogger实例，但是如果尝试通过useClass来把OldLogger作为NewLogger的别名，就会导致两个实例，这样不好，不好。
```typescript
[NewLogger,
  //不是别名，这是创建了两个NewLogger的实例
  {
    provide: OldLogge,
    useClass: NewLogger
  }
]
```
  解决，使用useExisting指定别名
```typescript
[NewLogger,
  //别名OldLogger到NewLogger上
  {
    provide: OldLogge,
    useExisting: NewLogger
  }
]
```
#### 9.6 值提供商
  有时候，提供一个预先做好的对象会比请求注入器从类中创建它更容易
```typescript
// Logger Service形式的对象
export function SilentLoggerFn() {}
const silentLogger = {
  logs: ['SilentLogger 记录下 “随便一些字符串”。通过“useValue”注册'],
  log: SilentLoggerFn
};
```
  于是可以通过useValue选项来注册提供商，它会让这个对象直接扮演Logger的角色。
```typescript
[{provide: Logger,useValue: silentLogger}]
```
#### 9.7 工厂提供商
  有时候需要动态创建一个依赖值，因为它所需要的信息知道最后一刻才能确定，也许是这个信息会在浏览器的绘画中不停地变化。还假设这个可注入的服务没法通过独立的源访问此信息。这种情况下，可以调用工厂提供商。
  下面通过添加新的业务需求来看这个问题：PersonService必须对普通用户隐藏掉一些秘密人物，只有授权用户才能看到秘密人物。就像EventBetterLogger那样，PersonService需要了解此用户的身份，它需要知道这个用户是否有权看到隐藏英雄，这个授权可能在单一的应用会话中被改变，例如，改用另一个身份登录时。与EventBetterLogger不同的是不能把UserService注入到PersonService中，PersonService无权访问用户信息，来决定谁有授权谁没有授权。
  让PersonService的构造函数带上一个布尔型的标志来控制是否显示隐藏的英雄：
```typescript
constructor(
	private logger:Logger,
	private IsAuthorized: boolean
) {}
getPersons(){
  let auth = this.isAuuthorized?'authorized':'unauthorized';
  this.logger.log('从${auth}拿到的的人物');
  return PEROSNS.filter(person => this.isAuthorized || !person.isSecret)
}
```
  我可以去注入Logger，但是不能注入逻辑型的isAuthorized，那不得不通过工厂提供商创建这个PersonService的新实例，那么工厂提供商需要一个工厂方法：
```typescript
let personServiceFactory = (logger: Logger, uuserService:  UserService) => {
  return new PersonService(logger,userService.userisAuthorized);
}
```
  虽然PersonService不能访问UserService，但是工厂方法可以。同时把logger和UserService注入到工厂提供商中，并且让注入器把它们传给工厂方法：
```typescript
export let personServiceProvider = {
  provide: PersonService,
  useFactory: personServiceFactory,
  deps:[Logger,UserService]
}
//useFactory 字段告诉Angular：这个提供商是一个工厂方法，它的实现是personServiceFactory
//deps属性是提供商令牌数组，Logger和UserService类作为它们自身类提供商的令牌，注入器解析这些令牌，把相应的服务注入到工厂函数中相应的参数中去。
```
  注意，在一个导出的变量中捕获了这个工厂提供商：personServiceProvider，这个额外的步骤让工厂提供商可被复用，无论哪里需要，都可以使用这个变量注册PersonService。在这个例子中，只在PersonsComponent中需要它，这里它代替了元数据providers数组中原来的PersonService注册，看一下新旧的对比：
```typescript
import {Component} from '@angular/core';
import {personServiceProviders} from './person.service.provider';//新版 
// import {PersonService} from './person.service'; //旧版
@Component ({
  selector :'app-persons';
  providers:[personServiceProviders], //新版
  // providers: [PersonService];//旧版
  template:`<h2>Persons</h2><app-person-list></app-person-list> `
})
export class PersonsComponent{}
```
### 10.依赖注入令牌
  当向注入器注册提供商时，实际上是把这个提供商和一个DI令牌关联起来了，注入器维护一个内部的令牌-提供商映射表，这个映射表会在请求依赖时被引用到，令牌就是这个映射表中的键值。在前面所有例子中，依赖值都是一个类实例，并且类的类型作为它自己的查找键值，在下面的代码中，PersonService类型作为令牌，直接从注入器中获取PersonService实例：
```typescript
personService:PersonService;
```
  编写需要基于类的依赖注入的构造函数是挺幸运了，只要定义一个PersonService类型的构造函数参数，Angular就会知道把跟PersonService类令牌关联的服务注入进来：
```typescript
constructor(personService:PersonService)
```
  这是一个特殊的规约，因为大多数依赖值都是以类的形式提供的。
#### 10.1 非类依赖
  如果依赖不是一个类，而是想要注册一个字符串，函数或者对象的话，应用程序经常为很多很小的因素定义配置对象，但是这些配置对象不总是类的实例，它们可能是独享，如下面这个：
```typescript
export const PERSON_DI_CONFIG AppConfig = {
  apiEndpoint: 'api.persons.com',
  title:'依赖注入'
}
```
  如果想让这个配置对象在注入时可用，就可以用值提供商来注册一个对象，但是这种情况下没有Config类，就没有办法找一个类来当做令牌。
```txt
TypeScript接口不是有一个有效的令牌
PERSON_DI_CONFIG常量有一个接口AppConfig，但是并不能把它当做TypeScript接口用作令牌：
// 失败，不能把interface作为provider token
  [{provide: AppConfig,useValue:PERSON_DI_CONFIG}]
// 失败，不能使用该接口作为参数类型进行注入
  constructor (private config: AppConfig){}
习惯于强类型语言中使用依赖注入的话看这个就很奇怪了，因为强类型语言中，接口是首选的用于查找依赖的主键。这不是Angular的错，接口只是TypeScript设计时的概念，JavaScript没有接口，TypeScript接口不会出现在生成的JavaScript代码中，在运行期，没有接口类型信息可供Angular查找。
```
#### 10.2 InjectionToken值
  解决方案是为非依赖定义和使用InjectionToken作为提供商令牌，定义方式长这样：
```typescript
import {InjectableToken} from '@angular/core'
export const APP_CONFIG = new InjectableToken<AppConfig>('app.config')
```
  类型参数，虽然是可选的，但是可以向开发者和开发工具传达类型信息，而且这个令牌的描述信息也可以为我们开发者提供帮助。使用这个InjectableToken对象注册以来的提供商：
```typescript
providers:[{provide:APP_CONFIG,useValue:PERSON_DI_CONFIG}]
```
  现在，@Inject装饰器的帮助下，这个配置对象可以注入到任何需要它的构造函数中：
```typescript
constructor(@Inject(APP_CONFIG) config: AppConfig) {
  this.title = config.title
}
// 虽然AppConfig接口在依赖注入过程中没有任何作用，但是它为该类中的配置对象提供了强类型信息
```
  或者在ngModule中提供并注入这个配置对象，如AppModule。
```typescript
providers:[
  UserService,
  {provide:APP_CONFIG,useValue:PERSON_DI_CONFIG}
]
```
### 11.可选依赖
  PersonService需要一个Logger，但是如果想不提供Logger也能得到它，可以把构造函数的参数标记为@Optional(),告诉Angular该依赖是可选的：
```typescript
import {Optional} from '@angular/core'
constructor(@Optional() private logger: Logger){
  if(this.logger){
    this.logger.log(some_message);
  }
}
```
  当使用@Optional()时，代码必须准备好如何处理控制，如果其它的代码没有注册一个logger，注入器会设置logger的值为null。
**ps：直接使用注入器**
```typescript
@Component({
  selector:'app-injectors',
  template:
  `
  	<h2>Other Injectors</h2>
  	<div id = 'car'>{{car.drive()}}</div>
  	<div id = 'person'>{{person.name}}</div>
  	<div id = 'rodent>{{rodent}}</div>
  `,
  providers:[Car,Engine,Tires,personService,Logger]
})
export class InjectorComponent implements OnInit{
  car: Car;
  personService:PersonService;
  person:Person;
  constructor(private injector: Injector){}
  ngOnInit() {
    this.car = this.injector.get(Car);
    this.personService = this.injector.get(PersonService);
    this.person = this.personService.getPersons()[0]
  }
  get rodent() {
    let rousDontExist = `R.O.U.S.s? 不存在`
    return this.injector.get(ROUS, rousDONTExist)
  }
}
```
  Injector本身是可注入的服务，在这个例子中，Angular把组件自身的Injectable注入到了组件的构造函数中，然后组件在ngOnInit()中向注入的注入器请求它所需要的服务。注意，这些服务本身没有注入到组件，它们是通过调用injector.get()获得的。get()方法如果不能解析所请求的服务，会抛出异常，调用get()时，还可以使用第二个参数，一旦获取的服务没有在当前或任何祖先注入器中注册过，就把它作为返回值。
```txt
ps:刚刚这个技术，是服务定位器的一个范例，要避免使用此技术，除非确实需要用这个，它难以解释理解和测试，仅仅通过阅读构造函数，没法知道这个类需要什么或者它将做什么。它可以从任何祖先组件中获得服务，而不仅仅是它自己，会迫使自己深入它的实现，才可能明白这个东西做了啥。（框架开发人员必须采用通用的或者动态的方式获取服务时，可能采用这个方法）
```
**ps：建议每个文件只放一个类**
  在同一个文件中有多个类容易造成混淆，最好避免，最好每个文件只放一个类，如果我把PersonService和PersonsComponent组合放在同一个文件里，就得把组件定义在最后，如果组件定义在服务前面，那肯定就报错了。虽然有forwardRef()方法，可以让人先定义组件，但是有简单的方法不用，偏偏用复杂的，是不是sha~





















