## WebSocket
##### API
###### 1.新建WebSocket实例
```javascript
var ws = new WebSocket('.......http地址')
```
##### 2.readyState-返回实例对象的当前状态
  - CONNECTING：值为0，表示正在连接
  - OPEN：值为1，表示连接成功，可以通信了
  - CLOSING：值为2，表示连接正在关闭
  - CLOSED：值为3，表示连接已经关闭，或者打开连接失败
    例如：
```javascript
switch (ws.readyState){
  case WebSocket.CONNECTING:
  	//干点啥
  	break;
  case WebSocket.OPEN:
  	//你看要干点啥
  	break;
  case WebSocket.CLOSING:
  	//....
  	break;
  case WebSocket.CLOSED:
  	//都关闭了还不干点啥
  	break;
  default:
  	//只有上面四种状态，所以没可能运行到这儿
  	break;
}
```
##### 3.webSocket.onopen-指定连接成功后的回调函数
```javascript
ws.onopen = function(e) {.....}
//或者想要指定多个回调函数的话：
ws.addEventListener('open', function(e){.....})
```
##### 4.webSocket.onclose-指定连接关闭后的回调函数
```javascript
ws.onclose = function(e) {....}
ws.addEventListener('close', function(e){
  var code = e.code;
  var reason = e.reason;
  var wasClean = e.wasClean;
  //处理关闭后的事件
})
```
##### 5.webSocket.onmessage-指定收到服务器数据后的回调函数
```javascript
ws.onmessage = function(e){....}
ws.addEventListener('message', function(e){
  var data = e.data;
  //拿到数据之后处理，但是服务器数据可能是文本也可能是二进制数据，所以可以进行一个判断
  if(typeof e.data === String) {....}
  if(e.data instanceof ArrayBuffer){....}
})
 //除了动态判断收到的数据类型，也可以使用binaryType属性来显式指定收到的二进制数据类型
  	//收到的是blob数据
  	ws.binaryType = 'blob';
  	ws.onmessage = function(e){....}
  	//收到的是ArrayBuffer数据
  	ws.binaryType = 'arraybuffer';
  	ws.onmessage = function (e){....}
```
##### 6.webSocket.send-用于向服务器发送数据
```javascript
//比如发送一个文本：
ws.send('随便写写点啥');
//或者发送一个blob对象
var file = document.querySelector('input[type="file"]').file[0]
ws.send(file);
//或者发送ArrayBuffer对象，比如一个canvas数据
var img = canvas_context.getImageData(0,0,200,200);
var binary = new Uint8Array(img.data.length);
for(var i = 0; i < img.data.length; i++){
  binary[i] = img.data[i]
}
ws.send(binary.buffer)
```
##### 7.webSocket.bufferedAmount-还有多少字节的二进制数据没有发送出去
```javascript
//这个可以用来判断发送是否结束
var data = new ArrayBuffer(100000000);
ws.send(data);
if(ws.bufferedAmount === 0) {
  //发送完毕
} else {
  //还没发完
}
```
##### 8.webSocket.onerror-指定报错时的回调函数
```javascript
ws.onerror = function(e) {....}
ws.addEventListener('error', function(e){....})
```

















