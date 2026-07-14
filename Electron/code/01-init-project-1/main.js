const { app, BrowserWindow } = require('electron')
const isDev = require('electron-is-dev')

let mainWindow

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 650,
    minWidth: 600,
    webPreferences: {
      // nodeIntegration: false is the default and recommended for security.
      // Use a preload script with contextBridge to expose APIs to the renderer.
      nodeIntegration: false,
      // preload: path.join(__dirname, 'preload.js'),
    }
  })

  const urlLocation = isDev ? "http://localhost:3000" : `file://${__dirname}/index.html`

  mainWindow.loadURL(urlLocation)
})