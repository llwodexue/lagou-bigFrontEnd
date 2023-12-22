class Person {
  name: string
  age: number
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
  valueOf() {
    return this.age
  }
}

const p1 = new Person('bird', 32)
const p2 = new Person('kobe', 31)
console.log(p1 > p2)
