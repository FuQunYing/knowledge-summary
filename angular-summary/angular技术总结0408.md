#Day30-依赖注入（Dependency injection）模式
  依赖注入是一个重要的设计模式。它使用的非常广泛，简称DI，Angular有自己的依赖注入框架。
## 一、为啥要学依赖注入？
  先看下面的例子：
```typescript
	export class Car{
      public engine: Engine;
      public tires: Tires;
      public description = 'NO DI';
      constructor() {
        this.engine = new Engine();
        this.tires = new Tires();
      }
      // 使用engine 和 tires方法
      drive(){
        return `${this.description} car with ${this.engine.cylinders} cylinders and ${this.tires.make} tires`
      }
	}
```
  Car类在自己的构造函数中创建了它所需要的一切，但是这样做的话，Car类比较脆弱、不灵活而且难以测试。Car类需要一个engine 和 一些 tires，他没有去请求现成的实例，而是在构造函数中用具体的Engine和Tires类实例化自己的副本。
  如果Engine类升级了，它的构造函数要求传入一个参数，这个时候应该怎么办呢，这个Car类被破坏掉了，在把创建引擎的代码重写为this.engine = new Engine(theNew Parameter) 之前，他都是坏的。当第一次写Car类的时候，我并不关心Engine构造函数的参数，现在也不想关心。但是当Engine类的定义发生变化时，就得在乎一下了，Car类也不得不跟着改变。这就会让Car类变得过于脆弱。还有，如果我想在Car上使用不同品牌的轮胎呢，不行，我现在已经被锁定在Tires类创建时使用的那个品牌上。这让Car类缺乏弹性。
  现在每辆车都要自己的引擎。它不能和其它车辆共享引擎。虽然对于汽车这还能能够理解，但是设想一下那些应该被共享的依赖，比如说我车上用的车载无线电。这种车缺乏必要的弹性，无法共享当初给其它消费者创建的车载无线电。所以当需要给Car类写测试的时候，就会受制于它背后的依赖，是否能在测试环境中成功创建新的engine，Engine自己依赖什么，那些依赖本身又依赖什么，Engine的新实例是否会发起到服务器的异步调用。谁也不会想在测试的时候这么一层层的追问。现在就没法控制这辆车背后隐藏的依赖，当不能控制依赖时，类就会变得难以测试。。
  现在把Car的构造函数改造成使用DI的版本：
```typescript
public description = 'DI';;
constructor(public engine: Engine, public tires: Tires){}
```
  现在依赖的定义移到了构造函数中。Car类不再创建引擎engine或者轮胎tires，它仅仅“消费”它们。
  现在通过往构造函数中传入引擎和轮胎来创建一辆车。
```typescript
let car = new Car(new Engine(), new Tires())
```
  这样引擎和轮胎这两个依赖的定义与Car类本身就解耦了。此外，也可以传入任何类型的引擎或者轮胎，只要它们能满足引擎或轮胎的通用API需求。这样就算Engine类被扩展，也不回影响Car。
```typescript
  // 那Car的消费者也有这个问题，消费者必须修改创建这辆车的代码，就像这样：
  class Engine2 {
    constructor(public cylinders: number) { }
  }
  let bigCylinders = 12;
  let car = new Car(new Engine2(bigCylinders), new Tires());
  // 这里的要点是Car本身不必变化。然后解决消费者的问题。
```
  Car类非常容易测试，因为现在我对它的依赖是有控制权的，在每个测试期间，我都可以往构造函数中传入mock对象，做想让他们做的事：
```typescript
class MockEngine extends {cylinders = 8}
class MockTires  extends Tires  { make = 'YokoGoodStone'; }
let car = new Car(new MockEngine(), new MockTires());
```
  所以依赖注入就是一种编程模式，可以让类从外部源中获得它的依赖，而不必亲自创建它们。但是消费者怎么办，那些希望得到一个Car的人现在必须创建所有这三部分了：Car、Engine和Tires。Car类把它的快乐建立在了消费者的痛苦之上，需要某种机制给我把这三个部分装配好：
  那就来一个巨型的类来做这件事：
```typescript
import { Engine, Tires, Car } from './car';
// 现在这个模式就不咋好
export class CarFactory {
  createCar() {
    let car = new Car(this.createEngine(), this.createTires());
    car.description = 'Factory';
    return car;
  }
  createEngine() {
    return new Engine();
  }
  createTires() {
    return new Tires();
  }
}
```
  现在只需要三个创建方法，这还不算太坏，但是当应用规模变大之后，维护它就很难了，这个工厂类将变成由相互依赖的工厂方法构成的巨型蜘蛛网。如果能简单列出想建造的东西，而不用定义该把那些依赖注入到哪些对象就好了，依赖注入的的注入器就可以：
```typescript
let car = injector.get(car)//这样就ok啦
```
  Car 不需要知道如何创建 Engine 和 Tires。 消费者不需要知道如何创建 Car。 开发人员不需要维护巨大的工厂类。 Car 和消费者只要简单地请求想要什么，注入器就会交付它们。这就是“依赖注入框架”存在的原因。
	
	























