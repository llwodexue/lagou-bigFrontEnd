var a = 10
var obj = {
  a: 20,
  fn() {
    setTimeout(() => {
      console.log(this.a)
    })
  },
}
obj.fn()
