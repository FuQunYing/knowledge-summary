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

console.log(new fun1().name, new fun2().name, new fun3().name)
// TOM , undefined, Jhon
