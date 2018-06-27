表单
##一、用户输入
### 1.绑定到用户输入事件。
  通过Angular事件绑定机制来相应DOM事件，许多DOM事件是由用户输入触发的，绑定这些事件就可以获取用户输入啦。
  要绑定 DOM 事件，只要把 DOM 事件的名字包裹在圆括号中，然后用放在引号中的模板语句对它赋值就可以了。
  比如我要绑定一个单击事件，就这样写：
```html
<button (click)="onClickMe()">Click me!</button>
```
  等号左边的(click)表示把按钮的点击事件作为绑定目标。 等号右边引号中的文本是模板语句，通过调用组件的onClickMe方法来响应这个点击事件。
  写绑定时，需要知道模板语句的执行上下文。 出现在模板语句中的每个标识符都属于特定的上下文对象。 这个对象通常都是控制此模板的 Angular 组件。上面就写了一行HTML模板，整个的组件长这样：
```typescript
@Component({
  selector: 'app-click-me',
  template: `
    <button (click)="onClickMe()">Click me!</button>
    {{clickMessage}}`
})
export class ClickMeComponent {
  clickMessage = '';
  onClickMe() {
    this.clickMessage = '37大旗永不倒！';
  }
}
```
  当用户点击按钮时，Angular 调用ClickMeComponent的onClickMe方法。
### 2.通过$event对象取得用户输入
  DOM事件可以携带可能对组件有用的信息，比如以keyup事件为例，在每个敲击键盘时获取用户输入。下面的代码监听keyup事件，并将整个事件载荷 ($event) 传递给组件的事件处理器。
```html
template: `
  <input (keyup)="onKey($event)">
  <p>{{values}}</p>
`
```
  当用户按下并释放一个按键时，触发keyup事件，Angular 在$event变量提供一个相应的 DOM 事件对象，上面的代码将它作为参数传递给onKey()方法。
```typescript
export class KeyUpComponent_v1 {
  values = '';
  onKey(event: any) { // 没有类型
    this.values += event.target.value + ' | ';
  }
}
```
  $event对象的属性取决于 DOM 事件的类型。例如，鼠标事件与输入框编辑事件包含了不同的信息。所有标准 DOM 事件对象都有一个target属性， 引用触发该事件的元素。 在本例中，target是<input>元素， event.target.value返回该元素的当前内容。在组件的onKey()方法中，把输入框的值和分隔符 (|) 追加组件的values属性。 使用插值表达式来把存放累加结果的values属性回显到屏幕上。
  加入我要输入abc，然后再一个一个的删除，那界面就先显示a，ab，abc，我删除的时候又显示ab，a，空白，加入我用event.key替代event.target.value，积累各个按键本身，这样同样的用户输入可以产生：a，b，c，backspace，backspace，backspace。
#### 2.1 $event的类型
  上面将$event转换为any类型。 这样简化了代码，但是有成本。 没有任何类型信息能够揭示事件对象的属性，防止简单的错误。
  比如下面，使用带类型的方法：
```typescript
export class KeyUpComponent_v1 {
  values = '';
  onKey(event: KeyboardEvent) { // 这次的event给了类型	
    this.values += (<HTMLInputElement>event.target).value + ' | ';
  }
}
```
  $event的类型现在是KeyboardEvent。 不是所有的元素都有value属性，所以它将target转换为输入元素。 OnKey方法更加清晰的表达了它期望从模板得到什么，以及它是如何解析事件的。
#### 2.2 传入$event靠不住
  类型化事件对象揭露了重要的一点，即反对把整个 DOM 事件传到方法中，因为这样组件会知道太多模板的信息。 只有当它知道更多它本不应了解的 HTML 实现细节时，它才能提取信息。 这就违反了模板（用户看到的）和组件（应用如何处理用户数据）之间的分离关注原则。
  所以需要用模板引用变量来解决。
