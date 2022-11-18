import React, { Component } from 'react'

export class App extends Component {
  constructor() {
    super()
    this.state = {
      message: 'Hello World',
      counter: 0
    }
  }
  changeMessage() {
    // 1.基本使用
    this.setState({ message: '你好，世界1' })
    // 2.setState可以传入一个回调函数
    this.setState((state, props) => {
      // 好处1：可以在回调函数中编写新的 state 的逻辑
      // 好处2：当前的回调函数会将之前的 state 和 props 传递进来
      console.log(state, props)
      return {
        message: '你好，世界2'
      }
    })
    // 3.setState 在 React 的事件处理是一个异步操作
    // 如果希望在数据更新之后（数据合并），获取到对应的结果执行一些逻辑代码
    // 那么可以在 setState 中传入第二个参数：callback
    this.setState(
      {
        message: '你好，世界3'
      },
      () => {
        console.log(this.state.message)
      }
    )
    
    setTimeout(() => {
      this.setState({
        message: '你好，世界'
      })
      console.log(this.state.message)
    }, 0)
  }
  increment() {}
  render() {
    const { message, counter } = this.state
    return (
      <div>
        <h2>message: {message}</h2>
        <button onClick={() => this.changeMessage()}>修改文本</button>
        <h2>counter: {counter}</h2>
        <button onClick={() => this.increment()}>counter+1</button>
      </div>
    )
  }
}

export default App
