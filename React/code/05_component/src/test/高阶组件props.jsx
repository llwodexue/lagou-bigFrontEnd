import React, { PureComponent } from 'react'

// 给一些需要特殊数据的组件，注入 props
function enhanceUserInfo(OriginComponent) {
  class NewComponent extends PureComponent {
    constructor() {
      super()
      this.state = {
        userinfo: {
          name: 'bird',
          age: 99,
          level: 2
        }
      }
    }
    render() {
      return <OriginComponent {...this.props} {...this.state.userinfo} />
    }
  }
  return NewComponent
}

const Home = enhanceUserInfo(function (props) {
  return <h1>Home {props.name}</h1>
})

const Profile = enhanceUserInfo(function (props) {
  return <h1>Profile {props.banner}</h1>
})
const HelloWorld = enhanceUserInfo(function (props) {
  return <h1>HelloWorld {props.level}</h1>
})

export class App extends PureComponent {
  render() {
    return (
      <div>
        <Home />
        <Profile banner={'aaa'} />
        <HelloWorld />
      </div>
    )
  }
}

export default App
