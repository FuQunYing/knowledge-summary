# Day 33
## 二十五、ArrayBuffer
### 1.ArrayBuffer对象
#### 1.1 概述
  ArrayBuffer对象代表储存二进制数据的一段内存，它不能直接读写，只能通过试图(TypedArray试图和DataView试图)来读写，试图的作用是以指定格式解读二进制数据。ArrayBuffer也是一个构造函数。可以分配一段可以存放数据的连续内存区域：
```javascript
const buf=new ArrayBBuffer(32)//这句代码生成了一段32字节的内容区域，每个字节的值默认都是0。可以看到，ArrayBuffer构造函数的参数是所需要的内存大小（单位字节）
```
  为了读写这段内容，需要为它指定试图，DataView试图的创建，需要提供ArrayBuffer对象实例作为参数：
```javascript
const buf=new ArrayBuffer(32)
const dataView=new DataView(buf)
dataView.getUint8(0)//0
//这段代码对一段32字节的内存，简历DataView试图，然后以不带符号的8位整数格式，从头读取8位二进制数据，结果得到0，因为原始内存的ArrayBuffer对象，默认所有位都是0
```
  另一种TypeArray试图，与DataView试图的一个区别是，它不是一个构造函数，而是一组构造函数，代表不同的数据格式：
```javascript
const buffer = new ArrayBuffer(12);
const x1 = new Int32Array(buffer);
x1[0] = 1;
const x2 = new Uint8Array(buffer);
x2[0]  = 2;
x1[0] // 2
//这段代码对同一段内存，分别建立两种试图：32位带符号整数和8位不带符号整数，由于两个视图对应的是同一段内存，一个视图修改底层内存，会影响到另一个视图
```
  TypedArray视图的构造函数，除了接受ArrayBuffer实例作为参数，还可以接受普通数组作为参数，直接分配内存生成底层的ArrayBuffer实例，并同时完成对这段内存的赋值：
```javascript
const typedArray=new Uint8Array([0,1,2])
typedArray.length//3
typedArray[0]=5
typedArray//[5,1,2]
//这里使用TypedArray视图的Uint8Array构造函数，新建一个不带符号的8位整数视图。可以看到Uint8Array直接使用普通函数组作为参数，对于底层内存的赋值同时完成
```
#### 1.2 ArrayBuffer.prototype.byteLength
  ArrayBuffer实例的byteLength属性，返回所分配的内存区域的字节长度:
```javascript
const buffer=new ArrayBuffer(32)
buffer.byteLength//32
```
  如果要分配的内存区域很大，很有可能分配失败（因为没有 那么多的连续空余内存），所以有必要检查是否分配成功：
```javascript
if(buffer.byteLength===n){
    //成功
} else {
    //失败
}
```
#### 1.3 ArrayBufffer.prototype.slice
  ArrayBuffer实例有一个slice方法，允许将内存区域的一部分，拷贝生成一个新的ArrayBuffer对象：
```javascript
const buffer=new ArrayBuffer(8)
const newBuffer=buffer.slice(0,3)
//这里拷贝buffer对象的前3个字节，生成一个新的ArrayBuffer对象。slice方法其实包含两步，第一步是先分配一段新内存，第二步是将原来那个ArrayBuffer对象拷贝过去
```
  slice方法接受两个参数，第一个参数表示拷贝开始的字节序号（含该字节），第二个参数表示拷贝截止的字节序号（不含该字节），如果省略 第二个参数，则默认到原ArrayBuffer结尾。
#### 1.4 ArrayBuffer.isView()
  isView是一个静态方法，返回一个布尔值，表示参数是否为ArrayBuffer的试图实例。这个方法大致相当于判断参数，是否为TypedArray实例或者DataView实例
```javascript
const buffer=new ArrayBuffer(8)
ArrayBuffer.isView(buffer)//false
const v=new Int32Array(buffer)
ArrayBuffer.isView(v)//true
```
### 2.TypedArray试图
#### 2.1 概述
  ArrayBuffer对象作为内存区域，可以存放多种类型的数据。同一段内存，不同数据有不同的姐夫方式，这就叫做 视图，ArrayBuffer有两种试图，一种是TypedArray试图，另一种是DataView视图，前者的数组成员都是同一个数据类型，后者的数组成员可以是不同的数据类型。
  目前，TypedArray视图一共包括9种类型，每一种视图都是一种构造函数：
  - Int8Array：8 位有符号整数，长度 1 个字节。
  - Uint8Array：8 位无符号整数，长度 1 个字节。
  - Uint8ClampedArray：8 位无符号整数，长度 1 个字节，溢出处理不同。
  - Int16Array：16 位有符号整数，长度 2 个字节。
  - Uint16Array：16 位无符号整数，长度 2 个字节。
  - Int32Array：32 位有符号整数，长度 4 个字节。
  - Uint32Array：32 位无符号整数，长度 4 个字节。
  - Float32Array：32 位浮点数，长度 4 个字节。
  - Float64Array：64 位浮点数，长度 8 个字节。
  这9个构造函数生成额数组，统称为TypedArray视图，它们很像普通数组，都有length属性，都能用方括号运算符获取单个元素，所有数组的方法，在它们上面都能使用，普通数组与TypedArray数组的差异主要在一下方面 ：
  - TypedArray 数组的所有成员，都是同一种类型。
  - TypedArray 数组的成员是连续的，不会有空位。
  - TypedArray 数组成员的默认值为 0。比如，new Array(10)返回一个普通数组，里面没有任何成员，只是 10 个空位；new Uint8Array(10)返回一个 TypedArray 数组，里面 10 个成员都是 0。
  - TypedArray 数组只是一层视图，本身不储存数据，它的数据都储存在底层的ArrayBuffer对象之中，要获取底层对象必须使用buffer属性。
#### 2.2 构造函数
  TypedArray数组提供9种构造函数，用来生成相应类型的数组实例。构造函数有多种用法
