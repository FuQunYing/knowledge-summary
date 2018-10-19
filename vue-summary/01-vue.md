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
- 还要按键的修饰符
    - 好多，看文档吧

## 11.表单问题
- v-model 呵呵呵呵呵呵，いろいろ 面倒くせい

## 12.组件问题
- 呵呵呵呵呵呵呵呵呵哒

## 13.响应式原理问题
- 看不懂啊呵呵呵呵呵呵呵呵呵