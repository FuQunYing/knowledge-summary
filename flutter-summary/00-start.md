## 一、安装环境

- 1.没有npm安装，直接下载SDK压缩包，解压之后，放到自己喜欢的路径下
- 2.添加到环境变量 export PATH=`pwd`/flutter/bin:$PATH；添加到全局变量的话，编辑(或者添加) $HOME/.bash_profile，把下面两句添加进去，/Applications需要替换自己放置flutter包的路径，因为我放在了应用程序里，所以是Applications/flutter。。。。。
```txt
export PATH=`pwd`/flutter/bin:$PATH
export PATH=/Applications/flutter/bin:$PATH
```
- 3.运行flutter doctor，看看环境变量有没有添加成功，正常输出就OK

## 二、模拟器设置（Mac环境）

- 1.安装Xcode，使用命令open -a Simulator，即可打开一个模拟器，在hardware-devices里可以选择自己想看的机型

## 三、初始化一个项目

- 1.通过命令行，flutter create myApp，即可创建
- 2.通过编辑器，我用的intelli IDE，先安装flutter插件，然后再new project，即可选择flutter

## 四、运行项目

- 1.进入项目目录内，运行flutter devices 查看当前可用的模拟器，如果为0，则需要open -a Simulator来打开至少一个模拟器
- 2.运行flutter run，项目就可以在模拟器上跑起来啦
- 3.在main.dart里做一些修改，然后在terminal里按下r进行刷新，就可以看到更改啦


