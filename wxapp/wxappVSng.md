## wxapp 与 Angular的相似与区别

wxapp | Angular | 解释一下
- | - | -
wx:if | \*ngIf | 控制某元素是否挂载DOM，没啥特殊区别
wx:for='{{可循环的data}}'<br>wx:for-index<br>wx:key | \*ngFor='let xxx of xxx ;let xxx=index' | wxapp的循环指令如果需要利用index需要多加一个，不能一句写完，需要加wx;key标识，ng一句话搞定，还可以指定循环出来的各项名字，wxapp统一item
{{}} | {{}} | 插值表达式用的就很随心了，目前没发现特殊区别，class动态添加隐藏通过三目和{{}}也是一样的
bindtap = xxx事件名字 | (click) = xxx事件名字 | wxapp可用事件都是自己的，需要单独掌握
this.data.xxx / this.setDate({xxx:xxx}) | this.xxx / this.xxx = xxx | 很明显wxapp的获取值和更新值很麻烦