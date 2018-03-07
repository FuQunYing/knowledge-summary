#Day16
##九、管道
  每个应用开始的时候差不多都是一些简单任务：获取数据、转换它们，然后把它们显示给用户。 获取数据可能简单到创建一个局部变量就行，也可能复杂到从WebSocket中获取数据流。取到数据之后，可以把它们原始值的toString结果直接推入视图中。 但这种做法很少能具备良好的用户体验。 比如，几乎每个人都更喜欢简单的日期格式，例如1988-04-15，而不是服务端传过来的原始字符串格式 ，就像这样： Fri Apr 15 1988 00:00:00 GMT-0700 (Pacific Daylight Time)。
  显然，有些值最好显示成用户友好的格式。在很多不同的应用中，都在重复做出某些相同的变换。 在HTML模板中应用它们就更方便一些。
  通过引入Angular管道，可以把这种简单的“显示-值”转换器声明在HTML中。
### 1.使用管道
  管道把数据作为输入，然后转换它，给出期望的输出。 比如把组件的birthday属性转换成人看的的日期格式：
```typescript
import { Component } from '@angular/core';
@Component({
  selector: 'app-person-birthday',
  template: `<p>这个人的生日是{{ birthday | date }}</p>`
})
export class HeroBirthdayComponent {
  birthday = new Date(1986, 5, 14);
}
```
  重点是 <p>这个人的生日是{{ birthday | date }}</p>，在这个插值表达式中，组件的birthday值通过管道操作符( | )流动到 右侧的Date管道函数中，然后就会变成正常一点的人看的日期。所有管道都会用这种方式工作。
### 2.内置管道
  Angular内置了一些管道。
  - date 转成日期。
  - json 转成json字符串
  - uppercase 转成大写
  - lowercase 转成小写
  - number 转成数字 后面加冒号可以跟参数 [整数部分保留最小位数：小数部分保留最小位数]
  - currency 加货币符号  后面加冒号跟  要显示的货币符号：是否显示简写符号：小数点控制
  - percent 转百分数
  - slice 截取某一部分
    这些全部都可以直接用在模板中。
### 3.管道参数化
  管道可能接受任何数量的可选参数来对它的输出进行微调。 在管道名后面添加一个冒号( : )再跟一个参数值，来为管道添加参数(比如currency:'EUR')。 如果我们的管道可以接受多个参数，那么就用冒号来分隔这些参数值(比如slice:1:5)。
  通过修改生日模板来给这个日期管道提供一个格式化参数。 当格式化完该人物的5月14日生日之后，它应该被渲染成05/14/86。
```html
<p>这个人物的生日是{{birthday | date :'MM/dd/yy'}}</p>
```
  参数值可以是任何有效的模板表达式，比如字符串字面量或组件的属性。 换句话说，借助属性绑定，就可以像用绑定来控制生日的值一样，控制生日的显示格式。
  比如写个新的组件，它把管道的格式参数绑定到该组件的format属性。新组件模板长这样：
```html
template: `
  <p>这个人的生日是 {{ birthday | date:format }}</p>
  <button (click)="toggleFormat()">Toggle Format</button>
`
```
  在模板中添加一个按钮，并把它的点击事件绑定到组件的toggleFormat()方法。 这个方法会在短日期格式('shortDate')和长日期格式('fullDate')之间切换组件的format属性。
```typescript
export class PersonBirthday2Component {
  birthday = new Date(1986, 5, 9);
  toggle = true; // 开始的时候等于 true == shortDate

  get format()   { return this.toggle ? 'shortDate' : 'fullDate'; }
  toggleFormat() { this.toggle = !this.toggle; }
}
```
  点击按钮的时候，显示的日志会在“04/15/1988”和“Friday, April 15, 1988”之间切换。
### 4.链式管道
  就是把管道链在一起，以组合出一些潜在的有用功能。 比如下满，把birthday链到DatePipe管道，然后又链到UpperCasePipe，这样就可以把生日显示成大写形式了。 比如下面的代码就会把生日显示成MAY 14, 1986：
