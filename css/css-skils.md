### 1.css修改滚动条样式

- ::-webkit-scrollbar 滚动条整体部分，可以设置宽度啥的
- ::-webkit-scrollbar-button 滚动条两端的按钮
- ::-webkit-scrollbar-track  外层轨道
- ::-webkit-scrollbar-track-piece  内层滚动槽
- ::-webkit-scrollbar-thumb 滚动的滑块
- ::-webkit-scrollbar-corner 边角
- ::-webkit-resizer 定义右下角拖动块的样式

### 2.css常用垂直居中

> 使用定位+transform

```css
{
	position:absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%,-50%)
}
```

> 知道父元素宽高

```css
{
	text-align: center;
	line-height: parant.height;
}
```

> flex 垂直居中

```css
{
	display:flex;
	justify-content:center;
	align-items:center;
}
/*或者在子元素上用*/
.parent{
	display:flex;
	justify-content:center;
}
.child{
	align-self:center;
}
```

### 
