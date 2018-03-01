#Day01
##一、整体架构

![overview2.png](file:///C:\Users\Edianzu\AppData\Local\Temp\msohtmlclip1\01\clip_image002.gif)

**图一 - angular全景图-非常非常重要的图**

### 1.写一个Angular 应用：
   1）用 Angular 扩展语法编写 HTML 模板（angular指令、管道、插值表达式等），
   2）用组件类管理这些模板（通过组件来指定模板显示），
   3）用服务添加应用逻辑（将应用中需要经常用到的逻辑封装在服务中，方便服用），
   4）用模块打包发布组件与服务（组件、服务需要在一个模块中去创建去声明）。
全景图可以看到，在angular应用中，以组件为单位，在组件中管理HTML模板，二者通过元数据进行连接（@Component里面的一些如templateUrl，styleUrls，selector）。通过属性绑定，组件可以把数据动态绑定在模板视图上，通过事件绑定，可以把视图上用户输入的数据传给组件做处理。指令可以控制HTML模板，组件引入服务，来处理逻辑问题。
   ps：DI Error 依赖注入错误，服务没有被注入
2.angular的八大核心概念（学习顺序）
模块、组件、模板、元数据、数据绑定、指令、服务、依赖注入。
##二、模块
###1.根模块和特性模块
首先每个angular应用至少有一个根模块（AppModule），在比较小的项目中，有这一个模块就够了。但是在大项目中，页面非常多，就有很多特性模块了，特性模块就是一个内聚代码块，专注于某个应用领域、工作流或者功能让相近页面相近的功能，比如钩哒里面的LayoutModule、RoutesModule、ServiceModule，看名字就知道这个模块里面大概是干嘛的。
###2.@NgModule
在模块里面（不管是根模块还是特性模块）都有一个@NgModule的装饰器的类，NgModule是一个装饰器函数，它接收一个用来描述模块属性的元数据对象，最重要的属性有：
a. declarations，所有的视图类都在这儿声明，不声明就用肯定报错没跑了，组件、指令、管道都属于视图类。
b. exports，declarations的子集，可用于其它模块的组件模板。
c. imports，引入本模块所需要的其它模块。
d. providers，服务的提供商，服务不放在这里面没法用，放在根模块的providers里面就全局都能用。
e. bootstrap，不是那个样式库的boot，它是在根模块里面指定要启动哪一个主视图，里面放的通常都是AppComponent。
eg：一个简单的根模块：
```typescript
import {NgModule} from"@angular/core"
import {BrowserModule} from"@angular/platform-browser"
import {AppComponent} from"......"
@NgModule({
   imports: [BrowserModule],
   providers:[Logger],
   declarations:[AppComponent],
   exports: [AppComponent],
   // 其实根模块不需要导出任何东西，别的模块又不需要导入根模块，但是特性模块记得有需要的就要导出了，不然别的地方用不了
   bootstrap:[AppComponent]

})
```
ps：引导根模块来启动应用的就是main.ts，里面有一句
```typescript
platformBrowserDynamic().bootstarpModule(AppModule)
```
所以，启动开发服务器的时候，找到了main.ts，根据main找到了AppModule，根据AppModule里面bootstrap的指定，启动那个组件，就看到页面啦。