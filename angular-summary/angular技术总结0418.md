#Day34
##三、DI实用技巧
###1.应用程序全局依赖
  在应用程序根组件AppComponent中注册那些被应用程序全局使用的依赖提供商。在下面的例子中，通过@Component元数据的providers数据导入和注册了几个服务（LoggerService，userContext和UserService）
```typescript
import {LoggerService}      from './logger.service';
import {UserContextService} from './user-context.service';
import {UserService}        from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [LoggerService, UserContextService, UserService]
})
export class AppComponent {
/* 代码代码 */
}
```
  所有这些服务都是用类实现的，服务类能充当自己的提供商，这就是为什么只要把它们列在providers数组里就算注册成功了。现在已经注册了这些服务，这样Angular就能在应用程序的任何地方，把它们注入到任何组件和服务的构造函数里。
```typescript
constructor(logger:LoggerService){
  logger.logInfo('创建 人物输出组件')
}
```
```typescript
constructor(private userService: UserService, private loggerService: LoggerService) {
}
```
### 2.外部模块配置
  通常会在NgModule中注册提供商，而不是在应用程序根组件中。那如果我希望这个服务在应用中到处可以被注入，或者必须在应用启动前注册一个全局服务，那就这么做。
  下面的例子是第二种情况，它为组件路由器配置了一个非默认的地址策略，并把它加入到AppModule的providers数组中：
```typescript
providers: [
  { provide: LocationStrategy, useClass: HashLocationStrategy }
]
```
### 3.@Injectable和嵌套服务依赖
  这些被注入服务的消费者不需要知道如何创建这个服务，它也不用知道，新建和缓存这个服务是依赖注入器的工作。有时候一个服务依赖其它服务，而其它服务可能依赖另外的更多服务，按正确的顺序解析这些嵌套依赖也是框架的工作，在每一步，依赖的使用者只要在它的构造函数里简单声明它需要什么，框架就会完成所有剩下的事情。
  下面的例子往AppComponent里注入的LoggerService和UserService
```typescript
constructor(logger: LoggerService, public userContext: UserContextService){
  userContext.loadUser(this.userId);
  logger.logInfo('AppComponent 初始化')
}
```
UserContext有两个依赖LoggerService和负责获取特定用户信息的UserService。
```typescript
@Injectable()
export class UserContextService{
  constructor(private userService:UserService,private loggerService:LoggerService){}
}
```
  当Angular新建AppComponent时，依赖注入框架先创建一个LoggerService的实例，然后创建UserContextService实例，User人ContextService需要框架已经建好的LoggerService实例和尚未创建的UserService实例。UserService没有其它依赖，所以依赖注入框架可以直接new一个实例。
  依赖注入nb的在于，我创建AppComponent的时候不需要考虑什么，我就只在LoggerService 和 UserContextService 的构造函数里面简单的声明一下，框架就完成了剩下的工作（话说不知道原理用起来心虚啊，虽然我真的没搞懂原理何在），一旦所有的依赖都准备好了，AppComponent就会显示用户信息。
**@Injectable()朱姐**
  注意在UserContextService类里面的@Injectable()装饰器。
```typescript
@Injectable()
export class UserContextService{ }
```
  该装饰器让Angular有能力识别这两个依赖LoggerService和UserService的类型。严格来说这个@Injectable()装饰器只在一个服务类有自己的依赖的时候才是不可缺少的，LoggerService不依赖任何东西，所以该日志服务，在没有@Injectable()的时候应该也能工作，生成的代码也更少一些。
  但是在给它添加依赖的那一瞬间，该服务就会停止工作，要想修复它，就必须要添加@Injectable()。为了保持一致性和防止将来的麻烦，所以就应该从一开就加上@Injectable()。你要是只在真正需要的地方加它也没人管你。
  AppComponent类有两个依赖，但它没有@Injectable()，它不需要，因为组件类有@Component装饰器，在用TypeScript的Angular应用里，有  任何装饰器 来标识依赖的类型就够了。
### 4.把服务作用域限制到一个组件支数
  所有被注入的服务依赖都是单例的，也就是说在任意一个依赖注入器中，每个服务只有唯一的实例。但是Angular应用程序有多个依赖注入器，组织成一个与组件树平行的树状结构。所以，可以在任何组件级别提供和建立特定的服务，如果在多个组件中注入，服务就会被新建出多个实例，分别提供给不同的组件。默认情况下，一个组件中注入的服务依赖，会在该组件的所有子组件中可见，而且Angular会把同样的服务实例注入到该服务的子组件中。
  所以在根部的AppComponent提供的依赖单例就能被注入到应用程序中的任何地方的任何组件。但是这不一定总是想要的，有时候我想要把服务的有效性限制在应用程序的一个特定区域。
  通过在组件树的子级根组件中提供服务，可以把一个被注入服务的作用域局限在应用程序结构中的某个分支中。下面的例子展示了为了子组件和根组件AppComponent提供服务的相似之处，它们语法是相同的，这里通过列入providers数组，在PersonBaseComponent中提供了PersonService：
