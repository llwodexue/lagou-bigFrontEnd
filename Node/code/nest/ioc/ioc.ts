class A {
  name: string
  constructor(name: string) {
    this.name = name
  }
}
class C {
  name: string
  constructor(name: string) {
    this.name = name
  }
}
class Container {
  mo: any
  constructor() {
    this.mo = {}
  }
  provide(key: string, mo: any) {
    this.mo[key] = mo
  }
  get(key: string) {
    return this.mo[key]
  }
}
const mo = new Container()
mo.provide('a', new A('bird'))
mo.provide('c', new C('dog'))

class B {
  a: any
  c: any
  constructor(mo: Container) {
    this.a = mo.get('a')
    this.c = mo.get('c')
  }
}
new B(mo)

export {}