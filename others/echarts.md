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

##### 2.1 echartsInstance.group

> 图表的分组，用于联动

##### 2.2 echartsInstance.setOption(Function)
```text
(option: Object, notMerge?: boolean, lazyUpdate?: boolean)
or
(option: Object, opts?: Object)
```
> 设置图表实例的配置项以及数据，万能接口，所有参数和数据的修改都可以通过setOption完成，Echarts会合并新的参数和数据，然后刷新图表

```js
// 调用方式：
chart.setOption(option, notMerge, lazyUpdate);
// 或者
chart.setOption(option, {
    notMerge: ...,
    lazyUpdate: ...,
    silent: ...
});
```
- option 图表的配置项和数据，这个很重要，有详细手册
- notMerge 可选，是否不跟之前设置的option进行合并，默认为false，即合并
- lazyUpdate 可选，在设置完option后是否不立即更新图表，默认为false，即立即更新
- silent 可选，阻止调用setOption时抛出事件，默认为false，即抛出事件

##### 2.3 echartsInstance.getWidth

> 获取ECharts实例容器的宽度

```js
// 这是一个函数
() => number
```

##### 2.4 echartsInstance.getHeight

> 获取Echarts实例容器的高度

##### 2.5 echartsInstance.getDom

> 获取Echarts实例容器的dom节点
```js
() => HTMLCanvasElment | HTMLDivElement
```

##### 2.6 echartsInstance.getOption

> 获取当前实例中维护的option对象，返回的option对象中包含了用户多次setOption合并得到的配置项和数据，也记录了用户交互的状态，例如图例的开关，数据区域缩放选择的范围等等。所以从这份option可以恢复或者得到一个新的一模一样的实例。

```js
// 返回的option每个组件的属性值都统一是一个数组，不管setOption传进来的时候是单个组件的对象，还是多个组件的数据，如下形式：
{
  title:[{....}],
  legend:[{....}],
  grid:[{....}]
}
// 下面的这种写法不推荐：
var option = myChart.getOption();
option.visualMap[0].inRange.color = ...;
myChart.setOption(option);
// 因为getOption获取的是已经合并过默认值了的，所以在修改某些配置项后会导致原本是根据这些配置项值去设置的默认值失效，所以更推荐通过setOption去修改部分配置
myChart.setOption({
    visualMap: {
        inRange: {
            color: ...
        }
    }
})
```

##### 2.7 echartsInstance.resize

> 改变图表尺寸，在容器大小发生改变时，需要手动调用

```js
(opts?: {
    width?: number|string,
    height?: number|string,
    silent?: boolean
}) => ECharts
```
 - opts可以省略，选项如下：
 - width 可以显示指定实例宽度，单位为像素。如果传入值为null/undefined/'auto'，则表示自动取dom的宽度
 - height 高度
 - silent 是否禁止抛出事件，默认为false
 - tips：有时图表会放在多个标签页里，那些初始隐藏的标签在初始化图表的时候，因为获取不到容器的实际高宽，可能会绘制失败，所以在切换到该标签页时需要手动调用 resize 方法获取正确的高宽并且刷新画布，或者在 opts 中显示指定图表高宽。

##### 2.8 echartsInstance.dispatchAction

> (payload:Object)
> 触发图表行为，例如图例开关legendToggleSelect，数据区域缩放dataZoom，显示提示框showTip等等，payload参数可以通过batch属性同时触发多个行为，后面有action和events详细文档

```js
// 在Echarts2.x是通过myChart.component.tooltip.showTip这种形式调用相应的接口触发图表行为，入口很深，而且涉及到内部组件的组织。因此在Echarts3里统一改为dispatchAction
myChart.dispatchAction({
    type: 'dataZoom',
    start: 20,
    end: 30
});
// 可以通过 batch 参数批量分发多个 action
myChart.dispatchAction({
    type: 'dataZoom',
    batch: [{
        // 第一个 dataZoom 组件
        start: 20,
        end: 30
    }, {
        // 第二个 dataZoom 组件
        dataZoomIndex: 1,
        start: 10,
        end: 20
    }]
})
```

