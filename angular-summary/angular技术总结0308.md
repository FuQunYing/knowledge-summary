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
##三、表单验证
###1.模板驱动验证
  为了往模板驱动表单中增加验证机制，就需要添加一些验证属性，就像原生的HTML表单验证器，Angular会用指令来匹配这些具有验证功能的指令。
  每当表单控件中的值发生变化时，Angular就会验证，并生成一个验证错误的列表或者null。
  可以通过把ngModel导出成局部模板变量来直接看该控件的状态，比如下面把ngModel导出一个叫name的变量：
```html
<input id="name" name="name" class="form-control"
       required minlength="4" appForbiddenName="mary"
       [(ngModel)]="person.name" #name="ngModel" >
<div *ngIf="name.invalid && (name.dirty || name.touched)"
     class="alert alert-danger">
  <div *ngIf="name.errors.required">
    姓名必填
  </div>
  <div *ngIf="name.errors.minlength">
    姓名至少四个字符
  </div>
  <div *ngIf="name.errors.forbiddenName">
    姓名不能是mary
  </div>
</div>
```
  注意：
```txt
    <input>元素带有一些HTML的验证属性：required和minlength。还带有一个自定义的验证器指令forbiddenName。等会儿说自定义验证器。
    #name="ngModel"把ngModel导出成了一个名叫name的局部变量。NgModel把自己要控制的FormControl实例的属性映射出去，然后就能在模板中检查控件的状态了，比如valid和dirty
    <div>元素的*ngIf控制着一群div，当输入的名字不符合条件的时候错误信息就会显示出来啦。

    检查touched和dirty是因为不希望用户在还没有编辑过表单的时候就显示错误提示，对于dirty和touched的检查可以避免这种问题。改变控件的值会改变控件的dirty状态，当控件失去焦点的时候，就会改变touched的状态。
```
###2.响应式表单的验证
  在响应式表单中，真正的源码都在组件类中。不应该通过模板上的属性来添加验证器，而应该在组件类中直接把验证器的函数添加到表单控件模型上（就是FormControl啦），然后，一旦控件发生了变化，Angular就会调用这些函数。
#### 2.1 验证器函数
  有两种验证器函数：同步验证器和异步验证器：
  - 同步验证器函数接受一个控件实例，然后返回一组验证错误或者null，那么就可以在实例化一个FormControl时把它作为构造函数的第二个参数传进去。
  - 异步验证器函数接受一个控件实例，并返回一个承诺（Promise）或可观察对象（Observable），它们稍后会发出一组验证错误或者null。那就可以在实例化一个FormControl时把它作为构造函数的第三个参数传进去。
    ps：出于性能方面的考虑，只有在所有的同步验证器都通过之后，Angular才会运行异步验证器，当每一个异步验证器都执行完了之后，才会设置这些验证错误。
#### 2.2 内置验证器
  验证器可以自己写，但是Angular准备好的也有一些内置验证器。
  模板驱动表单中可用的那些属性型验证器（如required，minlength等）对应于Validators类中的同名函数。要把人物表单改成响应式表单，还是用那些内置验证器，但这次用他们的函数形态：
```typescript
ngOnInit():void{
    this.personForm=new FormGroup({
        'name':new FormControl(this.person.name,[
            Validators.required,
            Validators.minlength(4),
            forbiddenName(/mary/i)
        ]),
        'cp':new FormControl(this.person.xp),
        'power':new FormControl(this.person.power,Validators.required)
    });
}
get name() {return this.personForm.get('name')}
get power() {return this.personForm.get('power')}
```
  注意：
```txt
	name控件设置了两个内置验证器，Validators.required和Validators.minlength(4)
	由于这些验证器都是同步验证，因此要把它们作为第二个参数传进去。
	可以通过把这些函数放进一个数组后传进去，可以支持多重验证器。
	这个demo添加了一些getter方法，在响应式表单中，通常会通过它所属的控件组（FormControl）的get方法来访问表单控件，但有时候为模板定义一些getter作为简短的形式。
```
  其实这里面的name输入框和之前的模板驱动的例子很像，主要改的有：
  - 该表单不再导出任何指令，而是使用组件类中的name读取器。
  - required属性仍然存在，虽然验证不再需要它，但是仍然在模板中保存下来，以支持CSS样式或可访问的属性。
### 3.自定义验证器
  内置的验证器并不能适用所有的应用场景，所以有时候需要自定义验证器。
  前面的forbiddenNameValidator函数，这个函数定义的时候是这样的：
```typescript
/*人物名字匹配到传进来的正则就错误 */
export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? {'forbiddenName': {value: control.value}} : null;
  };
}
```
  这个函数是一个工厂，它接受一个用来检测指定名字是否已经被禁用的正则表达式，并返回一个验证器函数。比如我要禁止的名字是mary，验证器会拒绝任何带有mary的人物名字，在其它地方，只要正则能匹配的上，也可能会拒绝别的名字。
  forbiddenNameValidator工厂函数返回配置好的验证器函数，该函数接受一个Angular控制器对象，并在控制器有效时返回null，或无效时返回验证错误的对象。 验证错误对象通常有一个名为验证秘钥（forbiddenName）的属性。其值为一个任意词典，可以用来插入错误信息（{name}）。
  自定义异步验证器和同步验证器很像，只是它们必须有返回值，返回一个稍后会输出null或验证错误对象的承诺或可观对象，如果是可观对象，那么它必须在某个时间点被完成（complete），那时候这个表单就会使用它输出的最后一个值作为验证结果（HTTP请求是自动完成的，但是某些自定义的可观察对象可能需要手动调用complete方法）。
