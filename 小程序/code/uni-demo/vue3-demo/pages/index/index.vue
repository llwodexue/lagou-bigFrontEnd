<template>
  <view class="content">
    <view class="one">
      <!-- #ifdef H5 -->
      <view class="">show H5</view>
      <!-- #endif -->

      <!-- #ifdef MP-WEIXIN -->
      <view class="">show MP-WEIXIN</view>
      <!-- #endif -->
    </view>

    <!-- <view class="two">
      <uni-forms ref="form" :modelValue="formData" :rules="rules">
        <uni-forms-item label="姓名" name="username" required>
          <uni-easyinput
            type="text"
            v-model="formData.username"
            placeholder="请输入姓名" />
        </uni-forms-item>
        <uni-forms-item label="密码" name="password" required>
          <uni-easyinput
            type="password"
            v-model="formData.password"
            placeholder="请输入密码" />
        </uni-forms-item>
      </uni-forms>
      <button class="button" @click="submit">校验表单</button>
      <button @click="reset">重置</button>
    </view> -->

    <view class="three">
      <navigator url="/pages/detail/detail">跳转detail</navigator>
      <button type="default" @click="goToCategory">跳转category</button>
      <button type="default" @click="goToDetail1">跳转detail（正向）</button>
      <button type="default" @click="goToDetail2">跳转detail（逆向）</button>

      <button type="default" @click="goToDetail4">生命周期-选项式API</button>
      <button type="default" @click="goToDetail5">生命周期-组合式API</button>
      <button type="default" @click="goToDetail6">其他API</button>

      <button type="default" @click="goToDetail7">Pinia</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        username: "",
        password: "",
      },
      rules: {
        username: {
          rules: [
            {
              required: true,
              errorMessage: "请输入姓名",
            },
          ],
        },
        password: {
          rules: [
            {
              required: true,
              errorMessage: "请输入密码",
            },
          ],
        },
      },
    };
  },
  onLoad() {
    uni.$on("accpetDataFromDetail", this.accpetDataFromDetail03);
  },
  onUnload() {
    uni.$off("accpetDataFromDetail", this.accpetDataFromDetail03);
  },
  methods: {
    accpetDataFromDetail03() {
      console.log(value);
    },
    submit(form) {
      this.$refs.form
        .validate()
        .then((res) => {
          console.log("表单数据信息：", res);
        })
        .catch((err) => {
          console.log("表单错误信息：", err);
        });
    },
    onload() {
      uni.setNavigationBarTitle({
        title: "uni-app Hello",
      });
      uni.setNavigationBarColor({
        backgroundColor: "#007aff",
      });
    },
    goToCategory() {
      uni.switchTab({
        url: "/pages/category/category",
      });
    },
    goToDetail1() {
      uni.navigateTo({
        url: "/pages/detail/detail?name=bird&age=12",
        success(res) {
          res.eventChannel.emit("accpetDataFromHomePage", {
            data: "我是从Home Page传递过来的数据",
          });
        },
      });
    },
    goToDetail2() {
      uni.navigateTo({
        url: "/pages/detail02/detail02?name=dog&age=6",
        events: {
          accpetDataFromHomePage(data) {
            console.log(data);
          },
        },
      });
    },
    goToDetail3() {
      uni.navigateTo({
        url: "/pages/detail03/detail03",
      });
    },
    goToDetail4() {
      uni.navigateTo({
        url: "/pages/detail04/detail04",
      });
    },
    goToDetail5() {
      uni.navigateTo({
        url: "/pages/detail05/detail05",
      });
    },
    goToDetail6() {
      uni.navigateTo({
        url: "/pages/detail06/detail06",
      });
    },
    goToDetail7() {
      uni.navigateTo({
        url: "/pages/detail07/detail07",
      });
    },
    reset() {
      this.$refs.form.clearValidate();
      Object.keys(this.formData).forEach((key) => {
        this.formData[key] = null;
      });
    },
  },
};
</script>

<style lang="scss">
// weapp app
.uni-forms-item__label {
  color: darkred;
}
// :deep(.uni-forms-item__label) {
// 	color: pink;
// }
</style>
