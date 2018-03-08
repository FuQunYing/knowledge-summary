#Day18-表单
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























