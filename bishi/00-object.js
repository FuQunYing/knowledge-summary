function fun1(name) {
    if(name) this.name = name;
}
function fun2(name) {
    this.name = name;
}
function fun3(name) {
    this.name = name || 'Jhon'
}
fun1.prototype.name = 'Tom';
fun2.prototype.name = 'Tom';
fun3.prototype.name = 'Tom';

console.log(
    new fun1().name,//new 未传值，没有经过赋值的那一步，所以属性中不存在name，就去问它爹要，它爹有name属性，其值为 Tom，所以输出Tom
    new fun2().name,//new 未传值，但是不管怎样，构造函数内进行了赋值，存在name属性，由于传入的参数无值，所以被赋值为undefined
    new fun3().name)//new 未传值，当没有参数传入时，构造函数内的name属性被赋值为 Jhon，所以输出Jhon。
