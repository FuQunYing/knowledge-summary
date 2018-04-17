#Day33
##三、多级依赖注入器
  Angular有一个多级依赖注入系统，实际上，应用程序中有一个与组件树平行的注入器树（平行就是指结构完全相同且一一对应）。我可以在组件树的任何级别上重新配置注入器。
###1.注入器树
  之前说过如何配依赖注入器，以及如何在需要用时用它获取依赖。实际上没有那个唯一的注入器这回事，一个应用中可能有多个注入器。一个Angular应用是一个组件树，每个组件石丽丽都有自己的注入器，组件的树与注入器的树平行。组件的注入器可能是一个组件树中更高级的祖先注入器的代理，但是这只是提升效率的实现细节，但是不要在意这些细节，就想成是每个组件都有自己的注入器就可以了。
  想一下 人物列表 应用的一个简单变种，它的顶层是AppComponent组件，他有一些子组件，PersonsListComponent组件保存和管理着PersonTaxReturnComponent的多个实例。下图展示了当PersonsCardComponent的三个PersonTaxReturnComponent实例同时展开时的三级组件树的状态：
![图片](component-hierarchy.png)
#### 1.1 注入器冒泡
  当一个组件申请获得一个依赖时，Angular先尝试用该组件自己的注入器来满足它，如果该组件的注入器没有找到对应的提供商，它就把这个申请转给它父组件的注入器来处理，如果那个注入器也无法满足这个申请，它就继续转给它的父组件的注入器，这个申请继续往上冒泡，直到找到了一个能处理此批申请的注入器或者超出了组件树中的祖先位置为止。如果超出了组件树中的祖先还未找到，Angular就会抛出一个错误。
```txt
还可以“盖住”这次冒泡，一个中层的组件可以声称自己是“宿主”组件，向上查找提供商的过程会截止于这个“宿主”组件。
```
####  1.2 在不同层级再次提供同一个服务
  我可以在注入器树中的多个层次上为指定的依赖令牌重新注册提供商，但并非必须重新注册，事实上，虽然可以重新注册，但除非有很好的理由，否则不应该这么做。服务器解析逻辑会自上而下查找，碰到的第一个提供商会胜出，因此，注入器树中间层注入器上的提供商，可以拦截来自底层的对特定服务的请求。这导致他可以 “重新配置”和“遮蔽”高层的注入器。
  如果我只在顶级通常就是根模块AppModule，这三个注入器看起来将是“平面”的，所有的申请都会冒泡到根NgModule进行处理，也就是在bootstrapModule方法中配置的那个。
### 2.组件注入器
  在不同层次上重新配置一个或者多个提供商
#### 2.1 场景：服务隔离
  出于架构方面的考虑，可能就会让人决定把一个服务限制到只能在它所属的特定领域中访问。在下面的例子里面有一个VillainsListComponent，它显示一个反派的列表。虽然我可以在根模块AppModule中提供VillainsService，不过那样一来就会导致在整个应用中到处都能访问到VillainsService，包括在人物的工作流中。
  如果以后要修改VillainsService，那也有可能破坏英雄组件中的某些部分，这样不行，但是在根模块里面提供这个服务就可能导致这种状况。
  所以可以换一种方式，只在VillainsListComponent的元数据的providers中提供VillainsService，代码长这样：
