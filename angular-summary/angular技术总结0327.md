#Day28
## 十、共享Angular模块
  创建共享模块能更好的组织和梳理代码，可以把常用的指令、管道和组件放进一个模块中，然后在应用中其它需要这些的地方导入该模块。
  假如有一个应用有下面这些模块：
```typescript
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MyComponent} from './my.component';
import {NewItemDirective} from './new-item.directive';
import {OrderPipe} from './order.pipe';
@NgModule({
  imports: [CommonModule],
  declarations: [MyComponent, NewItemDirective, OrderPipe],
  exports: [MyComponent, NewItemDirective, OrderPipe, CommonModule, FormsModule]
})
export class ShareModule {}
```
  注意：
  - 它导入了CommonModule，因为该模块需要一些常用的指令
  - 它声明并导出了一些工具性的管道，指令和组件类
  - 它重新导出了CommonModule和FormsModule
      通过重新导出CommonModule和FormsModule，任何导入了这个ShareModule的其它模块，就都可以访问来自CommonModule的NgIf和NgFor等指令，也可以绑定到来自FormsModule中的[(ngModel)] 的属性了。
        即使ShareModule中声明的组件没有绑定过[(ngModel)]，而且ShareModule也不需要导入FormsModule，ShareModule仍然可以导出FormsModule，而不必把它列在imports中，这种方式下，是可以让其它模块也能访问FormsModule，而不用直接在自己的@NgModule装饰器中导入它。
### 1.使用来自其它模块的组件和服务
  在使用来自其它模块的组件和来自其它模块的服务时，有一个很重要的区别。当要使用指令、管道和组件时，导入那些模块就可以了，而导入带有服务的模块意味着我会有那个服务的新实例，这通常不是自己想要的结果，使用模块导入来控制服务的实例化。
  获取共享服务的最常见方式是通过Angular的依赖注入系统，而不是模块系统。
## 十一、NgModule API
### 1.@NgModule的设计意图
  宏观来讲，NgModule是组织Angular应用的一种方式，它们通过@NgModule装饰器中的元数据来实现这一点，元数据有三类：
  - 静态的：编译器配置，用于告诉编译器指令的选择器并通过选择器匹配的方式决定要把该指令应用到模块中的什么位置。它是通过declarations数组来配置的。
  - 运行时：通过providers数组提供给注入器的配置
  - 组合/分组：通过imports和exports数组来把多个NgModule放在一起，并彼此可用
```typescript
@NgModule({
  // 静态，就是编译器的配置啦
  declarations: [], // 配置选择器
  entryComponents: [], // 生成一个主机工厂

  // 运行时, 注入器配置
  providers: [],

  // 组合/分组
  imports: [], // 一起组成NgModule
  exports: [] //让NgModule对其它模块可用
})
```
### 2.NgModule元数据
  NgModule元数据属性表
