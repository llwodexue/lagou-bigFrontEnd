<template>
  <view class="">
    接口请求
    <button @click="fetchData">发起请求</button>
  </view>
  <view class="">
    数据的存储
    <button @click="setStorage">数据存储</button>
    <button @click="getStorage">获取数据</button>

    <my-button type="info" @onBtnClick="onBtnClick">myButtonSetup</my-button>
  </view>
</template>

<script>
import { getBanner } from "@/service/home.js";

export default {
  data() {
    return {};
  },
  methods: {
    onBtnClick() {
      console.log("onBtnClick");
    },
    setStorage() {
      uni.setStorage({
        key: "userinfo",
        data: {
          name: "bird",
          id: 111,
        },
      });
    },
    getStorage() {
      uni.getStorage({
        key: "userinfo",
        success(res) {
          console.log(res);
        },
      });
    },
    fetchData() {
      getBanner().then((res) => {
        console.log(res);
      });
    },
  },
};
</script>

<style></style>
