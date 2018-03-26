#Day26
## 八、单例应用
### 1.提供单例服务
  那些在定义模块时创建的注入器将会有一些服务，这些服务对于该注入器来说都是单例的，要控制这些服务的生命周期，其实就是控制注入器的创建和销毁，比如路由定义中就可以有一个关联模块，当激活该路由时，就会给那个模块创建一个新注入器，并将其作为当前注入器的子注入器。当离开该路由时，这个新注入器也就被销毁了，这也意味着在这个模块中声明的那些服务也随之销毁了，它们的生命周期与该路由完全相同。类似的，在应用模块中提供的那些服务的生命周期也等同于该应用，因此是单例的。
  下面的例子模块习惯上叫做CoreModule。@NgModule用来创建结构良好的基础设施，让人能够在一个指定的模块中提供服务：
```typescript
import {UserService} from './user.service';
/* 自己的代码 */
@NgModule({
/* 自己的代码 */
  providers:    [UserService]
})
export class CoreModule {
/* 自己的代码 */
}
```
  这里的CoreModule提供了UserService，并且由于AppModule导入了CoreModule，所以CoreModule中提供的任何服务也能在整个应用中使用，因为它是注入器的根节点，它还是单例的，因为在该应用运行期间，该注入器的生命周期等同于AppModule的。
  Angular使用应用的根注入器注册了UserService，不过随着应用的成长，可能还会出现其它组件和服务，比如列表框模态框啥的。要想保持应用的良好结构，就要考虑使用诸如CoreModule这样的模块，这样的方式简化了根模块AppModule，让它只要指挥全局就行，不必什么事都自己做。那现在可以把这些服务注入到需要它们的各个组件里面了，从Angular模块的角度来看，只需要把这些服务定义在一个@NgModule中。作为一个通用的规则，应该只导入一次带提供商的模块，最好在应用的根模块里面。
### 2.forRoot()
  如果某个模块同时提供了服务提供商和可声明对象，那么当在某个子注入器中加载它的时候，就会生成多个该服务提供商的实例，而存在多个实例的话会导致一些问题，因为这些实例会屏蔽掉根注入器中该服务提供商的实例，而它的本意可能是作为单例对象使用的，因此Angular提供了一种方式来把服务提供商从该模块中分离出来，以便该模块既可以带着providers被根模块导入，也可以不带providers被子模块导入。先在模块上创建一个静态方法forRoot()，然后把那些服务提供商放进forRoot方法中。
  以RouterModule为例，RouterModule要提供Router服务，还要提供RouterOutlet指令。RouterModule要由根应用模块导入，以便该应用有一个路由器，而且它还需要至少一个RouterOutlet，RouterModule还必须由各个独立的路由组件导入，让它们能在自己的模板中使用RouterOutlet指令来支持其子路由。
  如果RouterModule没有forRoot()，那么每个路由组件都会创建一个新的Router实例。这将会破坏整个应用，因为应用中只能有一个Router，RouterModule拥有RouterOutlet指令，它应该随处可见，但是Router只能有一个，它应该在forRoot()中提供。最终的结果就是应用的根模块导入了RouterModule.forRoot(....)以获取Router，而所有的路由组件都导入了RouterModule，它不包括这个Router服务。
  如果现在 有一个同时提供服务提供商和可声明对象的模块，就要用下面的模式把它们分离开：
  那些需要把服务提供商加到应用中的模块可以通过某种类似forRoot()方法的方式配置那些服务提供商。forRoot()接收一个服务配置对象，然后返回一个ModuleWithProviders，它是一个带有下列属性的简单对象：
  - ngModule：在这个例子里面就是CoreModule类
  - providers：配置好的服务提供商
  在下面例子里面，根AppModule导入了CoreModule，并把它的providers添加到了AppModule的服务提供商中，特别是，Angular会在@NgModule.providers前面添加这些导入的服务提供商。这种顺序保证了AppModule中的服务提供商总是会优先于那些从其它模块中导入的服务提供商。应该只在AppModule中导入CoreModule并只使用一次forRoot()方法，因为该方法中会注册服务，而我希望那些服务在该应用中只注册一次。如果多次注册它们的话，那可能就会得到多个该服务的实例，就会导致应用出错。
  还可以在CoreModule中添加一个用于配置UserService的forRoot()方法。在下面的例子中可选择的注入UserServiceConfig扩展了Core模块的UserService。如果UserServiceConfig存在，就从这个配置中设置用户名。
```typescript
constructor (@Optional()config: UserServiceConfig){
  if(config) {this.userName = Config.userName}
}
```
  然后是接受UserServiceConfig参数的forRoot()方法：
```typescript
  static forRoot(config: UserServiceConfig): ModuleWithProciders {
    return {
      ngModule: CoreModule,
      providers: [
        {providers: UserServiceConfig.useValue: config}
      ]
    }
  }
```
  最后，在AppModule的imports列表中调用它：
```typescript
  imports {CoreModule} from './core/core.module'
  /*其它引入省略*/
  @NgModule({
    imports: [
      BrowserModule,
      ContactModule,
      CoreModule.forRoot({userName:'凉介'}),
      AppRoutingModule
    ]
  })
  export class AppModule{}
```
  该应用不再显示默认的‘许嵩’，而是用‘凉介’作为用户名称，在文件顶部使用JavaScript的imports语句导入CoreModule，但不要在多于一个@NgModule的imports列表中添加它。
### 3.防止重复导入CoreModule
  只有根模块AppModule才能导入CoreModule，如果一个惰性模块也导入了它，该应用就会为服务生成多个实例。要想防止惰性加载模块重复导入CoreModule，可以添加如下的CoreModule构造函数：
```typescript
constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
  if (parentModule) {
    throw new Error('CoreModule已经加载过了，不可重复加载')
  }
}
```
  这个构造函数要求Angular把CoreModule注入到它自己。如果Angular在当前注入器中查找CoreModule，这个注入过程就会陷入死循环。而@SkipSelf装饰器表示，在注入器树中那些高于我的父级或者更高级的注入器中查找CoreModule。
  如果构造函数在AppModule中执行，那就没有祖先注入器能提供 CoreModule 的实例，于是注入器就会放弃查找。默认情况下，当注入器找不到想找的提供商时，会抛出一个错误。 但 @Optional 装饰器表示找不到该服务也无所谓。 于是注入器会返回 null，parentModule 参数也就被赋成了空值，而构造函数没有任何异常。
  但如果把 CoreModule 导入到像 CustomerModule 这样的惰性加载模块中，事情就不一样了。Angular 会创建一个惰性加载模块，它具有自己的注入器，它是根注入器的子注入器。 @SkipSelf 让 Angular 在其父注入器中查找 CoreModule，这次，它的父注入器却是根注入器了（而上次的父注入器是空）。 当然，这次它找到了由根模块 AppModule 导入的实例。 该构造函数检测到存在 parentModule，于是抛出一个错误。
























