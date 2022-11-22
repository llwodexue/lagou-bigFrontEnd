import React, { PureComponent } from 'react'

export class App extends PureComponent {
  constructor() {
    super()

    this.state = {
      titleSize: 30
    }
  }
  render() {
    const { titleSize } = this.state

    return (
      <div>
        <h2 style={{ color: 'red' }}>标题</h2>
        <p style={{ color: 'blue', fontSize: `${titleSize}px` }}>内容</p>
      </div>
    )
  }
}

export default App