```typescript
@Component({
  selector: 'app-villains-list',
  templateUrl: './villains-list.component.html',
  providers: [VillainsService]
})
```
#### 2.2 场景：多重编辑会话
  很多应用允许用户同时进行多个任务，比如，在纳税申报应用中，申报人可以打开多个报税单，随时可能从一个切换到另一个。下面的例子就还是基于任务列表，外层有一个PersonListComponent，它显示一个人物列表。
  要打开一个人的报税单，申报者点击人物的名字，它就会打开一个组件来编辑那个申报单，每个选中的申报单都会在自己的组件中打开，并且可以同时打开多个申报单。每个报税单组件都有下列特征：
  - 属于他自己的报税单会话
  - 可以修改一个报税单，而不会影响另一个组件中的申报单
  - 能把所做的修改保存到它的报税单中，或者放弃它们。
  实现方式之一就是让PersonTaxReturnComponent有逻辑来管理和还原那些更改，这对于简单的报税来说是很容易的，但是现实报税情况是很复杂的，对于这些修改的管理就要狠仔细啦，所以这种管理就需要借助于服务了。
  下面是一个报税单服务PersonTaxReturnService，它缓存了单条PersonTaxReturn，用于跟踪那个申报单的变更，并且可以保存或还原它，它还委托给了全应用级的单例服务PersonService，它是通过依赖注入机制取得的。
**peron-tax-return.service.ts**
```typescript
import {Intectable} from '@angular/core';
import {PersonTaxReturn} from './person';
import {PersonService} from './person.service';
@Injectable()
export class PersonTaxReturnService{
  private currentTaxReturn: PersonTaxReturn;
  private originalTaxReturn: PersonTaxReturn;
  constructor(private personService: PersonService){}
  set taxReturn(htr:PersonTaxReturn){
    this.originalTaxReturn = htr;
    this.currentTaxReturn = htr.clone();
  }
  get taxReturn():PersonTaxReturn{
    return this.currentTaxReturn;
  }
  restoreTaxReturn(){
    this.taxReturn = this.originalTaxReturn;
  }
  saveTaxReturn(){
    this.taxReturn = this.currentTaxReturn;
    this.personService.saveTaxReturn(this.currentTaxReturn).subscribe()
  }
}
```
  然后下面是正在使用它的PersonTaxReturnComponent组件：
```typescript
import {Component,EventEmitter,Input,Output} from '@angualr/core';
import {PersonTaxReturn} from './person';
import {PersonTaxReturnService} from './person-tax-return.service';
@Component({
  selector:'app-person-tax-return',
  templateUrl: './person-tax-return.component.html',
  styleUrls: ['./person-tax-return.component.css'],
  providers:[PersonTaxReturnService]
})
export class PersonTaxReturnComponent{
  message = '';
  @Output() close == new EventEmitter<void>();
  get texReturn():PersonTaxReturn{
    return this.personTaxReturnService;
  }
  @Input()
  set taxReturn(htr:PersonTaxReturn){
    this.personTaxReturnService.taxReturn = htr;
  }
  constructor(private personTaxReturnService: PersonTaxReturnService){}
  onCanceled(){
    this.flashMessage('取消');
    this.personTaxReturnService.restoreTaxReturn()
  }
  onClose() {this.close.emit()}
  onSaved(){
    this.flashMessage('保存');
    this.personTaxReturnService.saveTaxReturn();
  }
  flashMessage(msg:string){
    this.message = msg;
    setTimeout(() => this.message = '',500)
  }
}
```
  通过输入属性可以得到要编辑的报税单，这个属性被实现成了getter和setter，设置器根据传进来的报税单初始化了组件自己的PersonTaxReturnService实例，getter总是返回该服务所存的人物当前状态，组件也会请求该服务来保存或还原这个报税单。但是这里有个问题，如果这个服务是一个全应用范围的单例，每个组件就都会共享同一个服务实例，每个组件也都会覆盖属于其它人物的报税单，再来看看组件中的providers属性：
```typescript
providers:[PersonTaxReturnService]
```
  PersonTaxReturnComponent 有它自己的PersonTaxReturnService提供商，那每个组件的实例都有自己的注入器，在组件级提供服务可以确保组件每个实例都得到一个自己的、私有的服务实例，那报税单就不会被别的覆盖掉了。
#### 2.3 场景：专门的提供商
  重新提供服务的另一个原因，是在组件树的深层中把该服务替换为更特殊的实现。之前有一个Car的例子来着，车子，引擎，轮胎啥的，假如我再根注入器




















