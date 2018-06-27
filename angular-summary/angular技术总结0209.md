# 组件与模板
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
### 1.使用插值表达式显示组件属性
  要显示组件的属性，就直接通过插值表达式（interpolation）来绑定属性名，直接把属性名放在双花括号里面，然后放在模板里面就好啦。
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
### 2.选择内联模板或者模板文件
  template用来定义内联模板，直接把元素写在后面就行，或者把模板放在单独的HTML文件里面，再通过templateUrl的属性，指定这个HTML文件的位置。
  上面的demo里面选择内联是因为代码很少，如果模板代码多的话，放在模板文件里面会更好有点，但是两种方法，在绑定数据上是完全一样的。
- 构造函数和变量初始化
  demo里面使用变量赋值的方式初始化组件，或者，可以使用构造函数来声明和初始化属性
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
### 3.使用ngFor显示数组属性
  要显示人物的列表，可以先向组件中添加一个数组，里面放着每个人物的名字，然后把favorite改成数组的第一个名字。
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
### 4.为数据创建一个类
  demo里面是直接把数据定义在了组件内部，使用到的是一个普通的字符串数组的绑定，此外还有对于一个对象数组的绑定，要将此绑定转换成使用对象，需要把人物名字的数组转换成一个List的对象数组。
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
#### 4.1使用一个类
  导入List类之后，组件的lists属性就可以返回一个类型化过的lists数组了。
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
### 5.通过ngIf进行条件显示
  显示数据的最后一步，根据需求是否显示某个视图
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
###  1.模板中的HTML
```txt
  Angular的模板语言是HTML，HTML大部分的语法都是有效的模板语法，但是<script>被忽略了，还有html、body、base在模板中也没有意义，其它的元素都正常使用就好。
  在Angular里面，还可以通过组件和指令扩展HTML标签。创建的组件通过selector指定的名字直接用就好啦。
```
### 2.插值表达式
```txt
  插值表达式在之前的demo里面已经见了很多了，它可以把计算后的字符串插入HTML元素标签，它可以把计算后的字符串插入到 HTML 元素标签内的文本或对标签的属性进行赋值。
  <p>{{title}}
  	<img src = "{{imgUrl}}">
  </p>
  花括号之间的就是组件的属性的名字，Angular会用组件中相应的属性的字符串的值，替换这个名字，在上面两行代码中，Angular会计算title和imgUrl的值，然后填在空白的地方，按顺序先显示title的内容，再显示图片。
  一般来说，括号间的素材是一个模板表达式，Angular先对它求职，再把它转成字符串
  比如<p>1 + 1= {{1+1}}</p>，插值表达式可以对其进行运算并显示在页面上，不管花括号里面是数字相加还是什么别的运算，也可以和组件中的属性或者方法一起调用。
```
### 3.模板表达式
  模板表达式产生一个值。 Angular 执行这个表达式，并把它赋值给绑定目标的属性，这个绑定目标可能是 HTML 元素、组件或指令。
  比如{{1+1}}中所包含的模板表达式是1 + 1。 在属性绑定中会再次看到模板表达式，它出现在等号右侧的引号中，就像这样：[property]="expression"。写的时候看上去像是js，很多js表达式也是合法的模板表达式，但是不是全部。
  有些js的表达式就不能用，可能会引起一些错误，比如：
```txt
  	赋值 (=, +=, -=, ...)
	new运算符
	使用;或,的链式表达式
	自增或自减操作符 (++和--)
```
  还有一些在语法上就不支持：
