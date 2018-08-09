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
  有了Babel可以兼顾所有最新的ES2015+语言特性，但也意味着需要交付转译呵呵polyfill后的包以支持旧的浏览器。这些转译后的包通常都比原生的ES2015+代码会更冗长，运行更慢，现如今绝大多数现代浏览器都已经支持了原生的ES2015，所以因为要支持更老的浏览器而为它们交付笨重的代码是一种浪费。
  VueCLI提供了一个现代模式解决这个问题，以如下命令为生产环境构建：
```txt
vue-cli-service build --modern
```
  Vue CLI 会产生两个应用的版本：一个现代版的包，面向支持ES modules的现代浏览器，另一个旧版的包，面向不支持的旧浏览器。这里没有特殊的部署要求，其生成的HTML文件会自动使用以下技术：
  - 现代版的包会通过<script type="module">在被支持的浏览器中加载；它们还会使用<link rel="moduleprelod">进行预加载
  - 旧版的包会通过<script nomodule>加载，并会被支持ES modules的浏览器忽略
  - 一个针对Safari10中的<script nomodule>的修复会被自动注入
    对于一个Hello World应用来说，现代版的包已经消了16%，在生产环境下，现代版的包通常都会表现出显著的解析速度和运算速度，从而改善应用的加载性能。
# 五、HTML和静态资源
## 1.HTML
### 1.1 Index文件
  public/index.html文件是一个会被html-webpack-plugin处理的模板。在构建过程中，资源链接会被自动注入。另外，Vue CLI也会自动注入resource hint、preload/prefetch、manifest和图标链接（当用到PWA插件时）以及构建过程中处理的JavaScript和CSS文件的资源链接。
### 1.2 插值
  因为index文件被用作模板，所以可以使用lodash template语法插入内容：
  - <%= VALUE %> 用来做不转义插值
  - <%- VALUE %> 用来做HTML转义插值
  - <% expression %> 用来描述JavaScript流程控制
    除了被html-webpack-plugin 暴露的默认值之外，所有客户端环境变量也可以直接使用。例如，BASE_URL的用法：
```html
<link rel="icon" href="<%= BASE_URL%>favicon.ico">
```
### 1.3 Preload
  <link rel="preload">是一种resource hint，用来指定页面加载后会很快被用到的资源，所以在页面加载的过程中，希望在浏览器开始主体渲染之前尽早preload。默认情况下，一个VueCLI应用会为所有初始化渲染需要的文件自动生成preload提示。这些提示会被@vue/preload-webpack-plugin注入，并且可以通过chainWebpack的config.plugin('preload')进行修改和删除。
### 1.4 Prefetch
  <link rel="prefetch">是一种resource hint，用来告诉浏览器在页面加载完成后，利用空闲时间提前获取用户未来可能会访问的内容。默认情况下，一个Vue CLI应用会为所有作为async chunk生成的JavaScript文件（通过动态import()按需code splitting的产物）自动生成prefetch提示。
  这些提示会被@vue/preload-webpack-plugin注入，并且可以通过chainWebpack的config.plugin('prefetch')进行修改和删除。
  示例：
```javascript
//vue.config.js
module.exports={
    chainWebpack: config=>{
        //移除prefetch插件
        config.plugins.delete('prefetch')
        //或者修改它的选项
        config.plugin('prefetch').tap(options=>{
            options.fileBlackList.push([/myasyncRoute(.)+?\.js$/])
            return options
        })
    }
}
//提示：Prefetch链接将会消耗带宽，如果我的应用很大且有很多async chunk，而用户主要使用的是对带宽比较敏感的移动端，那么可能就需要关掉prefetch链接
```
### 1.5 构建一个多页应用
  不是每个应用都需要时一个单页应用。Vue CLI支持使用vue.config.js中的pages选项构建一个多页面的应用。构建好的应用将会在不同的入口之间高效共享通用的chunk以获得最佳的加载性能。
## 2.处理静态资源
  静态资源可以通过两种方式进行处理：
  - 在JavaScript被导入或在template/CSS中通过相对路径被引用，这类引用会被webpack处理
  - 放置在public目录下或通过绝对路径被引用，这类资源将会直接被拷贝，而不会经过webpack的处理。