#### 3.1 添加响应式表单
  在响应式表单组件中，添加自定义验证器就简答了，就把这个函数传给FormControl就行了。
```typescript
this.personForm=new FormGroup({
    'name':new FormControl(this.person.name,[
        Validators.required,
        Validators.minlength(4),
        forbiddenNameValidator(/mary/i)
    ]),
    'cp':new FormControl(this.person.cp),
    'power':new FormControl(this.person.power,Validator.required)
})
```
#### 3.2 添加到模板驱动表单
  在模板驱动表单中，不用直接访问FormControl的实例，所以不能像响应式表单中那样把验证器传进去，而应该在模板中添加一个指令。
  ForbiddenValidatorDirective指令相当于forbiddenNameValidator的包装器。Angular在验证流程中的识别出指令的作用，是因为指令把自己注入到了NG_VALIDATORS提供商中，该提供商拥有一组可扩展的验证器。
```typrscript
providers: [{provide: NG_VALIDATORS, useExisting: ForbiddenValidatorDirective, multi: true}]
```
  然后该指令类实现了Validator接口，以便他能简单的与Angular表单集成在一起，这个指令的其余部分长这样，看完就知道它们之间如何协作：
```typescript
@Directive({
  selector: '[forbiddenName]',
  providers: [{provide: NG_VALIDATORS, useExisting: ForbiddenValidatorDirective, multi: true}]
})
export class ForbiddenValidatorDirective implements Validator {
  @Input('appForbiddenName') forbiddenName: string;

  validate(control: AbstractControl): null{[key: string]: any} {
    return this.forbiddenName ? forbiddenNameValidator(new RegExp(this.forbiddenName, 'i'))(control)
  }
}
```
  一旦ForbiddenValidatorDirective写好了，就只要把forbiddenName选择器添加到输入框就可以激活这个验证器了，比如：
```html
<input id="name" name="name" class="form-control"
       required minlength="4" appForbiddenName="mary"
       [(ngModel)]="hero.name" #name="ngModel" >
<!--自定义验证器指令是用useExisting而不是useClass来实例化的。注册的验证器必须是这个 ForbiddenValidatorDirective 实例本身，也就是表单中 forbiddenName 属性被绑定到了"bob"的那个。如果用useClass来代替useExisting，就会注册一个新的类实例，而它是没有forbiddenName的。-->
```
### 4.表单控件状态的CSS类
  Angular会自动把很多控件属性作为CSS类映射到控件所在的元素上，可以使用这些类来根据表单状态给表单状态给表单控件元素添加样式，目前支持以下类：
  - .ng-valid
  - .ng-invalid
  - .ng-pending
  - .ng-pristine
  - .ng-dirty
  - .ng-untouched
  - .ng-touched
    比如这个人物表单使用.ng-valid和.ng-invalid来设置每个表单控件的边框颜色：
```css
.ng-valid[required], .ng-valid.required  {
  border-left: 5px solid #42A948; /* 正确的绿色*/
}
.ng-invalid:not(form)  {
  border-left: 5px solid #a94442; /* 错误的红色 */
}
```
##四、响应式表单
### 1.响应式表单简介
  Angular提供了两种构建表单的技术：响应式表单和模板驱动表单。这两项技术都属于@angular/forms库，并且共享一组公共的表单控件类。
  但是二者在设计哲学、编程风格和具体技术上有显著区别，所有它们有自己的模块，ReactiveFormsModule和FormsModule。
####1.1 响应式表单
  Angular响应式表单能让实现响应式编程风格更容易，这种编程风格更倾向于在非UI的数据模型之间显式的管理数据流，并且用一个UI导向的表单模型来保存屏幕上的HTML控件的状态和值。响应式表单可以让使用响应式编程模式、测试和校验更容易。
  使用响应式表单可以在组件中创建表单控件的对象树，并且用等会儿要学的技术把它们绑定到组件模板中的原生表单控件元素上。
  我可以在组件类中直接创建和维护表单控件的对象。由于组件类可以同时访问数据模型和表单控件结构，因为就可以把表单模型的变化推送到表单控件中，并把变化后的值拉去回来。组件可以监听表单控件状态的变化，并对此做出响应。
  直接使用表单控件对象的优点之一，是值和有效性状态的更新总是同步的，并且在我的控制之下，不会遇到时序问题，这个问题有时在模板驱动表单中会成为灾难。而且响应式表单更容易进行单元测试。
  在响应式编程范式中，组件会负责维护数据模型的不可变性，把模型当做纯粹的原始数据源。 组件不会直接更新数据模型，而是把用户的修改提取出来，把它们转发给外部的组件或服务，外部程序才会使用这些进行处理（比如保存它们）， 并且给组件返回一个新的数据模型，以反映模型状态的变化。
  使用响应式表单的指令，并不要求我遵循所有的响应式编程原则，但它能让你更容易使用响应式编程方法，从而更愿意使用它。
