import todoItem from '@/components/todoItem'
import { shallowMount } from '@vue/test-utils'
import Vue from 'vue'

describe('测试每一个 item', () => {
  /** @type {import('@vue/test-utils').Wrapper} */
  let wrapper = null
  // 运行每个测试之前执行 beforEach 这个钩子函数
  beforeEach(async () => {
    wrapper = shallowMount(todoItem, {
      propsData: {
        todo: {
          id: 1,
          text: 'eat',
          done: false
        }
      }
    })
    // 确保视图更新只会再进行后续的内容测试
    await Vue.nextTick()
  })

  test('任务标题展示正常', () => {
    const label = wrapper.find('[data-testid="todo-text"]')
    expect(label.text()).toBe('eat')
  })

  test('任务标题展示正常', () => {
    const done = wrapper.find('[data-testid="todo-done"]')
    expect(done.element.checked).toBeFalsy()
  })

  // 结合 babel，可以实现 data-testid 批量删除
  // 但是不建议，e2e 就是真实的 html 页面，它也要去获取元素
})
