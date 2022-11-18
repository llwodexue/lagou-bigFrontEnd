import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './style.css'

export class TabControl extends Component {
  constructor() {
    super()
    this.state = {
      curIdx: 0
    }
  }
  itemClick(i) {
    this.setState({ curIdx: i })
    this.props.tabClick(i)
  }
  render() {
    const { title } = this.props
    const { curIdx } = this.state
    return (
      <div className='tab-control'>
        {title.map((item, i) => {
          return (
            <div
              className={`item ${i === curIdx ? 'active' : ''} `}
              key={item}
              onClick={() => this.itemClick(i)}
            >
              {item}
            </div>
          )
        })}
      </div>
    )
  }
}
TabControl.propTypes = {
  tabClick: PropTypes.func,
  title: PropTypes.string
}

export default TabControl
