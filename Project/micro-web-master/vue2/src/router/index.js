import Vue from 'vue'
import VueRouter from 'vue-router';
import Energy from '../pages/energy';

Vue.use(VueRouter)

const routes = [
    {
        path:'/energy',// 新能源页面
        name:'Energy',
        component: Energy
    }
]


// 创建router实例
const router = new VueRouter({
    mode: 'hash', // 使用hash 路由
    routes
})

export default router // 暴露当前路由并导出