```typescript
@Component({
  selector: 'app-unsorted-person',
  template:`<div *ngFor= "let tmp of person">{{tmmp.name}}</div>`,
  providers:[PersonService]
})
export class PersonBaseComponent implements OnInit{
  constructor(private personService:PersonService)
}
```
  当Angular新建PersonBaseComponent的时候，它会同时新建一个PersonService实例，该实例只在该组件及其子组件中可以，前提是有这个子组件。也可以在应用程序别处的不同的的组件里提供PersonService，这样就会导致在不同注入器中存在该服务的不同实例。
  这个例子中，局部化的PersonService单例遍历整个例子里的代码，包括PersonBiosComponent、PersonBaseComponent。这些组件每个都有自己的PersonService实例，用来管理独立的英雄库。
### 5.多个服务实例（sandboxing）
  在同一个级别的组件树里，有时需要一个服务的多个实例，一个用来保存其伴生组件的实例状态的服务就是挺好的例子，每个组件都需要好服务的单独实例，每个服务都有自己的工作状态，与其它组件的服务和状态隔离，这叫做沙箱化，因为每个服务和组件实例都在自己的沙箱里运行。
  比如，一个PersonBiosComponent组件显示三个PersonBiosComponent的实例：
```typescript
@Component({
  selector:'app-person-bios',
  template: `
  	<app-person-bio [personId] = "1"></app-person-bio>
  	<app-person-bio [personId] = "2"></app-person-bio>
  	<app-person-bio [personId] = "3"></app-person-bio>
  `,
  providers:[PersonService]
})
export class PersonBiosComponent{}
```
  每个PersonBioComponent都能编辑每个人物的生平，PersonBioComponent依赖PersonCacheService服务来对该人物记性读取、缓存和执行其它持久化操作。
```typescript
@Injectable()
export class PersonCacheService{
  person:Person;
  constructor(private personService:PersonServie){}
  fetchCachedPerson(id:number){
    if(!this.person){
      this.person = this.personService.getPersonById(id)
    }
    return this.person;
  }
}
```
  很明显，这三个PersonBioComponent实例不能共享一样的PersonCacheService，要不然会相互起冲突，争相把自己人放在缓存里。通过在自己的元数据providers数组里面列出的PersonCacheService，每个PersonBioComponent就能有自己独立的PersonCacheService实例。
```typescript
@Component({
  selector: 'app-person-bio',
  template:`<h4>{{person.name}}</h4>
  <ng-content></ng-content>
  <textarea cols="25" [(ngModel)] = "person.description"></textarea>
`,
providers:[PersonCacheService]
})
export class PersonBiosComponent implements OnInit{
  @input() personId:number;
  constructor(private PersonCache:PersonCacheService){}
  ngOnInit(){
    this.personCache.fetchCachedPerson(this.personId)
  }
  get person() {return this.personCache.person}
}
```
  父组件PersonBiosComponent把一个值绑定到personId，ngOnInit把该id传递到服务，然后服务获取和缓存人物，person属性的getter从服务里面获取缓存的英雄，并在模板里显示它绑定到属性值。
### 6.使用@Optional()和@Host()装饰器来限定依赖查找方式
  依赖可以被注入到任何组件级别，当组件申请一个依赖时2，Angular从该组件本身的注入器开始，沿着依赖注入器的树往上找，直到找到第一个符合要求的提供商，如果Angular不能在这个过程中找到合适的依赖，它就会抛出一个错误。
  大部分的时候，如果确实想要这个行为，但是有时候需要限制这个依赖查找逻辑，或者提供一个缺失的依赖，单独或者联合使用@Host和@Optional限定型装饰器，就可以修改Angular的查找行为。当Angular找不到依赖时,@Optional装饰器就会告诉Angular继续执行，Angular把此注入参数设置为null，而不用默认的抛出错误的行为。@Host装饰器将把往上搜索的行为截止在宿主组件，宿主组件通常是申请这个依赖的组件，但当这个组件被投影进一个父组件后，这个父组件就变成了宿主，下一个例子演示第二种情况：
```typescript
// PersonBiosAndContactsComponent是前面的PersonBiosComponent的修改版
@Component({
  selector:'app-person-bios-and-contacts',
  template:`
  <app-person-bio [personId]="1"> <app-person-contact></app-person-contact> </app-person-bio>
  <app-person-bio [personId]="2"> <app-person-contact></app-person-contact> </app-person-bio>
  <app-person-bio [personId]="3"> <app-person-contact></app-person-contact> </app-person-bio>
  `,
  providers:[PersonService]
})
export class PersonBiosAndContactsComponent{
  constructor(logger: LoggerService) {
    logger.logInfo('创建 PersonBiosAndContactsComponent');
  }
}
```
  在<person-bio>标签中是一个新的<person-contact>元素，Angular就会把相应的PersonContactComponent投影给PersonBioComponent的视图里，将它放在PersonBioComponent模板的<ng-content>标签槽里。
  下面的PersonContactComponent，示范了限定型装饰器




