### 3.从一个模板中引用变量获取用户输入
  使用 Angular 的模板引用变量。 这些变量提供了从模块中直接访问元素的能力。 在标识符前加上井号 (#) 就能声明一个模板引用变量。
  下面的代码里面使用了局部模板变量，在一个超简单的模板中实现按键反馈功能。
```typescript
@Component({
  selector: 'app-loop-back',
  template: `
    <input #box (keyup)="0">
    <p>{{box.value}}</p>
  `
})
export class LoopbackComponent { }
```
  这个模板引用变量名叫box，在<input>元素声明，它引用<input>元素本身。 代码使用box获得输入元素的value值，并通过插值表达式把它显示在<p>标签中。这个模板完全是完全自包含的。它没有绑定到组件，组件也没做任何事情。
  在输入框中输入，就会看到每次按键时，显示也随之更新了。
  除只绑定一个事件，否则这将完全无法工作。只有在应用做了些异步事件（如击键），Angular 才更新绑定（并最终影响到屏幕）。上面代码将keyup事件绑定到了数字0，这是可能是最短的模板语句。 虽然这个语句不做什么，但它满足 Angular 的要求，所以 Angular 将更新屏幕。
  从模板变量获得输入框比通过$event对象更加简单。 下面的代码重写了之前keyup示例，它使用变量来获得用户输入。
```typescript
@Component({
  selector: 'app-key-up2',
  template: `
    <input #box (keyup)="onKey(box.value)">
    <p>{{values}}</p>
  `
})
export class KeyUpComponent_v2 {
  values = '';
  onKey(value: string) {
    this.values += value + ' | ';
  }
}
```
  这个方法最漂亮的一点是：组件代码从视图中获得了干净的数据值。再也不用了解$event变量及其结构了。
### 4.按键事件过滤（通过key.enter）
  (keyup)事件处理器监听每一次按键。 有时只在意回车键，因为它标志着用户结束输入。 解决这个问题的一种方法是检查每个$event.keyCode，只有键值是回车键时才采取行动。更简单的方法是：绑定到 Angular 的keyup.enter 模拟事件。 然后，只有当用户敲回车键时，Angular 才会调用事件处理器。就像下面这样：
```typescript
@Component({
  selector: 'app-key-up3',
  template: `
    <input #box (keyup.enter)="onEnter(box.value)">
    <p>{{value}}</p>
  `
})
export class KeyUpComponent_v3 {
  value = '';
  onEnter(value: string) { this.value = value; }
}
```
  只有当输入结束，按下enter键的时候，页面才会展示出用户输入的值。
### 5.失去焦点事件
  在上面的代码里，如果用户没有先按回车键，而是移开了鼠标，点击了页面中其它地方，输入框的当前值就会丢失。 只有当用户按下了回车键候，组件的values属性才能更新。
  下面通过同时监听输入框的回车键和失去焦点事件来修正这个问题：
```typescript
@Component({
  selector: 'app-key-up4',
  template: `
    <input #box
      (keyup.enter)="update(box.value)"
      (blur)="update(box.value)">
    <p>{{value}}</p>
  `
})
export class KeyUpComponent_v4 {
  value = '';
  update(value: string) { this.value = value; }
}
```
### 6.结合在一起
  现在在一个小例子中把这些全部用上，能够显示人物列表，并把新的人物添加到列表里面，用户可以通过输入人物名字和单击按钮进行添加，最后代码长这样：
```typescript
@Component({
    selector:'app-little-tour',
    template:`
    	<inpput #newPerson (keyup.enter)="addPerson(newPerson.value)"
    			(blur)="addPerson(newPerson.value);newPerson.value=''">
    	<button (click)="addPerson(newPerson.value)">添加</button>
    	<ul><li *ngFor="let person of lists">{{person}}</li></ul>
    `
})
export class LittleTourComponent{
    lists=["许嵩","山田凉介","知念侑李","夏目贵志"];
    addPerson(newPerson:string){
        if(newPerson) this.lists.push(newPerson)
    }
}
```
  最后的效果就是，单击按钮添加新人物，失去焦点或者回车添加新人物。
**总结**
  - 使用模板变量引用元素，newPerson模板变量引用了<input>元素，可以在<input>的任何兄弟或子级元素中引用newPerson。
  - 传递数值，而不是元素，获取输入框的值然后传递给组件的addPerson，不是传递给newPerson。
  - 保持模板语句简单 — (blur)事件被绑定到两个 JavaScript 语句。 第一句调用addPerson，第二句newPerson.value=''在添加新人物到列表中后清除输入框。
##二、模板驱动表单
  表单用的太多，用它来执行登录、求助、下单、预订机票、安排会议，以及不计其数的其它数据录入任务。
  在开发表单时，创建数据方面的体验是非常重要的，它能指引用户明细、高效的完成工作流程。
  开发表单需要设计能力（嗯，设计什么的先不管），而框架支持双向数据绑定、变更检测、验证和错误处理，开始学习！
  过程一览：
  - 用组件和模板构建Angular表单。
  - 用ngModel 创建双向数据绑定，以读取和写入输入控件的值。
  - 跟踪状态的变化，并验证表单控件。
  - 使用特殊的CSS类来跟踪控件的状态并给出视觉反馈。
  - 向用户显示验证错误提示，以及启用/禁用表单控件。
  - 使用模板引用变量在HTML元素之间共享信息。
### 1.模板驱动的表单
  利用 Angular 模板，可以构建几乎所有表单 — 登录表单、联系人表单…… 以及任何的商务表单。 可以创造性的摆放各种控件、把它们绑定到数据、指定校验规则、显示校验错误、有条件的禁用或 启用特定的控件、触发内置的视觉反馈等等，不胜枚举。
  它用起来很简单，这是因为 Angular 处理了大多数重复、单调的任务，避免自己掉进去。
  比如，要构建一个“模板驱动”表单，这是一个职业介绍所，使用这个表单来维护每个人的个人信息。
  表单中的三个字段，其中两个是必填的。必填的字段在左侧有个绿色的竖条，方便用户分辨哪些是必填项。如果删除了英雄的名字，表单就会用醒目的样式把验证错误显示出来。如果必填项没有填，提交按钮就会被禁用，会有红色提示文字。
  步骤如下：
```txt
    第一，创建Person模型类。
    第二，创建控制此表单的组件。
    第三、创建具有初始表单布局的模板。
    第四、使用ngModel双向数据绑定语法把数据属性绑定到每个表单输入控件。
    第五、往每个表单输入控件上添加name属性 (attribute)。
    第六、添加自定义 CSS 来提供视觉反馈。
    第七、显示和隐藏有效性验证的错误信息。
    第八、使用 ngSubmit 处理表单提交。
    第九、禁用此表单的提交按钮，直到表单变为有效。
```
### 2.搭建
  创建一个新的angular-forms的项目先。
### 3.创建Person模型类
  当用户输入表单数据时，需要捕获它们的变化，并更新到模型的实例中。 除非知道模型里有什么，否则无法设计表单的布局。
  最简单的模型是个“属性包”，用来存放应用中一件事物的事实。 这里使用三个必备字段 (id、name、power)，和一个可选字段 (cp)。
  首先创建person.ts
```typescript
export class Person {
  constructor(
    public id: number,
    public name: string,
    public power: string,
    public cp?: string
  ) {  }
}
```
  TypeScript 编译器为每个public构造函数参数生成一个公共字段，在创建新的英雄实例时，自动把参数值赋给这些公共字段。cp是可选的，调用构造函数时可省略，注意cp?中的问号 (?)。
  然后创建新人物：
```typescript
let myPerson =  new Person(42, 'Yamada',
                       '唱歌跳舞演戏样样精通',
                       'Chinen');
console.log( myPerson.name+'是我的人'); 
```
### 4.创建表单组件
  Angular 表单分为两部分：基于 HTML 的模板和组件类，用来程序处理数据和用户交互。 先从组件类开始，是因为它可以简要说明人物编辑器能做什么。
  初始代码长这样：
```typescript
import { Component } from '@angular/core';
import { Person }    from './person';

@Component({
  selector: 'app-perosn-form',
  templateUrl: './person-form.component.html'
})
export class PersonFormComponent {
  powers = ['帅', '又高又帅','唱歌超好', '跳舞帅炸'];
  model = new Person(20, 'Yamada', this.powers[0], 'Chinen');
  submitted = false;
  onSubmit() { this.submitted = true; }
  // 添加一个diagnostic属性，以返回这个模型的 JSON 形式。在开发过程中，它用于调试，最后清理时会丢弃它。
  get diagnostic() { return JSON.stringify(this.model); }
}
```
  现在还没哟表单相关的东西，就是普通的组件：
  这段代码导入了Angular核心库以及刚刚创建的Person模型。@Component选择器“person-form”表示可以用<person-form>标签把这个表单放进父模板。moduleId: module.id属性设置了基地址，用于从相对模块路径加载templateUrl。templateUrl属性指向一个独立的 HTML 模板文件。
**分离模板文件的问题**
  当模板足够短的时候，内联形式更招人喜欢。 但大多数的表单模板都不短。通常，TypeScript 和 JavaScript 文件不是写（读）大型 HTML 的好地方， 而且没有几个编辑器能对混写的 HTML 和代码提供足够的帮助。
  就算是在仅仅显示少数表单项目时，表单模板一般都比较庞大。所以通常最好的方式是将 HTML 模板放到单独的文件中。 一会儿将编写这个模板文件。在这之前，先退一步，再看看app.module.ts和app.component.ts，让它们使用新的PersonFormComponent。
### 5.修改app.module
  引入上面的组件，在declarations数组里面声明该组件，从@angualr/forms里面引入FormsModule，并放进imports数组里面。
### 6.修改app.component
  把<app-person-form>标签放到template里面，直接加载刚刚创建的组件。
### 7.创建HTML表单模板
  HTML文件里面长这样：
```html
<div class="container">
    <h1>Person Form</h1>
    <form>
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" class="form-control" id="name" required>
      </div>
      <div class="form-group">
        <label for="cp">cp</label>
        <input type="text" class="form-control" id="cp">
      </div>
      <button type="submit" class="btn btn-success">Submit</button>
    </form>
</div>
```
  这是普通的HTML代码，还没有用到angular的东西，为了用样式方便，在index.html里面引入bootstrap
```html
<link rel="stylesheet" href="https://unpkg.com/bootstrap@3.3.7/dist/css/bootstrap.min.css">
```
### 8.ngFor添加人物能力
  这些人必须从认证过的固定列表中选择一项能力，在表单中添加select，用ngFor把powers列表绑定到列表选项。修改一下代码：
```html
<div class="form-group">
  <label for="power">Person Power</label>
  <select class="form-control" id="power" required>
    <option *ngFor="let pow of powers" [value]="pow">{{pow}}</option>
  </select>
</div>
```
  列表中的每一项能力都会渲染成<option>标签。 模板输入变量p在每个迭代指向不同的超能力，使用双花括号插值表达式语法来显示它的名称。
### 9.使用ngModel进行双向数据绑定
  目前来运行程序，什么也看不到，因为还没有绑定到某个人身上，所以看不到任何数据。 
  现在，需要同时进行显示、监听和提取。虽然可以在表单中再次使用这些技术。 但是，今天用新东西，[(ngModel)]语法，使表单绑定到模型的工作变得超级简单。
  找到 Name 对应的<input>标签，做一些改动：
```html
<input type="text" class="form-control" id="name"
       required
       [(ngModel)]="model.name" name="name">
```
  要显示数据，还要在表单中声明一个模板变量。往<form>标签中加入#heroForm="ngForm"，代码长这样：
```html
<form #personForm="ngForm">
<!--Angular会在<form>标签上自动创建并附加一个NgForm指令。NgForm指令为form增补了一些额外特性。 它会控制那些带有ngModel指令和name属性的元素，监听他们的属性（包括其有效性）。 它还有自己的valid属性，这个属性只有在它包含的每个控件都有效时才是真。-->
```
  注意，<input>标签还添加了name属性 (attribute)，并设置为 "name"，表示人物的名字。 使用任何唯一的值都可以，但使用具有描述性的名字会更有帮助。 当在表单中使用[(ngModel)]时，必须要定义name属性。在内部，Angular 创建了一些FormControl，并把它们注册到NgForm指令，再将该指令附加到<form>标签。 注册每个FormControl时，使用name属性值作为键值。
  为cp和power属性添加类似的[(ngModel)]绑定和name属性。 抛弃输入框的绑定消息，在组件顶部添加到diagnostic属性的新绑定。 这样就能确认双向数据绑定在整个 Hero 模型上都能正常工作了。
  改过之后，表单的代码长这样：
```html
{{diagnostic}}
<div class="form-group">
  <label for="name">Name</label>
  <input type="text" class="form-control" id="name"
         required
         [(ngModel)]="model.name" name="name">
</div>
<div class="form-group">
  <label for="cp">cp</label>
  <input type="text"  class="form-control" id="cp"
         [(ngModel)]="model.cp" name="cp">
</div>
<div class="form-group">
  <label for="power">Person Power</label>
  <select class="form-control"  id="power"
          required
          [(ngModel)]="model.power" name="power">
    <option *ngFor="let pow of powers" [value]="pow">{{pow}}</option>
  </select>
</div>
```
### 10.通过ngModel跟踪修改状态与有效性验证
  NgModel 指令不仅仅跟踪状态。它还使用特定的 Angular CSS 类来更新控件，以反映当前状态。 可以利用这些 CSS 类来修改控件的外观，显示或隐藏消息。
  状态 | 为真时的CSS类 | 为假时的CSS类
  -- | -- | --
  控件被访问过了 | ng-touched | ng-untouched
  控件的值变化了 | ng-dirty | ng-pristine
  控件的值有效 | ng-valid | ng-invalid
  往姓名<input>标签上添加名叫 center 的临时模板引用变量， 然后用这个 center 来显示它上面的所有 CSS 类。
```html
<input type="text" class="form-control" id="name"
  required
  [(ngModel)]="model.name" name="name"
  #center>
```
### 11.添加一些CSS
```css
.ng-valid[required], .ng-valid.required  {
  border-left: 5px solid #42A948; /* 正确就是绿的 */
}

.ng-invalid:not(form)  {
  border-left: 5px solid #a94442; /* 错误就是红的 */
}
```
### 12.显示和隐藏错误信息
  “Name” 输入框是必填的，清空它会让左侧的条变红。这表示某些东西是错的，但我们不知道错在哪里，或者如何纠正。 可以借助ng-invalid类来给出有用的提示。
  首先在<input>标签中添加模板引用变量，然后给一个“is required”消息，放在邻近的<div>元素中，只有当控件无效时，才显示它。
```html
<label for="name">Name</label>
<input type="text" class="form-control" id="name"
       required
       [(ngModel)]="model.name" name="name"
       #name="ngModel">
<!--模板引用变量可以访问模板中输入框的 Angular 控件。 这里，创建了名叫name的变量，并且赋值为 "ngModel"。-->
<div [hidden]="name.valid || name.pristine"
     class="alert alert-danger">
  Name is required
</div>
<!--把div元素的hidden属性绑定到name控件的属性，这样就可以控制“姓名”字段错误信息的可见性了。-->
```
  上面的代码里，当控件是有效的 (valid) 或全新的 (pristine) 时，隐藏消息。 “全新的”意味着从它被显示在表单中开始，用户还从未修改过它的值。
  这种用户体验取决于自己的选择。有些人会希望任何时候都显示这条消息。 如果忽略了pristine状态，就会只在值有效时隐藏此消息。 如果往这个组件中传入全新（空）的英雄，或者无效的人物，将立刻看到错误信息 —— 虽然我还啥都没做。
  如果是想只有在用户做出无效的更改的时候才显示，那就不要那个全新的属性就行，但是加上这个属性，这个选择还是很重要的。人物的cp是可选的，所以不用改。人物的能力是必填项，要是想的话也可以在<select>上面添加错误处理，但是没有必要，因为选择框就已经限制了就只能选那几个啊。
  还有在这个表单中添加新的人物，在表单底部添加一个按钮，并把事件绑定到newPerson组件。
```html
<button type="button" class="btn btn-default" (click)="newPerson()">New Person</button>
```
```javascript
newHero() {
  this.model = new Person(42, '', '');
}
```
 现在运行应用，点击按钮，表单被清空了。 输入框左侧的必填项竖条是红色的，表示name和power属性是无效的。 这可以理解，因为有一些必填字段。 错误信息是隐藏的，因为表单还是全新的，还没有修改任何东西。
  那输入一个名字，再次点击按钮。 这次，出现了错误信息，并不希望显示新（空）的英雄时，出现错误信息。用浏览器工具审查这个元素就会发现，这个 name 输入框并不是全新的。 表单记得在点击 按钮 前输入的名字。 更换了人物并不会重置控件的“全新”状态。
  所以必须清除所有标记，在调用newPerson()方法后调用表单的reset()方法即可。代码这样改：
```html
<button type="button" class="btn btn-default" (click)="newPerson(); personForm.reset()">New Person</button>
```
### 13.使用ngSubmit提交表单
  在填表完成之后，用户还应该能提交这个表单。 “Submit（提交）”按钮位于表单的底部，它自己不做任何事，但因为有特殊的 type 值 (type="submit")，所以会触发表单提交。
  现在这样仅仅触发“表单提交”是没用的。 要让它有用，就要把该表单的ngSubmit事件属性绑定到人物表单组件的onSubmit()方法上：
```html
<form (ngSubmit)="onSubmit()" #personForm="ngForm">
```
  之前已经定义了一个模板引用变量#personForm，并且把赋值为“ngForm”。 现在，就可以在“Submit”按钮中访问这个表单了。
  现在要把表单的总体有效性通过personForm变量绑定到此按钮的disabled属性上，代码如下：
```html
<button type="submit" class="btn btn-success" [disabled]="!personForm.form.valid">Submit</button>
```
  现在重新运行应用。表单打开时，状态是有效的，按钮是可用的。
  现在，如果删除姓名，就会违反“必填姓名”规则，就会像以前那样显示出错误信息。同时，Submit 按钮也被禁用了。
### 14.切换两个表达区域
  现在来实现一些更炫的视觉效果。 隐藏掉数据输入框，显示一些其它东西。
```html
<div [hidden]="submitted">
  <h1>Person Form</h1>
  <form (ngSubmit)="onSubmit()" #personForm="ngForm">
	<!--HTML代码等会加-->
  </form>
</div>
```
  主表单从一开始就是可见的，因为submitted属性是 false，直到提交了这个表单。PersonFormComponent的代码片段有一段这样的：
```typescript
submitted = false;
onSubmit() { this.submitted = true; }
```
  当点击 Submit 按钮时，submitted标志会变成 true，并且表单像预想中一样消失了。
  现在，当表单处于已提交状态时，需要显示一些别的东西。 在刚刚写的<div>包装下方，添加下列 HTML 语句：
```html
<div [hidden]="!submitted">
  <h2>You submitted the following:</h2>
  <div class="row">
    <div class="col-xs-3">Name</div>
    <div class="col-xs-9  pull-left">{{ model.name }}</div>
  </div>
  <div class="row">
    <div class="col-xs-3">cp</div>
    <div class="col-xs-9 pull-left">{{ model.cp }}</div>
  </div>
  <div class="row">
    <div class="col-xs-3">Power</div>
    <div class="col-xs-9 pull-left">{{ model.power }}</div>
  </div>
  <br>
  <button class="btn btn-primary" (click)="submitted=false">Edit</button>
</div>
```
  人物又出现了，它通过插值表达式绑定显示为只读内容。 这一小段 HTML 只在组件处于已提交状态时才会显示。这段HTML包含一个 “Edit（编辑）”按钮，将 click 事件绑定到表达式，用于清除submitted标志。当点Edit按钮时，这个只读块消失了，可编辑的表单重新出现了。























