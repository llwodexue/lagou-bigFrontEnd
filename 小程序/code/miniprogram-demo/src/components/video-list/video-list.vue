<template>
    <view class="video-container">
        <video
            v-for="item in videoList"
            :key="item"
            :src="item"
            controls
            preload="meta"
        ></video>
    </view>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class Banner extends Vue {
    videoList = [
        "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4",
        "http://vjs.zencdn.net/v/oceans.mp4",
        "https://www.w3school.com.cn/example/html5/mov_bbb.mp4",
        "https://vod-progressive.akamaized.net/exp=1590688030~acl=%2A%2F623661526.mp4%2A~hmac=6a569635b0dfd5f24b6acf31603b99819e0da93534a8a85c5c47caaf46afbfa6/vimeo-prod-skyfire-std-us/01/2684/7/188421287/623661526.mp4"
    ];
}
</script>
<style>
.video-container {
    width: 100%;
    margin-top: 40upx;
}
video {
    margin-top: 20upx;
    width: 100%;
    height: 300upx;
}
</style>
