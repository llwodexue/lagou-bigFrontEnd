import React, { PureComponent } from 'react'
import store from '../store'
import { addNumberAction } from '../store/actionCreators'
export class Profile extends PureComponent {
  constructor() {
    super()
    this.state = {
      counter: store.getState().counter
    }
  }
  componentDidMount() {
    store.subscribe(() => {
      const state = store.getState()
      this.setState({ counter: state.counter })
    })
  }
  addNumber(num) {
    store.dispatch(addNumberAction(num))
  }
  render() {
    const { counter } = this.state
    return (
      <div>
        <h2>Profile {counter}</h2>
        <button onClick={e => this.addNumber(1)}>count+1</button>
        <button onClick={e => this.addNumber(5)}>count+5</button>
        <button onClick={e => this.addNumber(8)}>count+8</button>
      </div>
    )
  }
}

export default Profile
