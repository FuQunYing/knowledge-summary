#Day11
## 六、动态组件
### 1.动态组件加载
  组件的模板不会永远是固定的。应用可能会需要在运行期间加载一些新的组件。
  假如说，在例子里面，我要搞一个广告活动，需要在广告条里面现在是一系列不同的广告，几个不同的小组可能会频繁加入新的广告组件，再用只支持静态组件结构的模板显然不好实现。那么就需要一种新的组件加载方式，它不需要在广告条组件的模板中引用固定的组件。
  Angular 自带的API就能支持动态加载组件。
### 2.指令
  在添加组件之前，先要定义一个锚点来告诉Angular要把组件插入到什么地方。广告条使用一个名叫AdDirective的辅助指令来在模板中标记出有效的插入点。
```typescript
import { Directive, ViewContainerRef } from '@angular/core';
@Directive({
  selector: '[ad-host]',
})
export class AdDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
```
  AdDirective注入了ViewContainerRef来获取对容器视图的访问权，这个容器就是那些动态加入的组件的宿主。在@Directive装饰器中，要注意选择器的名称：ad-host，它就是将要应用到元素上的指令。
### 3.加载组件
  广告条的大部分实现代码都在ad-banner.component.ts中。 例子比较简单，就把HTML直接放在了@Component装饰器的template属性中。<ng-template>元素就是刚才制作的指令将应用到的地方。 要应用AdDirective，来自ad.directive.ts的选择器ad-host。把它应用到<ng-template>（不用带方括号）。 然后，Angular就知道该把组件动态加载到哪里了。
```typescript
template: `
            <div class="ad-banner">
              <h3>广告广告</h3>
              <ng-template ad-host></ng-template>
            </div>
          `
```
  <ng-template>元素是动态加载组件的最佳选择，因为它不会渲染任何额外的输出。
### 4.解析组件
  来看看ad-banner.component.ts中的方法。
  AdBannerComponent接收一个AdItem对象的数组作为输入，它最终来自AdService。 AdItem对象指定要加载的组件类，以及绑定到该组件上的任意数据。 AdService可以返回广告活动中的那些广告。给AdBannerComponent传入一个组件数组可以让我们在模板中放入一个广告的动态列表，而不用写死在模板中。通过getAds()方法，AdBannerComponent可以循环遍历AdItems的数组，并且每三秒调用一次loadComponent()来加载新组件。
```typescript
export class AdBannerComponent implements AfterViewInit, OnDestroy {
  @Input() ads: AdItem[];
  currentAddIndex: number = -1;
  @ViewChild(AdDirective) adHost: AdDirective;
  subscription: any;
  interval: any;
  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }
  ngAfterViewInit() {
    this.loadComponent();
    this.getAds();
  }
  ngOnDestroy() {
    clearInterval(this.interval);
  }
  loadComponent() {
    this.currentAddIndex = (this.currentAddIndex + 1) % this.ads.length;
    let adItem = this.ads[this.currentAddIndex];
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(adItem.component);
    let viewContainerRef = this.adHost.viewContainerRef;
    viewContainerRef.clear();
    let componentRef = viewContainerRef.createComponent(componentFactory);
    (<AdComponent>componentRef.instance).data = adItem.data;
  }
  getAds() {
    this.interval = setInterval(() => {
      this.loadComponent();
    }, 3000);
  }
}
```
  这里的loadComponent()方法很重要。 我们来一步步看看。首先，它选取了一个广告。
  ```txt
  loadComponent()如何选择广告
  loadComponent()方法使用某种算法选择了一个广告。
（译注：循环选取算法）首先，它把currentAddIndex递增一，然后用它除以AdItem数组长度的余数作为新的currentAddIndex的值， 最后用这个值来从数组中选取一个adItem。
  ```
  在loadComponent()选取了一个广告之后，它使用ComponentFactoryResolver来为每个具体的组件解析出一个ComponentFactory。 然后ComponentFactory会为每一个组件创建一个实例。接下来，我们要把viewContainerRef指向这个组件的现有实例。但我们怎么才能找到这个实例呢？ 很简单，因为它指向了adHost，而这个adHost就是我们以前设置过的指令，用来告诉Angular该把动态组件插入到什么位置。回忆一下，AdDirective曾在它的构造函数中注入了一个ViewContainerRef。 因此这个指令可以访问到这个被我们用作动态组件宿主的元素。要把这个组件添加到模板中，我们可以调用ViewContainerRef的createComponent()。
  createComponent()方法返回一个引用，指向这个刚刚加载的组件。 使用这个引用就可以与该组件进行交互，比如设置它的属性或调用它的方法。
  **对选择器的引用**
  通常，Angular编译器会为模板中所引用的每个组件都生成一个ComponentFactory类。 但是，对于动态加载的组件，模板中不会出现对它们的选择器的引用。
  要想确保编译器照常生成工厂类，就要把这些动态加载的组件添加到NgModule的entryComponents数组中：
```typescript
entryComponents: [ HeroJobAdComponent, HeroProfileComponent ],
```
### 5.公共的AdComponent接口
  在广告条中，所有组件都实现了一个公共接口AdComponent，它定义了一个标准化的API，让我们把数据传给组件。
  最终的代码像这样：
  **job-ad.component.ts**
```typescript
import { Component, Input } from '@angular/core';
import { AdComponent }      from './ad.component';
@Component({
  template: `
    <div class="job-ad">
      <h4>{{data.headline}}</h4> 
      {{data.body}}
    </div>
  `
})
export class HeroJobAdComponent implements AdComponent {
  @Input() data: any;

}
```
  **profile.component.ts**
```typescript
import { Component, Input }  from '@angular/core';
import { AdComponent }       from './ad.component';
@Component({
  template: `
    <div>
      <h3>Featured Hero Profile</h3>
      <h4>{{data.name}}</h4>
      <p>{{data.bio}}</p>
      <strong>Hire this hero today!</strong>
    </div>
  `
})
export class HeroProfileComponent implements AdComponent {
  @Input() data: any;
}
```
  **ad.component.ts**
```typescript
export interface AdComponent {
  data: any;
}
```