import React, { Component } from 'react'
import TabControl from './TabControl'

export class App extends Component {
  constructor() {
    super()
    this.state = {
      title: ['标签一', '标签二', '标签三'],
      tabIndex: 0
    }
  }
  tabChange(i) {
    this.setState({ tabIndex: i })
  }
  render() {
    const { title, tabIndex } = this.state
    return (
      <div>
        <TabControl
          title={title}
          tabClick={i => {
            this.tabChange(i)
          }}
        />
        <h1>{title[tabIndex]}</h1>
      </div>
    )
  }
}

export default App
