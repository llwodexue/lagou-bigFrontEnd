<template>
    <view class="detail-root">
        <view class="detail">
            <img :src="image" class="detail-banner" />
            <view class="content-container">
                <h1>{{ title }}</h1>
                <view class="content">{{ content }}</view>
            </view>
        </view>
    </view>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { DetailInfo } from "../../services/types";

// 头图
// 标题
// 正文

@Component
export default class Detail extends Vue {
    title = "";
    content = "";
    image = "";

    onLoad(options: any) {
        const storeData = this.$store.state.detailInfos as DetailInfo[];
        const currentData = storeData.filter(
            item => String(item.id) === options.id
        )[0];
        this.title = currentData.title;
        this.content = currentData.content;
        this.image = currentData.image;
    }
}
</script>
<style>
.detail-root {
    position: relative;
    height: 100vh;
}
.detail-banner {
    width: 100%;
}

.content {
    white-space: pre-wrap;
    text-align: left;
}
</style>
