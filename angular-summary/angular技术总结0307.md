#Day17
## 十、动画
### 1.概述
  Angular的动画系统赋予了制作各种动画效果的能力，以构建出与原生css动画性能相同的动画。那我就有了额外的让动画逻辑与其它应用代码紧紧集成在一起的能力，这让动画可以被更容易的触发与控制。
### 2.起步
  在添加动画到应用程序之前，需要引入一些模块：
```typescript
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [ BrowserModule, BrowserAnimationsModule ],
  // ... more stuff ...
})
export class AppModule { }
```
  在这个例子里面，用动画激活人物列表，一个Person类，有name属性，状态属性，根据状态来切换激活状态：
```typescript
export class Person {
  constructor(public name: string, public state = 'inactive') { }
  toggleState() {
    this.state = this.state === 'active' ? 'inactive' : 'active';
  }
}
//点击按钮的时候就会切换这两个状态了。
```
### 3.在两个状态之间转换
  比如先来构建一个简单的动画，它会让一个元素用模型驱动的方式在两个状态之间转场。
  动画会被定义在@Component元数据中。
```typescript
import {Component, Input} from '@angular/core';
import { trigger,state,style,animate,transition} from '@angular/animations';
```
  通过这些，可以在组件元数据中定义一个名叫personState的动画触发器。它在两个状态active和inactive之间进行转场。 当人物处于激活状态时，它会把该元素显示得稍微大一点、亮一点。
```typescript
animations: [
  trigger('personState', [
    state('inactive', style({
      backgroundColor: '#eee',
      transform: 'scale(1)'
    })),
    state('active',   style({
      backgroundColor: '#cfd8dc',
      transform: 'scale(1.1)'
    })),
    transition('inactive => active', animate('100ms ease-in')),
    transition('active => inactive', animate('100ms ease-out'))
  ])
]
```
  自定义动画了，接下来就要使用啦：
```html
template: `
  <ul>
    <li *ngFor="let person of lists"
        [@heroState]="person.state"
        (click)="person.toggleState()">
      {{hero.name}}
    </li>
  </ul>
`
```
  这里，我把该动画触发器添加到了由ngFor重复出来的每一个元素上。每个重复出来的元素都有独立的动画效果。 然后把@triggerName属性(Attribute)的值设置成表达式hero.state。这个值应该或者是inactive或者是active，因为我们刚刚为它们俩定义过动画状态。通过这些设置，一旦英雄对象的状态发生了变化，就会触发一个转场动画。
### 4.状态与转场
  Angular动画是由状态和状态之间的转场效果所定义的。
  动画状态是一个由程序代码中定义的字符串值。在上面的例子中，基于人物对象的逻辑状态,我使用'active'和'inactive'这两种状态。 状态的来源可以是像本例中这样简单的对象属性，也可以是由方法计算出来的值。重点是，得能从组件模板中读取它。
  像这样为每个动画状态定义一个样式：
```typescript
state('inactive', style({
  backgroundColor: '#eee',
  transform: 'scale(1)'
})),
state('active',   style({
  backgroundColor: '#cfd8dc',
  transform: 'scale(1.1)'
})),
```
  这些state具体定义了每个状态的最终样式。一旦元素转场到那个状态，该样式就会被应用到此元素上，当它留在此状态时，这些样式也会一直保持着。 从这个意义上讲，这里其实并不只是在定义动画，而是在定义该元素在不同状态时应该具有的样式。
  定义完状态，就能定义在状态之间的各种转场了。每个转场都会控制一条在一组样式和下一组样式之间切换的时间线：
```typescript
transition('inactive => active', animate('100ms ease-in')),
transition('active => inactive', animate('100ms ease-out'))
```
  如果多个转场都有同样的时间线配置，就可以把它们合并进同一个transition定义中：
```typescript
transition('inactive => active, active => inactive',
 animate('100ms ease-out'))
```
  如果要对同一个转场的两个方向都使用相同的时间线，就可以使用<=>这种简写语法：
```typescript
transition('inactive <=> active', animate('100ms ease-out'))
```
  有时希望一些样式只在动画期间生效，但在结束后并不保留它们。这时可以把这些样式内联在transition中进行定义。 在下面的代码里，该元素会立刻获得一组样式，然后动态转场到下一个状态。当转场结束时，这些样式并不会被保留，因为它们并没有被定义在state中。
```typescript
transition('inactive => active', [
  style({
    backgroundColor: '#cfd8dc',
    transform: 'scale(1.3)'
  }),
  animate('80ms ease-in', style({
    backgroundColor: '#eee',
    transform: 'scale(1)'
  }))
]),
```
#### 4.2 通配符状态
  *(通配符)状态匹配任何动画状态。当定义那些不需要管当前处于什么状态的样式及转场时，这很有用，比如：
  - 当该元素的状态从active变成任何其它状态时，active => *转场都会生效。
  - 当在任意两个状态之间切换时，* => *转场都会生效。
