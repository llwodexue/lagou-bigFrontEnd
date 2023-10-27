<template>
  <view>
    <text v-for="i in 6">{{ text }}</text>
  </view>
</template>

<script setup>
import { ref } from "vue";
import {
  onLoad,
  onShow,
  onReady,
  onHide,
  onUnload,
  onPullDownRefresh,
  onReachBottom,
} from "@dcloudio/uni-app";

const text =
  ref(`Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque expedita
    porro molestias non qui. Provident reiciendis, quidem iste eveniet molestias
    doloremque exercitationem rem quam repudiandae aut iusto illum quia dolorem!`);

onLoad(() => {
  console.log("onLoad");
});
onShow(() => {
  console.log("onShow");
});
onReady(() => {
  console.log("onReady");
});
onHide(() => {
  console.log("onHide");
});
onPullDownRefresh(() => {
  console.log("onPullDownRefresh");
  setTimeout(() => {
    uni.stopPullDownRefresh();
  });
});
onReachBottom(() => {
  console.log("onReachBottom");
});
</script>

<style></style>
