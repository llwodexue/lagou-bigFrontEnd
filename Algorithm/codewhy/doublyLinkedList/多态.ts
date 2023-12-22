// 多态是面向对象编程中的一个重要概念，它允许使用不同类型的对象来调用相同的方法或函数，并根据对象的实际类型动态地执行适当的行为。在 TypeScript 中，多态可以通过继承和方法重写来实现。

class Animal {
  name: string
  constructor(name: string) {
    this.name = name
  }
  makeSound(): void {
    console.log('Animal is making a sound')
  }
}

class Cat extends Animal {
  makeSound(): void {
    console.log('Meow!')
  }
}

class Dog extends Animal {
  makeSound(): void {
    console.log('Woof!')
  }
}

function animalMakeSound(animal: Animal): void {
  animal.makeSound()
}

const cat = new Cat('Kitty')
const dog = new Dog('Buddy')

animalMakeSound(cat) // 输出：Meow!
animalMakeSound(dog) // 输出：Woof!