#### 4.3 void状态
  有一种叫做void的特殊状态，它可以应用在任何动画中。它表示元素没有被附加到视图。这种情况可能是由于它尚未被添加进来或者已经被移除了。 void状态在定义“进场”和“离场”的动画时会非常有用。
   一个元素离开视图时，* => void转场就会生效，而不管它在离场以前是什么状态。
   ps：*（通配符）也能匹配void
### 5.例子：进场与离场
  使用void和*状态，可以定义元素进场与离场时的转场动画：
  - 进场：void => *
  - 离场：* => void
    比如，在下面的animations数组中，这两个转场语句使用void => *和* => void语法来让该元素以动画形式进入和离开当前视图。
```typescript
animations: [
  trigger('flyInOut', [
    state('in', style({transform: 'translateX(0)'})),
    transition('void => *', [
      style({transform: 'translateX(-100%)'}),
      animate(100)
    ]),
    transition('* => void', [
      animate(100, style({transform: 'translateX(100%)'}))
    ])
  ])
]
//ps:注意，在这个例子中，这些样式在转场定义中被直接应用到了void状态，但并没有一个单独的state(void)定义。 这么做是因为希望在进场与离场时使用不一样的转换效果：元素从左侧进场，从右侧离开。
```
```txt
这两个常见的动画，有自己的别名：
    transition(':enter', [ ... ]); // void => *
    transition(':leave', [ ... ]); // * => void
```
### 6.从不同的状态下进场和离场
  通过把人物动画的状态，还能把该动画跟以前的转场动画组合成一个复合动画。这让我们能根据该人物的当前状态为其配置不同的进场与离场动画：
  - 非激活人物进场：void => inactive
  - 人物英雄进场：void => active
  - 非激活人物离场：inactive => void
  - 激活人物离场：active => void
  现在就对每一种转场都有了细粒度的控制：
```typescript
animations: [
  trigger('personState', [
    state('inactive', style({transform: 'translateX(0) scale(1)'})),
    state('active',   style({transform: 'translateX(0) scale(1.1)'})),
    transition('inactive => active', animate('100ms ease-in')),
    transition('active => inactive', animate('100ms ease-out')),
    transition('void => inactive', [
      style({transform: 'translateX(-100%) scale(1)'}),
      animate(100)
    ]),
    transition('inactive => void', [
      animate(100, style({transform: 'translateX(100%) scale(1)'}))
    ]),
    transition('void => active', [
      style({transform: 'translateX(0) scale(0)'}),
      animate(200)
    ]),
    transition('active => void', [
      animate(200, style({transform: 'translateX(0) scale(0)'}))
    ])
  ])
]
```
### 7.可动的（Animatable）属性与单位
  由于Angular的动画支持是基于Web Animations标准的，所以也能支持浏览器认为可以参与动画的任何属性。这些属性包括位置(position)、大小(size)、变换(transform)、颜色(color)、边框(border)等很多属性
  尺寸类属性(如位置、大小、边框等)包括一个数字值和一个用来定义长度单位的后缀：‘50px‘，’3rem‘，’100%'
  对大多数尺寸类属性而言，还能只定义一个数字，那就表示它使用的是像素(px)数：50相当于‘50px’
### 8.自动属性值计算
  有时候，要想在动画中使用的尺寸类样式，它的值在开始运行之前都是不可知的。比如，元素的宽度和高度往往依赖于它们的内容和屏幕的尺寸。处理这些属性对CSS动画而言通常是相当棘手的。
  如果用Angular动画，就可以用一个特殊的*属性值来处理这种情况。该属性的值将会在运行期被计算出来，然后插入到这个动画中。
  像下面中的“离场”动画会取得该元素在离场前的高度，并且把它从这个高度用动画转场到0高度：
```typescript
animations: [
  trigger('shrinkOut', [
    state('in', style({height: '*'})),
    transition('* => void', [
      style({height: '*'}),
      animate(250, style({height: 0}))
    ])
  ])
]
```
### 9.动画时间线
  对每一个动画转场效果，有三种时间线属性可以调整：持续时间(duration)、延迟(delay)和缓动(easing)函数。它们被合并到了一个单独的转场时间线字符串。
#### 9.1 持续时间
  持续时间控制动画从开始到结束要花多长时间。可以用三种方式定义持续时间：
  - 作为一个普通的数字，以毫秒为单位，比如100就100ms
  - 作为一个字符串，以毫秒为单位，比如‘100ms’
  - 作为一个字符串，以秒为单位，比如‘0.1s'
#### 9.2 延迟
  延迟控制的是在动画已经触发但尚未真正开始转场之前要等待多久。可以把它添加到字符串中的持续时间后面，它的选项格式也跟持续时间是一样的：
  - 等待100毫秒，然后运行200毫秒：'0.2s 100ms'。