### 2.1 从相对路径导入
  当在JavaScript、CSS或\*.vue文件中使用相对路径（必须以.开头）引用一个静态资源时，该资源将会被包含进入webpack的依赖图中。在其编译过程中，所有诸如<img src="...">、background:url(...)和CSS@import的资源URL都会被解析为一个模块依赖。
  比如，url(./image.png) 会被转译成require('./image.png')
```html
<img src="./iamge.png">
```
  将会被编译到：
```css
h('img', {attr: {src: require('./image.png')}})
```
  在其内部，通过file-loader用版本哈希值和正确的公共基础路径来决定最终的文件路径，再用url-loader将小于10kb的资源内联，以减少HTTP请求的数量。
### 2.2 URL转换规则
  - 如果URL是一个绝对路径（例如/image/foo.png），它将会被保留不变
  - 如果URL是 . 开头的，它会作为一个相对模块请求被解释且基于我打的文件系统中的目录结构进行解析
  - 如果URL以~开头，其后的任何内容都会作为一个模块请求被解析。这意味着我甚至可以引用Node模块中的资源
```html
<img src="~/some-npm-package/foo.png">
```
  - 如果URL以@开头，它也会作为一个模块请求被解析，它的用处在于Vue CLI默认会设置一个指向<projectRoot>/src的别名@。
### 2.3 public文件夹
  任何放置在public文件夹的静态资源都会被简单的复制，而不经过webpack，需要通过绝对路径来引用它们。推荐将资源作为模块依赖图的一部分导入，这样它们会通过webpack的处理并获得如下好处：
  - 脚本和样式表会被压缩且打包在一起，从而避免额外的网络请求
  - 文件丢失会直接在编译时报错，而不是到了用户端才产生 404 错误。
  - 最终生成的文件名包含了内容哈希，因此不必担心浏览器会缓存它们的老版本
    public 目录提供的是一个应急手段，当你通过绝对路径引用它时，留意应用将会部署到哪里。如果你的应用没有部署在域名的根部，那么你需要为你的 URL 配置 baseUrl 前缀：
  - 在 public/index.html 或其它通过 html-webpack-plugin 用作模板的 HTML 文件中，你需要通过 <%= BASE_URL %> 设置链接前缀：
```html
<link rel="icon" href="<%= BASE_URL %>favicon.ico">
```
  - 在模板中，你首先需要向你的组件传入基础 URL：
```javascript
data () {
  return {
    baseUrl: process.env.BASE_URL
  }
}
```
  然后：
```html
<img :src="`${baseUrl}my-image.png`"
```
### 2.4 何时使用public文件夹
  - 需要在构建输出中指定一个文件的名字。
  - 有上千个图片，需要动态引用它们的路径。
  - 有些库可能和 webpack 不兼容，这时除了将其用一个独立的 <script> 标签引入没有别的选择。
# 六、配合CSS
  Vue CLI项目天生支持PostCSS、CSS Modules和包含Sass、Less、Stylus在内的预处理器
## 1.预处理器
  可以在创建项目的时候选择预处理器，如果当时没选好，内置的webpack仍然会被预配置为可以完成所有的处理。也可以手动安装相应的webpack loader：
```txt
//Sass
npm i -D sass-loader node-sass

//Less
npm i -D less-loader less

//Stylus
npm i -D stylus-loader stylus
```
  然后就可以导入相应的文件类型，或者在\*.vue文件中这样来使用:
```html
<style lang="scss">
$color=red;
</style>
```
## 2.PostCSS
  Vue CLI 内部使用了PostCSS。
  可以通过.postcssrc或任何postcss-load-config支持的配置源来配置PostCSS。也可以通过vue.config.js中的css.loaderOptions.postcss配置postcss-loader。
  默认开启了autoprefixer，如果要配置目标浏览器，可使用package.json的browserlist字段。
