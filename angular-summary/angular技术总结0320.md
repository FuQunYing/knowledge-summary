#Day24 - 引导启动
## 启动过程
  NgModule用于描述应用的各个部分如何组织在一起，每个应用又至少是一个Angular模块，根模块就是我用来启动此应用的模块，通常就是叫AppModule的那个。
  一般情况下，用AngularCLI生成的一个应用，初始默认的AppModule长这样：
```typescript
import {BrpwserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angluar/http';
import {AppComponent} from './app.component';
@NgModule({
  declarations:[AppComponent],// 组件都要放在这儿声明，不然就会报错不能用
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],//引入的模块要放这儿
  providers: [],//为服务提供注册商，如果服务是在这儿注入的话，那就全局都能用
  bootstrap: [AppComponent]//启动AppComponent
})
export class AppModule {}
```
  在import 语句之后，是一个带有@NgModule的装饰器的类。
  @NgModule装饰器表明AppModule是一个NgModule类，@NgModule获取一个元数据对象，它会告诉Angular如何编译和启动本应用。
  - declarations，就是该应用现在所有的组件。
  - imports，导入BrowserModule以获得浏览器特有的服务，比如DOM渲染，无害化处理和位置。
  - providers，各种服务的提供商
  - bootstrap， 根组件，Angular创建它并插入index.html宿主页面。
  ps：默认的CLI应用只有一个组件AppComponent，所以它会同时出现在declarations和bootstrap里面。
### 1.declarations数组
  该模块的declarations数组告诉Angular哪些组件属于该模块，当我创建更多的组件的时候，也要先在declarations数组里面进行声明。每个组件都应该且只能声明在一个NgModule类中，如果我未声明这个组件就用，Angular就报错。
  declarations数组只能接受可声明的对象，可声明对象包括组件、指令和管道。一个模块的所有可声明对象都必须放在declarations数组里面，可声明对象必须只能属于一个模块，如果同一个类被声明在了多个模块里面，编译器就报错。这些可声明的类在当前模块中是可见的，但是对其它模块中的组件是不可见的，除非把它们从当前模块导出，并让对方模块导入本模块。
  可以添加到declarations数组中的：
```typescript
declarations:[
  MyComponent,
  MyPipe,
  MyDirective
]
```
  每个可声明对象都只属于一个模块，所以只能把它声明在一个@NgModule中，当我需要在其它模块中使用的时候，就要在那里导入包含这个可声明对象的模块。只有@NgModule过的才能出现在imports数组里面。
#### 1.1 通过@NgModule使用指令
  使用declarations数组声明指令，在模块中使用指令，组件或管道的步骤如下：
  - 首先得先从编写文件中导出
  - 然后导入到适当的模块
  - 在@NgModule中的declarations声明
  比如，我先写了一个指令：
```typescript
import {Directive} from '@angular/core';
@Directive({selector: '[appItem]'})
export class ItemDirective{ //向外导出，不然别的地方没法引入
  //方法处理什么的
  constructor () {}
}
```
  然后就要在app.module里面导入
```typescript
import {ItemDirective0} from './item.directive';
```
  然后在declarations里面声明：
```typescript
declarations:[
  AppComponent.
  ItemDirective
]
```
  现在就可以在组件里面使用ItemDirective了，现在使用的是AppModule，但是在特性模块中也能用。
  ps：组件、指令和管道都只能属于一个模块，在应用里面也只需要声明一次，如果别的地方要用，还可以通过导入必要的模块来使用它们。
### 2.imports数组
  模块的imports数组只会出现在@NgModule元数据对象中，它告诉Angular该模块想要正常工作还需要哪些模块。列表中的模块导出了本模块中的各个组件模板中所引用的各个组件、指令或管道，在当前例子中，当前组件是AppComponent，它引用了导出自BrowserModule，FormsModule或HttpModule的组件、指令或者管道，总之，组件的模板中可以引用在当前模块中声明的或从其它模块中导入的组件、指令、管道。
### 3.providers数组
  providers数组中列出了该应用所需的服务，当直接把服务列在这里时，它们就是全应用范围的，当使用特性模块和惰性加载时，它们就只能在当前范围被使用。
### 4.bootstrap数组
  应用是通过引导根模块AppModule来启动的，根模块还引用了entryComponent，此外，引导过程还会创建bootstrap数组中列出的组件，并把它们逐个插入到浏览器的DOM中。每个被引导的组件都是它自己的组件树的根，插入一个被引导的组件通常触发一系列组件的创建并形成组件树，肃然也可以在宿主页面放多个组件，但是大多数应用只有一个组件树，并且只从一个根组件开始引导。就是AppComponent啦，放在bootstrap数组里面。



















