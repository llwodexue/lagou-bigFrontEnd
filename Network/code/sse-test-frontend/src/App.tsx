import React, { useEffect } from 'react'
import logo from './logo.svg'
import './App.css'

function App() {
  useEffect(() => {
    // const eventSource = new EventSource('http://localhost:3000/stream')
    // eventSource.onmessage = ({ data }) => {
    //   console.log('New message', JSON.parse(data))
    // }
    const eventSource2 = new EventSource('http://localhost:3000/stream2')
    eventSource2.onmessage = ({ data }) => {
      console.log('New message', JSON.parse(data))
    }
  }, [])

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
      </header>
    </div>
  )
}

export default App