####1.2 模板驱动表单
  在之前的模板里面说过模板驱动表单，是一种完全不同的方式。
  把HTML表单控件放进组件模板中，并用ngModel等指令把它们绑定到组件中数据模型的属性上。自己不需要创建Angular表单控件对象，Angular指令会使用数据绑定中的信息创建它们，我们不用自己推送和拉取数据。Angular会使用ngModel来替自己管理它们。当用户做出更改的时候，Angular会据此更新可变的数据模型。所以ngModel并不是ReactiveFormsModule模块的一部分。虽然这样意味着组件中的代码比较少，但是模板驱动表单是异步工作的，在跟高级的开发中应该会让开发更复杂。
#### 1.3 异步 vs 同步
  响应式表单是同步的，模板驱动表单是异步的。
  使用响应式表单，会在代码中创建这个表单控件树，然后可以立即更新一个值或者深入到表单中的任意节点，因为所有的控件都始终是可用的。
  模板驱动表单会委托指令来创建它们的表单控件，为了消除 检查完了又变化了 的错误，这些指令需要消耗一个以上的变更周期来构建整个控件树，这意味着在从组件类中操纵任何控件之前，都必须先等上一个节拍。
  比如，如果要用@ViewChild（NgForm）查询来注入表单控件，并在生命周期钩子ngAfterViewInit中检查它，就会发现它没有子控件，就必须使用setTimeout等待一个节拍才能从控件中提取值、测试有效性，或把它设置为新值。
  模板驱动表单的异步性让单元测试也变得复杂化了。 必须把测试代码包裹在async()或fakeAsync()中来解决要查阅的值尚不存在的情况。 使用响应式表单，在所期望的时机一切都是可用的。
  二者各有优缺点，在开发项目的时候选择合适的就行，只要乐意在同一个项目里面同时使用也行。下面就用一个小demo项目来学响应式表单。
### 2.准备开始了
  先创建一个一个新项目，叫angular-reactive-forms，
  命令：ng new angular-reactive-forms
### 3.创建数据模型
  这个例子就是为了响应式表单和能编辑一个英雄，现在需要一个Person类和一些人物数据。
  创建一个新的类，ng g cl data-modal，然后在文件里面写入：
```typescript
export class Person {
  id = 0;
  name = '';
  addresses: Address[];
}
export class Address {
  street = '';
  city   = '';
  state  = '';
  zip    = '';
}
export const persons: Person[] = [
  {
    id: 1,
    name: '许嵩',
    addresses: [
      {street: '123 Main',  city: 'Anywhere', state: 'CA',  zip: '94801'},
      {street: '456 Maple', city: 'Somewhere', state: 'VA', zip: '23226'},
    ]
  },
  {
    id: 2,
    name: '山田凉介',
    addresses: [
      {street: '789 Elm',  city: 'Smallville', state: 'OH',  zip: '04501'},
    ]
  },
  {
    id: 3,
    name: '知念侑李',
    addresses: [ ]
  },
];
export const states = ['CA', 'MD', 'OH', 'VA'];
```
  这个文件导出两个类和两个常量，Address和Person类定义应用的数据模型。persons和states常量提供测试数据。
### 3.创建响应式表单组件
  先生成一个PersonDetail的新组件：ng g c PersonDetail。
  从@angular/forms里面导入FormControl，然后创建并导出一个带有FormControl的PersonDetailComponent类。FormControl是一个指令，它允许直接创建并管理一个FormControl实例。
```typescript
export class PersonDetailComponent1 {
  name = new FormControl();
}
```
  这里创建了一个名叫name的FormControl。它将会绑定到模板中的input框，表示人物的名字，FormControl构造函数接收三个可选参数：初始值、验证器数组和异步验证器数组。最简单的控件并不需要数据或验证器，但是在实际应用中，大部分表单控件都会同时具备它们。
### 4.创建模板
  修改模板HTML代码，长这样：
```html
<h2>人物详情</h2>
<h3>一个FormControl</h3>
<label class="center-block">姓名：
	<input class="form-control" [formControl]="name">
</label>
```
  要让Angular知道我是希望把这个输入框关联到类中的FormControl型属性name，需要在模板中的input上面加上[formControl]="name"
### 5.导出ReactiveFormsModule
  HeroDetailComponent的模板中使用了来自ReactiveFormsModule的formControlName。
  在 app.module.ts 中做了下面两件事：
      用import引入ReactiveFormsModule和HeroDetailComponent。
      把ReactiveFormsModule添加到AppModule的imports列表中。
### 6.显示PersonDetailComponent
  修改AppComponent的模板，来显示PersonDetailComponent
```html
<div class="container">
	<h1>响应式表单</h1>
	<app-person-detail></app-person-detail>
</div>
```
#### 6.1 基础的表单类
  - AbstractControl是三个具体表单类的抽象基础类，并为它们提供了一些共同的行为和属性，其中有些是可观察对象（Abservable）。
  - FormControl用于跟踪一个单独的表单控件的值和有效性状态，它对应于一个HTML表单控件，比如输入框和下拉框。
  - FormGroup用于跟踪一组AbstractControl的实例的值和有效性状态，改组的属性中包含了它的子控件，组件中的顶级表单就是一个FormGroup。
  - FormArray用于跟踪AbstractControl实例组成的有序数组的值和有效性状态。
#### 6.2 为应用添加样式
  给模板添加点样式，可以直接在style.css里面引入bootstrap
