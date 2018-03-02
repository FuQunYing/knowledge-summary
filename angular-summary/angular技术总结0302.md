#Day14
## 八、结构型指令
### 1.什么是结构型指令
  结构型指令的职责是HTML布局。 它们塑造或重塑DOM的结构，比如添加、移除或维护这些元素。像其它指令一样，你可以把结构型指令应用到一个宿主元素上。 然后它就可以对宿主元素及其子元素做点什么。
  结构型指令非常容易识别。 比如下面的代码，星号（*）被放在指令的属性名之前。
```html
<div *ngIf="person" >{{person.name}}</div>
```
  没有方括号，没有圆括号，只是把*ngIf设置为一个字符串。
  在这个例子中，星号(*)是个简写方法，而这个字符串是一个微语法，而不是通常的模板表达式。 Angular会解开这个语法糖，变成一个<ng-template>标记，包裹着宿主元素及其子元素。 每个结构型指令都可以用这个模板做点不同的事情。
  三个常用的内置结构型指令 —— NgIf、NgFor和NgSwitch...。 模板语法里面已经说过了，并且在Angular文档的例子中到处都在用它。下面是模板中的例子：
```html
<div *ngIf="person" >{{hero.name}}</div>
<ul>
  <li *ngFor="let person of lists">{{hero.name}}</li>
</ul>
<div [ngSwitch]="person?.emotion">
  <app-happy-hero *ngSwitchCase="'happy'" [person]="person"></app-happy-hero>
  <app-sad-hero   *ngSwitchCase="'sad'"   [person]="person"></app-sad-hero>
  <app-confused-hero *ngSwitchCase="'app-confused'" [person]="person"></app-confused-hero>
  <app-unknown-hero  *ngSwitchDefault [person]="person"></app-unknown-hero>
</div>
```
  使用方法之前已经说过了，现在看看工作原理，敲黑板。
**指令的拼写形式**
```txt
  这一节里面，会说到指令同时具有两种拼写形式大驼峰UpperCamelCase和小驼峰lowerCamelCase，比如之前已经看过的NgIf和ngIf。 这里的原因在于，NgIf引用的是指令的类名，而ngIf引用的是指令的属性名*。
  指令的类名拼写成大驼峰形式（NgIf），而它的属性名则拼写成小驼峰形式（ngIf）。
  还有另外两种Angular指令，组件 和 属性型指令。
  组件可以在原生HTML元素中管理一小片区域的HTML。从技术角度说，它就是一个带模板的指令。属性型指令会改变某个元素、组件或其它指令的外观或行为。 比如，内置的NgStyle指令可以同时修改元素的多个样式。
  在一个宿主元素上可以应用多个属性型指令，但只能应用一个结构型指令。
```
#### 2.NgIf案例分析
  先看下ngIf。它是一个很好的结构型指令案例：它接受一个布尔值，并据此让一整块DOM树出现或消失。
```html
<p *ngIf="true">
  当前表达式是true，这个文字会显示
</p>
<p *ngIf="false">
  当前表达式为false，这个文字不会显示
</p>
```
  ngIf指令并不是使用CSS来隐藏元素的。它会把这些元素从DOM中物理删除。 使用浏览器的开发者工具就可以确认这一点。在控制台里，可以看到
```html
	<!--bindings={"ng-reflect-ng-if":"false"}-->
	第一段文字出现在了DOM中，而第二段则没有，在第二段的位置上是一个关于“绑定”的注释，就是上面这句话。
  当条件为假时，NgIf会从DOM中移除它的宿主元素，取消它监听过的那些DOM事件，从Angular变更检测中移除该组件，并销毁它。 这些组件和DOM节点可以被当做垃圾收集起来，并且释放它们占用的内存。
```
**为什么是移除而不是隐藏？**
  指令也可以通过把它的display风格设置为none而隐藏不需要的段落。
```html
<p [style.display]="'block'">
  当前display为block，元素可见
</p>
<p [style.display]="'none'">
  当前display为none，元素不可见
</p>
<!--即使不可见，元素也是留在DOM中的-->
```
```txt
  对于简单的段落，移除还是隐藏之间没啥大的差异，但是对于资源占用较多的组件是不一样的。当隐藏掉一个元素时，组件的行为还在继续 —— 它仍然附加在它所属的DOM元素上， 它也仍在监听事件。Angular会继续检查哪些能影响数据绑定的变更。 组件原本要做的那些事情仍在继续。
  虽然不可见，组件及其各级子组件仍然占用着资源，而这些资源如果分配给别人可能会更有用。 在性能和内存方面的负担相当可观，响应度会降低，而用户却可能无法从中受益。当然，从积极的一面看，重新显示这个元素会非常快。 组件以前的状态被保留着，并随时可以显示。 组件不用重新初始化 —— 该操作可能会比较昂贵。 这时候隐藏和显示就成了正确的选择。
  但是，除非有非常强烈的理由来保留它们，否则移除用户看不见的那些DOM元素是更好的，并且使用NgIf这样的结构型指令来收回用不到的资源。
  同样的考量也适用于每一个结构型指令，无论是内置的还是自定义的。 应该时刻提醒自己以及指令的使用者，来仔细考虑添加元素、移除元素以及创建和销毁组件的后果。
```
### 3.星号（*）前缀
  星号是一个用来简化更复杂语法的“语法糖”。 从内部实现来说，Angular把*ngIf 属性 翻译成一个<ng-template> 元素 并用它来包裹宿主元素，代码如下：