##### 2.2.1 TypedArray(buffer, byteOffset=0, length?)
  同一个ArrayBuffer对象之上，可以根据不同的数据类型，建立多个视图。
```javascript
// 创建一个8字节的ArrayBuffer
const b = new ArrayBuffer(8);
// 创建一个指向b的Int32视图，开始于字节0，直到缓冲区的末尾
const v1 = new Int32Array(b);
// 创建一个指向b的Uint8视图，开始于字节2，直到缓冲区的末尾
const v2 = new Uint8Array(b, 2);
// 创建一个指向b的Int16视图，开始于字节2，长度为2
const v3 = new Int16Array(b, 2, 2);
//这段代码在一段长度为8个字节的内存 b 之上，生成了三个试图：v1 v2 v3
```
  视图的构造函数可以接受三个参数：
  - 第一个参数（必须）：视图对应的底层ArrayBuffer对象
  - 第二个参数（可选）：视图开始的字节徐洪浩，默认从0开始
  - 第三个参数（可选）：视图包含的数据个数，默认直到本段内存区域结束
  因此，v1、v2和v3是重叠的：v1[0]是一个 32 位整数，指向字节 0 ～字节 3；v2[0]是一个 8 位无符号整数，指向字节 2；v3[0]是一个 16 位整数，指向字节 2 ～字节 3。只要任何一个视图对内存有所修改，就会在另外两个视图上反应出来。

注意，byteOffset必须与所要建立的数据类型一致，否则会报错。
```javascript
const buffer = new ArrayBuffer(8);
const i16 = new Int16Array(buffer, 1);
// Uncaught RangeError: start offset of Int16Array should be a multiple of 2
//这里，新生成一个 8 个字节的ArrayBuffer对象，然后在这个对象的第一个字节，建立带符号的 16 位整数视图，结果报错。因为，带符号的 16 位整数需要两个字节，所以byteOffset参数必须能够被 2 整除。
```
  如果想从任意字节开始解读ArrayBuffer对象，必须使用DataView视图，因为 TypedArray 视图只提供 9 种固定的解读格式。
##### 2.2.2 TypedArray(length)
  视图还可以不不通过ArrayBuffer对象，直接分配内存而生成：
```javascript
const f64a = new Float64Array(8);
f64a[0] = 10;
f64a[1] = 20;
f64a[2] = f64a[0] + f64a[1];
//这里生成一个 8 个成员的Float64Array数组（共 64 字节），然后依次对每个成员赋值。这时，视图构造函数的参数就是成员的个数。可以看到，视图数组的赋值操作与普通数组的操作毫无两样。
```
##### 2.2.3 TypedArray(typedArray)
  TypedArray数组的构造函数，可以接受另一个TypedArray实例作为参数：
```javascript
const typedArray = new Int8Array(new Uint8Array(4));
//Int8Array构造函数接受一个Uint8Array实例作为参数。
```
  注意，此时生成的新数组，只是复制了参数数组的值，对应的底层内存是不一样的。新数组会开辟一段新的内存储存数据，不会在原数组的内存之上建立视图。
```javascript
const x = new Int8Array([1, 1]);
const y = new Int8Array(x);
x[0] // 1
y[0] // 1

x[0] = 2;
y[0] // 1
//数组y是以数组x为模板而生成的，当x变动的时候，y并没有变动。
```
  如果想基于同一段内存，构造不同的视图，可以采用下面的写法。
```javascript
const x = new Int8Array([1, 1]);
const y = new Int8Array(x.buffer);
x[0] // 1
y[0] // 1

x[0] = 2;
y[0] // 2
```
##### 2.2.4 TypedArray(arrayLikeObject)
  构造函数的参数也可以是一个普通数组，然后直接生成TypedArray实例：
```javascript
const typedArray=new Uint8Array([1,2,3,4])
```
  注意，这时TypedArray视图会重新开辟内存，不会在原数组的内存上建立视图。上面代码从一个普通的数组，生成一个8位无符号整数的TypedArray实例。TypedArray数组也可以转换为普通数组：
```javascript
const normalArray = [...typedArray];
// or
const normalArray = Array.from(typedArray);
// or
const normalArray = Array.prototype.slice.call(typedArray);
```
#### 2.3 数组方法
  普通数组的操作方法和属性，对TypedArray数组完全适用
  - TypedArray.prototype.copyWithin(target, start[, end = this.length])
  - TypedArray.prototype.entries()
  - TypedArray.prototype.every(callbackfn, thisArg?)
  - TypedArray.prototype.fill(value, start=0, end=this.length)
  - TypedArray.prototype.filter(callbackfn, thisArg?)
  - TypedArray.prototype.find(predicate, thisArg?)
  - TypedArray.prototype.findIndex(predicate, thisArg?)
  - TypedArray.prototype.forEach(callbackfn, thisArg?)
  - TypedArray.prototype.indexOf(searchElement, fromIndex=0)
  - TypedArray.prototype.join(separator)
  - TypedArray.prototype.keys()
  - TypedArray.prototype.lastIndexOf(searchElement, fromIndex?)
  - TypedArray.prototype.map(callbackfn, thisArg?)
  - TypedArray.prototype.reduce(callbackfn, initialValue?)
  - TypedArray.prototype.reduceRight(callbackfn, initialValue?)
  - TypedArray.prototype.reverse()
  - TypedArray.prototype.slice(start=0, end=this.length)
  - TypedArray.prototype.some(callbackfn, thisArg?)
  - TypedArray.prototype.sort(comparefn)
  - TypedArray.prototype.toLocaleString(reserved1?, reserved2?)
  - TypedArray.prototype.toString()
  - TypedArray.prototype.values()
  注意，TypedArray 数组没有concat方法。如果想要合并多个 TypedArray 数组，可以用下面这个函数。
