#Day13
### 5.使用数据绑定向指令传递值
  现在的高亮颜色是硬编码在指令中的，这不够灵活。 我们应该让指令的使用者可以在模板中通过绑定来设置颜色。
首先先把highlightColor属性添加到指令类中，就像这样：
```typescript
@Input() highlightColor: string;
```
#### 5.1 绑定到@Input属性
  注意看@Input装饰器。它往类上添加了一些元数据，从而让该指令的highlightColor能用于绑定。它之所以称为输入属性，是因为数据流是从绑定表达式流向指令内部的。 如果没有这个元数据，Angular就会拒绝绑定。
  把下列指令绑定变量添加到AppComponent的模板中：
```html
<p appHightlight highlightColor="yellow">黄色的</p>
<p appHightlight [highlightColor]="'orange'">橙色的</p>
```
  把color属性添加到AppComponent中：
```typescript
export class AppComponent {
  color = 'yellow';
}
```
  让它通过属性绑定来控制高亮颜色。
```html
<p appHightlight [highlightColor]="color">高亮父组件的颜色</p>
```
  这样就还行，但是还可以在应用该指令时在同一个属性中设置颜色，就像这样：
```html
<p [appHighlight]="color">高亮</p>
```
  [myHighlight]属性同时做了两件事：把这个高亮指令应用到了<p>元素上，并且通过属性绑定设置了该指令的高亮颜色。 然后我复用了该指令的属性选择器[myHighlight]来同时完成它们。 这是清爽、简约的语法。
  然后还要把该指令的highlightColor改名为myHighlight，因为它是颜色属性目前的绑定名。
```typescript
@Input() myHighlight: string;
```
  但是这样不怎么地，因为myHighlight是一个比较差的属性名，而且不能反映该属性的意图。
  不过，angular允许随意命名该指令的属性，并且给它指定一个用于绑定的别名。
#### 5.2 绑定到@Input别名
  恢复原始属性名，并在@Input的参数中把选择器myHighlight指定为别名。
```typescript
@Input('appHighlight') highlightColor: string;
```
  在指令内部，该属性叫highlightColor，在外部，当我们绑定到它时，它叫myHighlight。
  这是最好的结果：理想的内部属性名，理想的绑定语法：
```html
<p [appHighlight]="color">Highlight me!</p>
```
  现在，绑定到了highlightColor属性，并修改onMouseEnter()方法来使用它。 如果有人忘了绑定到highlightColor，那就用红色进行高亮。
```typescript
@HostListener('mouseenter') onMouseEnter() {
  this.highlight(this.highlightColor || 'red');
}
```
  最终指令长这样：
```typescript
import { Directive, ElementRef, HostListener, Input } from '@angular/core';
@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  constructor(private el: ElementRef) { }
  @Input('appHighlight') highlightColor: string;
  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.highlightColor || 'red');
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(null);
  }
  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
```
### 6.在模板中测试
  把AppComponent改成一个测试程序，它让你可以通过单选按钮来选取高亮颜色，并且把我选取的颜色绑定到指令中。
  然后app.component.html长这样：
```html
<h1>指令</h1>
<h4>选颜色</h4>
<div>
  <input type="radio" name="colors" (click)="color='lightgreen'">绿色
  <input type="radio" name="colors" (click)="color='yellow'">黄色
  <input type="radio" name="colors" (click)="color='cyan'">青色
</div>
<p [appHighlight]="color">亮起来</p>
```
  然后修改AppComponent.color,让它不再有初始值：
```typescript
export class AppComponent {
  color: string;
}
```
### 7.绑定到第二个属性
  本例的指令只有一个可定制属性，真实的应用通常需要更多。目前，默认颜色（它在用户选取了高亮颜色之前一直有效）被硬编码为红色。我们要让模板的开发者也可以设置默认颜色。
  把第二个名叫defaultColor的输入属性添加到HighlightDirective中：
  然后highlight.directive.ts被改成这样：
```typescript
import { Directive, ElementRef, HostListener, Input } from '@angular/core';
@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  constructor(private el: ElementRef) { }
  @Input() defaultColor: string;
  @Input('appHighlight') highlightColor: string;
  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.highlightColor || this.defaultColor || 'red');
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(null);
  }
  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
```
  修改该指令的onMouseEnter，让它首先尝试使用highlightColor进行高亮，然后用defaultColor，如果它们都没有指定，那就用红色作为后备。
```typescript
@HostListener('mouseenter') onMouseEnter() {
  this.highlight(this.highlightColor || this.defaultColor || 'red');
}
```
  当已经绑定过myHighlight属性时，要如何绑定到第二个属性呢？
  像组件一样，直接可以绑定到指令的很多属性，只要把它们依次写在模板中就行了。 开发者可以绑定到AppComponent.color，并且用紫罗兰色作为默认颜色，就像这样：
```html
<p [appHighlight]="color" defaultColor="violet">
  亮起来
</p>
```
  Angular之所以知道defaultColor绑定属于HighlightDirective，是因为之前已经通过@Input装饰器把它设置成了公共属性。
**为什么要加@Input？**
  在这个例子中hightlightColor是HighlightDirective的一个输入型属性。它没有用别名时的代码是这样：
```typescript
@Input() highlightColor: string;
```
  用别名时的代码长这样：
```typescript
@Input('appHighlight') highlightColor: string;
```
  无论哪种方式，@Input装饰器都告诉Angular，该属性是公共的，并且能被父组件绑定。 如果没有@Input，Angular就会拒绝绑定到该属性。但之前也曾经把模板HTML绑定到组件的属性，而且从来没有用过@Input。 有啥区别呢。
  区别在于信任度不同。 Angular把组件的模板看做从属于该组件的。 组件和它的模板默认会相互信任。 这也就是意味着，组件自己的模板可以绑定到组件的任意属性，无论是否使用了@Input装饰器。但组件或指令不应该盲目的信任其它组件或指令。 因此组件或指令的属性默认是不能被绑定的。 从Angular绑定机制的角度来看，它们是私有的，而当添加了@Input时，它们变成了公共的 只有这样，它们才能被其它组件或属性绑定。
  所以可以根据属性名在绑定中出现的位置来判定是否要加@Input。
  - 当它出现在等号右侧的模板表达式中时，它属于模板所在的组件，不需要@Input装饰器。
  - 当它出现在等号左边的方括号（[ ]）中时，该属性属于其它组件或指令，它必须带有@Input 装饰器。
  比如 <p [appHighlight]="color">Highlight me!</p>，在这句代码里面，color属性位于右侧的绑定表达式中，它属于模板所在的组件。 该模板和组件相互信任。因此color不需要@Input装饰器。myHighlight属性位于左侧，它引用了MyHighlightDirective中一个带别名的属性，它不是模板所属组件的一部分，因此存在信任问题。 所以，该属性必须带@Input装饰器
  

























