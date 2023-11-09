<template>
  <div class="home">我是Home Page</div>
  <ClientOnly>
    我是会在客户端渲染
    <template #fallback>我是服务器渲染的loading</template>
  </ClientOnly>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: [
    function (to, from) {
      console.log('第一个中间件')
      // return navigateTo('/detail02')
    },
    'home',
    function (to, from) {
      console.log('第三个中间件')
    }
  ]
})
</script>
