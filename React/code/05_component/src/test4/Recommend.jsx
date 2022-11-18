import React, { PureComponent } from 'react'

export class Recommend extends PureComponent {
  // shouldComponentUpdate() {
  //   return true
  // }

  render() {
    console.log('Recommend render')
    return (
      <div>
        <h2>Recommend Page: {this.props.counter}</h2>
      </div>
    )
  }
}

export default Recommend
