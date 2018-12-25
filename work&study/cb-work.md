## 账号 & 密码
 > waterlady ----------- changba\*2018\*ddd
 > 
 > fuqunying ----------- Changba@2018

## 项目相关
> 创建
> 
> gulp create --name xxx/xxx/index --template vuebase

> 启动
> 
> gulp dev --name xxx/xxx

> 打包
> 
> gulp build --name xxx/xxx
> 
> 经过build以后，自动打包到www下，首次创建的文件，www下需要提交的有页面、controller、model！！！！！切记

> 关于config.js
> 
> 有更改一定要重启项目！！！！！！

## 项目内知识点
> 分享：https://wiki.changba.com/pages/viewpage.action?pageId=23613169
> 
> 我的ip地址：http://192.168.63.155:8080

## 站点统计
> 友盟 - 三叔账号
> 
> 添加站点 - changba.com-url
> 
> js添加代码 - load为uv，click为事件


## svn 相关
> 拉取远程最新代码
> 
> svn up

> 添加新的文件
> 
> svn add 文件路径(真麻烦，git直接识别哪个没有被add)

> 查看状态
> 
> svn status
> 
> ? 没有add，A 没被提交过，M 更新了，没有提交过

> 提交代码至仓库 (status 以后commit的时候就不用加path了)
> 
> svn commit -m "MAINT: xxxxx@fuqunying"

> outCB 为true就是在站外
> 
> userid - 可以直接用
> 
> token - 可以直接用

## 一些坑
> 我的userid 244221667
> 
> 只要需要userid的，token也要一起！！！！！！
> 
> 获取token http://wwwdev.changbaops.com/wanghaijuan/yunying/tiger.php?userid=244221667
> 
> 拼接参数不要加空格！
> 
> margin-top或者margin-bottom定位在一些机型上会有问题，但是用position的absolute定位的时候，如果是整体top设定，那么在webview里面，这个整体都不会计算高度。

## 一些需要长进的技术
> CSS3的动画、2D、3D变形等
> 
> 以前很少用但现在常用的css属性总结

```css
/*文字类*/
letter-spacing：文字间距
text-indent：首字缩进
```

## Mac 相关
> 查看端口占用 sudo lsof -i tcp:port
> 
> sudo kill pid
> 
