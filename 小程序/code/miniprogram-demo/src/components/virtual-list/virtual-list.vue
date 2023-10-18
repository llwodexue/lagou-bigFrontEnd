<template>
    <scroll-view
        class="infinite-list-container"
        @scroll="scrollEvent"
        scroll-y="true"
    >
        <view
            class="infinite-list-phantom"
            :style="{ height: listHeight + 'px' }"
        ></view>
        <view class="infinite-list" :style="{ transform: getTransform }">
            <view
                class="infinite-list-item"
                v-for="item in visibleData"
                :key="item.id"
                @click="toDetail(item.id)"
            >
                <view class="left-section">
                    {{ getRandomEmoji() }}
                </view>
                <view class="right-section">
                    <view class="title">{{ item.title }}</view>
                    <view class="desc">{{ item.content }}</view>
                </view>
            </view>
        </view>
    </scroll-view>
</template>

<script lang="ts">
import { Vue, Prop, Watch, Component } from "vue-property-decorator";

@Component
export default class VirtualList extends Vue {
    @Prop({ type: Array, default: () => [] }) listData: any[];
    readonly itemSize: number = 150;
    readonly emojiList = ["😨", "🤡", "👻", "👩", "💖"]; // 0 1 2 3 4

    //可视区域高度
    screenHeight: number = 500;

    //可显示的列表项数
    visibleCount: number = Math.ceil(this.screenHeight / this.itemSize);

    //偏移量
    startOffset: number = 0;
    //起始索引
    start: number = 0;
    //结束索引
    end: number = this.start + this.visibleCount;

    $refs: {
        list: any;
    };

    //列表总高度
    get listHeight() {
        return this.listData.length * this.itemSize;
    }

    //偏移量对应的style
    get getTransform() {
        return `translate3d(0,${this.startOffset}px,0)`;
    }

    //获取真实显示列表数据
    get visibleData() {
        return this.listData.slice(
            this.start,
            Math.min(this.end, this.listData.length)
        );
    }

    getRandomEmoji() {
        // 获取随机的emoji表情
        const randomIndex = Math.floor(Math.random() * 5); // [0, 1) => [0, 5)
        return this.emojiList[randomIndex];
    }

    toDetail(id: number) {
        uni.navigateTo({
            url: `/pages/detail/index?id=${id}`
        });
    }

    scrollEvent(e: any) {
        //当前滚动位置
        let scrollTop = e.detail.scrollTop;
        //此时的开始索引
        this.start = Math.floor(scrollTop / this.itemSize);
        //此时的结束索引
        this.end = this.start + this.visibleCount;
        //此时的偏移量
        this.startOffset = scrollTop - (scrollTop % this.itemSize);
    }
}
</script>

<style>
.infinite-list-container {
    height: 100%;
    overflow: auto;
    position: relative;
    -webkit-overflow-scrolling: touch;
}

.infinite-list-phantom {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    z-index: -1;
}

.infinite-list {
    left: 0;
    right: 0;
    top: 0;
    position: absolute;
    text-align: center;
}

.infinite-list-item {
    background: white;
    box-shadow: 0 0 20upx rgba(144, 144, 144, 0.15);
    height: 200upx;
    border-radius: 10upx;

    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20upx;
    margin-top: 30upx;
}

.list-item {
    background: white;
    box-shadow: 0 0 20upx rgba(144, 144, 144, 0.15);
    height: 200upx;
    border-radius: 10upx;

    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20upx;
    margin-top: 30upx;
}

.left-section {
    width: 140upx;
    height: 140upx;
    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 50upx;
    font-weight: bold;
    color: white;
    background: #6ab6fc;
    border-radius: 20upx;
}

.right-section {
    margin-left: 20upx;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    flex-direction: column;
}

.title {
    font-size: 28upx;
    font-weight: 500;
    text-align: left;
}

.desc {
    margin-top: 20upx;
    font-size: 24upx;
    font-weight: 400;
    text-align: left;

    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    overflow: hidden;
    -webkit-box-orient: vertical;
}
</style>
