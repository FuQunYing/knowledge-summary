# Day39 核心知识-路由与导航
## 一、概览
 浏览器具有熟悉的导航模式：
 - 在地址栏输入URL，浏览器就会导航到响应的页面
 - 在页面中点击链接，浏览器就会导航到一个新的页面
 - 点击浏览器的前进和后退按钮，浏览器就会在我的浏览历史中向前或向后导航
  Angular的Router借鉴了这个模型，他把浏览器中的URL看做一个操作指南，据此导航到一个客户端生成的视图，并可以把参数传给支撑视图的相应组件，帮它决定具体该展现哪些内容。我可以为页面中的链接绑定一个路由，这样，当用户点击链接时，就会导航到应用中相应的视图。当用户点击按钮、从下拉框中选取，或响应来自任何地方的事件时，我也可以在代码控制下进行导航。路由器还在浏览器的历史日志中记录下这些活动，这样浏览器的前进和后退按钮也能照常工作。
## 二、基础知识
### 1.<base href> 元素
  大多数带路由的应用都要在index.html的<head>标签下先添加一个<base>元素，来告诉路由器该如何合成导航用的URL。如果app文件夹是该应用的根目录，那就把href的值设置为这样：
```html
<base href='/'>
```
### 2.从路由库中导入
  Angular的路由器是一个可选的服务，它用来呈现指定的URL所对应的视图。它并不是Angular核心库的一部分，而是在它自己的@angular/router包中，像其它Angular包一样，我可以从它导入所需的一切：
```typescript
import {RouterModule,Routes} from '@angular/router'
```
### 3.配置
  ，每个带路由的Angular应用都有一个Router服务的单例对象。当浏览器的URL变化时，路由器会查找对应的Route，并据此决定该显示哪个组件。
  路由器需要先配置才会有路由信息。下面的例子创建了四个路由定义，并用RouterModule.forRoot方法来配置路由器，并把它的返回值添加到AppModule的imports数组中：
```typescript
const appRoutes:Routes=[
    {path: 'crisis-center', component: CrisisListComponent},
    {path: 'person/:id', component: PersonDetailCompoennt},
    {path: 'persons': component:PersonListComponent,data: {title:'Persons List'}},
    {path: '',redirectTo:'/persons',pathMatchL'full'},
    {path: '**', component: PageNotFoundComponet}
];
@NgModule({
    imports:[
        RouterModule.forRoot(
          appRoutes,
          {enableTracing:true}// 仅调试用
        )
        //其它引入接着往后放就行
    ],
    ...
})
export class AppModule{}
```
  这里的路由数组appRoutes描述如何进行导航。把它传给RouterModule.forRoot方法并传给本模块的imports数组就可以配置路由器。每个Route都会把一个URL的path映射到一个组件。注意，path不能以 / 开头。路由器会为加息和构建最终的URL，这样当我的应用在多个视图之间导航时，可以任意使用相对路径和绝对路径。
  第二个路由中的:id是一个路由参数的token，比如/person/01这个URL中，01就是id参数的值，此URL对应的PersonDetailComponent组件将据此查找和展现id为42的人物。第三个路由中的data属性用来存放每个具体路由有关的任意信息。该数据可以被任何一个激活路由与访问，并能用来保存诸如页标题、面包屑以及其它静态只读数据。第四个个路由中的空路径表示应用的默认路径，当URL为空时就会访问那里，因此它通常会作为起点。这个默认路由会重定向到URL/persons，并显示PersonsListComponent。最后一个路由中的\*\*路径是一个通配符。当所请求的URL不匹配前面定义的路由表中的任何路径时，路由器就会选择此路由。这个特性可以用于显示404-not found 页，或自动重定向到其它路由。
  这些路由的定义顺序是刻意如此设计的。路由器使用先匹配者优先的策略来匹配路由，所以具体路由应该放在通用路由的前面。在上面的配置中，带静态路径的路由被放在了前面，后面是空路径路由，因此它会作为默认路由，而通配符路由被放在最后面，这是因为它能匹配上每一个URL，因此应该只有在前面找不到其它能匹配的路由时才匹配它。
  如果想要看到在导航的生命周期中发生过哪些事件，可以使用路由器默认配置中的enableTracing选项。它会把每个导航生命周期中的事件输出到浏览器的控制台，这应该只用于调试。我只需要把enableTracing:true选项作为第二个参数传给RouterModule.forRoot()方法就可以了。
### 4.路由出口
  有了这份配置，当本应用在浏览器中的URL变为/persons时，路由器就会匹配到path为persons的Route，并在宿主视图中的RouterOutlet之后显示PersonListComponent组件：
```html
<router-outlet></router-outlet>
<!--有这个容器，来放置组件-->
```
### 5.路由器链接
  现在我已经有了配置好的一些路由，还找到了渲染的地方，那应该如何导航过去。猿类直接从地址栏输入URL就行，但是大多数情况下，导航是某些用户操作的结果，比如点击了一个A标签：
```typescript
template:`
	<nav>
		<a routerLink="/crisis-center" routerLinkActive="active">Crisis Center</a>
		<a routerLink="/persons" routerLinkActive="active">Perons</a>
	</nav>
	<router-outlet></router-outlet>
