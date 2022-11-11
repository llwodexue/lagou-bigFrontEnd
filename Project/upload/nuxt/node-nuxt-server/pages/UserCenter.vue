<template>
  <div>用户中心页面</div>
</template>
<script>
export default {
  layout: 'Login',
  data() {
    return {}
  },
  async mounted() {
    const ret = await this.$http.get('/user/info')
    if (ret.data.code == -1) return this.$alert(ret.data.message)
    const { data } = ret.data
    console.log(data)
  }
}
</script>
<style lang="scss" scoped></style>
