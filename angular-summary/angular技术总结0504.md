# Day37
## 八、HttpClient
  大多数前端应用都需要通过HTTP协议与后端服务器通讯，现代浏览器支持使用两种不同的API发起HTTP请求：XMLHttpRequest接口和fetch()API。
  @angular/common/http中的HttpClient类为Angular应用程序提供了一个简化的API来实现HTTP客户端功能，它基于浏览器提供的XMLHttpRequest接口，HttpClient带来的其它有点包括：可测试性、强类型的请求和响应对象、发起请求与接收响应时的拦截器支持，以及更好的、基于可观察对象的API以及流式错误处理机制
### 1.准备
  要使用HttpClient，要