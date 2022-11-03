import { sum, subtract } from './math'

test('测试 sum', () => {
  expect(sum(1, 2)).toBe(3)
})
test('测试 subtract', () => {
  expect(subtract(2, 1)).toBe(1)
})
test('测试 obj', () => {
  const obj = { foo: 'bar' }
  // expect(obj).toBe({ foo: 'bar' })
  expect(obj).toEqual({ foo: 'bar' })
})

const shoppingList = ['diapers', 'kleenex', 'trash bags', 'paper towels', 'milk']

test('shoppingList数组中包含milk', () => {
  expect(shoppingList).toContain('milk')
  expect(new Set(shoppingList)).toContain('milk')
})
