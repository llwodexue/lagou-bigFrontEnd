import React, { PureComponent } from 'react'
import Product from './pages/Product'
import ThemeContext from './context/theme_context'

export class App extends PureComponent {
  render() {
    return (
      <div>
        <ThemeContext.Provider value={{ color: 'blue', size: 'mini' }}>
          <Product />
        </ThemeContext.Provider>
      </div>
    )
  }
}

export default App
