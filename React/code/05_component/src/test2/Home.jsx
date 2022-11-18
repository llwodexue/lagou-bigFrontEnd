import React, { Component } from 'react'
import HomeInfo from './HomeInfo'

export class Home extends Component {
  render() {
    const { name, age } = this.props
    return (
      <div>
        Home:{name}
        {age}
        <HomeInfo />
      </div>
    )
  }
}

export default Home
