<template>
  <div id="app">
    <div>
      <Parcel :config="parcelConfig" :mountParcel="mountParcel" />
      <router-link to="/foo" style="margin-right: 20px;">foo</router-link>
      <router-link to="/bar" style="margin-right: 20px;">bar</router-link>
      <button @click="handleClick">button</button>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import Parcel from "single-spa-vue/dist/esm/parcel"
import { mountRootParcel } from "single-spa"

export default {
  name: "App",
  components: {
    Parcel
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

<style></style>
