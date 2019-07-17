## Echarts使用

### 一、Angular项目内安装使用

#### 1.AngularJS

##### 安装
> npm i ng-echarts

##### 使用
```js
//app.module.js 引入
angular.module('ng-echarts',[]).....
//初始化
var ele = document.getElementById("id")
var myEchart = echarts.init(ele);
myEcharts.setOptions({.....})
```

#### 2.Angular

##### 安装
> npm i ngx-echarts

##### 使用
```js
//app.module.ts 引入
import {NgxEchartsModule} from 'ngx-echarts';
//html标签内标识
<div echarts [options]="echartOptions"></div>
//ts内根据数据更新 echartOptions即可，不需要执行setOptions
echartOptions = [{......}]
```

### 二、API

#### 1. echarts

> 全局echarts对象，在引入echarts.js文件后获取，或者是上面说的引入

##### 1.1 echarts.init

> 创建一个Echarts实例，参数如下

参数名 | 参数解释
- | -
dom | 实例容器
theme | 应用的主题
opts | 附加参数

**附加参数如下**

参数名 | 参数解释
- | -
devicePixelRatio | 设备像素比
renderer | 渲染器 ，canvas或者svg
width | 可显式指定实例宽度，单位为px
height | 显式指定高度

##### 1.2 echarts.connect

> 多个图表实例实现联动

**参数**
 - group  的id，或者图表实例的数组

**示例**

```js
// 分别设置每个实例的 group id
chart1.group = 'group1';
chart2.group = 'group1';
echarts.connect('group1');
// 或者可以直接传入需要联动的实例数组
echarts.connect([chart1, chart2]);
```

##### 1.3 echarts.disconnect

> 解除图表实例的联动，如果只需要移除单个实例，可以将通过该图表实例group设为空

> 参数：group 的 id

##### 1.4 echarts.dispose

> 销毁实例，实例销毁后无法再被使用

##### 1.5 echarts.getInstanceByDom

> 获取dom容器上的实例

##### 1.6 echarts.registerMap

> 注册可用的地图，必须在包括geo组件或者map图表类型的时候才能使用

##### 1.7 echarts.getMap

> 获取已注册的地图

##### 1.8 echarts.registerTheme

> 注册主题，用于初始化实例的时候指定

##### 1.9 echarts.graphic

> 图形相关帮助方法

- echarts.graphic.clipPointByRect

```js
// 输入一组点，和一个矩形，返回被矩形截取过的点
(
  // 要被截取的点列表，如[[23,24],[12,14],....]
  points: Array.<Array.<number>>
  // 用于截取点的矩形
  rect: {
    x: number,
    y: number,
    width: number,
    height: number
  }
) => Array.<Array.<number>>//截取结果
```
- echarts.graphic.clipRectByRect
```js
// 输入两个矩形，返回第二个矩形截取第一个矩形的结果
(
    // 要被截取的矩形。
    targetRect: {
        x: number,
        y: number,
        width: number,
        height: number
    },
    // 用于截取点的矩形。
    rect: {
        x: number,
        y: number,
        width: number,
        height: number
    }
) => { // 截取结果。
    x: number,
    y: number,
    width: number,
    height: number
}
// 如果矩形完全被截干净，返回undefined
```

#### 2. echartsInstance

> 通过echarts.init创建的实例

##### 