```txt
关于CSS中浏览器前缀规则的注意事项：
在生产环境构建中，Vue CLI会优化CSS并基于目标浏览器抛弃不必要的浏览器前缀规则，因为默认开启了autoprefixer，只使用无前缀的css规则即可
```
## 3.CSS Modules
  可以通过<style module>以开箱即用的方式在\*.vue文件中使用CSS Module
  如果想在JavaScript中作为CSS Module导入CSS或其它预处理文件，该文件应该以.module.(css|less|sass|scss|styl)结尾：
```javascript
import styles from './foo.module.css'
//所有支持的预处理器都一样工作
import sassStyles from './foo.module.scss'
```
  如果想去掉文件名中的.module，可以设置vue.config.js中的css.modules为true：
```javascript
//vue.config.js
module.exports={
    css:{module:true}
}
```
  如果希望自定义生成的CSSModules模块的类名，可以通过vue.config.js中的css.loaderOptions.css选项来实现。所有的css-loader选项在这里都是支持的，例如localIndentName和camelCase：
```javascript
//vue.config.js
module.exports={
    css:{
        loadersOptions:{
            css:{
                localIndentName:'[name]-[hash]',
                camelCase:'only'
            }
        }
    }
}
```
## 4.向预处理器Loader传递选项
  有的时候想要向webpack的预处理器loader传递选项，可以使用vue.config.js中的css.loaderOptions选项，比如可以这样向所有的Sass样式传入共享的全局变量：
```javascript
//vue.config.js
const fs=require('fs');
moddule.exports={
    css:{
        loaderOptions:{
            //给sass-loader传递选项
            sass:{
                //@/是src/的别名，所有这里假设我有'src/variables.scss'这个文件
                data:`import "@/variables.scss"`
            }
        }
    }
}
```
  Loader可以通过loaderOptions配置，包括：
  - css-loader
  - postcss-loader
  - sass-loader
  - less-loader
  - stylus-loader
    这样做比使用chainWebpack手动指定loader更推荐，因为这些选项需要应用在使用了相应loader的多个地方。
# 七、配合webpack
## 1.简单的配置方式
  调整webpack配置最简单的方式就是在vue.config.js中的configureWebpack选项提供一个对象：
```javascript
//vue.config.js
module.exports={
    configureWebpack:{
        plugins:[
            new MyAwesomeWebpackPlugin()
        ]
    }
}
  该对象会被webpack-merge合并入最终的webpack配置
//warning：
//有些webpack选项是基于vue.config.js中的值设置的，所以不能直接修改。拨入我应该修改vue.config.js中的outputDir选项而不是修改output.path；我应该修改vue.config.js中的baseUrl选项而不是修改output.pablicPath。这样做是因为vue.config.js中的值会被用在配置里的多个地方，以确保所有的部分都能正常工作在一起。
```
  如果需要基于环境有条件地配置行为，或者想要直接修改配置，那就换成一个函数（该函数会在环境变量被设置之后懒执行），该方法的第一个参数会收到已经解析好的配置。在函数内，可以直接修改配置，或者返回一个将会被合并的对象：
```javascript
//vue.config.js
module.exports={
    configureWebpack:config=>{
        if(process.env.NODE_ENV === 'production') {
            //为生产环境修改配置....
        } else {
            //为开发环境修改配置....
        }
    }
}
```
## 2.链式操作（高级）
  webpack内部的配置是通过webpack-chain维护的，这个库提供了一个webpack原始配置的上层抽象，使其可以定义具名的loader规则和具名插件，并有机会在后期进入这些规则并对它们的选项进行修改。它允许我们更细粒度的控制其内部的配置。
  下面看一些常见的在vue.config.js中的chainWebpack修改的例子：
  tips：如果打算链式访问特定的loader时，vue inspect会非常有帮助。
### 2.1 修改Loader选项
```javascript
//vue.config.js
module.exports={
    chainWebpack:config=>{
        config
          .rule('vue')
            .use('vue-loader')
              .loader('vue-loader')
                .tap(options => {
                    //修改它的选项
                    return options
                })
    }
}
//对于css相关的loader来说，推荐使用css.loaderOptions而不是直接链式指定loader。这是因为每种css文件类型都有多个规则，而css.loaderOptions可以确保我通过一个地方影响所有的规则。
```
### 2.2 添加一个新的Loader
```javascript
//vue.config.js
mmodule.expors={
    chainWebpack:config=>{
        //GraphQL Loader
        config.module
          .rule('graphql')
           .test(/\.graphql$/)
            .use('graphql-tag/loader')
              .loader('graphql-tag/loader')
               .end()
    }
}
```
### 2.3 替换一个规则里的Loader
  如果想要替换已有的基础loader，例如为内联的SVG文件使用vue-svg-loader而不是加载这个文件：
