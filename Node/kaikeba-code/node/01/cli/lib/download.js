const { promisify } = require('util')
const download = promisify(require('download-git-repo'))
const ora = require('ora')

module.exports = async (repo, desc) => {
  const process = ora(`下载... ${repo}`)
  process.start()
  try {
    await download(repo, desc)
  } catch (error) {
    console.log('err', error)
    process.fail()
  }
  process.succeed()
}
