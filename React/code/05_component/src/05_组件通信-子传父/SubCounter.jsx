import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class SubCounter extends Component {
  subCount(count) {
    this.props.subClick(count)
  }

  render() {
    return (
      <div>
        <button onClick={e => this.subCount(-1)}>-1</button>
        <button onClick={e => this.subCount(-5)}>-5</button>
        <button onClick={e => this.subCount(-10)}>-10</button>
      </div>
    )
  }
}

SubCounter.propTypes = {
  subClick: PropTypes.func
}

export default SubCounter
