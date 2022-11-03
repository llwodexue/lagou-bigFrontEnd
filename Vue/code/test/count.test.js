import { Counter } from './count'

let counter = null
beforeEach(() => {
  counter = new Counter()
})

describe('Counter group1', () => {
  test('Counter increment', () => {
    counter.increment()
    expect(counter.count).toBe(1)
  })

  test('Counter decrement', () => {
    counter.decrement()
    expect(counter.count).toBe(-1)
  })
})

describe('Counter group2', () => {
  // 当前组里面的每个测试用例执行之前都来调用
  beforeEach(() => {
    console.log('group beforeEach')
  })
  test('Counter incrementTwo', () => {
    counter.incrementTwo()
    expect(counter.count).toBe(2)
  })

  test('Counter decrementTwo', () => {
    counter.decrementTwo()
    expect(counter.count).toBe(-2)
  })
})
