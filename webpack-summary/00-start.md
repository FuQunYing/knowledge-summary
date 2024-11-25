## 一、安装
### 1.本地安装

> 建议在项目内安装最新版本或指定版本

```javascript
npm install --save-dev webpack
npm install --save-dev webpack<version>
// 注意，项目内需要存在package.json，如果是个空项目，直接npm init创建package
```

### 2.全局安装

> 以下的NPM安装方式，将使webpack在全局环境下可用

```javascript
npm install --global webpack
// 但是不推荐全局安装，这会将项目中的webpack锁定到指定版本，并且在使用不同的webpack版本的项目中，可能会导致构建失败
```

## 二、起步

### 1.基本安装

> 首先创建一个目录，初始化npm，然后在本地安装webpack，接着安装webpack-cli（用于在命令行中运行webpack）

```javascript
mkdir webpack-demo && cd webpack-demo
npm init -y
npm install webpack webpack-cli --save-dev
// 后面会使用diff块，来显示对目录、文件和代码做的更改
```
[了解diff](diff.md)

> 然后创建目录、文件和内容 - webpack-demo
> 在此示例中，script标签之间存在隐式依赖关系，index.js文件执行之前，还依赖于页面中引入的lodash。之所以说是隐式的是因为index.js并未显示声明需要引入lodash，只是假定推测已经存在一个全局变量_

  使用这种方式去管理JavaScript项目会有一些问题：
  - 无法立即体现，脚本的执行依赖于外部扩展库
  - 如果依赖不存在，或者引入顺序错误，应用程序将无法正常运行
  - 如果依赖被引入但是并没有使用，浏览器将被迫下载无用代码
  所以需要使用webpack来管理脚本。

### 2.创建一个bubble文件

  首先调整一下目录结构，将“源”代码（/src）从分发代码（/dist）中分离出来(index.html移动到dist文件夹下)。
  源代码是用来书写和编辑的代码。分发代码是构建过程产生的代码最小化和优化后的输出目录，最终将在浏览器中加载。

  要在index.js中打包lodash依赖，需要在本地安装library：npm install --save lodash

> ps：在安装一个要打包到生产环境的安装包时，应该使用npm install --save，如果在安装一个用于开发环境的安装包，应该使用npm install --save-dev

  现在，在脚本中import lodash：
```javascript
import _ from 'lodash';
function componet() {
    var element = document.createElement('div');
    // Lodash(通过一个script脚本引入)，对于执行这一行是必需的
    element.innerHTML = _.join(['hello', 'webpack'], '');
    return element;
}
document.body.appendChild(componet())
```