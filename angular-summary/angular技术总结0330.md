#Day29
## 十二、Angular模块的常见问题
### 12.forRoot()方法是什么？
	静态方法forRoot()是一个约定，可以让开发人员更轻松的配置模块的提供商。
	RouterModule.forRoot()就是一个很好的例子，应用把一个Routes对象传给RouterModule.forRoot(),为的就是使用路由配置全应用级的Router服务，RouterModule.forRoot()返回一个ModuleWithProviders对象，然后把这个结果添加到根模块的AppModule的imports数组中。只能在应用的根模块AppModule中调用并导入.forRoot()的结果，在其它模块中导入它，