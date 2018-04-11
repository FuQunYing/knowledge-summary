#Day31
## 二、Angular的依赖注入
  依赖注入是用来创建对象及其依赖的其它对象的一种方式。当依赖注入系统创建某个对象实例时，会负责提供该对象所依赖的对象。
### 1.DI的例子
  现在通过一个例子来学习Angular的依赖注入技术，首先这是人物例子的简化版的代码：
  **person.component.ts**
```typescript
    import {Component} from "@angular/core"
    @Component({
      selector:'app-person',
      template:`<h2>Person</h2><app-person-list></app-person-list>`
    })
    export class PersonComponent{}
```
  **person-list.component.ts**
```typescript
  import {Component} from '@angular/core';
  import {PERSON} from './mock-heroes';
@Component({
  selector: 'app-person-list',
  template: `
    <div *ngFor="let person of persons">
      {{person.id}} - {{person.name}}
    </div>
  `
})
export class PersonListComponent {
  person = PERSON;
}
```
  **person.ts**
```typescript
export class Person{
  id: number;
  name: string;
  isSecret = false;
}
```
  **mock-person.ts**
```typescript
import {person} from './person';

export const PERSON: PERSON[] = [
  { id: 11, isSecret: false, name: '许嵩' },
  { id: 12, isSecret: false, name: '山田凉介' },
  { id: 13, isSecret: false, name: '知念侑李' },
  { id: 14, isSecret: false, name: '夏目贵志' },
  { id: 15, isSecret: false, name: '金田一一' },
  { id: 16, isSecret: false, name: '江户川柯南' },
  { id: 17, isSecret: false, name: 'Sherlock' },
  { id: 18, isSecret: true,  name: 'Jhon' },
  { id: 19, isSecret: true,  name: 'Korn' },
  { id: 20, isSecret: true,  name: 'Knock' }
];
``` 
  PersonComponent是位于顶级的组件。它唯一的用途是显示PersonListComponent，它显示一个英雄名字的列表。这个版本的PersonListComponent从PERSON数组中获取person：
```typescript
  export class PersonListComponent{persons = PERSON}
```
  在开发的早期阶段，这就够用了，不过是不理想的，当要测试这个组件或者要从远端服务器获取数据时，就不得不修改PersonListComponent的实现，并要替换所有使用了PERSON模拟数据的地方。最好隐藏服务类的这些内部实现西街，就先把它定义在自己的文件中
### 2.创建一个可注入的PersonService




























```