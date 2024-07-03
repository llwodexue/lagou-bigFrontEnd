const decorators: ClassDecorator = (target: any) => {
  target.prototype.name = 'Tom'
}

@decorators
class Person {
  constructor() {}
}

const tim: any = new Person()
console.log(tim.name)

export {}
