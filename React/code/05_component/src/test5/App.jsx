import React, { PureComponent } from 'react'

export class App extends PureComponent {
  constructor() {
    super()
    this.state = {
      books: [
        { name: '你不知道JS', price: 99, count: 1 },
        { name: 'JS高级程序设计', price: 88, count: 1 },
        { name: 'React高级设计', price: 78, count: 2 },
        { name: 'Vue高级设计', price: 95, count: 3 }
      ]
    }
  }

  addBookCount(index) {
    const books = [...this.state.books]
    books[index].count++
    this.setState({ books: books })
  }
  addNewBook() {
    const newBook = { name: 'Angular高级设计', price: 88, count: 1 }

    // 1.直接修改原有的 state，重新设置一遍
    // 在 PureComponent 是不能重新渲染的
    // this.state.books.push(newBook)
    // this.setState({ books: this.state.books })

    // 2.复制一份，在新的 books 中修改，设置新的 books
    const books = [...this.state.books]
    books.push(newBook)
    this.setState({ books: books })
  }
  render() {
    const { books } = this.state

    return (
      <div>
        <h2>数据列表</h2>
        <ul>
          {books.map((item, index) => {
            return (
              <li key={index}>
                <span>
                  name:{item.name}-price:{item.price}-count:{item.count}
                </span>
                <button onClick={e => this.addBookCount(index)}>+1</button>
              </li>
            )
          })}
        </ul>
        <button onClick={e => this.addNewBook()}>添加新书籍</button>
      </div>
    )
  }
}

export default App