```html
<p>链式操作生日 {{birthday | date:'fullDate' | uppercase}}</p>
```
### 5.自定义管道
  除了让内置管道，还可以写自定义管道。比如我要写一个把数字转成英文的数字的管道：
```typescript
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'toEn'
})
export class ToEn implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        // 必须有返回值
        if(value ==1){return "one"}
        else if(value==2) {return "two"}
    }
}
```
```html
<p>{{1 | toEn}}</p>
<!--使用方法和内置管道完全一样，一定要记得在declarations数组中声明-->
```
  使用的时候就和内置管道一样用就好了，1就会被渲染成one。
  在这个管道的定义中，有几个关键的点：
  - 管道是一个带有“管道元数据(pipe metadata)”装饰器的类。
  - 这个管道类实现了PipeTransform接口的transform方法，该方法接受一个输入值和一些可选参数，并返回转换后的值。
  - 当每个输入值被传给transform方法时，还会带上另一个参数，比如我们这个管道中的value。
  - 通过@Pipe装饰器告诉Angular：这是一个管道。该装饰器是从Angular的core库中引入的。
  - 这个@Pipe装饰器允许我们定义管道的名字，这个名字会被用在模板表达式中。它必须是一个有效的JavaScript标识符。 比如，这个管道的名字是toEn。
**PipeTransform接口**
    transform方法是管道的基本要素。 PipeTransform接口中定义了它，并用它指导各种工具和编译器。 理论上说，它是可选的。Angular不会管它，而是直接查找并执行transform方法。
### 6.管道与变更检测
  Angular通过变更检测过程来查找绑定值的更改，并在每一次JavaScript事件之后运行：每次按键、鼠标移动、定时器以及服务器的响应。 这可能会让变更检测显得很昂贵，但是Angular会尽可能降低变更检测的成本。
**无管道**
  比如下一个例子中的组件使用默认的、激进的变更检测策略来检测和更新lists数组中的每个人物。模板长这样：
```html
New person:
  <input type="text" #box
          (keyup.enter)="addPerson(box.value); box.value=''"
          placeholder="person name">
  <button (click)="reset()">Reset</button>
  <div *ngFor="let peron of lists">
    {{person.name}}
  </div>
```
  和模板相伴的组件类可以提供人物数组，能把新的英雄添加到人物中，还能重置人物数组。
```typescript
export class SingPersonComponent {
  lists: any[] = [];
  canSing = true;
  constructor() { this.reset(); }
  addPerson(name: string) {
    name = name.trim();
    if (!name) { return; }
    let person = {name, canSing: this.canSing};
    this.lists.push(person);
  }
  reset() { this.lists = LISTS.slice(); }
}
```
  添加新的英雄，加完之后，Angular就会更新显示。 reset按钮会把lists替换成一个由原来人物组成的新数组，重置完之后，Angular就会更新显示。 如果我们提供了删除或修改人物的能力，Angular也会检测到那些更改，并更新显示。
**会唱歌的人  管道**
  比如往ngFor重复器中添加一个SingPersonPipe管道，这个管道能过滤出所有会唱歌的人。首先使用时的模板长这样：
```html
<div *ngFor="let person of (lists | singPerson)">
  {{person.name}}
</div>
```
  然后是SingPersonPipe的实现，它遵循写自定义管道的模式。
```typescript
import { Pipe, PipeTransform } from '@angular/core';
import { Singer } from './lists';
@Pipe({ name: 'singPerson' })
export class SingPersonPipe implements PipeTransform {
  transform(allPersons: Singer[]) {
    return allPersons.filter(person => person.canSing);
  }
}
```
  但是如果运行的话，添加的每个人都会唱歌，但是又没有被显示出来。没有得到期望的行为，但是Angular也没有报错，这里是用了另一种变更检测算法 —— 它会忽略对列表及其子项所做的任何更改。添加新的人物的时候，是这样写的：
