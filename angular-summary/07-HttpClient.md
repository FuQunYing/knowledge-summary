# HttpClient
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
### 7.高级用法
#### 7.1 配置请求
  待发送请求的其它方面可以通过传给HttpClient方法最后一个参数中的配置对象进行配置，之前在PersonService中通过在其保存方法中传入配置对象httpOptions设置过默认头，但是还可以做更多。
  **修改这些头**
  我没法直接修改前述配置对象中的现有头，因为这个HttpHeaders类的实例是不可变的。改用set方法代替，它会返回当前实例的一份克隆，其中应用了这些新的修改，比如在发起下一个请求之前，如果旧的令牌已经过期了，可能还要修改认证头：
```typescript
httpOptions.headers=httpOptions.headers.set('Authorization','my-new-auth-token')
```
  **URL参数**
  添加URL搜索参数也与此类似，这里的searchPersons方法会查询名字中包含搜索词的人物列表：
```typescript
//获取名称中包含搜索词的人物
searchPersons(term:string):Observable<Person[]>{
    term=term.trim();
    //如果有搜索项，添加安全的，URL编码的搜索参数
    const options=term?{params:new HttpParams().set('name',term)}:{};
    return this.http.get<Person[]>(this.personsUrl,options)
    .pippe(catchError(this.handleError<Person[]>('searchPersons',[])))
}
```
  如果有搜索词，这段代码就会构造一个包含进行过URL编码的搜索词的选项对象，如果这个搜索词是“foo”，这个GET请求的URL就是api/persons/?name=foo，HttpParams是不可变的，所以也要使用set方法来修改这些选项。
#### 7.2 请求的防抖（debounce）
  这个例子还包含了搜索npm包的特性，当用户在搜索框中输入名字时，PackageSearchComponent就会把一个根据名字搜索包的请求发送给NPM的web api。
  模板中的相关代码片段：
```html
<input (keyup)="search($event.target.value)" id="name" placeholder="Search"/>
<ul>
  <li *ngFor="let package of packages$ | async">
    <b>{{package.name}} v.{{package.version}}</b> -
    <i>{{package.description}}</i>
  </li>
</ul>
```
  keyup事件绑定把每次击键都发送给了组件的search方法，如果每次击键都发送了一次请求就太昂贵了，最好能等到用户停止输入时才发送请求，可以使用RxJS的操作符：
```typescript
withRefresh = false;
packages$: Observable<NpmPackageInfo[]>;
private searchText$ = new Subject<string>();
search(packageName: string) {
  this.searchText$.next(packageName);
}
ngOnInit() {
  this.packages$ = this.searchText$.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    switchMap(packageName =>
      this.searchService.search(packageName, this.withRefresh))
  );
}
constructor(private searchService: PackageSearchService) { }
```
  searchText$是一个序列，包含用户输入到搜索框中的所有值，它定义成了RxJS的Subject对象，这表示它是一个Observable，同时还可以自行调用next(value)来产生值，search方法中就是这么做的。。除了把每个searchText的值都直接转发给PackageSearchService之外，ngOnInit中的代码还通过下列三个操作符对这些 搜索值进行管道处理：
  - debounceTime(500) - 等待，直到用户停止输入（这个例子中是停止 1/2 秒）
  - distinctUntilChanged() - 等待，直到搜索内容发生了变化
  - switchMap() - 把搜索请求发送给服务
    这些代码把package$设置成了使用搜索结果组合出的Observable对象，模板中使用AsyncPipe订阅了package$，一旦搜索结果的值发回来了，就显示这些搜索结果，这样，只有当用户停止了输入且搜索值和以前不一样的时候，搜索值才会传给服务。
    **switchMap()**
    这个switchMap操作符有三个重要的特征：
  - 它的参数是一个返回Observable的函数，PackageSearchService.search 会返回 Observable，其它数据服务也一样
  - 如果以前的搜索结果仍然是在途状态（这会出现在慢速网络中），它会取消那个请求，并发起这个新的搜索
  - 它会按照原始的请求顺序返回这些服务的响应，而不用关心服务器实际上是以乱序返回的它们
