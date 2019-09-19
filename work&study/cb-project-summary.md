### 1.万圣节  -- 11月1日万圣节

### 2.明启声乐 -- 11月下旬

### 3.会员日重构 -- 12月中旬

### 4.家族年度盛典 -- 12月下旬

### 5.包房五周年 -- 1月10号

### summary-项目采坑记

#### 关于wiki
> wiki作为一个项目的总体指示，一定要认真阅读➕理解，有不明确的地方，第一时间与需求方沟通，不然后期吃亏的一定是自己！
> 
> 但是中途肯定会有需求更改，一定叮嘱更改wiki，或者是很简单的改动，在提出来的当下就能改好，否则测试的时候按照wiki走，到底算哪一个！
> 
#### 关于项目创建
> 在wiki出来以后，就可以创建项目了，没有设计图，但是可以根据原型图搭建HTML的框架，嵌套，所需模态框等。想好页面的大致逻辑--虽然可能与设计图有出入
> 
> JS 中可以先把数据埋点添加进去，跟请求点击相关的后期再加----一定要确认wiki上有没有数据埋点的需求
#### 关于设计图
> 一般来说设计图已经完全遵循wiki了，但是展示与逻辑并不是二者并行的，所以当静态页完成以后，再次与wiki对比逻辑上的东西，一般不会与原型图有太大出入。
> 
> 设计图上的文案，最后几乎会被改掉80% /(ㄒoㄒ)/~~
> 
#### 关于业务代码
> 首先业务代码最重要的就是实现需求--优化先不考虑，一般情况下，也并没有特殊考虑过优化
> 
> 复用！复用！复用！张东老师说的好，程序猿你自己不心疼自己，没人心疼你。
> 
> 就CSS来说，一般设计图出来的时候，就可以提炼出可复用的样式--多用flex布局
> 
> JS中，之前有考虑过如果复用方法，但是好像是因为每个请求被赋值的data不同，所以每个请求都单独写了一遍，拿到请求的数据之后，赋值给需要的data。这个没有办法提炼出可复用的请求方法，但是为什么JS文件看上去比angular 的乱了很多。在NG中，所有的请求封装在一个service文件中，需要哪个引用哪个，而现在的H5页面都是独立性很强的项目，请求大多没有超过10个，但是一个请求一个方法，仍然很乱。ng强调功能与服务分离，但是vue显然没有这么做过
> 
> 考虑把所有的请求写进一个JS文件中，但是项目中可以单独引入promise吗(module中存在rxjs/toPromise)，现在的JS结构，又如何引入其它JS文件？在ng中，整个Service都是可注入的，export这个Service，那么它里面的方法就随时引入随时用，JS？？？一个个的导出吗

```javascript
// 比如 ????
export function request () {}
// 但是问题是现在的脚手架工具不支持引入js----一千多行的gulpfile.js，完全看不出来是在什么时候检测的，设置的什么规则
```
> 考虑曲线救国的方式----总结一个对象，对象中为每个请求方法，但是这个对象依旧没有地方放，data中不能放方法，方法中不能放对象。。。。
> 
> 封装方法无法使用promise，不同于ng的service可以直接在方法调用之后使用.then，不能不能！烦人。。。真的不想一个一个写
> 
> .then之后的数据处理是必须跟在post后面的，数据处理一并封装进去。。。あかんあかん。
> 
> 每个请求处理的数据与判断都不相同（可以考虑把相似的提炼为一个方法，把纯粹的被赋值的data作为参数传入）