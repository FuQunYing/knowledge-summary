# 一、概述
## 1.介绍
  Vue CLI是一个基于Vue.js进行快速开发的完整系统，提供：
  - 通过@vue/cli搭建交互式的项目脚手架
  - 通过@vue/cli+@vue/cli-service-global快速开始零配置原型开发
  - 一个运行时依赖（@vue/cli-service)，该依赖：
   - 可升级
   - 基于webpack构建，并带有合理的默认配置
   - 可以通过项目内的配置文件进行配置
   - 可以通过插件进行扩展
  - 一个丰富的官方插件集合
## 2.该系统的组件
### 2.1 CLI
  CLI（@vue/cli）是一个全局安装的npm包，提供了终端里的vue命令，它可以通过vue create 快速创建一个新项目的脚手架，或者直接通过vue serve 构建新想法的原型，也可以通过vue ui通过一套图形化界面管理所有的项目。
### 2.2 CLI服务
  CLi服务（@vue/cli-service）是一个开发环境依赖，它是一个npm包，局部安装在每个@vue/cli创建的的项目中。
  CLI服务是构建于webpack和webpack-dev-server之上的。它包含了：
  - 加载其它CLI插件的核心服务
  - 一个针对绝大部分应用优化过的内部的webpack配置
  - 项目内部的vue-cli-service命令，提供serve、build和inspect命令
  如果熟悉create-react-app的话，@vue/cli-service实际上大致等价于react-scripts，虽然功能集合不一样。
### 2.3 CLI插件
  CLI插件是向我的Vue项目中提供可选功能的npm包，例如Babel/Typescript转译，ESLint集成、单元测试和end-to-end测试等，Vue CLI插件的名字以@vue/cli-plugin-（内建插件）或vue-cli-plugin-（社区插件）开头，非常容易使用。
  当在项目内部运行vue-cli-service命令时，它会自动解析并加载package.json中列出的所有CLI插件。插件可以作为项目创建过程的一部分，或在后期加入到项目中，它们也可以被归成一组可复用的preset。
# 二、CLI
## 1.创建一个项目
### 1.1 安装
  注意：Vue CLI需要Node.js v8或者更高版本。
```txt
mpm i -g @vue/cli
或者
yarn global add @vue/cli
```
### 1.2 vue create
  运行以下命令来创建一个新项目：
```txt
vue create app-name

目前发现create出来的项目，发现browserify-zlib这个包，安装不安全，启动项目的时候报错，找不到此模块，从之前init出来的项目里面把这个包复制过来才启动成功。
```
  vue create --help 可以看到更多的create后可跟的选项
```txt
用法：create [options] app-name
创建一个由 vue-cli-service提供支持的新项目
选项：
-p , --preset<presetName> 忽略提示符并使用已保存的或远程的预设选项
-d , --default 忽略提示符并使用默认预设选项
-i , --inlinePreset <json> 忽略提示符并使用内联的JSON字符串预设选项
-m , --packageManager <command> 在安装依赖 时使用指定的npm客户端
-r , --register <url> 在安装依赖时使用指定的npm register（仅用于npm客户端）
-g , --git [message]  强制/跳过git初始化，并可选的指定初始化提交信息
-f , --force  复写目标可能存在的配置
-c , --clone  使用git clone获取远程预项目选项
-x , --proxy  使用指定的代理创建项目
-h ，--help  输出使用帮助信息
```
### 1.3 使用图形化界面
  也可以通过vue ui命令以图形化界面创建和管理项目： vue ui，这个命令会打开一个浏览器窗口，并以图形化界面引导项目创建。
###  1.4 拉取2.X模板（旧版本）
  Vue CLI3和旧版使用了相同的vue命令，所以Vue CLI2（vue-cli）被覆盖了，如果仍然需要使用旧版本的vue init 功能，可以全局安装一个桥接工具：
```txt
npm install -g @vue/cli-init
# `vue init` 的运行效果将会跟 `vue-cli@2.x` 相同
vue init webpack my-project
```
## 2.快速原型开发
  可以使用vue serve 和vue build命令对单个 \*.vue文件进行快速原型开发，不过这需要先额外安装一个全局的扩展：
```txt
npm i -g @vue/cli-service-global
```
  vue serve的缺点就是它需要安装全局依赖，这使得它在不同机器上的一致性不能得到保证，因此这只适用于快速原型开发。
### 2.1 vue serve
  用法：serve [options]  [entry]
  在开发环境模式下配置.js或.vue文件启动一个服务器
  Options:
   -o , --open 打开浏览器
   -c , --copy 将本地URL复制到剪切板
   -h , --help 输出用法信息
  所需的就是一个App.vue文件：
```html
<template>
	<h1> hello world</h1>
</template>
```
  然后在App.vue文件所在的目录下运行：vue serve
  vue serve 使用了和vue create创建的项目相同的默认设置（webpack、Babel、PostCSS和ESLint）。它会在当前目录自动推导入口文件——入口可以是main.js、index.js、App.vue或app.vue中的一个。也可以显式的指定入口文件：vue serve MyComponent.vue
  如果需要，还可以提供一个index.html，package.json、安装并使用本地依赖、甚至通过响应的配置文件配置Babel、PostCSS和ESLint。
### 2.2 vue build
  用法： build [options]  [entry]
  在生产环境下零配置构建一个.js或.vue文件
  Options：
  -t , --target  <target> 构建目标(app | lib | wc | wc-async， 默认值： app)
  -n , --name <name> 库的名字或Web Components组件的名字（默认值：入口文件名）
  -d , --dest <dir> 输出目录 （默认值 ： dist）
  -h, --help 输出用法信息
  也可以使用vue build将目标文件构建成一个生产环境的包并用来部署：vue build MyComponent.vue
  vue build 也提供了将组件构建成为一个库或一个Web Components组件的能力。
## 3.插件和Preset
### 3.1 插件
  Vue CLI使用了一套基于插件的架构，看package.json，就会发现依赖都是以@vue/cli-plugin-开头的，插件可以修改webpack的内部配置，也可以向vue-cli-service注入命令，在项目创建的过程中，绝大部分列出的特性都是通过插件来实现的。
  基于插件的架构使得Vue CLI灵活且可扩展。
### 3.1.1 在现有的项目中安装插件
  每个CLI插件 都会包含一个（用来创建文件的）生成器和一个（用来调整webpack核心配置和注入命令的）运行时插件，当使用vue create来创建一个新项目的时候，有些插件会根据我选择的特性被预安装好，如果想在一个已经被创建好的项目中安装一个插件，可以使用vue  add 命令：
```txt
  vue add @vue/eslint
  
  vue add的设计意图是为了安装和调用Vue CLI插件，这不意味着替换掉普通的npm包。对于这些普通的npm包，仍然需要选用包管理器。
  推荐在运行vue add之前将项目的最新状态提交，因为该命令可能调用插件的文件生成器并很有可能更改现有的文件
```
  这个命令将@vue/eslint解析为完整的包名@vue/cli-plugin-eslint，然后从npm安装它，调用它的生成器。
```txt
//这个和之前的用法等价
vue add @vue/cli-plugin-eslint
```
  





















