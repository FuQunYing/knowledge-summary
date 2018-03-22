# Day25
##六、特性模块
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


























