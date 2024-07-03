const doc: ParameterDecorator = (target, key, index) => {
  console.log(target, key, index)
}

class Person {
  public name: string
  constructor() {
    this.name = 'tim'
  }
  getName(name: string, @doc age: number) {}
}

export {}
