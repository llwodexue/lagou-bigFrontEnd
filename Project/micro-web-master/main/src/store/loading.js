import { ref } from 'vue'

export let loadingStatus = ref(true)

// 设置loading
export const changeLoading = type => (loadingStatus.value = type)

//  setTimeout(()=>{// 3s 后关闭 loading
//     changeLoading(false)
//  },3000)