```javascript
function concatenate(resultConstructor, ...arrays) {
  let totalLength = 0;
  for (let arr of arrays) {
    totalLength += arr.length;
  }
  let result = new resultConstructor(totalLength);
  let offset = 0;
  for (let arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

concatenate(Uint8Array, Uint8Array.of(1, 2), Uint8Array.of(3, 4))
// Uint8Array [1, 2, 3, 4]
```
  另外，TypedArray 数组与普通数组一样，部署了 Iterator 接口，所以可以被遍历。
```javascript
let ui8 = Uint8Array.of(0, 1, 2);
for (let byte of ui8) {
  console.log(byte);
}
// 0
// 1
// 2
```
### 2.4 字节序
  字节序指的是数组在内存中的表达方式：
```javascript
const buffer=new ArrayBuffer(16)
const int32View=new Int32Array(buffer)
for (let i = 0; i < int32View.length; i++) {
  int32View[i] = i * 2;
}
//这段代码生成一个 16 字节的ArrayBuffer对象，然后在它的基础上，建立了一个 32 位整数的视图。由于每个 32 位整数占据 4 个字节，所以一共可以写入 4 个整数，依次为 0，2，4，6。
```
  如果在这段数据上接着建立一个 16 位整数的视图，则可以读出完全不一样的结果：
```javascript
const int16View = new Int16Array(buffer);

for (let i = 0; i < int16View.length; i++) {
  console.log("Entry " + i + ": " + int16View[i]);
}
// Entry 0: 0
// Entry 1: 0
// Entry 2: 2
// Entry 3: 0
// Entry 4: 4
// Entry 5: 0
// Entry 6: 6
// Entry 7: 0
```
  由于每个 16 位整数占据 2 个字节，所以整个ArrayBuffer对象现在分成 8 段。然后，由于 x86 体系的计算机都采用小端字节序（little endian），相对重要的字节排在后面的内存地址，相对不重要字节排在前面的内存地址，所以就得到了上面的结果。比如，一个占据四个字节的 16 进制数0x12345678，决定其大小的最重要的字节是“12”，最不重要的是“78”。小端字节序将最不重要的字节排在前面，储存顺序就是78563412；大端字节序则完全相反，将最重要的字节排在前面，储存顺序就是12345678。目前，所有个人电脑几乎都是小端字节序，所以 TypedArray 数组内部也采用小端字节序读写数据，或者更准确的说，按照本机操作系统设定的字节序读写数据。这并不意味大端字节序不重要，事实上，很多网络设备和特定的操作系统采用的是大端字节序。这就带来一个严重的问题：如果一段数据是大端字节序，TypedArray 数组将无法正确解析，因为它只能处理小端字节序！为了解决这个问题，JavaScript 引入DataView对象，可以设定字节序。
  一个栗子：
```javascript
// 假定某段buffer包含如下字节 [0x02, 0x01, 0x03, 0x07]
const buffer = new ArrayBuffer(4);
const v1 = new Uint8Array(buffer);
v1[0] = 2;
v1[1] = 1;
v1[2] = 3;
v1[3] = 7;

const uInt16View = new Uint16Array(buffer);

// 计算机采用小端字节序
// 所以头两个字节等于258
if (uInt16View[0] === 258) {
  console.log('OK'); // "OK"
}

// 赋值运算
uInt16View[0] = 255;    // 字节变为[0xFF, 0x00, 0x03, 0x07]
uInt16View[0] = 0xff05; // 字节变为[0x05, 0xFF, 0x03, 0x07]
uInt16View[1] = 0x0210; // 字节变为[0x05, 0xFF, 0x10, 0x02]
```
  下面的函数可以用来判断，当前视图是小端字节序，还是大端字节序：
```javascript
const BIG_ENDIAN = Symbol('BIG_ENDIAN');
const LITTLE_ENDIAN = Symbol('LITTLE_ENDIAN');

function getPlatformEndianness() {
  let arr32 = Uint32Array.of(0x12345678);
  let arr8 = new Uint8Array(arr32.buffer);
  switch ((arr8[0]*0x1000000) + (arr8[1]*0x10000) + (arr8[2]*0x100) + (arr8[3])) {
    case 0x12345678:
      return BIG_ENDIAN;
    case 0x78563412:
      return LITTLE_ENDIAN;
    default:
      throw new Error('Unknown endianness');
  }
}
```
  总之，与普通数组相比，TypedArray数组的最大有点就是可以直接操作内存，不需要数据类型转换，所以速度快得多。
#### 2.5 BYTES_PER_ELEMENT 属性
每一种视图的构造函数，都有一个BYTES_PER_ELEMENT属性，表示这种数据类型占据的字节数。
```javascript
Int8Array.BYTES_PER_ELEMENT // 1
Uint8Array.BYTES_PER_ELEMENT // 1
Int16Array.BYTES_PER_ELEMENT // 2
Uint16Array.BYTES_PER_ELEMENT // 2
Int32Array.BYTES_PER_ELEMENT // 4
Uint32Array.BYTES_PER_ELEMENT // 4
Float32Array.BYTES_PER_ELEMENT // 4
Float64Array.BYTES_PER_ELEMENT // 8
```
  这个属性在 TypedArray 实例上也能获取，即有TypedArray.prototype.BYTES_PER_ELEMENT。
#### 2.6 ArrayBuffer 与字符串的互相转换
  ArrayBuffer转为字符串，或者字符串转为ArrayBuffer，有一个前提，即字符串的编码方法是确定的。假定字符串采用UTF-16编码，可以自己编写转换函数：
```javascript
// ArrayBuffer 转为字符串，参数为 ArrayBuffer 对象
function ab2str(buf) {
  // 注意，如果是大型二进制数组，为了避免溢出，
  // 必须一个一个字符地转
  if (buf && buf.byteLength < 1024) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
  }
  const bufView = new Uint16Array(buf);
  const len =  bufView.length;
  const bstr = new Array(len);
  for (let i = 0; i < len; i++) {
    bstr[i] = String.fromCharCode.call(null, bufView[i]);
  }
  return bstr.join('');
}
// 字符串转为 ArrayBuffer 对象，参数为字符串
function str2ab(str) {
  const buf = new ArrayBuffer(str.length * 2); // 每个字符占用2个字节
  const bufView = new Uint16Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}
```
####  2.7 溢出
  不同的视图类型，所能容纳的数值范围是确定的。超出这个范围，就会出现溢出。比如，8位视图只能容纳一个8位的二进制值，如果放入一个9位的值，就会溢出。TypedArray数组的溢出处理规则，简单来说，就是抛弃溢出的位，然后按照视图类型进行解释：
