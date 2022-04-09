const computed = function computed(num) {
  const arr = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const arr2 = ['', '拾', '佰', '仟', '万']
  num = String(num).split('')
  num = num.reverse().map((item, index) => {
    let char = arr[+item]
    if (index > 0 && char !== '零') {
      char += arr2[index]
    }
    return char
  })
  return num.reverse().join('')
}
console.log(computed(20876))
