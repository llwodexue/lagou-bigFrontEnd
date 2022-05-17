let _Vue = null

export default class VueRouter {
  static install(Vue) {
    // *1.判断当前插件是否已经被安装
    if (VueRouter.install.installed) {
      return
    }
    VueRouter.install.installed = true

    // *2.把Vue构造函数记录到全局变量
    _Vue = Vue

    // *3.把创建Vue实例时候传入的router对象注入到Vue实例上
    // 此时的this是VueRouter，而不是Vue实例，这时就需要用到混入
    _Vue.mixin({
      beforeCreate() {
        // 如果是Vue实例才会执行，组件就不执行了
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router
          this.$options.router.init()
        }
      }
    })
  }
  constructor(options) {
    this.options = options
    // 记录路径和对应的组件
    this.routeMap = {}
    this.data = _Vue.observable({
      // 当前默认路径
      current: '/'
    })
  }
  init() {
    this.createRouteMap()
    this.initComponents(_Vue)
    this.initEvent()
  }
  createRouteMap() {
    // 遍历所有的路由规则，把路由规则解析成键值对的形式，存储到routeMap中
    this.options.routes.forEach(route => {
      // 记录路径和组件的映射关系
      this.routeMap[route.path] = route.component
    })
  }
  initComponents(Vue) {
    Vue.component('router-link', {
      props: {
        to: String
      },
      render(h) {
        return h(
          'a',
          {
            attrs: {
              href: this.to
            },
            on: {
              click: this.clickHandler
            }
          },
          [this.$slots.default]
        )
      },
      methods: {
        clickHandler(e) {
          // 改变浏览器地址栏且不像服务器发送请求
          history.pushState({}, 'title', this.to)
          // 加载对应的路径，current是响应式对象
          this.$router.data.current = this.to
          e.preventDefault()
        }
      }
      // template: '<a :href="to"><slot></slot></a>'
    })
    const self = this
    Vue.component('router-view', {
      render(h) {
        // 先找到路由地址，再根据该地址去routeMap找到对应组件，再调用h函数转换成虚拟DOM
        const component = self.routeMap[self.data.current]
        return h(component)
      }
    })
  }
  initEvent() {
    window.addEventListener('popstate', () => {
      this.data.current = window.location.pathname
    })
  }
}