```javascript
const uint8 = new Uint8Array(1);
uint8[0] = 256;
uint8[0] // 0
uint8[0] = -1;
uint8[0] // 255
//uint8是一个 8 位视图，而 256 的二进制形式是一个 9 位的值100000000，这时就会发生溢出。根据规则，只会保留后 8 位，即00000000。uint8视图的解释规则是无符号的 8 位整数，所以00000000就是0。

//负数在计算机内部采用“2 的补码”表示，也就是说，将对应的正数值进行否运算，然后加1。比如，-1对应的正值是1，进行否运算以后，得到11111110，再加上1就是补码形式11111111。uint8按照无符号的 8 位整数解释11111111，返回结果就是255。
```
  一个简单的表现规则，可以这样表示：
  - 正向溢出（overflow）：当输入值大于当前数据类型的最大值，结果等于当前数据类型的最小值加上余值，再减去 1。
  - 负向溢出（underflow）：当输入值小于当前数据类型的最小值，结果等于当前数据类型的最大值减去余值，再加上 1。
  上面的 余值 就是模运算的结果，即JavaScript里面的%运算符的结果：
```javascript
12 % 4 // 0
12 % 5 // 2
//12 除以 4 是没有余值的，而除以 5 会得到余值 2。
```
  栗子啊：
```javascript
const int8 = new Int8Array(1);

int8[0] = 128;
int8[0] // -128

int8[0] = -129;
int8[0] // 127
//int8是一个带符号的 8 位整数视图，它的最大值是 127，最小值是-128。输入值为128时，相当于正向溢出1，根据“最小值加上余值（128 除以 127 的余值是 1），再减去 1”的规则，就会返回-128；输入值为-129时，相当于负向溢出1，根据“最大值减去余值（-129 除以-128 的余值是 1），再加上 1”的规则，就会返回127。
```
  Uint8ClampedArray视图的溢出规则，与上面的规则不同。它规定，凡是发生正向溢出，该值一律等于当前数据类型的最大值，即 255；如果发生负向溢出，该值一律等于当前数据类型的最小值，即 0。
```javascript
const uint8c = new Uint8ClampedArray(1);

uint8c[0] = 256;
uint8c[0] // 255

uint8c[0] = -1;
uint8c[0] // 0
//uint8C是一个Uint8ClampedArray视图，正向溢出时都返回 255，负向溢出都返回 0。
```
#### 2.8 TypedArray.prototype.buffer
  TypedArray实例的buffer属性，返回整段内存区域对应的ArrayBuffer对象。该属性为只读属性：
```javascript
const a = new Float32Array(64);
const b = new Uint8Array(a.buffer);
//a视图对象和b视图对象，对应同一个ArrayBuffer对象，即同一段内存。
```
#### 2.9 TypedArray.prototype.byteLength，TypedArray.prototype.byteOffset
  byteLength属性返回 TypedArray 数组占据的内存长度，单位为字节。byteOffset属性返回 TypedArray 数组从底层ArrayBuffer对象的哪个字节开始。这两个属性都是只读属性。
```javascript
const b = new ArrayBuffer(8);

const v1 = new Int32Array(b);
const v2 = new Uint8Array(b, 2);
const v3 = new Int16Array(b, 2, 2);

v1.byteLength // 8
v2.byteLength // 6
v3.byteLength // 4

v1.byteOffset // 0
v2.byteOffset // 2
v3.byteOffset // 2
```
#### 2.10 TypedArray.prototype.length
  length属性表示 TypedArray 数组含有多少个成员。注意将byteLength属性和length属性区分，前者是字节长度，后者是成员长度。
```javascript
const a = new Int16Array(8);

a.length // 8
a.byteLength // 16
```
#### 2.11 TypedArray.prototype.set()
  TypedArray 数组的set方法用于复制数组（普通数组或 TypedArray 数组），也就是将一段内容完全复制到另一段内存。
```javascript
const a = new Uint8Array(8);
const b = new Uint8Array(8);

b.set(a);
//上面代码复制a数组的内容到b数组，它是整段内存的复制，比一个个拷贝成员的那种复制快得多。
```
set方法还可以接受第二个参数，表示从b对象的哪一个成员开始复制a对象。
```javascript
const a = new Uint16Array(8);
const b = new Uint16Array(10);

b.set(a, 2)
//上面代码的b数组比a数组多两个成员，所以从b[2]开始复制。
```
#### 2.12 TypedArray.prototype.subarray()
  subarray方法是对于 TypedArray 数组的一部分，再建立一个新的视图。
```javascript
const a = new Uint16Array(8);
const b = a.subarray(2,3);

a.byteLength // 16
b.byteLength // 2
```
  subarray方法的第一个参数是起始的成员序号，第二个参数是结束的成员序号（不含该成员），如果省略则包含剩余的全部成员。所以，上面代码的a.subarray(2,3)，意味着 b 只包含a[2]一个成员，字节长度为 2。
#### 2.13 TypedArray.prototype.slice() § ⇧
  TypeArray 实例的slice方法，可以返回一个指定位置的新的 TypedArray 实例。
```javascript
let ui8 = Uint8Array.of(0, 1, 2);
ui8.slice(-1)// Uint8Array [ 2 ]
//上面代码中，ui8是 8 位无符号整数数组视图的一个实例。它的slice方法可以从当前视图之中，返回一个新的视图实例。
```
  slice方法的参数，表示原数组的具体位置，开始生成新数组。负值表示逆向的位置，即-1 为倒数第一个位置，-2 表示倒数第二个位置，以此类推。
