const Service = require('egg').Service
const nodeMail = require('nodemailer')
const path = require('path')
const fse = require('fs-extra')

const userEmail = 'user_nan@126.com'
const transport = nodeMail.createTransport({
  host: 'smtp.126.com',
  port: 465,
  secure: true,
  auth: {
    user: userEmail,
    pass: 'XNRNWJBIUKDWRZNI'
  }
})

class ToolService extends Service {
  async sendEmail(email, subject, text, html) {
    const mailOptions = {
      from: userEmail,
      to: email,
      subject: subject,
      text: text,
      html: html
    }
    try {
      return await transport.sendMail(mailOptions)
    } catch (error) {
      return false
    }
  }

  async mergeFile(filepath, hashpath, size) {
    const chunkDir = path.resolve(this.app.config.uploadDir, hashpath) //切片的文件夹
    let chunks = await fse.readdir(chunkDir)
    chunks.sort((a, b) => a.split('-')[1] - b.split('-')[1])
    chunks = chunks.map(cp => path.resolve(chunkDir, cp))
    await this.mergeChunks(chunks, filepath, size, chunkDir)
  }

  async mergeChunks(files, dest, size, chunkDir) {
    const pipStream = (filepath, writeStream) =>
      new Promise(resolve => {
        const readStream = fse.createReadStream(filepath)
        readStream.on('end', () => {
          // 合并成功之后把之前的切片文件都删除掉
          fse.unlink(filepath, () => {
            // const dir = fse.readdirSync(chunkDir);
            // if(dir.length > 0) dir.forEach(ele => fse.unlinkSync(chunkDir + '/' + ele));
            fse.rmdir(chunkDir)
          })
          resolve()
        })
        readStream.pipe(writeStream)
      })

    await Promise.all(
      files.map((file, index) => {
        pipStream(
          file,
          fse.createWriteStream(dest, {
            start: index * size,
            end: (index + 1) * size
          })
        )
      })
    )
  }
}

module.exports = ToolService