#### 7.3 拦截请求和响应
  HTTP拦截机制是@angular/common/http中的主要特性之一，使用这种拦截机制，可以声明一些拦截器，用它们监视和转换从应用发送到服务器的HTTP请求，拦截器还可以用监视和转换从服务器返回 到本应用的那些响应，多个选择器会构成一个“请求/响应处理器”的双向链表。拦截器可以用一种常规的、标准的方式对每一次HTTP请求/响应任务执行从认证到记日志等很多种隐式任务。如果没有拦截机制，那么开发人员将不得不对每次HttpClient调试显式实现这些任务。
##### 7.3.1 编写拦截器
  要实现拦截器，就要实现一个实现了HttpInterceptor接口中的intercept()方法的类。
  这是一个什么也不做的拦截器，它只会不做修改的传递这个请求：
```typescript
import {Injectable} from '@angular/core'
import {HttpEvent,HttpInterceptor,HttpHandler,HttpRequest} from '@angualr/common/http';
import {Observable} from 'rxjs';
//将未触及的请求传递给下一个请求处理程序
@Injectable()
export class NoopInterceptor implements HttpInterceptor{ intercept(req:HttpRequest<any>,next:HttpHandler):Observable<HttpEvent<any>>{
        return next.handle(req)
    }
}
```
  intercept方法会把请求转换成一个最终返回HTTP响应体的Observable，在这个场景中，每个拦截器都完全能自己处理这个请求。大多数拦截器拦截都会在传入时检查请求，然后把（可能被修改过的）请求转发给next对象的handle()方法，而next对象实现了HttpHandler接口。
```typescript
export abstract class HttpHandler{
    abstract handle(req:HttpRequest<any>):Observable<HttpEvent<any>>;
}
```
  像intercept()一样，handle()方法会把HTTP请求转换成HttpEvents组成的Observable，它最终包含的是来自服务器的响应，intercept()函数可以检查这个可观察对象，并在把它返回给调用者之前修改它。这个无操作的拦截，会直接使用原始的请求调用nnext.handle()，并返回它返回的可观察对象，而不做任何后续处理。
##### 7.3.2 next对象
  next对象表示拦截器链表中的下一个拦截器，这个链表中的最后一个next对象就是HttpClient的后端处理器，它会把请求发给服务器，并接收服务器的响应。大多数的拦截器都会调用next.handle()，以便这个请求流能走到下一个拦截器，并最终传给后端处理器，拦截器也可以不调用next.handle()，使这个链路短路，并返回一个带有人工构造出来的服务器响应自己的Observable，这是一种常见的中间件模式，在像express.js这样的框架中也会找到它。
##### 7.3.3 提供这个拦截器
  这个NoopInterceptor就是一个由Angular依赖注入系统管理的服务，像其它服务一样，也必须先提供这个拦截器类，应用才能使用它。由于拦截器是HttpClient服务的可选依赖，所以必须在提供HttpClient的同一个（或其各级父注入器）注入器中提供这些拦截器，那些在依赖注入创建完HttpClient之后再提供的拦截器将会被忽略。
  由于在AppModule中导入了HttpClientModule，导致本应用在其根注入器中提供了HttpClient，所以我也同样要在AppModule中提供这些拦截器。在从@angular/common/http导入了HTTP_INTERCEPTORS注入令牌之后，编写下面的注册商提供语句：
```typescript
{ provide: HTTP_INTERCEPTORS, useClass: NoopInterceptor, multi: true }
```
  注意multi:true选项，这个必须的选项会告诉Angular HTTP_INTERCEPTORS是一个多重提供商的令牌，表示它会注入一个多值的数组，而不是单一的值。也可以直接把这个提供商添加到AppModule中的提供商数组只能怪，不过那样会非常啰嗦，况且将来还会用这种方式创建更多大的拦截器并提供它们，此外还要注意提供这些拦截器的顺序。
  认真考虑创建一个封装桶文件，用于把所有的拦截器都收集起来，一起提供给httpInterceptorProviders 数组，可以先从这个 NoopInterceptor 开始：
