#Day36
### 10.注入到派生类
  当编写一个继承自另一个组件的组件时，就要小心了，如果基础组件有依赖注入，必须要在派生类中重新提供和重新注入它们，并将它们通过构造函数传给基类，在现在这个例子里，SortedPeronsComponent继承自PersonsBaseComponent，显示一个被排序的人物列表。
  PersonsBaseComponent能自己独立运行工，它在自己的实例里要求PersonService,用来得到人物，并将他们按照数据库返回的顺序显示出来
  **sorted-person.component.ts**
```typescript
```