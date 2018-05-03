#Day36
### 10.注入到派生类
  当编写一个继承自另一个组件的组件时，就要小心了，如果基础组件有依赖注入，必须要在派生类中重新提供和重新注入它们，并将它们通过构造函数传给基类，在现在这个例子里，SortedPeronsComponent继承自PersonsBaseComponent，显示一个被排序的人物列表。
  PersonsBaseComponent能自己独立运行工，它在自己的实例里要求PersonService,用来得到人物，并将他们按照数据库返回的顺序显示出来
  **sorted-person.component.ts**
```typescript
@Component({
    selector:'app-unsorted-persons',
    template:`<div *ngFor="let tmp of persons">{{tmp.name}}</div>`,
    providers:[PersonService]
})
export  class PersonsBaseComponent implements OnInit{
//构造函数应该保持简单，它们只应该用来初始化变量，这条规则用于在测试环境中放心的构造组件，以免在构造它们时，无意做了一些非常搞笑的动作（比如用于服务器进行会话），这就是为什么要在ngOnInit里面调用PersonService，而不是在构造函数中
    constructor(private pService:PersonService){}
    persons:Array<Person>;
    ngOnInit() {
        this.persons=this.pService.getAllPersons();
        this.afterGetPersons();
    }
    protected afterGetPersons() {}//派生类中的后处理人物覆盖
}
```
  用户希望看到英雄按人物字母顺序排序，与其修改原始的组件，不如派生它，新建SortedPersonsComponent，在展示人物之前进行排序，SortedPersonsComponent让基类来获取英雄，但是Angular并不能直接在基类里面直接注入PersonService，必须在这个组件里再次提供PersonService，然后通过构造函数传给基类：
**sorted-persons.component.ts**
```typescript
@Component({
    selector:'app-sorted-person',
    template:`<div *ngFor='let tmp of person'>{{tmp.name}}</div>`,
    providers:[PersonService]
})
export class SortedPersonsComponent extends PersonsBaseComponent{
    constructor(personService:PersonService){
        super{personService};
    }
    protected afterGetPersons(){
        this.persons=this.persons.sort((h1,h2)=>{
            return h1.name<h2.name?-1:(h1.name>h2.name?1:0)
        })
    }
}
//现在注意afterGETPersons()方法，第一反应是不是在SortedPersonsComponent组件里面建一个ngOnInit方法来做排序，但是Angular会先调用派生类的ngOnInit，后调用基类的ngOnInit，所以可能在英雄到达之前就开始排序，这就会有错误，所以可以通过覆盖基类的afterGetPersons()方法来解决这个问题，说了这些都是为了强调避免使用组件继承。
```
### 11.通过注入来找到一个组件
  应用程序组件经常需要共享信息，使用松耦合的技术会更好一点，比如数据绑定和服务共享，但有时候组件确实需要拥有另一个组件的引用，用来访问该组件的属性值或者调用它的方法。在Angular里获取一个组件的引用比较复杂，虽然Angular应用程序是一个组件树，但它没有公共API来在该树中巡查和穿梭。有一个API可以获取子级的引用（API中的Query，QueryList，ViewChildren，ContentChildren），但是美而有公共的API来获取父组件的引用，但是因为每个组件的实例都被添加到了依赖注入器的容器中，可以使用Angular依赖注入来找到父组件。
#### 11.1 找到已知类型的父组件
  我用标准的类注入来获取已知类型的父组件，在下面的例子里，父组件VaeComponent有几个子组件包括VmComponent：
**parent-finder.component.ts (VaeComponent v1)**
```typescript
@Component({
    selector:'vae',
    template:`
    	<div>
    		<h3>{{name}}</h3>
    		<vm></vm>
    		<vs></vs>
    		<vw></vw>
    	</div>
    `
})
export class VaeComponent extends Base{
    name ='Vae'
}
```
  在注入VaeComponent进来后，Vm报告它是否对Vae有访问权：
**parent-finder.component.ts(VmComponent)**
```typescript
@Component({
    selector:'vm',
    template:`
    	<div>
    		<h3>vm</h3>
    		{{vae?'发现':'没有发现'}}Vae访问这个组件类
    	</div>
    `
})
export class VmComponent{
    constructor(@Optional() public vae:VaeComponent){}
}
```
#### 11.2 无法通过它的基类找到一个父级
  如果不知道具体的父组件类名怎么办？
  一个可复用的组件可能是多个组件的子级，想象一个用来渲染金融工具头条新闻的组件，由于商业原因，该新闻组件在实时变化的市场数据流过时，要频繁的直接调用其父级工具。该应用程序可能有多余一打的金融工具组件，如果幸运的话，它们可能会从同一个基类派生，其API是NewsComponent组件所能理解的。
  更好的方式是通过接口来寻找实现了它的组件，但这是不可能的，因为Typescript的接口在编译成JavaScript不支持接口，没有东西可查。
  这样不好这样不好，问题是一个组件是否能通过它父组件的基类来注入它的父组件。
  用VmComponent例子来探究这个问题，Vae组件扩展（派生）自一个叫Base的类：
```typescript
export class VaeComponent extends Base
```
  VmComponent试图把Base注入到它的vae构造函数参数，来报告是否成功：
```typescript
@Component({
    selector:'vm',
    template:`
    	<div>
    		<h3>Vm</h3>
    		{{vae?'发现':'没有发现'}}Vae访问这个组件类
    	</div>
    `
})
export class VmComponent {
    constructor(@Optional() public vae:Base){}
}
//但是这样不行，最后会显示vae参数是null，不能通过基类注入父组件
```
#### 11.3 通过类-接口找到父组件
  可以通过类-接口找到一个父组件，该父组件必须通过提供一个与类-接口令牌同名的别名来与之合作。切记Angular总是从他自己的注入器添加一个组件实例，这就是为什么在之前Vae可以注入到Carol，编写一个别名提供商&mdash，一个拥有useExisting定义的provide函数--它新建一个备选的方式来注入同一个组件实例，并把这个提供商添加到VaeComponent和@Component元数据里的providers数组：
```typescript
providers: [{ provide: Parent, useExisting: forwardRef(() => VaeComponent) }],
```
  Parent是该提供商的类-接口令牌，VaeComponent引用了自身，造成循环引用，使用forwardRef打破了该循环，Carol，Vae的第三个子组件，把父级注入到了自己的parent参数，和之前做的一样：
```typescript
export class CarolComponent {
  name= 'Carol';
  constructor( @Optional() public parent: Parent ) { }
}
```
#### 11.4 通过父级树找到父组件
  想象组件树中的一个分支为：Alice-Barry-Carol，Alice和Barry都实现了这个Parent类-接口，Barry是个问题，它需要访问它的父组件Alice，但同时他也是Carol的父组件，这个意味着它必须同时注入Parent类-接口来获取Alice，和提供一个Parent来满足Carol，下面是Barry的代码：
```typescript
const templateB = `
  <div>
    <div>
      <h3>{{name}}</h3>
      <p>My parent is {{parent?.name}}</p>
    </div>
    <carol></carol>
    <chris></chris>
  </div>`;
@Component({
  selector:   'barry',
  template:   templateB,
  providers:  [{ provide: Parent, useExisting: forwardRef(() => BarryComponent) }]
})
export class BarryComponent implements Parent {
  name = 'Barry';
  constructor( @SkipSelf() @Optional() public parent: Parent ) { }
}
```






















