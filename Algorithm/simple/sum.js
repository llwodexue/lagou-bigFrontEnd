const arr = [13, 1, 2, 5, 3, 8, 11]
const sum = 18

// O(n^2)
// function findSum(arr, sum) {
//   for (let i = 0; i < arr.length; i++) {
//     for (let j = 0; j < arr.length; j++) {
//       if (i !== j && arr[i] + arr[j] == sum) {
//         console.log(arr[i], arr[j])
//       }
//     }
//   }
// }

// O(n)
function findSum(arr, sum) {
  let obj = {}
  arr.forEach((v, i) => {
    if (String(v) in obj) {
      console.log(v, obj[v])
    }
    obj[sum - v] = i
  })
}

console.log(findSum(arr, sum))
