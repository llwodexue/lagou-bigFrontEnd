<template>
  <div id="app">
    <to-do-app />
  </div>
</template>

<script>
import toDoApp from './components/toDoApp.vue'

export default {
  name: 'App',
  components: { toDoApp }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
