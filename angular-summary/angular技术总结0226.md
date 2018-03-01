#Day10
## 五、组件样式
  Angular应用使用标准的CSS来设置样式，所以CSS的东西都可以直接用到Angular里面去，还有，Angular还能把组件样式捆绑在我们的组件上，以实现比标准样式更加模块化的设计。
### 1.使用组件样式
  对于每个 Angular 组件来说，除了定义 HTML 模板之外，还要定义用于模板的 CSS 样式、 指定任意的选择器、规则和媒体查询。
  实现方式之一，是在组件的元数据中设置styles属性。 styles属性可以接受一个包含 CSS 代码的字符串数组。 通常只给它一个字符串就行了，就像这样：
```typescript
@Component({
  selector: 'app-root',
  template: `
    <h1>緑間呢</h1>
    <app-person-main [person]=person></app-person-main>`,
  styles: ['h1 { font-weight: normal; }']
})
export class PersonAppComponent {

}
```
  上面styles，放在组件样式中的选择器，只会应用在组件自身的模板中。上面这个例子中的h1选择器只会对 PersonAppComponent模板中的<h1>标签生效，而对应用中其它地方的<h1>元素毫无影响。
  这种模块化相对于 CSS 的传统工作方式是一个巨大的改进。
  - 可以使用对每个组件最有意义的 CSS 类名和选择器。
  - 类名和选择器是仅属于组件内部的，它不会和应用中其它地方的类名和选择器出现冲突。
  - 组件的样式不会因为别的地方修改了样式而被意外改变。
  - 可以让每个组件的 CSS 代码和它的 TypeScript、HTML 代码放在一起，这样项目结构就很清爽啦。
  - 将来可以修改或移除组件的 CSS 代码，而不用遍历整个应用来看它有没有被别处用到，只要看看当前组件就可以了。
### 2.特殊的选择器
  组件样式中有一些从 Shadow DOM 样式范围领域引入的特殊选择器：
#### 2.1 :host选择器
  使用:host伪类选择器，用来选择组件宿主元素中的元素（相对于组件模板内部的元素）。
```css
:host {
  display: block;
  border: 1px solid black;
}
```
  这是能以宿主元素为目标的唯一方式。除此之外，就没有办法指定它了， 因为宿主不是组件自身模板的一部分，而是父组件模板的一部分。要把宿主样式作为条件，就要像函数一样把其它选择器放在:host后面的括号中。
  比如下面这样，再次把宿主元素作为目标，但是只有当它同时带有active CSS 类的时候才会生效。
```css
:host(.active) {
  border-width: 3px;
}
```
#### 2.2 :host-context选择器
  有时候，基于某些来自组件视图外部的条件应用样式是很有用的。 例如，在文档的<body>元素上可能有一个用于表示样式主题 (theme) 的 CSS 类，而我们应当基于它来决定组件的样式。这时可以使用:host-context()伪类选择器。它也以类似:host()形式使用。它在当前组件宿主元素的祖先节点中查找 CSS 类， 直到文档的根节点为止。在与其它选择器组合使用时，它非常有用。
  在下面的例子中，只有当某个祖先元素有 CSS 类theme-light时，才会把background-color样式应用到组件内部的所有<h2>元素中。
```css
:host-context(.theme-light) h2 {
  background-color: #eef;
}
```
#### 2.3 已废弃的 /deep/、>>>和::ng-deep
  组件样式通常只会作用于组件自身的 HTML 上我们可以使用/deep/选择器，来强制一个样式对各级子组件的视图也生效，它不但作用于组件的子视图，也会作用于组件的内容。
  比如下面，以所有的<h3>元素为目标，从宿主元素到当前元素再到 DOM 中的所有子元素：
```css
:host /deep/ h3 {
  font-style: italic;
}
```
```txt
  /deep/ 组合器还有两个别名：>>>和::ng-deep。
  /deep/和>>>选择器只能被用在仿真 (emulated) 模式下,CSS标准中用于 "刺穿Shadow DOM" 的组合器已经被废弃，并将这个特性从主流浏览器和工具中移除。 因此，在 Angular 中将移除对它们的支持（包括/deep/、>>> 和 ::ng-deep）。 目前，建议先统一使用::ng-deep，以便兼容将来的工具。
```
### 3.把样式加载进组件中
#### 3.1 数据中的样式
  可以给@Component装饰器添加一个styles数组型属性。 这个数组中的每一个字符串（通常也只有一个）定义一份 CSS。
```typescript
@Component({
  selector: 'app-root',
  template: `
    <h1>元数据中的样式</h1>
    <app-person-main [person]=person></app-person-main>`,
  styles: ['h1 { font-weight: normal; }']
})
export class PersonAppComponent {
/*随便写点啥*/
}
```
#### 3.2 元数据中指定样式表的URL
  通过在组件的@Component装饰器中添加styleUrls属性，就可以从外部CSS文件中加载样式：
