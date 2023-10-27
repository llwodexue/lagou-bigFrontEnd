<template>detail</template>

<script>
export default {
  data() {
    return {};
  },
  onLoad(options) {
    console.log("接收到的参数", options);
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("accpetDataFromHomePage", (data) => {
      console.log(data);
    });
  },
};
</script>

<style></style>
