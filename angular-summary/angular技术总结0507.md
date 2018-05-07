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
  没法写成data.personsUrl，因为Typescript会报告说来自服务器的data对象中没有名叫personsUrl的属性。这是因为HttpClient.get()方法把JSON响应体解析成了匿名的Object类型，它不知道该对象的具体形态如何，那我就可以告诉这个HttpClient该响应体的类型，以便让对这种输出的消费更容易、更明确。
  首先，定义有一个具有正确形态的接口：
```typescript
export interface Config{
    personsUrl:string;
    textfile:string
}
```
  然后，在服务器中把该接口指定为HttpClient.get()调用的类型参数
```typescript
getConfig(){
    return this.http.get<Config>(this.configUrl)//返回一个可观察的配置
}
```
  修改后的组件方法，其回调函数中获取一个类型的对象，它易于使用，且消费起来更安全：
```typescript
config:Config;
showConfig() {
    this.configService.getConfig()
        .subscribe((data:Config)=>this.config={...data})//使用其已知的配置形状克隆数据对象
}
```
#### 2.3 读取完整的响应体
  响应体可能并不包含我需要的全部信息，有时候服务器会返回一个特殊的响应头或者状态码，以标记出特定的条件，因此读取它们可能是必要的，要这样做，就要通过observe选项来告诉HttpClient，想要完整的响应信息，而不是只有响应体：
```typescript
getConfigResponse():Observable<HttpReponse<Config>>{
    return this.http.get<Config>(
    this.configUrl,{observe:'response'})
}
```
  现在HttpClient.get()会返回一个HttpResponse类型的Observable，而不只是JSON数据，该组件的showConfigResponse()方法会像显示配置数据一样显示响应头：
```typescript
showConfigResponse(){
    this.configService.getConfigResponse()
        .subscribe(resp=>{//resp的类型是`HttpResponse <Config>`
            const keys=resp.headers.keys();//头部显示出来
            this.headers=keys.map(key =>`${key}:${resp.headers.get(key)}`)
            this.config={....resp.body}//直接访问主体，键入为Config。
        })
}
//看吧，该响应对象具有一个带有正确类型的body属性
```
### 3.错误处理
  如果这个请求导致了服务器错误咋整，甚至，在烂网络请求下都没有连接到服务器，HttpClient就会返回一个错误而不再是成功的响应，通过在.subscribe()中添加第二个回调函数，可以在组件中处理它：
```typescript
showConfig(){
    this.configService.getConfig()
        .subscribe((data:Config)=>this.config={...data}),//请求成功的函数
        error=>this.error=error//失败的函数
}
//在数据访问失败时给用户一些反馈挺好，但是直接显示由3HttpClient返回的原始错误数据是不够的
```
#### 3.1 获取错误详情
  检测错误的发生是第一步，不过如果知道具体发生了什么错误才会更有用，上面例子中传给回调函数的err参数的类型是HttpErrorResponse，它包含了这个错误中一些很有用的信息。可能发生的错误分为两种，如果后端返回了一个失败的返回码（比如404,500等），它会返回一个错误的响应体，或者，如果在客户端这边出了错误（比如在RxJS操作符中抛出的异常或者某些阻碍完成这个请求的网络错误），就会抛出一个Error类型的异常。HttpClient会在HttpErrorResponse中捕获所有类型的错误信息，我就可以查看这个响应体然后可以知道到底发生了什么。
  错误的探查、解释和结局都是应该在服务中做的事情，而不是在组件中，可能首先要设计一个错误处理器，就像这样：
```typescript
private handleError(error:HttpErrorResponse){
    if(error.error instanceof ErrorEvent){
        console.error(`发生了错误：`error.error.message)//发生客户端或网络错误，进行相应的处理
    }else {
    //后端返回了不成功的响应代码。响应主体可能包含关于错误发生的线索，
        console.error(`后台返回响应代码${error.code}.响应体是：${error.error}`)
    }
    //用面向用户的错误消息返回一个observable
    return throwError('请求发生错误，请稍后再试')
}
```
  注意，该处理器返回一个带有用户友好错误信息的RxJSErrorObservable对象，该服务的消费者期望服务的方法返回某种形式的Observable，就算是“错误的”也可以，现在我获取了由HttpClient方法返回的Observable，并把它们通过管道传给错误处理器：
```typescript
getConfig(){
    return this.http.get<Config>(this.configUrl)
      .pipe(catchError(this.handleError))
}
```
#### 3.2 retry()
  有时候，错误只是临时性的，只要重试 就可能会自动消失，比如，在移动端场景中可能会遇到网络中断的情况，只要重试一下就能拿到正确的结果。RxJS库提供了几个retry操作符，这些需要仔细看看了，最简单的就是retry()，它可以对失败的Observable自动重新订阅几次，对HttpClient方法调用的结果进行重新订阅会导致重新发起HTTP请求。
  把它插入到HttpClient方法结果的管道中，就放在错误处理器的前面：
```typescript
getConfig(){
    return this.http.get<Config>(this.configUrl)
    .pipe(retry(3),//重试失败的请求，最多3次
    	catchError(this.handleError)//然后处理错误
    )
}
```
### 4.可观察对象（Observable）与操作符（operator）
  RxJS是一个库，用于把异步调用和基于回调的代码组合成函数式（functional）的，响应式（reactive）的风格，很多AngularAPI，包括HttpClient都会生成和消费RxJS的Observable。RxJS本身超出了这一节的范围，后面自行了解加深。、
  跟着教程敲的代码，要注意自己导入这里出现的RxJS的可观察对象和操作符，就像ConfigService中的这些导入：
