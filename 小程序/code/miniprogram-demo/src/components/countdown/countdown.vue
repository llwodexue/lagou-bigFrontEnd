<template>
    <view>
        <view class="current-date"> 当前时间: {{ getCurrentDate() }} </view>

        <view class="countdown-ontainer">
            <view class="countdown-circle">
                <view class="value">{{ days }}</view>

                <view class="label">天</view>
            </view>
            <view class="countdown-circle">
                <view class="value">{{ hours }}</view>

                <view class="label">时</view>
            </view>
            <view class="countdown-circle">
                <view class="value">{{ miniutes }}</view>

                <view class="label">分</view>
            </view>
            <view class="countdown-circle">
                <view class="value">{{ seconds }}</view>

                <view class="label">秒</view>
            </view>
        </view>
    </view>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { DateFormat } from "../../lib/date";
import { getTestScheme } from "../../lib/abtest";

@Component
export default class Countdown extends Vue {
    @Prop({ type: Number }) expiredTime: number;

    days: string = "";
    hours: string = "";
    miniutes: string = "";
    seconds: string = "";
    timer: any = null;

    timeInterval = 1000;

    getCurrentDate() {
        const res = getTestScheme("ab_dateformat", [
            {
                key: "0",
                data: "YYYY-MM-DD"
            },
            {
                key: "1",
                data: "YYYY.MM.DD HH:mm:ss"
            },
            {
                key: "2",
                data: "YYYY.MM.DD"
            }
        ]);

        return DateFormat.format(Date.now(), res.data);
    }

    created() {
        this.timer = setTimeout(this.countDown, this.timeInterval);
    }

    countDown() {
        const leftTime = Math.max(this.expiredTime - Date.now(), 0);
        this.timestampToCountDown(leftTime);
        this.timer = setTimeout(this.countDown, this.timeInterval);
    }

    timestampToCountDown(time: number) {
        if (!time) {
            return;
        }
        const timeSeconds = Math.floor(time / 1000);
        const t = Math.max(timeSeconds, 0);
        this.days = DateFormat.toTwoDigit(Math.floor(t / 60 / 60 / 24));
        this.hours = DateFormat.toTwoDigit(Math.floor((t / 60 / 60) % 24));
        this.miniutes = DateFormat.toTwoDigit(Math.floor((t / 60) % 60));
        this.seconds = DateFormat.toTwoDigit(Math.floor(t % 60));
    }

    beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
}
</script>
<style>
.current-date {
    text-align: center;
    font-weight: bold;
}

.countdown-ontainer {
    width: 100%;
    margin: 50upx 0;

    display: flex;
    align-items: center;
    justify-content: space-around;
}

.countdown-circle {
    border-radius: 50%;
    border: 1px solid #7b7571;
    color: #7b7571;
    width: 100upx;
    height: 100upx;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.label {
    font-size: 28upx;
}
.value {
    font-size: 40upx;
    font-weight: bold;
}
</style>
