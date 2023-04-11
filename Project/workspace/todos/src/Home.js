import React, { useState, useEffect } from 'react'

function useToolsModule() {
  const [toolsModule, setToolsModule] = useState()
  useEffect(() => {
    System.import('@study/tools').then(setToolsModule)
  }, [])
  return toolsModule
}

function Home() {
  const toolsModule = useToolsModule()
  useEffect(() => {
    let subjection = null
    if (toolsModule) {
      toolsModule.sayHello('@study/todos')
      subjection = toolsModule.sharedSubject.subscribe(console.log)
    }
    return () => subjection.unsubscribe()
  }, [])

  return (
    <div>
      Home works{' '}
      <button onClick={() => toolsModule.sharedSubject.next('hello hello')}>click</button>
    </div>
  )
}

export default Home
