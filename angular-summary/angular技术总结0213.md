#Day07
## 二、模板语法（接02/12）
### 9.内置指令 - 内置属性指令
  属性型指令会监听和修改其它HTML元素或组件的行为、元素属性（Attribute）、DOM属性（Property）。 它们通常会作为HTML属性的名称而应用在元素上。
  常用的属性型指令
  - NgClass - 添加或移除一组CSS类
  - NgStyle - 添加或移除一组CSS样式
  - NgModel - 双向绑定到HTML表单元素
#### 9.1 NgClass 指令
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
#### 9.2 NgStyle指令
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
#### 9.3 NgModel - 使用[(ngModel)]双向绑定到表单元素
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
### 10.内置指令 - 内置结构型指令
#### 10.1 NgIf指令
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
#### 10.2 NgFor指令
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
#### 10.3 模板输入变量
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
#### 10.4 NgSwitch
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

