```css
@import url('https://unpkg.com/bootstrap@3.3.7/dist/css/bootstrap.min.css');
```
  模板中的input框的样子就变成了boot的默认input的样子啦。
### 7.添加FormGroup
  通常，如果有多个FormControl，那最好就是给它们注册进一个父FormGroup中，所以在person-detail.componnet里面从@angular/form里面引入FormGroup就好啦。然后在这里面，把FormGroup包裹进一个personForm的FormGroup中：
```typescript
export class PersonDetailComponent {
  personForm = new FormGroup ({
    name: new FormControl()
  });
}
```
  改完类，就要改HTML模板啦：
```html
<h2>人物详情</h2>
<h3>FormControl in a FormGroup</h3>
<form [formGroup]="personForm" novalidate>
  <div class="form-group">
    <label class="center-block">姓名:
      <input class="form-control" formControlName="name">
    </label>
  </div>
</form>
```
  现在单行输入框位于一个form元素中，<form>元素上的novalidate属性会阻止浏览器使用原生的HTML表单验证器。formGroup是一个响应式表单的指令，它拿到一个现有的FormGroup实例，并把它关联到一个HTML元素上。 这种情况下，它关联到的是form元素上的FormGroup实例heroForm。
  由于现在有了一个FormGroup，因此必须修改模板语法来把输入框关联到组件类中对应的FormControl上。 以前没有父FormGroup的时候，[formControl]="name"也能正常工作，因为该指令可以独立工作，也就是说，不在FormGroup中时它也能用。 有了FormGroup，name输入框就需要再添加一个语法formControlName=name，以便让它关联到类中正确的FormControl上。 这个语法告诉Angular，查阅父FormGroup（这里是personForm），然后在这个FormGroup中查阅一个名叫name的FormControl。
### 8.表单模型概览
  当用户输入名字的时候，这个值进入了幕后表单模型中的FormControl构成的表单组，要想知道表单模型是什么样的，可以在HTML中的form标签下加上：
```html
<p>Form Value:{{personForm.value | json}}</p>
```
  personForm.value会返回表单模型，用json管道把值以json格式渲染到浏览器上，那输入的值就能一直看到了。
### 9.FormBuilder简介
  FormBuilder类能通过处理控件创建的细节问题来帮助我减少重复劳动。要使用FormBuilder，就要先把它导入person-detail组件里面，和FormGroup一样，直接从@angular/forms里面导入就行啦。现在ts长这样：
```typescript
export class HeroDetailComponent3 {
  personForm: FormGroup; // 把personForm属性的类型声明为FormGroup

  constructor(private fb: FormBuilder) { // 注入 FormBuilder
    this.createForm();//在构造函数里面调用createForm
  }
  createForm() {//添加一个名叫createForm的新方法，它会用FormBuilder来定义personForm。
    this.personForm = this.fb.group({
      name: '', // 叫 ‘name’ 的 FormControl
    });
  }
}
```
  FormBuilder.group是一个用来创建FormGroup的工厂方法，它接受一个对象，对象的键和值分别是FormControl的名字和它的定义。 在这个例子中，name控件的初始值是空字符串。把一组控件定义在一个单一对象中，可以更加紧凑、易读。 完成相同功能时，这种形式优于一系列new FormControl(...)语句。
#### 9.1 Validators.required验证器
  在@angular/forms里面导入Validators，要想让name这个FormControl是必须的，请把FormGroup中的name属性改为一个数组，第一个条目是name的初始值，第二个是required验证器：
```typescript
this.personForm = this.fb.group({
  name: ['', Validators.required ],
});
```
  然后修改模板底部的诊断信息，以显示表单的有效性状态。
```html
<p>Form value: {{ personForm.value | json }}</p>
<p>Form status: {{ personForm.status | json }}</p>
```
  现在这个时候，浏览器显示的值就是Form value:{"name":""},Form status:{"INVALID"},这证明Validators.required生效了，但是状态还是INVALID，因为输入框中还没有值，在输入框输入值的话，就能看到INVALID变成VALID的了。当然了现在这样写是调试程序的时候用的，这压根儿也不是给人看的信息，在正式的应用中可以修改成对用户更友好的信息。
#### 9.2 更多的表单控件
  每个人物可以有多个名字，还有一个住址，一个能力和一个cp。住址中有个省的属性，用户将会从select中选择一个省，用option元素渲染各个州，先从data-modal中导入省列表，然后声明states属性并往personForm中添加一些表示住址的FormControl，代码长这样：
```typescript
export class HeroDetailComponent4 {
  personForm: FormGroup;
  states = states;
  constructor(private fb: FormBuilder) {
    this.createForm();
  }
  createForm() {
    this.personForm = this.fb.group({
      name: ['', Validators.required ],
      street: '',
      city: '',
      state: '',
      zip: '',
      power: '',
      cp: ''
    });
  }
}
```
  然后在模板文件中把对应的脚本添加到form元素中。
