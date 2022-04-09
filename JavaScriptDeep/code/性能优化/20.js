var test = () => {
  var obj = new Object()
  obj.name = 'zce'
  obj.age = 38
  obj.slogan = '声明一个 obj'
  return obj
}

var test = () => {
  var obj = {
    name: 'zce',
    age: 38,
    slogan: '声明一个 obj',
  }
  return obj
}

console.log(test())