```typescript
///http拦截器的  桶
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NoopInterceptor } from './noop-interceptor';
//外部的Http拦截器提供程序
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: NoopInterceptor, multi: true },
];
```
  然后导入它，并把它加到AppModule的providers数组中，就像这样：
```typescript
providers:[httpInterceptorProviders]
```
##### 7.3.4 拦截器的顺序
  Angular会按照我提供它们的顺序应用这些拦截器，如果是提供拦截器的顺序是先A、再B、再C，那么请求阶段的执行顺序就是A->B->C，而响应阶段的执行顺序就反过来了，以后我就再也不能修改这些顺序或者移除某些拦截器了，如果需要动态启动或禁用某个拦截器，那就要在那个拦截器中自行实现这个功能。
##### 7.3.5 HttpEvents
  我想intercept() 和 handle() 方法会像大多数 HttpClient 中的方法那样返回 HttpResponse<any> 的可观察对象，然而并没有，它们返回的是 HttpEvent<any> 的可观察对象。这是因为拦截器工作的层级比那些 HttpClient 方法更低一些。每个 HTTP 请求都可能会生成很多个事件，包括上传和下载的进度事件。 实际上，HttpResponse 类本身就是一个事件，它的类型（type）是 HttpEventType.HttpResponseEvent。很多拦截器只关心发出的请求，而对 next.handle() 返回的事件流不会做任何修改。但那些要检查和修改来自 next.handle() 的响应体的拦截器希望看到所有这些事件。所以，我的拦截器应该返回我没有碰过的所有事件。
##### 7.3.6 不可变性
  虽然拦截器有能力改变请求和响应，但 HttpRequest 和 HttpResponse 实例的属性却是只读（readonly）的， 因此，它们在很大意义上说是不可变对象。有充足的理由把它们做成不可变对象：应用可能会重试发送很多次请求之后才能成功，这就意味着这个拦截器链表可能会多次重复处理同一个请求。 如果拦截器可以修改原始的请求对象，那么重试阶段的操作就会从修改过的请求开始，而不是原始请求。 而这种不可变性，可以确保这些拦截器在每次重试时看到的都是同样的原始请求。
  通过把 HttpRequest 的属性设置为只读的，TypeScript 可以防止这种错误。
```typescript
// Typescript不允许进行以下分配，因为req.url是只读的
req.url = req.url.replace('http://', 'https://');
```
  要想修改该请求，就要先克隆它，并修改这个克隆体，然后再把这个克隆体传给 next.handle()。 可以用一步操作中完成对请求的克隆和修改，例子如下：
```typescript
// 克隆请求并同时用'https：//'替换'http：//'
const secureReq = req.clone({
  url: req.url.replace('http://', 'https://')
});
// 将克隆的“安全”请求发送到下一个处理程序。
return next.handle(secureReq);
```
  这个 clone() 方法的哈希型参数允许你在复制出克隆体的同时改变该请求的某些特定属性。
##### 7.3.7 请求体
  readonly 这种赋值保护，无法防范深修改（修改子对象的属性），也不能防范我修改请求体对象中的属性。
```typescript
req.body.name = req.body.name.trim(); // 不好不好
```
  如果必须修改请求体，那么就要先复制它，然后修改这个复本，clone() 这个请求，然后把这个请求体的复本作为新的请求体，例子如下：
```typescript
//复制正文并从name属性修剪空白
const newBody = { ...body, name: body.name.trim() };
//克隆请求并设置其正文
const newReq = req.clone({ body: newBody });
//发送克隆请求到下一个处理程序
return next.handle(newReq);
```
##### 7.3.8 清空请求体
  有时需要清空请求体，而不是替换它。 如果把克隆后的请求体设置成 undefined，Angular 会认为是想让这个请求体保持原样。 这显然不是想要的。 但如果把克隆后的请求体设置成 null，那 Angular 就知道是想清空这个请求体了。
