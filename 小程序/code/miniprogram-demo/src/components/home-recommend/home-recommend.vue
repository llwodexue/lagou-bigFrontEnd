<template>
    <view class="home-recommend">
        <h3>推荐</h3>
        <view class="recommend-container">
            <view
                class="recommend-item"
                v-for="(item, index) in list"
                :key="item.text"
                :class="{ 'recommend-hover': index === activeIndex }"
                @click="onClick(index)"
            >
                <img :src="item.image" />
                <view>{{ item.text }}</view>
            </view>
        </view>
    </view>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { HomeRecommendListItem } from "../../services/types";
import Service from "../../services/index";

// 口口口
// 口口口
// 口口口

// 点击动作 点击的时候，能让用户更明显的看出点击了哪个,模拟点击按下去的效果

@Component
export default class HomeRecommend extends Vue {
    list: HomeRecommendListItem[] = [];
    activeIndex = -1;

    onClick(index: number) {
        this.activeIndex = index;
        setTimeout(() => {
            uni.navigateTo({
                url: `/pages/list/index`, // 注意这里不能写pages/list/index, 如果这样写会被默认跳转到pages/index/pages/list/index
                success: result => console.log(result),
                fail: result => console.log(result)
            });
        }, 200);
    }

    async created() {
        this.list = await Service.getHomeRecommendList();
    }
}
</script>
<style>
.recommend-hover {
    transform: translate3d(2upx, 2upx, 0);
}

h3 {
    font-size: 32upx;
    font-weight: bold;
}

.recommend-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
.recommend-item {
    width: 212upx;
    height: 212upx;
    margin-bottom: 60upx;

    background: gray;
    border-radius: 10upx;

    box-shadow: 0 20upx 40upx -8upx rgba(106, 182, 252, 0.5);
}

img {
    border-radius: 10upx;
    width: 100%;
    height: 100%;
}
</style>
