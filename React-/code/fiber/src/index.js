import React, { render, Component } from './react'

const root = document.getElementById('root')

const jsx = (
  <div>
    <p>Hello React</p>
    <p>Hello FIber</p>
  </div>
)
render(jsx, root)

setTimeout(() => {
  const jsx = (
    <div>
      <p>Hello FIber</p>
      {/* <p>Hello FIber</p> */}
    </div>
  )
  render(jsx, root)
}, 2000)

class Greeting extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return <p>{this.props.title} ClassComponent</p>
  }
}
// render(<Greeting title="Hello" />, root)

function FnComponent(props) {
  return <div>{props.title} FnComponent</div>
}
// render(<FnComponent title="Hello" />, root)