```typescript
newReq = req.clone({ ... }); //请求体没有被提到 => 保存原有的请求体
newReq = req.clone({ body: undefined }); // 保存原有的请求体
newReq = req.clone({ body: null }); //清空请求体
```
##### 7.3.9 设置默认请求头
  应用通常会使用拦截器来设置外发请求的默认请求头。该范例应用具有一个 AuthService，它会生成一个认证令牌。 在这里，AuthInterceptor 会注入该服务以获取令牌，并对每一个外发的请求添加一个带有该令牌的认证头：
```typescript
import { AuthService } from '../auth.service';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // 从服务中拿到auth token
    const authToken = this.auth.getAuthorizationToken();
    // 克隆请求并用克隆的头文件替换原始头文件，并使用授权进行更新。
    const authReq = req.clone({
      headers: req.headers.set('Authorization', authToken)
    });
    // 带着请求头发送请求到下一个程序
    return next.handle(authReq);
  }
}
```
  这种在克隆请求的同时设置新请求头的操作太常见了，因此它还有一个快捷方式 setHeaders：
```typescript
//克隆请求并一步设置新的头文件
const authReq = req.clone({ setHeaders: { Authorization: authToken } });
```
  这种可以修改头的拦截器可以用于很多不同的操作，比如：
  - 认证/授权
  - 控制缓存行为，比如If-Modified-Since
  - XSRF防护
##### 7.3.10 记日志
  因为拦截器可以同时处理请求和响应，所以它们也可以对整个 HTTP 操作进行计时和记录日志。考虑下面这个 LoggingInterceptor，它捕获请求的发起时间、响应的接收时间，并使用注入的 MessageService 来发送总共花费的时间。
```typescript
import { finalize, tap } from 'rxjs/operators';
import { MessageService } from '../message.service';
@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  constructor(private messenger: MessageService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const started = Date.now();
    let ok: string;
    // 通过日志记录扩展服务器响应
    return next.handle(req)
      .pipe(
        tap(
          // 有回应时成功; 忽略其他事件
          event => ok = event instanceof HttpResponse ? 'succeeded' : '',
          // 操作失败，错误是一个HttpErrorResponse
          error => ok = 'failed'
        ),
        // 记录响应观察完成或错误
        finalize(() => {
          const elapsed = Date.now() - started;
          const msg = `${req.method} "${req.urlWithParams}"
             ${ok} in ${elapsed} ms.`;
          this.messenger.add(msg);
        })
      );
  }
}
```
  RxJS 的 tap 操作符会捕获请求成功了还是失败了。 RxJS 的 finalize 操作符无论在响应成功还是失败时都会调用（这是必须的），然后把结果汇报给 MessageService。在这个可观察对象的流中，无论是 tap 还是 finalize 接触过的值，都会照常发送给调用者。
##### 7.3.11 缓存
  拦截器还可以自行处理这些请求，而不用转发给 next.handle()。比如，我可能会想缓存某些请求和响应，以便提升性能。 可以把这种缓存操作委托给某个拦截器，而不破坏现有的各个数据服务。
  CachingInterceptor 演示了这种方式。
```typescript
@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  constructor(private cache: RequestCache) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    //不能缓存就继续
    if (!isCachable(req)) { return next.handle(req); }
    const cachedResponse = this.cache.get(req);
    return cachedResponse ?
      of(cachedResponse) : sendRequest(req, next, this.cache);
  }
}
```
  isCachable() 函数用于决定该请求是否允许缓存。 在这个例子中，只有发到 npm 包搜索 API 的 GET 请求才是可以缓存的。如果该请求是不可缓存的，该拦截器只会把该请求转发给链表中的下一个处理器。如果可缓存的请求在缓存中找到了，该拦截器就会通过 of() 函数返回一个已缓存的响应体的可观察对象，然后把它传给 next 处理器（以及所有其它下游拦截器）。如果可缓存的请求在缓存中没找到，代码就会调用 sendRequest。
