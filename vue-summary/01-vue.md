# 一些文档总结

## 1.Vue实例相关
- 一个Vue应用由一个通过new Vue创建的根Vue实例，以及可选的嵌套额、可复用的组件树组成
    - 所有的Vue组件都是Vue实例，并且接受相同的选项对象
- 当一个Vue实例被创建时，它向Vue的响应式系统中加入了其data对象中能找到的所有的属性。当这些属性值发生变化时，视图将会更新
    - 但是只有实例被创建的时候data中存在的属性才是响应式的，如果在中途添加一个vm.xx = xx，xx的怪东并不会引起视图的更新，所以需要的属性需要在一开始就声明好（这个很好理解，和ng一样）
    - 如果声明了一个对象，然后对这个对象这样：Object.freeze(objname)，那么，vue也不会追踪这个objname的数据变化

## 2.Vue生命周期相关
- created、mounted、updated、destroyed生命周期钩子，里面的this指向Vue实例
    - 首先注意，钩子方法不要用箭头函数
    - Vue实例的生命周期（八个），beforeCreate、created、beforeMount、mounted、beforeUpdate、updated、beforeDestroy、destroyed，见名知意

## 3.模板语法相关
- {{}} 差值表达式很熟悉了，但是在Vue中，{{}}只能用于标签元素之内，标签上写v-once，一次性插值，之后内容不会再更新
    - 只会解析成字符串，如果要插入HTML，标签上写v-html='变量'，那这个标签就会被‘变量’中的内容替换。站点上这样用很容易导致xss攻击
    - 区别来了，属性上不能用{{}}（ng就可以，随便用）。属性上就只能v-bind去绑定了或者简写冒号 v-bind:xx属性=‘xx变量/或者表达式’，不加{},直接在引号里面写表达式，加上大括号反而不识别，，，真是别扭

## 4.指令相关
- v-if
- v-for
- 一些指令可以接收参数来动态更新HTML，还有v-on:click这种，监听DOM事件

## 5.修饰符
- 就是以 . 指明的特殊后缀，用于指出一个指令应该以特殊方式绑定，比如.prevent告诉v-on指令，对于触发事件要调用event.preventDefault()

## 6.计算属性，监听相关
- 通常呢，有的时候处理一些表达式的格式，会直接在{{}}这里面写，反正ng里面是这样写的，Vue中可以把方法写在computed中，然后在{{}}里面，这样 "{{handlesomething}}"，调用一下，就可以了。
    - 那么问题来了，下面这个方法，写在methods里面，然后我这样调用："{{handlesoething()}}"，也可以有同样的效果。不过，计算属性是依赖缓存的，只有在依赖关系发生改变时它们才会重新求值，这就意味着只要被handle的值没有变化，那么之后的访问都会直接返回原来的计算值，不必再次执行函数，如果是methods里面的方法，每次触发重新渲染的时候，方法总会被再次执行，如果有的是大量计算，那就太费内存了
```javascript
compouted: {
    handlesomething: function() {
        return xxxxx
    }
}
```
- 有个watch，监听某个变量，如果被监听的变量改变了，就触发某个方法，比如input里的值改变了，拿到值要坐什么什么，感觉用的不多

## 7.Class与Style绑定相关
- 这里真的真的不能以ng的方法来用了
    - 写法一：v-bind:class="{xxxclass: Boolean}"，根据真假来切换这个class，需要控制多个class的话，可以写在一个对象里面,然后用的时候直接:class="classObject"，不加{}，不需要Boolean判断的class，都不加{}！！！！
```javascript
data: {
    classObject: {
        active: true,
        'text-danger': false
    }
}
//或者写在computed里面
data: {
    isActive: true,
    error: null
},
computed: {
    classObject: function() {
        return {
            active: this.isActive && !this.error,
            'text-danger': this.error && this.error.type === 'fatal'
        }
    }
}
```
- 可以给:class传一个数组，来应用一个class列表 ，比如 :class="[activeclass, errorClass]"，如果想根据条件切换列表中的class，可以用三元表达式:class="[isActive ? activeClass: '', errorClass]"，这样写将始终添加errorClass，isActive为true的时候才会添加isActive，但是看着不好看，所以可以这样写 :class="[{active: isActive}, errorClass]"