##### 2.9 echartsInstance.on

> 绑定事件处理函数
```js
(
    eventName: string,
    handler: Function,
    context?: Object
)
(
    eventName: string,
    query: string|Object,
    handler: Function,
    context?: Object
)
// ECharts 中的事件有两种，一种是鼠标事件，在鼠标点击某个图形上会触发，还有一种是 调用 dispatchAction 后触发的事件。每个 action 都会有对应的事件，如果事件是外部 dispatchAction 后触发，并且 action 中有 batch 属性触发批量的行为，则相应的响应事件参数里也会把属性都放在 batch 属性中。
```
**参数**
 - eventName，事件名称，全小写，例如'click','mousemove','legendselected'
 - query，可选的过滤条件，能够只在指定的组件或者元素上进行相应，可为string或者object
```js
// 如果为string表示组件类型，格式可以是'mainType'或者'mainType.subType'，例如：
chart.on('click','series',function() {....})
chart.on('click', 'series.line', function () {...});
chart.on('click', 'dataZoom', function () {...});
chart.on('click', 'xAxis.category', function () {...});
// 如果为object，可以包含以下一个或者多个属性，每个属性都是可选的
 {
  <mainType>Index: number // 组件 index
  <mainType>Name: string // 组件 name
  <mainType>Id: string // 组件 id
  dataIndex: number // 数据项 index
  name: string // 数据项 name
  dataType: string // 数据项 type，如关系图中的 'node', 'edge'
  element: string // 自定义系列中的 el 的 name
}
// 比如
chart.setOption({
  // ...
  series:[{
    name: 'xusong'
    // ....
  }]
})
chart.on('mouseover',{seriesName: 'xusong',function() {
  // series name 为 'xusong'的系列中的图形元素被'mouseover'时，此方法被回调
}})
// 再例如
chart.setOption({
      // ...
      series: [{
          type: 'graph',
          nodes: [{name: 'a', value: 10}, {name: 'b', value: 20}],
          edges: [{source: 0, target: 1}]
      }]
  });
  chart.on('click', {dataType: 'node'}, function () {
      // 关系图的节点被点击时此方法被回调。
  });
  chart.on('click', {dataType: 'edge'}, function () {
      // 关系图的边被点击时此方法被回调。
  });
//  。。。不例如了，在代码里试一下

```
 - handler，事件处理函数，格式为：(event: Object)
 - context，可选，回调函数内部的context，即this的指向

##### 2.10 echartsInstance.off

> 解绑事件处理函数 (eventName: string, handler?: Function)
 - eventName，事件名称
 - handler，可选，可以传入需要解绑的处理函数，不传的话解绑所有该类型的事件函数

##### 2.11 echartsInstance.convertToPixel