```typescript
//通过向`next（）`发送请求来获得服务器响应。在离开的时候会将响应添加到缓存中。
function sendRequest(
  req: HttpRequest<any>,
  next: HttpHandler,
  cache: RequestCache): Observable<HttpEvent<any>> {
  //在npm搜索请求中不允许请求头
  const noHeaderReq = req.clone({ headers: new HttpHeaders() });
  return next.handle(noHeaderReq).pipe(
    tap(event => {
      //在响应之外或许有其他事件
      if (event instanceof HttpResponse) {
        cache.put(req, event); // 更细缓存
      }
    })
  );
}
```
  sendRequest 函数创建了一个不带请求头的请求克隆体，因为 npm API 不会接受它们。它会把这个请求转发给 next.handle()，它最终会调用服务器，并且返回服务器的响应。注意 sendRequest 是如何在发回给应用之前拦截这个响应的。 它会通过 tap() 操作符对响应进行管道处理，并在其回调中把响应加到缓存中。然后，原始的响应会通过这些拦截器链，原封不动的回到服务器的调用者那里。数据服务，比如 PackageSearchService，并不知道它们收到的某些 HttpClient 请求实际上是从缓存的请求中返回来的。
##### 7.3.12 返回多值可观察对象
  HttpClient.get() 方法正常情况下只会返回一个可观察对象，它或者发出数据，或者发出错误。 有些人说它是“一次性完成”的可观察对象。但是拦截器也可以把这个修改成发出多个值的可观察对象。修改后的 CachingInterceptor 版本可以返回一个立即发出缓存的响应，然后仍然把请求发送到 npm 的 Web API，然后再把修改过的搜索结果重新发出一次。
```typescript
//缓存然后刷新
if (req.headers.get('x-refresh')) {
  const results$ = sendRequest(req, next, this.cache);
  return cachedResponse ?
    results$.pipe( startWith(cachedResponse) ) :
    results$;
}
// 缓存或者抓取
return cachedResponse ?
  of(cachedResponse) : sendRequest(req, next, this.cache);
```
  这种缓存并刷新的选项是由自定义的 x-refresh 头触发的。
  PackageSearchComponent 中的一个检查框会切换 withRefresh 标识， 它是 PackageSearchService.search() 的参数之一。 search() 方法创建了自定义的 x-refresh 头，并在调用 HttpClient.get() 前把它添加到请求里。
  修改后的 CachingInterceptor 会发起一个服务器请求，而不管有没有缓存的值。 就像 前面 的 sendRequest() 方法一样进行订阅。 在订阅 results$ 可观察对象时，就会发起这个请求。如果没有缓存的值，拦截器直接返回 result$。如果有缓存的值，这些代码就会把缓存的响应加入到 result$ 的管道中，使用重组后的可观察对象进行处理，并发出两次。 先立即发出一次缓存的响应体，然后发出来自服务器的响应。 订阅者将会看到一个包含这两个响应的序列。
#### 7.4 监听事件进度
  有时，应用会传输大量数据，并且这些传输可能会花费很长时间。 典型的例子是文件上传。 可以通过在传输过程中提供进度反馈，来提升用户体验。要想开启进度事件的响应，可以创建一个把reportProgress选项设置为true的HttpRequest实例，以开启进度跟踪事件。
```typescript
const req = new HttpRequest('POST', '/upload/file', file, {
  reportProgress: true
});
//每个进度事件都会触发变更检测，所以，应该只有当确实希望在 UI 中报告进度时才打开这个选项。
```
  接下来，把这个请求对象传给 HttpClient.request() 方法，它返回一个 HttpEvents 的 Observable，同样也可以在拦截器中处理这些事件。
