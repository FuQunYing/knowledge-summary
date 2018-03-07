#Day15
##八、结构型指令（接03/02）
### 5.NgSwitch
  Angular 的 NgSwitch 实际上是一组相互合作的指令：NgSwitch、NgSwitchCase 和 NgSwitchDefault。
```html
<div [ngSwitch]="person?.emotion">
  <app-happy-person    *ngSwitchCase="'happy'"    [person]="person"></app-happy-person>
  <app-sad-person      *ngSwitchCase="'sad'"      [person]="person"></app-sad-person>
  <app-confused-person *ngSwitchCase="'app-confused'" [person]="person"></app-confused-person>
  <app-unknown-person  *ngSwitchDefault   [person]="person"></app-unknown-person>
</div>
```
  一个值(person.emotion)被被赋值给了NgSwitch，以决定要显示哪一个分支。
  NgSwitch本身不是结构型指令，而是一个属性型指令，它控制其它两个switch指令的行为。 这也就是为什么要写成[ngSwitch]而不是*ngSwitch的原因。NgSwitchCase 和 NgSwitchDefault 都是结构型指令。 所以要使用星号（*）前缀来把它们附着到元素上。 NgSwitchCase会在它的值匹配上选项值的时候显示它的宿主元素。 NgSwitchDefault则会当没有兄弟NgSwitchCase匹配上时显示它的宿主元素。
  同样的，NgSwitchCase 和 NgSwitchDefault 也可以解开语法糖，变成 <ng-template> 的形式。就像这样：
```html
<div [ngSwitch]="person?.emotion">
  <ng-template [ngSwitchCase]="'happy'">
    <app-happy-person [person]="person"></app-happy-person>
  </ng-template>
  <ng-template [ngSwitchCase]="'sad'">
    <app-sad-person [person]="person"></app-sad-person>
  </ng-template>
  <ng-template [ngSwitchCase]="'confused'">
    <app-confused-person [person]="person"></app-confused-person>
  </ng-template >
  <ng-template ngSwitchDefault>
    <app-unknown-person [person]="person"></app-unknown-person>
  </ng-template>
</div>
```
### 6.优先使用* 语法
  很明显，星号（*）语法比不带语法糖的形式更加清晰。 如果找不到单一的元素来应用该指令，可以使用<ng-container>作为该指令的容器。虽然很少用，但是需要知道，在幕后，Angular会创建<ng-template>。 当需要写自己的结构型指令时，就要使用<ng-template>了。
### 7.<ng-template>指令
  <ng-template>是一个 Angular 元素，用来渲染HTML。 它永远不会直接显示出来。 在渲染视图之前，Angular 会把<ng-template>及其内容替换为一个注释。
  如果没有使用结构型指令，而仅仅把一些别的元素包装进<ng-template>中，那些元素就是不可见的。 在下面的这个短语"hey say jump"中，中间的这个 "say " 就是如此。
```html
<p>hey</p>
<ng-template>
  <p>say </p>
</ng-template>
<p>jump</p>
```
  Angular就会抹掉中间的“say”。
### 8.使用<ng-container>把一些兄弟元素归为一组
  通常都要有一个根元素作为结构型指令的数组，列表元素（<li>）就是一个典型的供NgFor使用的宿主元素，就像这样：
```html
<li *ngFor="let person of lists">{{person.name}}</li>
```
  当没有这样的一个单一宿主元素时，就可以把这些内容包裹在一个原生的HTML元素容器中，比如div，并且把结构型指令附加到这个包裹上，就像这样：
```html
<div *ngIf="person">{{person.name}}</div>
```
  但引入另一个容器元素（通常是<span>或<div>）来把一些元素归到一个单一的根元素下，通常也会带来问题。这种用于分组的元素可能会破坏模板的外观表现，因为CSS的样式既不曾期待也不会接受这种新的元素布局。 比如，假设有下列分段布局：
```html
<p>
  我在大街上
  <span *ngIf="person">
    看到了 {{person.name}}
  </span>
  然后走了
</p>
```
  而CSS的样式规则是应用于<p>元素下的<span>的。
```css
p span { color: red; font-size: 70%; }
```
  这样渲染出来的样式就非常奇怪了，中间的“看到了”变小变红，本来是为其他地方准备的样式，但是被用到了这里。
  有些HTML元素需要所有的直属下级都具有特定的类型。 比如，<select>元素要求直属下级必须为<option>，那么我们就没办法把这些选项包装进<div>或<span>中。如果这样做：