```html
<h2>人物详情</h2>
<h3><i>多个FormGroup</i></h3>
<form [formGroup]="personForm" novalidate>
  <div class="form-group">
    <label class="center-block">姓名:
      <input class="form-control" formControlName="name">
    </label>
  </div>
  <div class="form-group">
    <label class="center-block">Street:
      <input class="form-control" formControlName="street">
    </label>
  </div>
  <div class="form-group">
    <label class="center-block">City:
      <input class="form-control" formControlName="city">
    </label>
  </div>
  <div class="form-group">
    <label class="center-block">State:
      <select class="form-control" formControlName="state">
          <option *ngFor="let state of states" [value]="state">{{state}}</option>
      </select>
    </label>
  </div>
  <div class="form-group">
    <label class="center-block">Zip Code:
      <input class="form-control" formControlName="zip">
    </label>
  </div>
  <div class="form-group radio">
    <h4>power</h4>
    <label class="center-block"><input type="radio" formControlName="power" value="handsome">帅</label>
    <label class="center-block"><input type="radio" formControlName="power" value="handsome tall">又高又帅</label>
    <label class="center-block"><input type="radio" formControlName="power" value="music">音乐</label>
  </div>
  <div class="checkbox">
    <label class="center-block">
      <input type="checkbox" formControlName="sidekick">猜猜我的cp是谁
    </label>
  </div>
</form>
<p>Form value: {{ personForm.value | json }}</p>
<!--不用管这些脚本中提到的form-group、form-control、center-block和checkbox等。 它们是来自Bootstrap的CSS类，Angular本身不会管它们。 注意formGroupName和formControlName属性。 他们是Angular指令，用于把相应的HTML控件绑定到组件中的FormGroup和FormControl类型的属性上。-->
```
  修改过的模板包含更多文本输入框，一个state选择框，power的单选按钮和一个cp检查框。
  我要用[value]="state"来绑定选项的value属性。 如果不绑定这个值，这个选择框就会显示来自数据模型中的第一个选项。
  组件类定义了控件属性而不用管它们在模板中的表现形式。 那可以像定义name控件一样定义state、power和cp控件，并用formControlName指令来指定FormControl的名字。
#### 9.3 多级FormGroup
  这个表单变得越来越大、越来越笨重。可以把一些相关的FormControl组织到多级FormGroup中。 street、city、state和zip属性就可以作为一个名叫address的FormGroup。 用这种方式，多级表单组和控件可以让我们轻松地映射多层结构的数据模型，以便帮助跟踪这组相关控件的有效性和状态。用FormBuilder在这个名叫personForm的组件中创建一个FormGroup，并把它用作父FormGroup。 再次使用FormBuilder创建一个子级FormGroup，其中包括这些住址控件。把结果赋值给父FormGroup中新的address属性。
  然后代码中间的一段变这样：
```typescript
createForm() {
    this.personForm = this.fb.group({ // 父FormGroup
      name: ['', Validators.required ],
      address: this.fb.group({ // 子FormGroup，里面都是地址相关
        street: '',
        city: '',
        state: '',
        zip: ''
      }),
      power: '',
      cp: ''
    });
  }
```
  现在已经修改了组件类中表单控件的结构，还必须对组件模板进行相应的调整。
  在person-detail.component.html中，把与住址有关的FormControl包裹进一个div中。 往这个div上添加一个formGroupName指令，并且把它绑定到"address"上。 这个address属性是一个FormGroup，它的父FormGroup就是personForm。
  然后HTML代码改成这样：
```html
<div formGroupName="address" class="well well-lg">
	<div class="form-group">
		<label class="center-block">Street:
			<input class="form-control" formControlName="street">
		</label>
	</div>
	<div class="form-group">
		<label class="center-block">City:
			<input class="form-control" formControlName="city">
		</label>
	</div>
	<div class="form-group">
		<label class="center-block">State:
			<input class="form-control" formControlName="state">
		</label>
	</div>
	<div class="form-group">
		<label class="center-block">Zip code:
			<input class="form-control" formControlName="zip">
		</label>
	</div>
</div>
```
  现在浏览器再输出就是这样的json了：personForm value:{"name":"","address":{"street":""..}}
### 10.查看FormControl的属性
  此时我是把整个表单模型展示在了页面里，但是有时候值想看某个特定FormControl的状态。那就可以使用.get()方法来提取表单中一个单独的FormControl的状态，可以在组件类中这样做，或者往模板中添加以下代码来把它显示在页面中，就添加在{{form.value  | json}}插值表达式的后面：
```html
<p>Name value:{{personForm.get('name').value}}
```
  要取得FormGroup中的FormGroup的状态，也是使用 . 来指定到控件的路径：
```html
<p>Street value: {{ personForm.get('address.street').value}}</p>
```
  用 . 可以显示FormGroup的任意属性，代码如下：
属性 | 说明
-- | --
myControl.value | FormControl的值
myControl.status | FormControl的有效性，可能的值有VALID、INVALID、PENDING或DISABLED
myControl.pristine | 如果用户尚未改变过这个控件的值，则为true，它总是与myControl.dirty相反
myControl.untouched |如果用户尚未进入这个HTML控件，也没有触发过它的blur（失去焦点）事件，则为true。 它是myControl.touched的反义词。
### 11.数据模型与表单模型
  此时，表单显示的是空值，PersonDetailComponent应该显示一个人物的值，这个值可能来自远程服务器。在这个demo里面，PersonDetailComponent从它的父组件PersonListComponent中取得一个英雄，来自服务器的person就是数据模型，而FormControl的结构就是表单模型。
  组件必须把数据模型中的人物值复制到表单模型中，注意：
  - 自己必须得知道数据模型是如何映射到表单模型中的属性的。
  - 用户修改时的数据流是从DOM元素流向表单模型的，而不是数据模型。表单控件永远不会修改数据模型。
    表单模型和数据模型的结构并不需要精确匹配。在一个特定的屏幕上，通常只会展现数据模型的一个子集。 但是表单模型的形态越接近数据模型，事情就会越简单。
    在PersonDetailComponent中，这两个模型是非常接近的，看一下之前的data-model的Person定义：
