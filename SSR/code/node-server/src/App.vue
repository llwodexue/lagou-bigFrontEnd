<template>
  <div id="app">
    <h2>Vue3 App</h2>
    <div>{{ count }}</div>
    <button @click="addCount">+1</button>

    <div style="margin-top: 20px;">
      <router-link to="/">
        <button>home</button>
      </router-link>
      <router-link to="/about">
        <button>about</button>
      </router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(100)

const addCount = () => {
  count.value++
}
</script>