#### 2.14 TypedArray.of()
  TypedArray 数组的所有构造函数，都有一个静态方法of，用于将参数转为一个 TypedArray 实例。
```javascript
Float32Array.of(0.151, -8, 3.7)// Float32Array [ 0.151, -8, 3.7 ]
```
  下面三种方法都会生成同样一个 TypedArray 数组。
```javascript
// 方法一
let tarr = new Uint8Array([1,2,3]);

// 方法二
let tarr = Uint8Array.of(1,2,3);

// 方法三
let tarr = new Uint8Array(3);
tarr[0] = 1;
tarr[1] = 2;
tarr[2] = 3;
```
#### 2.15 TypedArray.from()
  静态方法from接受一个可遍历的数据结构（比如数组）作为参数，返回一个基于这个结构的 TypedArray 实例。
```javascript
Uint16Array.from([0, 1, 2])// Uint16Array [ 0, 1, 2 ]
```
  这个方法还可以将一种 TypedArray 实例，转为另一种。
```javascript
const ui16 = Uint16Array.from(Uint8Array.of(0, 1, 2));
ui16 instanceof Uint16Array // true
```
  from方法还可以接受一个函数，作为第二个参数，用来对每个元素进行遍历，功能类似map方法。
```javascript
Int8Array.of(127, 126, 125).map(x => 2 * x)
// Int8Array [ -2, -4, -6 ]

Int16Array.from(Int8Array.of(127, 126, 125), x => 2 * x)
// Int16Array [ 254, 252, 250 ]
```
  上面的例子中，from方法没有发生溢出，这说明遍历不是针对原来的 8 位整数数组。也就是说，from会将第一个参数指定的 TypedArray 数组，拷贝到另一段内存之中，处理之后再将结果转成指定的数组格式。
### 3.复合视图
  由于视图的构造函数可以指定起始位置和长度，所以在同一段内存之中，可以依次存放不同类型的数据，这叫做“复合视图”。
```javascript
const buffer = new ArrayBuffer(24);

const idView = new Uint32Array(buffer, 0, 1);
const usernameView = new Uint8Array(buffer, 4, 16);
const amountDueView = new Float32Array(buffer, 20, 1);
```
  上面代码将一个24字节长度的ArrayBuffer对象分成三个部分：
  - 字节 0 到字节 3：1 个 32 位无符号整数
  - 字节 4 到字节 19：16 个 8 位整数
  - 字节 20 到字节 23：1 个 32 位浮点数
  这种数据结构可以用如下的C语言描述：
```c
struct someStruct {
  unsigned long id;
  char username[16];
  float amountDue;
};
```
### 4.DataView视图
  如果一段数据包括多种类型（比如服务器传来的HTTP数据），这时除了建立ArrayBuffer对象的复合视图以外，还可以通过DataView视图进行操作。DatView视图提供更多操作选项，而且支持设定字节序。本来，在设计目的上，ArrayBuffer对象的各种 TypedArray 视图，是用来向网卡、声卡之类的本机设备传送数据，所以使用本机的字节序就可以了；而DataView视图的设计目的，是用来处理网络设备传来的数据，所以大端字节序或小端字节序是可以自行设定的。
  DataView视图本身也是构造函数，接受一个ArrayBuffer对象作为参数，生成视图。
```javascript
DataView(ArrayBuffer buffer [, 字节起始位置 [, 长度]]);
```
  一个栗子：
```javascript
const buffer = new ArrayBuffer(24);
const dv = new DataView(buffer);
```
  DataView实例有以下属性，含义与TypedArray实例的同名方法相同：
  - DataView.prototype.buffer：返回对应的 ArrayBuffer 对象
  - DataView.prototype.byteLength：返回占据的内存字节长度
  - DataView.prototype.byteOffset：返回当前视图从对应的 ArrayBuffer 对象的哪个字节开始
  DataView实例提供8个方法读取内存：
  - getInt8：读取 1 个字节，返回一个 8 位整数。
  - getUint8：读取 1 个字节，返回一个无符号的 8 位整数。
  - getInt16：读取 2 个字节，返回一个 16 位整数。
  - getUint16：读取 2 个字节，返回一个无符号的 16 位整数。
  - getInt32：读取 4 个字节，返回一个 32 位整数。
  - getUint32：读取 4 个字节，返回一个无符号的 32 位整数。
  - getFloat32：读取 4 个字节，返回一个 32 位浮点数。
  - getFloat64：读取 8 个字节，返回一个 64 位浮点数。
  这一系列get方法的参数都是一个字节序号（不能是负数，否则会报错），表示从哪个字节开始读取
```javascript
const buffer = new ArrayBuffer(24);
const dv = new DataView(buffer);

// 从第1个字节读取一个8位无符号整数
const v1 = dv.getUint8(0);

// 从第2个字节读取一个16位无符号整数
const v2 = dv.getUint16(1);

// 从第4个字节读取一个16位无符号整数
const v3 = dv.getUint16(3);
//这里读取了ArrayBuffer对象的前 5 个字节，其中有一个 8 位整数和两个十六位整数。
```
  如果一次读取两个或两个以上字节，就必须明确数据的存储方式，到底是小端字节序还是大端字节序。默认情况下，DataView的get方法使用大端字节序解读数据，如果需要使用小端字节序解读，必须在get方法的第二个参数指定true。