```javascript
data:{
    activeClass : 'active',
    errorClass: 'text-danger'
}
```
- 如果在自定义组件上使用class属性时，这些类将被添加到这个组价的根元素上，不会覆盖原来的class。
- v-bind:style是对象语法，CSS属性名可以用驼峰或者串串,比如 :style="{color: activeColor, fontSize: fontSize + 'px'}",或者直接绑定到一个样式对象，:style="styleObject"，数组语法可以将锁哥样式对象应用到同一个元素上，侦测浏览器添加对应的前缀
- 2.3.0起，可以为style绑定中的属性提供一个包含多个值得数组，比如:style="{display: ['-webkit-box', '-ms-flexbox', 'flex'}"，这样就只渲染浏览器支持的值

```javascript
data: {
    activeColor: 'red',
    fontSize: 30,
    styleObject: {
        activeColor: 'red',
        fontSize: 30,
    }
}
```

## 8.v-if
- 这个跟ng没啥差别

## 9.v-for
- 这里与ng语法有些不同ng是 *ngFor="ley xx of xxx;let i = index"，这里是v-for="xx in xxx"，需要index，则是v-for="(xx, index) in xxx"，用of替换in也行
- 如果循环的是对象，v-for="(value,key,index) in xxx"，就拿到了索引，值，属性名
- 除非循环的东西很简单，不然最好绑定key，:key="xx.id"，这是Vue识别节点的一个通用机制

## 10.事件绑定
- @eventname='xxx'，xxx是methods里的方法，还有一些事件修饰符
    - \<a v-on:click.stop="doThis">，阻止单击事件继续传播
    - \<form v-on:submit.prevent="onSubmit"><，提交事件不再重载页面
    - \<a v-on:click.stop.prevent="doThat">，修饰符可以串联
    - \<form v-on:submit.prevent>，只有修饰符
    - \<div v-on:click.capture="doThis">，添加事件监听器时使用事件捕获模式，即元素自身触发的事件先在此处理，然后才交由内部元素进行处理
    - \<div v-on:click.self="doThat">，只当在event.target是当前元素自身时触发处理函数，即事件不是从内部元素触发的
    - 用 v-on:click.prevent.self 会阻止所有的点击，而 v-on:click.self.prevent 只会阻止对元素自身的点击。
    - 2.1.4新增，\<a v-on:click.once="doThis">，点击事件只会触发一次
    - 2.3.0新增，\<div v-on:scroll.passive="onScroll">，滚动事件的默认行为（即滚动行为）将会立即触发，而不会等待 onScroll完成，这其中包含event.preventDefault()的情况，这个修饰符可以提高移动端的性能。
    - .passive和.prevent不要一起使用，因为prevent会被忽略，同时浏览器可能会展示一个警告，passive会告诉浏览器我不想阻止事件的默认行为
- 还有按键的修饰符
    - 在监听键盘事件时，经常需要检查常见的键值，Vue允许为v-on在监听键盘事件时添加按键修饰符，比如：
```html
<!-- 只有在 keyCode 是13时调用 vm.submit() -->
<input keyup.13="submit">
<!-- 记住所有的keyCode比较困难，所以Vue为最常用的按键提供了别名： -->
<!-- 同上： -->
<input v-on:keyup.enter="submit">
<!-- 缩写语法： -->
<input @keyup.enter="submit">
``` 
- 全部的按键别名
    - .enter
    - .tab
    - .delete(捕获“删除”和“退格”键)
    - .esc
    - .space
    - .up
    - .down
    - .left
    - .right
```javascript
//可以通过全局config.keyCodes对象自定义按键修饰符别名
//可以使用v-on:keyup.f1，比如
Vue.config.keyCodes.f1 = 112
```
- 自动匹配按键修饰符
    - 可以直接将KeyboardEvent.key暴露的任意有效按键名转换为kebab-case来作为修饰符：
```html
<input @keyup.page-down="onPageDown">
<!-- 在这里，处理函数仅在$event.key === 'PageDown' 时被调用
     有一些按键(.esc以及所有的方向键)在IE9中有不同的key值，如果想支持IE9，它们的内置别名应该是首选
-->
```
- 系统修饰键，可以用如下修饰符来实现仅在按下相应按键时才触发鼠标或键盘事件的监听器
    - .ctrl
    - .alt
    - .shift
    - .meta
    - 注意修饰键与常规按键不同，在和keyup事件一起用时，事件触发时修饰键必须处于按下状态，换句话说，只有在按住ctrl的情况下释放其它按键，才能触发keyup.ctrl，而单单释放ctrl也不会触发事件，如果想要这样的行为，要把ctrl换用为keyCode:keyup.17
    - .exact修饰符
        - .exact修饰符允许控制由精确的系统修饰符组合触发的事件
    - 鼠标按钮修饰符，这些修饰符会限制处理函数仅响应特定的鼠标按钮
        - .left
        - .right
        - .middle
