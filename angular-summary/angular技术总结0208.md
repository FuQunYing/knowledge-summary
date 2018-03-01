## Day03

####  七、指令（接02/08）
```txt
  angular的模板是动态的，动态的东西就要有指令来操控，angular渲染模板的时候，就是根据指令的操作对DOM进行转换。
  组件就是一个指令，@Component的装饰器实际上也是@Directive的装饰器，就是扩展了面向模板的特性。因为在angular中组件处于中心地位，所以在架构里面，把组件从指令里面独立了出来。
  angular所支持的常见的指令：
 	1. *ngFor，循环指令，生成N个标签
		eg : <any *ngFor="let tmp of COLL;let i=index"></any>
	2. *ngIf，选择指令，根据表达式的值的真假决定是否将元素挂载到DOM树
		eg ： <any *ngIf="expression"></any>
	3. [ngSwitch]，多重选择指令，跟if(){} else if(){} else{} 差不多
		eg : <div [ngSwitch]="">
				<any *ngSwitchCase=""></any>
				<any *ngSwitchDefault></any>
        	 </div>
	    一个坑：同一个元素标签上不能同时放两个结构型指令（上面这三个加*的，对DOM
	    	   修改删除的就是结构型指令），如果需要同时使用，可以在外层包裹
	    	   <ng-container>标签，把一个指令放在这个标签上面。
	4.事件绑定，给事件名加个小括号
		eg ： <any (eventname)="fn()"></any>
	5.属性绑定，动态绑定样式类或者样式
		ngClass ：<any [ngClass]="{className: true/false}">
		ngStyle ：<any [ngStyle]="{styleName: 放个变量在这}">
	6.插值表达式，就是双花括号，把表达式里面的值显示在页面上
		eg ： <any>{{表达式}}</any>
	7.双向数据绑定，从页面获取数据就靠它了，但是不能直接用，ngModel属于表单模块，使用之前在app.module.ts中要先引入FormsModule，放到imports数组中，才能使用。
		eg ： <input [(ngModel)]="变量">
			  显示：<any>{{变量}}</any>
		如果需要监听用户的操作，可以在标签上绑定(ngModelChange) = "fn()"
		
		ps：双向数据绑定原理
			大佬的博客：（自己还没完全整明白）
			http://blog.csdn.net/u011256637/article/details/71056731
			注：脏值检测就是不关心如何以及何时改变的数据，只关心在特定的检查阶段数据
			    是否改变的监听技术，可以实现批量处理完数据之后，再去统一更新视图。
```
#### 八、服务
```txt
	  服务可以包括很多东西，比如值、函数、或者应用里面所需要的特性。总而言之就是对应用中逻辑的封装。组件类本身要保持精简，它不直接往控制台输出日志，不从服务器获得数据，也不进行验证和输入，把这些事情全部委托给服务。
	  组件的任务就是提供用户体验，介于由模板渲染的视图和应用逻辑之间，一个良好的组件就只为数据绑定提供属性和方法，别的都委托给服务...好像没有完全遵循这个原则，大部分的时候都是只把网络请求封装了，别的东西依然写在了组件里。
	  比如封装一个打印服务：
	  	eg ：log.service.ts
	  		import {Injectable} from "@angular/core";
	  		@Injectable()
	  		export class LogService {
  				isDev : Boolean = false;
  				constructor() {}
  				print(msg : any){
  					if(this.isDev) console.log(msg);
  					//如果是生产环境就不打印，开发环境就打印
				}
			}
			
		使用该服务：
			import {LogService}from './log.service';
			@Component({
  				providers: [LogService]
  				//指定提供商
			})
			constructor (private log: LogService){}//实例化才能用
			fn(){
  				this.log.print(XXXX);//随便在该组件需要的地方调用就好啦
			}
			
	  更多的时候，在一个应用里面，是把所需要的网络请求封装在服务里面
	  	eg ： http.service.ts
	  		import { Injectable } from '@angular/core';
			import { Http, Response } from '@angular/http';
			@Injectable()
			export class HttpService {
    			constructor(private http: Http) { }
    			sendRequest(myUrl:string){//发起网络请求
        		return this.http.get(myUrl)
        				.map((response: Response) => response.json());
    			}
			}
			
		使用该服务：
			步骤还是一样的：引入-->实例化-->调用
			调用方法：
				getData(){
        			this.httpService.sendRequest("./test.json")
        				.subscribe((data:any)=>{
            				console.log(data);
        				})
    			}
    		重点就是这个subscribe了，目前异步的的请求方式有：
    			AJAX、事件绑定、promise、
    			rxjs（observable/subscribe，消息订阅机制？？）
```
#### 九、依赖注入
```txt
	
	”依赖注入“是提供类的新实例的一种方式，还负责处理好类所需的全部依赖，大多数依赖都是服务，Angular使用依赖注入来提供新组件以及组件所需的服务。
	Angular通过查看构造函数的参数类型得知组件需要哪些服务，
		eg ： constructor (private http : HttpService){}
				//该组件的构造函数需要一个HttpService的服务
	当Angular创建组件时，会首先为组件所需的服务请求一个injector-注入器
	注入器维护一个服务的实例的容器，存放着以前创建的实例，如果所请求的服务实例不在容器里面，注入器就创建一个服务实例然后添加到这个容器中，再把这个服务返回给Angular。当所有的请求服务都被解析完并返回时，Angular就以这些服务为参数去调用组件的构造函数，这就是整个依赖注入的过程。
	那么，在上面的服务调用里面，把需要用的服务放在了providers里面了，就是用注入器给HttpService注册了一个提供商，就是把HttpService给添加到注入器里面去了。
	
	服务可以注入到一个组件，也可以注入到一个模块中。
	如果服务通过不同组件的providers，注入到不同的组件，那么服务是被创建了很多次，每一个都是一个单独的实例，都没有关系。
	如果服务注入到了一个组件中，那么这个组件由有其它的子组件构成，那么在子组件中如果引入服务类（不会通过providers去指定），那么所实例化的服务类对象是同一个实例对象。
	如果服务是注入到了一个模块中，那么该模块任何一个组件所import和实例化得到的服务都是同一个实例
	如果想在全局使用这个服务，就在根模块的providers里面注入就好啦
	
	注意：
		· 依赖注入是渗透在整个Angular框架中的，被导出使用。
		· 注入器（Injector）是这个机制的核心（注入器要负责维护一个存放它创建过的容器，能使用提供商创建一个新的服务实例）
		· 提供商是用来创建服务的地方，将依赖注入到当前的对象中
		· 提供商要注册到注入器
```
###### 																			——架构END