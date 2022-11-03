// import { sum } from '@/utils/cal'
// import Vue from 'vue'
import Greeting from '@/components/Greeting'
import { mount } from '@vue/test-utils'

/* test('Greeting', () => {
  // 测试环境有一个虚拟的 DOM 环境，内部用的 jsdom 来模拟浏览器 DOM
  const root = document.createElement('div')
  root.id = 'app'
  document.body.appendChild(root)

  // 把 vue 组件渲染到 HTML 元素节点上
  new Vue({
    render: h => h(Greeting)
  }).$mount('#app')

  const title = document.body.querySelector('h1')
  expect(title.innerHTML).toBe('Hello World')
}) */

test('Greeting', () => {
  // 挂载组件，返回一个包装的工具实例
  const wrapper = mount(Greeting)
  // console.log(wrapper.html())
  // find 方法类似于 document.querySelector
  // findAll 方法类似于 document.querySelectorAll
  expect(wrapper.find('h1').text()).toBe('Hello World')
})
