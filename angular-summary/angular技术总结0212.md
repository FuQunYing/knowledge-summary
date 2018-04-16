#Day06
## 二、模板语法（接02/11）
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