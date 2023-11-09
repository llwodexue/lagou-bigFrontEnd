export default defineNuxtRouteMiddleware((to, from) => {
  const isLogin = false
  console.log('第三个中间件')
  // if (!isLogin && to.fullPath !== '/login') {
  //   return navigateTo('/login')
  // }
})