```typescript
//'HttpClient.request` API产生一个原始事件流，包括开始（发送），进度和响应事件。
return this.http.request(req).pipe(
  map(event => this.getEventMessage(event, file)),
  tap(message => this.showProgress(message)),
  last(), // 将最后（已完成）消息返回给caller
  catchError(this.handleError(file))
);
```
  getEventMessage 方法会解释事件流中的每一个 HttpEvent 类型。
```typescript
//为发送，上传进度和响应事件返回不同的消息
private getEventMessage(event: HttpEvent<any>, file: File) {
  switch (event.type) {
    case HttpEventType.Sent:
      return `Uploading file "${file.name}" of size ${file.size}.`;
    case HttpEventType.UploadProgress:
      //计算并显示完成了多少
      const percentDone = Math.round(100 * event.loaded / event.total);
      return `File "${file.name}" is ${percentDone}% uploaded.`;
    case HttpEventType.Response:
      return `File "${file.name}" was completely uploaded!`;
    default:
      return `File "${file.name}" surprising upload event: ${event.type}.`;
  }
}
//这个范例应用中并没有一个用来接收上传的文件的真实的服务器。 app/http-interceptors/upload-interceptor.ts 中的 UploadInterceptor 会拦截并短路掉上传请求，改为返回一个带有各个模拟事件的可观察对象。
```
### 8.安全：XSRF防护
  跨站请求伪造（XSRF）是一个攻击技术，它能让攻击者假冒一个已认证的用户在我的网站上执行未知的操作。HttpClient 支持一种通用的机制来防范 XSRF 攻击。当执行 HTTP 请求时，一个拦截器会从 cookie 中读取 XSRF 令牌（默认名字为 XSRF-TOKEN），并且把它设置为一个 HTTP 头 X-XSRF-TOKEN，由于只有运行在我自己的域名下的代码才能读取这个 cookie，因此后端可以确认这个 HTTP 请求真的来自我的客户端应用，而不是攻击者。
  默认情况下，拦截器会在所有的修改型请求中（比如 POST 等）把这个 cookie 发送给使用相对 URL 的请求。但不会在 GET/HEAD 请求中发送，也不会发送给使用绝对 URL 的请求。
  要获得这种优点，我的服务器需要在页面加载或首个 GET 请求中把一个名叫 XSRF-TOKEN 的令牌写入可被 JavaScript 读到的会话 cookie 中。 而在后续的请求中，服务器可以验证这个 cookie 是否与 HTTP 头 X-XSRF-TOKEN 的值一致，以确保只有运行在我自己域名下的代码才能发起这个请求。这个令牌必须对每个用户都是唯一的，并且必须能被服务器验证，因此不能由客户端自己生成令牌。把这个令牌设置为我的站点认证信息并且加了盐（salt）的摘要，以提升安全性。
  为了防止多个 Angular 应用共享同一个域名或子域时出现冲突，要给每个应用分配一个唯一的 cookie 名称
```txt
	注意，HttpClient 支持的只是 XSRF 防护方案的客户端这一半。 后端服务必须配置为给页面设置 cookie ，并且要验证请求头，以确保全都是合法的请求。否则，Angular 默认的这种防护措施就会失效。