```typescript
export class Person {
  id = 0;
  name = '';
  addresses: Address[];
}
export class Address {
  street = '';
  city   = '';
  state  = '';
  zip    = '';
}
```
  然后是组件FormGroup的定义：
```typescript
this.personForm = this.fb.group({
  name: ['', Validators.required ],
  address: this.fb.group({
    street: '',
    city: '',
    state: '',
    zip: ''
  }),
  power: '',
  cp: ''
});
```
  在这些模型中有两点显著的差异：
  - Person有一个id，表单模型中则没有，一般情况下并不会把主键显示给用户。
  - Person有一个住址数组，这个表单模型只表示了一个住址，等会儿做修改可以表示多个。
    虽然如此，这两个模型的形态仍然是非常接近的，等会儿就能看到如何用patchValue和setValue方法把数据模型拷贝到表单模型中。
    重构一下address这个FormGroup定义，显得更简洁，代码长这样：
```typescript
this.personForm = this.fb.group({
  name: ['', Validators.required ],
  address: this.fb.group(new Address()), // 新地址的FormGroup
  power: '',
  sidekick: ''
});
```
  为了确保从data-model中导入，可以引用Hero和Address类：
```typescript
import { Address, Person, states } from '../data-model';
```
### 12.使用setValue和patchValue来操纵表单模型
#### 12.1 setValue方法
  借助setValue，可以立即设置每个表单控件的值，只要把与表单模型的属性精确匹配的数据模型传进去就可以了。
```typescript
this.personForm.setValue({
    name:this.person.name,
    address:this.person.addresses[0] || new Address()
});
```
  setValue方法会在赋值给任何表单控件之前先检查数据对象的值。它不会接受一个与FormGroup结构不同或缺少表单组中任何一个控件的数据对象。 这种方式下，如果我有什么拼写错误或控件嵌套的不正确，它就能返回一些有用的错误信息。 patchValue会默默地失败。而setValue会捕获错误，并清晰的报告它。注意，是可以把这个person用作setValue的参数，因为它的形态与组件的FormGroup结构是非常像的。
  现在只能显示人物的第一个住址，不过还必须考虑person完全没有住址的可能性。 下面的demo解释了如何在数据对象参数中对address属性进行有条件的设置：
```typescript
address:this.person.addresses[0] || new Address()
```
#### 12.2 patchValue方法
  借助patchValue，可以通过提供一个只包含要更新的控件的键值对象来把值赋给FormGroup中的指定控件。
  下面的代码只会设置表单的name控件。
```typescript
this.personForm.patchValue({
    name:this.person.name
})
```
  借助patchValue，可以更灵活地解决数据模型和表单模型之间的差异。 但是和setValue不同，patchValue不会检查缺失的控件值，并且不会抛出有用的错误信息。
#### 12.3 设置表单的模型值(ngOnChanges)
  如何设置表单的值已经知道了，那到底应该在什么时候设置表单的值，这就取决于组件是在什么时候拿到的数据模型的值。
  这个响应式表单中的PersonDetailComponent组件嵌套在一个主/从结构的PersonListComponent中。 PersonListComponent组件把英雄的名字显示给用户。 当用户点击一个英雄时，列表组件把所选的英雄通过输入属性person传给PersonDetailComponent。
```html
<nav>
  <a *ngFor="let person of persons | async" (click)="select(person)">{{person.name}}</a>
</nav>

<div *ngIf="selectedPerson">
  <app-person-detail [person]="selectedPerson"></app-person-detail>
</div>
```
  这种方式下，每当用户选择一个新的人物时，PersonDetailComponent的值就会发生变化，那就可以在ngOnChanges的钩子中调用setValue，就像代码里面那样，每当输入属性person发生变化时，Angular就会调用它。
  首先在person-detail.component.ts中导入OnChanges和Input符号，
```typescript
import { Component, Input, OnChanges }             from '@angular/core';
```
  然后添加输入属性person：
```typescript
@Input() person:person
```
  然后在该类中添加ngOnChanges方法：
```typescript
ngOnChanges()
  this.personForm.setValue({
    name:    this.person.name,
    address: this.person.addresses[0] || new Address()
  });
}
```
#### 12.4 重置表单的标识
  在更换人物的时候重置表单，以便来自前一个人物的控件值被清除，并且其状态被恢复为pristine状态，可以在ngOnChanges的顶部调用reset，就像这样：
```typescript
this.personForm.reset()
```
  reset方法有一个可选的state值，让人能在重置状态的同时顺便设置控件的值，在内部实现上，reset会把该参数传给setValue，稍稍修改一下，代码长这样：
