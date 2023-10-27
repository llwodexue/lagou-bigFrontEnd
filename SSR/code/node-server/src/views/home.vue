<template>
  <div id="app">
    <h2>Home Page</h2>
    <div>{{ count }}</div>
    <button @click="addCount">+1</button>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useHomeStore } from '../store/home'

const homeStore = useHomeStore()
let { count } = storeToRefs(homeStore)

const addCount = () => {
  homeStore.increment()
}
</script>
