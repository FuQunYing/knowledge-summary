#Day35
###7.注入组件的DOM元素
  有时候需要访问一个组件对应的DOM元素，先看一下代码，这是 在属性型指令HighlightDirective的基础上的一个简化版：
```typescript
import {Directive,ElementRef,HostListener,Input} from '@angular/core';
@Directive({
  selector: '[appHighlight]'
})
export class HightlightDirective{
  @Input('appHighlight') highlightColor: string;
  ptivate el:ElmentRef;
  construtor(el:ElmentRef){
    this.el = el.nativeElement;
  }
  @HostListener('mouseenter') onMouseEnter(){
    this.highlight(this.highlightColor || 'green')
  }
  @HostListener('mouseleave') onMMouseLeave(){
    this.highlight(null);
  }
  private highlight(color:string){
    this.el.style.background = color;
  }
}
```
  当用户把鼠标移到DOM元素上的时候，指令就会把该元素高亮，Angular把构造函数参数el设置为注入的ElementRef，该ElementRef代表了宿主的DOM元素，它的nativeElement属性把该DOM元素暴露给了指令。下面的代码就是把指令的myHighlight属性添加到两个div标签里面，一个没有赋值，一个赋值了颜色：
```html
<div id="highlight"  class="di-component"  appHighlight>
  <h3>Person Bios and Contacts</h3>
  <div appHighlight="yellow">
    <app-person-bios-and-contacts></app-person-bios-and-contacts>
  </div>
</div>
```