| 属性             | 说明                                       |
| -------------- | ---------------------------------------- |
| declarations   | 属于该模块的可声明对象的列表。<br/>第一，当编译模块时，需要确定一组选择器，它们将用于触发相应的命令。<br/>第二，该模块NgModule环境中编译，模板的组件是在该NgModule内部声明的，它会使用 列在declarations中的所有指令选择器 和 从所导入的NgModule中导出的那些指令的选择器 这两个规则来确定这组选择器。<br/>组件、指令和管道只能属于一个模块，如果尝试把同一个类声明在多个模块中，编译器就会报错--不要重复声明从其它模块中导入的类 |
| providers      | 依赖注入提供商的列表。Angular会使用该模块的注入器注册这些提供商。如果该模块是启动模块，那就会使用跟注册器。当需要注入到任何组件、指令、管道或服务时，这些服务对于本注入器的子注入器都是可用的。惰性加载模块有自己的注入器，它通常是应用的根注入器的子注入器。惰性加载的服务是局限于这个惰性加载模块的注入器中的。如果惰性加载模块也提供了UserService，那么在这么模块的上下文中创建的任何组件（比如在路由器导航时），都会获得这个服务的本模块内实例，而不是来自应用的根注入器实例。其它外部模块中的组件也会使用它们自己的注入器提供的服务实例。 |
| imports        | 要折叠进本模块中的其它模块。折叠的意思是从被导入的模块中导出的那些软件资产同样会被声明在这里，特别是这里列出的模块，其导出的组件、指令或管道，当在组件模板中被引用时，和本模块自己声明的那些是等价的。组件模板可以引用其它组件、指令或管道，不管它们是在本模块中声明的，还是从导入的模块中导出的，比如，只有当该模块导入了Angular的CommonModule（也可能从BrowserModule中间接导入）时，组件才能使用NgIf和NgFor指令。我可以从CommonModule中导入很多标准指令，不过也有些常用的指令属于其它模块，比如，只有导入了Angular的FormsModule时才能使用[(ngModel)] |
| exports        | 可供导入了自己的模块使用的可声明对象的列表。导出的声明对象就是本模块的公共API，只有当其它模块导入了本模块，并且本模块导出了SomeComponent时，其它模块中的组件才能使用本模块中的SomeComponent。默认情况下这些可声明对象都是私有的，如果本模块没有导出SomeComponent，那么就只有本模块中的组件才能使用SomeComponent。导入了某个模块并不会自动重新导出被导入的那些导入（敢不敢再绕口一点），模块B不会因为它导入了模块A而模块A导入了CommonModule而能够使用ngIf，模块B必须自己导入CommonModule。一个模块可以把另一个模块加入自己的exports列表中，这时，另一个模块的所有公共组件、指令和管道都会被导出。重新导出可以让模块显式传递，如果模块A重新导出了CommonModule，而模块B导入了模块A，那么模块B就可以使用ngIf了，即使它自己没有导入CommonModule。 |
| bootstrap      | 要自动启动的组件列表。通常在列表里面只有一个组件，就是应用的根组件，Angular也可以引导多个引导组件，它们每一个都在宿主页面中有自己的位置，启动组件会自动添加到entryComponent里面。 |
| entryComponent | 可以动态加载进视图的组件列表。默认情况下，Angular应用至少有一个入口组件，也就是根组件AppComponent，它用作进入该应用的入口点，也就是说通过引导它来启动该应用。路由组件也是入口组件，因为需要动态加载，路由器创建它们，并把它们扔到DOM中的<router-outlet>附近。虽然引导组件和路由组件都是入口组件，不过我不用自己把它们加到模块的entryComponent列表中，因为它们会被隐式添加进去，Angular会自动把模块的bootstrap中的组件添加到entryComponent列表。而那些使用不易察觉的ViewComponentRef.createComponent()的方式进行命令式引导的组件仍然需要添加。动态组件加载在除路由器之外的大多数应用中都不太常见。如果需要动态加载组件，就必须自己把那些组件添加到entryComponent列表中。 |
## 十二、Angular模块常见问题
### 1.应该把哪些类添加到declarations中？
	把可声明的类（就是组件、指令和管道这种）添加到declarations列表中。这些类只能在应用程序的一个并且只有一个模块中声明，只有当它们从属于某个模块时，才能在此模块中声明它们。
### 2.什么是可声明的？
	可声明的就是组件、指令和管道等可以被追加到模块的declarations列表中的类，它们也是所有能被加到declarations中的类。
### 3.哪些类不应该加到declarations中？
	只有可声明的类才能加到模块的declarations中。
	不要声明：
	1.已经在其它模块中声明过的类，无论它来自应用自己的模块还是第三方模块。
	2.从其它模块中导入的指令，比如，不要声明来@angular/forms的FORMS_DIRECTIVES，因为FormsModule已经声明过它们了。
	3.模块类
	4.服务类
	5.非Angular的类和对象，比如：字符串、数字、函数、实体模型、配置、业务逻辑和辅助类
### 4.为什么要把同一个组件声明在不同的NgModule属性中？
	AppComponent经常被同时列在declarations和bootstrap中。另外有时候还会看到PersonComponent被同时列在declarations、exports和entryComponent中。
	这看起来是多余的，不过这些函数具有不同的功能，从它出现在一个列表中无法推断出它也应该在另一个列表中：
	· AppComponent可能被声明在此模块中，但可能不是引导组件
	· AppComponent可能在此模块中引导，但可能是由另一个特性模块声明的
	· PersonComponent可能是从另一个应用模块导入的（所以我没办法在这声明它），并且被当前模块重新导出
	· PersonComponent可能被导入，以便用在外部组件的模板中，但也可能同时被一个弹出式对话框加载
