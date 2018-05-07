# Day37
## 八、HttpClient
  大多数前端应用都需要通过HTTP协议与后端服务器通讯，现代浏览器支持使用两种不同的API发起HTTP请求：XMLHttpRequest接口和fetch()API。
  @angular/common/http中的HttpClient类为Angular应用程序提供了一个简化的API来实现HTTP客户端功能，它基于浏览器提供的XMLHttpRequest接口，HttpClient带来的其它有点包括：可测试性、强类型的请求和响应对象、发起请求与接收响应时的拦截器支持，以及更好的、基于可观察对象的API以及流式错误处理机制
### 1.准备
  要使用HttpClient，要先导入Angular的HttpCLientModule，大多数应用都会在根模块AppModule进行导入：
```typescript
import {NgMModule} from '@angular/core';
import {{BrowserModule}} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
@NgModule({
    imports:[
        BrowserModule,
        HttpClientModule//在BrowserModule之后引入HttpClientModule
    ],
    declarations:[
        AppComponent
    ],
    bootstrap:[AppComponent]
})
export class AppMModule{}
```
  在AppModule中导入HttpClientModule之后，可以把HttpClient注入到应用类中，就像ConfigService这样：
```typescript
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http'
@Injectable()
export class ConfigService{
    constructor(private http: HttpClient){}
}
```
### 2.获取JSON数据
  应用通常会从服务器上获取JSON数据，比如，该应用可能要从服务器上获取配置文件config.json，其中指定了一些特定资源的URL：
```json
{
    'personsUrl':'api/persons',
    'textfile':'assets/textfile.txt'
}
```
  ConfigService会通过HttpClient的get()方法取得这个文件：
```typescript
configUrl='assets/config.json';
getConfig(){
    return this.http.get(this.configUrl)
}
```
  像ConfigComponent这样的组件会注入ConfigService，并调用其getConfig方法：
```typescript
showConfig(){
    this.configService.getConfig()
        .subscribe((data:config)=>this.config={
            personsUrl:data['personsUrl'],
            textfile:data['textfile']
        })
}
```
  这个服务方法返回配置数据的Observable对象，所以组件要订阅(subscribe)该方法的返回值，订阅的回调函数会把这些数据字段复制到组件的config对象中，它会在组件的模板中绑定，以供显示。
#### 2.1 为啥要写服务？
  上面的例子太简单，所以它也可以在组价本身的代码中调用Http.get()，而不用借助服务。不过数据访问很少能这么简单，通常都要对数据做后处理，添加错误处理器，还可能加一些重试逻辑，以便应对网络抽风的情况 。
  该组件很快就会因为这些数据方式的细节而变得杂乱不堪，组件变得难以理解、难以测试，并且这些数据访问逻辑无法被复用，也无法标准化，这就是为什么最佳实践中要求把数据展现逻辑从数据访问逻辑中拆分出去，也就是说把数据访问逻辑包装进一个单独的服务中，并且在组件中把数据访问逻辑托给这个服务。
#### 2.2 带类型检查的响应
  该订阅的回调需要用通过括号中的语句来提取数据的值：
```typescript
.subscribe((data:config)=>this.config={
            personsUrl:data['personsUrl'],
            textfile:data['textfile']
        })
```
  没法写成data.personsUrl，因为Typescript会报告说来自服务器的data对象中没有名叫personsUrl的属性。























