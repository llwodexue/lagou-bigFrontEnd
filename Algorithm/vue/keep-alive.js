// <keep-alive> 组件的实现也是一个对象
export default {
  name: 'keep-alive',
  // 抽象组件
  abstract: true,

  props: {
    // 只有名称匹配的组件才会被缓存
    include: patternTypes,
    // 任何名称匹配的组件都不会被缓存
    exclude: patternTypes,
    // 缓存组件的最大数量, 因为我们缓存的是vnode对象，它也会持有DOM，当我们缓存很多的时候，会比较占用内存，所以该配置允许我们指定缓存大小
    max: [String, Number]
  },

  created() {
    // 初始化存储缓存的cache对象和缓存 vNode 键的数组
    this.cache = Object.create(null)
    this.keys = []
  },

  //  destroyed 中销毁所有cache中的组件实例
  destroyed() {
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },

  mounted() {
    // 监听 include 和 exclude的变化，在变化的时候重新调整 cache的内容
    // 其实就是对 cache 做遍历，发现缓存的节点名称和新的规则没有匹配上的时候，就把这个缓存节点从缓存中摘除
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name))
    })
  },
  // 自定义render函数
  render() {
    /*
     * 获取第一个子元素的 vnode
     * 由于我们也是在 <keep-alive> 标签内部写 DOM，所以可以先获取到它的默认插槽，然后再获取到它的第一个子节点。<keep-alive> 只处理第一个子元素，所以一般和它搭配使用
     * 的有 component 动态组件或者是 router-view，这点要牢记。
     */
    const slot = this.$slots.default
    const vnode: VNode = getFirstComponentChild(slot)

    const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions
    if (componentOptions) {
      // check pattern
      // 判断当前组件名称和 include、exclude 的关系：
      const name: ?string = getComponentName(componentOptions)
      const { include, exclude } = this

      // matches就是做匹配，分别处理了数组、字符串、正则表达式的情况
      // 组件名如果满足了配置 include 且不匹配或者是配置了 exclude 且匹配，那么就直接返回这个组件的 vnode，否则的话走下一步缓存：
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      const { cache, keys } = this
      const key: ?string =
        vnode.key == null
          ? // same constructor may get registered as different local components
            // so cid alone is not enough (#3269)
            componentOptions.Ctor.cid +
            (componentOptions.tag ? `::${componentOptions.tag}` : '')
          : vnode.key
      // 如果命中缓存，则直接从缓存中拿 vnode 的组件实例，并且重新调整了 key 的顺序放在了最后一个
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance
        // make current key freshest
        // 使用 LRU 缓存策略，把key移除，同时加在最后面
        remove(keys, key)
        keys.push(key)
      } else {
        // 没有命中缓存，则把 vnode设置进缓存
        cache[key] = vnode
        keys.push(key)
        // prune oldest entry
        // 配置了max 并且缓存的长度超过了 this.max，则要从缓存中删除第一个
        if (this.max && keys.length > parseInt(this.max)) {
          // 除了从缓存中删除外，还要判断如果要删除的缓存并的组件 tag 不是当前渲染组件 tag，也执行删除缓存的组件实例的 $destroy 方法。
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
      }
      // keepAlive标记位
      vnode.data.keepAlive = true
    }
    return vnode || (slot && slot[0])
  }
}

function pruneCacheEntry(
  cache: VNodeCache,
  key: string,
  keys: Array<string>,
  current?: VNode
) {
  const cached = cache[key]
  if (cached && (!current || cached.tag !== current.tag)) {
    cached.componentInstance.$destroy()
  }
  cache[key] = null
  remove(keys, key)
}