```
#### 8.1 配置自定义cookie/header名称
  如果我的后端服务中对 XSRF 令牌的 cookie 或 头使用了不一样的名字，就要使用 HttpClientXsrfModule.withConfig() 来覆盖掉默认值。
```typescript
imports: [
  HttpClientModule,
  HttpClientXsrfModule.withOptions({
    cookieName: 'My-Xsrf-Cookie',
    headerName: 'My-Xsrf-Header',
  }),
],
```
### 9.测试HTTP请求
  如同所有的外部依赖一样，HTTP 后端也需要在良好的测试实践中被 Mock 掉。@angular/common/http 提供了一个测试库 @angular/common/http/testing，它让你可以直截了当的进行这种 Mock 。
#### 9.1 Mock方法论
  Angular 的 HTTP 测试库是专为其中的测试模式而设计的。在这种模式下，会首先在应用中执行代码并发起请求。然后，每个测试会期待发起或未发起过某个请求，对这些请求进行断言， 最终对每个所预期的请求进行刷新（flush）来对这些请求提供响应。最终，测试可能会验证这个应用不曾发起过非预期的请求。
#### 9.2 环境设置
  要开始测试那些通过 HttpClient 发起的请求，就要导入 HttpClientTestingModule 模块，并把它加到我的 TestBed 设置里去，代码如下：
```typescript
// Http测试模块和模拟控制器
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
//其它的引入
import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
```
  然后把 HTTPClientTestingModule 添加到 TestBed 中，并继续设置被测服务：
```typescript
describe('HttpClient testing', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    //为每个测试注入http服务和测试控制器
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });
  /// 测试开始///
  /*
  现在，在测试中发起的这些请求将会被这些测试后端（testing backend）处理，而不是标准的后端。这种设置还会调用 TestBed.get()，来获取注入的 HttpClient 服务和模拟对象的控制器 HttpTestingController，以便在测试期间引用它们。
  */
});
```
#### 9.4 期待并回复请求
  现在可以编写测试，等待GET请求并给出模拟响应：
```typescript
it('can test HttpClient.get', () => {
  const testData: Data = {name: 'Test Data'};
  //发起HTTP GET请求
  httpClient.get<Data>(testUrl)
    .subscribe(data =>
      //当可观察结果解决时，结果应该与测试数据匹配
      expect(data).toEqual(testData)
    );

  //下面的`expectOne（）`将匹配请求的URL。如果没有请求或多个请求匹配那个URL`expectOne（）`会抛出。
  const req = httpTestingController.expectOne('/data');
  // 断言请求是GET
  expect(req.request.method).toEqual('GET');
  // 回应模拟数据，导致Observable解决。订阅回调断言返回了正确的数据。
  req.flush(testData);
  //最后，断言没有未完成的请求。
  httpTestingController.verify();
});
```
  最后一步，验证没有发起过预期之外的请求，足够通用，因此你可以把它移到 afterEach() 中：
```typescript
afterEach(() => {
  //每次测试后，断言没有更多未决请求。
  httpTestingController.verify();
});
```
#### 9.5 自定义对请求的预期
  如果仅根据URL匹配还不够，还可以自行实现匹配函数，比如可以验证外发的请求是否带有某个认证头：
```typescript
// 期待一个认证头的请求
const req = httpTestingController.expectOne(
  req => req.headers.has('Authorization')
);
```
  和前面根据 URL 进行测试时一样，如果零或两个以上的请求匹配上了这个期待，它就会抛出异常。
#### 9.6 处理一个以上的请求
  如果需要在测试中对重复的请求进行响应，可以使用 match() API 来代替 expectOne()，它的参数不变，但会返回一个与这些请求相匹配的数组。一旦返回，这些请求就会从将来要匹配的列表中移除，那就要自己验证和刷新它。
```typescript
//获取与给定URL匹配的所有未决请求
const requests = httpTestingController.match(testUrl);
expect(requests.length).toEqual(3);
// 以不同的结果回应每个请求
requests[0].flush([]);
requests[1].flush([testData[0]]);
requests[2].flush(testData);
```
#### 9.7 测试对错误的预期
  此外还要测试应用对于HTTP请求失败时的防护，那就调用 request.error()，并给它传入一个 ErrorEvent，而不是 request.flush()。例子如下：
```typescript
it('can test for 404 error', () => {
  const emsg = 'deliberate 404 error';
  httpClient.get<Data[]>(testUrl).subscribe(
    data => fail('should have failed with the 404 error'),
    (error: HttpErrorResponse) => {
      expect(error.status).toEqual(404, 'status');
      expect(error.error).toEqual(emsg, 'message');
    }
  );
  const req = httpTestingController.expectOne(testUrl);
  // 响应模拟错误
  req.flush(emsg, { status: 404, statusText: 'Not Found' });
});
```






