```javascript
// 小端字节序
const v1 = dv.getUint16(1, true);

// 大端字节序
const v2 = dv.getUint16(3, false);

// 大端字节序
const v3 = dv.getUint16(3);
```
  DataView视图提供8个方法写入内存：
  - setInt8：写入 1 个字节的 8 位整数。
  - setUint8：写入 1 个字节的 8 位无符号整数。
  - setInt16：写入 2 个字节的 16 位整数。
  - setUint16：写入 2 个字节的 16 位无符号整数。
  - setInt32：写入 4 个字节的 32 位整数。
  - setUint32：写入 4 个字节的 32 位无符号整数。
  - setFloat32：写入 4 个字节的 32 位浮点数。
  - setFloat64：写入 8 个字节的 64 位浮点数。
  这一系列set方法，接受两个参数，第一个参数是字节序号，表示从哪个字节开始写入，第二个参数为写入的数据。对于那些写入两个或两个以上字节的方法，需要指定第三个参数，false或者undefined表示使用大端字节序写入，true表示使用小端字节序写入。
```javascript
// 在第1个字节，以大端字节序写入值为25的32位整数
dv.setInt32(0, 25, false);

// 在第5个字节，以大端字节序写入值为25的32位整数
dv.setInt32(4, 25);

// 在第9个字节，以小端字节序写入值为2.5的32位浮点数
dv.setFloat32(8, 2.5, true);
```
  如果不确定正在使用的计算机的字节序，可以采用下面的判断方式。
```javascript
const littleEndian = (function() {
  const buffer = new ArrayBuffer(2);
  new DataView(buffer).setInt16(0, 256, true);
  return new Int16Array(buffer)[0] === 256;
})();
```
  如果返回true，就是小端字节序；如果返回false，就是大端字节序。
### 5.二进制数组的应用
#### 5.1 AJAX
  传统上，服务器通过 AJAX 操作只能返回文本数据，即responseType属性默认为text。XMLHttpRequest第二版XHR2允许服务器返回二进制数据，这时分成两种情况。如果明确知道返回的二进制数据类型，可以把返回类型（responseType）设为arraybuffer；如果不知道，就设为blob。
```javascript
let xhr = new XMLHttpRequest();
xhr.open('GET', someUrl);
xhr.responseType = 'arraybuffer';

xhr.onload = function () {
  let arrayBuffer = xhr.response;
  // ···
};

xhr.send();
```
  如果知道传回来的是 32 位整数，可以像下面这样处理。
```javascript
xhr.onreadystatechange = function () {
  if (req.readyState === 4 ) {
    const arrayResponse = xhr.response;
    const dataView = new DataView(arrayResponse);
    const ints = new Uint32Array(dataView.byteLength / 4);

    xhrDiv.style.backgroundColor = "#00FF00";
    xhrDiv.innerText = "Array is " + ints.length + "uints long";
  }
}
```
#### 5.2 Canvas
  网页Canvas元素输出的二进制像素数据，就是TypedArray数组：
```javascript
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const uint8ClampedArray = imageData.data;
```
  需要注意的是，上面代码的uint8ClampedArray虽然是一个 TypedArray 数组，但是它的视图类型是一种针对Canvas元素的专有类型Uint8ClampedArray。这个视图类型的特点，就是专门针对颜色，把每个字节解读为无符号的 8 位整数，即只能取值 0 ～ 255，而且发生运算的时候自动过滤高位溢出。这为图像处理带来了巨大的方便。
  举例来说，如果把像素的颜色值设为Uint8Array类型，那么乘以一个 gamma 值的时候，就必须这样计算：
```javascript
u8[i] = Math.min(255, Math.max(0, u8[i] * gamma));
```
  因为Uint8Array类型对于大于 255 的运算结果（比如0xFF+1），会自动变为0x00，所以图像处理必须要像上面这样算。这样做很麻烦，而且影响性能。如果将颜色值设为Uint8ClampedArray类型，计算就简化许多。
```javascript
pixels[i] *= gamma;
```
  Uint8ClampedArray类型确保将小于 0 的值设为 0，将大于 255 的值设为 255。注意，IE 10 不支持该类型。
#### 5.3 WebSocket
  WebSocket可以通过ArrayBuffer，发送或接收二进制数据：
```javascript
let socket = new WebSocket('ws://127.0.0.1:8081');
socket.binaryType = 'arraybuffer';

// 等待socket状态open
socket.addEventListener('open', function (event) {
  //发送二进制数据
  const typedArray = new Uint8Array(4);
  socket.send(typedArray.buffer);
});

//接收二进制数据
socket.addEventListener('message', function (event) {
  const arrayBuffer = event.data;
  // ···
});
```
#### 5.4 Fetch API
  Fetch API取回的数据，就是ArrayBuffer对象：
```javascript
fetch(url).then(function(response){
  return response.arrayBuffer()
}).then(function(arrayBuffer){
  // ...
});
```
#### 5.5 File API
  如果知道一个文件的二进制数据类型，也可以将这个文件读取为ArrayBuffer对象：
```javascript
const fileInput = document.getElementById('fileInput');
const file = fileInput.files[0];
const reader = new FileReader();
reader.readAsArrayBuffer(file);
reader.onload = function () {
  const arrayBuffer = reader.result;
  // ···
};
```
  以处理bmp文件为例，假定file变量是一个指向bmp文件的文件对象，首先读取文件：
```javascript
const reader = new FileReader();
reader.addEventListener("load", processimage, false);
reader.readAsArrayBuffer(file);
```
  然后，定义处理图像的回调函数：先在二进制数据之上建立一个DataView视图，再建立一个bitmap对象，用于存放处理后的数据，最后将图像展示在Canvas元素之中。
