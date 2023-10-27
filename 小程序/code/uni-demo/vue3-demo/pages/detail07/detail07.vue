<template>
  <view>
    <button @click="addNumber">addNumber</button>
    <button @click="subNumber">subNumber</button>
    <view>
      非响应式：<text>{{ count1 }}</text>
    </view>
    <view>
      响应式：{{ count2 }} {{ counterStore.count }}
    </view>
  </view>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useCounterStore } from "@/store/counter.js";

const counterStore = useCounterStore();
const { count: count1 } = useCounterStore();
const { count: count2 } = storeToRefs(counterStore);

const addNumber = () => counterStore.increment();
const subNumber = () => counterStore.decrement();
</script>