```javascript
//vue.config.js
module.exports={
    chainWebpack:config=>{
        const svgRule=config.module.rule('svg')
        //清除已有的所有loader，如果不这样做，接下来的loader会附加在该规则现有的loader之后
        svgRule.uses.clear()
        //添加要替换的loader
        svgRule
          .use('vue-svg-loader')
            .loader('vue-svg-loader')
    }
}
```
### 2.4 修改插件选项
```javascript
//vue.config.js
module.exports={
    chainWebpack:config=>{
        config
         .plugin('html')
         .tap(args => {
             return [/*传递给html-webpack-plugin's构造函数的新参数'*/]
         })
    }
}
```
  需要熟悉webpack-chain的API，并阅读一些源码以便了解如何最大程度利用好这个选项，但是比起直接修改webpack配置，它的表达能力更强，也更为安全。
  比方说想要将index.html默认的路径从/Users/username/proj/public/index.html改为/Users/username/proj/app/templates/index.html。通过参考html-webpack-plugin可以看到一个可以传入的选项列表，可以在下列配置中传入一个新的模块路径来改变它：
```javascript
//vue.config.js
module.exports={
    chainWebpack:config=>{
        config
         .plugin('html')
          .tap(args=>{
         args[0].template='/Users/username/proj/app/templates/index.html'
         return args
          })
    }
}
```
  可以通过接下来要讨论的工具vue inspect来确认变更。
## 3.审查项目的webpack配置
  因为@vue/cli-service对webpack配置进行了抽象，所以理解配置中包含的东西会比较困难，尤其是当我打算自行对其调整的时候。
  vue-cli-service暴露了inspect命令用于审查解析好的webpack配置。那个全局的vue可执行程序同样提供了inspect命令，这个命令只是简单的把vue-cli-service inspect代理到了我的项目中。该命令会将解析出来的webpack配置、包括链式访问的规则和插件的提示打印到stdout。
  可以将其输出重定向到一个文件以便进行查阅：
```txt
vue inspect > output.js
```
  注意它输出的并不是一个有效的webpack配置文件，而是一个用于审查的被序列化的格式。
  也可以通过指定一个路径来审查配置的一小部分：
```txt
#只审查第一条规则
vue inspect module.rules.0
```
  或者指向一个规则或插件的名字：
```txt
vue inspect --rule vue
vue inspect --plugin html
```
  最后可以列出所有规则和插件的名字：
```txt
vue inspect --rules
vue inspect --plugins
```
## 4.以一个文件的方式使用解析好的配置
  有些外部工具可能需要通过一个文件访问解析好的webpack配置，比如那些需要提供webpack配置路径的IDE或CLI，在这种情况下，可以使用如下路径：
```txt
<projectRoot>/node_modules/@vue/cli-service/webpack.config.js
```
  该文件会动态解析并输出vue-cli-service命令中使用的相同的webpack配置，包括那些来自插件甚至是我自定义的配置。

# 八、环境变量和模式
  可以替换项目根目录中的下列文件来指定环境变量：
```javascript
.env //在所有的环境中被载入
.env.local //在所有的环境中被载入，但会被git忽略
.env.[mode]//只在指定的模式中被载入
.env.[mode].local//只在指定的模式中被载入，但会被git忽略
```
  一个环境文件只包含环境变量的“键=值”对：
```txt
FOO=bar
VUE_APP_SECRET=secret
```
  被载入的变量将会对vue-cli-service的所有命令、插件和依赖可用。
  **环境加载属性**
