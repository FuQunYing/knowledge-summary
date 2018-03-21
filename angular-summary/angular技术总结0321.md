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
































