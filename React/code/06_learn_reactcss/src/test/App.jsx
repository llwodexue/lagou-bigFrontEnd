import React, { PureComponent } from 'react'
import { AppWrapper, SectionWrapper } from './style'
import Home from './Home'

export class App extends PureComponent {
  constructor() {
    super()
    this.state = {
      size: 60,
      color: 'yellow'
    }
  }
  render() {
    const { size, color } = this.state

    return (
      <AppWrapper>
        <SectionWrapper size={size} color={color}>
          <div className='section'>
            <h2 className='title'>我是标题</h2>
            <p className='content'>我是内容</p>
          </div>

          <Home />

          <div className='footer'>
            <p>免责声明</p>
          </div>
        </SectionWrapper>
      </AppWrapper>
    )
  }
}

export default App
