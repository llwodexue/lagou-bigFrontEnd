function Person1() {
  this.name = 'bird'
  this.age = 14
  this.getAge = function () {
    return this.age
  }
}
let p1 = new Person1()
console.log(p1.getAge())

function Person2() {
  this.name = 'bird'
  this.age = 14
  this.getAge = function () {
    return this.age
  }
}
let p2 = new Person2()
console.log(p2.age)
