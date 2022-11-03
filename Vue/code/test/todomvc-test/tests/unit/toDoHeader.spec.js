import toDoHeader from '@/components/toDoHeader'
import { shallowMount } from '@vue/test-utils'

// mount 深渲染，包括所有子组件都会渲染
// shallowMount 浅渲染，子渲染表层组件，不包括子组件
describe('toDoHeader', () => {
  test('标题内容是 todos', () => {
    const wrapper = shallowMount(toDoHeader)
    const title = wrapper.find('[data-testid="header-title"]')
    expect(title.text()).toBe('todos')
  })

  test('添加任务 输入有效数据发布 new-todo 事件', async () => {
    const wrapper = shallowMount(toDoHeader)
    const newTodoInput = wrapper.find('[data-testid="todo-input"]')

    // 输入有效数据，发布 new-todo 事件
    const text = 'hello'
    newTodoInput.setValue(text)
    // 触发回车时间
    await newTodoInput.trigger('keyup.enter')
    // 断言
    expect(wrapper.emitted()['new-todo']).toBeTruthy() // 对外发布了 new-todo 事件
    expect(wrapper.emitted()['new-todo'][0][0]).toBe(text) // new-todo 事件参数必须是 hello
    expect(newTodoInput.element.value).toBe('')
  })

  test('添加任务 输入无效数据不发布 new-todo 事件', async () => {
    const wrapper = shallowMount(toDoHeader)
    const newTodoInput = wrapper.find('[data-testid="todo-input"]')

    // 输入无效数据，不会往外发射 new-todo 事件
    newTodoInput.setValue('')
    // 触发回车时间
    await newTodoInput.trigger('keyup.enter')
    // 断言
    expect(wrapper.emitted()['new-todo']).toBeFalsy()
  })
})
