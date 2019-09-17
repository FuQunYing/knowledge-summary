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

- 获取当前的url：window.location.href

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

## Mac的坑

> 关于更改了app包内容以后，提示包已损坏

- 使用命令: sudo spctl --master-disable，打开允许任何来源，否则无法运行，提示文件损坏

> 关于terminal中用vi编辑时

- :w 保存文件但是不退出vi
- :w file 将修改另外保存到file中，不退出vi
- :w! 强制保存，不退出vi
- :wq 保存文件并退出vi
- :wq! 强制保存文件，并退出vi，但是对于一些readonly文件有时候并不好用，需要在进入vi之前，用sudo
- :q 不保存文件，退出vi
- :q! 不保存文件，强制退出vi
- :e! 放弃所有修改，从上次保存文件开始再编辑命令历史

> 文件命令

- 打开单个文件 vim file
- 同时打开多个文件 vim file1 file2 file3 。。。。
- 在vim窗口中打开一个新文件 :open file
- 在新窗口打开文件 :split file
- 切换到下一个文件 :bn
- 切换到上一个文件 :bp
- 查看当前打开的文件列表，当前正在编辑的文件会用[]括起来 :args
- 打开远程文件，比如ftp或者share folder :e ftp://192.168.10.76/test.txt

> vim 的模式

- 正常模式（按Esc或Ctrl+[进入），左下角显示文件名或为空
- 插入模式（按i键进入），左下角显示 --INSERT--
- 可视模式（按v键进入），左下角显示--VISUAL--

> 插入命令

- i 在当前位置前插入
- I 在当前行首插入
- a 在当前位置后插入
- A 在当前行尾插入
- o 在当前行之后插入一行
- O 在当前行之前插入一行

> 查找命令

- /text 查找text， 按n键查找下一个，按N键查找前一个
- ?text 查找text，反向查找，跟上面的方向相反

**一些特殊字符在查找时需要转义**

- :set ignorecase 忽略大小写的查找
- :set noignorecase 不忽略大小写的查找

**查找很长的词，输入麻烦，可以将光标移动到该词上，按\*或#键即可对该单词进行搜索，\*相当于/搜索，#相当于?搜索**

- :set hlserach 高亮搜索结果，所有结果都高亮显示，而不是只显示一个匹配
- :set nohlsearch 关闭高亮搜索显示
- :nohlsearch 关闭当前的高亮显示，如果再次搜索或者按下n或N键，则会再次高亮
- :set incsearch 逐步搜索模式，对当前键入的字符进行搜索而不必等待键入完成
- :set wrapscan 重新搜索，在搜索到文件头或尾时，返回继续搜索，默认开启

> 替换命令

- ra 将当前字符替换为a，当前字符即光标所在字符
- s/old/new/，用old替换new，替换当前行的第一个匹配
- s/old/new/g，用old替换new，替换当前行的所有匹配
- %s/old/new/ 用old替换new，替换所有行的第一个匹配
- %s/old/new/g 用old替换new，替换整个文件的所有匹配
- :10,20 s/^/ /g 在第10行知第20行每行前面加四个空格，用于缩进
- ddp 交换光标所在行和其下紧邻的一行

> 移动命令

- h 左移一个字符
- l 右移一个字符，这个命令很少用，一般用w代替
- k 上移一个字符
- j 下移一个字符

**这四个命令配合数字使用，比如20j就是向下移动20行，5h就是向左移动5个字符，在Vim中，很多命令都可以配合数字使用，比如删除10个字符10x，在当前位置后插入3个!,3a!\<ESc>，这里esc是必须的，否则命令不生效**

- w 向前移动一个单词（光标停在单词首部），如果已到行尾，则转至下一行行首，此命令快，可以代替l命令
- b 向后移动一个单词，2b就是向后移动2个单词
- e 同w，只不过光标停在单词尾部
- ge 同b，光标停在单词尾部
- ^ 移动到本行第一个非空白字符上
- 0（数字0）移动到本行第一个字符上
- <HOME> 移动到本行第一个字符，同0
- $ 移动到行尾 3$ 移动到下面3行的行尾
- gg 移动到文件头， = [[
- G（shift + g） 移动到文件尾， = ]]
- f（find）命令也可以用于移动，fx将找到光标后第一个为x的字符，3fd将找到第三个为d的字符
- F 同f，反向查找。

**跳到指定行，冒号+行号，回车，比如跳到240行就是:240，或者240G**

- Ctrl + e，向下滚动一行
- Ctrl + y，向上滚动一行
- Ctrl + d，向下滚动半屏
- Ctrl + u，向上滚动半屏
- Ctrl + f，向下滚动一屏
- Ctrl + b，向下滚动一屏

> 撤销和重做

- u 撤销（undo）
- U 撤销对整行的操作
- Ctrl + r，Redo，即撤销的撤销

> 删除命令

- x 删除当前字符
- 3x 删除当前光标开始向后三个字符
- X 删除当前字符的前一个字符。X=dh
- dl 删除当前字符， dl=x
- dh 删除前一个字符
- dd 删除当前行
- dj 删除上一行
- dk 删除下一行
- 10d 删除当前行开始的10行
- D 删除当前字符至行尾。D=d$
- d$ 删除当前字符之后的所有字符（本行）
- kdgg 删除当前行之前所有行（不包括当前行）
- jdG（jd shift + g） 删除当前行之后所有行（不包括当前行）
- :1,10d 删除1-10行
- :11,$d 删除11行及以后所有的行
- :1,$d 删除所有行
- J(shift + j)　　删除两行之间的空行，实际上是合并两行

> 拷贝和粘贴

- yy 拷贝当前行
- nyy 拷贝当前后开始的n行，比如2yy拷贝当前行及其下一行
- p 在当前光标后粘贴,如果之前使用了yy命令来复制一行，那么就在当前行的下一行粘贴
- shift+p 在当前行前粘贴
- :1,10 co 20 将1-10行插入到第20行之后
- :1,$ co $ 将整个文件复制一份并添加到文件尾部

**正常模式下按v（逐字）或V（逐行）进入可视模式，然后用jklh命令移动即可选择某些行或字符，再按y复制即可**

- ddp交换当前行和其下一行
- xp交换当前字符和其最后一个字符

> 剪切命令


**正常模式下按v（逐字）或V（逐行）进入可视模式，然后用jklh命令移动即可选择某些行或字符，再按d复制即可**

- ndd 剪切当前行之后的n行。利用p命令可以对剪切的内容进行粘贴
- :1,10d 将1-10行剪切。利用p命令可将剪切后的内容进行粘贴。
- :1, 10 m 20 将第1-10行移动到第20行之后。

### 