```txt
  	不支持位运算|和&
	具有新的模板表达式运算符，比如|、?.和!。
```
#### 3.1 表达式上下文
```txt
	eg：{{title}}
		<span [hidden]="isUnchanged">changed</span>
```
  典型的表达式上下文就是这个组件实例，它是各种绑定值的来源。 在demo中，双花括号中的title和引号中的isUnchanged所引用的都是AppComponent中的属性。
  表达式的上下文可以包括组件之外的对象。 比如模板输入变量 (let tmp)和模板引用变量(#userInput)就是备选的上下文对象之一。
```txt
	<div *ngFor="let tmp of lists">{{tmp.name}}</dv>
  	<input #userInput>{{userInput.value}}
```
  表达式中的上下文变量，是由模板变量，指令的上下文变量和组件的成员叠加而成的，如果我要引用的变量名存在于一个以上的命名空间中，那么模板变量是最优先的，其次是指令的上下文变量，最后是组件的成员。
  如果说我在组件的属性里面写了一个叫tmp的属性，那么就和*ngFor里面的tmp起了冲突，在{{tmp.name}}里面，tmp引用的是模板变量，而不是组件的属性。
  模板表达式不能引用全局命名空间中的任何东西，比如window或document。它们也不能调用console.log或Math.max。 它们只能引用表达式上下文中的成员。
#### 3.2表达式指南
  模板表达式能成就一个应用也能毁掉一个应用，在此列出以下指南：
  - 没有可见的副作用
    模板表达式除了目标属性的值以外，不应该改变应用的任何状态。
    这条规则是 Angular “单向数据流”策略的基础。 永远不用担心读取组件值可能改变另外的显示值。 在一次单独的渲染过程中，视图应该总是稳定的。
  - 执行迅速
    Angular 执行模板表达式非常的频繁。 它们可能在每一次按键或鼠标移动后被调用。 表达式应该快速结束，否则用户就会感到拖沓，特别是在较慢的设备上。 当计算代价较高时，应该考虑缓存那些从其它值计算得出的值。
  - 非常简单
    虽然也可以写出相当复杂的模板表达式，但不要那么写。
    常规是属性名或方法调用。偶尔的逻辑取反也还凑合。 其它情况下，应在组件中实现应用和业务逻辑，使开发和测试变得更容易。
  - 幂等性（可以使用相同参数重复执行，并能获得相同结果的函数。这些函数不会影响系统状态，也不用担心重复执行会对系统造成改变。）
    最好使用幂等的表达式，因为它没有副作用，并且能提升 Angular 变更检测的性能。
    在 Angular 的术语中，幂等的表达式应该总是返回完全相同的东西，直到某个依赖值发生改变。
    在单独的一次事件循环中，被依赖的值不应该改变。 如果幂等的表达式返回一个字符串或数字，连续调用它两次，也应该返回相同的字符串或数字。 如果幂等的表达式返回一个对象（包括Date或Array），连续调用它两次，也应该返回同一个对象的引用。
### 4.模板语句
  模板语句用来响应由绑定目标（如 HTML 元素、组件或指令）触发的事件。 模板语句在事件绑定的时候细说，它出现在=号右侧的引号中，就像这样：(event)="statement"。
```txt
  <button (click)="deletePerson()">Delete person</button>
```
  模板语句有副作用。 这是事件处理的关键。因为我们要根据用户的输入更新应用状态。
  响应事件是 Angular 中“单向数据流”的另一面。 在一次事件循环中，可以随意改变任何地方的任何东西。
  和模板表达式一样，模板语句使用的语言也像 JavaScript。 模板语句解析器和模板表达式解析器有所不同，特别之处在于它支持基本赋值 (=) 和表达式链 (;和,)。
  ps，一些js语法不能用：
```txt
  · new运算符
  · 自增和自减运算符：++和--
  · 操作并赋值，例如+=和-=
  · 位操作符|和&
  · 模板表达式运算符（就是管道的 | 还有判断的？之类的）
```
#### 4.1语句上下文
  和表达式中一样，语句只能引用语句上下文中 —— 通常是正在绑定事件的那个组件实例。
  典型的语句上下文就是当前组件的实例。 (click)="deletePerson()"中的deletePerson就是这个数据绑定组件上的一个方法。
```txt
  <button (click)="deletePerson()">Delete person</button>
  
  eg：
  <button (click)="onSave($event)">Save</button>
  <button *ngFor="let tmp of lists" (click)="deletePerson(tmp)">  {{tmp.name}}</button>
  <form #listForm (ngSubmit)="onSubmit(listForm)"> ... </form>
```
  语句上下文可以引用模板自身上下文中的属性。 在上面的demo中，就把模板的$event对象、模板输入变量 (let tmp)和模板引用变量 (#listForm)传给了组件中的一个事件处理器方法。
  模板上下文中的变量名的优先级高于组件上下文中的变量名。在上面的deletePerson(tmp)中，tmp是一个模板输入变量，而不是组件中的tmp属性。
  模板语句不能引用全局命名空间的任何东西。比如不能引用window 或 document，也不能调用console.log或Math.max。
#### 4.2 语句指南
  和表达式一样，避免写复杂的模板语句。 常规是函数调用或者属性赋值。
### 5.绑定语法（概览）
  数据绑定是一种机制，用来协调用户所见和应用数据，虽然我能往 HTML 推送值或者从 HTML 拉取值（jQuery操控DOM）， 但如果把这些琐事交给数据绑定框架处理， 应用会更容易编写、阅读和维护。 只要简单地在绑定源和目标 HTML 元素之间声明绑定，框架就会完成这项工作。
  Angular 提供了各种各样的数据绑定，之后细说。 先从高层视角来看看 Angular 数据绑定及其语法。
  绑定的类型可以根据数据流的方向分成三类： 从数据源到视图、从视图到数据源以及双向的从视图到数据源再到视图。
| 数据方向         |                    语法                    |                          绑定类型 |
| ------------ | :--------------------------------------: | ----------------------------: |
| 单向：从数据源到视图目标 | {{expression}}[target]="expression" bind-target="expression" | 插值表达式 Property Attribute 类 样式 |
| 单向：从视图目标到数据源 | (target)="statement" on-target="statement" |                            事件 |
| 双向           | [(target)]="expression" bindon-target="expression" |                            双向 |
  除了插值表达式之外的绑定类型，在等号左边是目标名， 无论是包在括号中 ([]、()) 还是用前缀形式 (bind-、on-、bindon-) 。
  这个目标名就是Property的名字。它可能看起来像是元素属性（Attribute）的名字，但它不是。 要理解它们的不同点，必须尝试用另一种方式来审视模板中的 HTML。
#### 5.1 新的思维模型
  数据绑定的威力和允许用自定义标记扩展 HTML 词汇的能力，容易误导我们把模板 HTML 当成 HTML+。
  它其实就是 HTML+。 但它也跟一般的的 HTML 有着显著的不同。 所以现在需要一种新的思维模型。
  在正常的 HTML 开发过程中，使用 HTML 元素创建视觉结构， 通过把字符串常量设置到元素的 attribute 来修改那些元素。
  比如：
```html
    <div class="special">Mental Model</div>
    <img src="assets/images/xusong.png">
    <button disabled>Save</button>
```
  在 Angular 模板中，仍使用同样的方式来创建结构和初始化 attribute 值。
  然后，用封装了 HTML 的组件创建新元素，并把它们当作原生 HTML 元素在模板中使用
  比如：
```html
    <!-- Normal HTML -->
    <div class="special">Mental Model</div>
    <!-- A new element! -->
    <app-person-detail></app-person-detail>
```
  上面这个样子就是HTML+
  现在开始学习数据绑定。我们碰到的第一种数据绑定是这样的：
```html
<!-- Bind button disabled state to `isUnchanged` property -->
<button [disabled]="isUnchanged">Save</button>
```
  过儿再认识那个怪异的方括号记法。表面上看，我正在绑定按钮的disabled attribute。 并把它设置为组件的isUnchanged属性的当前值。
  但是wrong！日常的 HTML 确实是这样。但是在这儿，一旦开始数据绑定，就不再跟 HTML attribute 打交道了。 这里不是设置 attribute，而是设置 DOM 元素、组件和指令的 property。
  #### 5.2 HTML attribute 与 DOM property 的对比
```txt
	attribute 是由 HTML 定义的。property 是由 DOM (Document Object Model) 定义的。
	· 少量 HTML attribute 和 property 之间有着 1:1 的映射，如id。
	· 有些 HTML attribute 没有对应的 property，如colspan。
	· 有些 DOM property 没有对应的 attribute，如textContent。
	· 大量 HTML attribute看起来映射到了property…… 但却不像我们想的那样！
	最后一类尤其让人困惑…… 除非我们能理解这个普遍原则：
	attribute 初始化 DOM property，然后它们的任务就完成了。property 的值可以改变；attribute 的值不能改变。
	比如，当浏览器渲染<input type="text" value="许嵩">时，它将创建相应 DOM 节点， 其value property 被初始化为 “许嵩”。
	当用户在输入框中输入 “夏洛克” 时，DOM 元素的value property 变成了 “夏洛克”。 但是这个 HTML value attribute 保持不变。如果我们读取 input 元素的 attribute，就会发现确实没变： input.getAttribute('value') // 返回 "许嵩"。
	HTML attribute value指定了初始值；DOM value property 是当前值。
	disabled attribute 是另一个古怪的例子。按钮的disabled property 是false，因为默认情况下按钮是可用的。 当我们添加disabled attribute 时，只要它出现了按钮的disabled property 就初始化为true，于是按钮就被禁用了。
	添加或删除disabled attribute会禁用或启用这个按钮。但 attribute 的值无关紧要，这就是我们为什么没法通过 <button disabled="false">仍被禁用</button>这种写法来启用按钮。
	设置按钮的disabled property（如，通过 Angular 绑定）可以禁用或启用这个按钮。 这就是 property 的价值。
	就算名字相同，HTML attribute 和 DOM property 也不是同一样东西。
```
  总而言之，模板绑定是通过 property 和事件来工作的，而不是 attribute。不然全景图里面能是property binding么
  在 Angular里面，attribute 唯一的作用是用来初始化元素和指令的状态。 当进行数据绑定时，只是在与元素和指令的 property 和事件打交道，而 attribute 就完全靠边站了。
#### 5.3 绑定目标
  数据绑定的目标是 DOM 中的某些东西。 这个目标可能是（元素 | 组件 | 指令的）property、（元素 | 组件 | 指令的）事件，或(极少数情况下) attribute 名。 汇总表如下：
| 绑定类型      |                 目标                  |                    示例                    |
| --------- | :---------------------------------: | :--------------------------------------: |
| Property  | 元素的Property，组件的Property，指令的Property | <img [src]="imgUrl"><br /><app-person-detail [person]="currentPerson"></app-person-detail><br /><div [ngClass]="{'special': isSpecial}"></div> |
| 事件        |          元素的事件，组件的事件，指令的事件          | <button (click)="onSave()">Save</button><br /><app-person-detail (deleteRequest)="deletePerson()"></app-person-detail><br /><div (myClick)="clicked=$event" clickable>click me</div> |
| 双向        |             事件与Property             |        <input [([ngModel]="name">        |
| Attribute |           attribute（例外情况）           | <button [attr.aria-label]="help">help</button> |
| CSS类      |            CSS Property             | <div [class.special]="isSpecial">Special</div> |
| 样式        |           style Property            | <button [style.color]="isSpecial ? 'red' : 'green'"> |
### 6.属性绑定（[属性名]）
  当要把视图元素的属性 (property) 设置为模板表达式时，就要写模板的属性 (property) 绑定。
  最常用的属性绑定是把元素属性设置为组件属性的值，比如：
```html
<img [src]="imgUrl"/>
```
  image元素的的src属性会被绑定到组件的imgUrl属性上。
```html
<button [disabled]="isUnchanged">Cancel is disabled</button>
```
  上面这个就是说当组件说它isUnchanged（未改变）时禁用按钮，还有就是设置指令的属性，比如：
```html
<div [ngClass]="classes">[ngClass] binding to the classes property</div>
```
  此外，还有父子组件通讯的时候需要设置自定义组件的模型属性：
```html
<app-person-detail [person]="currentPerson"></app-person-detail>
```
#### 6.1 单向输入
  属性绑定通常就被描述成单向数据绑定了，因为值的流动是单向的，从组件的数据属性流动到目标元素的属性，所以不能使用属性绑定来从目标元素拉取值，也不能绑定到目标元素的属性来读取它，只能设置它。
  此外，也不能使用属性 绑定 来调用目标元素上的方法。如果这个元素触发了事件，可以通过事件绑定来监听它们。如果必须读取目标元素上的属性或调用它的某个方法，得用另一种技术， ViewChild 和 ContentChild。
```txt
  ViewChild可以得到第一个元素，或者直接从DOM选择器上选择与之相匹配的，如果视图DOM发生了变化，并且新的子项和选择器相匹配，则属性将被更新。
  ContentChild与ViewChild不同的是，当内容DOM发生变化时，属性才会被改变。
```
#### 6.2 绑定目标
  eg：
```html
<img [src]="imgUrl">
```
  包裹在方括号中的元素属性名标记着目标属性。代码中的目标属性是 image 元素的src属性。
  除此之外还有bind-，被称为规范形式：
```html
<img bind-src="imgUrl">
```
  目标的名字总是 property 的名字。即使它看起来和别的名字一样。 看到src时，可能会把它当做 attribute。但是并不是，它是 image 元素的 property 名。
  元素属性可能是最常见的绑定目标，但 Angular 会先去看这个名字是否是某个已知指令的属性名，比如：
```html
<div [ngClass]="classes">[ngClass] binding to the classes property</div>

ps:严格来说，Angular 正在匹配指令的输入属性的名字。 这个名字是指令的inputs数组中所列的名字，或者是带有@Input()装饰器的属性。 这些输入属性被映射为指令自己的属性。
```
#### 6.3 消除副作用
  就像之前说的，模板表达式的计算不能有可见的副作用（JS的语法有一些就不要用了），表达式语言本身可以提供一部分安全保障。 不能在属性绑定表达式中对任何东西赋值，也不能使用自增、自减运算符。
  当然，表达式可能会调用具有副作用的属性或方法。但 Angular 没法知道这一点，也没法阻止。
  表达式中可以调用像getFoo()这样的方法。只有我知道getFoo()干了什么。 如果getFoo()改变了某个东西，恰好又绑定到个这个东西，我就掉坑里了。 Angular 可能显示也可能不显示变化后的值。Angular 还可能检测到变化，并抛出警告型错误。所以 一般情况下，只绑定数据属性和那些只返回值而不做其它事情的方法就好。
####6.4 返回恰当的类型
  模板表达式应该返回目标属性所需类型的值。 如果目标属性想要个字符串，就返回字符串。 如果目标属性想要个数字，就返回数字。 如果目标属性想要个对象，就返回对象。
  PersonDetail组价的person属性想要一个Person对象，那就在属性绑定的时候精确地给他一个Person对象：
```html
<app-person-detail [person]="currentPerson"></app-person-detail>
```
#### 6.5方括号
  方括号告诉 Angular 要计算模板表达式。 如果忘了加方括号，Angular 会把这个表达式当做字符串常量看待，并用该字符串来初始化目标属性。 它不会计算这个字符串。
  eg：
```html
<!-- ERROR: PersonDetailComponent.person expects a Person object, not the string "currentPerson" -->
  <app-person-detail person="currentPerson"></app-person-detail>
```
#### 6.6 一次性字符串初始化
  当满足下列条件时，应该省略括号：
  - 目标属性接受字符串值。
  - 字符串是个固定值，可以直接合并到模块中。
  - 这个初始值永不改变。
    在标准 HTML 中经常用这种方式初始化 attribute，这种方式也可以用在初始化指令和组件的属性。 在PersonDetailComponent的prefix属性初始化为固定的字符串，而不是模板表达式。Angular 设置它，然后忘记它。
```html
<app-person-detail prefix="You are main" [person]="currentPerson"></app-person-detail>

ps:作为对比，[person]绑定是组件的currentPerson属性的活绑定，它会一直随着更新。
```
#### 6.7 选择属性绑定还是插值表达式
  代码eg：
```html
<p><img src="{{heroImageUrl}}"> is the <i>interpolated</i> image.</p>
<p><img [src]="heroImageUrl"> is the <i>property bound</i> image.</p>

<p><span>"{{title}}" is the <i>interpolated</i> title.</span></p>
<p>"<span [innerHTML]="title"></span>" is the <i>property bound</i> title.</p>
```
  在多数情况下，插值表达式是更方便的备选项。 实际上，在渲染视图之前，Angular 把这些插值表达式翻译成相应的属性绑定。当要渲染的数据类型是字符串时，两种形式都行。 鉴于可读性，所以倾向于插值表达式。 建议建立代码风格规则，选择一种形式， 这样，既遵循了规则，又能让手头的任务做起来更自然。但数据类型不是字符串时，就必须使用属性绑定了。
  比如假设有个恶意的内容：evilTitle = 'Template <script>alert("evil never sleeps")</script>Syntax';
  Angular 数据绑定对危险 HTML 有防备。 在显示它们之前，它对内容先进行消毒。 不管是插值表达式还是属性绑定，都不会允许带有 script 标签的 HTML 泄漏到浏览器中。
```html
<!--
  Angular generates warnings for these two lines as it sanitizes them
  WARNING: sanitizing HTML stripped some content (see http://g.co/ng/security#xss).
 -->
<p><span>"{{evilTitle}}" is the <i>interpolated</i> evil title.</span></p>
<p>"<span [innerHTML]="evilTitle"></span>" is the <i>property bound</i> evil title.</p>

所以最后显示会变这样：
 'Template <script>alert("evil never sleeps")</script>Syntax'is the  interpolated evil title.
  Template Syntax is the  interpolated evil title.
```
### 7.attribute、class 和 style 绑定
#### 7.1 attribute 绑定
  可以通过attribute 绑定来直接设置 attribute 的值，这是“绑定到目标属性 (property)”这条规则中唯一的例外。这是唯一的能创建和设置 attribute 的绑定形式。
  之前一直还在说，通过属性绑定来设置元素的属性总是好于用字符串设置 attribute。那为啥 Angular 还提供了 attribute 绑定。
  因为当元素没有属性可绑的时候，就必须使用 attribute 绑定。考虑 ARIA， SVG 和 table 中的 colspan/rowspan 等 attribute。 它们是纯粹的 attribute，没有对应的属性可供绑定。
  比如想写下面这样的：
```html
<tr><td colspan="{{1 + 1}}">Three-Four</td></tr>

<!--报错：
  Template parse errors:
Can't bind to 'colspan' since it isn't a known native property
（模板解析错误：不能绑定到 'colspan'，因为它不是已知的原生属性）-->
```
  正如提示中所说，<td>元素没有colspan属性。 但是插值表达式和属性绑定只能设置属性，不能设置 attribute。我们需要 attribute 绑定来创建和绑定到这样的 attribute。attribute 绑定的语法与属性绑定类似。 但方括号中的部分不是元素的属性名，而是由attr前缀，一个点 (.) 和 attribute 的名字组成。 可以通过值为字符串的表达式来设置 attribute 的值。
  这里把[attr.colspan]绑定到一个计算值：
```html
<table border=1>
  <!--  expression calculates colspan=2 -->
  <tr><td [attr.colspan]="1 + 1">One-Two</td></tr>

  <!-- ERROR: There is no `colspan` property to set!
    <tr><td colspan="{{1 + 1}}">Three-Four</td></tr>
  -->
  <tr><td>Five</td><td>Six</td></tr>
</table>
```
  attribute 绑定的主要用例之一是设置 ARIA attribute（译注：ARIA指可访问性，用于给残障人士访问互联网提供便利），比如：
```html
<!-- create and set an aria attribute for assistive technology -->
<button [attr.aria-label]="actionName">{{actionName}} with Aria</button>
```
#### 7.2 CSS类绑定
  借助 CSS 类绑定，可以从元素的class attribute 上添加和移除 CSS 类名。CSS 类绑定绑定的语法与属性绑定类似。 但方括号中的部分不是元素的属性名，而是由class前缀，一个点 (.)和 CSS 类的名字组成， 其中后两部分是可选的。比如这样：[class.class-name]。
```html
<!-- standard class attribute setting  -->
<div class="bad curly special">Bad curly special</div>
```
  demo里面示范了如何通过 CSS 类绑定来添加和移除应用的 "special" 类，不用绑定直接设置 attribute 。
  或者可以把它改写为绑定到所需 CSS 类名的绑定；这是一个或者全有或者全无的替换型绑定。 （就是当 badCurly 有值时 class 这个 attribute 设置的内容会被完全覆盖）
```html
<!-- reset/override all class names with a binding  -->
<div class="bad curly special" [class]="badCurly">Bad curly</div>
```
  最后，可以绑定到特定的类名。 当模板表达式的求值结果是真值时，Angular 会添加这个类，反之则移除它。
```html
<!-- toggle the "special" class on/off with a property -->
<div [class.special]="isSpecial">The class binding is special</div>

<!-- binding to `class.special` trumps the class attribute -->
<div class="special" [class.special]="!isSpecial">This one is not so special</div>
```
  但是用的时候直接可以用ngClass来切换类名啊，超级方便。
#### 7.3 样式绑定
  通过样式绑定，可以设置内联样式。样式绑定的语法与属性绑定类似。 但方括号中的部分不是元素的属性名，而由style前缀，一个点 (.)和 CSS 样式的属性名组成。 比如这样：[style.style-property]。
```html
<button [style.color]="isSpecial ? 'red': 'green'">Red</button>
<button [style.background-color]="canSave ? 'cyan': 'grey'" >Save</button>
```
  有些样式绑定中的样式带有单位。在这里，以根据条件用 “em” 和 “%” 来设置字体大小的单位。
```html
<button [style.font-size.em]="isSpecial ? 3 : 1" >Big</button>
<button [style.font-size.%]="!isSpecial ? 150 : 50" >Small</button>
```
  同样的，用的时候还是直接用ngStyle啊...
### 8.事件绑定
  （之前的就是全景图的property binding，这次就是event binding啦）
  前面遇到的绑定的数据流都是单向的：从组件到元素。
  但用户不会只盯着屏幕看。他们会在输入框中输入文本。他们会从列表中选取条目。 他们会点击按钮。这类用户动作可能导致反向的数据流：从元素到组件。知道用户动作的唯一方式是监听某些事件，如按键、鼠标移动、点击和触摸屏幕。 可以通过 Angular 事件绑定来声明对哪些用户动作感兴趣。事件绑定语法由等号左侧带圆括号的目标事件和右侧引号中的模板语句组成。 下面事件绑定监听按钮的点击事件。每当点击发生时，都会调用组件的onSave()方法。
  像这样：
```html
<button (click)="onSave()">Save</button>
```
#### 8.1 目标事件
  圆括号中的名称 —— 比如(click) —— 标记出目标事件。在下面例子中，目标是按钮的 click 事件
```html
  <button (click)="onSave()">Save</button>
```
  这个也有规范形式，就是不怎么用：
```html
  <button on-click="onSave()">On Save</button>
```
  元素事件可能是更常见的目标，但 Angular 会先看这个名字是否能匹配上已知指令的事件属性，比如：
```html
  <!-- `myClick` is an event on the custom `ClickDirective` -->
<div (myClick)="clickMessage=$event" clickable>click with myClick</div>
```
  我这个myClick必定是定义过的才能用，不然就报“未知错误”了。
#### 8.2 $event和事件处理语句
  在事件绑定中，Angular 会为目标事件设置事件处理器。当事件发生时，这个处理器会执行模板语句。 典型的模板语句通常涉及到响应事件执行动作的接收器，例如从 HTML 控件中取得值，并存入模型。绑定会通过名叫$event的事件对象传递关于此事件的信息（包括数据值）。事件对象的形态取决于目标事件。如果目标事件是原生 DOM 元素事件， $event就是 DOM事件对象，它有像target和target.value这样的属性。
  比如：
```html
  <input [value]="currentPerson.name" (input)="currentPerson.name=$event.target.value">
```
  上面的代码在把输入框的value属性绑定到firstName属性。 要监听对值的修改，代码绑定到输入框的input事件。 当用户造成更改时，input事件被触发，并在包含了 DOM 事件对象 ($event) 的上下文中执行这条语句。要更新firstName属性，就要通过路径$event.target.value来获取更改后的值。
#### 8.3 使用 EventEmitter 实现自定义事件
  通常，指令使用 Angular EventEmitter 来触发自定义事件。 指令创建一个EventEmitter实例，并且把它作为属性暴露出来。 指令调用EventEmitter.emit(payload)来触发事件，可以传入任何东西作为消息载荷。 父指令通过绑定到这个属性来监听事件，并通过$event对象来访问载荷。
  假设PersonDetailComponent用于显示人物的信息，并响应用户的动作。 虽然PersonDetailComponent包含删除按钮，但它自己并不知道该如何删除这个人物。 最好的做法是触发事件来报告“删除用户”的请求。
```typescript
  app.component.ts:
  template: `
        <div>
          <img src="{{imgUrl}}">
          <span [style.text-decoration]="lineThrough">
            {{prefix}} {{person?.name}}
          </span>
          <button (click)="delete()">Delete</button>
        </div>`
  deleteRequest = new EventEmitter<Person>();

  delete() {
	this.deleteRequest.emit(this.person);
  }
```
  当deleteRequest事件触发时，Angular 调用父组件的deletePerson方法， 在$event变量中传入要删除的人物（来自PersonDetail）。
#### 8.4 模板语句的副作用
  deletePerson方法有副作用：它删除了一个人物。 模板语句的副作用不仅没问题，反而正是所期望的。删除这个人物会更新模型，还可能触发其它修改，包括向远端服务器的查询和保存。 这些变更通过系统进行扩散，并最终显示到当前以及其它视图中。
### 9.双向数据绑定
  在项目中经常需要显示数据属性，并在用户作出更改时更新该属性。在元素层面上，既要设置元素属性，又要监听元素事件变化。Angular 为此提供一种特殊的双向数据绑定语法：[(x)]。 [(x)]语法结合了属性绑定的方括号[x]和事件绑定的圆括号(x)。当我更改数据的时候，视图直接跟着改变，非常方便啊。
  当一个元素拥有可以设置的属性x和对应的事件xChange时，就能解释通[(x)]语法了。
  下面的SizerComponent符合这个模式。它有size属性和伴随的sizeChange事件：
```typescript
import { Component, EventEmitter, Input, Output } from '@angular/core';
@Component({
  selector: 'app-sizer',
  template: `
  <div>
    <button (click)="dec()" title="smaller">-</button>
    <button (click)="inc()" title="bigger">+</button>
    <label [style.font-size.px]="size">FontSize: {{size}}px</label>
  </div>`
})
export class SizerComponent {
  @Input()  size: number | string;
  @Output() sizeChange = new EventEmitter<number>();
  dec() { this.resize(-1); }
  inc() { this.resize(+1); }
  resize(delta: number) {
    this.size = Math.min(40, Math.max(8, +this.size + delta));
    this.sizeChange.emit(this.size);
  }
}
```
  size的初始值是一个输入值，来自属性绑定。（size前面加了@Input）点击按钮，在最小/最大值范围限制内增加或者减少size。 然后用调整后的size触发sizeChange事件。
  在下面的代码里面，AppComponent.fontSize被双向绑定到SizerComponent：
```html
<app-sizer [(size)]="fontSizePx"></app-sizer>
<div [style.font-size.px]="fontSizePx">Resizable Text</div>
```
  SizerComponent.size初始值是AppComponent.fontSizePx。 点击按钮时，通过双向绑定更新AppComponent.fontSizePx。 被修改的AppComponent.fontSizePx通过样式绑定，改变文本的显示大小。
  双向绑定语法实际上是属性绑定和事件绑定的语法糖。 Angular将SizerComponent的绑定分解成这样：
```html
  <app-sizer [size]="fontSizePx" (sizeChange)="fontSizePx=$event"></app-sizer>
```
  $event变量包含了SizerComponent.sizeChange事件的荷载。 当用户点击按钮时，Angular 将$event赋值给AppComponent.fontSizePx。比起单独绑定属性和事件，双向数据绑定语法显得非常方便。
  在像<input>和<select>这样的 HTML 元素上不能使用这样的双向数据绑定。 因为原生 HTML 元素不遵循x值和xChange事件的模式。
  但是，最后还是只用[(ngModel)]啊，表单元素上就能双向数据绑定啦。
### 10.内置指令 - 内置属性指令
  属性型指令会监听和修改其它HTML元素或组件的行为、元素属性（Attribute）、DOM属性（Property）。 它们通常会作为HTML属性的名称而应用在元素上。
  常用的属性型指令
  - NgClass - 添加或移除一组CSS类
  - NgStyle - 添加或移除一组CSS样式
  - NgModel - 双向绑定到HTML表单元素
#### 10.1 NgClass 指令
  在Angular里面经常用动态添加或删除 CSS 类的方式来控制元素如何显示。 通过绑定到NgClass，可以同时添加或移除多个类。
  CSS类用来添加或者删除单个类好用：
```html
<!-- 切换"special" 这个类 -->
<div [class.special]="isSpecial">The class binding is special</div>
```
  上面用来切换一个还行，如果是多个class，就需要用ngClass，把ngClass绑定到一个 key:value 形式的控制对象。这个对象中的每个 key 都是一个 CSS 类名，如果它的 value 是true，这个类就会被加上，否则就会被移除。
  组件方法setCurrentClasses可以把组件的属性currentClasses设置为一个对象，它将会根据三个其它组件的状态为true或false而添加或移除三个类。
```typescript
currentClasses: {};
setCurrentClasses() {
  // CSS classes: 添加或者删除组件属性的每一个当前状态
  this.currentClasses =  {
    'saveable': this.canSave,
    'modified': !this.isUnchanged,
    'special':  this.isSpecial
  };
}
```
  然后把NgClass属性绑定到currentClasses，根据它来设置此元素的CSS类：
```html
<div [ngClass]="currentClasses">This div is initially saveable, unchanged, and special</div>
```
  setCurrentClassess()既可以在初始化时调用，也可以在所依赖的的属性变化时调用。
#### 10.2 NgStyle指令
  根据组件的状态动态设置内联样式。 NgStyle绑定可以同时设置多个内联样式。
  样式绑定是设置单一样式值的简单方式。比如：
```html
<div [style.font-size]="isSpecial ? 'x-large' : 'smaller'" >
  This div is x-large or smaller.
</div>
```
  如果需要设置多个内联样式，就用ngStyle。
  NgStyle需要绑定到一个 key:value 控制对象。 对象的每个 key 是样式名，它的 value 是能用于这个样式的任何值。
  看组件的setCurrentStyles方法，它会根据另外三个属性的状态把组件的currentStyles属性设置为一个定义了三个样式的对象：
```typescript
currentStyles: {};
setCurrentStyles() {
  // CSS styles: set per current state of component properties
  this.currentStyles = {
    'font-style':  this.canSave      ? 'italic' : 'normal',
    'font-weight': !this.isUnchanged ? 'bold'   : 'normal',
    'font-size':   this.isSpecial    ? '24px'   : '12px'
  };
}
```
  把NgStyle属性绑定到currentStyles，以据此设置此元素的样式：
```html
<div [ngStyle]="currentStyles">
  This div is initially italic, normal weight, and extra large (24px).
</div>
```
  setCurrentStyles()也是，既可以在初始化时调用，也可以在所依赖的的属性变化时调用。
#### 10.3 NgModel - 使用[(ngModel)]双向绑定到表单元素
  当开发数据输入表单时，通常都要既显示数据属性又根据用户的更改去修改那个属性。
  使用NgModel指令进行双向数据绑定可以简化这种工作。比如：
```html
  <input [(ngModel)]="currentPerson.name">
```
  使用 ngModel 时需要 FormsModule。在使用ngModel指令进行双向数据绑定之前，必须导入FormsModule并把它添加到Angular模块的imports列表中。
  eg：
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 
// 从表单中引入FormsModule

@NgModule({
  imports: [
    BrowserModule,
    FormsModule  // <--- 引入 NgModule
  ],
})
export class AppModule { }
```
  先看之前的name绑定，是通过分别绑定到<input>元素的value属性和input事件来达到同样的效果：
```html
<input [value]="currentHero.name" (input)="currentHero.name=$event.target.value" >
```
  这样显得很笨重，谁会记得该设置哪个元素属性以及当用户修改时触发哪个事件？ 我该如何提取输入框中的文本并且更新数据属性？谁会希望每次都去查资料来确定这些？
  ngModel指令通过自己的输入属性ngModel和输出属性ngModelChange隐藏了那些细节。
```html
<input  [ngModel]="currentHero.name"  (ngModelChange)="currentHero.name=$event">
```
```txt
  ps：
  ngModel输入属性会设置该元素的值，并通过ngModelChange的输出属性来监听元素值的变化。
  各种元素都有很多特有的处理细节，因此NgModel指令只支持实现了ControlValueAccessor的元素， 它们能让元素适配本协议。 <input>输入框正是其中之一。 Angular为所有的基础HTML表单都提供了值访问器（Value accessor），表单一章展示了如何绑定它们。
  不能把[(ngModel)]用到非表单类的原生元素或第三方自定义组件上，除非写一个合适的值访问器，这种技巧超出了本章的范围。
  自己写的Angular组件不需要值访问器，因为我们可以让值和事件的属性名适应Angular基本的双向绑定语法，而不使用NgModel。 前面看过的sizer就是使用这种技巧的例子。
```
  使用独立的ngModel绑定优于绑定到该元素的原生属性，那样做的就更好了。
  而且不用被迫两次引用这个数据属性，Angular可以捕获该元素的数据属性，并且通过一个简单的声明来设置它，这样它就可以使用[(ngModel)]语法了。
```html
  <input [(ngModel)]="currentPerson.name">
```
  [(ngModel)]语法只能设置数据绑定属性。 如果要做更多或者做点不一样的事，就用它的展开形式。
  比如：
```html
<input [ngModel]="currentPerson.name" (ngModelChange)="setUppercaseName($event)">
```
  失去焦点之后，输入框的内容就会转成全大写。
### 11.内置指令 - 内置结构型指令
#### 11.1 NgIf指令
  通过把NgIf指令应用到元素上（称为宿主元素），可以往DOM中添加或从DOM中移除这个元素，比如：
```html
<app-person-detail *ngIf="isActive"></app-person-detail>
```
  当isActive为真时，就把当前组件挂载到DOM树上，为假时，就移除该组件。
  这和显示隐藏不一样，比如：
```html
<!-- isSpecial is true -->
<div [class.hidden]="!isSpecial">Show with class</div>
<div [class.hidden]="isSpecial">Hide with class</div>

<!-- HeroDetail is in the DOM but hidden -->
<app-hero-detail [class.hidden]="isSpecial"></app-hero-detail>

<div [style.display]="isSpecial ? 'block' : 'none'">Show with style</div>
<div [style.display]="isSpecial ? 'none'  : 'block'">Hide with style<
/div>
```
  当隐藏子树时，它仍然留在 DOM 中。 子树中的组件及其状态仍然保留着。 即使对于不可见属性，Angular 也会继续检查变更。 子树可能占用相当可观的内存和运算资源。
  当NgIf为false时，Angular 从 DOM 中物理地移除了这个元素子树。 它销毁了子树中的组件及其状态，也潜在释放了可观的资源，最终让用户体验到更好的性能。
  显示/隐藏的技术对于只有少量子元素的元素是很好用的，但要当心别试图隐藏大型组件树。相比之下，NgIf则是个更安全的选择。
  eg：
```html
<div *ngIf="currentPerson">Hello, {{currentPerson.name}}</div>
<div *ngIf="nullPerson">Hello, {{nullPerson.name}}</div>
```
  ngIf指令通常会用来防范空指针错误。 而显示/隐藏的方式是无法防范的，当一个表达式尝试访问空值的属性时，Angular就会抛出一个异常。
  在上面的demo中，用NgIf来保护了两个<div>防范空指针错误。 currentPerson的名字只有当存在currentPerson时才会显示出来。 而nullPerson永远不会显示。
#### 11.2 NgFor指令
  这是循环指令，展示一个由多个条目组成的列表。首先定义了一个 HTML 块，它规定了单个条目应该如何显示。 再告诉 Angular 把这个块当做模板，渲染列表中的每个条目。
  常用方式：
```html
<div *ngFor="let tmp of lists">{{tmp.name}}</div>
```
  NgFor的微语法：
```txt
  赋值给*ngFor的字符串不是模板表达式。 它是一个微语法 —— 由 Angular 自己解释的小型语言。在这个例子中，字符串"let tmp of lists"的含义是：
  取出lists数组中的每个英雄，把它存入局部变量hero中，并在每次迭代时对模板 HTML 可用
  Angular 把这个指令翻译成了一个<ng-template>包裹的宿主元素，然后使用这个模板重复创建出一组新元素，并且绑定到列表中的每一个person。
```
#### 11.3 模板输入变量
  tmp前的let关键字创建了一个名叫tmp的模板输入变量。 ngFor指令在由父组件的lists属性返回的lists数组上迭代，每次迭代都从数组中把当前元素赋值给tmp变量。
  我们可以在ngFor的宿主元素（及其子元素）中引用模板输入变量tmp，从而访问该英雄的属性。 这里它首先在一个插值表达式中被引用到，然后通过一个绑定把它传给了<person-detail>组件的tmp属性。
```html
<div *ngFor="let tmp of lists">{{tmp.name}}</div>
<app-person-detail *ngFor="let tmp of lists" [list]="List"></app-person-detail>
```
  ngFor 也可以带索引,NgFor指令上下文中的index属性返回一个从零开始的索引，表示当前条目在迭代中的顺序。 可以通过模板输入变量捕获这个index值，并把它用在模板中：
```html
<div *ngFor="let hero of heroes; let i=index">{{i + 1}} - {{hero.name}}</div>
```
  带trackBy的 *ngFor
  ngFor指令有时候会性能较差，特别是在大型列表中。 对一个条目的一丁点改动、移除或添加，都会导致级联的 DOM 操作。
  例如，可以通过重新从服务器查询来刷新英雄列表。 刷新后的列表可能包含很多（如果不是全部的话）以前显示过的英雄。
  他们中的绝大多数（如果不是所有的话）都是以前显示过的英雄。知道这一点，是因为每个英雄的id没有变化。 但在 Angular 看来，它只是一个由新的对象引用构成的新列表， 它没有选择，只能清理旧列表、舍弃那些 DOM 元素，并且用新的 DOM 元素来重建一个新列表。
  如果给它指定一个trackBy，Angular 就可以避免这种折腾。 我往组件中添加一个方法，它会返回NgFor应该追踪的值。 在这里，这个值就是人物的id。
```typescript
ts:
trackByPersons(index: number, person: Person): number { return person.id; }
```
```html
html:
<div *ngFor="let tmp of lists; trackBy: trackByPerson">
  ({{person.id}}) {{person.name}}
</div>
```
  页面有一个"Reset persons"按钮的话，它会创建一个具有相同person.id的新人物。 "Change ids"则会创建一个具有新person.id的新人物。
  - 如果没有trackBy，这些按钮都会触发完全的DOM元素替换。
  - 有了trackBy，则只有修改了id的按钮才会触发元素替换。
#### 11.4 NgSwitch
  NgSwitch指令类似于JavaScript的switch语句。 它可以从多个可能的元素中根据switch条件来显示某一个。 Angular只会把选中的元素放进DOM中。
  NgSwitch实际上包括三个相互协作的指令：NgSwitch、NgSwitchCase 和 NgSwitchDefault，就像这样
```html
<div [ngSwitch]="currentPerson.emotion">
  <app-happy-person    *ngSwitchCase="'happy'"    [hero]="currentPerson"></app-happy-person>
  <app-sad-person      *ngSwitchCase="'sad'"      [hero]="currentPerson"></app-sad-person>
  <app-confused-person *ngSwitchCase="'confused'" [hero]="currentPerson"></app-confused-person>
  <app-unknown-person  *ngSwitchDefault           [hero]="currentPerson"></app-unknown-person>
</div>
```
  NgSwitch是主控指令，要把它绑定到一个返回候选值的表达式。 本例子中的emotion是个字符串，但实际上这个候选值可以是任意类型。绑定到[ngSwitch]。如果试图用*ngSwitch的形式使用它就会报错，这是因为NgSwitch是一个属性型指令，而不是结构型指令。 它要修改的是所在元素的行为，而不会直接接触DOM结构。
  绑定到*ngSwitchCase和*ngSwitchDefault NgSwitchCase 和 NgSwitchDefault 指令都是结构型指令，因为它们会从DOM中添加或移除元素。
  NgSwitchCase会在它绑定到的值等于候选值时，把它所在的元素加入到DOM中。NgSwitchDefault会在没有任何一个NgSwitchCase被选中时把它所在的元素加入DOM中。
  这组指令在要添加或移除组件元素时会非常有用。 这个例子会在person-switch.components.ts中定义的四个“最厉害的人”组件之间选择。 每个组件都有一个输入属性person，它绑定到父组件的currentPerson上。
  这组指令在原生元素和Web Component上都能用， 比如，可以把<confused-person>分支改成这样：
```html
<div *ngSwitchCase="'confused'">Are you as confused as {{currentPerson.name}}?</div>
```
### 12.模板引用变量（#var）
  模板引用变量通常用来引用模板中的某个DOM元素，也可以引用angular组件或者指令或者Web Component。使用#来声明引用变量，比如：
```html
	<input #phone placeholder="请输入电话号码">
```
  在模板的任何地方都可以引用模板引用变量，比如：
```html
    <input #phone placeholder="请输入电话号码">
    <!-- 其它元素，什么都行 -->
    <button (click)="callPhone(phone.value)">Call</button>
```
  模板引用变量是怎么得到它的值的？
```txt
  大多数情况下，Angular会把模板引用变量的值设置为声明它的那个元素。 在上一个例子中，phone引用的是表示电话号码的<input>框。 "拨号"按钮的点击事件处理器把这个input值传给了组件的callPhone方法。 不过，指令也可以修改这种行为，让这个值引用到别处，比如它自身。 NgForm指令就是这么做的。
```
  就像这样用也可以：
```html
<form (ngSubmit)="onSubmit(personForm)" #personForm="ngForm">
  <div>
    <label for="name">Name
      <input name="name" required [(ngModel)]="person.name">
    </label>
  </div>
  <button type="submit" [disabled]="!personForm.form.valid">Submit</button>
</form>
<div [hidden]="!personForm.form.valid">
  {{submitMessage}}
</div>
```
  在上面，personForm出现了3次，中间还隔着HTML，那personForm的值是什么？
  如果之前没有导入FormsModule，Angular就不会控制这个表单，那么它就是一个HTMLFormElement实例。 这里的personForm实际上是一个Angular NgForm 指令的引用， 因此具备了跟踪表单中的每个控件的值和有效性的能力。
  原生的<form>元素没有form属性，但NgForm指令有。这就解释了为何当personForm.form.valid是无效时我们可以禁用提交按钮， 并能把整个表单控件树传给父组件的onSubmit方法。
  模板引用变量的作用范围是整个模板。 不要在同一个模板中多次定义同一个变量名，否则它在运行期间的值是无法确定的。
  也可以用ref-前缀代替#。 下面的例子中就用把fax变量声明成了ref-fax而不是#fax。（也可以作为组件间通讯的一种方法）
```html
    <input ref-fax placeholder="fax number">
    <button (click)="callFax(fax.value)">Fax</button>
```
### 13.输入输出属性（@Input和@Output）
  到目前为止，主要关注的点在于绑定声明的右侧，在模板表达式和模板语句中绑定到组件成员。 当成员出现在这个位置上，则称之为数据绑定的源。
  专注于绑定到的目标，它位于绑定声明中的左侧。 这些指令的属性必须被声明成输入或输出。
  **记住：所有组件皆为指令。**
```txt
     我们要重点突出下绑定目标和绑定源的区别。
     绑定的目标是在=左侧的部分， 源则是在=右侧的部分。
     绑定的目标是绑定符：[]、()或[()]中的属性或事件名， 源则是引号 (" ") 中的部分或插值符号 ({{}}) 中的部分。
     源指令中的每个成员都会自动在绑定中可用。 不需要特别做什么，就能在模板表达式或语句
     访问目标指令中的成员则受到限制。 只能绑定到那些显式标记为输入或输出的属性。
```
  在下面的例子中，iconUrl和onSave是组件的成员，它们在=右侧引号语法中被引用了。
```html
     < img [src]="iconUrl"/>
     <button (click)="onSave()">Save</button>
```
  它们既不是组件的输入也不是输出。它们是绑定的数据源。
  现在，看看PersonDetailComponent中的另一个片段，等号（=）左侧的是绑定的目标。
```html
	<app-person-detail [person]="currentPerson(deleteRequest)="deletePerson($event)"></app-person-detail>
```
  PersonDetailComponent.person和PersonDetailComponent.deleteRequest都在绑定声明的左侧。
  PersonDetailComponent.person在方括号中，它是属性绑定的目标PersonDetailComponent.deleteRequest在圆括号中，它是事件绑定的目标。
####13.1  声明输入和输出属性
  目标属性必须被显式的标记为输入或输出。
  在PersonDetailComponent内部，这些属性被装饰器标记成了输入和输出属性。
```typescript
  @Input()  person: Person;
   // 一个利用@Input的输入属性标识，表示可以接受数据
  @Output() deleteRequest = new EventEmitter<Person>();
   // 一个表示@Output的输出属性利用一个自定义事件的方法
   // 把需要传递出去的数据传递出去。
```
  另外，还可以在指令元数据的inputs或outputs数组中标记出这些成员。比如：
```typescript
  @Component({
  inputs: ['person'],
  outputs: ['deleteRequest'],
  })
```
**既可以通过装饰器，也可以通过元数据数组来指定输入/输出属性。但别同时用！**
```txt
  Q:现在是输入还是输出？
  输入属性通常接收数据值。 输出属性暴露事件生产者，如EventEmitter对象。
  输入和输出这两个词是从目标指令的角度来说的。
  <app-person-detail [person]="currentPerson(deleteRequest)="deletePerson($event)"></app-person-detail>//[person]-->input,(deleteRequest)-->output
  从PersonDetailComponent角度来看，PersonDetailComponent.person是个输入属性， 因为数据流从模板绑定表达式流入那个属性。
  从PersonDetailComponent角度来看，PersonDetailComponent.deleteRequest是个输出属性， 因为事件从那个属性流出，流向模板绑定语句中的处理器。
```
####13.2 给输入/输出属性起别名
  有时需要让输入/输出属性的公开名字不同于内部名字。
  这是使用 attribute 指令时的常见情况。 指令的使用者期望绑定到指令名。例如，在<div>上用myClick选择器应用指令时， 希望绑定的事件属性也叫myClick。
```html
  <div (myClick)="clickMessage=$event" clickable>click with myClick</div>
```
  然而，在指令类中，直接用指令名作为自己的属性名通常都不是好的选择。 指令名很少能描述这个属性是干嘛的。 myClick这个指令名对于用来发出 click 消息的属性就算不上一个好名字。
  幸运的是，可以使用约定俗成的公开名字，同时在内部使用不同的名字。 在上面例子中，实际上是把myClick这个别名指向了指令自己的clicks属性。
### 14.模板表达式操作符
  模板表达式语言使用了 JavaScript 语法的子集，并补充了几个用于特定场景的特殊操作符
#### 14.1 管道操作符（|）
  在绑定之前，表达式的结果可能需要一些转换。例如，可能希望把数字显示成金额、强制文本变成大写，或者过滤列表以及进行排序。
  Angular 管道对像这样的小型转换来说是个明智的选择。 管道是一个简单的函数，它接受一个输入值，并返回转换结果。 它们很容易用于模板表达式中，只要使用管道操作符 (|) 就行了。
```html
	<div>Title through uppercase pipe: {{title | uppercase}}</div>
```
  管道操作符会把它左侧的表达式结果传给它右侧的管道函数。uppercase就是将小写的英文全部转为大写。
  还可以通过多个管道串联表达式：
```html
<!--先转大写，再转小写，lowercase是转小写 -->
<div>
  Title through a pipe chain:
  {{title | uppercase | lowercase}}
</div>
```
  其它的还有date转换日期的，json、number等，具体的以后细说。
#### 14.2 安全导航操作符 ( ?. ) 和空属性路径
  Angular 的安全导航操作符 (?.) 是一种流畅而便利的方式，用来保护出现在属性路径中 null 和 undefined 值。 下面的代码里，当currentPerson为空时，保护视图渲染器，让它免于失败。
```txt
The current person's name is {{currentPerson?.name}}
```
  再比如，如果下面的title是空的话，会怎么样？
```txt
The title is {{title}}
```
  这个视图仍然被渲染出来，但是显示的值是空；只能看到 “The title is”，它后面却没有任何东西。 这是合理的行为。至少应用没有崩溃。
  假设模板表达式涉及属性路径，在下例中，显示一个空 (null) 人物的firstName。
```txt
The null person's name is {{nullPerson.name}}
```
  JavaScript 抛出了空引用错误，Angular 也是如此：
```javascript
TypeError: Cannot read property 'name' of null in [null].
```
  这个样子的话，整个视图就都没有了，如果确信person属性永远不可能为空，可以声称这是合理的行为。 如果它必须不能为空，但它仍然是空值，实际上是制造了一个编程错误，它应该被捕获和修复。 这种情况应该抛出异常。另一方面，属性路径中的空值可能会时常发生，特别是当我们知道数据最终会出现。当等待数据的时候，视图渲染器不应该抱怨，而应该把这个空属性路径显示为空白，就像上面title属性那样。
  但是，当currentPerson为空的时候，应用崩溃了。这个时候，可以通过ngIf来解决，当当前内容不为空的时候再挂载元素：
```html
<!--No hero, div not displayed, no error -->
<div *ngIf="nullPerson">The null person's name is {{nullPerson.name}}</div>
```
  或者可以尝试通过&&来把属性路径的各部分串起来，让它在遇到第一个空值的时候，就返回空。
```txt
The null person's name is {{nullPerson && nullPerson.name}}
```
  这些方法都有价值，但是会显得笨重，特别是当这个属性路径非常长的时候。 想象一下在一个很长的属性路径（如a.b.c.d）中对空值提供保护。Angular 安全导航操作符 (?.) 是在属性路径中保护空值的更加流畅、便利的方式。 表达式会在它遇到第一个空值的时候跳出。 显示是空的，但应用正常工作，而没有发生错误。
#### 14.3 非空断言操作符（！）
  在 TypeScript 2.0 中，可以使用--strictNullChecks标志强制开启严格空值检查。TypeScript就会确保不存在意料之外的null或undefined。在这种模式下，有类型的变量默认是不允许null或undefined值的，如果有未赋值的变量，或者试图把null或undefined赋值给不允许为空的变量，类型检查器就会抛出一个错误。如果类型检查器在运行期间无法确定一个变量是null或undefined，那么它也会抛出一个错误。 我们自己可能知道它不会为空，但类型检查器不知道。 所以我们要告诉类型检查器，它不会为空，这时就要用到非空断言操作符。
  Angular 模板中的\*\*非空断言操作符（!）也是同样的用途。
  比如在ngIf来检查过person是否是已定义的之后，就可以断言person属性是一定是已定义的。
```html
<!--如果没有人，这句话就不显示啦-->
<div *ngIf="person">
  The person's name is {{person!.name}}
</div>
```
  在 Angular 编译器把我的模板转换成 TypeScript 代码时，这个操作符会防止 TypeScript 报告 "person.name可能为null或undefined"的错误。与安全导航操作符不同的是，非空断言操作符不会防止出现null或undefined。 它只是告诉 TypeScript 的类型检查器对特定的属性表达式，不做 "严格空值检测"。如果打开了严格控制检测，那就要用到这个模板操作符，而其它情况下则是可选的。
### 15.类型转换函数$any($any(表达式))
  有时候，绑定表达式可能会报类型错误，并且它不能或很难指定类型。要消除这种报错，你可以使用 $any 转换函数来把表达式转换成 any 类型。
```html
<!-- Accessing an undeclared member -->
<div>
  The hero's marker is {{$any(hero).marker}}
</div>
```
  在这个例子中，当 Angular 编译器把模板转换成 TypeScript 代码时，$any 表达式可以防止 TypeScript 编译器报错说 marker 不是 Hero 接口的成员。$any 转换函数可以和 this 联合使用，以便访问组件中未声明过的成员。
```html
<!-- Accessing an undeclared member -->
<div>
  Undeclared members is {{$any(this).member}}
</div>
```
  $any转换函数可以在绑定表达式中的任何可以进行方法调用的地方使用。