> 转换坐标系上的点到像素坐标值
```js
(
    // finder 用于指示『使用哪个坐标系进行转换』。
    // 通常地，可以使用 index 或者 id 或者 name 来定位。
    finder: {
        seriesIndex?: number,
        seriesId?: string,
        seriesName?: string,
        geoIndex?: number,
        geoId?: string,
        geoName?: string,
        xAxisIndex?: number,
        xAxisId?: string,
        xAxisName?: string,
        yAxisIndex?: number,
        yAxisId?: string,
        yAxisName?: string,
        gridIndex?: number,
        gridId?: string
        gridName?: string
    },
    // 要被转换的值。
    value: Array|string
    // 转换的结果为像素坐标值，以 echarts 实例的 dom 节点的左上角为坐标 [0, 0] 点。
) => Array|string
// 例如：在地理坐标系(geo)上，把某个点的经纬度坐标转换成像素坐标
// [128.3324, 89.5344] 表示 [经度，纬度]。
// 使用第一个 geo 坐标系进行转换：
chart.convertToPixel('geo', [128.3324, 89.5344]); // 参数 'geo' 等同于 {geoIndex: 0}
// 使用第二个 geo 坐标系进行转换：
chart.convertToPixel({geoIndex: 1}, [128.3324, 89.5344]);
// 使用 id 为 'bb' 的 geo 坐标系进行转换：
chart.convertToPixel({geoId: 'bb'}, [128.3324, 89.5344]);

// 再例如，在直角坐标系(cartesian,grid)上，把某个点的坐标转换成像素坐标
// [300, 900] 表示该点 x 轴上对应刻度值 300，y 轴上对应刻度值 900。
// 注意，一个 grid 可能含有多个 xAxis 和多个 yAxis，任何一对 xAxis-yAxis 形成一个 cartesian。
// 使用第三个 xAxis 和 id 为 'y1' 的 yAxis 形成的 cartesian 进行转换：
chart.convertToPixel({xAxisIndex: 2, yAxisId: 'y1'}, [300, 900]);
// 使用 id 为 'g1' 的 grid 的第一个 cartesian 进行转换：
chart.convertToPixel({gridId: 'g1'}, [300, 900]);

// 再再例如，把某个坐标轴的点转换成像素坐标
// id 为 'x0' 的 xAxis 的刻度 3000 位置所对应的横向像素位置：
chart.convertToPixel({xAxisId: 'x0'}, 3000); // 返回一个 number。
// 第二个 yAxis 的刻度 600 位置所对应的纵向像素位置：
chart.convertToPixel({yAxisIndex: 1}, 600); // 返回一个 number。

// 把关系图（graph）的点转换成像素坐标
// 因为每个 graph series 自己持有一个坐标系，所以我们直接在 finder 中指定 series：
chart.convertToPixel({seriesIndex: 0}, [2000, 3500]);
chart.convertToPixel({seriesId: 'k2'}, [100, 500]);

// 在某个系列所在的坐标系中，转换某点成像素坐标
// 使用第一个系列对应的坐标系：
chart.convertToPixel({seriesIndex: 0}, [128.3324, 89.5344]);
// 使用 id 为 'k2' 的系列所对应的坐标系：
chart.convertToPixel({seriesId: 'k2'}, [128.3324, 89.5344]);
```

##### 2.12 echartsInstance.convertFromPixel

> 转换像素坐标值到逻辑坐标系上的点，是convertToPixel的逆运算
```js
(
    // finder 用于指示『使用哪个坐标系进行转换』。
    // 通常地，可以使用 index 或者 id 或者 name 来定位。
    finder: {
        seriesIndex?: number,
        seriesId?: string,
        seriesName?: string,
        geoIndex?: number,
        geoId?: string,
        geoName?: string,
        xAxisIndex?: number,
        xAxisId?: string,
        xAxisName?: string,
        yAxisIndex?: number,
        yAxisId?: string,
        yAxisName?: string,
        gridIndex?: number,
        gridId?: string
        gridName?: string
    },
    // 要被转换的值，为像素坐标值，以 echarts 实例的 dom 节点的左上角为坐标 [0, 0] 点。
    value: Array|string
    // 转换的结果，为逻辑坐标值。
) => Array|string
```

##### 2.13 echartsInstance.containPixel

> 判断给定的点是否在指定的坐标系或者系列上，目前支持在这些坐标系和系列上进行判断：grid, polar, geo, series-map, series-graph, series-pie。

```js
(
    // finder 用于指示『在哪个坐标系或者系列上判断』。
    // 通常地，可以使用 index 或者 id 或者 name 来定位。
    finder: {
        seriesIndex?: number,
        seriesId?: string,
        seriesName?: string,
        geoIndex?: number,
        geoId?: string,
        geoName?: string,
        xAxisIndex?: number,
        xAxisId?: string,
        xAxisName?: string,
        yAxisIndex?: number,
        yAxisId?: string,
        yAxisName?: string,
        gridIndex?: number,
        gridId?: string
        gridName?: string
    },
    // 要被判断的点，为像素坐标值，以 echarts 实例的 dom 节点的左上角为坐标 [0, 0] 点。
    value: Array
) => boolean

// 例如：
// 判断 [23, 44] 点是否在 geoIndex 为 0 的 geo 坐标系上。
chart.containPixel('geo', [23, 44]); // 'geo' 等同于 {geoIndex: 0}
// 判断 [23, 44] 点是否在 gridId 为 'z' 的 grid 上。
chart.containPixel({gridId: 'z'}, [23, 44]);
// 判断 [23, 44] 点是否在 index 为 1，4，5 的系列上。
chart.containPixel({seriesIndex: [1, 4, 5]}, [23, 44]);
// 判断 [23, 44] 点是否在 index 为 1，4，5 的系列或者 gridName 为 'a' 的 grid 上。
chart.containPixel({seriesIndex: [1, 4, 5], gridName: 'a'}, [23, 44]);
```