```javascript
this.lists.push(person);
```
  当往lists数组中添加一个新的人物时，这个数组的引用并没有改变，它还是那个数组，而引用才是Angular所关心的，从Angular的角度来看，这是同一个数组，并没有变化，也就不需要更新显示。
  可以选择去修复它，创建一个新数组，把这个人追加进去，然后赋值给lists，那Angular就能检测到数组的变化了，它执行了这个管道，并使用这个新数组更新显示，这次它就包括新的会唱歌的人了。如果修改了这个数组，没有被管道执行，也没有显示更新，如果替换了这个数组，管道就会被执行，显示也更新了。
  直接替换这个数组是通知Angular更新显示的一种高效方式，那么究竟应该什么时候替换这个数组呢，当然是数据变化的时候啦。但是，大部分时候，我并不知道数据什么时候发生了改变，尤其是在那些有很多种途径改动数据的程序中 —— 可能在程序中很远的地方。 组件就是一个通常无法知道那些改动的例子。此外，它会扭曲我的组件设计来适应管道。 所以要尽可能保持组件类独立于HTML。组件不应该关心管道的存在。
  所以为了过滤唱歌的人，需要使用非纯管道。
### 7.纯管道与非纯管道
  有两类管道：纯的与非纯的。 默认情况下，管道都是纯的。以前见到的每个管道都是纯的。 通过把它的pure标志设置为false，就可以制作一个非纯管道。所以可以像这样让SingPersonPipe变成非纯的：
```typescript
@Pipe({
  name: 'singPersonImpure',
  pure: false
})
```
#### 7.1 纯管道
  Angular只有在它检测到输入值发生了纯变更时才会执行纯管道。 纯变更是指对原始类型值(String、Number、Boolean、Symbol)的更改， 或者对对象引用(Date、Array、Function、Object)的更改。
  Angular会忽略(复合)对象内部的更改。 如果我更改了输入日期(Date)中的月份、往一个输入数组(Array)中添加新值或者更新了一个输入对象(Object)的属性，Angular都不会调用纯管道。
  这可能看起来是一种限制，但它保证了速度。 对象引用的检查是非常快的(比递归的深检查要快得多)，所以Angular可以快速的决定是否应该跳过管道执行和视图更新。
  因此，如果我要和变更检测策略打交道，就会更偏向用纯管道。 如果不能，就可以转回到非纯管道。
#### 7.2 非纯管道
  Angular会在每个组件的变更检测周期中执行非纯管道。 非纯管道可能会被调用很多次，和每个按键或每次鼠标移动一样频繁。
  实现非纯管道就要很小心啦，昂贵且迟钝的管道可以直接催婚用户体验。
  把SingPersonPipe换成了SingPersonImpurePipe，就像上面那样，把pure写为false，就改好了。当重新输入新的人物，或者修改数组，这个唱歌的人，就跟着更新了。
#### 7.3  非纯 AsyncPipe
  Angular的AsyncPipe是一个非纯管道的例子。AsyncPipe接受一个Promise或Observable作为输入，并且自动订阅这个输入，最终返回它们给出的值。AsyncPipe管道是有状态的。 该管道维护着一个所输入的Observable的订阅，并且持续从那个Observable中发出新到的值。
  比如下面的代码，我用该async管道把一个消息字符串(message$)的Observable绑定到视图中。
```typescript
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
@Component({
  selector: 'app-person-message',
  template: `
    <h2>异步</h2>
    <p>Message: {{ message$ | async }}</p>
    <button (click)="resend()">Resend</button>`,
})
export class PersonAsyncMessageComponent {
  message$: Observable<string>;
  private messages = [
    '许嵩呢？',
    '超爱许嵩！',
    '也超爱山田！'
  ];
  constructor() { this.resend(); }
  resend() {
    this.message$ = Observable.interval(500)
      .map(i => this.messages[i])
      .take(this.messages.length);
  }
}
```
  这个Async管道节省了组件的样板代码。 组件不用订阅这个异步数据源，而且不用在被销毁时取消订阅(如果订阅了而忘了反订阅容易导致隐晦的内存泄露)。
