# 非常非常坑的this
**放在开头的强调，长记性，this的指向只有在函数被调用的时候才能确定，并不是我创建了一个函数就能知道它的this是谁，同一个函数，点点前的东东不一样，this就不一样！！**
## the first example：
```javascript
function a() {
  var name = '许嵩';
  console.log(this.name);//undefined
  console.log(this);//window
}
a();
//一句一句的说，在function a() 的时候，就是在window里面声明了一个叫a的函数，在a里面有个变量name，但是this指向的是调用a的那个东东，问题来了，a()这样进行的调用，怎么知道谁调的呢，window里面有很多方法，就像用alert的时候不会特地加上window.一样，在window里面声明过的函数直接调用就可以，这样就可以理解了，其实a()就相当于window.a()，那this就是指向.前的那个东东，就是window了对不对。window里面 有name吗，并没有，所以自然是undefined，打印this也只会把window打印出来，展开看看特别多的方法。
```
## the second example
```javascript
var o = {
  name: '许嵩',
  fun: function() {
    console.log(this.name);//许嵩
  }
}
o.fun();
//这个就很好理解了，点点前是o啊，o里面有name属性，就直接打印了呗。
```
## the third example
```javascript
var o = {
  name: '许嵩',
  fun: function() {
    console.log(this.name);//许嵩
  }
}
window.o.fun();
//那么问题来了，如果this最后指向的是最终调用它的那个对象，那这里的this最后也是应该指向window的啊，先看下面的代码
```
```javascript
var o = {
  a:1,
  b:{
    a:2,
    fun() {
      console.log(this.a)//2
    }
  }
}
o.b.fun();
//这里同样是对象o点点出来的，但是this也没有执行它，所以刚刚那个this指向的结论就可以更新一下了：第一，如果一个函数中有this，但是它没有被上一级的对象所调用，那么this指向的就是window（严格模式不考虑先）；第二，如果一个函数中有this，这个函数有被上一级对象所调用，那么this指向的就是上一级对象；第三，如果一个函数中有this，这个函数中包含多个对象，尽管这个函数是被最外层的对象所调用，但是this指向的也只是它上一级的对象，往下看
```
```javascript
var o = {
  a: 1,
  b: {
    //a:2,
    fun() {
      console.log(this.a)//undefined
    }
  }
}
o.b.fun();
//尽管对象中没有属性a，这个this也是指向b，因为this只会指向它的上一级对象，不管这个对象中有没有this要的东西。
```
## the fourth example
**特殊情况：**
```javascript
var o = {
  a:1,
  b:{
    a:2,
    fun(){
      console.log(this.a);//undefined
      console.log(this);//window
    }
  }
}
var j = o.b.fun;
j();
//就问你懵逼不懵逼，这里this又指向了window，每句话都不要忽略啊，说了this永远指向的是最后调用它的对象，也就是看它执行的时候是被谁调用的。虽然这个例子里面，函数fun是被b所引用的，但是将fun赋值给变量j的时候并没有执行它，当执行它的时候已经是window在调用了，三third example里面，fun直接就被调用了。
```
# 更坑的构造函数的this
```javascript
function fun() {
  this.name = '许嵩'
}
var a = new fun();
console.log(a.name);//许嵩
//这里对象a可以点点出函数fun里面的name，因为new关键字可以改变this的指向，将这个this指向对象a，是的，a是一个对象。想想new做了什么事，第一，new创建一个新的对象；第二，自动让新的子对象继承构造函数的原型对象；第三，调用构造函数，向新的空对象强行添加新成员；第四，将新的对象地址返回给变量保存。在这里用变量a创建了一个fun的实例，就是相当于复制到了一份fun到对象a里面，此时仅仅是创建，并没有执行，而调用这个函数fun的是对象a，
```



















