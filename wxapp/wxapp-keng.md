## wxapp 与 Angular的相似与区别

wxapp | Angular | 解释一下
- | - | -
wx:if | \*ngIf | 控制某元素是否挂载DOM，没啥特殊区别
wx:for='{{可循环的data}}'<br>wx:for-index<br>wx:key | \*ngFor='let xxx of xxx ;let xxx=index' | wxapp的循环指令如果需要利用index需要多加一个，不能一句写完，需要加wx:key标识，ng一句话搞定，还可以指定循环出来的各项名字，wxapp统一item 
{{}} | {{}} | 插值表达式用的就很随心了，目前没发现特殊区别，class动态添加隐藏通过三目和{{}}也是一样的
bindtap = xxx事件名字 | (click) = xxx事件名字 | wxapp可用事件都是自己的，需要单独掌握
this.data.xxx / this.setDate({xxx:xxx}) | this.xxx / this.xxx = xxx | 很明显wxapp的获取值和更新值很麻烦
this | this | wxapp的this不一定一直指向Page，所以函数有嵌套的时候，最好用that加以保留，看看人家ng的this，多么从一而终。

## wxapp-项目-的一些坑
1.微信小程序 - 录音与播放
  - 电脑上开发者工具可能无法播放录音完成时的音频文件，所以播放没有声音
  - 唱吧K歌项目中，因为电脑录音在后端无法生成作品，所以后台没有返回ok之类的值，一直98%，这个百分比的数字，竟然是随机生成的！
  - 通常音频播放的时候，在onPlay里面设置了定时器来控制音乐时长，但是明显不对--暂定，然后，循环控制事件的OK，但是onPlay和onStop只在第一次调用play被调用了，再次点击播放，不会调用onPlay和onStop？？？？
  - 上个问题已解决，，在播放结束以后，需要手动调用offPlay和offStop解绑上一次事件绑定
  - 发起请求需要先在公众平台设置合法域名，但是测试那么多，，所以需要自己在本地搭建服务器(参考简书教程)，本地服务器
```txt
	本地服务器已经搭建
	问题1，这次请求是get，仅仅是拿到了json数据而已，是否可以post，根据data或者参数拿到一些特定的数据(自己写PHP？不行，json-server只能运行json/js文件)
	问题2，如果xampp安装以后，使用127.0.01的话，需要重新配置nginx？端口？
```


2.比如progress进度条需要数字显示，如果用this.data.progress=xxx来改data里面的值，页面上的值并不会更改，如果类似于双向数据绑定的效果，必须要用this.setData({progress:xxx})，用这个改，值才会实时更新到页面

3.小程序button的边框，是用::after来设置的，如果要去除：
```css
button::after{
    border:none
}
```

4.小程序云开发，函数中需要npm i 来安装一些依赖，安装完成以后，要再次上传，不然还是调用失败，因为没有可以引用的包

5.webscoket，要设置一个键对连接进行判断，判断连接成功再发送或者获取消息。
