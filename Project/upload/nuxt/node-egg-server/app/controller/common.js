const Controller = require('egg').Controller
const svgCaptcha = require('svg-captcha')
const fse = require('fs-extra')
const path = require('path')

class ConmonController extends Controller {
  /**
   * 生成验证码
   */
  async captcha() {
    const captcha = svgCaptcha.create({
      size: 4, // 生成 4 个字符的验证码
      ignoreChars: '0o1i', // 过滤掉 0o1i 这种容易混淆的数字和字母
      noise: 3, // 噪点
      //color:true,             // 文字颜色
      //background:'#cc9966',   // 背景颜色
      width: 100, // 图片宽度
      height: 40, // 图片高度
      fontSize: 40 // 文字大小
    })
    console.log('captcha=>', captcha.text)

    this.ctx.session.captcha = captcha.text
    this.ctx.response.type = 'image/svg+xml'
    this.ctx.body = captcha.data
  }

  /**
   * 发送邮件验证码
   */
  async sendEmail() {
    const { ctx } = this
    const { email } = ctx.query
    let code = Math.random().toString().slice(2, 6)

    console.log('邮箱:' + email + '验证码:' + code)
    ctx.session.emailcode = code

    const subject = 'Nuxt 管理后台验证码~'
    const text = '看看随便写点什么'
    const html = `
            <h1>hope的管理后台</h1>
            <a href="https://scorpio-nan.github.io/#/">${code}</a>
        `
    const res = await this.service.tools.sendEmail(email, subject, text, html)
    return res
      ? (ctx.body = {
          code: 0,
          message: '发送成功~'
        })
      : (ctx.body = {
          code: -1,
          message: '发送失败, 请 60 秒后重试~'
        })
  }

  /**
   * 文件上传
   */
  /*
    async uploadFile(){
        const { ctx } = this;
        const file = ctx.request.files[0];
        const { name } = ctx.request.body;

        await fse.move(file.filepath, this.app.config.uploadDir + '/' + file.filename);
        ctx.body = {
            code:0,
            message:"上传成功~",
            data:{
                url:'/public/' + file.filename
            }
        }
    }
    */
  async uploadFile() {
    const { ctx } = this
    // 文件切片存放在 public/hash/(hash + index);
    const file = ctx.request.files[0]
    const { hash, name } = ctx.request.body
    const chunkpath = path.resolve(this.app.config.uploadDir, hash)

    // 如果文件不存在,就新建一个文件夹
    if (!fse.existsSync(chunkpath)) await fse.mkdir(chunkpath)

    await fse.move(file.filepath, `${chunkpath}/${name}`)

    ctx.body = {
      code: 0,
      message: '上传成功~',
      data: {
        url: chunkpath + '/' + name
      }
    }
  }

  /**
   * 合并文件流
   */
  async mergeFile() {
    const { ctx } = this
    const { ext, name, hash, size } = ctx.request.body
    const filepath = path.resolve(this.app.config.uploadDir, `${hash}.${ext}`)

    await this.ctx.service.tools.mergeFile(filepath, hash, parseInt(size))

    ctx.body = {
      code: 0,
      message: '上传成功~',
      data: {
        url: '/public/' + hash + '.' + ext
      }
    }
  }

  /**
   * 查看文件是否有切片
   */
  async checkfile() {
    const { ctx } = this
    const { ext, hash } = ctx.request.body
    const filepath = path.resolve(this.app.config.uploadDir, `${hash}.${ext}`)

    let uploaded = false
    let uploadedList = []

    // 判断文件是否存在
    if (fse.existsSync(filepath)) {
      uploaded = true
    } else {
      uploadedList = await this.getUploadedList(path.resolve(this.app.config.uploadDir, hash))
    }
    ctx.body = {
      code: 0,
      uploaded: uploaded,
      uploadedList: uploadedList
    }
  }

  /**
   * 获取文件碎片
   */
  async getUploadedList(dirpath) {
    return fse.existsSync(dirpath)
      ? // 过滤隐藏文件  .DS_Store
        fse.readdirSync(dirpath).filter(name => name[0] !== '.')
      : []
  }
}
module.exports = ConmonController
