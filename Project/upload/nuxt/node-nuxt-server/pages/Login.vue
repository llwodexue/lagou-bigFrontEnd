<template>
  <div class="form-container">
    <el-form label-width="80px" :rules="rules" ref="loginForm" :model="form">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入邮箱或手机号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" placeholder="请输入密码" show-password></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="captcha">
        <div class="captcha-container">
          <el-input v-model="form.captcha" placeholder="请输入验证码"></el-input>
        </div>
        <img class="captcha" :src="captcha" alt="" @click="changeCaptcha" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">登录</el-button>
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
        password: '',
        captcha: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      captcha: '/api/captcha?rd=' + Math.random()
    }
  },
  methods: {
    changeCaptcha() {
      this.captcha = '/api/captcha?rd=' + Math.random()
    },
    onSubmit() {
      this.$refs.loginForm.validate(async valid => {
        if (!valid) return console.log('校验失败~')
        const obj = {
          username: this.form.username,
          nickname: this.form.nickname,
          password: md5(this.form.password),
          captcha: this.form.captcha
        }
        const res = await this.$http.post('/user/login', obj)
        if (res.data.code == 0) {
          // 登录成功需要前端存储一下 token
          localStorage.setItem('token', res.data.data.token)

          this.$alert('登录成功~', '成功', {
            confirmButtonText: '确认',
            callback: () => {
              this.$router.push('/UserCenter')
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
.form-container {
  width: 600px;
  height: 600px;
  margin: 150px auto;
}
</style>
