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
  AngularCLI可以使用 ng g service persons/person 创建一个新的PersonService类。这个命令创建出来的PersonService的初步代码长这样：
```typescript
import {Injectable} from "@angular/core";
@Injectable()
export class PersonService{
  constructor() {}
}
```
  目前先把@Injectable装饰器当做定义每个Angular服务时的必备部分，把该类的其它部分改写为暴露一个返回和以前一样的mock数据的getPersons方法
```typescript
import {Injectable} from '@angular/core';
import {PERSONS} from './mock-persons';
@Injectable()
export class PersonService() {
  getPersons() {return PERSONS}
}
```
  现在还不是真正的数据服务，如果该应用是从服务器获取数据的话，那getPersons的方法签名就应该是异步形成的，现在先不管这个，现在的问题在于把服务注入到PersonListComponent里面。
###3.注册服务提供商
  在把Angular中的服务注册进依赖注入器之前，它只是一个普通的类。Angular的依赖注入器负责创建服务的实例，并把它们注入到像PersonListComponent这样的类中。其实很少需要自己创建Angular的依赖注入器，当Angular运行本应用时，，它会为我创建这些注入器，首先会在引导过程中创建一个根注入器。但是在注入器创建服务之前，得先往注入器中注入这个服务的提供商。提供商会告诉注入器如何创建该服务，如果没有提供商，注入器不知道它该负责创建该服务，也不知道如何创建服务。
  可以使用Angular中那些支持providers数组书幸福的装饰器来注册提供商。很多Angular的装饰器都支持带有providers属性的元数据，最重要的两个例子就是@Component和@NgModule
####3.1 在组件中注册提供商
  看一下修改后别的PersonComponent，把PersonService注册到了它的providers数组中：
```typescript
import {Component} from '@angular/core';
import {PersonService} from './person.service';
@Component ({
  selector:'app-person',
  providers: [PersonService],
  template:`<h2>Persons</h2><app-person-list></app-person-list>`
})
export class PersonComponent {}
```
####3.2 @NgModule 中的providers
  在根模块里面，AppModule在自己的providers数组中注册了两个提供商：
```typescript
providers:[UserService,{provide: APP_CONFIG, useValue: PERSON_DI_CONFIG}]
//钩哒项目中的core.module.ts里面进行了此项配置
```
  第一条使用UserService这个注入token注册了UserService类，第二条使用了APP_CONFIG这个注入令牌注册了一个值（PERSON_DI_CONFIG）。这样注册完了之后，Angular现在可以向它创建的任何类中注册UserService或者PERSON_DI_CONFIG的值2了。
#### 3.3 @NgModule还是@Component？
  那么是应该使用Angular的模块还是组件来注册服务呢，这两个选择的差别在于服务的范围和生命周期。Angular模块中的providers（@NgModule.providers）是注册在应用的根注入器下的，因此，Angular可以往它所创建的任何类中注入相应的服务，一旦创建，服务的实例就会存在于该应用的全部生存期中，Angular会把这一个服务实例注入到需求它的每个类中。如果想要把这个UserService注入到应用中的很多地方，并且期望每次注入的都是同一个服务实例，那么在Angular的模块中提供的UserService就可以了。
  严格来说，Angular模块中的服务提供商会注册到根注入器上，但是惰性加载的模块是例外，，在这个例子中，所有模块都是在应用启动时立即加载的，因此模块上的所有服务提供商都注册到了应用的根注入器上。
  组件的提供商会注册到每个组件实例自己的注入器上，因此Angular只能在该组件及其各级子组件的实例上注入这个服务实例，而不能在其它地方注入这个服务实例。注意，由组件提供的服务，也同样具有有限的生命周期，组件的每个实例都会有自己的服务实例，并且，当组件实例被销毁的时候，服务的实例也同样会被销毁。在这个例子的应用中，PersonComponent会在应用启动时创建，并且它从未被销毁，因此，由PersonComponent创建的PersonService也同样会活在应用的整个生命周期中。如果我要把PersonService的访问权限限定在PersonComponent及其嵌套的PersonListComponent中，那么在PersonComponent中提供这个PersonService就行。
### 4.注入某个服务
  




























```

```