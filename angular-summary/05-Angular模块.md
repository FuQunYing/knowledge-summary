# Angular模块
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
## 六、特性模块
  特性模块是用来对代码进行组织的模块。随着应用的增长，有时候需要组织与特性应用有关的代码，这样特性能规划出清晰的边界。使用特性模块，可以把与特定功能或者特性有关的代码从其它代码中分离出来，为应用勾勒出清晰的边界，有助于开发人员，小组之间的协作，有助于分离各个指令，并帮助管理根模块的大小。
### 1.特性模块和根模块
  与核心的AngularAPI的概念相反，特性模块是最佳的组织方式，特性模块是最佳的组织方式，特性模块提供了聚焦于特定应用需求的一组功能，比如用户工作流、路由或者表单，虽然可以用根模块做完所有的事情，不过特性模块可以帮助自己把应用划分成一些聚焦的功能区，特性模块通过它提供的服务以及共享出的组件、指令和管道来与根模块和其它模块合作。
### 2.如何制作特性模块
  如果现在已经有了CLI生成的应用，可以在项目的根目录下输入下面的命令来创建特性模块。后面跟上自己的模块名字，后面不加Module的后缀也行，CLI会自动追加的：
```text
	ng generate module CustomerDashboard
```
  这会让CLI创建一个名叫customer-dashboard的文件夹，里面有一个名叫customer-dashboard.module.ts，初始化内容长这样：
```typescript
  import {NgModule} from '@angular/core';
  import {CommonModule} from '@angular/common';
  @NgModule({
    imports:[CommonModule],
    declarations:[]
  })
  export class CustomerDashboardModule{}
```
  无论根模块还是特性模块，其NgModule结构都是一样的，在CLI生成的特性模块中，在文件顶部有两个JavaScript导入语句：
  - 第一个导入了NgModule，他像根模块一样能让人使用@NgModule装饰器
  - 第二个导入了CommonModule，它提供了像ngIf和ngFor这样的指令
      特性模块导入CommonModule而不是BrowserModule，BrowserModule只应该在根模块被导入一次。CommonModule只包含常用指令的信息，比如ngIf和ngFor，它们在大多数模板中都要用，而BrowserModule为浏览器所做的应用配置只会使用一次。declarations数组能添加只属于这个模块的可声明对象，要添加组件的时候，就输入下面的命令，这里的customer-dashboard是个目录，CLI会把特性模块生成在这里，而CustomerDashboard就是组件的名字：
```txt
ng generate component customer-dashboard/CustomerDashboard
```
  这会在customer-dashboard中为新组建生成一个目录，并且会使用CustomerDashboardComponent的信息更改特性模块，引入该组件并在declarations数组里面声明。
### 3.导入特性模块
  要想把这个特性 模块包含在应用里面，就得让app.module.ts知道它，在customer-dashboard.module.ts的最后，导出了一个叫CustomerDashboardModule的模块，这样别的模块就能拿到它。要把它导入到AppModule中，就把它假如AppModule的导入列表，并加入imports数组：
```typescript
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import { AppComponent } from './app.component';
// 有别的特性模块也在这儿继续导入
import {CustomerDashboardModule} from './customer-dashboard/customer-dashboard.module';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CustomerDashboardModule // 导入的特性模块都要添加到imports数组中
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
  现在AppModule知道这个特性模块了，如果在这个模块里面添加过服务提供商，AppModule也一样会知道，其它模块也一样，不过，NgModule并不会暴露他们的组件。
### 4.渲染特性模块的组件模板
  当 CLI 为这个特性模块生成 CustomerDashboardComponent 时，还包含一个模板 customer-dashboard.component.html，里面自带p标签包裹的一段文字，要想在AppModule中查看这些HTML，首先要在CustomerDashboardModule中导出CustomerDashboardComponent，在customer-dashboard.module.ts中，declarations数组下方加入一个包含CustomerDashboardModule的exports数组：
```typescript
exports: [CustomerDashboardCmponent]
```
  然后，在 AppComponent 的 app.component.html 中，加入标签 <app-customer-dashboard>：
```html
<h1>
  {{title}}
