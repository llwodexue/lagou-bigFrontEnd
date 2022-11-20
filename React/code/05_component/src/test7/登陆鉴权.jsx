import React, { PureComponent } from 'react'
import Cart from './pages/Cart'

export class App extends PureComponent {
  loginClick() {
    localStorage.setItem('token', 'token')
    this.forceUpdate()
  }
  logoutClick() {
    localStorage.removeItem('token')
    this.forceUpdate()
  }

  render() {
    return (
      <div>
        App
        <button onClick={e => this.loginClick()}>登录</button>
        <button onClick={e => this.logoutClick()}>登出</button>
        <Cart />
      </div>
    )
  }
}

export default App
