<template>
    <view class="list-page">
        <view class="input-container">
            <input
                type="text"
                v-model="search"
                class="input"
                placeholder="请输入关键字搜索"
            />
        </view>
        <view class="virtual-list-container" v-if="currentList.length">
            <virtual-list :listData="currentList" />
        </view>
    </view>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Service from "../../services/index";
import { DetailInfo } from "../../services/types";
import { measure } from "../../lib/decorator";

// 搜索框
// 各种可滚动的列表项

// 左侧一个正方形方块，里面有个emoji表情
// 右侧是一个区域，上方是tilte， 下方是content的简略版

@Component
export default class List extends Vue {
    // 用户输入的关键字
    search = "";
    // 请求到的原数据
    textList: DetailInfo[] = [];

    // computed属性
    get currentList() {
        // 关键字搜索后, 实际要展示的列表
        return this.textList.filter(
            item => item.title.indexOf(this.search) > -1
        );
    }

    @measure
    async created() {
        this.textList = await Service.getList();
        this.$store.commit("setDetailInfo", this.textList);
    }
}
</script>
<style>
.input-container {
    position: sticky;
    top: 0;

    height: 120upx;
    background: white;
}

.input {
    outline-style: none;
    border: 2upx solid #cccccc;
    border-radius: 6upx;

    padding: 20upx;

    width: 60%;
    margin: 20upx auto;
    font-size: 32upx;
    text-align: center;
}

.virtual-list-container {
    height: 1000upx;
}
</style>
