// components/c-lifetime/c-lifetime.js
Component({
  lifetimes: {
    created() {
      console.log('组件被创建created')
    },
    attached() {
      console.log('组件被添加到组件数中atttached')
    },
    detached() {
      console.log('组件被移除组件树中derached')
    }
  }
})