</h1>
<!-- 把CustomerDashboardComponent 的选择器写在这就行啦-->
<app-customer-dashboard></app-customer-dashboard>
```
## 七、服务提供商
### 1.创建服务
  可以使用NgModule中的providers数组来为你的应用提供服务，对于用CLI生成的默认应用，要想为它添加一个user服务，首先可以先用命令生成一个：
```txt
ng generate service user
```
  这将会创建一个名叫UserService的服务，现在要让该服务在应用注入器中可用，就要修改app.module.ts文件，先引入，然后加入到providers数组：
```typescript
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {UserService} from './user.service';
@NgModule({
  imports:      [BrowserModule],
  providers:    [UserService],
  declarations: [AppComponent],
  bootstrap:    [AppComponent]
})
export class AppModule { }
```
### 2.提供商的作用域
  当把服务提供商添加到providers数组里面的时候，它就在整个应用程序中可用了，另外，当导入一个带有服务提供商的模块时，其中的服务提供商也同样对整个应用中的类是可用的，只要它们有供查找服务的令牌，比如，如果把HttpClientModule导入了AppModule，它里面的提供商就是对整个应用可用的，我可以在任何地方发送http请求。
### 3.使用惰性加载模块限制提供商的作用域
  在CLI生成的基本应用中，模块是立即加载的，这意味着它们都是由本应用启动的，Angular会使用一个依赖注入体系来让一切服务都在模块间有效。对于立即加载式的应用，应用中的根注入器会让所有的服务提供商对整个应用有效，当使用惰性加载时，这种行为需要进行改变。惰性加载就是只有当需要时才加载模块，比如路由中，它们没办法像立即加载模块那样进行加载，这意味着，在它们的providers数组中列出的服务都是不可用的，因为根注入器不知道这些模块。
  当Angular的路由器惰性加载一个模块时，它会创建一个新的注入器。这个注入器是应用的根注入器的一个子注入器。想象一棵注入器树，它有唯一的根注入器，而每一个惰性加载模块都有一个自己的子注入器。路由器会把根注入器中的所有提供商添加到子注入器中。如果路由器在惰性加载时创建组件，Angular会更倾向于使用从这些提供商中创建的服务实例，而不是来自应用的根注入器创建的实例。
  任何在惰性加载模块的上下文中创建的组件，比如路由导航，都会获取该服务的局部实例，而不是应用的根注入器中的实例。而外部模块中的组件，仍然会收到来自于应用的根注入器创建的实例。虽然可以使用惰性加载模块来提供实例，但不是所有的服务都能惰性加载。比如，像路由之类的模块只能在根模块中使用。路由器需要使用浏览器中的全局对象 location 进行工作。
### 4.使用组件限定服务提供商的作用域
  另一种限定提供商作用域的方式是要把要限定的服务添加到组件的providers数组中，组件中的提供商和NgModule中的提供商是彼此独立的，当要立即加载一个自带了全部所需服务的模块时，这种方式是有帮助的。在组件中提供服务，会限定该服务只能在该组件中有效，就是说同一模块中的其它组件不能访问它。
  **app.component.ts**
```typescript
@Component({
  /*........前面的省略*/
  providers:[UserService]
})
```
### 5.在模块中还是在组件中提供服务
  通常，要在根模块中提供整个应用都需要的服务，在惰性加载模块中提供限定范围的服务。
  路由器工作在根级，所以如果把服务提供商放进组件中，那些依赖于路由器的惰性加载模块，将无法看到它们。当必须把一个服务实例的作用域限定到组件及其组件树中时，可以使用组价注册一个服务提供商，比如用户编辑组件UserComponent，它需要一个缓存UserService的实例，那就应该把UserService注册进UserEditComponent中，然后，每个UserEditorComponent的实例都会获取它自己的缓存服务实例。
## 八、单例应用
### 1.提供单例服务
  那些在定义模块时创建的注入器将会有一些服务，这些服务对于该注入器来说都是单例的，要控制这些服务的生命周期，其实就是控制注入器的创建和销毁，比如路由定义中就可以有一个关联模块，当激活该路由时，就会给那个模块创建一个新注入器，并将其作为当前注入器的子注入器。当离开该路由时，这个新注入器也就被销毁了，这也意味着在这个模块中声明的那些服务也随之销毁了，它们的生命周期与该路由完全相同。类似的，在应用模块中提供的那些服务的生命周期也等同于该应用，因此是单例的。
  下面的例子模块习惯上叫做CoreModule。@NgModule用来创建结构良好的基础设施，让人能够在一个指定的模块中提供服务：
```typescript
import {UserService} from './user.service';
/* 自己的代码 */
@NgModule({
/* 自己的代码 */
  providers:    [UserService]
})
export class CoreModule {
/* 自己的代码 */
}
```
  这里的CoreModule提供了UserService，并且由于AppModule导入了CoreModule，所以CoreModule中提供的任何服务也能在整个应用中使用，因为它是注入器的根节点，它还是单例的，因为在该应用运行期间，该注入器的生命周期等同于AppModule的。
  Angular使用应用的根注入器注册了UserService，不过随着应用的成长，可能还会出现其它组件和服务，比如列表框模态框啥的。要想保持应用的良好结构，就要考虑使用诸如CoreModule这样的模块，这样的方式简化了根模块AppModule，让它只要指挥全局就行，不必什么事都自己做。那现在可以把这些服务注入到需要它们的各个组件里面了，从Angular模块的角度来看，只需要把这些服务定义在一个@NgModule中。作为一个通用的规则，应该只导入一次带提供商的模块，最好在应用的根模块里面。
### 2.forRoot()
  如果某个模块同时提供了服务提供商和可声明对象，那么当在某个子注入器中加载它的时候，就会生成多个该服务提供商的实例，而存在多个实例的话会导致一些问题，因为这些实例会屏蔽掉根注入器中该服务提供商的实例，而它的本意可能是作为单例对象使用的，因此Angular提供了一种方式来把服务提供商从该模块中分离出来，以便该模块既可以带着providers被根模块导入，也可以不带providers被子模块导入。先在模块上创建一个静态方法forRoot()，然后把那些服务提供商放进forRoot方法中。
  以RouterModule为例，RouterModule要提供Router服务，还要提供RouterOutlet指令。RouterModule要由根应用模块导入，以便该应用有一个路由器，而且它还需要至少一个RouterOutlet，RouterModule还必须由各个独立的路由组件导入，让它们能在自己的模板中使用RouterOutlet指令来支持其子路由。
  如果RouterModule没有forRoot()，那么每个路由组件都会创建一个新的Router实例。这将会破坏整个应用，因为应用中只能有一个Router，RouterModule拥有RouterOutlet指令，它应该随处可见，但是Router只能有一个，它应该在forRoot()中提供。最终的结果就是应用的根模块导入了RouterModule.forRoot(....)以获取Router，而所有的路由组件都导入了RouterModule，它不包括这个Router服务。
  如果现在 有一个同时提供服务提供商和可声明对象的模块，就要用下面的模式把它们分离开：
  那些需要把服务提供商加到应用中的模块可以通过某种类似forRoot()方法的方式配置那些服务提供商。forRoot()接收一个服务配置对象，然后返回一个ModuleWithProviders，它是一个带有下列属性的简单对象：
  - ngModule：在这个例子里面就是CoreModule类
  - providers：配置好的服务提供商
    在下面例子里面，根AppModule导入了CoreModule，并把它的providers添加到了AppModule的服务提供商中，特别是，Angular会在@NgModule.providers前面添加这些导入的服务提供商。这种顺序保证了AppModule中的服务提供商总是会优先于那些从其它模块中导入的服务提供商。应该只在AppModule中导入CoreModule并只使用一次forRoot()方法，因为该方法中会注册服务，而我希望那些服务在该应用中只注册一次。如果多次注册它们的话，那可能就会得到多个该服务的实例，就会导致应用出错。
    还可以在CoreModule中添加一个用于配置UserService的forRoot()方法。在下面的例子中可选择的注入UserServiceConfig扩展了Core模块的UserService。如果UserServiceConfig存在，就从这个配置中设置用户名。
```typescript
constructor (@Optional()config: UserServiceConfig){
  if(config) {this.userName = Config.userName}
}
```
  然后是接受UserServiceConfig参数的forRoot()方法：
```typescript
  static forRoot(config: UserServiceConfig): ModuleWithProciders {
    return {
      ngModule: CoreModule,
      providers: [
        {providers: UserServiceConfig.useValue: config}
      ]
    }
  }
