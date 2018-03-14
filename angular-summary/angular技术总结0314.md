#Day22
##五、动态表单
  这一节，就利用formGroup来动态渲染一个简单的表单，包括各种控件类型和验证规则，在这个demo里面，就使用动态表单，为正在找工作的大神们创建一个在线申请表，职业介绍所会不断更改申请流程，我要在不用修改代码的情况下，动态创建这些表单。
### 1.启动/引导
  首先创建一个名叫AppModule的NgModule，然后从@angular/forms库中引入ReactiveFormsModule模块。在main.ts中启动AppModule
**main.ts**
```typescript
import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamin';
import {AppModule} from './app/app.module';//引入AppModule
import {environment} from './environments/environment';
if(environment.production){
    enableProdMode();
}
platformBrowserDynamic().bootstrapModule(AppModule);
```
**app.module.ts**
```typescript
import {BrowserModule} from '@angular/platform-browser';
import {ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import { AppComponent }                 from './app.component';
import { DynamicFormComponent }         from './dynamic-form.component';
import { DynamicFormQuestionComponent } from './dynamic-form-question.component';
@NgModule({
    imports:[BrowserModule,ReactiveFormsModule],
    declarations:[
        AppComponent, DynamicFormComponent, DynamicFormQuestionComponent
    ],
    bootstrap:[AppComponent]//此bootstrap非bootstrap，在这儿是启动的意思
})
export class AppModule({
    constructor(){}
})
```
### 2.问卷问题模型
  第一步是定义一个对象模型，用来描述所有表单功能需要的场景，人物在申请流程上涉及到一个包含很多问卷问题的表单。问卷问题是最基础的对象模型。
  下面是建立的最基础的问卷问题基类，名叫QuestionBase：
**question-base.ts**
```typescript
export class QuestionBase<T>{
    value:T;
    key:string;
    label:string;
    required: boolean;
    order: number;
    controlType: string;
    constructor(options:{
         value?: T,
         key?: string,
         label?: string,
         required?: boolean,
         order?: number,
         controlType?: string
    }={}){
        this.value = options.value;
        this.key = options.key || '';
        this.label = options.label || '';
        this.required = !!options.required;
        this.order = options.order === undefined ? 1 : options.order;
        this.controlType = options.controlType || '';
    }
}
```
  在这个基础上，派生出了两个新类extboxQuestion 和 DropdownQuestion，分别代表文本框和下拉框。这么做是为了表单能动态绑定到特定的问卷问题类型，并动态渲染出合适的控件。
  TextboxQuestion可以通过type属性来支持多种HTML5元素类型，比如文本、邮件、网址等。
**question-textbox.ts**
```typescript
import {QuestionBase} from './question-base';
export class TextboxQuestion extends QuestionBase<string> {
  controlType = 'textbox';
  type: string;
  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}
```
  DropdownQuestion表示一个带可选项列表的选择框。
**question-dropdown.ts**
```typescript
import { QuestionBase } from './question-base';
export class DropdownQuestion extends QuestionBase<string> {
  controlType = 'dropdown';
  options: {key: string, value: string}[] = [];
  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}
```
  然后，定义了QuestionControlService，一个可以把问卷问题转换为FormGroup的服务，简而言之，这个FormGroup使用问卷模型的元数据，并允许我设置默认值个和验证规则：
**question-control.service.ts**
```typescript
import {Injectable} from '@angular/core';
import {FormControl,FormGroup,Validators} from "@angular/froms";
import {QuestionBase} from './question-base';
@Injectable()
export class QuestionControlService{
    constructor(){}
    toFormGroup(questions:QuestionsBase<any>[]){
        let group:any={};
        questions.forEach(question => {
            group[question.key] = question.required ? 
            new FormControl(question.value || '',Validators.required) : 
            new FormGroup(question.value || '');
        });
        return new FormGroup(group);
    }
}
```
### 3.问卷表单组件
  现在有了一个定义好的完整模型了，然后就可以创建一个展现动态表单的组件：
  DynamicFormComponent是表单的主要容器和入口：
