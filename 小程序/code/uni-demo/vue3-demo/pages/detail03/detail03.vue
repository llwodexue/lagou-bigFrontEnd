<template>
  <view>
    <button type="default" @click="goBackHome">返回</button>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  onLoad(options) {
    console.log("接收url传递过来的数据", options);
  },
  methods: {
    goBackHome() {
      uni.navigateBack({
        delta: 1,
      });
      // 触发一个事件（在触发之前一定要先监听）
      uni.$emit("accpetDataFromDetail", {
        data: {
          des: "这是在detail03传递到Home的数据",
        },
      });
    },
  },
};
</script>

<style></style>