```html
<!-- 关于.exact修饰符 -->
<!-- 即使Alt或shift被一同按下时也会触发 -->
<button @click.ctrl="onClick"></button>
<!-- 有且只有Ctrl被按下时才触发 -->
<button @click.ctrl.exact="onCtrlClick"></button>
<!--  没有任何系统修饰符被按下的时候才触发 -->
<button @click.exact="onClick"></button>
```
- Question:在HTML中监听事件的优点
    - 看一眼HTML模板就能定位JS代码里对应的方法
    - 无需在JS里手动绑定事件，ViewModel代码可以是非常纯粹的逻辑，和DOM完全解耦，更易于测试
    - 当一个ViewModel被销毁时，所有的事件处理器都会自动被删除，不需要再想着如何去清理它们

## 11.表单输入绑定
### 11.1 基础用法
  可以用v-model指令在表单\<input>、\<textarea>及\<select>元素上创建双向数据绑定。它会根据控件类型自动选取正确的方法来更新元素，v-model本质上就是语法糖，它负责监听用户的输入事件以更新数据，并对一些极端场景进行一些特殊处理。
  v-model会忽略所有表单元素的value、checked、selected特性的初始值而总是将Vue实例的数据作为数据来源。应该通过JS在组件的data选项中声明初始值。对于需要使用输入法的语言，v-model不会在输入法组合文字过程中得到更新，如果想要处理这个过程，使用input事件。
- 文本
```html
<input v-model="message" placeholder="edit here">
```
- 多行文本
```html
<span> Multiline message is：</span>
<p style="whit-space:pre-line">{{message}}</p>
<br>
<textarea v-model="message" placeholder="add multiple lines"></textarea>
<!-- 在文本区域插值（<textarea></textarea>）并不会生效，应用v-model来代替 -->
```
- 复选框
```html
<!-- 单个复选框绑定到布尔值 -->
<input type="checkbox" id="checkbox" v-model="checked">
<label for="checkbox">{{checked}}</label>

<!-- 多个复选框，绑定到同一个数组 -->
<div id='example-3'>
  <input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
  <label for="jack">Sherlock</label>
  <input type="checkbox" id="john" value="John" v-model="checkedNames">
  <label for="john">John</label>
  <input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
  <label for="mike">Mike</label>
  <br>
  <span>Checked names: {{ checkedNames }}</span>
</div>
```
- 单选按钮
```html
<div id="example-4">
  <input type="radio" id="one" value="One" v-model="picked">
  <label for="one">One</label>
  <br>
  <input type="radio" id="two" value="Two" v-model="picked">
  <label for="two">Two</label>
  <br>
  <span>Picked: {{ picked }}</span>
</div>
```
- 选择框
```html
<!-- 单选时： -->
<div id="example-5">
  <select v-model="selected">
    <option disabled value="">请选择</option>
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
  <span>Selected: {{ selected }}</span>
</div>
<!-- 如果v-model表达式的初始值未能匹配任何选项，<select>元素将被渲染为 未选中 状态，在ios中，这会使用户无法选择第一个选项。因为这样的情况下，ios不会触发change事件，因此，提供一个值为空的禁用选项比较好 -->
<!-- 多选时（绑定到一个数组）： -->
<div id="example-6">
  <select v-model="selected" multiple style="width: 50px;">
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
  <br>
  <span>Selected: {{ selected }}</span>
</div>
<!-- 一般情况下，option都是循环出来的 -->
```
### 11.2 值绑定
  对于单选按钮，复选框及选择框的选项，v-model绑定的值通常是静态字符串（对于复选框也可以是布尔值）：
