# Day08
## 二、模板语法（接02/13）
### 11.模板引用变量（#var）
  模板引用变量通常用来引用模板中的某个DOM元素，也可以引用angular组件或者指令或者Web Component。使用#来声明引用变量，比如：
```html
	<input #phone placeholder="请输入电话号码">
```
  在模板的任何地方都可以引用模板引用变量，比如：
```html
    <input #phone placeholder="请输入电话号码">
    <!-- 其它元素，什么都行 -->
    <button (click)="callPhone(phone.value)">Call</button>
```
  模板引用变量是怎么得到它的值的？
```txt
  大多数情况下，Angular会把模板引用变量的值设置为声明它的那个元素。 在上一个例子中，phone引用的是表示电话号码的<input>框。 "拨号"按钮的点击事件处理器把这个input值传给了组件的callPhone方法。 不过，指令也可以修改这种行为，让这个值引用到别处，比如它自身。 NgForm指令就是这么做的。
```
  就像这样用也可以：
```html
<form (ngSubmit)="onSubmit(personForm)" #personForm="ngForm">
  <div>
    <label for="name">Name
      <input name="name" required [(ngModel)]="person.name">
    </label>
  </div>
  <button type="submit" [disabled]="!personForm.form.valid">Submit</button>
</form>
<div [hidden]="!personForm.form.valid">
  {{submitMessage}}
</div>
```
  在上面，personForm出现了3次，中间还隔着HTML，那personForm的值是什么？
  如果之前没有导入FormsModule，Angular就不会控制这个表单，那么它就是一个HTMLFormElement实例。 这里的personForm实际上是一个Angular NgForm 指令的引用， 因此具备了跟踪表单中的每个控件的值和有效性的能力。
  原生的<form>元素没有form属性，但NgForm指令有。这就解释了为何当personForm.form.valid是无效时我们可以禁用提交按钮， 并能把整个表单控件树传给父组件的onSubmit方法。
  模板引用变量的作用范围是整个模板。 不要在同一个模板中多次定义同一个变量名，否则它在运行期间的值是无法确定的。
  也可以用ref-前缀代替#。 下面的例子中就用把fax变量声明成了ref-fax而不是#fax。（也可以作为组件间通讯的一种方法）
```html
    <input ref-fax placeholder="fax number">
    <button (click)="callFax(fax.value)">Fax</button>
```
### 12.输入输出属性（@Input和@Output）
  到目前为止，主要关注的点在于绑定声明的右侧，在模板表达式和模板语句中绑定到组件成员。 当成员出现在这个位置上，则称之为数据绑定的源。
  专注于绑定到的目标，它位于绑定声明中的左侧。 这些指令的属性必须被声明成输入或输出。
  **记住：所有组件皆为指令。**
```txt
     我们要重点突出下绑定目标和绑定源的区别。
     绑定的目标是在=左侧的部分， 源则是在=右侧的部分。
     绑定的目标是绑定符：[]、()或[()]中的属性或事件名， 源则是引号 (" ") 中的部分或插值符号 ({{}}) 中的部分。
     源指令中的每个成员都会自动在绑定中可用。 不需要特别做什么，就能在模板表达式或语句
     访问目标指令中的成员则受到限制。 只能绑定到那些显式标记为输入或输出的属性。
```
  在下面的例子中，iconUrl和onSave是组件的成员，它们在=右侧引号语法中被引用了。
```html
     < img [src]="iconUrl"/>
     <button (click)="onSave()">Save</button>
```
  它们既不是组件的输入也不是输出。它们是绑定的数据源。
  现在，看看PersonDetailComponent中的另一个片段，等号（=）左侧的是绑定的目标。
```html
	<app-person-detail [person]="currentPerson(deleteRequest)="deletePerson($event)"></app-person-detail>
```
  PersonDetailComponent.person和PersonDetailComponent.deleteRequest都在绑定声明的左侧。
  PersonDetailComponent.person在方括号中，它是属性绑定的目标PersonDetailComponent.deleteRequest在圆括号中，它是事件绑定的目标。
####12.1  声明输入和输出属性
  目标属性必须被显式的标记为输入或输出。
  在PersonDetailComponent内部，这些属性被装饰器标记成了输入和输出属性。
```typescript
  @Input()  person: Person;
   // 一个利用@Input的输入属性标识，表示可以接受数据
  @Output() deleteRequest = new EventEmitter<Person>();
   // 一个表示@Output的输出属性利用一个自定义事件的方法
   // 把需要传递出去的数据传递出去。
```
  另外，还可以在指令元数据的inputs或outputs数组中标记出这些成员。比如：
```typescript
  @Component({
  inputs: ['person'],
  outputs: ['deleteRequest'],
  })
```
**既可以通过装饰器，也可以通过元数据数组来指定输入/输出属性。但别同时用！**
```txt
  Q:现在是输入还是输出？
  输入属性通常接收数据值。 输出属性暴露事件生产者，如EventEmitter对象。
  输入和输出这两个词是从目标指令的角度来说的。
  <app-person-detail [person]="currentPerson(deleteRequest)="deletePerson($event)"></app-person-detail>//[person]-->input,(deleteRequest)-->output
  从PersonDetailComponent角度来看，PersonDetailComponent.person是个输入属性， 因为数据流从模板绑定表达式流入那个属性。
  从PersonDetailComponent角度来看，PersonDetailComponent.deleteRequest是个输出属性， 因为事件从那个属性流出，流向模板绑定语句中的处理器。
```
####12.2 给输入/输出属性起别名
  有时需要让输入/输出属性的公开名字不同于内部名字。
  这是使用 attribute 指令时的常见情况。 指令的使用者期望绑定到指令名。例如，在<div>上用myClick选择器应用指令时， 希望绑定的事件属性也叫myClick。
  ```html
  <div (myClick)="clickMessage=$event" clickable>click with myClick</div>
  ```
  然而，在指令类中，直接用指令名作为自己的属性名通常都不是好的选择。 指令名很少能描述这个属性是干嘛的。 myClick这个指令名对于用来发出 click 消息的属性就算不上一个好名字。
  幸运的是，可以使用约定俗成的公开名字，同时在内部使用不同的名字。 在上面例子中，实际上是把myClick这个别名指向了指令自己的clicks属性。