```javascript
function processimage(e) {
  const buffer = e.target.result;
  const datav = new DataView(buffer);
  const bitmap = {};
  // 具体的处理步骤
}
//具体处理图像数据时，先处理 bmp 的文件头
bitmap.fileheader = {};
bitmap.fileheader.bfType = datav.getUint16(0, true);
bitmap.fileheader.bfSize = datav.getUint32(2, true);
bitmap.fileheader.bfReserved1 = datav.getUint16(6, true);
bitmap.fileheader.bfReserved2 = datav.getUint16(8, true);
bitmap.fileheader.bfOffBits = datav.getUint32(10, true);
//接着处理图像元信息部分。
bitmap.infoheader = {};
bitmap.infoheader.biSize = datav.getUint32(14, true);
bitmap.infoheader.biWidth = datav.getUint32(18, true);
bitmap.infoheader.biHeight = datav.getUint32(22, true);
bitmap.infoheader.biPlanes = datav.getUint16(26, true);
bitmap.infoheader.biBitCount = datav.getUint16(28, true);
bitmap.infoheader.biCompression = datav.getUint32(30, true);
bitmap.infoheader.biSizeImage = datav.getUint32(34, true);
bitmap.infoheader.biXPelsPerMeter = datav.getUint32(38, true);
bitmap.infoheader.biYPelsPerMeter = datav.getUint32(42, true);
bitmap.infoheader.biClrUsed = datav.getUint32(46, true);
bitmap.infoheader.biClrImportant = datav.getUint32(50, true);
//最后处理图像本身的像素信息。
const start = bitmap.fileheader.bfOffBits;
bitmap.pixels = new Uint8Array(buffer, start);
//至此，图像文件的数据全部处理完成。下一步，可以根据需要，进行图像变形，或者转换格式，或者展示在Canvas网页元素之中。
```
### 6.SharedArrayBuffer
  JavaScript是单线程的，Web worker引入了多线程：主线程用来与用户互动，Worker线程用来承担计算任务。每个线程的数据都是隔离的，通过postMessage()通信。
  一个栗子：
```javascript
// 主线程
const w = new Worker('myworker.js');
//主线程新建了一个 Worker 线程。该线程与主线程之间会有一个通信渠道，主线程通过w.postMessage向 Worker 线程发消息，同时通过message事件监听 Worker 线程的回应。

// 主线程
w.postMessage('hi');
w.onmessage = function (ev) {
  console.log(ev.data);
}
//主线程先发一个消息hi，然后在监听到 Worker 线程的回应后，就将其打印出来。
```
  Worker 线程也是通过监听message事件，来获取主线程发来的消息，并作出反应。
```javascript
// Worker 线程
onmessage = function (ev) {
  console.log(ev.data);
  postMessage('ho');
}
```
  线程之间的数据交换可以是各种格式，不仅仅是字符串，也可以是二进制数据。这种交换采用的是复制机制，即一个进程将需要分享的数据复制一份，通过postMessage方法交给另一个进程。如果数据量比较大，这种通信的效率显然比较低。很容易想到，这时可以留出一块内存区域，由主线程与 Worker 线程共享，两方都可以读写，那么就会大大提高效率，协作起来也会比较简单（不像postMessage那么麻烦）。
  ES2017 引入SharedArrayBuffer，允许 Worker 线程与主线程共享同一块内存。SharedArrayBuffer的 API 与ArrayBuffer一模一样，唯一的区别是后者无法共享。
```javascript
// 主线程

// 新建 1KB 共享内存
const sharedBuffer = new SharedArrayBuffer(1024);

// 主线程将共享内存的地址发送出去
w.postMessage(sharedBuffer);

// 在共享内存上建立视图，供写入数据
const sharedArray = new Int32Array(sharedBuffer);
//postMessage方法的参数是SharedArrayBuffer对象。
```
  Worker 线程从事件的data属性上面取到数据。
```javascript
// Worker 线程
onmessage = function (ev) {
  // 主线程共享的数据，就是 1KB 的共享内存
  const sharedBuffer = ev.data;

  // 在共享内存上建立视图，方便读写
  const sharedArray = new Int32Array(sharedBuffer);

  // ...
};
```
  共享内存也可以在 Worker 线程创建，发给主线程。SharedArrayBuffer与ArrayBuffer一样，本身是无法读写的，必须在上面建立视图，然后通过视图读写。
```javascript
// 分配 10 万个 32 位整数占据的内存空间
const sab = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * 100000);

// 建立 32 位整数视图
const ia = new Int32Array(sab);  // ia.length == 100000

// 新建一个质数生成器
const primes = new PrimeGenerator();

// 将 10 万个质数，写入这段内存空间
for ( let i=0 ; i < ia.length ; i++ )
  ia[i] = primes.next();

// 向 Worker 线程发送这段共享内存
w.postMessage(ia);
```
  Worker 线程收到数据后的处理如下。
```javascript
// Worker 线程
let ia;
onmessage = function (ev) {
  ia = ev.data;
  console.log(ia.length); // 100000
  console.log(ia[37]); // 输出 163，因为这是第38个质数
};
```
### 7.Atomics 对象
  多线程共享内存，最大的问题就是如何防止两个线程同时修改某个地址，或者说，当一个线程修改共享内存以后，必须有一个机制让其他线程同步。SharedArrayBuffer API 提供Atomics对象，保证所有共享内存的操作都是“原子性”的，并且可以在所有线程内同步。
  那么问题来了，什么是原子性操作。现代编程语言中，一条普通的命令被编译器处理以后，会变成多条机器指令。如果是单线程运行，这是没有问题的；多线程环境并且共享内存时，就会出问题，因为这一组机器指令的运行期间，可能会插入其他线程的指令，从而导致运行结果出错。
  一个栗子：
```javascript
// 主线程
ia[42] = 314159;  // 原先的值 191
ia[37] = 123456;  // 原先的值 163

// Worker 线程
console.log(ia[37]);
console.log(ia[42]);
// 可能的结果
// 123456
// 191
//主线程的原始顺序是先对 42 号位置赋值，再对 37 号位置赋值。但是，编译器和 CPU 为了优化，可能会改变这两个操作的执行顺序（因为它们之间互不依赖），先对 37 号位置赋值，再对 42 号位置赋值。而执行到一半的时候，Worker 线程可能就会来读取数据，导致打印出123456和191。
```
  又一个栗子：
