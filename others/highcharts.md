## highcharts 使用

### 一、安装 & 加载

#### 1.npm安装

> npm i highcharts --save

**注意：品智大师里面是在index.html里引入的highcharts文件**

#### 2.引入

##### 2.1 加载highcharts
```js
var Highcharts = require('highcharts');
// 在Highcharts 加载之后加载功能模块
require('highcharts/modules/exporting')(Highcharts);
//  创建图表
Highcharts.chart('这里是元素id',{
  // Highcharts 配置
})
```
##### 2.2 加载highstock & highmaps
```js
// highstock 完全包含highcharts，所以没必要将两个文件都引用，highmaps可以单独使用，也可以通过地图模块来引用
var Highcharts=require('highcharts/highstock');
// 加载地图模块
require('highcharts/modules/map')(Highcharts);
// 如果只需要highmaps功能，那么只需要引入highmap.js即可
var Highcharts=require('highcharts/highmap')
```

##### 2.3 import 语法
```js
import Highcharts from 'highcharts/highstock';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsDrilldown from 'highcharts/modules/drilldown';
import Highcharts3D from 'highcharts/highcharts-3d';

HighchartsMore(Highcharts)
HighchartsDrilldown(Highcharts);
Highcharts3D(Highcharts);
```

##### 2.4 Typescript
```ts
import * as Highcharts from 'highcharts';
// 加载 Highstock 或 Highmaps 方式类似
// import Highcharts from 'highcharts/highstock';

// 加载导出模块
import * as Exporting from 'highcharts/modules/exporting';
// 初始化导出模块
Exporting(Highcharts);
// 其它模块的加载方法同上
Highcharts.charts('元素id',{
  // 配置
})
```