```typescript
@Component({
  selector: 'app-person-details',
  template: `
    <h2>指定样式表</h2>
    <app-person-team [person]=person></app-person-team>
    <ng-content></ng-content>
  `,
  styleUrls: ['./hero-details.component.css']
})
export class HeroDetailsComponent {
/*随便写点啥*/
}
```
```txt
  注意：像 Webpack 这类模块打包器的用户可能会使用styles属性来在构建时从外部文件中加载样式。它们可能这样写：styles: [require('my.component.css')]
  其实，这时候是在设置styles属性，而不是styleUrls属性！ 是模块打包器在加载 CSS 字符串，而不是 Angular。 Angular 看到的只是打包器加载它们之后的 CSS 字符串。 对 Angular 来说，这跟我们手写了styles数组没有任何区别
```
#### 3.3 模板内联样式
  可以在组件的HTML模板中写上<style>的标签啊：
```typescript
@Component({
  selector: 'app-person-controls',
  template: `
    <style>
      button {
        background-color: white;
        border: 1px solid #777;
      }
    </style>
    <h3>模板内联样式</h3>
    <button (click)="activate()">Activate</button>
  `
})
```
#### 3.4 模板中的link标签
  同样可以在组件的HTML模板中写link标签，这个link标签的url相对于应用的根目录。
```typescript
@Component({
  selector: 'app-person-team',
  template: `
    <link rel="stylesheet" href="assets/person-team.component.css">
    <h3>模板内的link标签</h3>
    <ul>
      <li *ngFor="let member of person.team">
        {{member}}
      </li>
    </ul>`
})
```
#### 3.5 CSS @imports语法
  此外还可以利用标准的 CSS @import规则来把其它 CSS 文件导入到我们的 CSS 文件中。
  在这种情况下，URL 是相对于我们执行导入操作的 CSS 文件的。
```typescript
@import 'person-details-box.css'
```
### 4.控制视图的封装模式
  组件的 CSS 样式被封装进了自己的视图中，而不会影响到应用程序的其它部分。通过在组件的元数据上设置视图封装模式，就可以分别控制每个组件的封装模式。 可选的封装模式一共有如下几种：
  - Native模式使用浏览器原生的 Shadow DOM 实现来为组件的宿主元素附加一个 Shadow DOM。组件的样式被包裹在这个 Shadow DOM 中。(不进不出，没有样式能进来，组件样式出不去。)
  - Emulated模式（默认值）通过预处理（并改名）CSS 代码来模拟 Shadow DOM 的行为，以达到把 CSS 样式局限在组件视图中的目的。 (只进不出，全局样式能进来，组件样式出不去)
  - None意味着 Angular 不使用视图封装。 Angular 会把 CSS 添加到全局样式中。而不会应用上前面讨论过的那些作用域规则、隔离和保护等。 从本质上来说，这跟把组件的样式直接放进 HTML 是一样的。(能进能出。)
  通过组件元数据中的encapsulation属性来设置组件封装模式：
```typescript
  encapsulation: ViewEncapsulation.Native
```
  原生(Native)模式只适用于有原生 Shadow DOM 支持的浏览器。 因此仍然受到很多限制，这就是为什么会把仿真 (Emulated) 模式作为默认选项，并建议将其用于大多数情况。
  **查看仿真 (Emulated) 模式下生成的 CSS**
```txt
  当使用默认的仿真模式时，Angular 会对组件的所有样式进行预处理，让它们模仿出标准的 Shadow CSS 作用域规则。
  当查看启用了仿真模式的 Angular 应用时，可以看到每个 DOM 元素都被加上了一些额外的属性。
  <hero-details _nghost-pmm-5>
  <h2 _ngcontent-pmm-5>仿真模式</h2>
  <hero-team _ngcontent-pmm-5 _nghost-pmm-6>
    <h3 _ngcontent-pmm-6>跳跳</h3>
  </hero-team>
 </hero-detail>
  里面有两种被生成的属性：
· 元素在原生封装方式下可能是 Shadow DOM 的宿主，在这里被自动添加上一个_nghost属性。 这是组件宿主元素的典型情况。
· 视图中的每一个元素，都有一个_ngcontent属性，它会标记出该元素是哪个宿主的模拟 Shadow DOM。
  这些属性的具体值并不重要。它们是自动生成的，反正不会在程序代码中直接引用到它们。 但它们会作为生成的组件样式的目标，就像在 DOM 的<head>区看到的：
[_nghost-pmm-5] {
  display: block;
  border: 1px solid black;
}

h3[_ngcontent-pmm-6] {
  background-color: white;
  border: 1px solid #777;
}
  这些就是自己写的那些样式被处理后的结果，于是每个选择器都被增加了_nghost或_ngcontent属性选择器。 在这些附加选择器的帮助下，才实现了文档中所描述的这些作用域规则。
```
  **使用相对URL加载样式**
  把组件的代码 (ts/js)、HTML 和 CSS 分别放到同一个目录下的三个不同文件，是一个常用的实践：
```txt
    quest-summary.component.ts
    quest-summary.component.html
    quest-summary.component.css
```
  Angular里面通过设置元数据的templateUrl和styleUrls属性把模板和 CSS 文件包含进来。 既然这些文件都与组件（代码）文件放在一起，那么通过名字，而不是到应用程序根目录的全路径来指定它，就是个好方式。
  此外也可以通过为文件名加上./前缀来使用相对URL：
```typescript
@Component({
  selector: 'app-quest-summary',
  templateUrl: './quest-summary.component.html',
  styleUrls:  ['./quest-summary.component.css']
})
export class QuestSummaryComponent { }
```



























