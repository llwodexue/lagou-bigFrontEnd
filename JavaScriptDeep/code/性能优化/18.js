function doSomething1(part, chapter) {
  const parts = ['ES2015', 'ES2016', '工程化', 'Vue', 'React', 'Node']
  if (part) {
    if (parts.includes(part)) {
      console.log('属于当前的前端课程')
      if (chapter > 5) {
        console.log('您需要提供 VIP 身份')
      }
    }
  } else {
    console.log('请确认模块信息')
  }
}
doSomething1('ES2016', 6)

function doSomething2(part, chapter) {
  const parts = ['ES2015', 'ES2016', '工程化', 'Vue', 'React', 'Node']
  if (!part) {
    console.log('请确认模块信息')
    return
  }
  if (!parts.includes(part)) return
  console.log('属于当前的前端课程')
  if (chapter > 5) {
    console.log('您需要提供 VIP 身份')
  }
}
doSomething2('ES2016', 6)
