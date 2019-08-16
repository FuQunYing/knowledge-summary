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