```txt
	为一个特定模式准备的环境文件的（比如.env.production)将会比一般的环境文件（比如.env）拥有更高的优先级。
	此外，Vue CLI启动时已经存在的环境变量拥有最高优先级，并不会被.env文件覆盖，如果在环境中有默认的NODE_ENV，可能就需要考虑移除掉它
```
## 1.模式
  模式是Vue CLI项目中一个重要的概念。默认情况下，一个VueCLI项目有三个模式：
  - development模式用于vue-cli-service serve
  - production模式用于vue-cli-service build 和 vue-cli-service test:e2e
  - test模式用于vue-cli-service test:unit
    注意模式不同于NODE_ENV，一个模式可以包含多个环境变量。也就是说，每个模式都会将NODE_ENV的值设置为模式的名称——比如在development模式下NODE_ENV的值会被设置为development。
    我可以通过为.env文件增加后缀来设置某个模式下特有的环境变量。比如，如果我在项目根目录下创建一个名为.,env.development的文件，那么在这个文件里声明过的变量就只会在development模式下被载入。
    我可以通过传递--mode选项参数为命令行覆写默认的模式，例如，如果我想要在构建命令中使用开发环境变量，就在package.json脚本中加入：
```txt
"dev-build":"vue-cli-service build --mode development"
```
## 2.示例：Staging模式
  假设有一个应用包含以下.env文件：
```txt
VUE_APP_TITLE=My App
```
  和.env.staging文件：
```txt
NODE_ENV=production
VUE_APP_TITLE=My App(staging)
```
  - vue-cli-service build 会加载可能存在的.env、.env.production和.env.productionn.local文件然后构建出生产环境应用
  - vue-cli-service build --mode staging 会在staging模式下加载可能存在的.env、.env.staging和.env.staging.local文件然后构建出生产环境应用
    这两种情况下，根据NODE_ENV，构建出的应用都是生产环境应用，但是在staging版本中，process.env.VUE_APP_TITLE被覆写成了另一个值。
## 2.在客户端侧代码中使用环境变量：
  只有以VUE\_AP\P_开头的的变量会被webpack.DefinePlugin静态嵌入到客户端的包中，可以在应用的代码中这样访问：
```javascript
console.log(process.env.VUE_APP_SECRET)
```
  在构建过程中，process.env.VUE_APP_SECRET将会被相应的值所取代。在VUE_APP_SECRET = secret的情况下，它会被替换为"secret"
  除了VUE\_APP\_\*变量之外，在应用代码中始终可用的还有两个特殊的变量：
  - NODE_ENV - 会是 development、production或test中的一个，具体的值取决于应用运行的模式
  - BASE_URL - 会是vue.config.js中的baseUrl选项相符，即我的应用会部署到的基础路径
    所有解析出来的环境变量都可以在public/index.html中以HTML插值中介绍的方式使用
    **提示**
```txt
  可以在vue.config.js文件中计算环境变量，它们仍然需要以VUE_APP_前缀开头。这可以用用户版本信息process.en.VUE_APP_VERSION=require('./package.json').vversion
```
## 3.只在本地有效的变量
  有的时候可能有一些不应该提交到代码仓库中的变量，尤其是当项目托管在公共仓库时，这种情况下应该使用一个.env.local文件去二人呆滞，本地环境文件默认会被忽略，且出现在.gitignore中
  .local也可以加在指定模式的环境文件上，比如.env.development.local降温在development模式下被载入，且被git忽略。
# 九、构建目标
  当运行vue-cli-service build时，可以通过--target选项指定不同的构建目标。它允许我将相同源代码根据不同的用例生成不同的构建。
## 1.应用
  应用模式是默认的模式，在这个模式中：
  - index.html会带有注入的资源和resource hhint
  - 第三方库会被分到一个独立包以便更好的缓存
  - 小于10kb的静态资源会被内联在JavaScript中
  - public中的静态资源会被复制到输出目录中
## 2.库
  **注意对Vue的依赖**
```txt
在库模式中，Vue是外置的，这意味着包中不会有Vue，即使在代码中导入了Vue，如果这个库会通过一个打包器使用，它将尝试通过打包器以依赖的方式加载Vue；否则就会回退到一个全局的Vue变量
```
  可以通过下面的命令将一个单独的入口构建为一个库：