```html
<div>
  选择我的最爱
  (<label><input type="checkbox" checked (change)="showSad = !showSad">show sad</label>)
</div>
<select [(ngModel)]="person">
  <span *ngFor="let perosn of lists">
    <span *ngIf="showSad || h.emotion !== 'sad'">
      <option [ngValue]="person">{{person.name}} ({{person.emotion}})</option>
    </span>
  </span>
</select>
```
  下拉列表绝对是空的啊，浏览器不会显示<span>里面的<option>啊。所以就要用到<ng-container>
  Angular的<ng-container>是一个分组元素，但它不会污染样式或元素布局，因为 Angular 压根不会把它放进 DOM 中。下面是重新实现的条件化段落，这次使用<ng-container>。
```html
<p>
  我在大街上
  <ng-container *ngIf="person">
    看到了 {{person.name}}
  </ng-container>
  然后走了
</p>
```
  这次的渲染就会是对的，p下面span的样式不会被用进来。
  再用<ng-container>来根据条件排除选择框中的某个<option>。
```html
<div>
  选择我的最爱
  (<label><input type="checkbox" checked (change)="showSad = !showSad">show sad</label>)
</div>
<select [(ngModel)]="person">
  <ng-container *ngFor="let perosn of lists">
    <ng-container *ngIf="showSad || h.emotion !== 'sad'">
      <option [ngValue]="person">{{person.name}} ({{person.emotion}})</option>
    </ng-container>
  </ng-container>
</select>
```
  这样的话，下拉框就正常工作了。
  <ng-container>是一个由 Angular 解析器负责识别处理的语法元素。 它不是一个指令、组件、类或接口，更像是 JavaScript 中 if 块中的花括号。判断为真就执行，不为真就不执行。
### 9.写一个结构型指令
  比如写一个名叫UnlessDirective的结构型指令，它是NgIf的反义词。 NgIf在条件为true的时候显示模板内容，而UnlessDirective则会在条件为false时显示模板内容。最后像这样:
```html
<p *appUnless="condition">条件属实就不显示这句话</p>
```
  创建指令很像创建组件：
  - 导入Directive装饰器（不再是Component）。
  - 导入符号Input、TemplateRef 和 ViewContainerRef，在任何结构型指令中都会需要它们。
  - 给指令类添加装饰器。
  - 设置 CSS 属性选择器 ，以便在模板中标识出这个指令该应用于哪个元素。
  首先就像这样：
```typescript
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({ selector: '[appUnless]'})
export class UnlessDirective {
}
```
  指令的选择器通常是把指令的属性名括在方括号中，如[myUnless]。 这个方括号定义出了一个 CSS 属性选择器。该指令的属性名应该拼写成小驼峰形式，并且带有一个前缀。 但是，这个前缀不能用ng，因为ng只属于 Angular 本身。 要选择一些简短的，适合自己或公司的或项目的前缀。 在这个例子中，前缀是my。而指令的类名用Directive结尾。
#### 9.1 TemplateRef 和 ViewContainerRef
  像这个例子一样的简单结构型指令会从 Angular 生成的<ng-template>元素中创建一个内嵌的视图，并把这个视图插入到一个视图容器中，紧挨着本指令原来的宿主元素<p>（不是子节点，而是兄弟节点）。可以使用TemplateRef取得<ng-template>的内容，并通过ViewContainerRef来访问这个视图容器。可以把它们都注入到指令的构造函数中，作为该类的私有属性。
```typescript
constructor(
  private templateRef: TemplateRef<any>,
  private viewContainer: ViewContainerRef) { }
```
#### 9.2 myUnless属性
  该指令的使用者会把一个true/false条件绑定到[myUnless]属性上。 也就是说，该指令需要一个带有@Input的myUnless属性。
```typescript
@Input() set appUnless(condition: boolean) {
  if (!condition && !this.hasView) {
    this.viewContainer.createEmbeddedView(this.templateRef);
    this.hasView = true;
  } else if (condition && this.hasView) {
    this.viewContainer.clear();
    this.hasView = false;
  }
}
```
  一旦该值的条件发生了变化，Angular 就会去设置 myUnless 属性，这时候，就需要为它定义一个设置器（setter）。如果条件为假，并且以前尚未创建过该视图，就告诉视图容器（ViewContainer）根据模板创建一个内嵌视图。如果条件为真，并且视图已经显示出来了，就会清除该容器，并销毁该视图。
  没有人会读取myUnless属性，因此它不需要定义设置器（getter）。
  最后完整的指令代码长这样：
```typescript
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
@Directive({ selector: '[appUnless]'})
export class UnlessDirective {
  private hasView = false;
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) { }
  @Input() set appUnless(condition: boolean) {
    if (!condition && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (condition && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
```
  最后这样用一下：
```html
<p *appUnless="condition" class="unless a">
  (A) condition为false，所以显示
</p>

<p *appUnless="!condition" class="unless b">
  (B) 尽管condition是false，但是被设置成了true，所以不显示	
</p>
```
  当condition为false时，顶部的段落就会显示出来，而底部的段落消失了。 当condition为true时，顶部的段落被移除了，而底部的段落显示了出来。
















































