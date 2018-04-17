#Day10
##四、组件交互
### 1.通过输入型绑定把数据从父组件传到子组件
  PersonChildComponent有两个输入型属性，它们通常带有@Input装饰器：
```typescript
import { Component, Input } from '@angular/core';
import { Person } from './person';
@Component({
  selector: 'app-person-child',
  template: `
    <h3>{{person.name}} says:</h3>
    <p>yes, {{person.name}}, my lord, {{masterName}}.</p>
  `
})
export class PersonChildComponent {
  @Input() person: Person;
  @Input('master') masterName: string;
  // 定义输入型属性，别名可以不起
}
```
  第二个@Input为子组件的属性名masterName指定一个别名master（方便起见，别名能不起还是不要起了）
  父组件PersonParentComponent把子组件的PersonChildComponent放到ngFor循环器中，把自己的master字符串属性绑定到子组件的master别名上，并把每个循环的hero实例绑定到子组件的hero属性。
```typescript
import { Component } from '@angular/core';
import { PERSONS } from './person';
@Component({
  selector: 'app-person-parent',
  template: `
    <h2>{{master}} controls {{persons.length}} heroes</h2>
    <app-person-child *ngFor="let person of persons"
      [person]="person"
      [master]="master">
    </app-person-child>
  `
})
export class PersonParentComponent {
  persons = PERSONS;
  master = 'Master';
}
// 最后简单来说可以用props down来概括，在子组件里面引入Input并且定义输入型的属性并导出，在父组件里面用子组件的时候，把属性名字直接用作属性并把值绑定上去就行了，属性值是从上往下的，所以是props down
```
### 2.通过setter截听输入属性值的变化
  使用一个输入属性的setter，以拦截父组件中值的变化，并采取行动。
  子组件NameChildComponent的输入属性name上的这个setter，会修剪掉名字里的空格，并把空值替换成默认字符串。
```typescript
import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-name-child',
  template: '<h3>"{{name}}"</h3>'
})
export class NameChildComponent {
  private _name = '';
  @Input()
  set name(name: string) {
    this._name = (name && name.trim()) || '<no name set>';
  }
  get name(): string { return this._name; }
}
```
  下面的NameParentComponent展示了各种名字的处理方式，包括一个全是空格的名字。
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-name-parent',
  template: `
  <h2>Master controls {{names.length}} names</h2>
  <app-name-child *ngFor="let name of names" [name]="name"></app-name-child>
  `
})
export class NameParentComponent {
  // 最后会显示为 'Mr. IQ', '<no name set>', 'Bombasto'
  names = ['Mr. IQ', '   ', '  Bombasto  '];
}
// 其实还是通过属性传值，把值从父组件传递到子组件。只不过用setter的方法，对值做了修改。
```
### 3.通过ngOnChanges()来截听输入属性值的变化
  使用OnChanges生命周期钩子接口的ngOnChanges()方法来监测输入属性值的变化并做出回应。
  这个VersionChildComponent会监测输入属性major和minor的变化，并把这些变化编写成日志以报告这些变化。
```typescript
import { Component, Input, OnChanges, SimpleChange } from '@angular/core';
@Component({
  selector: 'app-version-child',
  template: `
    <h3>Version {{major}}.{{minor}}</h3>
    <h4>Change log:</h4>
    <ul>
      <li *ngFor="let change of changeLog">{{change}}</li>
    </ul>
  `
})
export class VersionChildComponent implements OnChanges {
  @Input() major: number;
  @Input() minor: number;
  changeLog: string[] = [];
  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    let log: string[] = [];
    for (let propName in changes) {
      let changedProp = changes[propName];
      let to = JSON.stringify(changedProp.currentValue);
      if (changedProp.isFirstChange()) {
        log.push(`Initial value of ${propName} set to ${to}`);
      } else {
        let from = JSON.stringify(changedProp.previousValue);
        log.push(`${propName} changed from ${from} to ${to}`);
      }
    }
    this.changeLog.push(log.join(', '));
  }
}
```
  VersionParentComponent提供minor和major值，把修改它们值的方法绑定到按钮上。
```typescript
import { Component } from '@angular/core';
@Component({
  selector: 'app-version-parent',
  template: `
    <h2>Source code version</h2>
    <button (click)="newMinor()">New minor version</button>
    <button (click)="newMajor()">New major version</button>
    <app-version-child [major]="major" [minor]="minor"></app-version-child>
  `
})
export class VersionParentComponent {
  major = 1;
  minor = 23;
  newMinor() {
    this.minor++;
  }
  newMajor() {
    this.major++;
    this.minor = 0;
  }
}
// 还是props down属性绑定，只不过方法放到了OnChange的钩子上
```
### 4.父组件监听子组件的事件
  子组件暴露一个EventEmitter属性，当事件发生时，子组件利用该属性emits事件。父组件绑定到这个事件属性，并在事件发生时作出回应。
  子组件的EventEmitter属性是一个输出属性，通常带有@Output装饰器，就像在VoterComponent中看到的。
```typescript
import { Component, EventEmitter, Input, Output } from '@angular/core';
@Component({
  selector: 'app-voter',
  template: `
    <h4>{{name}}</h4>
    <button (click)="vote(true)"  [disabled]="voted">Agree</button>
    <button (click)="vote(false)" [disabled]="voted">Disagree</button>
  `
})
export class VoterComponent {
  @Input()  name: string;
  @Output() onVoted = new EventEmitter<boolean>();
  voted = false;

