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
    return <p>{this.props.title} ClassComponent</p>
  }
}
render(<Greeting title="Hello" />, root)

function FnComponent(props){
  return <div>{props.title} FnComponent</div>
}
// render(<FnComponent title="Hello" />, root)