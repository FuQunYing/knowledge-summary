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
  


























