function fn() {
  const obj1 = {}
  const obj2 = {}

  obj1.name = obj2
  obj2.name = obj1
}
fn()