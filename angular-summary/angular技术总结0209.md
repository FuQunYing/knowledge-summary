# Day04
## 核心知识——模板与数据绑定
## 一、显示数据

  在Angular中最典型的数据显示方式，就是把HTML模板中的控件绑定到Angular组件的属性中，以创建一个列表组件为例，我要显示一些人物的名字，根据条件决定在列表下方是否显示一条消息，最终要变成这个样子：
```txt
  人物列表
  我最喜欢的是：许嵩
  这些人是：
  	· 许嵩
  	· 山田凉介
  	· 夏洛克
  	· 夏目
  哎呀，还有好多呢....
```
- 使用插值表达式显示组件属性
  - 要显示组件的属性，就直接通过插值表达式（interpolation）来绑定属性名，直接把属性名放在双花括号里面，然后放在模板里面就好啦。
```typescript
  app.component.ts //演示练习这些小demo，放在app.component里面就好啦
	import {Component} from "@angular/core" 
	@Component({
		//app-root作为标签使用，当通过main.ts中的AppComponent类启动时，Angular在index.html找到<app-root>的元素，然后去实例化一个AppComponent，渲染到<app-root>的标签中
  		selector:'app-root',
  		template:` 
  			<p>{{title}}</p>
  			<p>我最喜欢的是：{{favorite}}</p>
  		`
  		//Angular自动从组件中提取title和favorite属性的值，并且把这些值插入浏览器中，当这些属性值发生变化时，Angular就会自动刷新显示。
	})
	export class AppComponent {
  		title : '人物列表',
  		favorite : '许嵩'
	}
```
- 选择内联模板或者模板文件
  - template用来定义内联模板，直接把元素写在后面就行，或者把模板放在单独的HTML文件里面，再通过templateUrl的属性，指定这个HTML文件的位置。
  - 上面的demo里面选择内联是因为代码很少，如果模板代码多的话，放在模板文件里面会更好有点，但是两种方法，在绑定数据上是完全一样的。
- 构造函数和变量初始化
  - demo里面使用变量赋值的方式初始化组件，或者，可以使用构造函数来声明和初始化属性
```typescript
  	export class XXXComponent{
  		title: string;
  		favorite: string; 
  		constructor() {
  			this.title = '人物列表';
  			this.favorite = '许嵩';
		}
	}
```
- 使用ngFor显示数组属性
  - 要显示人物的列表，可以先向组件中添加一个数组，里面放着每个人物的名字，然后把favorite改成数组的第一个名字。
```typescript
	export class AppComponent{//定义数据
  		title = '人物列表';
  		lists = ['许嵩'，'山田凉介','夏洛克','夏目'];
  		favorite = this.lists[0];
	}
	//然后在模板里面
	template:`
		<p>{[title]}</p>
		<p>我最喜欢的是：{{favorite}}</p>
		<p>这些人是：</p>
		<ul>
			<li *ngFor="let tmp of list">{{tmp}}</li>
		</ul>
	`
	ngFor循环的时候，拿出list中的每个值，放入<li>标签内，生成多个li标签。ngFor不仅能循环数组，对象也可以，在插值表达式里面用取对象值的方法也可以拿到想要的数据。
```
- 为数据创建一个类
  - demo里面是直接把数据定义在了组件内部，使用到的是一个普通的字符串数组的绑定，此外还有对于一个对象数组的绑定，要将此绑定转换成使用对象，需要把人物名字的数组转换成一个List的对象数组。
```txt
  首先需要创建一个List的类
  eg： List.ts
  		export class List{
  			constructor(
  				public id: number,
  				public name: string
  			){}
		}
  定义并导出这个类，里面有一个构造函数和id、name两个属性
  public id：number（这是ts的简写形式，用构造函数的参数直接定义属性） 做了哪些事？
  	· 声明了一个构造函数参数及其类型
  	· 声明了一个同名的公共属性
  	· 当new一个该类的实例时，把该属性初始化为相应的参数值
```
- 使用一个类
  - 导入List类之后，组件的lists属性就可以返回一个类型化过的lists数组了。
```typescript
	lists = [
  		new List(1,'许嵩'),
  		new List(2,'山田凉介'),
  		new List(3,'夏洛克'),
  		new List(4,'夏目')
	]
	favorite = this.lists[0];
	//按照上面这样创建这个数组，现在模板里面的{{tmp}}一下子把id和name都显示出来了，如果只要显示name：
	template: `
  		<p>{{title}}</p>
  		<p>我最喜欢的是: {{lists.name}}</p>
        <p>这些人是:</p>
        <ul>
          <li *ngFor="let tmp of lists">
            {{ tmp.name }}
          </li>
        </ul>
`
```
```txt
ps回忆（恰好想起来，和上面的没有关系）:
	JS面向对象，当用new创建一个新的对象的时候，发生了什么？？
	new的时候，做了四件事：
		1.创建了一个新的对象
		2.自动让新的子对象继承构造函数的原型对象！！important
		3.调用构造函数，向新的空的对象中强行添加新成员
		4.将新的变量地址返回给变量保存
```
- 通过ngIf进行条件显示
  - 显示数据的最后一步，根据需求是否显示某个视图
```txt
比如说，如果我列表的长度大于3了，就在视图最后显示一句话
	<li *ngIf="lists.length>3">哎呀，还有好多呢...</li>
	*ngIf 就是根据表达式的真假来显示或者移除某个元素
```
- 显示数据——小结
  - 带有双花括号的插值表达式 (interpolation) 来显示一个组件属性
  - 用 ngFor 循环显示出数组的值或者对象数组
  - 用一个 TypeScript 类来为我们的组件描述模型数据并显示模型的属性
  - 用 ngIf 根据一个布尔表达式有条件地显示一段 HTML

###### 最后，demo的所有代码：
- arc/app/app.component.ts
```typescript
	import { Component } from '@angular/core';
	import { List } from './list';
 
    @Component({
      selector: 'app-root',
      template: `
        <p>{{title}}</p>
        <p>我最喜欢的是: {{lists.name}}</p>
        <p>这些人是:</p>
        <ul>
          <li *ngFor="let tmp of lists">
            {{ tmp.name }}
            </li>
        </ul>
        <p *ngIf="lists.length > 3">哎呀，还有很多呢...</p>
    `
    })
    export class AppComponent {
      title = '人物列表';
      heroes = [
        new List(1, '许嵩'),
        new List(2, '山田凉介'),
        new List(3, '夏洛克'),
        new List(4, '夏目')
      ];
      favorite = this.lists[0];
    }
```
- src/app/list.ts
```typescript
	export class List(){
  		constructor(
  			public id: number,
  			public name: string
  		){}
	}
```
- app.module.ts和main.ts什么的没有什么变化...不写了

## 二、模板语法
  Angular应用管理着用户的所见所为，并且通过组件和模板来和用户交互。在MVC/MVVM框架中，组件就是Control或者ViewModule的角色了，模板就是View的角色。关于Angular的模板语言，需要知道它的基本原理，并且掌握大部分的语法。





























