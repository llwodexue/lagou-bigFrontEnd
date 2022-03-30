export {} // 确保跟其它示例没有成员冲突

// Object 类型
// object 类型是指除了原始类型以外的其它类型
const foo: object = function () {} // [] // {}
// 如果需要明确限制对象类型，则应该使用这种类型对象字面量的语法，或者是「接口」
const obj: { foo: number; bar: string } = { foo: 123, bar: 'string' }

// 数组类型
const arr1: Array<number> = [1, 2, 3]
const arr2: number[] = [1, 2, 3]
// 如果是 JS，需要判断是不是每个成员都是数字
function sum(...args: number[]) {
  return args.reduce((prev, current) => prev + current, 0)
}
sum(1, 2, 3)

const tuple: [number, string] = [18, 'zce']
const [age, name] = tuple
const entries: [string, number][] = Object.entries({
  foo: 123,
  bar: 456,
})
const [key, value] = entries[0]

Object.entries({
  foo: 123,
  bar: 456,
})

// 常量枚举，不会侵入编译结果
const enum PostStatus {
  Draft,
  Unpublished,
  Published,
}

const post = {
  title: 'Hello TypeScript',
  content: 'TypeScript is a typed superset of JavaScript.',
  status: PostStatus.Draft,
}
