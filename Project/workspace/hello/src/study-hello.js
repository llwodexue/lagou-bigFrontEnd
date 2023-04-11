let helloContainer = null

export async function bootstrap() {
  console.log('应用正在启动')
}
export async function mount() {
  console.log('应用正在挂载')
  helloContainer = document.createElement('div')
  helloContainer.id = 'helloContainer'
  helloContainer.innerHTML = 'hello world'
  document.body.appendChild(helloContainer)
}
export async function unmount() {
  console.log('应用正在卸载')
  document.body.removeChild(helloContainer)
}
