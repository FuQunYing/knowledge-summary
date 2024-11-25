## AngularJS

###  一、使用

####  1.引入JS文件

```html
<script src="https://cdn.staticfile.org/angular.js/1.4.6/angular.min.js"></script>
```

#### 2.指令

- ng-app="",定义angularJS的使用范围
- ng-init="变量=值;变量='值'"，初始化变量的值，有多个变量时，中间用分号隔开；
- ng-model="变量"，绑定HTML元素到应用程序数据。
- ng-bind="变量"绑定变量名，获取该变量的数据。这里的变量就是第3条的变量名。但是一般都用双重花括号来获取变量的值，比如{{变量}}
- ng-repeat，循环指令

#### 3.模型

- ng-model 指令可以将输入域的值与AngularJS创建的变量绑定，双向绑定
- ng-model 有个坑，如下：

```javascript
// 用下面的代码，每次选择改变的时候，temp应该打印出对应的值才对
<select ng-model='temp' ng-change='valChange(temp)'>
	<option value='1'></option>
	<option value='2'></option>
</select>
// 然而：
$scope.temp = 1;
$scope.valChange = function(val) {
	console.log($scope.temp)// 一直打印1,虽然不理解内部有什么bug，但是change函数不能直接这样打印
	$scope.temp = val;
	console.log($scope.temp)// 这样传值再赋值一下，就照常打印了。。。。ng也太令人迷惑了。。。。。
}
```

#### 4.scope - 作用域？

**AngularJS应用组成如下：**
- View 视图，即html
- Model模型，当前视图中可用的数据
- Controller控制器，即JavaScript函数，可以添加或修改属性

> scope 是模型。是JavaScript函数，带有属性和方法，可以在视图和控制器中使用。

> 只有一个作用域的时候，处理起来比较简单，当有多个作用域，就需要知道使用的scope对应的作用域是哪一个。

> 所有的应用都有一个$rooScope，它可以作用在ng-app指令包含的所有HTML元素，它可作用于整个应用中，是各个controller中scope的桥梁，用rootscope定义的值，可以在各个controller中使用。

**可不可以理解为，scope作用域就在当前模块，rootscope是全局，但是谁会整个全局的变量去使用啊。。。。$scope类似于现在的this的作用？？**

#### 5.AngularJS控制器

- AngularJS应用程序被控制器控制
- ng-controller指令定义了应用程序控制器
- 控制器是JavaScript对象，由标准的JavaScript对象的构造函数创建

```txt
AngularJS应用程序由ng-app定义，应用程序在<div>内运行。
算了，写不下去了，这都是什么鬼
```

#### 6.AngularJS过滤器

- 这个过滤器倒是没有太多变化
- 竖线后面跟上顾虑器

#### 7.AngularJS服务-Service

- AngularJS内建了30多个服务
- 比如$location,$http.....
- 也可以创建自定义服务

```typescript
app.service('xxxservice',function() {
	this.myFun = function(x){
		return x.toString(16);
	}
})
```

#### 8.AngularJS XMLHttpRequest

- $http是AngularJS中的一个核心服务，用于读取远程服务器的数据

```typescript
$http({
	method:'GET',
	url:'/xxxurl'
}).then(function successCallBack(response){
	// 请求成功
},function errorCallBack(response){
	// 请求失败
})
```

#### 9.AngularJS Select - 选择框

- 用ng-options创建选择框

```html
<select ng-options="这里循环出来"></select>

<!--等同于-->

<select>
	<option ng-repeat="循环"></option>
</select>
```
- ng-repeat指令是通过数组来循环HTML代码来创建下拉列表，但是ng-options指令更适合创建下拉列表，因为使用ng-options的选项是一个对象，ng-repeat是一个字符串

#### 10.AngularJS 表格

- 跟在HTML里面没什么区别，就是用ng-repeat循环就行了

#### 11.AngularJS SQL

- 不信谁会用Angular直接去数据库查询数据

#### 11.AngularJS HTML DOM 事件

- ng-disabled
- ng-show
- ng-hide
- ng-click

#### 12.AngularJS模块

- 模块定义了一个应用程序，模块是应用程序中不同部分的容器，模块是应用控制器的容器，控制器通常属于一个模块
- AngularJS文件需要在head里加载，因为对于angular.module的调用只能在库加载完成后才能进行。也可以在\<body>元素中加载AngularJS库，但是必须放置在AngularJS的脚本前面。

#### 13.AngularJS表单

- 表单还是那个表单，利用ng-model来控制数据耳

#### 14.AngularJS输入验证

- AngularJS ng-model指令用于绑定输入元素到模型中
- 验证属性如下：

属性 | 描述
- | - 
$dirty | 表单有填写记录
$valid | 字段内容合法
$invalid | 字段内容是非法的
$pristine | 表单没有填写记录

```html
<!--使用方法-->
<form ng-app="myApp" ng-controller="validateCtrl" name="myForm" novalidate>
	<p>用户名:<br>
    <input type="text" name="user" ng-model="user" required>
    <span style="color:red" ng-show="myForm.user.$dirty && myForm.user.$invalid">
    <!--用户名为空时显示-->
    <span ng-show="myForm.user.$error.required">用户名是必须的。</span>
    </span>
	</p>
	<p>邮箱:<br>
    <input type="email" name="email" ng-model="email" required>
    <span style="color:red" ng-show="myForm.email.$dirty && myForm.email.$invalid">
    <!--邮箱为空时显示-->
    <span ng-show="myForm.email.$error.required">邮箱是必须的。</span>
    <!--邮箱不正确时显示-->
    <span ng-show="myForm.email.$error.email">非法的邮箱。</span>
    </span>
	</p>
  <p>
  <!--邮箱和用户名不符合要求，禁止点击-->
    <input type="submit"
    ng-disabled="myForm.user.$dirty && myForm.user.$invalid ||
    myForm.email.$dirty && myForm.email.$invalid">
  </p>
</form>
```

#### 15.AngularJS全局API

API | 描述
- | -
angular.lowercase(<angular 1.7) <br> angular.$$lowercase (angular1.7+) | 转换字符串为小写
angular.uppercase(<angular 1.7) <br> angular.$$uppercase (angular1.7+) | 转换字符串为大写
angular.isString() | 判断给定的对象是否为字符串，如果是，返回true
angular.isNumber() | 判断给定的对象是否为数字，如果是，返回true

#### 16.AngularJS与Bootstrap

- 那个时候还没有ant-design，可不是就用bootstrap么

#### 17.AngularJS包含

- ng-include，包含html也行，包含AngularJS代码也行

```html
<div ng-include="'xxx.html'"></div>
<!--如果跨域包含,可以设置域名访问白名单-->
<div ng-include="'xxxxxurl'"></div>
<script>
	var app = angular.module('myApp', [])
app.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'xxxxxurl'
    ]);
});
// xxxxurl 里面也要加上允许跨域的头
</script>
```

#### 18.AngularJS动画

- ngAnimate，我用css动画不好么

#### 19.依赖注入

- 用了挺久的ng4-6，都没搞明白依赖注入

#### 20.AngularJS路由


















