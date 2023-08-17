import { testOrderSearchEfficiency } from 'hy-algokit'
import sequentSearch from './1.顺序查找'
import binarySearch from './2.二分查找'

const MAX_LENGTH = 10 * 1000 * 1000
const nums = new Array(MAX_LENGTH).fill(0).map((_, i) => i)
const num = MAX_LENGTH / 2

const startTime1 = performance.now()
const index1 = sequentSearch(nums, num)
const endTime1 = performance.now()
console.log('索引为：', index1, '。消耗的时间：', endTime1 - startTime1)

const startTime2 = performance.now()
const index2 = binarySearch(nums, num)
const endTime2 = performance.now()
console.log('索引为：', index2, '。消耗的时间：', endTime2 - startTime2)

testOrderSearchEfficiency(sequentSearch)
testOrderSearchEfficiency(binarySearch)
