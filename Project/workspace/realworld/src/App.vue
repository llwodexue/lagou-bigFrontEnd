<template>
  <div id="app">
    <div>
      <Parcel :config="parcelConfig" :mountParcel="mountParcel" />
      <router-link to="/foo" style="margin-right: 20px;">foo</router-link>
      <router-link to="/bar" style="margin-right: 20px;">bar</router-link>
      <button @click="handleClick">button</button>
    </div>
    <router-view></router-view>

    <Child/>
    <h2>父组件h2</h2>
    <h3>父组件h3</h3>
  </div>
</template>

<script>
import Parcel from "single-spa-vue/dist/esm/parcel"
import { mountRootParcel } from "single-spa"
import Child from './components/Child'

export default {
  name: "App",
  components: {
    Parcel,
    Child
  },
  data() {
    return {
      parcelConfig: window.System.import("@study/navbar"),
      mountParcel: mountRootParcel
    }
  },
  methods: {
    async handleClick() {
      const toolsModule = await window.System.import("@study/tools")
      toolsModule.sayHello("@study/realworld")
    }
  },
  async mounted() {
    const toolsModule = await window.System.import("@study/tools")
    toolsModule.sharedSubject.subscribe(console.log)
  }
}
</script>

<style scoped>
h3 {
  background-color: red;
}
</style>
<style>
h2 {
  background-color: red;
}
</style>