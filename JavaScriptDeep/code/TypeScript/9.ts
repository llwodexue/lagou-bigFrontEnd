export {} // 确保跟其它示例没有成员冲突

function func1 (a: number, b: number = 10, ...rest: number[]): string {
  return 'func1'
}
func1(100, 200, 300)

const func2: (a: number, b: number) => string = function (a: number, b: number): string {
  return 'func2'
}


function stringify (value: any) {
  return JSON.stringify(value)
}
stringify('string')
stringify(100)
stringify(true)


const nums = [110, 120, 119, 112]
const res = nums.find(i => i > 0)
const num1 = res as number
const num2 = <number>res // JSX 下不能使用