```typescript
ngOnChanges(){
    this.personForm.reset({
        name:this.person.name,
        address:this.person.addresses[0] || nre Address()
    })
}
```
#### 12.5 创建PersonListComponent和PersonService
  PersonDetailComponent是一个嵌套在PersonListComponent的主从视图中的子组件。
  PersonListComponent使用一个注入进来的HeroService来从服务器获取英雄列表，然后用一系列按钮把这些英雄展示给用户。 PersonService模拟了HTTP服务。 它返回一个英雄组成的Observable对象，并会在短暂的延迟之后被解析出来，这是为了模拟网络延迟，并展示应用在自然延迟下的异步效果。
  当用户点击一个人物时，组件设置它的selectedPerson属性，它绑定到PersonDetailComponent的输入属性person上。 PersonDetailComponent检测到英雄的变化，并使用当前英雄的值重置此表单。"刷新"按钮清除英雄列表和当前选中的英雄，然后重新获取英雄列表。
### 13.使用FormArray来表示FormGroup数组
  之前看到了了FormControl和FormGroup。 FormGroup是一个命名对象，它的属性值是FormControl和其它的FormGroup。
  有时得表示任意数量的控件或控件组。 比如，一个人物可能拥有0、1或任意数量的住址。
  Person.addresses属性就是一个Address实例的数组。 一个住址的FormGroup可以显示一个Address对象。 而FormArray可以显示一个住址FormGroup的数组。
  首先要使用FormArray就要先从@angular/forms里面导入。然后：
  - 在数组中定义条目（FormControl或者FormGroup）
  - 把这个数组初始化为一组从数据模型中的数据创建的条目。
  - 根据用户的需求添加或者移除这些条目
    在这节的demo里面，我给Person.addresses定义了一个FormArray，并且让用户添加或者修改这些地址。需要在PersonDetailComponent的构造函数中重新定义表单模型，它现在只用FormGroup显示第一个英雄住址：
```typescript
this.personForm = this.fb.group({
    name:['',Validators.required],
    address:this.fb.group(new Address()),
    power:'',
    cp:''
})
```
#### 13.1 从住址到秘密地点
  从咱们凡人角度看，这些人物都是有一个自己的秘密地点的，不然我不就去许嵩家门口蹲点了，把FormGroup型的住址替换为FormArray型的SecretLairs：
```typescript
this.personForm = this.fb.group({
    name:['',Validators.required],
    secretLairs:this.fb.array([]),//作为空FormArray的secretLairs
    power:'',
    cp:''
})
```
#### 13.2 初始化FormArray型的secretLairs
  现在默认的表单显示的是一个无地址的无名人物，需要一个方法来用实际人物的地址填充secretLairs，而不用管父组件PersonListComponent何时把输入属性PersonDetailComponent.person设置为一个新的Person。
  下面的setAddresses方法把secretLairs数组替换为一个新的FormArray，使用一组表示人物地址的FormGroup来进行初始化。
```typescript
setAddresses(addresses: Address[]) {
  const addressFGs = addresses.map(address => this.fb.group(address));
  const addressFormArray = this.fb.array(addressFGs);
  this.personForm.setControl('secretLairs', addressFormArray);
}
```
  注意，这儿使用FormGroup.setControl方法，而不是setValue方法来设置前一个FormArray。 我所要替换的是控件，而不是控件的值。还有，secretLairs数组中包含的是FormGroup，而不是Address。
#### 13.3 获取FormArray
  PersonDetailComponent应该能从secretLairs中显示、添加和删除条目。使用FormGroup.get方法来获取到FormArray的引用。 把这个表达式包装进一个名叫secretLairs的便捷属性中来让它更清晰，并供复用。
```typescript
get secretLaris():FormArray{
    return this.personForm.get('secretLairs') as FormArray;
}
```
####13.4 显示FormArray
  当前HTML模板显示单个的地址FormGroup。 我要把它修改成能显示0、1或更多个表示英雄地址的FormGroup。要改的部分主要是把以前表示地址的HTML模板包裹进一个<div>中，并且使用*ngFor来重复渲染这个<div>。
  重点是如何写这个*ngFor
  - 在*ngFor的<div>之外套上另一个包装<div>，并且把它的formArrayName指令设为"secretLairs"。 这一步为内部的表单控件建立了一个FormArray型的secretLairs作为上下文，以便重复渲染HTML模板。
  - 这些重复条目的数据源是FormArray.controls而不是FormArray本身。 每个控件都是一个FormGroup型的地址对象，与以前的模板HTML所期望的格式完全一样。
  - 每个被重复渲染的FormGroup都需要一个独一无二的formGroupName，它必须是FormGroup在这个FormArray中的索引。 复用这个索引，以便为每个地址组合出一个独一无二的标签
    现在HTML代码长这样：
```html
<div formArrayName="secretLairs" class="well well-lg">
  <div *ngFor="let address of secretLairs.controls; let i=index" [formGroupName]="i" >
    <!-- 地址模板start -->
    <h4>地址：#{{i+1}}</h4>
    <div>
    	<div class="form-group">
    		<label class="center-block">Street:
    			<input class="form-control" formControlName="street">
    		</label>
    	</div>
    	<div class="form-group">
    		<label class="center-block">City:
    			<input class="form-control" formControlName="city">
    		</label>
    	</div>
    	<div class="form-group">
    		<label class="center-block">State:
    			<select class="form-control" formControlName="state">
    				<option *ngFor="let state of states" [value]="state">
    				{{state}}
    				</option>
    			</select>
    		</label>
    	</div>
    	<div class="form-group">
    		<label class="center-block">Zip Code:
    			<input class="form-control" formControlName="zip">
    		</label>
    	</div>
    </div>
    <!-- 地址模板end -->
  </div>
</div>
```
#### 13.5 把新的秘密地址添加到FormArray里面
  添加一个addLairs方法，它获取secretLairs数组，并把新的表示地址的FormGroup添加其中。
