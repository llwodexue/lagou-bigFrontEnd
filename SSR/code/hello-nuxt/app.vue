<template>
  <NuxtLayout>
    <Head>
      <Meta name="key" content="this is a key"></Meta>
    </Head>

    <!-- <div>
      <h2 class="global-red">Hello Nuxt3</h2>
      <h2 class="global-green">全局样式</h2>
      <h2 class="global-blue">全局样式</h2>
    </div> -->

    <!-- <div>
        <img src="/zznh.png" alt="" />
        <img src="~/assets/images/nhlt.jpg" alt="" />
        <i class="iconfont icon-share"></i>
      </div> -->

    <div>
      <NuxtLink to="/parent">
        <button>parent</button>
      </NuxtLink>
      <br />
      <NuxtLink @click="goToCategory">
        <button>category</button>
      </NuxtLink>
      <NuxtLink @click="goToMore">
        <button>more</button>
      </NuxtLink>
      <NuxtLink @click="goBack">
        <button>back</button>
      </NuxtLink>
      <NuxtLink
        :to="{
          path: '/profile',
          query: {
            id: 100
          }
        }"
      >
        <button>profile</button>
      </NuxtLink>
    </div>

    <NuxtPage></NuxtPage>
  </NuxtLayout>
</template>

<script lang="ts" setup>
// 1.获取运行时配置
// const runtimeConfig = useRuntimeConfig()
// if (process.server) {
//   console.log('运行在 server')
//   console.log(runtimeConfig.appKey)
// }
// if (process.client) {
//   console.log('运行在 client')
//   console.log(runtimeConfig.appKey)
//   console.log(runtimeConfig.public.baseURL)
// }

// 2.获取appConfig
// const appConfig = useAppConfig()
// onMounted(() => {
//   document.title = appConfig.title
// })

// 3.动态给该app所有页面添加head内容
// useHead({
//   title: 'app useHead'
// })

const goToCategory = () => {
  // navigateTo('/category')
  return navigateTo({
    path: '/category',
    query: {
      id: 200
    }
  })
}
const router = useRouter()
const goToMore = () => {
  router.push('/more')
}
const goBack = () => {
  router.go(-1)
}
</script>

<style scoped lang="scss">
/* 手动导入全局样式 */
/* @import '~/assets/styles/variables.scss'; */

/* 给这个模块起命名空间，as *：可以省略命名空间 */
@use '~/assets/styles/variables.scss' as vb;
.global-red {
  color: red;
  font-size: vb.$fs20;
  @include vb.border();
}
</style>
