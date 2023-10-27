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
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.emit("accpetDataFromHomePage", {
        data: "向主页面传递数据",
      });
    },
  },
};
</script>

<style></style>