#### 9.3 缓动函数
  缓动函数用于控制动画在运行期间如何加速和减速。比如：使用ease-in函数意味着动画开始时相对缓慢，然后在进行中逐步加速。可以通过在这个字符串中的持续时间和延迟后面添加第三个值来控制使用哪个缓动函数(如果没有定义延迟就作为第二个值)。
  - 等待100毫秒，然后运行200毫秒，并且带缓动：'0.2s 100ms ease-out'
  - 运行200毫秒，并且带缓动：'0.2s ease-in-out'
#### 9.4 例子
  现在有两个自定义时间线的动态演示，进场和离场都持续200ms，但是它们有不同的缓动函数，离场动画会在100ms的延迟之后开始，也就是“0.2s 10 ease-out”
```typescript
animations: [
  trigger('flyInOut', [
    state('in', style({opacity: 1, transform: 'translateX(0)'})),
    transition('void => *', [
      style({
        opacity: 0,
        transform: 'translateX(-100%)'
      }),
      animate('0.2s ease-in')
    ]),
    transition('* => void', [
      animate('0.2s 0.1s ease-out', style({
        opacity: 0,
        transform: 'translateX(100%)'
      }))
    ])
  ])
]
```
### 10.基于关键帧的多阶段动画
  通过定义动画的关键帧，可以把两组样式之间的简单转场，升级成一种更复杂的动画，它会在转场期间经历一个或多个中间样式。每个关键帧都可以被指定一个偏移量，用来定义该关键帧将被用在动画期间的哪个时间点。偏移量是一个介于0(表示动画起点)和1(表示动画终点)之间的数组。
  在下面的代码中，我用关键帧来为进场和离场动画添加一些“反弹效果”：
```typescript
animations:[
    trigger('flyOut',[
        state('in',style({transform:'translateX(0)'})),
        transition('void => *',[
            animate(300,keyframes([
                style({opacity: 0, transform: 'translateX(-100%)', offset: 0}),
        style({opacity: 1, transform: 'translateX(15px)',  offset: 0.3}),
        style({opacity: 1, transform: 'translateX(0)',     offset: 1.0})
            ]))
        ]),
        transition('* => void', [
            animate(300, keyframes([
                style({opacity: 1, transform: 'translateX(0)',     offset: 0}),
                style({opacity: 1, transform: 'translateX(-15px)', offset: 0.7}),
                style({opacity: 0, transform: 'translateX(100%)',  offset: 1.0})
            ]))
    	])
    ])
]
```
  注意，这个偏移量并不是用绝对数字定义的时间段，而是在0到1之间的相对值（百分比）。动画的最终时间线会基于关键帧的偏移量、持续时间、延迟和缓动函数计算出来。为关键帧定义偏移量是可选的。如果省略它们，偏移量会自动根据帧数平均分布出来。例如，三个未定义过偏移量的关键帧会分别获得偏移量：0、0.5和1。
### 11.并行动画组
  只要放进同一个style（）中定义，就可以在同一个时段进行多个样式的动画，但是有时候想给同时发生的几个动画配置不同的时间线，比如，同时对两个CSS属性做动画，但又得为它们定义不同的缓动函数。
  这种情况下就可以用动画组来解决了。在下面的代码中，同时在进场和离场时使用了组，以便能让它们使用两种不同的时间线配置。 它们被同时应用到同一个元素上，但又彼此独立运行：
```typescript
animations:[
    trigger('flyOut',[
      state('in',style({width:120,transform:'translateX(0)',opacity:1})),
      transition('void => *',[
          style({width:10,transform:'translateX(50px)',opacity:0}),
          group([
              animate('0.3s 0.1s ease', style({
                  transform: 'translateX(0)',
                  width: 120
            })),
              animate('0.3s ease', style({
              	opacity: 1
            }))
          ])
      ])
    ]),
    transition('* => void', [
      group([
        animate('0.3s ease', style({
          transform: 'translateX(50px)',
          width: 10
        })),
        animate('0.3s 0.2s ease', style({
          opacity: 0
        }))
      ])
    ])
  ])
]
```
  其中一个动画组对元素的transform和width做动画，另一组对opacity做动画。
### 12.动画回调
  当动画开始和结束时，会触发一个回调。
  对于例子中的关键帧，有一个叫做@flyOut的trigger，在那里可以挂钩到那些回调，就像这样：
```html
template: `
  <ul>
    <li *ngFor="let person of lists"
        (@flyInOut.start)="animationStarted($event)"
        (@flyInOut.done)="animationDone($event)"
        [@flyInOut]="'in'">
      {{person.name}}
    </li>
  </ul>
`
```
  这些回调接收一个AnimationTranslationEvent参数，包括一些属性比如：fromState，toState，totalTime。不管动画是否执行，回调函数总会被触发。






