**daynamic-form.component.ts**
```typescript
import {Component,Input,OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {QuestionBase} from './question-base';
import {QuestionControlService} from './question-control.service';
@Component({
    selector:'app-dynamic-form',
    templateUrl:'./dynamic-form.component.html',
    providers:[QuestionControlService]//切记切记
})
export class DynamicFormComponent implements OnInit{
    @Input() questions:QuestionBase<any>[] =[];
    form:FormGroup;
    payLoad = '';
    constructor(private qcService:QuestionControlService){}
    ngOnInit() {
        this.form = this.qcService.toFormGroup(this.questions);
    }
    onSubmit(){
        this.payLoad = JSON.stringify(this.form.value);
    }
}
```
**dynamic-form.component.html**
```html
<div>
  <form (ngSubmit)="onSubmit()" [formGroup]="form">
    <div *ngFor="let question of questions" class="form-row">
      <app-question [question]="question" [form]="form"></app-question>
    </div>
    <div class="form-row">
      <button type="submit" [disabled]="!form.valid">Save</button>
    </div>
  </form>
  <div *ngIf="payLoad" class="form-row">
    <strong>保存下来的值：</strong><br>{{payLoad}}
  </div>
</div>
```
  它代表了问卷问题列表，每个问题都被绑定到一个<app-question>组件元素，<app-question>标签匹配到的是组件DynamicFormQuestionComponent，该组件的职责是根据各个问卷问题对象的值来动态渲染表单组件：
**dynamic-form-question.component.ts**
```typescript
import {Component,Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {QuestionBase} from './question-base';
@Component({
  selector: 'app-question',
  templateUrl: './dynamic-form-question.component.html'
})
export class DynamicFormQuestionComponent{
    @Input() question:QuestionBase<any>;
    @Input() form:FormGroup;
    get isValid(){
        return this.form.controls[this.question.key].valid;
    }
}
```
**dynamic-form-question.component.html**
```html
<div [formGroup]="form">
  <label [attr.for]="question.key">{{question.label}}</label>
  <div [ngSwitch]="question.controlType">
    <input *ngSwitchCase="'textbox'" [formControlName]='question.key' [id]="question.key" [type]="question.type">
    <select [id]="question.key" *ngSwitchCase="'dropdown'" [formControlName]="question.key">
      <option *ngFor="let opt of question.options" [value]="opt.key">
      	{{opt.value}}
      </option>
    </select>
  </div>
  <div class="errorMessage" *ngIf="!isValid">{{question.label}}is required</div>
</div>
```
  注意，这个组件能代表模型里的任何问题类型，目前还只有两种问题模型，但是可以添加更多的类型，所以用ngSwitch来决定显示哪种类型的问题。在这两个组件里面，所依赖的Angular的FormGroup来把模板HTML和底层控件对象连接起来，该对象从问卷问题模型里获取渲染和验证规则。formControlName和FormGroup是在ReactiveFormsModule中定义的指令，因为之前在AppModule里面导入了ReactiveFormsModule，所以在模板里面能用了。
### 4.问卷数据
  DynamicForm期望得到一个问题列表，该列表被绑定到@Input() questions属性。
  QuestionService会返回为工作申请表定义的那组问题列表，在真实的应用程序环境中，会从数据库里获得这些问题列表。关键是，现在是完全根据QuestionService返回的对象来控制人物的工作申请表，要维护这份问卷，只要简单的添加、删除、更新questions的数组就行了。
**question.service.ts**
```typescript
export class QuestionService{
    getQuestions(){
        let questions:QuestionBase<any>[] = [
            new DropdownQuestion({
                key:'handsome',
                label:'Handsome',
                options:[
                    {key: 'solid',  value: 'Solid'},
                    {key: 'great',  value: 'Great'},
                    {key: 'good',   value: 'Good'},
                    {key: 'unproven', value: 'Unproven'}
                ],
                order:3
            }),
            new TextboxQuestion({
                key:'name',
                label:'Name',
                value:'XuSong',
                required:true,
                order:1
            }),
            new TextboxQuestion({
                key:'emailAddress',
                label:'Email',
                type:'email',
                order:2
            })
        ];
        return questions.sort((a,b)=>a.order - b.order)
    }
}
```
  最后，在AppComponent里显示出表单
**app.component.ts**
```typescript
import {Component} from '@angular/core';
import {QuestionService} from './question.service';
@Component({
    selector:'app-root',
    tempalte:`
      <app-dynamic-form [questions]="questions"></app-dynamic-form>
    `,
    providers:[QuestionService]
})
export class AppComponent{
    question:any[];
    constructor(private service:QuestionService){
        this.questions = service.getQuestions()
    }
}
```
### 5.动态模板
  在这个demo里面，虽然只是在为人物的工作申请表建模，但是除了QuestionService返回的那些对象外，没有其它任何地方是与人物有关的，这点很重要，因为只要与问卷对象模型兼容，就可以在任何类型的的调查问卷中复用这些组件。这里的关键是用到元数据的动态数据绑定来渲染表单，对问卷问题没有任何的硬性假设，除控件的元数据外，还可以动态添加验证规则。表单验证通过之前，保存按钮是禁止的，验证通过后就可以点击保存按钮，程序会把当前值渲染成JSON显示出来，这就表明任何用户的输入都被传到了数据模型里。
  最后，表单长这样：
![图片](xiaoguo.png)










