```javascript
// 主线程
const sab = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * 100000);
const ia = new Int32Array(sab);

for (let i = 0; i < ia.length; i++) {
  ia[i] = primes.next(); // 将质数放入 ia
}

// worker 线程
ia[112]++; // 错误
Atomics.add(ia, 112, 1); // 正确
//Worker 线程直接改写共享内存ia[112]++是不正确的。因为这行语句会被编译成多条机器指令，这些指令之间无法保证不会插入其他进程的指令。请设想如果两个线程同时ia[112]++，很可能它们得到的结果都是不正确的。
```
  Atomics对象就是为了解决这个问题而提出，它可以保证一个操作所对应的多条机器指令，一定是作为一个整体运行的，中间不会被打断。也就是说，它所涉及的操作都可以看作是原子性的单操作，这可以避免线程竞争，提高多线程共享内存时的操作安全。所以，ia[112]++要改写成Atomics.add(ia, 112, 1)。
  Atomics对象提供多种方法。
#### 7.1 Atomics.store()，Atomics.load()
  store()方法用来向共享内存写入数据，load()方法用来从共享内存读出数据。比起直接的读写操作，它们的好处是保证了读写操作的原子性。此外，它们还用来解决一个问题：多个线程使用共享内存的某个位置作为开关（flag），一旦该位置的值变了，就执行特定操作。这时，必须保证该位置的赋值操作，一定是在它前面的所有可能会改写内存的操作结束后执行；而该位置的取值操作，一定是在它后面所有可能会读取该位置的操作开始之前执行。store方法和load方法就能做到这一点，编译器不会为了优化，而打乱机器指令的执行顺序。
```javascript
Atomics.load(array, index)
Atomics.store(array, index, value)
```
  store方法接受三个参数：SharedBuffer 的视图、位置索引和值，返回sharedArray[index]的值。load方法只接受两个参数：SharedBuffer 的视图和位置索引，也是返回sharedArray[index]的值。
```javascript
// 主线程 main.js
ia[42] = 314159;  // 原先的值 191
Atomics.store(ia, 37, 123456);  // 原先的值是 163

// Worker 线程 worker.js
while (Atomics.load(ia, 37) == 163);
console.log(ia[37]);  // 123456
console.log(ia[42]);  // 314159
//主线程的Atomics.store向 42 号位置的赋值，一定是早于 37 位置的赋值。只要 37 号位置等于 163，Worker 线程就不会终止循环，而对 37 号位置和 42 号位置的取值，一定是在Atomics.load操作之后。
```
#### 7.2 Atomics.wait()，Atomics.wake()
  使用while循环等待主线程的通知，不是很高效，如果用在主线程，就会造成卡顿，Atomics对象提供了wait()和wake()两个方法用于等待通知。这两个方法相当于锁内存，即在一个线程进行操作时，让其他线程休眠（建立锁），等到操作结束，再唤醒那些休眠的线程（解除锁）。
```javascript
Atomics.wait(sharedArray, index, value, time)
```
  Atomics.wait用于当sharedArray[index]不等于value，就返回not-equal，否则就进入休眠，只有使用Atomics.wake()或者time毫秒以后才能唤醒。被Atomics.wake()唤醒时，返回ok，超时唤醒时返回timed-out。
```javascript
Atomics.wake(sharedArray, index, count)
```
  Atomics.wake用于唤醒count数目在sharedArray[index]位置休眠的线程，让它继续往下运行。
  一个栗子：
```javascript
// 线程一
console.log(ia[37]);  // 163
Atomics.store(ia, 37, 123456);
Atomics.wake(ia, 37, 1);

// 线程二
Atomics.wait(ia, 37, 163);
console.log(ia[37]);  // 123456
//，共享内存视图ia的第 37 号位置，原来的值是163。进程二使用Atomics.wait()方法，指定只要ia[37]等于163，就进入休眠状态。进程一使用Atomics.store()方法，将123456放入ia[37]，然后使用Atomics.wake()方法将监视ia[37]的休眠线程唤醒。
```
  另外，基于wait和wake这两个方法的锁内存实现，可以看 Lars T Hansen 的 js-lock-and-condition 这个库。注意，浏览器的主线程有权“拒绝”休眠，这是为了防止用户失去响应。
#### 7.3 运算方法
  共享内存上面的某些运算是不能被打断的，即不能在运算过程中，让其他线程改写内存上面的值。Atomics 对象提供了一些运算方法，防止数据被改写。
```javascript
Atomics.add(sharedArray, index, value)
```
  Atomics.add用于将value加到sharedArray[index]，返回sharedArray[index]旧的值。
```javascript
Atomics.sub(sharedArray, index, value)
```
  Atomics.sub用于将value从sharedArray[index]减去，返回sharedArray[index]旧的值。
```javascript
Atomics.and(sharedArray, index, value)
```
  Atomics.and用于将value与sharedArray[index]进行位运算and，放入sharedArray[index]，并返回旧的值。
```javascript
Atomics.or(sharedArray, index, value)
```
  Atomics.or用于将value与sharedArray[index]进行位运算or，放入sharedArray[index]，并返回旧的值。
```javascript
Atomics.xor(sharedArray, index, value)
```
  Atomic.xor用于将vaule与sharedArray[index]进行位运算xor，放入sharedArray[index]，并返回旧的值。
### 7.4 其它方法
  Atomics对象还有以下方法：
  - Atomics.compareExchange(sharedArray, index, oldval, newval)：如果sharedArray[index]等于oldval，就写入newval，返回oldval。
  - Atomics.exchange(sharedArray, index, value)：设置sharedArray[index]的值，返回旧的值。
  - Atomics.isLockFree(size)：返回一个布尔值，表示Atomics对象是否可以处理某个size的内存锁定。如果返回false，应用程序就需要自己来实现锁定。
  Atomics.compareExchange的一个用途是，从 SharedArrayBuffer 读取一个值，然后对该值进行某个操作，操作结束以后，检查一下 SharedArrayBuffer 里面原来那个值是否发生变化（即被其他线程改写过）。如果没有改写过，就将它写回原来的位置，否则读取新的值，再重头进行一次操作。







































