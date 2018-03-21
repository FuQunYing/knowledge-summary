#Day25 - Angular模块
## 一、Angular模块（NgModule）
  NgModules用于配置注入器和编译器，并帮助组织起来相关的东西。NgModule是一个带有@NgModule装饰器的类，@NgModule的参数是一个元数据对象，用于描述如何编译组件的模板，以及在运行时如何创建注入器，它会标出还模块自己的组件、指令和管道。通过exports属性公开其中的一部分，以便外部组件使用它们，NgModule还能把一些服务提供商添加到应用的依赖注入器中。
### 1.Angular模块
  模块是组织应用和使用外部扩展库应用的最佳途径。Angular自己的库都是NgModule，比如FormsModule、HttpClientModule和RouterModule等，还有很多第三方库也是NgModule，比如Ionic之类的。Angular模块把组件、指令和管道打包成内聚的功能块，每个模块聚焦于某个特定区域、业务领域、工作流或通用工具。模块还可以把服务添加到应用中，这些服务可能是内部开发我自己写的，或者是来自外部比如Angular路由或者http之类的。模块可以在应用启动时立即加载，也可以由路由器进行异步惰性加载。
  NgModule的元数据做了这些事：
  - 声明那些组件、指令和管道属于这个模块
  - 暴露其中的部分组件、指令和管道，这样其它的模块中的组件就可以使用它们。
  - 导入其它的带有组件、指令和管道的模块，这些模块的元件都是当前模块所需要的
  - 提供一些应用中的其它组件使用的服务。
      每个Angular应用都至少有一个根模块，可以引导这个模块，启动应用。对于只有少量组件的简单应用，根模块就够了，如果随着应用的完善，可以把根模块重构成一些特性模块，它们代表一组密切相关的功能，然后再把这些特性模块导入到根模块。
### 2.基本的模块
  CLI创建新应用时会生成以下基本的几个应用模块：