```typescript
import {Observable,throwError} from 'rxjs';
import {catchError,retry} from 'rxjs/operators'
```
### 5.请求非JSON格式的数据
  不是所有的API都会返回JSON数据，在下面这个例子中，DownloadService中的方法会从服务器读取文本文件，并把文件的内容记录下来，然后把这些内容使用Observable<string>的形式返回给调用者：
```typescript
getTextFile(filename:string){
    //由get（）返回的Observable类型为Observable <string>，因为指定了文本响应。
   //不需要将<string>类型参数传递给get（）。
   return this.http.get(filename,{response:'text'})
   .pipe(
   	tap(//记录结果或者错误
   		data=>this.log(filename,data),
   		error=>this.logError(filename,error)
   	)
   )
}
```
  这里的HttpClient.get()返回字符串而不是默认的JSON对象，因为它的responseType选项是'text'.RxJS的tap操作符（可看做wiretap-窃听），让这段代码探查由可观察对象穿过来的正确值和错误值，而不用打扰它们。在DownloaderComponent中的download()方法通过订阅这个服务张红的方法来发起一次请求：
```typescript
download(){
    this.downloaderService.getTextFile('assets/textfile.txt')
    .subscribe(results=>this.contents=result;)
}
```
### 6.把数据发送到服务器
  除了从服务器获取数据之外，HttpClient还支持修改型的请求，也就是说，通过PUT、POST、DELETE这样的HTTP请求方法把数据发送到服务器。人物列表又来了，它会回去人物数据，并允许用户添加、删除和修改它们
#### 6.1 添加请求头
  很多服务器在进行保存型操作时需要额外的请求头，比如，它们可能需要一个Content-Type头来显式定义请求体的MIME类型，也能服务器会需要一个认证用的token，PersonsService在httpOptions对象中就定义了一些这样的请求头，并把它传给每个HttpClient的保存型方法：
```typescript
import {HttpHeaders} from '@angularr/commmon/http';
const httpOptions={
    headers:new HttpHeaders({
        'Content-Type':'application/json',
        'Authorization':'my-auth-token'
    })
}
```
#### 6.2 发起一个POST请求
  应用经常把数据POST到服务器，它们会在提交表单时进行POST，下面的代码里，PersonService在把人物添加到数据库中时，就会使用POST：
```typescript
//使用POST添加一个人物数据
addPerson(person:Person):Observable<Person>{
    return this.http.post<Person>(this.personUrl,person,httpOptions)
    .pipe(catchError(this.handleError('addPerson',person)))
}
```
  HttpClient.post()方法像get()一样也有类型参数，它包含一个资源URL，它还接受另外两个参数：
  - person-要POST的请求体数据
  - httpOptions-这个例子中，该方法的选项指定了所需的请求头
  它捕获错误的方式很像前面描述的操作方式，它还窃听了可观察对象的返回值，以记录成功的POST，PersonsComponent通过订阅该服务方法返回的Observable发起了一次实际的POST操作：
```typescript
this.personsService.addPerson(newPerson)
    .subscribe(person=>this.persons.push(person))
```
  当服务器成功做出响应时，会带有这个新创建人物，然后该组件就会把这个人物添加到正在显示的persons列表里面。
#### 6.3 发起DELETE请求
  该应用可以把人物的id传给HttpClient.delete方法的请求URL来删除一个人物：
```typescript
//从服务器上删除一个人
deletePerson(id:number):Observable<{}>{
    const url=`${this.personUrl}/${oid}`
    return this.http.delete(url,httpOptions)
    .pipe(
    	catchError(this.handleError('deletePerson'))
    )
}
```
  当PersonsComponent订阅了该服务方法返回的Observable时，就会发起一次实际的DELETE操作：
```typescript
this.personService.deletePerson(person.id).subscribe()//必须调用一些subscribe，不然什么也不会发生
```
  该组件不关心删除操作返回的结果，订阅时也没有回调函数，单纯的.subscribe()方法看似毫无意义，但实际上，它是必备的，否则调用的PersonService.deletePerson()时并不会发起DELETE请求
#### 6.4 订阅
  在调用方法返回的可观察对象的subscribe()方法之前，HttpClient方法不会发起HTTP请求，这适用于HttpClient的所有方法，HttpClient的所有方法返回的可观察对象都设计为冷的，HHTTP请求的执行都是延期执行的，让我可以用tap和catchError这样的操作符在实际执行什么之前，先对这个可观察对象进行扩展。
  调用subscribe(...)会触发这个可观察对象的执行，并导致HttpClient组合并把HTTP请求发给服务器，可以把这些可观察对象看做实际HTTP请求的蓝图：
```typescript
//实际上，每个subscribe()都会初始化此可观察对象的一次单独的、独立的执行，订阅两次就会导致发起两个HTTP请求
const req = http.get<Persons>('/api/persons');// 发出0个请求 - .subscribe（）未被调用。
req.subscribe();// 1个请求订阅
req.subscribe();// 2个请求订阅
```
#### 6.5 发起PUT请求
  应用可以发送PUT请求，来使用修改后的数据完全替换掉一个资源，下面的PersonService例子和POST的例子很像：
```typescript
//更新服务器上的人物，更新成功就返回新的人物
updatePerson(person:Person):Observable<Person>{
    return this.http.put<Person>(this.personsUrl,,person,httpOptions)
    .pipe(catchError(this.handleError('updatePerson',person)))
}
```






















