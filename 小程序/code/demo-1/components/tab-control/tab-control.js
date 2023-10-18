// components/tab-control/tab-control.js
Component({
  properties: {
    titles: {
      type: Array,
      value: []
    }
  },
  data: {
    currentIndex: 0
  },
  methods: {
    onItemTap(event) {
      const currentIndex = event.currentTarget.dataset.index
      this.setData({ currentIndex })

      this.triggerEvent('indexChange', currentIndex)
    },
    test() {
      console.log('测试组件方法')
    }
  }
})