#### 7.4 一个非纯而且带缓存的管道
  比如要写一个服务器发起HTTP请求的管道。
  切记，非纯管道可能每隔几微秒就会被调用一次。 如果不小心点，这个管道就会发起一大堆请求“攻击”服务器。这个管道只有当所请求的URL发生变化时才会向服务器发起请求。它会缓存服务器的响应。 代码如下，它使用Angular http客户端来接收数据：
```typescript
import { Pipe, PipeTransform } from '@angular/core';
import { Http }                from '@angular/http';
import 'rxjs/add/operator/map';
@Pipe({
  name: 'fetch',
  pure: false
})
export class FetchJsonPipe  implements PipeTransform {
  private cachedData: any = null;
  private cachedUrl = '';
  constructor(private http: Http) { }
  transform(url: string): any {
    if (url !== this.cachedUrl) {
      this.cachedData = null;
      this.cachedUrl = url;
      this.http.get(url)
        .map( result => result.json() )
        .subscribe( result => this.cachedData = result );
    }
    return this.cachedData;
  }
}
```
  接下来我用一个测试台组件试一下，该组件的模板中定义了两个使用到此管道的绑定，他们都从persons.json文件中取得英雄数据。
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-hero-list',
  template: `
    <h2>来自文件的列表</h2>
    <div *ngFor="let person of ('assets/persons.json' | fetch) ">
      {{person.name}}
    </div>
    <p>Json格式的数据:
      {{'assets/persons.json' | fetch | json}}
    </p>`
})
export class PersonListComponent { }
```
  在上面，请求数据的时候可以发现：
  - 每个绑定都有自己的管道实例
  - 每个管道实例都缓存了他自己的URL和数据
  - 每个管道实例都只调用一次服务器
```txt
JsonPipe
  第二个绑定除了用到FetchPipe之外还链接了更多管道。 把获取数据的结果同时显示在第一个绑定和第二个绑定中。第二个绑定中，通过链接到一个内置管道JsonPipe把它转成了JSON格式。
  JsonPipe为诊断数据绑定的某些神秘错误或为做进一步绑定而探查数据时，提供了一个简单途径。
```
#### 7.5 纯管道与纯函数
  纯管道使用纯函数。 纯函数是指在处理输入并返回结果时，不会产生任何副作用的函数。 给定相同的输入，它们总是返回相同的输出。
  在前面见过的管道都是用纯函数实现的。 内置的DatePipe就是一个用纯函数实现的纯管道。 toEn是这样， SingPersonComponent也是这样。 还有SingPersonImpurePipe，是一个用纯函数实现的非纯管道。
  但是一个纯管道必须总是用纯函数实现。忽略这个警告将导致失败并带来一大堆这样的控制台错误：表达式在被检查后被变更。
### 8.没有FilterPipe或者OrderByPipe
  Angular没有随身发布过滤或列表排序的管道。 因为  它们性能堪忧，以及 它们会阻止比较激进的代码最小化。 无论是filter还是orderBy都需要它的参数引用对象型属性。 前面说到，这样的管道必然是非纯管道，并且Angular会在几乎每一次变更检测周期中调用非纯管道。
  过滤、 特别是排序是这样耗费内存的操作。 当Angular每秒调用很多次这类管道函数时，即使是中等规模的列表都可能严重降低用户体验。
  Angular建议，把过滤和排序逻辑挪进组件本身。 组件可以对外暴露一个filteredPersons或sortedPersons属性，这样它就获得控制权，以决定要用什么频度去执行其它辅助逻辑。 我原本准备实现为管道，并在整个应用中共享的那些功能，都能被改写为一个过滤/排序的服务，并注入到组件中。

  


























