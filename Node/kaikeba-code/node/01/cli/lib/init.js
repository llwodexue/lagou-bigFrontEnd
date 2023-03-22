const { promisify } = require('util')
const figlet = promisify(require('figlet'))
const clear = require('clear')
const chalk = require('chalk')
const open = require('open')
const clone = require('./download')

const log = content => console.log(chalk.green(content))

const asyncSpawn = async (...args) => {
  const { spawn } = require('child_process')
  return new Promise(resolve => {
    const proc = spawn(...args)
    proc.stdout.pipe(process.stdout)
    proc.stderr.pipe(process.stderr)
    proc.on('close', () => {
      resolve()
    })
  })
}

module.exports = async name => {
  clear()
  const data = await figlet('Welcome')
  log(data)

  log(`创建项目：${name}`)
  await clone('github:su37josephxia/vue-template', name)

  log(`安装依赖：${name}`)
  const npmRun = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  await asyncSpawn(npmRun, ['install'], {
    cwd: `./${name}`
  })
  log(`
    安装完成：
    To get Start:
    ===========================
      cd ${name}
      npm run serve
    ===========================
  `)

  log('打开浏览器')
  open('http://localhost:8080')
  await asyncSpawn(npmRun, ['run', 'serve'], { cwd: `./${name}` })
}
