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