### 5.关于 Can't bind to 'XXX' since it isn't a konwn property of 'XXXX'
	这个错误通常意味着忘记声明指令 XXX ，或者没有导入XXX所属的模块。
	如果XXX其实不是属性，或者是组件的私有属性（比如不带@Input或者@Output的装饰器），那也会报这个错误。
### 6.应该导入什么？
	导入我需要在当前模块的组件模板中使用的那些公开的（被导出的）可声明类。这意味着要从@angular/common中导入CommonModule才能访问Angular的内置指令，比如ngIf和ngFor，我可以直接导入它或者从重新导出过该模块的其它模块中导入它。
	如果我的组件有[(ngModel)]双向绑定表达式，就要从@angular/forms中导入FormsModule。如果当前模块中的组件包含了共享模块和特性模块中的组件、指令和管道，就导入这些模块。只能在根模块AppModule中导入BrowserModule。
### 7.到底是导入BrowserModule还是CommonModule？
	几乎所有要在浏览器中使用的应用根模块（AppModule）都应该从@angular/plateform-browser中导入BrowserModule。BrowserModule提供了启动和运行浏览器应用的那些基本的服务提供商。BrowserModule还从@angular/common中重新导出了CommonModule，这意味着AppModule中的组件也同样可以访问那些每个应用都需要的Angular指令，如ngIf和ngFor。在其它任何模块中都不要导入BrowserModule，特性模块和惰性加载模块应该改成导入CommonModule，它们需要通用的指令。它们不需要重新初始化全应用级的提供商。特性模块中导入的CommonModule可以让它能用在任何目标平台上。
### 8.假如两次导入同一个模块？
	没有任何问题。当三个模块全都导入模块'A'时，Angular 只会首次遇到时加载一次模块'A'，之后就不会这么做了。无论 A 出现在所导入模块的哪个层级，都会如此。 如果模块'B'导入模块'A'、模块'C'导入模块'B'，模块'D'导入 [C, B, A]，那么'D'会触发模块'C'的加载，'C'会触发'B'的加载，而'B'会加载'A'。 当 Angular 在'D'中想要获取'B'和'A'时，这两个模块已经被缓存过了，可以立即使用。Angular 不允许模块之间出现循环依赖，所以不要让模块'A'导入模块'B'，而模块'B'又导入模块'A'。
### 9.应该导出什么？
	导出那些其它模块希望在自己的模板中引用的可声明类。这些也是我的公共类，如果不导出某个类，它就是私有的，只对当前模块中声明的其它组件可见。
	可以导出任何可声明类（组件、指令和管道），而不用管它是声明在当前模块中还是某个导入的模块中。
	可以重新导出整个导入过的模块，这将导致重新导出它们导出的所有类。重新导出的模块甚至不用先导入。
### 10.不应该导出什么？
	不要导出：
	1.那些只想在当前模块中声明的那些组件中使用的私有组件、指令和管道。如果不希望任何模块看到它，就不要导出
	2.不可声明的对象，比如服务、函数、配置、实体模型等
	3.那些只被路由器或引导函数动态加载的组件。 比如入口组件可能从来不会在其它组件的模板中出现。 导出它们没有坏处，但也没有好处
	4.纯服务模块没有公开（导出）的声明。 例如，没必要重新导出 HttpClientModule，因为它不导出任何东西。 它唯一的用途是一起把 http 的那些服务提供商添加到应用中
### 11.可以重新导出类和模块吗？
	可以的。模块是从其它模块中选取类并把它们重新导出成统一、便利的新模块的最佳方式。模块可以重新导出其它模块，这会导致重新导出它们导出的所有类。 Angular 自己的 BrowserModule 就重新导出了一组模块，比如：
	exports: [CommonModule, ApplicationModule]
	模块还能导出一个组合，它可以包含自己的声明、某些导入的类以及导入的模块。不需要导出一个纯服务类，纯服务类的模块不会导出任何可供其它模块使用的可声明类。比如，不用重新导出HttpClientModule，因为它没有导出任何东西，它唯一的用途是把那些http服务提供商一起添加到应用中。

























