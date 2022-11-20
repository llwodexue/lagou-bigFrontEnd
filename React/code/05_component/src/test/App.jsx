import React, { PureComponent } from 'react'
import { StrictMode } from 'react'
import Home from './pages/Home'
export class App extends PureComponent {
  render() {
    return (
      <div className='app'>
        <h1>h1</h1>
        <StrictMode>
          <Home />
        </StrictMode>
      </div>
    )
  }
}

export default App
