## Angular实践知识

### 1.路由判断

> 使用 NavigationStart, Router

```js
	this.router.events.subscribe(event => {
		if (event instanceof NavigationStart) {
			// 路由 - event.url
			// 切换 - event.navigationTrigger
		}
	})
```

**navigationTrigger**
 - 三种trigger，不知道具体怎么解释，不过地址栏手动输入的话，是popstate
 - 判断是不是从空路由跳转过来的，拿到NavigationEnd的url和urlAfterRedirects，然后做判断
 - 错误路由不跳转

### 2.ant deign 编译时更改路径

 > 引入NzIconService

```js
// 使用environment文件定义路径，开发环境和生产环境互相不影响
this.nz.changeAssetsSource(environment.SERVER_URL);
```

### 3.请求接口的状态码

```js
// 请求时在参数后面添加一个options
this.http.post(param,{observe: 'response'})
//正常请求回来，返回一个httpResponse对象，body为返接口返回的数据，status为状态码，一般都是200
//如果请求出错，在调用请求的时候
this.service.fun({}).subscribe(res => {
	//res 为httpResponse对象
},error=>{
	//如果请求出错，error就是一个httpErrorResponse对象，可以判断status状态码
})
```

### 4.angularJS 使用datepicker时，想要每个周末不可选

```js
// 一个函数
  function disabled(data) {
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }
	// 然后在dateOptions中使用
	$scope.dateOptions = {
		dateDisabled: disabled
	}
	// 然后在HTML的标签上，把dateOptions使用一下即可，disabled函数的原理？？
```

### 5.Angular8中上传图片并预览

```javascript
// 引入下面这个模块
import { DomSanitizer } from '@angular/platform-browser'; // 这个模块到底是干嘛的呢
// 实例化之后，在img标签上使用
<img [src]="doms.bypassSecurityTrustUrl(files)">

// 其中files的获取，首先是input上绑定的
<input type="file"  accept="image/png,image/jpg,image/jpeg" (change)="fileChange($event)">

// 然后在事件中
fileChange(e) {
	const file = e.srcElement.files[0];
	this.files = window.URL.createObjectURL(file);
}
//window.URL.createObjectURL 创建一个DOMString，其中包含一个表示参数中给出的对象的url，这个url的生命周期和创建它的窗口中的document绑定，这个新的url对象表示指定的file对象或者blob对象
```