## 神策数据

- User Profile 用户配置
- track 跟踪
- properties 属性
- distinct_id "独特的"，对用户的标识
- referer 引用，引用页，推荐人，推荐页

### 接入前
- 用户标识及关联
- 确定待接入产品的关联方案（需求考察）
- 采集方案设计 - 埋点需求文档 - 业务侧产品经理在输出“产品需求文档”时，同步输出
- 结合场景设计事件


#### 基础知识

- 核心依据：使用**事件模型（Event模型）**来描述用户在产品上的各种行为
- 事件模型包括事件（Event）和用户（User）两个核心实体，同时配合物品（Item）实体可以做各种维度分析
- 神策分析提供了接口，上传和修改这两类相应的数据
- 有PV统计（加code就行）
```json
{
	"distinct_id": "2b0a6f51a3cd6775",
	"time": 1434556935000,
	"type": "track",
	"anonymous_id": "2b0a6f51a3cd6775",
	"event": "PageView",
	"properties": { 
		"$ip" : "180.79.35.65",
		"user_agent" : "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.）",
		"page_name" : "网站首页",
		"url" : "www.demo.com",
		"referer" : "www.referer.com"
	} 
}
```

#### Event实体

- Event描述了一个用户在某个时间点、某个地方，以某种方式完成了某个具体的事情，包含的关键因素：Who、When、Where、How、What

```json
$app_version：应用版本
$city： 城市
$manufacturer： 设备制造商，字符串类型，如"Apple"
$model： 设备型号，字符串类型，如"iphone6"
$os： 操作系统，字符串类型，如"iOS"
$os_version： 操作系统版本，字符串类型，如"8.1.1"
$screen_height： 屏幕高度，数字类型，如1920
$screen_width： 屏幕宽度，数字类型，如1080
$wifi： 是否 WIFI，BOOL类型，如true
// 根据需求添加或减少字段
// 比如我在京东点进去了一个商品详情页，用户就是我，时间点就是进入页面时的时间戳，地点就是当时我的手机定位，How：概念比较广，包括我使用了啥设备，使用了啥浏览器/App（版本），操作系统的版本，如果是在浏览器打开的，那进入的渠道是什么，跳过来的referer是啥....what就去描述我这个事件的具体内容了
```

#### 使用原则

- 梳理自己的数据使用需求，并据此做好Event的划分和字段设计
- 推荐后端记录Event：很多行为前端没有提供相应的功能，拿不到对应的数据；针对App来说，后端修改程序更加方便，APP端记录数据的话，每次修改都要等APp发版和用户更新；App 端收集数据会有丢失的风险，并且上传数据也不及时。App 端为了避免浪费用户的流量，一般情况下，都是将多条数据打包，并且等待网络状况良好以及应用处于前台时才压缩上传，因此，自然会造成上传数据不及时，很有可能某一天的数据会等待好几天才传到服务器端，这自然会导致每天的指标都计算有偏差。同时，由于 App 端可以缓存的内容有限，用户设备的网络连接等问题，App 端收集的数据目前也没有太好的手段保证 100% 不丢失。**所以，除非某个行为只在前端发生，对后端没有任何请求，否则，建议永远只在后端收集数据**
- 划分原则：为了节约使用成本，从需求触发，记录那些只会分析到的Event；Event数量不应过多，对于一个典型的用户产品，数量不超过20为宜；Event不局限于用户在App、Web界面等前端的操作和使用，一些电话投诉、线下接收服务、线下商家消费，如果能获取到相应数据，也可以作为相应的Event
- 字段设计原则：先根据需求梳理分析指标和维度，然后再倒推需要每个Event记录的字段；Cookie、后端返回内容之类的，没必要记录收集；尽量使用预置字段；某个Event字段设计一旦确定，则不要再修改它的类型和取值含义。

#### User实体

- 每个User对应一个真实用户，distinct_id进行标识，描述用户的长期属性；一般记录User Profile的场所，是用户进行注册、完善个人资料、修改个人资料等有限场合；应收集字段取决于产品形态及分析需求
- 字段记录在Profile还是Event：基本原则就是，Profile 记录的是用户特征的属性，例如：出生地、性别、注册地、首次广告来源类型等。而记录在 Event 的字段，记录的是事件发生时的特征，字段的取值具有场景性，例如 省份、城市 、设备型号、是否登录状态等。

#### Item实体

- Event-User模型中，被设计为不可变的，实际应用中是多变的，所以通过Item进行补充
- 典型场景是用作神策分析的维度表 - 详细需阅读高级功能部分的文档

### 数据格式

- 不同端的SDK不同，但是内部实现上都使用统一的数据格式。
- 一些既定的数据格式 - - 见文档

#### 数据整体格式
- track - 记录一个Event和关联的properties
- track_signup - ‘original_id’’

#### Profile相关操作
- profile_set - 设置一个用户的Profile，覆盖
- profile_set_once - 不覆盖
- profile_increment - 增减NUMBER类型的Profile值
- profile_delete - 删除一个用户整个的Profile
- profile_append - 添加一个或多个值，不去重
- profile_unset - 将某个用户的某些属性值设置为空

#### Item相关操作
- item_set - 直接设置一个item，覆盖
- item_delete - 删除整个item

### 属性数据类型

- js SDK 采集不到$app_version、$wifi、$carrier(运营商名称)、$network_type、$utm_matching_type(渠道追踪匹配模式)

### 导入数据的限制

#### 一般限制
- 变量名不能以数字开头，只包含大小写字母、数字、下划线和$
- 变量名不能与已经存在的虚拟事件、虚拟属性的变量名重复
- 系统要求变量名完全一致，包括大小写
- type字段的取值只能是上面说的那几个，大小写也要一致
- properties字段必须存在，值可以为空（{}）
- 事件time字段允许的范围是固定的
- 自定义的变量名避开保留的属性名

#### 事件时间限制
- 使用客户端SDK导入数据，服务端默认只接收事件发生时间在接收时间向前10天和未来向后1小时内的数据
- 使用后端语言SDK，默认2年内和向后1小时

#### 显示名的相关限制
- 方便管理，除了变量名，还有显示名
- 保证与属性名一一对应

#### 同名属性同类型
- 对Event属性，一个属性名，只能有一种类型
- Profile属性也是
- 对于一个属性名，在Event和Profile中可以具有不同的类型

#### 属性长度有限制

#### 属性数有上限
- 建议值300以内，硬上限2000

#### 保留字段 - 看文档


