```
  最后，在AppModule的imports列表中调用它：
```typescript
  imports {CoreModule} from './core/core.module'
  /*其它引入省略*/
  @NgModule({
    imports: [
      BrowserModule,
      ContactModule,
      CoreModule.forRoot({userName:'凉介'}),
      AppRoutingModule
    ]
  })
  export class AppModule{}
```
  该应用不再显示默认的‘许嵩’，而是用‘凉介’作为用户名称，在文件顶部使用JavaScript的imports语句导入CoreModule，但不要在多于一个@NgModule的imports列表中添加它。
### 3.防止重复导入CoreModule
  只有根模块AppModule才能导入CoreModule，如果一个惰性模块也导入了它，该应用就会为服务生成多个实例。要想防止惰性加载模块重复导入CoreModule，可以添加如下的CoreModule构造函数：
```typescript
constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
  if (parentModule) {
    throw new Error('CoreModule已经加载过了，不可重复加载')
  }
}
```
  这个构造函数要求Angular把CoreModule注入到它自己。如果Angular在当前注入器中查找CoreModule，这个注入过程就会陷入死循环。而@SkipSelf装饰器表示，在注入器树中那些高于我的父级或者更高级的注入器中查找CoreModule。
  如果构造函数在AppModule中执行，那就没有祖先注入器能提供 CoreModule 的实例，于是注入器就会放弃查找。默认情况下，当注入器找不到想找的提供商时，会抛出一个错误。 但 @Optional 装饰器表示找不到该服务也无所谓。 于是注入器会返回 null，parentModule 参数也就被赋成了空值，而构造函数没有任何异常。
  但如果把 CoreModule 导入到像 CustomerModule 这样的惰性加载模块中，事情就不一样了。Angular 会创建一个惰性加载模块，它具有自己的注入器，它是根注入器的子注入器。 @SkipSelf 让 Angular 在其父注入器中查找 CoreModule，这次，它的父注入器却是根注入器了（而上次的父注入器是空）。 当然，这次它找到了由根模块 AppModule 导入的实例。 该构造函数检测到存在 parentModule，于是抛出一个错误。
## 九、惰性加载的特性模块
  要建立一个惰性加载的特性模块，有三个主要步骤：
  - 创建该特性模块
  - 创建该特性模块的路由模块
  - 配置相关路由
### 1.建立应用
  直接用AngularCLI创建：
```txt
ng new my-app -routing
```
  这就创建一个叫my-app的应用了，而--routing标识生成了一个名叫app-routing.module.ts的文件，它是建立惰性加载的特性模块时所必须的。然后cd my-app进入该项目。
### 2.创建一个带路由的特性模块
  接下来，就需要一个创建一个带路由的特性模块，用AngularCLI生成就行
```txt
ng generate module anyname --routing
```
  这会创建一个anyname的目录，其中有两个文件：AnynameModule和AnynameRoutingModule。AnynameModule扮演的是与客户端紧密相关的所有事物的管理员，AnynameRoutingModule则会处理任何与客户有关的路由，这样就可以在应用不断成长时保持应用的良好结构，并且当复用本模板时，可以保持路由完好。CLI会把AnynameRoutingModule自动导入到AnynameModule，它会在文件的顶部添加一条JavaScript的imports语句，并把AnynameRoutingModule添加到@NgModule的imports数组中。
### 3.向特性模块中添加组件
  要想在浏览器中看出该模块惰性加载成功了，就创建一个组件来在应用加载AnynameModule之后渲染出一些HTML，命令如下：
```txt
ng generate component person/person-list
```
  这就在person目录里面创建一个person-list的文件夹，里面包含了该组件的四个文件，就像路由模块一样，CLI也自动把PersonListComponent导入了AnynameModule。
### 4.再添加一个特性模块
  为了提供另一个可路由到的地点，再创建第二个带路由的特性模块：
```txt
ng generate module orders --routing
```
  这就创建了一个名叫orders的新文件夹，其中包含OrdersModule和OrdersRoutingModule。然后添加组件（简写CLI）：
```txt
ng g c order/order-list
```
### 5.建立UI
  虽然在地址栏输入URL可以跳转，但是这不是人干的（这是猿干的），所以就弄导航栏菜单会更好一点。所以在app.component.html里面，增加一些代码：
```html
<h1> {{title}} </h1
<button routerLink="/anyname">Anyname</button>
<button routerLink="/orders">Orders</button>
<button routerLink="">Home</button>
<router-outlet></router-outlet>
```
  然后输入那ng serve 启动开发服务器，就能看到现在的样子了。 自己建的那两个模块，得让路由知道它们，结构长这样：
![图片](lazy-load-relationship.jpg)
  每个特性模块都是路由器中的一个“门口”，在AppRoutingModule中，我配置了一些路由指向这些特性模块，通过这种方式，路由器就知道了如何跳转到特性模块，然后特性模块就把AppRoutingModule和AnynameRoutingModule或OrdersRoutingModule连接在一起。这些路由模块会告诉路由器该到哪里去加载相应的组件。
#### 5.1 顶层的路由
  在AppRoutingModule中，把routes数组改成这样：
```typescript
const routes: Routes = [ 
{
  path: 'anyname',loadChildren: 'app/anynam.module#AnynameModule',
},
{
  path: 'order',loadChildren: 'app/order/order.module#OrderModule'
},
{
  path:'',redirectTo:'',pathMatch:'full'
}
]
```
  这些imports语句没有变化，前两个路径分别路由到了AnynameModule和OrderModule，注意看惰性模块加载的语法，loadChildren后面紧跟着一个字符串，它指向模块路径，然后是一个#，然后是该模块的类名。
#### 5.2 特性模块的内部
  然后看看anyname.module.ts，如果使用的是CLI，并按照上面的步骤来的，那么下面就没必要做什么更改，特性模块就像是AppRoutingModule和该特性自己的路由模块之间的连接器，AppRoutingModule导入了特性模块AnynameModule，而AnynameModule又导入了AnynameRoutingModule。
**anyname.module.ts**
```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnynameRoutingModule } from './anyname-routing.module';
import { PersonListComponent } from './person-list/customer-list.component';

