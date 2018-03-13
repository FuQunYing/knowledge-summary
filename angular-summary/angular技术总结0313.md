#Day21
##四、响应式表单
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

  
























