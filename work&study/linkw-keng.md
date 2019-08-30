### 一、星云助手
#### 1.关于代码库

> assistant - 源代码位置，在此文件夹下进行更改业务代码

> ext_sources - 编译后的代码位置，存放编译代码和changelog，每周记得更新changelog

> assistant_pro - 客户端版本的代码位置，把最新的ext_sources代码pull下来，更新版本号，然后发布即可

### 二、品智大师


### 三、AngularJS的坑

#### 1.ng-option循环

> 在使用select的时候，ng-option循环出option的时候，循环出来的dom会在第一位出现一个

```html
<option value="?" selected></option>
<!--虽然不知道为什么但是搜到的解决方法是：-->
<select ng-model="testVariable" ng-init="testVariable=这里给个默认值就可以了"></select>
```
