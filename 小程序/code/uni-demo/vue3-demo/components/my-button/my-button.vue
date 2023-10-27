<template>
  <view :class="['my-btn', type]" @click="handleBtnClick">
    <slot></slot>
  </view>
</template>

<script setup>
import { onMounted } from "vue";
import { onLoad, onReady } from "@dcloudio/uni-app";
const props = defineProps({
  type: {
    type: String,
    default: "default",
  },
});
const emit = defineEmits(["onBtnClick"]);
function handleBtnClick() {
  emit("onBtnClick", {});
}

onMounted(() => {
  console.log("onMounted");
});
onLoad(() => {
  console.log("onLoad");
});
onReady(() => {
  console.log("onReady");
});
</script>

<style lang="scss">
.my-btn {
  padding: 20rpx 0;
  font-size: 40rpx;
  color: white;
  text-align: center;
  border-radius: 10rpx;
}
.default {
  background-color: #cdcdcd;
}
.primary {
  background-color: greenyellow;
}
.info {
  background-color: coral;
}
</style>
