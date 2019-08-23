## 项目中遇到的一些坑：
```txt
	1. 支付宝不支持es6语法，箭头函数不要用！模板字符串不要用！let不要用！
	2. 支付宝缓存，get init的时候，支付宝可能做了缓存，在请求的地址后面加上随机数
	3. 在script里引入js文件也要加上随机数，避免缓存
```
### 利用正则规定input里面只能输入数字，一个小数点，保持小数点后两位
```txt
	<input type="text" onkeyup="clearNoNum(this)">
	function clearNoNum(obj){ 
		obj.value = obj.value.replace(/[^\d.]/g,"");  
			//清除“数字”和“.”以外的字符  
		obj.value = obj.value.replace(/\.{2,}/g,".");
	    	//只保留第一个. 清除多余的点点
		obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$","."); 
		obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
			//只能输入两个小数  
			if(obj.value.indexOf(".")< 0 && obj.value !=""){
				//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
				obj.value= parseFloat(obj.value); 
			} 
		} 
```
### 正则常用总结
	手机号码：(\+86|0086)?\s*1[34578]\d{9}//+86或0086整体可有可无，最多一次，空字符可有可无，数量不限

	身份证号：\d{15}(\d{2}[0-9Xx])？；//后三位整体可有可无，最多一次

	微信：(微|w(ei)?)\s*(信|x(in)?)

	abbb格式的匹配：([0-9])([0-9])\2{2}；//\2表示匹配第二个括号里面的，但是大括号里面为什么是2呢，匹配三位数不应该是3吗？？？？

  其它：
  
  - \+ 号代表前面的字符必须至少出现一次（1次或多次）
  -  \* 号代表字符可以不出现，也可以出现一次或者多次（0次、或1次、或多次）
  -  ? 问号代表前面的字符最多只可以出现一次（0次、或1次）

### Angular的小坑
  	图片用{{}}的时候在本地能解读出来,[]也能解读出来，但是放到正式环境的时候，只有[]能出来，还有那个背景图片的路径，在webstorm里面用相对路径的时候正常显示，但是在服务器只认assets目录
### 循环遇到的坑
	项目中的状况是，在上架商品的时候，通过查询拿到了两组对象数组，需要取出title相似但是gid不同的商品。进行双层循环完全不可取，外层长度是4，内层长度是8，所以最后总共循环了32次，最后铁定拿到好几项不同的数据，因为对比的顺序是不一定的。
	目前的解决代码是这样的：
```javascript
//先声明三个空数组，用来保存后面分别取出的对象
const sameTitle = [], sameTitleList = [], resultList = [];
  for (let j = 0; j < bandedGoods.length; j++) {
  //此条件用来判断title相似的对象，如果相似就把已绑定商品的title和gid取出来
    if (response.json().result.list[0].title
    			.indexOf(bandedGoods[j].title) !== -1) {
        sameTitle.push({
           'title': bandedGoods[j].title,
           'gid': bandedGoods[j].gid
         });
      }
   }
   //新起一个循环，只拿title和gid，这个列表返回的值就是相似的title了
   for ( let k = 0; k < response.json().result.list.length; k++) {
     sameTitleList.push({
        'title': response.json().result.list[k].title,
        'gid': response.json().result.list[k].gid
     });
    }
    //上面两个数组的结构已经完全相同了，现在就是要取出二者不同的对象
      //第一层循环，保存一个gid，并起一个真假的键
    for (let si = 0; si < sameTitleList.length; si++) {
      const g_id = sameTitleList[si].gid; let isExist = false;
      //第二层循环，取出gid
      for ( let li = 0; li < sameTitle.length; li++) {
         const lg_id = sameTitle[li].gid;
         if (g_id === lg_id) { // 如果二者相同，就把键改成真
           isExist = true;
           break;
         }
       }
       //当第二层循环结束的时候，如果isExist是真的，说明sameTitleList[si]是相同于sameTitle里的gid的，所以取反操作，拿到那个被排除出来的对象
       if (!isExist) {
          resultList.push(sameTitleList[si]);
       }
    }
```

## H5中的一些坑
```txt
  唱吧APP内，嵌入H5页面，在使用margin-top或者margin-bottom的负值来控制元素的上下定位时，在浏览器上不会有问题，但是嵌入进app内，在移动设备上，上下滑动时的卡顿非常明显。
  使用position的absolute定位时，如果是内部子元素定位，问题不大，但是整体的定位会使父元素高度不准确，ご注意。
```

## web中的坑

- 监听滚动，锚点自动定位

```text
IE6/7/8
	对于没有doctype声明的页面里可以使用document.body.scrollTop 来获取scrollTopgap高度
	对于有doctype声明的页面则可以使用document.documentElement.scrollTop
Safari
  Safari有自己获取scrollTop的函数：window.pageYOffset
Firefox/Chrome
  标准浏览器：document.documentElement.scrollTop

完整获取scrollTop值
  var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;

Safari的被放在中间，因为数字0和undefined进行 或 运算时，系统默认返回最后一个值。即或运算中 0 == undefined。
当页面滚动条刚好在最顶端，即scrollTop值为0时，IE下 Safari返回undefined，此时将Safari放在或运算最后时，scrollTop返回undefined，undefined在后面的运算会报错。。。。
```

## npm的坑

- 项目中安装依赖时报 tar ENOENT的问题

```text
大概是npm的版本问题，依次执行下面的命令（全局执行）：
 - sudo npm cache clean -f
 - sudo npm install -g n
 - sudo n stable
```

- 提示没有权限的问题（项目内执行，可能全局执行也可以）

```text
 - sudo chown -R $USER:$GROUP ~/.npm
 - sudo chown -R $USER:$GROUP ~/.config
```