@NgModule({
  imports: [
    CommonModule,
    AnynameRoutingModule
  ],
  declarations: [PersonListComponent]
})
export class AnynameModule { }
```
  anyname.module.ts文件导入了AnynameRoutingModule和PersonListComponent，所以AnynameModule类可以访问它们。然后AnynameRoutingModule又在imports数组里面，这让AnynameModule可以访问它的路由模块，而PersonListComponent出现在declarations数组里面，这表示PersonListComponent属于AnynameModule。
#### 5.3 配置该特性模块的路由
  接下来的步骤位于 anyname-routing.module.ts 中。首先，在文件的顶部使用 JS 的 import 语句导入该组件。然后添加指向 PersonListComponent 的路由。
```typescript
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonListComponent } from './customer-list/person-list.component';
const routes: Routes = [
  {
    path: '',
    component: PersonListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnynameRoutingModule { }
```
  注意，path 被设置成了空字符串。这是因为 AppRoutingModule 中的路径已经设置为了 anyname，所以 AnynameRoutingModule 中的这个路由定义已经位于 anyname 这个上下文中了。也就是说这个路由模块中的每个路由其实都是子路由。
  然后像刚刚那样把OrderListComponent也导入进来就行啦。
### 6.forRoot() 与 forChild()
  在前面可以看到，CLI会把RoutingModule.forRoot(routes)添加到app-routing.module.ts的imports数组里面。这回让Angular知道，AppRoutingModule是一个路由模块，而forRoot表示这是一个根路由模块。它会配置我传入的所有路由、让我能访问路由器指令并注册RouterService。forRoot只能在AppRoutingModule里面用，只能用一次。
  CLI 还会把 RouterModule.forChild(routes) 添加到各个特性模块中。这种方式下 Angular 就会知道这个路由列表只负责提供额外的路由并且其设计意图是作为特性模块使用。forChild可以在多个模块中使用。
  forRoot() 包含的注入器配置是全局性的，比如对路由器的配置。forChild() 中没有注入器配置，只有像 RouterOutlet 和 RouterLink 这样的指令。
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
## 十二、Angular模块的常见问题
### 12.forRoot()方法是什么？
	静态方法forRoot()是一个约定，可以让开发人员更轻松的配置模块的提供商。
	RouterModule.forRoot()就是一个很好的例子，应用把一个Routes对象传给RouterModule.forRoot(),为的就是使用路由配置全应用级的Router服务，RouterModule.forRoot()返回一个ModuleWithProviders对象，然后把这个结果添加到根模块的AppModule的imports数组中。只能在应用的根模块AppModule中调用并导入.forRoot()的结果，在其它模块中导入它，特别是惰性加载中，是违反设计目标的并会导致运行时错误。
	RouterModule也提供了静态方法forChild，用于配置惰性加载模块的路由。forRoot和forChild都是约定俗称的方法名，它们分别用于在根模块和特性模块中配置服务。
### 13.为什么服务提供商在特性模块中的任何地方都是可见的？
	列在引导模块的@NgModule的providers中的服务提供商具有全应用级作用域，往NgModule的providers中添加服务提供商将导致该服务被发布到整个应用中。当我导入一个模块时，Angular就会把该模块的服务提供商也就是providers列表中的内容加入该应用的根注入器中。这会让该提供商对应用中所有知道该提供商token的类都可见。
	Angular就是如此设计的，通过模块导入来实现可扩展性是Angular模块系统的主要设计目标。把模块的提供商并入应用程序的注入器可以让库模块使用新的服务来强化应用程序来变得更容易。只要添加一次HttpClientModule，那么应用中的每个组件都可以发起http请求了。不过如果我期望模块的服务只对那个特定模块内部声明的组件可见，那么这可能会带来一些讨厌的意外，如果PersonModule提供了PersonService，并且根模块AppModule导入了PersonModule，那么任何知道PersonService类型的类都可能注入该服务，而不仅是在PersonModule中声明的那些类。
### 14.为什么在惰性加载模块中声明的服务提供商只对该模块自身可见？
	和启动时就加载的模块中的提供商不同，惰性加载模块中的提供商是局限于模块的。当Angular路由器惰性加载一个模块时，它创建了一个新的运行环境，那个环境拥有自己的注入器，它是应用注入器的直属子级。路由器把该惰性加载模块的提供商和它导入的模块的提供商添加到这个子注入器中。
	这些提供商不会被拥有相同token的应用级别提供商的变化所影响。当路由器在惰性加载环境中创建组件时，Angular优先使用惰性加载模块中的服务实例，而不是来自应用的根注入器。
### 15.如果两个模块提供了同一个服务会怎么样？
	当同时加载了两个导入的模块，它们都列出了使用同一个token的提供商时，后导入的模块会被用到，这是因为这两个提供商都被添加到了同一个注入器中。当Angular尝试根据token注入服务的时候，就会使用第二个提供商来创建并交付服务的实例。
	每个注入了该服务的类获得的都是由第二个提供商创建的实例，即使是声明在第一个模块中的类，它取得的实例也是来自第二个服务提供商。如果模块A提供了一个使用token“X"的服务，并且导入的模块B也用token”X“提供了一个服务，那么就是模块A的服务会被使用。由AppModule提供的的服务相对于所导入的模块中提供的服务有优先权。
### 16.如何把服务的范围限制到模块中？
	如果一个模块在应用程序启动时就加载，它的@NgModule的provides具有全应用级作用域。它们也可用于整个应用的注入中。导入的提供商很容易被由其它导入模块中的提供商替换掉，虽然设计是这样设计的，但是很有肯能导致一些以外的结果。作为一个通用的规则，应该只导入一次带提供商的的模块，最好在应用的根模块中，那里也是配置、包装和改写这些服务的地方。
	假设模块需要一个定制过的HttpBackend，它为所有的Http请求添加一个特别的请求头，如果应用中其它地方的另一个模块也定制了HttpBackend或仅仅导入了HttpClientModule，他就会改写当前模块的HttpBackend提供商，丢掉了这个特别的请求头，这样服务器就会拒绝来自该模块的请求。要消除这个问题就只能在应用的根模块AppModule中导入了HttpClientModule，如果必须防范这种提供商腐化现象，那就不要依赖于启动时加载模块的providers。只要可能就让模块惰性加载，Angular给了惰性加载模块自己的子注入器。该模块中的提供商只对由该注入器创建的组件树可见。如果有的时候我必须在应用程序启动的时候主动加载该模块，就改成在组件中提供该服务。
	假如有个模块真的需要一个私有的自定义的HttpBackend。那就创建一个顶级组件来扮演该模块中所有组件的根，把这个自定义的HttpBackend提供商添加到这个顶级组件的providers列表里面，而不是该模块的providers。那么，Angular会为每一个组件实例创建一个子注入器，并使用组件自己的providers来配置这个注入器。当该组件的子组件想要一个HttpBackend服务时，Angular会提供一个局部的HttpBackend服务，而不是应用的根注入器创建的那个。子组件将正确发起http请求，而不管其它模块对HttpBackend做了什么。
	确保把模块中的组件都创建成这个顶级组件的子组件。我就可以把这些子组件都嵌在顶级组件的模板中，或者给顶级组件一个<router-outlet>，让它作为路由的宿主，定义子路由，并让路由器把模块中的组件加载进该路由出口中。
### 17.全应用级的提供商应该加到根模块还是根组件?
	都说了是全应用级，当然是加进根模块AppModule了。惰性加载模块及其组件可以注入AppModule中的服务，却不能注入AppComponent中的。
	只有当该服务必须对AppComponent组件树之外的组件不可见时，才能把服务注册进AppComponent的providers中，但是这个方法就比较异类了，所以一般情况下，优先把提供商注册进模块中，而不是组件中。
	ps：
	Angular把所有启动期模块的提供商都注册进了应用的根注入器中，这些服务是由根注入器中的提供商创建的并且在整个应用中都可用，它们具有应用级作用域。某些服务比如Router只有当注册进应用的根注入器时才能正常工作。
	相反，Angular使用AppComponent自己的注入器注册了AppComponent的提供商，AppComponent服务只在该组件及其子组件树中才能使用，它们具有组件级作用域。AppComponent的注入器是根注入器的子级，注入器层次中的下一级。这对于没有路由器的应用来说几乎是整个应用了。但对于那些带路由的应用，路由器操作位于顶层，哪里不存在AppComponent的服务。这意味着惰性加载模块不能使用它们。
### 18.其它的提供商注册到模块中还是组件中？
	通常优先把模块中具体的特性的提供商注册到模块中（@NgModule.providers），而不是组件中（@Component.providers）。当必须把服务实例的范围限制到某个组件及其子组件树时，就把提供商注册到该组件中，指令的提供商也同样照此处理。
	比如如果人物编辑组件需要自己私有的缓存人物服务实例，那就应该把PersonService注册进PersonEditorComponent里面。这样每个新的PersonEditorComponent的实例都会得到自己的缓存服务实例，编辑器的改动只会作用域他自己的服务，而不会影响到应用中其它地方的人物实例。总是在根模块AppModule中注册全应用级服务，而不要在根组件AppComponent里面。
### 19.为什么在共享模块中不能为惰性加载模块提供服务？
####19.1 立即加载的场景
	当立即加载的模块提供了服务时，比如UserService，该服务是在全应用级可用的，如果根模块提供了UserService，并导入了另一个也提供了同一个UserService的模块，Angular就会把它们中的一个注册进应用的根注入器中，并交付这个全应用级的单例服务。这样不会出现问题。
#### 19.2 惰性加载的场景
	现在，有PersonModule的说，它是惰性加载的。当路由器准备惰性加载PersonModule的时候，它会创建一个子注入器，并且把UserService的提供商注册到那个子注入器中。子注入器和根注入器是不同的。当Angular创建一个惰性加载的PersonComponent时，它必须注入一个UserService。这次，它会从惰性加载模块的子注入器中查找UserService的提供商，并用它创建一个UserService的实例，这个UserService实例与Angular在主动加载的组件中注入的那个全应用级单例对象是不一样的。这个场景导致应用每次都创建一个新的服务实例，而不是使用单例的服务。
### 20.为什么惰性加载模块会创建一个子注入器？
	Angular会把@NgModule.providers中的提供商添加到应用的根注入器中，除非该模块是惰性加载的，这种情况下，它会创建一子注入器，并且把该模块的提供商添加到这个子注入器中。这意味这模块的行为将取决于它是在应用启动期间加载的还是后来惰性加载的。
	所以那么是为什么Angular不能像主动加载模块那样把惰性加载模块的提供商也添加到应用程序的根注入器中呢？为啥出现这种不一致呢？
	归根结底，这来自于 Angular 依赖注入系统的一个基本特征： 在注入器还没有被第一次使用之前，可以不断为其添加提供商。 一旦注入器已经创建和开始交付服务，它的提供商列表就被冻结了，不再接受新的提供商。当应用启动时，Angular 会首先使用所有主动加载模块中的提供商来配置根注入器，这发生在它创建第一个组件以及注入任何服务之前。 一旦应用开始工作，应用的根注入器就不再接受新的提供商了。之后，应用逻辑开始惰性加载某个模块。 Angular 必须把这个惰性加载模块中的提供商添加到某个注入器中。 但是它无法将它们添加到应用的根注入器中，因为根注入器已经不再接受新的提供商了。 于是，Angular 在惰性加载模块的上下文中创建了一个新的子注入器。
### 21.如何知道一个模块或者服务是否已经加载过了？
	某些模块及其服务只能被根模块AppModule加载一次。在惰性加载模块中再次导入这个模块会导致错误行为，而且这个错误可能非常难于检测和诊断。
	为了防范这种风险，可以写一个构造函数，它会尝试从应用的根注入器中注入该模块或服务。如果这种注入成功了，那就说明这个类是被第二次加载的，就可以抛出一个错误，或者萃取一些其它措施。
**core.module.ts**
```typescript
constructor （@Optional() @SkipSelf() parentModule: CoreModule） {
  if(parentModule) {
    throw new Error("CoreModule 已经加载过了，只需要在AppModule里面引入即可")
  }
}
```
### 22.什么是入口组件？
	Angular根据其类型不可避免的加载的组件就是入口组件。而通过组件选择器声明式加载的组件则不是入口组件。
	大多数应用组件都是声明式加载的，Angular使用该组件的选择器在模板中定位元素，然后创建变现该组件的HTML，并把它插入DOM中所选元素的内部，它们不是入口组件。而用于引导的根AppComponent则是一个入口组件，虽然它的选择器匹配了index.html中的一个元素，但是index.html并不是组件模板，而且AppComponent选择器也不回在任何组件模板中出现。在路由定义中用到的组件也同样是入口组件。路由定义根据类型来引导组件。路由定义格局类型来引用组件。路由器会忽略路由组件的选择器即使它是有选择器的，并且把该组件动态加载到RouterOutlet中。
### 23.引导组件和入口组件有什么不同？
	引导组件是入口组件的一种，它是被Angular的引导过程加载到DOM中的入口组件，其它入口组件则是被其它方式动态加载的，比如被路由器加载。@NgModule.bootstrap属性告诉编译器这是一个入口组件，同时它应该生成一些代码来用改组加你引导此应用。
	不需要把组件同时列在bootstrap和entrycomponent列表中。
### 24.什么时候应该把组件加载entryComponents里面？
	大多数是不需要把组件添加到entryComponents中。Angular会自动把恰当的组件添加到入口组件中。列在@NgModule.bootstrap中的组件会自动加入。由路由器配置引用到的组件会被自动加入。用这两种机制添加的组件在入口组件中占了绝大多数。
	如果我的应用要用其它手段来根据类型引导或动态加载组件，那就得把它显式添加到entryComponents中。虽然把组件加到这个列表中没什么坏处，但是最好还是只添加真正的入口组件。不要添加那些被其它组件的模板引用过的组件。
### 25.为啥Angular需要入口组件？
	原因在于优化，对于产品化的应用，就想加载尽可能小而快的代码。代码中应该仅仅包括那些实际用到的类。它应该排除那些从未用过的组件，无论该组件是否被声明过。事实上，大多数库中声明和导出的组件都用不到。如果从未引用它们，那么优化器就会从最终的代码中把这些组价砍掉。
	如果Angular编译器为每个声明的组件都生成了代码，那么优化器的作用就没有了。所以，编译器转而采用一种递归策略，它只为我用到的那些组价生成代码。编译器从入口组件开始工作，为它在入口组件的模板中找到的那些组件生成代码，然后又为在这些组件中的模板发现的组件生成代码，以此类推，当这个过程结束时，它就已经为每个入口组件以及从入口组件可以抵达的每个组件生成了代码。如果该组件不是入口组件或者没有在任何模板中发现过，就会被编译器忽略。
### 26.有哪些类型的模块？应该如何使用？
####26.1 SharedModule
	为那些可能会在应用中到处使用的组件、指令和管道创建SharedModule，这种模块应该只包含declarations，并且应该导出几乎所有的declarations里面的声明。SharedModule可以重新导出其它小部件模块，比如CommonModule，FormsModule和提供给我广泛使用的UI控件的那些模块。
	前面说到SharedModule不应该带有providers，它的导入或者重新导出的模块中也不应该有providers。在任何特性模块中，不论是在应用启动时主动加载的模块还是之后惰性加载的模块，都可以随意导入这个SharedModule。
#### 26.2 CoreModule
	为我要在应用启动时加载的那些服务创建一个带providers的CoreModule。也可以CoreModule做成一个没有declarations的纯服务模块
#### 26.3 特性模块
	特性模块就是我围绕特定的应用业务领域创建的模块，比如用户工作流、小工具集等。它们包含指定的特性，并为我的应用提供支持，比如路由、服务、窗口部件等。要对我的应用中可能会有哪些特性模块有个概念，考虑如果要把与特定功能有关的文件放进一个目录下，该目录的内容就可能就是一个名叫XXXModule的特性模块。它将会包含构成某某特定功能的全部组件、路由和模板。
### 27.在NgModule和JavaScript模块之间有什么不同？
	在Angular应用中，NgModule会和JavaScript的模块一起工作。在现在的JavaScript中，每个文件都是模块。在每个文件中，要写一个export的语句将模块的一部分公开。
	Angular模块是一个带有@NgModule装饰器的类，而JavaScript模块则没有。Angular的NgModule有自己的imports和exports来达到类似的目的。我可以导入其它Angular模块，以便在当前模块的组件模板中使用它们导出的类，我也可以导出当前Angular模块中的类，以便其它模块可以导入它们，并用在自己的组件模板中。
### 28.Angular如何查找模板中的组件、指令和管道？什么是模板引用？
	Angular编译器在组件模板内查找其它组件、指令和管道。一旦找到了，那就是一个模板引用。Angular编译器通过在一个模板的HTML中匹配组件或指令的选择器，来查找组件或指令。编译器通过分析模板HTML中的管道语法中是否出现了特定的管道名来查找对应的管道。Angular只查询两种组件、指令或管道：那些在当前模块中声明过的以及那些被当前模块导入的模块所导出的。
### 29.什么是Angular编译器？
	Angular编译器会把我所编写的应用代码转换成高性能的JavaScript代码，在编译过程中，@NgModule的元数据就扮演了很重要的角色。自己写的代码是无法直接执行的。比如组件，组件有一个模板，其中包含了自定义元素、属性型指令、Angular绑定声明和一些不属于原生HTML的语法啥的。
	Angular编译器读取模板的HTML，把它和相应的组件类代码组合在一起，并产出组件工厂。组件工厂为创建纯粹的、100%JavaScript的表示形式，它包含了@Component元数据中的描述的一切：HTML、绑定指令、附属的样式等。由于指令和管道都出现在组件模板中，Angular编译器也同样会把它们组合到编译成的组件代码中，@NgModule元数据告诉Angular编译器要为当前模块编译那些组件，以及如何把当前模块和其它模块连接起来。
### 30.凑个整数....






