```typescript
addLair(){
    this.secretLairs.push(this.fb.group(new Address()))
}
```
  在HTML里面放个按钮，方便用户操作：
```html
<button (click)="addLairs()" type="button">ADD</button>
<!-- 必须确保添加了type="button"，应该总是指定一个按钮的type，如果不明确指定类型，按钮的默认类型就是 submit -->
```
### 14.监视控件的变化
  每当用户在父组件PersonListComponent中选取了一个英雄，Angular就会调用一次ngOnChanges，选取人物会修改输入属性PersonDetailComponent.person。
  当用户修改人物的名字或者秘密地点，Angular并不会调用ngOnChanges，但是可以通过订阅表单控件的属性之一来了解这些变化，这个属性会发出变更通知。有一些属性，比如valueChanges，可以返回一个RxJS的Observable对象，要监听控件值的变化，并不需要特别了解RxJS的Observable
  添加下面的方法，以监听姓名这个FormControl中值的变化：
```typescript
nameChangeLog: string[] = [];
logNameChange(){
    const nameControl = this.personForm.get('name')；
    nameControl.valueChanges.forEach(
    (value:string)=> this.nameChangeLog.push(value)
    )
}
```
  在构造函数中调用一下：
```typescript
constructor(private fb: FormBuilder) {
  this.createForm();
  this.logNameChange();
}
```
  logNameChange方法会把一条改名记录追加到nameChangeLog数组中。用ngFor绑定在组件模板的底部显示这个数组：
```html
<h4>Name change log</h4>
<div *ngFor="let name of nameChangeLog">{{name}}</div>
```
  现在在浏览器里面，选择一个人物，并开始在姓名输入框中键入，就能看到每次按键都会记录一个新名字。插值表达式绑定时显示姓名变化是比较简单的方式，在组件类中订阅表单控件属性变化的可观察对象以触发应用逻辑就是比较难的方式了。
### 15.保存表单数据
  PersonDetailComponent捕获了用户输入，但是没有用它做任何事情，在正儿八经的项目里面可能要保存这些人物的变化，可能也要丢弃未保存的变更，然后继续编辑。
#### 15.1 保存
  在写个demo里面，当用户提交表单时，PersonDetailComponent会把英雄实例的数据模型传给所注入进来的PersonService的一个方法进行保存。
```typescript
onSubmit(){
    this.person = this.prepareSavePerson();
    this.personService.updatePerson(this.person).subscribe(/*错误处理*/);
    this.ngOnChanges();
}
```
  原生的person中有一些保存之前的值，用户的修改仍然是在表单模型中，所以需要根据原始人物的值（通过person.id找到的）组合出一个新的person对象，并用prepareSavePerson来深层复制变化后的模型值：
```typescript
prepareSavePerson():Person{
    const formModel = this.personForm.value;
    //深层复制
    const secretLairsDeepCopy: Address[] = formModel.secretLairs.map(
    (address: Address) => Object.assign({}, address)
  );
  //根据原始人物的值，返回一个新的person对象
  const savePerson:Person ={
      id:this.person.id,
      name:formModel.name as string,
      address:secretLairsDeepCopy
  };
  return savePerson;
}
/*
	已经把formModel.secretLairs赋值给了savePerson.addresses， savePerson.addresses数组中的地址和formModel.secretLairs中的会是同一个对象。 用户随后对小屋所在街道的修改将会改变saveHero中的街道地址。但prepareSaveHero方法会制作表单模型中的secretLairs对象的复本，因此实际上并没有修改原有对象
*/
```
#### 15.2 丢弃（撤销修改）
  用户可以撤销修改，并通过点击revert按钮来表单恢复到原始状态。丢弃很容易，只要重新执行ngOnChanges方法就可以拆而，它会重新从原始的、未修改过的hero数据模型来构建出表单模型。
```typescript
revert(){this.ngOnChanges}
```
#### 15.3 按钮
  把save和revert按钮添加到组件模板：
```html
<form [formGroup]="personForm" (ngSubmit)="onSubmit()" novalidate>
  <div>
	<button type="submit" [disabled]="personForm.pristine" class="btn btn-success">Save</button>&nbsp;
	<button type="reset" (click)="revert()" [disabled]="personForm.pristine" class="btn btn-danger">Revert</button>
  </div>
  <div class="form-group radio">
  	<h4>power</h4>
  	<label class="center-block">
  	  <input type="radio" formControlName="power" value="handsome">帅
  	</label>
  	<label class="center-block">
  	  <input type="radio" formControlName="power" value="handsomeandtall">又高又帅
  	</label>
  	<label class="center-block">
  	  <input type="radio" formControlName="power" value="music">音乐
  	</label>
  </div>
</form>
```
  这些按钮默认是禁用的，直到用户通过修改任何一个表单控件的值，“脏”了表单中的数据（就是personForm.dirty）。
  点击一个类型为submit的按钮会触发ngSubmit事件，而它会调用组件的onSubmit方法，点击revert按钮则会调用组件的revert方法，现在用户可以保存或放弃修改了。























