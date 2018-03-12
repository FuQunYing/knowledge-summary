#Day19
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
    第一，创建Hero模型类。
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
export class Hero {
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
























