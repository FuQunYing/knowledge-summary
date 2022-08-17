// 一
let obj = {
    name: 'Jhon',
    fun: function() {
        console.log(this.name);// 输出
    }
}
obj.fun();
// 二
let o = {
    a:1,
    b:{
        fun() {
            console.log(this.a);// 输出
        }
    }
}
o.b.fun();
// 三
function fun() {
    this.name = 'Tom'
}
var a = new fun();
console.log(a.name);// 输出
