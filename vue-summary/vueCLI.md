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






















