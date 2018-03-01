# Day05
## 二、模板语法
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
| 数据方向 | 语法 | 绑定类型 |
| - | :-: | -: |
| 单向：从数据源到视图目标 | {{expression}}[target]="expression" bind-target="expression"| 插值表达式 Property Attribute 类 样式 |
| 单向：从视图目标到数据源 | (target)="statement" on-target="statement"| 事件 |
| 双向 | [(target)]="expression" bindon-target="expression"| 双向 |
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
| 绑定类型 | 目标 | 示例 |
| - | :-: | :-: |
| Property | 元素的Property，组件的Property，指令的Property | <img [src]="imgUrl"><br /><app-person-detail [person]="currentPerson"></app-person-detail><br /><div [ngClass]="{'special': isSpecial}"></div> |
| 事件 | 元素的事件，组件的事件，指令的事件 | <button (click)="onSave()">Save</button><br /><app-person-detail (deleteRequest)="deletePerson()"></app-person-detail><br /><div (myClick)="clicked=$event" clickable>click me</div> |
| 双向 | 事件与Property | <input [([ngModel]="name"> |
| Attribute | attribute（例外情况） | <button [attr.aria-label]="help">help</button> |
| CSS类 | CSS Property | <div [class.special]="isSpecial">Special</div> |
| 样式 | style Property | <button [style.color]="isSpecial ? 'red' : 'green'"> |










