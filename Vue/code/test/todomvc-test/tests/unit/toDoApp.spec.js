import toDoApp from '@/components/toDoApp'
import { shallowMount } from '@vue/test-utils'
import Vue from 'vue'

describe('TodoApp.vue', () => {
  /** @type {import('@vue/test-utils').Wrapper} */
  let wrapper = null
  // 运行每个测试之前执行 beforEach 这个钩子函数
  beforeEach(async () => {
    wrapper = shallowMount(toDoApp)
    wrapper.vm.todos = [
      { id: 1, text: 'eat', done: false },
      { id: 2, text: 'sleep', done: true },
      { id: 3, text: 'play', done: false }
    ]
    // 确保视图更新只会再进行后续的内容测试
    await Vue.nextTick()
  })
  it('任务列表展示正常', () => {
    const todoItems = wrapper.findAll('[data-testid="todo-item"]')
    expect(todoItems.length).toBe(3)
  })
})
