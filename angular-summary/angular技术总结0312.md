#Day20
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



















