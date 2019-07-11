# 唱吧

## 账号 & 密码
 > waterlady ----------- changba*2018*ddd
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
> hanhongshu@changba.com   kulv0215
> 
> 添加站点 - changba.com-url（然后会给出web_id，把web_id加到JS的初始上和HTML的引入上）
> 
> js添加代码 - load为uv，click为事件，事件名字可以自定义


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
> 
> 请求统一为post
>  
> safari浏览器不能识别 - new的时间，要用 /

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
## 关于vsCode
> 想要修改侧边栏的字体与颜色的时候，在安装包的out的vs里面css文件查找
> 
> monaco-workbench>.part>.content
> 
> 在里面加上font-family和color即可

# 东岸未来
## 东本官网维护
- 后台可直接增删改查----直接发对应前端地址，更新CDN
- 需要更改代码，从ftp下载需要被更改的文件，更改之后上传ftp，在host查看效果，ok以后把更改的文件打包发给XXXX，再让他们更新CDN

# 联世传奇
## 星云助手
- npm run server 启动开发服务器，使用的gulp 监听
- 根据地址栏的链接定位页面所在的文档位置，根据报错定位问题
- 改完之后，编译，先上传子文件夹（编译后）的代码，再上传外部的代码，这是插件版的
- 客户端版的，需要在pro文件夹里，拉取sub_model的代码，然后在package.json内，更新版本号，然后执行npm run publish 和 gulp publish 发版，发版成功以后，客户端启动时会自动更新。然后推送一下pro的代码（这里就更了版本号）

## 品智大师
- 品智大师没有本地开发服务器，定位到问题，改了对应的文件之后，上传到自己的服务器，在线查看效果
- 根据改动的文件夹名字，进行gulp编译（比如现在用到过的gulp report_build），编译之后提交代码
- 在后端更改版本号，比如编译成功后是report.min.js就在后端文件里更改引入它的版本号

## 品智车手、品智钻、品智推荐
- 功能结构差不多，Angular8+NZ的模式也很熟悉，没有大坑