<template>
  <view>
    <text v-for="i in 6">{{ text }}</text>
  </view>
</template>

<script>
export default {
  data() {
    return {
      text: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque expedita
    porro molestias non qui. Provident reiciendis, quidem iste eveniet molestias
    doloremque exercitationem rem quam repudiandae aut iusto illum quia dolorem!`,
    };
  },
  onLoad() {
    console.log("onLoad");
  },
  onShow() {
    console.log("onShow");
  },
  onReady() {
    console.log("onReady");
  },
  onHide() {
    console.log("onHide");
  },
  onPullDownRefresh() {
    console.log("onPullDownRefresh");
    setTimeout(() => {
      uni.stopPullDownRefresh();
    }, 1000);
  },
  onReachBottom() {
    console.log("onReachBottom");
  },
  created() {
    console.log("created");
  },
  beforeCreate() {
    console.log("beforeCreate");
  },
  beforeMount() {
    console.log("beforeMount");
  },
  mounted() {
    console.log("mounted");
  },
  destoryed() {
    console.log("destoryed");
  },
  beforeDestory() {
    console.log("beforeDestory");
  },
};
</script>

<style></style>