```html
<ng-template [ngIf]="person">
  <div>{{person.name}}</div>
</ng-template>
```
  *ngIf指令被移到了<ng-template>元素上。在那里它变成了一个属性绑定[ngIf]。
  <div>上的其余部分，包括它的class属性在内，移到了内部的<ng-template>元素上。
  第一种形态永远不会真的渲染出来。 只有最终产出的结果才会出现在DOM中。Angular会在真正渲染的时候填充<ng-template>的内容，并且把<ng-template>替换为一个供诊断用的注释。
NgFor和NgSwitch...指令也都遵循同样的模式。
### 4.*ngFor
  Angular会把*ngFor用同样的方式把星号（）语法的template属性转换成<ng-template>元素*。
  同时用了三种方法的应用，长这样：
```html
<div *ngFor="let person of lists; let i=index; let odd=odd; trackBy: trackById" [class.odd]="odd">
  ({{i}}) {{person.name}}
</div>
<ng-template ngFor let-person [ngForOf]="lists" let-i="index" let-odd="odd" [ngForTrackBy]="trackById">
  <div [class.odd]="odd">({{i}}) {{person.name}}</div>
</ng-template>
```
  它明显比ngIf复杂得多, NgFor指令比本章展示过的NgIf具有更多的必选特性和可选特性。 至少NgFor会需要一个循环变量（let hero）和一个列表（heroes）。
  可以通过把一个字符串赋值给ngFor来启用这些特性，这个字符串使用Angular的微语法。
```txt
  ngFor字符串之外的每一样东西都会留在宿主元素（<div>）上，也就是说它移到了<ng-template>内部。 在上面的例子中，[ngClass]="odd"留在了<div>上。
```
#### 4.1 微语法
  Angular微语法能让我们通过简短的、友好的字符串来配置一个指令。 微语法解析器把这个字符串翻译成<ng-template>上的属性：
  - let关键字声明一个模板输入变量，我们会在模板中引用它。本例子中，这个输入变量就是person、i和odd。 解析器会把let person、let i和let odd翻译成命名变量let-person、let-i和let-odd。
  - 微语法解析器接收of和trackby，把它们首字母大写（of -> Of, trackBy -> TrackBy）， 并且给它们加上指令的属性名（ngFor）前缀，最终生成的名字是ngForOf和ngForTrackBy。 还有两个NgFor的输入属性，指令据此了解到列表是heroes，而track-by函数是trackById。
  - NgFor指令在列表上循环，每个循环中都会设置和重置它自己的上下文对象上的属性。 这些属性包括index和odd以及一个特殊的属性名$implicit（隐式变量）。
  - let-i和let-odd变量是通过let i=index和let odd=odd来定义的。 Angular把它们设置为上下文对象中的index和odd属性的当前值。
  - 上下文中的属性let-person没有指定过，实际上它来自一个隐式变量。 Angular会把let-hero设置为上下文对象中的$implicit属性，NgFor会用当前迭代中的英雄初始化它。
  - NgFor是由NgForOf指令来实现的。请参阅NgForOf API reference来了解NgForOf指令的更多属性及其上下文属性。
#### 4.2 模板输入变量
  模板输入变量是这样一种变量，你可以在单个实例的模板中引用它的值。 这个例子中有好几个模板输入变量：person、i和odd。 它们都是用let作为前导关键字。模板输入变量和模板引用变量是不同的，无论是在语义上还是语法上。
  使用let关键字（如let person）在模板中声明一个模板输入变量。 这个变量的范围被限制在所重复模板的单一实例上。 事实上，我们可以在其它结构型指令中使用同样的变量名。
而声明模板引用变量使用的是给变量名加#前缀的方式（#var）。 一个引用变量引用的是它所附着到的元素、组件或指令。它可以在整个模板的任意位置访问。
  模板输入变量和引用变量具有各自独立的命名空间。let person中的person和#person中的person并不是同一个变量。
#### 4.3 每个宿主元素上只能有一个结构型指令
  有时候想要只有在特定条件为真时才反复渲染一个HTML块，但是angular并不允许*ngIf和*ngFor放在同一个宿主元素上。
  原因就是，结构型指令可能会对宿主元素及其子元素做很复杂的事。当两个指令放在同一个元素上时，谁先谁后？NgIf优先还是NgFor优先？NgIf可以取消NgFor的效果吗？ 如果要这样做，Angular 应该如何把这种能力泛化，以取消其它结构型指令的效果呢？
  解决方案：把*ngIf放在一个"容器"元素上，再包装进 *ngFor 元素。 这个元素可以使用ng-container，以免引入一个新的HTML层级。























