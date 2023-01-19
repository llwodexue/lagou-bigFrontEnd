import React, { render, Component } from './react'

const root = document.getElementById('root')

const jsx = (
  <div>
    <p>Hello React</p>
    <p>Hi Fiber</p>
  </div>
)

// render(jsx, root)

class Greeting extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return <p>Hello React</p>
  }
}
render(<Greeting />, root)
