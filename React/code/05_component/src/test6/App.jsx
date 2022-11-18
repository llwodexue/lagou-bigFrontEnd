import React, { createRef, PureComponent } from 'react'

export class App extends PureComponent {
  constructor() {
    super()

    this.state = {
      username: '',
      password: '',
      isAgree: false,
      hobbies: [
        { value: 'sing', text: '唱', isChecked: false },
        { value: 'dance', text: '跳', isChecked: false },
        { value: 'rap', text: 'rap', isChecked: false }
      ],
      fruit: ['orange'],
      intro: '哈哈哈'
    }

    this.introRef = createRef()
  }

  componentDidMount() {}

  handleSubmitClick(event) {
    event.preventDefault()
    const hobbies = this.state.hobbies
      .filter(item => item.isChecked)
      .map(item => item.value)
    console.log('获取爱好: ', hobbies)
    console.log(this.introRef.current.value)
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleAgreeChange(event) {
    console.log(event.target.checked)
    this.setState({ isAgree: event.target.checked })
  }

  handleHobbiesChange(event, index) {
    const hobbies = [...this.state.hobbies]
    hobbies[index].isChecked = event.target.checked
    this.setState({ hobbies: hobbies })
  }

  handleFruitChange(event) {
    // const options = Array.from(event.target.selectedOptions).map(item => item.value)
    const options = Array.from(event.target.selectedOptions, item => item.value)
    this.setState({ fruit: options })

    // 额外补充：Array.from(可迭代对象)
  }

  render() {
    const { username, password, isAgree, hobbies, fruit, intro } = this.state

    return (
      <div>
        <form onSubmit={e => this.handleSubmitClick(e)}>
          {/* 1.用户名和密码 */}
          <div>
            <label htmlFor='username'>
              用户:
              <input
                id='username'
                type='text'
                name='username'
                value={username}
                onChange={e => this.handleInputChange(e)}
              />
            </label>
            <label htmlFor='password'>
              密码:
              <input
                id='password'
                type='password'
                name='password'
                value={password}
                onChange={e => this.handleInputChange(e)}
              />
            </label>
          </div>

          {/* 2.checkbox */}
          <div>
            <label htmlFor='agree'>
              <input
                id='agree'
                type='checkbox'
                checked={isAgree}
                onChange={e => this.handleAgreeChange(e)}
              />
              同意协议
            </label>
          </div>

          {/* 3.checkbox 多选 */}
          <div>
            {hobbies.map((item, index) => {
              return (
                <label key={item.value} htmlFor={item.value}>
                  <input
                    type='checkbox'
                    id={item.value}
                    checked={item.isChecked}
                    onChange={e => this.handleHobbiesChange(e, index)}
                  />
                  {item.text}
                </label>
              )
            })}
          </div>

          {/* 4.select */}
          <div>
            <select value={fruit} onChange={e => this.handleFruitChange(e)} multiple>
              <option value='apple'>苹果</option>
              <option value='orange'>橘子</option>
              <option value='banana'>香蕉</option>
            </select>
          </div>

          {/* 5.非受控组件 */}
          <div>
            <input type='text' defaultValue={intro} ref={this.introRef} />
          </div>

          <button type='submit'>注册</button>
        </form>
      </div>
    )
  }
}

export default App