```txt
vue-cli-service build --target lib --name myLib [entry]
```
```txt
File                     Size                     Gzipped

dist/myLib.umd.min.js    13.28 kb                 8.42 kb
dist/myLib.umd.js        20.95 kb                 10.22 kb
dist/myLib.common.js     20.57 kb                 10.09 kb
dist/myLib.css           0.33 kb                  0.23 kb
```
  这个入口可以是一个.js或一个.vue文件，如果没有指定入口，则会使用src/App.vue
  构建一个库会输出：
  - dist/myLib.common.js:一个给打包器用的CommonJS包（然而，webpack目前还没有支持ES modules输出格式的包）
  - dist/myLib.umd.js:一个直接给浏览器或AMD loader使用的UMD包
  - dist/myLib.umd.min.js:压缩后的UMD构建版本
  - dist/myLid.css:提取出来的CSS文件（可以通过在vue.config.js中设置css:{extract:fallse}强制内联）
### 2.1 Vue vs.JS/ TS入口
  当使用一个.vue文件作为入口时，我的库会直接暴露这个Vue组件本身，因为组件始终是默认导出的内容。
  然而，当使用一个.js或.ts文件作为入口时，它可能会包含具名导出，所以库会暴露为有一个模块，也就是说我的库必须在UMD构建中通弄过window.yourLib.default访问，或在CommonJS构建中通过const myLib=require('muLib').default访问，如果没有任何具名导出并希望直接暴露默认导出，可以在vue.config.js中使用以下webpack配置：
```javascript
module.export={
    configureWebpack:{
        output:{
            libraryExport:'default'
        }
    }
}
```
## 3.Web Components组件
  **兼容性提示**
```txt
	WebComponents模式不支持IE11以及更低版本
```
  **注意对Vue的依赖**
```txt
	在Web Components模式中，Vue是外置的，这意味着包中不会有Vue，即使在代码中导入了Vue，这里的包会假设在页面中已经有一个可用的全局变量Vue
```
  可以通过下面的命令将一个单独的入口构建为一个WebComponents组件：
```txt
vue-cli-service build --target wc --name my-element [entry]
```
  注意这里的入口应该是\*.vue文件，VueCLI将会把这个组件自动包裹并注册为WebComponents组件，无需main.js里自行注册，也可以在开发时，把main.js作为demo app单独使用。
  该构建将会产生一个单独的JavaScript文件（及其压缩后的版本）将所有的东西都内联起来，当这个脚本被引入网页时，会注册自定义组件<my-element>，其使用@vue/web-component-wrapper包裹了目标的Vue 组件，这个包裹器会自动代理属性、特性、事件和插槽，
  **注意这个包依赖了在页面上全局可用的Vue**
  这个模式允许组件的使用者以普通的DOM元素的方式使用这个组件：
```html
<script src="https://unpkg.com/vue"></script>
<script src="path/to/my-element.js"></script>

<!-- 可在普通 HTML 中或者其它任何框架中使用 -->
<my-element></my-element>
```
### 3.1 注册多个WebComponents组件的包
  当构建一个WebComponents组件包的时候，也可以使用一个glob表达式作为入口指定多个组件目标：
```txt
vue-cli-service build --target wc --name foo 'src/components/*.vue'
```
  当构建多个web component时，--name将会哟用于设置前缀，同时自定义元素的名称会由组件的文件名推导得出，比如一个名为HelloWorld.vue的组件携带--name foo将会生成的自定义元素名为<foo-hello-world>
### 3.2 异步Web Components组件
  当指定多个Web Components组件作为目标时，这个包可能会变得非常大，并且用户可能只想使用我的包中注册的一部分组件，这时异步WebComponents模式会生成一个code-split的包，带一个只提供所有组件共享的运行时，并预先注册所有的自定义组件小入口文件。一个组件真正的实现只会在页面中用到自定义元素相应的一个实例时按需获取：
