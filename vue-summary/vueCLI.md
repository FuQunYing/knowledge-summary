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
  如果不带@vue前缀，该命令会换作解析一个unscoped的包，例如以下命令会安装第三方插件vue-cli-plugin-apollo:
```txt
//安装并调用vue-cli-plugin-apollo
vue add appollo
```
  也可以基于一个指定的scope使用第三方插件，例如如果一个插件名为@foo/vue-cli-plugin-bar， 可以这样添加：
```txt
vue add @foo/bar
```
  可以向被安装的插件传递生成器选项（这样做会跳过命令提示）：
```txt
vue add @vue/eslint --config airbnb --lintOn save
```
  vue-router和vuex的情况比较特殊，它们并没有自己的插件，但是仍然可以这样添加它们：
```txt
vue add router
vue add vuex
```
  如果一个插件已经被安装，可以使用vue invoke命令跳过安装过程，只调用它的生成器，这个命令会接受和vue add相同的参数。
### 3.2 Preset
  一个Vue CLI preset是一个包含创建新项目所需预定义选项和插件的JSON对象，让用户无需在命令提示中选择它们。
#### 3.2.1 Preset插件的版本管理
  可以显式地指定用到的插件版本：
```json
{
    "plugins":{
        "@vue/cli-plugin-eslint":{
            "version":"^3.0.0",
            //...该插件的其它选项
        }
    }
}
```
  注意对于官方插件来说这不是必须的——当被忽略时，CLI会自动使用registry中的最新版本，不过推荐为preset列出的所有第三方插件提供显式的版本范围。
#### 3.2.2 允许插件的命令提示
  每个插件在项目创建的过程中都可以注入它自己的命令提示，不过当我使用了一个preset，这些命令提示就会被跳过，因为Vue CLI假设所有的插件选项都已经在preset中声明过了。在有些情况下，希望preset只声明需要的插件，同时让用户通过插件注入的命令提示来保留一些灵活性。
  对于这种场景可以在插件选项中指定"prompts":true来允许注入命令：
```json
{
    "plugins":{
        "@vue/cli-plugin-eslint":{
            //让用户选取它们自己的ESlint config
            "prompts":true
        }
    }
}
```
#### 3.2.3 远程Preset
  可以通过git repo将一个preset分享给其它开发者。这个repo应该包含一个包含了preset数据的preset.json文件，然后就可以在创建项目的 时候通过--preset选项使用这个远程的preset了：
```txt
//从GitHub repo 使用preset
vue create --preset username/repo my-project
```
  GitLab和BitBucket也是支持的，如果要从私有repo获取，要确保使用--clone选项：
```txt
vue create --preset gitlab:username/repo --clone my-project
vue create --preset bitbucket:username/repo --clone my-project
```
#### 3.2.4 加载文件系统中的Preset
  当开发一个远程的preset的时候，必须不厌其烦的向远程repo发出push进行反复测试。为了简化这个流程，--preset标记也支持本地的.json文件
```txt
vue create --preset local.json my-project
```
# 三、CLI服务
## 1.使用命令
  在一个Vue CLI项目中，@vue/cli-service安装了一个名为vue-cli-service的命令，可以在npm scripts中以vue-cli-service、或者从终端中以./node_modules/.bin/vue-cli-service访问这个命令。
  使用默认preset的项目的package.json：
```json
{
    "scripts": {
        "serve":"vue-cli-service serve",
        "build":"vue-cli-service build"
    }
}
```
  可以通过npm或者yarn调用这些script：
```txt
npm run serve / yarn serve
```
  如果可以使用npx（最新版的npm应该已经自带），也可以这样直接调用命令：
```txt
npx vue-cli-service serve
```
## 2.vue-cli-service serve
  用法： vue-cli-service serve [options]
  选项：
  - --open， 在服务器启动时打开浏览器
  - --copy， 在服务器启动时将URL复制到剪切板
  - --mode， 指定环境模式（默认值：development）
  - --host， 指定host（默认值：0.0.0.0）
  - --port， 指定port（默认值8080）
  - --https， 使用https（默认值：false）
    serve命令会启动一个开发服务器（基于webpack-dev-server）并附带开箱即用的模块热重载 （Hot-Module-Replacement）
    除了通过命令行参数，也可以使用vue.config.js里的devServer字段配置开发服务器，然而并没有找到这个文件。