##### 2.14 echartsInstance.showLoading

> 显示加载动画效果。可以在加载数据前手动调用该接口显示加载动画，在数据加载完成后，调用hideLoading隐藏加载动画 (type?: string, opts?: Object)

**参数**
 - type，可选，加载动画类型，目前只有default
 - opts，可选，加载动画配置项，跟type有关
```js
// 默认配置项
default: {
  text: 'loading',
  color: '#c23531',
  textColor: '#000',
  maskColor: 'rgba(255, 255, 255, 0.8)',
  zlevel: 0
}
```

##### 2.15 echartsInstance.hideLoading

> 隐藏加载动画

##### 2.16 echartsInstance.getDataURL

> 导出图表图片，返回一个base64 的 URL，可以设置为Image的src

```js
(opts: {
    // 导出的格式，可选 png, jpeg
    type?: string,
    // 导出的图片分辨率比例，默认为 1。
    pixelRatio?: number,
    // 导出的图片背景色，默认使用 option 里的 backgroundColor
    backgroundColor?: string,
    // 忽略组件的列表，例如要忽略 toolbox 就是 ['toolbox']
    excludeComponents?: Array.<string>
}) => string
// 例子：
var img = new Image();
img.src = myChart.getDataURL({
    pixelRatio: 2,
    backgroundColor: '#fff'
});
```

##### 2.17 echartsInstance.getConnectedDataURL

> 导出联动的图表图片，返回一个base64的url，可以设置image的src，导出图片中每个图片的相对位置跟容器的相对位置有关
```js
(opts: {
    // 导出的格式，可选 png, jpeg
    type?: string,
    // 导出的图片分辨率比例，默认为 1。
    pixelRatio?: number,
    // 导出的图片背景色，默认使用 option 里的 backgroundColor
    backgroundColor?: string,
    // 忽略组件的列表，例如要忽略 toolbox 就是 ['toolbox']
    excludeComponents?: Array.<string>
}) => string
```

##### 2.18 echartsInstance.appendData

> 此接口用于，在大数据量（百万以上）的渲染场景，分片加载数据和增量渲染。在大数据量的场景下（例如地理数的打点），就算数据使用二进制格式，也会有几十或上百兆，在互联网环境下，往往需要分片加载。appendData 接口提供了分片加载后增量渲染的能力，渲染新加入的数据块时不会清除原有已经渲染的部分。
```js
(opts: {
    // 要增加数据的系列序号。
    seriesIndex?: string,
    // 增加的数据。
    data?: Array|TypedArray,
}) => string
```
**注意**
 - 现在不支持 系列（series） 使用 dataset 同时使用 appendData，只支持系列使用自己的 series.data 时使用 appendData
 - 目前并非所有的图表都支持分片加载时的增量渲染。目前支持的图有：ECharts 基础版本的 散点图（scatter） 和 线图（lines）。ECharts GL 的 散点图（scatterGL）、线图（linesGL） 和 可视化建筑群（polygons3D）。

 ##### 2.19 echartsInstance.clear

 > 清空当前实例，会移除实例中所有的组件和图表。清空后调用 getOption 方法返回一个{}空对象。

 ##### 2.20 echartsInstance.isDisposed

 > 当前实例是否已经被释放

 ##### 2.21 echartsInstance.dispose

 > 销毁实例，销毁后实例无法再被使用