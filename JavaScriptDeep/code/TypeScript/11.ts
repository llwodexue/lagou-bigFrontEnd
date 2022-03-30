export {} // 确保跟其它示例没有成员冲突

/* class Person {
  name: string
  age: number
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
  sayHi(msg: string): void {
    console.log(`I am ${this.name}, ${msg}`)
  }
}
 */

/* class Person {
  public name: string
  private age: number
  protected readonly gender: boolean
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
    this.gender = true
  }
  sayHi(msg: string): void {
    console.log(`I am ${this.name}, ${msg}`)
    console.log(this.age)
  }
}
class Student extends Person {
  private constructor(name: string, age: number) {
    super(name, age)
    console.log(this.gender)
  }
  static create(name: string, age: number) {
    return new Student(name, age)
  }
}

const tom = new Person('tom', 18)
console.log(tom.name)
// console.log(tom.age)
// console.log(tom.gender)
// tom.gender = false
const jack = Student.create('jack', 18) */

/* interface Eat {
  eat (food: string): void
}
interface Run {
  run (distance: number): void
}

class Person implements Eat, Run {
  eat (food: string): void {
    console.log(`优雅的进餐: ${food}`)
  }
  run (distance: number) {
    console.log(`直立行走: ${distance}`)
  }
}
class Animal implements Eat, Run {
  eat (food: string): void {
    console.log(`呼噜呼噜的吃: ${food}`)
  }
  run (distance: number) {
    console.log(`爬行: ${distance}`)
  }
} */

abstract class Animal {
  eat(food: string): void {
    console.log(`呼噜呼噜的吃: ${food}`)
  }
  abstract run(distance: number): void
}

class Dog extends Animal {
  run(distance: number): void {
    console.log('四脚爬行', distance)
  }
}

const d = new Dog()
d.eat('嗯西马')
d.run(100)
