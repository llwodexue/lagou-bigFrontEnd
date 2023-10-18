<template>
    <view class="home">
        <top-slider @change="onTabChange" />
        <banner :src="bannerSrc" />
        <countdown :expiredTime="countExpiredTime" />
        <home-recommend v-if="!showVideo" />
        <video-list v-if="showVideo" />
    </view>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { before } from "../../lib/decorator";

// 切换slider的时候，视频 tab下面展示videolist, 其他tab下面展示首页推荐

@Component({})
export default class Home extends Vue {
    readonly BANNER_LIST = [
        "https://img.tukuppt.com//ad_preview/00/11/13/5c9940242bf11.jpg!/fw/780",
        "https://img.tukuppt.com//ad_preview/00/03/56/5c98abb074bdd.jpg!/fw/780",
        "https://img.tukuppt.com//ad_preview/00/10/15/5c992911709f7.jpg!/fw/780",
        "https://img.tukuppt.com//ad_preview/00/19/70/5c9a0504de105.jpg!/fw/780",
        "http://pic.616pic.com/bg_w1180/00/14/61/bjDQ7hTsKA.jpg!/fw/1120",
        "https://img.tukuppt.com//ad_preview/00/10/15/5c992911709f7.jpg!/fw/780",
        "https://img.tukuppt.com//ad_preview/00/19/70/5c9a0504de105.jpg!/fw/780",
        "http://pic.616pic.com/bg_w1180/00/14/61/bjDQ7hTsKA.jpg!/fw/1120"
    ];

    bannerSrc: string = this.BANNER_LIST[0];
    showVideo = false;
    countExpiredTime = new Date("2020/11/22").getTime();

    created() {}

    @before(() => {
        console.log("before onTabChange");
    })
    onTabChange(index: number) {
        if (index === 1) {
            this.showVideo = true;
        } else {
            this.showVideo = false;
        }
        this.bannerSrc = this.BANNER_LIST[index];
    }
}
</script>
<style>
.home {
    padding: 30upx;
}
</style>