## 3.vue-cli-service build
  用法：vue-cli-service build [options]  [entry | pattern]
  选项：
  - --mode， 指定环境模式，默认production
  - --dest， 指定输出目录，默认dist
  - --modern， 面向现代浏览器不带自动回退地构建应用
  - --target， app | lib | wc | wc-async 默认值app
  - --name， 库或Web Components模式下的名字 默认值packa.json中的name字段或入口文件名
  - --no-clean 在构建项目之前不清除目标目录
  - --report 生成report.html以帮助分析包内容
  - --report-json 生成report.json以帮助分析包内容
  - --watch 监听文件变化
    vue-cli-service build会在dist/目录产生一个可用于生产环境的包，带有JS/CSS/HTML的压缩，和为更好的缓存而做的自动vender chunk splitting。它的chunk manifest会内联在HTML里。
    这里还有一些有用的命令参数：
  - --modern使用现代模式构建应用，为现代浏览器角度原生支持的ES2015代码，并生成一个兼容老浏览器的包用来自动回退
  - --target 允许将项目中的任何组件以一个库或WebComponents组件的方式进行构建。
  - --report 和 --report-json 会根据构建统计生成报告，它会帮助分析包中包含的模块们的大小
## 4.vue-cli-service inspect
  用法： vue-cli-service inspect [options]  [...paths]
  选项： --mode 指定环境模式 默认值development
  可以使用 vue-cli-service inspect 来审查一个 Vue CLI项目的webpack config
## 5.查看所有的可用命令
  有些CLI插件会向vue-cli-service注入额外的命令。例如@vue/cli-plugin-eslint 会注入vue-cli-service lint命令。可以用以下命令查看所有注入的命令：
```txt
npx vue-cli-service help
```
  或者这样，学习每个命令的可用选项：npx vue-cli-service help [command]
## 6.缓存和并行处理
  cache-loader会默认为Vue/Babel/Typescript编译开启。文件会缓存在node_modules/.cache中——如果遇到编译方面的问题，可以试试删除缓存目录然后再试一下
  thread-loader 会在多核CPU的机器上为Babel/TypeScript转译开启
## 7.Git Hook
  在安装之后，@vue/cli-service也会安装yorkie，它会让人在package.json的gitHooks字段中方便地指定Git hook：
```json
{
    "gitHooks":{
        "pre-commit": "lint-staged"
    }
}
//yorkie fork 自husky且并不和之后的版本兼容
```
## 8.配置时无需Eject
  通过vue create 创建的项目无需额外的配置就已经可以跑起来了。插件的设计也是可以相互共存的，所以绝大多数情况下，我只需要在交互式命令提示中选取需要的功能即可。
# 四、浏览器兼容性
## 1.browserlist
  package.json文件里面有一个browserlist字段，指定项目里的目标浏览器的范围，这个值会被@babel/preset-env和Autoprefixer用来确定需要转译的JavaScript特性和需要添加的CSS浏览器前缀。
## 2.Polyfill
  一个默认的Vue CLI项目会使用@vue/babel-preset-app，它通过@babel/preset-env和browserlist配置来决定项目需要的polyfill。
  默认情况下，它会被useBuiltIns：'usage'传递给@babel/preset-env，这样它会根据源代码中出现的语言特性自动检测需要的polyfill，这确保了最终包里polyfill数量的最小化。然而，这也意味着如果其中一个依赖需要特殊的polyfill，默认情况下Babel无法将其检测出来。
  如果有依赖需要polyfill，有这样几种选择：
  1.如果该依赖基于一个目标环境不支持的ES版本撰写：将其添加到vue.config.js中的transpileDependencies选项，这会为依赖同时开启语法转换和根据情况检测polyfill
  2.如果该依赖交付了Es5代码并显式地列出了需要的polyfill：可以使用@vue/babel-preset-app的polyfill选项预包含所需要的polyfill。注意，es6.promise将被默认包含，因为现在的库依赖Promise是非常普遍的。
```typescript
//babel.config.js
module.exports={
    presets:[
        ['@vue/app', {
            polyfills:[
                'es6.promise',
                'es6.symbol'
            ]
        }]
    ]
}
//推荐以这种方式添加polyfill而不是在源代码中直接导入它们，因为如果这里列出的polyfill在browserlist的目标中并不需要，则它会被自动排除
```
  3.如果该依赖交付ES5代码，但使用了ES6+特性且没有显式地列出需要的polyfill（例如vuetify）：使用useBuiltIns：'entry'然后在入库哦文件添加import '@babel/polyfill'。这会根据browserlist目标导入所有polyfill，这样就不用再担心依赖的polyfill问题了，但是因为包含了一些没有用到的polyfill所以最终的包大小可能会增加。
## 3.现代模式






















