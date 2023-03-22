<template>
  <nav>
    <router-link to="/">Home</router-link>
    |
    <router-link to="/about">About</router-link>
  </nav>
  <button @click="btnClick">click</button>
  <button @click="changeClick">change</button>
  <button @click="logClick">log</button>
  <a target="_blank" rel="noopener" href="http://localhost:8080/#/about">Link</a>
  <router-view />
</template>
<script>
export default {
  // created() {
  //   window.sessionStorage.setItem('pageA_1', '123')
  // },
  methods: {
    btnClick() {
      window.open('http://localhost:8080/#/about')
    },
    changeClick() {
      window.sessionStorage.setItem('pageA_1', '456')
      window.sessionStorage.setItem('pageA_2', '789')
    },
    logClick() {
      const item = window.sessionStorage.getItem('pageA_1')
      console.log(item)
      window.alert(item)
    }
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
