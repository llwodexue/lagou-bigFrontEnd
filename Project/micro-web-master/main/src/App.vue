<template>
  <Header />
  <MainNav />
  <div class="sub-container">
    <Loading v-show="loading" />
    <!-- <div v-show="!loading" id="sub-container">子应用内容</div> -->
    <!-- 修改如下 -->
    <div v-show="!loading" id="micro-container">子应用内容</div>
  </div>
  <Footer />
</template>

<script>
import { ref } from 'vue'

import Header from "./components/Header";
import MainNav from "./components/MainNav";
import Loading from "./components/Loading";
import Footer from "./components/Footer";

import {loading} from './store'

export default {
  name: 'App',
  components: {
    Header,
    MainNav,
    Loading,
    Footer
  },
  setup() {
    // 声明双向数据ref

    // const loading = ref(true)

    // setTimeout(()=>{// 3s 后关闭 loding
    //   loading.value = false
    // },3000)

    return {
      loading:loading.loadingStatus,
    }
  }
}
</script>

<style>
html,
body,
#micro_web_main_app {
  width: 100%;
height: 100%;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.sub-container {
  min-height: 100%;
  position: relative;
}

#micro-container{
  min-height: 100%;
  width: 100%;
}
</style>