```typescript
// imports
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
## 二、JS模块和NgModule
### 1.JavaScript模块
  在JS中，模块是含JS代码的独立文件，如果要让里面的东西为外部可用，也是需要导出的，放在代码的最后：
```javascript
export class AppComponent { ... }
```
  然后如果有别的文件需要用到它，就可以直接引入使用：
```javascript
import {AppComponent} from './app.component'
```
  JavaScript模块可以为代码加上命名空间，防止因为全局变量而引起意外。
### 2.NgModules
  NgModules是一些带有@NgModule装饰器的类，@NgModule装饰器的imports数组会告诉Angular哪些其他的NgModule是当前模块所需的。imports数组中的这些模块与JavaScript模块不同，它们都是NgModule而不是常规的JavaScript模块。带有@NgModule装饰器的类通常会习惯性的放在单独的文件中，但单独的文件并不像JavaScript模块那样作为必要条件，而是因为它带有@NgModule装饰器及其元数据：
  AngularCLI生成的AppModule：
```typescript
/* 这是JavaScript导入语句，Angular并不识别这些 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

/* @NgModule装饰器让Angular知道这些是是一个NgModule */
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [     /* 这些是NgModule的引入数组 */
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
  NgModule类与JavaScript模块有一些关键性的不同：
  - Angular模块只绑定了可声明的类，这些可声明的类只是供Angular编译器用的
  - 与JavaScript类把所有的成员类都放在一个巨型文件中不同，我就只要把该模块的类放在他的@NgModule.declarations列表里面就行
  - Angular模块只能导出可声明的类，这可能是它自己拥有的也可能是从其他模块中导入的，它不会声明导出任何其他类型的类
  - 与JavaScript模块不同，NgModule可以通过把服务提供商加到@NgModule的providers列表里面，来用服务扩展整个应用。
## 三、常用模块
  Angular应用需要不止一个模块，它们都为根模块服务，如果我要把某些特定添加到应用中，可以通过添加模块来实现，常用的Angular模块：
| NgModule            | 导入自                        | 为何使用                                     |
| ------------------- | -------------------------- | ---------------------------------------- |
| BrowserModule       | @angular/plateform-browser | 想要在浏览器中运行应用时                             |
| CommonModule        | @angular/common            | 想要使用NgIf和NgFor的时候                        |
| FormsModule         | @angular/forms             | 当要构建模板驱动表单时，包含NgModel                    |
| ReactiveFormsModule | @angular/forms             | 当要构建响应式表单的时候                             |
| RouterModule        | @angular/router            | 要使用路由功能，并且要用RouterLink.forRoot() 和 .forChild()时 |
| HttpClientModule    | @angular/common/http       | 需要发起http请求的时候                            |
### 1.导入模块
  当使用Angular模块的时候，在AppModule或者特性模块中导入它们，并把它们列在当前@NgModule的imports数组里面。
### 2.BrowserModule 和 CommonModule
  BrowserModule导入了CommonModule，它贡献了很多通用的指令，比如ngIf和ngFor，另外BrowserModule重新导出了CommonModule，以便它所有的指令在任何导出了BrowserModule的Angular模块中都可以使用。
  对于运行在浏览器中的程序来说，都必须在根模块AppModule中，因为它提供了启动和运行浏览器应用时某些必须的服务。BrowserModule的提供商是面向整个应用的，所以它只能在根模块中使用，而不是特性模块，特性模块只需要CommonModule中的常用指令，它们不需要重新安全所有应用级的服务。如果把BrowserModule导入了惰性加载的特性模块中，Angular就会报错，说应该用CommonModule。
## 四、特性模块的分类
| 特性模块 | 指导原则                                     |
| ---- | ---------------------------------------- |
| 领域   | 领域特性模块用来给用户提供应用程序领域中特有的用户体验，比如编辑客户信息或下订单等。它们通常会有一个顶级组件来充当该特性的根组件，并且通常是私有的。用来支持他的各级子组件。领域特性模块大部分有declarations组成，只要顶级组件会被导出。领域特性模块很少会有服务提供商，如果有，那么这些服务的生命周期必须和该模块的生命周期完全相同。领域特性模块通常是由更高一级的特性模块导出且只能导出一次。对于缺少路由的小型路由，它们可能只会被根模块导出一次。 |
| 带路由的 | 带路由的特性模块是一种特殊的领域型模块，但它的顶层组件会作为路由导航时的目标组件。根据这个定义，所有的惰性加载的特性模块都是路由特性模块。带路由的特性模块不会导出任何东西，因为它们的组件永远不会出现在外部组件的模板中。惰性加载的路由特性模块不应该被任何模块导入，如果那样做的话就会被立即加载，破坏了惰性加载的设计用途，也就是说我应该永远不会看到它们在AppModule和imports中被引用。立即加载的路由特性模块必须被其它模块导入，以便编译器能了解它包含的组件。路由特性模块很少有服务提供商，如果有，那么它所提供的服务的生命周期必须与该模块的生命周期完全相同。不要在路由特性模块或被路由特性模块所导入的模块中提供全应用级的单例服务。 |
| 路由   | 路由模块为其它模块提供路由配置，并且把路由这个点从他的伴随模块中分离出来，路由模块通常做这些事：第一，定义路由；第二，把路由配置添加到该模块的imports中；第三，把路由守卫和解析器的服务提供商添加到该模块的providers中；第四，路由模块应该与其伴随模块同名，但是加上‘Routing‘后缀。比如一个foo.module.ts中的FooModule就有一个位于foo-routing.module.ts文件中的FooRoutingModule的路由模块。如果其伴随模块是根模块AppModule，AppRoutingModule就要用RouterModule.forRoot(routes)来把路由器配置添加到他的imports中。所有其它路由模块都是子模块，要使用RouterModule.forChild(routes)；第五，按照惯例，路由模块会重新导出这个RouterModule，以便伴随模块中的组件可以访问路由器指令，比如RouterLink和RouterOutlet；第六，路由模块没有自己的可声明对象。组件、指令和管道都是特性模块的职责，而不是路由模块的。 路由模块应该只被他的伴随模块导入。 |
| 服务   | 服务模块提供了一些工具服务，比如数据访问和消息。理论上它们应该是完全由服务提供商组成的，不应该有可声明对象，Angular的HttpClientModule就是一个服务模块的例子，根模块AppModule是唯一的可以导入服务模块的模块。 |
| 窗口部件 | 窗口部件模块为外部模块提供组件、指令和管道。很多第三方UI组件库都是窗口部件模块。窗口部件模块应该完全由可声明对象组成，它们中的大部分都应该被导出。窗口部件模块很少会有服务提供商。如果任何模块的的组件模板中需要用到这些窗口部件，就要导入相应的窗口部件模块。 |
**各种特性模块类型的关键特征**
| 特性模块 | 声明declarations | 提供商providers | 导出什么         | 被谁导入           |
| ---- | -------------- | ------------ | ------------ | -------------- |
| 领域   | 有              | 罕见           | 顶级组件         | 特性模块，AppModule |
| 路由   | 有              | 罕见           | 无            | 无              |
| 路由   | 无              | 是（守卫）        | RouterModule | 特性 （供路由使用）     |
| 服务   | 无              | 有            | 无            | AppModule      |
| 窗口部件 | 有              | 罕见           | 有            | 特性             |
## 五、入口组件
  从分类上说，入口组件是Angular命令式加载的（就是说我没有在模板中引用它）任意组件，可以通过在NgModule中引导它，或者把它包含在路由定义中来指定入口组件，入口组件有两种主要的类型：
  - 引导用的根组件
  - 在路由定义中指定的组件
### 1.引导用的入口组件
  下面的代码指定一个引导用组件AppComponent，位于基本的app.module.ts中：
```typescript
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
```
  可引导组件是一个入口组件，Angular会在引导过程中把它加载到DOM中。其它入口组件是在其它时机动态加载的，比如路由器。Angular会动态加载根组件AppComponent，是因为它的类型作为参数传给了@NgModule的bootstrap函数。
  组件也可以在该模块的ngDoBootstrap()方法中进行命令式引导。@NgModule的bootstrap属性告诉编译器，这里是一个入口组件，它应该生成代码，来使用这个组件引导该应用。
  引导用的组件必须是入口组件，因为引导过程是命令式的，所以它需要一个入口组件。
### 2.路由定义中的入口组件
  入口组件的第二种类型出现在路由定义中，就像这样：
```typescript
const routes:Routes = [
  {path: '', component: XXXComponent}
]
```
  路由定义使用组件类型引用了一个组件：component：XXXComponent。所有的路由组件都必须是入口组件，这就需要把同一个组件添加到两个地方，但是编译器足够聪明，可以识别出这里是一个路由定义，因此会把这些路由组件添加到entryComponent中。
### 3.entryComponents数组
  虽然@NgModule装饰器具有一个entryComponents数组，但大多数情况下不用显式设置入口组件，因为Angular会自动把@NgModule的bootstrap中的组件以及路由定义中的组件添加到入口组件中，虽然这两种机制足够自动添加大多数入口组件，但如果要用其它方式根据类型来命令式的引导或动态加载某个组件，就必须把它们显式加载到entryComponent中。
#### 3.1 entryComponents和编译器
  对于生产环境的应用，当然是越快越好，尽量加载小一点的代码，这些代码应该只包含实际使用到的类，并且排除那些从未用到的组件，因此Angular编译器只会为那些可以从entryCOmponent中直接或间接访问到的组件生成代码，这意味着，仅仅往@NgModule的declarations中添加更多引用，并不能表达出它们在最终的代码中是必要的。
  实际上，很多库声明和导出的组件都是没有用过的，比如Material Design库会导出其中的所有组件，因为它也不知道我要用哪一个，然而我又不会全都用，对于我没有引用过的，优化工具就会把这些组件从最终的代码包中摘出去。如果一个组件既不是入口组件，也没有在任何模板中使用过，优化工具就会把它扔出去。所以最好只添加真正的入口组件，以便让应用保持精简。






























