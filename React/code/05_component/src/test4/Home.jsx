import React, { PureComponent } from 'react'

export class Home extends PureComponent {
  // shouldComponentUpdate(nextProps, newState) {
  //   return true
  // }

  render() {
    console.log('Home render')
    return (
      <div>
        <h2>Home Page: {this.props.message}</h2>
      </div>
    )
  }
}

export default Home
