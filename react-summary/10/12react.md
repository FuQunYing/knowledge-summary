# 一、核心
## 1.JSX
react核心，虚拟DOM
> 虚拟DOM

本质就是在JS和DOM之间做缓存

写一个react组件，一个JS文件，
引入所需组件、模块、服务等
创建所需常量&固定数据

class ComponentName extends Component() { 	//构造函数
	constructor(props) { 		super(props);
		this.state={
			//源数据
		} 	}
	//各种事件处理函数，需要更改源数据，则：
	this.setState({属性: 新的值})
	//最后，render出DOM元素 }

项目结构

建设组件

数据获取

组件交互

用户交互

react绑定事件，
onEventName={this.myEvent}
如果需要传值
onEventName={this.myEvent.bind(this, args)}
//虽然不知道为什么，但是直接加小括号的传值，就是报错 — 因为没有绑定到this