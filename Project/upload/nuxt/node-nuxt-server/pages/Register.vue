<template>
  <div class="register-container">
    <el-form label-width="80px" :rules="rules" ref="registForm" :model="form">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入邮箱或手机号"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname" placeholder="请输昵称"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" placeholder="请输入密码" show-password></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="repassword">
        <el-input v-model="form.repassword" placeholder="请再次输入密码" show-password></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="captcha">
        <div class="captcha-container">
          <el-input v-model="form.captcha" placeholder="请输入验证码"></el-input>
        </div>
        <img class="captcha" :src="captcha" alt="" @click="changeCaptcha" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import md5 from 'md5'
export default {
  layout: 'Login',
  data() {
    return {
      form: {
        username: '',
        nickname: '',
        password: '',
        repassword: '',
        captcha: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        nickname: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入6 - 12 位密码', trigger: 'blur', pattern: /^[\w_]{6,12}$/g }],
        repassword: [
          { required: true, message: '请再次输入密码' },
          {
            validator: (rule, value, callback) => {
              if (value !== this.form.password) {
                callback(new Error('两次输入的密码不一致~'))
              }
              callback()
            }
          }
        ],
        captcha: [{ required: true, message: '请输入正确的验证码' }]
      },
      captcha: '/api/captcha?rd=' + Math.random()
    }
  },
  methods: {
    changeCaptcha() {
      this.captcha = '/api/captcha?rd=' + Math.random()
    },
    onSubmit() {
      this.$refs.registForm.validate(async valid => {
        if (!valid) return console.log('校验失败~')
        const obj = {
          username: this.form.username,
          nickname: this.form.nickname,
          password: md5(this.form.password),
          captcha: this.form.captcha
        }
        const res = await this.$http.post('/user/register', obj)
        if (res.data.code == 0) {
          this.$alert('注册成功~', '成功', {
            confirmButtonText: '去登录',
            callback: () => {
              this.$router.push('/Login')
            }
          })
        } else {
          this.$alert(res.data.message)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.register-container {
  width: 600px;
  margin: 150px auto;
}
</style>
