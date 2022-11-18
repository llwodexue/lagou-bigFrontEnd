import React, { Component } from 'react'
import Home from './Home'
import HomeBanner from './HomeBanner'
import ThemeContext from './theme-context'

export class App extends Component {
  constructor() {
    super()
    this.state = {
      info: { name: 'bird', age: 8 }
    }
  }
  render() {
    const { info } = this.state
    return (
      <div>
        {/* 1.给Home传递数据 */}
        {/* <Home name='why' age={18} />
        <Home {...info} /> */}
        {/* 2.普通Home */}
        {/* 2.通过 */}
        <ThemeContext.Provider value={{ color: 'red', size: 30 }}>
          <Home {...info} />
        </ThemeContext.Provider>
        <HomeBanner />
      </div>
    )
  }
}

export default App
