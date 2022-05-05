var arr = [12, 34, 32, 89, 4]

arr.sort((a, b) => a - b)[0]
arr.reduce((acc, cur) => (acc > cur ? cur : acc))
Math.min(...arr)