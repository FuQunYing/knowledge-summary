## 项目中遇到的一些坑：
```txt
	1. 支付宝不支持es6语法，箭头函数不要用！模板字符串不要用！let不要用！
	2. 支付宝缓存，get init的时候，支付宝可能做了缓存，在请求的地址后面加上随机数
	3. 在script里引入js文件也要加上随机数，避免缓存
```
#### 利用正则规定input里面只能输入数字，一个小数点，保持小数点后两位
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
#### 正则常用总结
	手机号码：(\+86|0086)?\s*1[34578]\d{9}//+86或0086整体可有可无，最多一次，空字符可有可无，数量不限
	身份证号：\d{15}(\d{2}[0-9Xx])？；//后三位整体可有可无，最多一次
	微信：(微|w(ei)?)\s*(信|x(in)?)
	abbb格式的匹配：([0-9])([0-9])\2{2}；//\2表示匹配第二个括号里面的，但是大括号里面为什么是2呢，匹配三位数不应该是3吗？？？？