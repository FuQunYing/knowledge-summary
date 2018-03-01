#Day02
###3.NgModules 和 JavaScript模块（接0206）
  NgModule就是一个带有@NgModule的装饰器的类，是Angular的一个基础特性。
  JavaScript的模块系统，就是用来管理一组JS对象，和Angular的模块系统没啥关系，JS里面每一个文件都可以看作是一个模块，文件里面定义的对象属于这个模块，最后通过export关键字，可以向外暴露这些对象，可以使别的模块去引用它（import引入就能用啦）
  两个模块系统互补，写程序的时候都要用到。
###4.Angular模块库
  新建一个angular应用的时候，node-modules里面有很多的包，@angular开头的就是Angular的模块库，比如 在某个文件中 import {Component} from "@angular/core"，意思就是从@angular/core的库中，导入Component的装饰器；或者 import {BrowserModule} from "@angular/platform-browser"，就是从@angular/platform-browser库里面导入一个BrowserModule的Angular模块
  ps：某个应用模块需要用到BrowserModule的时候，不仅要引入，也要把它加入@NgModule元数据的imports数组里面去。imports ： [BrowserModule]，这种情况下，Angular和JS的模块系统就一起使用啦。
## 三、组件
  组件就是一个带有特定功能的可以被反复使用的视图。
  Angular是以模块为基本单位（Vue好像是以组件为基本单位的吧），模块是由各种各样的组件构成的。创建过的每一个组件，在使用之前，都要去对应的模块中去声明，声明之后，只允许在该模块内使用，在根模块里面声明的话，就哪儿都能用了。
  在类里面，就是导出那个，定义组件的应用逻辑，为视图提供支持，让视图不仅能看还能用。组件通过一些属性和方法组成的API和视图进行交互（就是全景图里面的属性绑定和事件绑定啦）。
eg:一个简单的组件实例代码
```typescript
	export class NameComponent implements OnInit {
		//导出一个类
		arrs: Arr[];
		//其实随便定义一个什么就行，用来接受从服务哪里获取到的值
		selectedArr: Arr;
		//随便定义的，接受事件被调用时传入的值
		constructor (private service: ArrService) {}
		//在构造函数里面实例化一个服务，这个服务是在某个地方写好，引入并注入过的啦，
		//ps：angular中的服务是单例模式，在这个应用程序中，这个对象只保留一个实例。
		ngOninit() {
		//生命周期函数，ngOnInit表示组件在创建后立刻就调用，别的钩子就见到的时候再说。
			this.arrs = this.service.getArrs();
			//service后面就是定义好的方法啦
		}
		selectedArrs(arr: Arr) {this.selectedArr = arr} 
		//这是一个事件，调用时就可以拿到传入的值并赋值给selectedArr
	}
```
##四、模板
  组件建成的时候，自带了模板，在这里面定义组件的视图。模板是以HTML的形式存在，告诉angular如何渲染组件，但是也不完全是标准的HTML。
	比如：
```html
<ul>
<li *ngFor="let arr of arrs" (click)="selectedArrs(arr)" >{{arr}}</li>
<---*ngFor 循环指令，可以生成和arrs的length一样多的li，绑定单击事件就是(click)，绑定别的事件也要加()->
</ul>
<app-detail *ngIf="selectedArr" [arr]="selectedArr"></app-detail>
<--app-detail，是别的组件的名字，当做普通的HTML标签使用；*ngIf，根据等号后面的值的真假来决定当前的元素要不要挂载到DOM树上；[]是属性绑定的时候用的，加入等号后面的值是不确定的，就需要用属性绑定-->
```
##五、元数据
  简单来说，元数据就是@Component里面的那些属性，单独看某个Component的时候，就只是被导出了一个类，angular并不知道，通过元数据里面的属性，告诉angular这是个组件，告诉angular去哪儿获取我给组件指定的各种构建模块，什么HTML模板啦、css啦..
```txt
	selector：选择器，要用当前组件的时候，把这个名字当做普通的HTML标签
	templateUrl：模板的相对地址
	template：直接写HTML在这里，不用引入html文件
	styleUrls：一个数组，放css的地址，可以放多个
	providers：服务的依赖注入提供商数组，服务要想使用，先引入，然后指定提供商，然后实例化，才能使用。
```
##六、数据绑定
  在传统模式下，数据变化或者视图更改都是直接操作页面DOM元素，angular支持数据绑定，通过数据来控制页面视图。
比如：
```html
	<li>{{arr.xxx}}</li>
	//{{arr.xxx}}插值表达式 在<li>标签中显示组件的arr.xxx属性的值。
	<app-hero-detail [arr]="selectedArr"></app-hero-detail>
	//[arr]属性绑定 把父组件NameComponent的selectedArr的值传到子组件DetailComponent的arr属性中。
	<li (click)="selectedArr(arr)"></li>
	//(click) 事件绑定 在用户点击li时调用组件的selectedArr方法。
除了上面三种，还有第四种数据绑定：
	<input [(ngModel)]="arr.xxx">
	//[(ngModel)]双向数据绑定 数据属性的值通过属性绑定到视图到输入框，用户修改以后通过事件绑定把新值流回组件，并更新属性的值，这个绑定可以说是非常重要了。
```
	ps：双向数据绑定的原理
		TODO暂时没有搞明白脏数据检查机制，网上的解释都是angularJS的，不准，待定。
七、指令TODO
八、服务TODO
九、依赖注入TODO
