# Day38
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























  