`
```
  a标签上的RouterLink指令让路由器得以控制这个a元素，这里的导航路径是固定的，因此可以把一个字符串赋给routerLink。如果需要更加动态的导航路径，那就把它绑定到一个返回链接参数数组的模板表达式。路由器会把这个数组解析成完整的URL。每个a标签上的RouterLinkActivate指令可以帮用户在外观上区分出当前选中的 活动 路由，当与它关联的RouterLink被激活时，路由器会把css类active添加到这个元素上。我可以把该指令添加到a元素或它的父元素上。
### 6.路由器状态
  在导航时每个生命周期成功完成时，路由器会构建出一个ActivatedRoute组成的树，它表示路由器的当前状态。我可以在应用中的任何地方用Router服务及其routesState属性来访问当前的RouterState值。
  RouterState中的每个ActivateRoute都提供了从任意激活路由开始向上或者向下遍历路由树的一种方式，以获得关于父、子、兄弟路由的信息。
### 7.激活的路由
  该路由的路径和参数可以通过注入进来的一个名叫ActivatedRoute的路由服务来获取。它有一大堆信息，包括：
属性 | 说明
-- | --
url | 路由路径的Observable对象，是一个由路由路径中的各个部分组成的字符串数组
data | 一个Observable，其中包含提供给路由的data对象，也包含由解析守卫解析而来的值
paramMap | 一个Observable，其中包含一个由当前路由的必要参数和可选参数组成的map对象。用这个map可以获取来自同名参数的单一值或多重值
queryParamMap | 一个Observable，其中包含一个对所有路由都有效的查询参数组成的map对象，用这个map可以获取来自查询参数的单一值或多重值
fragment | 一个适用于所有路由的URL的fragment的Observable
outlet | 要把该路由渲染到的RouterOutlet的名字，对于无名路由，它的路由名是primary，而不是空串
routeConfig | 用于该路由的路由配置信息，其中包含原始路径
parent | 当该路由是一个子路由时，表示该路由的父级ActivatedRoute
firstChild | 包含该路由的子路由列表中的第一个ActivatedRoute
children | 包含当前路由下所有已激活的子路由
  有两个旧式属性仍然是有效的，但它们不如其替代品那样强力，建议不再使用，将来也有可能被废弃：
  - params -- 一个Observable对象，其中包含当前路由的必要参数和可选参数，改用paramMap
  - queryParams --一个Observable对象，其中包含对所有路由都有效的查询参数，改用queryParamMap
### 8.路由事件
  在每次导航中，Router都会通过Router.events属性发布一些导航事件。这些事件的范围涵盖了从开始导航到结束导航之间的很多时间点。下表中列出了全部导航事件：
路由器事件 | 说明
NavigationStart | 本事件会在导航开始时触发
RoutesRecognized | 本事件会在路由器解析完URL，并识别出了响应的路由时触发
RouteConfigLoadStart | 本事件会在Router对一个路由配置进行惰性加载之前触发
RouteConfigLoadEnd | 本事件会在路由被惰性加载之后触发
NavigationEnd | 本事件会在导航成功结束之后触发
NavigationCancel | 本事件会在导航被取消之后触发，这可能是因为在导航期间某个路由守卫返回了false
NavigationError | 这个事件会在导航由于意料之外的错误而失败时触发
  当打开了enableTracing选项时，这些事件也同时会记录到控制台中，由于这些事件是以Observable的形式提供的，所以我可以对自己感兴趣的事件进行filter()，并subscribe()它们，以便根据导航过程中的事假顺序做出决策。
### 9.总结一下
  该应用有一个配置过的路由器，外壳组件中有一个RouterOutlet，它能显示路由器所生成的视图。他还有一些RouterLink，用户可以点击，来通过路由器进行导航。下面是一些路由器中的关键词汇及其含义
路由器部件 | 含义
Router | 为激活的URL显示应用组件，管理从一个组件到另一个组件的导航
RouterModule | 一个独立的Angular模块，用于提供所需的服务提供商，以及用来在应用视图之间进行导航的指令
Routes（路由数组） | 定义了一个路由数组，每一个都会把一个URL路由映射到一个组件
Route（路由） | 定义路由器该如何根据URL模式来导航到组件。大多数路由都是由路径和组件类构成
RouterOutlet（路由出口） | 该指令用来标记出路由器应该在哪里显示视图
RouterLink（路由链接） | 这个指令把可点击的HTML元素绑定到某个路由，点击带有routerLink指令（绑定到字符串或链接参数数组）的元素时就会触发一次导航
RouterLinkActive（活动路由链接） | 当 HTML 元素上或元素内的routerLink变为激活或非激活状态时，该指令为这个 HTML 元素添加或移除 CSS 类。
ActivatedRoute（激活的路由） | 为每个路由组件提供提供的一个服务，它包含特定于路由的信息，比如路由参数、静态数据、解析数据、全局查询参数和全局碎片（fragment）。
RouterState（路由器状态） | 路由器的当前状态包含了一棵由程序中激活的路由构成的树。它包含一些用于遍历路由树的快捷方法。
链接参数数组  | 这个数组会被路由器解释成一个路由操作指南。你可以把一个RouterLink绑定到该数组，或者把它作为参数传给Router.navigate方法。
路由组件  | 一个带有RouterOutlet的 Angular 组件，它根据路由器的导航来显示相应的视图。

























