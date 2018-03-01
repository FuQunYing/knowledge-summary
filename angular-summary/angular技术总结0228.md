# Day12
## 七、属性型指令
### 1.指令概览
  在angular中有三种类型的指令：
  - 组件--拥有模板的指令
  - 结构型指令--通过添加和移除 DOM 元素改变 DOM 布局的指令
  - 属性型指令--改变元素、组件或其它指令的外观和行为的指令。
  组件是这三种指令中最常见的，结构型指令会修改视图的结构，属性指令会改变一个元素的外观或者行为
### 2.创建一个简单的属性型指令
  属性型指令至少需要一个带有@Directive装饰器的控制器类。该装饰器指定了一个用于标识属性的选择器。 控制器类实现了指令需要的指令行为。
  这次就写个简单的属性型指令，鼠标悬停时，改变背景色，就像这样：
```html
<p appHightlight>悬停改变背景色</p>
```
#### 2.1 编写指令代码
  首先创建attribute-directives项目文件夹，在文件夹下创建highlight.directive.ts
```typescript
import { Directive, ElementRef, Input } from '@angular/core';
@Directive({ selector: '[appHighlight]' })//要用的就是这个名字啦
export class HighlightDirective {
    constructor(el: ElementRef) {
       el.nativeElement.style.backgroundColor = 'black';//颜色随便写
    }
}
```
  import语句指定了从 Angular 的core库导入的一些符号。Directive提供@Directive装饰器功能。ElementRef注入到指令构造函数中。这样代码就可以访问 DOM 元素了。Input将数据从绑定表达式传达到指令中。然后，@Directive装饰器函数以配置对象参数的形式，包含了指令的元数据。@Directive装饰器需要一个 CSS 选择器，以便从模板中识别出关联到这个指令的 HTML。用于 attribute 的 CSS 选择器就是属性名称加方括号。 这里，指令的选择器是[myHighlight]，Angular 将会在模板中找到所有带myHighlight属性的元素。
#### 2.2 为什么不直接叫做“highlight”
```txt
  尽管highlight 是一个比 myHighlight 更简洁的名字，而且它确实也能工作。 但是最佳实践是在选择器名字前面添加前缀，以确保它们不会与标准 HTML 属性冲突。 它同时减少了与第三方指令名字发生冲突的危险。
  而且不能给highlight指令添加ng前缀。 那个前缀属于 Angular，使用它可能导致难以诊断的 bug。例如，这个简短的前缀my可以帮助区分自定义指令。
```
  @Directive元数据之后就是该指令的控制器类，名叫HighlightDirective，它包含该指令的逻辑。 然后导出HighlightDirective，以便让它能从其它组件中访问到。Angular 会为每个匹配的元素创建一个指令控制器类的实例，并把 Angular 的ElementRef和Renderer注入进构造函数。 ElementRef是一个服务，它赋予我们通过它的nativeElement属性直接访问 DOM 元素的能力。 Renderer服务允许通过代码设置元素的样式。
### 3.使用属性型指令
  要使用这个新的HighlightDirective，创建一个模板，把这个指令作为属性应用到一个段落(p)元素上。 用 Angular 的话说，<p>元素就是这个属性型指令的宿主。然后把这个模板放到它的app.component.html文件中，就像这样：
```html
<h1>属性型指令</h1>
<p appHightlight>悬停变色</p>
```
  然后，在AppComponent中引用这个模板：
```typescript
import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  color: string;
}
```
  接下来，添加了一个import语句来获得Highlight指令类，并把这个类添加到 NgModule 元数据的declarations数组中。 这样，当 Angular 在模板中遇到myHighlight时，就能认出这是指令了。
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HighlightDirective } from './highlight.directive';
@NgModule({
  imports: [ BrowserModule ],
  declarations: [
    AppComponent,
    HighlightDirective
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
```
**指令生效了吗？**
```txt
  如果没有，记着先设置@NgModule的declarations数组，
“EXCEPTION: Template parse errors:
  Can't bind to 'myHighlight' since it isn't a known property of 'p'.”
这个错误信息，就是Angular 检测到你正在尝试绑定到某些东西，但它不认识。所以它在declarations元数据数组中查找。 把HighlightDirective列在元数据的这个数组中，Angular 就会检查对应的导入语句，从而找到highlight.directive.ts，并了解myHightlight的功能。
```
  总结：Angular 在<p>元素上发现了一个myHighlight属性。 然后它创建了一个HighlightDirective类的实例，并把所在元素的引用注入到了指令的构造函数中。 在构造函数中，我们把<p>元素的背景设置为了黄色。
### 4.响应用户引发的事件
  当前，myHighlight只是简单的设置元素的颜色。 这个指令应该在用户鼠标悬浮一个元素时，设置它的颜色。先把HostListener加进导入列表中，同时再添加Input符号，一会儿就用到了：
```typescript
import { Directive, ElementRef, HostListener, Input } from '@angular/core';
```
  然后使用HostListener装饰器添加两个事件处理器，它们会在鼠标进入或离开时进行响应。
```typescript
@HostListener('mouseenter') onMouseEnter() {
  this.highlight('yellow');
}
@HostListener('mouseleave') onMouseLeave() {
  this.highlight(null);
}
private highlight(color: string) {
  this.el.nativeElement.style.backgroundColor = color;
}
```
  @HostListener装饰器引用属性型指令的宿主元素，在这个例子中就是<p>。
```txt
    也可以通过标准的JavaScript方式手动给宿主 DOM 元素附加一个事件监听器。 但这种方法至少有三个问题：
    必须正确的书写事件监听器。
    当指令被销毁的时候，必须拆卸事件监听器，否则会导致内存泄露。
    必须直接和 DOM API 打交道，应该避免这样做。
```
  这些处理器委托给了一个辅助方法，它用于为DOM元素设置颜色，el就是在构造器中声明和初始化过的。
```typescript
  constructor(private el: ElementRef) { }
```
下面是修改后的指令代码：
```typescript
import { Directive, ElementRef, HostListener, Input } from '@angular/core';
@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  constructor(private el: ElementRef) { }
  @HostListener('mouseenter') onMouseEnter() {
    this.highlight('yellow');
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(null);
  }
  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
 ```






