```html
<!-- 当选中时，picked为字符串a -->
<input type="radio" v-model="picked" value="a">
<!-- `toggle` 为 true 或 false -->
<input type="checkbox" v-model="toggle">
<!-- 当选中第一个选项时，`selected` 为字符串 "abc" -->
<select v-model="selected">
  <option value="abc">ABC</option>
</select>
<!-- I don't eat when I'm working. Digesting slows me down -->
```
- 复选框
```html
<input typ="checkbox" v-model="toggle" true-value="yes" false-value="no">
<!-- 当选中时，vm.toggle==='yes'， 没有选中时，vm.toggel===='no'
这里的true-value和false-value特性并不会影响非输入控件的value特性，因为浏览器在提交表单时并不会包含未被选中的复选框。如果要确保表单中这两个值中的一个能够被提交（比如yes或no），可以换用单选按钮
 -->
```
- 单选按钮
```html
<input type="radio" v-model="pick" v-bind:value="a">
<!-- 当选中时，vm.pick====vm.a -->
```
- 选择框的选项
```html
<select v-model="selected">
    <!-- 内联对象字面量 -->
    <option v-bind:value="{number: 123}">123</option>
</select>
<!-- 当选中时：typeof vm.selected=>'object',vm.selected.number => 123 -->
```
### 11.3 修饰符
- .lazy
```html
<!-- 
在默认情况下，v-model在每次input事件触发后将输入框的值与数据进行同步，可以添加lazy修饰符，从而转变为使用change事件进行同步
 -->
 <!-- 在change 时而非 input时更新 -->
 <input v-model.lazy="msg"/>
```
- .number
```html
<!-- 
    如果想自动将用户的输入值转为数值类型，可以给v-model添加number修饰符，因为即使type='number'，HTML输入元素的值也总会返回字符串，如果这个值无法被parseFloat()解析，则会返回原始的值
 -->
 <input v-model.number="age" type="number"/>
```
- .trim
```html
<!-- 
    如果要自动过滤用户输入的首位空白字符，可以给v-model添加trim修饰符
 -->
 <input v-model.trim="msg">
```
### 11.4 在组价上使用 v-model
HTML原生的输入元素类型并不总能满足需求，Vue的组件系统允许创建具有完全自定义行为且可复用的输入组件。这些输入组件甚至可以和v-model一起使用。
## 12.组件问题
### 12.1 组件定义
组件是可复用的Vue实例

之前老师给的定义是啥来着？？

一个Vue组件示例：
```javascript
// 定义一个名为button-counter的新组建
Vue.component('button-counter', {
    data: function() {
        return{
            count: 0
        }
    },
    template: '<button @click="count++">我被点了{{count}}次</button>'
})
```
```html
<!-- 使用上面的组件 -->
<div>
    <button-counter></button-counter>
</div>
<!-- 
    因为组件是可复用的Vue实例，所以它们与new Vue接收相同的选项，例如data、computed、watch、methods以及生命周期钩子等，仅有的例外是像el这样的根据实例特有的选项。
 -->
```
### 12.2 组件的复用
组件可以被无数次的复用：
```html
<div>
    <button-counter></button-counter>
    <button-counter></button-counter>
    <button-counter></button-counter>
</div>
<!-- 点击按钮的时候，每个组件都会维护各自的count，因为每用一次组件，就会有一个新的实例被创建 -->
```
- 注意，data必须是一个函数
```javascript
// 当定义这个<button-counter>组件的时候，data并不是像这样提供一个对象出来：
data: {
    count:0//以前好像这样写过
}
//取而代之的是，一个组件的data选项必须是一个函数，因此每个实例可以维护一份被返回对象的独立的拷贝
data() {
    return {
        count:0
    }
}
//如果没有这条规则，那点击这个按钮，别的按钮的count也会被影响
```
### 12.3 组件的组织
如图，一个Vue应用可以用这个组件树的形式来组织：
![图片](components.png)
比如，我可能有页头、页尾、侧边栏,每个组件又包含了其它的像导航链接、博文之类的组件。为了能在模板中使用，这些组件必须先注册以便Vue能够识别，这里有两种组件的注册类型：全局注册和局部注册，到目前看到的，组价都是通过Vue.component全局注册的：
```javascript
Vue.component('my-component',{
    //....options
})
```
全局注册组件可以用在其被注册之后的任何新建的Vue根实例，也包括其组件树中的所有子组件的模板中。
### 12.4 父组件向子组件传值
如果说要做一个博文组件，问题是如果不能向这个组件传递某一篇博文的标题或者内容之类的想要展示的数据的话，它是没办法使用的。所以有了prop，prop是我可以在组件上注册的一些自定义特性。当一个值传递给一个prop特性的时候，它就变成了那个组件实例的一个属性，为了给博文组件传递一个标题，可以用props选项将其包含在该组件可接受的prop列表中：
```javascript
Vue.component('blog-post',{
    props: ['title'],
    template: '<h3>{{title}}</h3>'
})
```
一个组件默认可以拥有任意数量的prop，任何值都可以传递给任何prop，在上述模板中，可以看到能在组件中访问这个值，就像访问data中的值一样。一个prop被注册之后，可以像下面这样把数据作为一个自定义特性传递进来：
```html
<blog-post title="随便写一个标题"></blog-post>
```
在典型应用中，可能在data里有一个博文的数组：
```javascript
```


## 13.响应式原理问题
- 