```txt
vue-cli-service build --target wc-async --name foo 'src/components/*.vue/'
```
```txt
File                Size                        Gzipped

dist/foo.0.min.js    12.80 kb                    8.09 kb
dist/foo.min.js      7.45 kb                     3.17 kb
dist/foo.1.min.js    2.91 kb                     1.02 kb
dist/foo.js          22.51 kb                    6.67 kb
dist/foo.0.js        17.27 kb                    8.83 kb
dist/foo.1.js        5.24 kb                     1.64 kb
```
  现在用户在该页面上只需要引入Vue和这个入口文件即可：
```html
<script src="https://unpkg.com/vue"></script>
<script src="path/to/foo.min.js"></script>

<!-- foo-one 的实现的 chunk 会在用到的时候自动获取 -->
<foo-one></foo-one>
```
# 十、部署
## 1.通用指南
  如果我用Vue CLI处理静态资源并和后端框架作为部署的一部分，那么需要的仅仅是确保Vue CLI生成的构建文件在正确的位置，并遵循后端框架的发布方式即可。如果我独立于后端部署前端应用——就是后端暴露一个前端可访问的API，然后前端实际上是纯静态应用，那么可以将dist目录里构建的内容部署到任何静态服务器中，但要确保正确的baseUrl
### 1.1 本地预览
  dist目录需要启动一个HTTP服务器来访问，所以以file://协议直接打开dist/index.html是不会工作的，在本地预览生产环境构建最简单的方式就是使用一个Node.js静态文件服务器，例如serve：
```sh
npm i -g serve
# -s 参数的意思是将其架设在Single-Page Application模式下
# 这个模式会处理即将提到的路由问题
serve -s dist
```
### 1.2 使用history.pushState的路由与
  如果我在history模式下使用Vue Router，是无法搭配简单的静态文件服务器的。例如，如果使用Vue Router为/todos/42/定义了一个路由，开发服务器已经配置了响应的localhost:3000/todos/42相应，但是一个为生产环境构建架设的简单的静态服务器却会返回404。
  为了解决这个问题，就需要配置生产环境服务器，将任何没有匹配到静态文件的请求回退到index.html。Vue Router的文档提供了常用服务器配置指引（看到Router再说）
### 1.3 CORS
  如果前端静态内容是部署在与后端API不同的域名上，需要适当地配置CORS（等待详情）
###  1.4 PWA
  如果使用了PWA插件，那么应用必须架设在HTTPS上，这样Service Worker才能被正确注册（等待详情 .too）
## 2.平台指南
### 2.1 GitHub Pages
  如果部署到https://<USERNAME>.github.io/ ，您可以省略BaseLL，因为它默认为“//”。
  如果部署到https://<USERNAME>.github.io/<REPO>/ ，（即仓库位置在https://github.com/<USERNAME>/<REPO>）， 就将baseUrl设置为"/<REPO>/"，比如，如果项目名字是"my-project"，那么vue.config.js应该这样配置：
```javascript
module.exports = {
  baseUrl: process.env.NODE_ENV === 'production'
    ? '/my-project/'
    : '/'
}
```
  在项目中，用以下内容创建deploy.sh（用未注释的突出显示的行）并运行它来部署：
```sh
#!/user/bin/env sh
# about on error
set -e
# build
npm run docs:build
# navigate into the build output directory
cd docs/.vuepress/dist
# 如果在部署自定义域， 输出 www.example.com' > CNAME
git init
git add -A
git commit -m 'deploy'
# 如果部署到https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 如果部署到https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages
cd -
```
  **提示：**还可以在CI安装程序中运行上面的脚本，以便在每次推送时启用自动部署。
### 2.2 Gitlab Pages
  就像GitlabPages 文档里面描述的，所有的事情都是从.gitlab-ci.yml 文件开始的，看下这个起步例子：
```yaml
# 将.gitlab-ci.yml文件放在存储库的根目录中
pages:# the job must be named pages
	iamge:node:latest
	stage:deploy
	script:
		- npm ci
		- npm run build
		- mv public public-vue # 公用文件夹上Gitlab Pages 钩子
		- mv dist public # 重命名dist 文件夹（npm run build的结果）
	artifacts:
		paths:
			- public # artifact路径必须是/public，让GitlabPages去选择
	only：
		- master
```
  

