### 13.模板表达式操作符
  模板表达式语言使用了 JavaScript 语法的子集，并补充了几个用于特定场景的特殊操作符
#### 13.1 管道操作符（|）
  在绑定之前，表达式的结果可能需要一些转换。例如，可能希望把数字显示成金额、强制文本变成大写，或者过滤列表以及进行排序。
  Angular 管道对像这样的小型转换来说是个明智的选择。 管道是一个简单的函数，它接受一个输入值，并返回转换结果。 它们很容易用于模板表达式中，只要使用管道操作符 (|) 就行了。
```html
	<div>Title through uppercase pipe: {{title | uppercase}}</div>
```
  管道操作符会把它左侧的表达式结果传给它右侧的管道函数。uppercase就是将小写的英文全部转为大写。
  还可以通过多个管道串联表达式：
```html
<!--先转大写，再转小写，lowercase是转小写 -->
<div>
  Title through a pipe chain:
  {{title | uppercase | lowercase}}
</div>
```
  其它的还有date转换日期的，json、number等，具体的以后细说。
#### 13.2 安全导航操作符 ( ?. ) 和空属性路径
  Angular 的安全导航操作符 (?.) 是一种流畅而便利的方式，用来保护出现在属性路径中 null 和 undefined 值。 下面的代码里，当currentPerson为空时，保护视图渲染器，让它免于失败。
```txt
The current person's name is {{currentPerson?.name}}
```
  再比如，如果下面的title是空的话，会怎么样？
```txt
The title is {{title}}
```
  这个视图仍然被渲染出来，但是显示的值是空；只能看到 “The title is”，它后面却没有任何东西。 这是合理的行为。至少应用没有崩溃。
  假设模板表达式涉及属性路径，在下例中，显示一个空 (null) 人物的firstName。
```txt
The null person's name is {{nullPerson.name}}
```
  JavaScript 抛出了空引用错误，Angular 也是如此：
```javascript
TypeError: Cannot read property 'name' of null in [null].
```
  这个样子的话，整个视图就都没有了，如果确信person属性永远不可能为空，可以声称这是合理的行为。 如果它必须不能为空，但它仍然是空值，实际上是制造了一个编程错误，它应该被捕获和修复。 这种情况应该抛出异常。另一方面，属性路径中的空值可能会时常发生，特别是当我们知道数据最终会出现。当等待数据的时候，视图渲染器不应该抱怨，而应该把这个空属性路径显示为空白，就像上面title属性那样。
  但是，当currentPerson为空的时候，应用崩溃了。这个时候，可以通过ngIf来解决，当当前内容不为空的时候再挂载元素：
```html
<!--No hero, div not displayed, no error -->
<div *ngIf="nullPerson">The null person's name is {{nullPerson.name}}</div>
```
  或者可以尝试通过&&来把属性路径的各部分串起来，让它在遇到第一个空值的时候，就返回空。
```txt
The null person's name is {{nullPerson && nullPerson.name}}
```
  这些方法都有价值，但是会显得笨重，特别是当这个属性路径非常长的时候。 想象一下在一个很长的属性路径（如a.b.c.d）中对空值提供保护。Angular 安全导航操作符 (?.) 是在属性路径中保护空值的更加流畅、便利的方式。 表达式会在它遇到第一个空值的时候跳出。 显示是空的，但应用正常工作，而没有发生错误。
#### 13.3 非空断言操作符（！）
  在 TypeScript 2.0 中，可以使用--strictNullChecks标志强制开启严格空值检查。TypeScript就会确保不存在意料之外的null或undefined。在这种模式下，有类型的变量默认是不允许null或undefined值的，如果有未赋值的变量，或者试图把null或undefined赋值给不允许为空的变量，类型检查器就会抛出一个错误。如果类型检查器在运行期间无法确定一个变量是null或undefined，那么它也会抛出一个错误。 我们自己可能知道它不会为空，但类型检查器不知道。 所以我们要告诉类型检查器，它不会为空，这时就要用到非空断言操作符。
  Angular 模板中的**非空断言操作符（!）也是同样的用途。
  比如在ngIf来检查过person是否是已定义的之后，就可以断言person属性是一定是已定义的。
```html
<!--如果没有人，这句话就不显示啦-->
<div *ngIf="person">
  The person's name is {{person!.name}}
</div>
```
  在 Angular 编译器把我的模板转换成 TypeScript 代码时，这个操作符会防止 TypeScript 报告 "person.name可能为null或undefined"的错误。与安全导航操作符不同的是，非空断言操作符不会防止出现null或undefined。 它只是告诉 TypeScript 的类型检查器对特定的属性表达式，不做 "严格空值检测"。如果打开了严格控制检测，那就要用到这个模板操作符，而其它情况下则是可选的。

  

  

  

  

  

  

  




