  vote(agreed: boolean) {
    this.onVoted.emit(agreed);
    this.voted = true;
  }
}
```
  点击按钮会触发true或false(布尔型有效载荷)的事件。
  父组件VoteTakerComponent绑定了一个事件处理器(onVoted())，用来响应子组件的事件($event)并更新一个计数器。
```typescript
import { Component }      from '@angular/core';
@Component({
  selector: 'app-vote-taker',
  template: `
    <h2>Should mankind colonize the Universe?</h2>
    <h3>Agree: {{agreed}}, Disagree: {{disagreed}}</h3>
    <app-voter *ngFor="let voter of voters"
      [name]="voter"
      (onVoted)="onVoted($event)">
    </app-voter>
  `
})
export class VoteTakerComponent {
  agreed = 0;
  disagreed = 0;
  voters = ['Mr. IQ', 'Ms. Universe', 'Bombasto'];
  onVoted(agreed: boolean) {
    agreed ? this.agreed++ : this.disagreed++;
  }
}
// 子组件向父组件传值，事件的触发从子组件到父组件由下往上，又称为events up，在父组件里面绑定事件，在子组件触发事件往父组件发送消息，然后父组件通过子组件选择器上绑定的接收值的函数，就可以拿到要传的值啦。
```
### 5.父子组件通过本地变量互动
  父组件不能使用数据绑定来读取子组件的属性或调用子组件的方法。但可以在父组件模板里，新建一个本地变量来代表子组件，然后利用这个变量来读取子组件的属性和调用子组件的方法，如下例所示。
  子组件CountdownTimerComponent进行倒计时，归零时发射一个导弹。start和stop方法负责控制时钟并在模板里显示倒计时的状态信息。
```typescript
import { Component, OnDestroy, OnInit } from '@angular/core';
@Component({
  selector: 'app-countdown-timer',
  template: '<p>{{message}}</p>'
})
export class CountdownTimerComponent implements OnInit, OnDestroy {
  intervalId = 0;
  message = '';
  seconds = 11;
  clearTimer() { clearInterval(this.intervalId); }
  ngOnInit() { this.start(); }
  ngOnDestroy() { this.clearTimer(); }
  start() { this.countDown(); }
  stop() {
    this.clearTimer();
    this.message = `Holding at T-${this.seconds} seconds`;
  }
  private countDown() {
    this.clearTimer();
    this.intervalId = window.setInterval(() => {
      this.seconds -= 1;
      if (this.seconds === 0) {
        this.message = '发射啦!';
      } else {
        if (this.seconds < 0) { this.seconds = 10; } // reset
        this.message = `T-${this.seconds} seconds and counting`;
      }
    }, 1000);
  }
}
```
  然后来看看计时器组件的宿主组件CountdownLocalVarParentComponent。
```typescript
import { Component }                from '@angular/core';
import { CountdownTimerComponent }  from './countdown-timer.component';
@Component({
  selector: 'app-countdown-parent-lv',
  template: `
  <h3>Countdown to Liftoff (via local variable)</h3>
  <button (click)="timer.start()">Start</button>
  <button (click)="timer.stop()">Stop</button>
  <div class="seconds">{{timer.seconds}}</div>
  <app-countdown-timer #timer></app-countdown-timer>
  `,
  styleUrls: ['../assets/demo.css']
})
export class CountdownLocalVarParentComponent { }
```
  父组件不能通过数据绑定使用子组件的start和stop方法，也不能访问子组件的seconds属性。
  把本地变量(#timer)放到(<countdown-timer>)标签中，用来代表子组件。这样父组件的模板就得到了子组件的引用，于是可以在父组件的模板中访问子组件的所有属性和方法。
  在这个例子中，我们把父组件的按钮绑定到子组件的start和stop方法，并用插值表达式来显示子组件的seconds属性。
### 6.父组件调用@ViewChild()
  这个本地变量方法是个简单便利的方法。但是它也有局限性，因为父组件-子组件的连接必须全部在父组件的模板中进行。父组件本身的代码对子组件没有访问权。如果父组件的类需要读取子组件的属性值或调用子组件的方法，就不能使用本地变量方法。当父组件类需要这种访问时，可以把子组件作为ViewChild，注入到父组件里面。
  下面的例子用与倒计时相同的范例来解释这种技术。 我们没有改变它的外观或行为。子组件CountdownTimerComponent也和原来一样。
  下面是父组件CountdownViewChildParentComponent:
```typescript
import { AfterViewInit, ViewChild } from '@angular/core';
import { Component }                from '@angular/core';
import { CountdownTimerComponent }  from './countdown-timer.component';
@Component({
  selector: 'app-countdown-parent-vc',
  template: `
  <h3>Countdown to Liftoff (via ViewChild)</h3>
  <button (click)="start()">Start</button>
  <button (click)="stop()">Stop</button>
  <div class="seconds">{{ seconds() }}</div>
  <app-countdown-timer></app-countdown-timer>
  `,
  styleUrls: ['../assets/demo.css']
})
export class CountdownViewChildParentComponent implements AfterViewInit {
  @ViewChild(CountdownTimerComponent)
  private timerComponent: CountdownTimerComponent;
  seconds() { return 0; }
  ngAfterViewInit() {
    // 从`CountdownTimerComponent.seconds` 重新定义 `seconds()`，但是等一下首先要避免一次性DEVMODE
    // 单向数据流违规错误
    setTimeout(() => this.seconds = () => this.timerComponent.seconds, 0);
  }
  start() { this.timerComponent.start(); }
  stop() { this.timerComponent.stop(); }
}
```
  把子组件的视图插入到父组件类需要做一点额外的工作。
  首先，你要使用ViewChild装饰器导入这个引用，并挂上AfterViewInit生命周期钩子。接着，通过@ViewChild属性装饰器，将子组件CountdownTimerComponent注入到私有属性timerComponent里面。组件元数据里就不再需要#timer本地变量了。而是把按钮绑定到父组件自己的start和stop方法，使用父组件的seconds方法的插值表达式来展示秒数变化。
  这些方法可以直接访问被注入的计时器组件。
  ngAfterViewInit()生命周期钩子是非常重要的一步。被注入的计时器组件只有在Angular显示了父组件视图之后才能访问，所以我们先把秒数显示为0.然后Angular会调用ngAfterViewInit生命周期钩子，但这时候再更新父组件视图的倒计时就已经太晚了。Angular的单向数据流规则会阻止在同一个周期内更新父组件视图。我们在显示秒数之前会被迫再等一轮。使用setTimeout()来等下一轮，然后改写seconds()方法，这样它接下来就会从注入的这个计时器组件里获取秒数的值。
### 7.父组件和子组件通过服务通讯
  父组件和它的子组件共享同一个服务，利用该服务在家庭内部实现双向通讯。该服务实例的作用域被限制在父组件和其子组件内。这个组件子树之外的组件将无法访问该服务或者与它们通讯。
  比如这个MissionService把MissionControlComponent和多个AstronautComponent子组件连接起来。
```typescript
import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
@Injectable()
export class MissionService {
  // 观察字符串资源
  private missionAnnouncedSource = new Subject<string>();
  private missionConfirmedSource = new Subject<string>();
  // 观察字符串数据流
  missionAnnounced$ = this.missionAnnouncedSource.asObservable();
  missionConfirmed$ = this.missionConfirmedSource.asObservable();
  // 服务信息控制
  announceMission(mission: string) {
    this.missionAnnouncedSource.next(mission);
  }
  confirmMission(astronaut: string) {
    this.missionConfirmedSource.next(astronaut);
  }
}
```
  MissionControlComponent提供服务的实例，并将其共享给它的子组件(通过providers元数据数组)，子组件可以通过构造函数将该实例注入到自身。
```typescript
import { Component }          from '@angular/core';
import { MissionService }     from './mission.service';
@Component({
  selector: 'app-mission-control',
  template: `
    <h2>Mission Control</h2>
    <button (click)="announce()">Announce mission</button>
    <app-astronaut *ngFor="let astronaut of astronauts"
      [astronaut]="astronaut">
    </app-astronaut>
    <h3>History</h3>
    <ul>
      <li *ngFor="let event of history">{{event}}</li>
    </ul>
  `,
  providers: [MissionService]
})
export class MissionControlComponent {
  astronauts = ['Lovell', 'Swigert', 'Haise'];
  history: string[] = [];
  missions = ['代表月亮消灭你!',
              '我是火星来的!',
              '你咋不说你太阳系的呢!'];
  nextMission = 0;
  constructor(private missionService: MissionService) {
    missionService.missionConfirmed$.subscribe(
      astronaut => {
        this.history.push(`${astronaut} confirmed the mission`);
      });
  }
  announce() {
    let mission = this.missions[this.nextMission++];
    this.missionService.announceMission(mission);
    this.history.push(`Mission "${mission}" announced`);
    if (this.nextMission >= this.missions.length) { this.nextMission = 0; }
  }
}
```
  AstronautComponent也通过自己的构造函数注入该服务。由于每个AstronautComponent都是MissionControlComponent的子组件，所以它们获取到的也是父组件的这个服务实例。
```typescript
import { Component, Input, OnDestroy } from '@angular/core';
import { MissionService } from './mission.service';
import { Subscription }   from 'rxjs/Subscription';
@Component({
  selector: 'app-astronaut',
  template: `
    <p>
      {{astronaut}}: <strong>{{mission}}</strong>
      <button
        (click)="confirm()"
        [disabled]="!announced || confirmed">
        Confirm
      </button>
    </p>
  `
})
export class AstronautComponent implements OnDestroy {
  @Input() astronaut: string;
  mission = '<no mission announced>';
  confirmed = false;
  announced = false;
  subscription: Subscription;
  constructor(private missionService: MissionService) {
    this.subscription = missionService.missionAnnounced$.subscribe(
      mission => {
        this.mission = mission;
        this.announced = true;
        this.confirmed = false;
    });
  }
  confirm() {
    this.confirmed = true;
    this.missionService.confirmMission(this.astronaut);
  }
  ngOnDestroy() {
    // 组件损坏时防止内存泄漏
    this.subscription.unsubscribe();
  }
}
/*
  注意，这个例子保存了subscription变量，并在AstronautComponent被销毁时调用unsubscribe()退订。 这是一个用于防止内存泄漏的保护措施。实际上，在这个应用程序中并没有这个风险，因为AstronautComponent的生命期和应用程序的生命期一样长。但在更复杂的应用程序环境中就不一定了。
  不需要在MissionControlComponent中添加这个保护措施，因为它作为父组件，控制着MissionService的生命期。
*/
```
























