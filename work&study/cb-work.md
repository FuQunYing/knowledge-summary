## 账号 & 密码
 > waterlady ----------- changba\*2018\*ddd
 > fuqunying ----------- Changba@2018

## 项目相关
> 创建
> gulp create --name xxx/xxx/index --template vuebase

> 启动
> gulp dev --name xxx/xxx

> 打包
> gulp build --name xxx/xxx
> 经过build以后，自动打包到www下，首次创建的文件，www下需要提交的有页面、controller、model！！！！！切记

## svn 相关
> 拉取远程最新代码
> svn up

> 添加新的文件
> svn add 文件路径(真麻烦，git直接识别哪个没有被add)

> 查看状态
> svn status
> ? 没有add，A 没被提交过，M 更新了，没有提交过

> 提交代码至仓库 (status 以后commit的时候就不用加path了)
> svn commit -m "MAINT: xxxxx@fuqunying"

> outCB 为true就是在站外
> userid - 可以直接用
> token - 可以直接用

## 一些坑