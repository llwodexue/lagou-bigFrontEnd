import ArrayStack from './stack_refactor'

function decimalToBinary(decimal: number): string {
  // 1.创建一个栈，用于存放余数
  const stack = new ArrayStack<number>()

  // 2.使用循环 while(不确定次数，只知道循环结束条件) for(知道循环的次数)
  while (decimal > 0) {
    const result = decimal % 2
    stack.push(result)
    decimal = Math.floor(decimal / 2)
  }

  // 3.所有的余数都已经放在 stack 中，依次取出即可
  let binary = ''
  while (!stack.isEmpty()) {
    binary += stack.pop()
  }
  console.log(binary)
  return binary
}

decimalToBinary(35)

export {}
