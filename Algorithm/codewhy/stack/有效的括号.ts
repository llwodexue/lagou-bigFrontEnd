import ArrayStack from './stack_refactor'

function isValid(s: string): boolean {
  // 创建栈结构
  const stack = new ArrayStack<string>()
  // 2.遍历s中所有的括号
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    switch (c) {
      case '(':
        stack.push(')')
        break
      case '{':
        stack.push('}')
        break
      case '[':
        stack.push(']')
        break
      default:
        if (c !== stack.pop()) return false
        break
    }
  }
  return stack.isEmpty()
}

console.log(isValid('()'))
console.log(isValid('()[]{}'))
console.log(isValid('(]'))
