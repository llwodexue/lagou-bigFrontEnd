## 数据响应式核心原理

**数据驱动**

- 数据响应式

  数据模型仅仅是普通的 JavaScript 对象，而当我们修改数据时，视图会进行更新，避免了繁琐的 DOM 操作，提高开发效率

- 双向绑定

  数据改变，视图改变；视图改变，数据也随之改变

  我们可以使用 `v-model` 在表单元素上创建双向数据绑定

- 数据驱动是 Vue 最独特的特性之一

  开发过程中仅需要关注数据本身，不需要关心数据是如何渲染到视图

### Vue 2.x

- [Vue 2.x深入响应式原理](https://cn.vuejs.org/v2/guide/reactivity.html)
- [MDN - Object.defineProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
- 浏览器兼容 IE8 以上（不兼容 IE8）

```js
// 模拟 Vue 中的 data 选项
let data = {
  msg: 'hello'
}

// 模拟 Vue 的实例
let vm = {}

// 数据劫持：当访问或者设置 vm 中的成员的时候，做一些干预操作
Object.defineProperty(vm, 'msg', {
  // 可枚举（可遍历）
  enumerable: true,
  // 可配置（可以使用 delete 删除，可以通过 defineProperty 重新定义）
  configurable: true,
  // 当获取值的时候执行
  get () {
    console.log('get: ', data.msg)
    return data.msg
  },
  // 当设置值的时候执行
  set (newValue) {
    console.log('set: ', newValue)
    if (newValue === data.msg) {
      return
    }
    data.msg = newValue
    // 数据更改，更新 DOM 的值
    document.querySelector('#app').textContent = data.msg
  }
})

// 测试
vm.msg = 'Hello World'
console.log(vm.msg)
```

如果一个对象中多个属性需要转换 `getter/setter` 如何处理？

- 遍历 `data` 中的所有属性，添加 `getter/setter`

### Vue 3.x

- [MDN - Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

- 直接监听对象，而非属性

  因此把多个属性转换成 `getter/setter` 时，不需要循环

- ES6 中新增，IE 不支持，性能由浏览器优化

```js
// 模拟 Vue 中的 data 选项
let data = {
  msg: 'hello',
  count: 0
}

// 模拟 Vue 实例
let vm = new Proxy(data, {
  // 执行代理行为的函数
  // 当访问 vm 的成员会执行
  get (target, key) {
    console.log('get, key: ', key, target[key])
    return target[key]
  },
  // 当设置 vm 的成员会执行
  set (target, key, newValue) {
    console.log('set, key: ', key, newValue)
    if (target[key] === newValue) {
      return
    }
    target[key] = newValue
    document.querySelector('#app').textContent = target[key]
  }
})

// 测试
vm.msg = 'Hello World'
console.log(vm.msg)
```

## 发布订阅和观察者模式

### 发布订阅模式

- 订阅者
- 发布者
- 信号中心

发布订阅：我们假定，存在一个 "信号中心"，某任务执行完成，就向信号中心 "发布"（publish） 一个信号，其他任务可以向信号中心 "订阅"（subscribe），从而知道什么时候自己可以开始执行

[Vue 的自定义事件](https://cn.vuejs.org/v2/guide/migration.html#dispatch-%E5%92%8C-broadcast-%E6%9B%BF%E6%8D%A2)

```js
// Vue 自定义事件
let vm = new Vue()

// 注册事件(订阅消息)
vm.$on('dataChange', () => {
  console.log('dataChange')
})
vm.$on('dataChange', () => {
  console.log('dataChange1')
})

// 触发事件(发布消息)
vm.$emit('dataChange')
```

- 模拟 Vue 自定义事件的实现

```js
// 事件触发器
class EventEmitter {
  constructor() {
    // { 'click': [fn1, fn2], 'change': [fn] }
    this.subs = Object.create(null)
  }
  // 注册事件
  $on(eventType, handler) {
    this.subs[eventType] = this.subs[eventType] || []
    this.subs[eventType].push(handler)
  }
  // 触发事件
  $emit(eventType) {
    if (this.subs[eventType]) {
      this.subs[eventType].forEach(handler => {
        handler()
      })
    }
  }
}

let bus = new EventEmitter()
bus.$on('click', () => {
  console.log('click1')
})
bus.$on('click', () => {
  console.log('click2')
})
bus.$emit('click')
```

### 观察者模式

- 观察者（订阅者）—— Watcher
  - `update()`：当事件发生时，具体要做的事情
- 目标（发布者）—— Dep
  - `subs 数组`：存储所有的观察者
  - `addSub()`：添加观察者
  - `notify()`：当事情发生，调用所有观察者的 `update()` 方法
- 没有事件中心

```js
// 发布者-目标
class Dep {
  constructor() {
    // 记录所有的订阅者
    this.subs = []
  }
  // 添加订阅者
  addSub(sub) {
    if (sub && sub.update) {
      this.subs.push(sub)
    }
  }
  // 发布通知
  notify() {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}
// 订阅者-观察者
class Watcher {
  update() {
    console.log('update')
  }
}

let dep = new Dep()
let watcher = new Watcher()
dep.addSub(watcher)
dep.notify()
```

**总结**

- **观察者模式** 是由具体目标调度，比如当事件触发，Dep 就会去调用观察者的方法，所以观察者模式的订阅者与发布者之间是存在依赖的

- **发布订阅模式** 由统一调度中心调用，因此发布者和订阅者不需要知道对方的存在

  事件中心的作用：隔离发布者和订阅者，去除它们之间的依赖

![image-20220519103820292](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220519103820292.png)

## Vue 响应式原理模拟

Vue 采用数据劫持结合发布订阅的方式，通过`Object.defineProperty`劫持 data 属性中的 getter 和 setter，在数据变动时发布消息给订阅者，触发相应的回调

![image-20220520162440942](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220520162440942.png)

- Vue

  把 data 中的成员注入到 Vue 实例，并且把 data 中的成员转换成 getter/setter

- Observer 数据劫持

  能够对数据的所有属性进行监听，如有变动可拿到最新值并通知 Dep

- Compiler 解析指令

  解析每个元素中的指令/插值表达式，并替换成相应的数据

- Dep 发布者

  添加观察者（watcher），当数据变化通知所有观察者

- Watcher 观察者

  数据变化更新视图

### Vue

**功能**

- 负责接收初始化的参数（选项）
- 负责把 data 中的属性注入到 Vue 实例，转换成 getter/setter
- 负责调用 observer 监听 data 中所有属性的变化
- 负责调用 compiler 解析指令/差值表达式

![image-20220519103748667](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220519103748667.png)

```js
class Vue {
  constructor(options) {
    // 1.通过属性保存选项的数据
    this.options = options || {}
    this.$data = options.data || {}
    this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el

    // 2.把data中的成员转换成getter和setter，注入到vue实例中
    this._proxyData(this.$data)

    // 3.调用observer对象，监听数据的变化
    new Observer(this.$data)

    // 4.调用compiler对象，解析指令和差值表达式
    new Compiler(this)
  }
  _proxyData(data) {
    // 遍历data中的所有属性
    Object.keys(data).forEach(key => {
      // 把data的属性注入到vue实例中
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key]
        },
        set(newValue) {
          if (newValue === data[key]) {
            return
          }
          data[key] = newValue
        }
      })
    })
  }
}
```

![image-20220519154316595](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220519154316595.png)

### Observer

**功能**

- 负责把 data 选项中的属性转换成响应式的数据
- data 中的某个属性也是对象，把改属性转换成响应式数据
- 数据变化发送通知

![image-20220519112916746](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220519112916746.png)

注意：`defineReactive` 需要传递第三个参数 `val` 形成闭包，不然直接使用 `obj[key]` 会形成死递归

```js
class Observer {
  constructor(data) {
    this.walk(data)
  }
  walk(data) {
    // 1.判断data是否是对象
    if (!data || typeof data !== 'object') {
      return
    }
    // 2.遍历data对象的所有属性
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }
  defineReactive(obj, key, val) {
    let that = this
    // 负责收集依赖，并发送通知
    let dep = new Dep()
    // 如果val是对象，把val内部的属性转换成响应式对象
    this.walk(val)
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 收集依赖
        Dep.target && dep.addSub(Dep.target)
        return val
      },
      set(newValue) {
        if (newValue === val) {
          return
        }
        val = newValue
        that.walk(newValue)
        // 发送通知
        dep.notify()
      }
    })
  }
}
```

![image-20220519160621438](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220519160621438.png)

这里有两个问题：

1. 如果 data 中的某个属性是对象，则需要继续遍历让其内部属性转换成响应式数据
2. 如果 data 中的某个属性重新赋值，需要该属性的也变成响应式

### Compiler

**功能**

- 负责编译模板，解析指令/差值表达式
- 负责页面的首次渲染
- 当数据变化后重新渲染视图

![image-20220519162356804](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220519162356804.png)

```js
class Compiler {
  constructor(vm) {
    this.el = vm.$el
    this.vm = vm
    this.compile(this.el)
  }
  // 编译模板，处理文本节点的差值表达式和元素节点的指令
  compile(el) {
    let childNodes = el.childNodes
    Array.from(childNodes).forEach(node => {
      if (this.isTextNode(node)) {
        // 处理文本节点
        this.compileText(node)
      } else if (this.isElementNode(node)) {
        // 处理元素节点
        this.compileElement(node)
      }

      // 判断node节点，是否有子节点，如果有子节点，要递归调用compile
      if (node.childNodes && node.childNodes.length) {
        this.compile(node)
      }
    })
  }
  // 编译元素节点，处理指令
  compileElement(node) {
    // 遍历所有的属性节点
    Array.from(node.attributes).forEach(attr => {
      // 判断是否是指令
      let attrName = attr.name
      if (this.isDirective(attrName)) {
        // v-text -> text
        attrName = attrName.substr(2)
        let key = attr.value
        // 对指令进行操作，如果使用if语句进行判断，代码量会非常大
        this.update(node, key, attrName)
      }
    })
  }
  update(node, key, attrName) {
    let updateFn = this[attrName + 'Updater']
    updateFn && updateFn.call(this, node, this.vm[key], key)
  }
  // 处理v-text指令
  textUpdater(node, value, key) {
    node.textContent = value
    new Watcher(this.vm, key, newValue => {
      node.textContent = newValue
    })
  }
  // 处理v-model指令
  modelUpdater(node, value, key) {
    node.value = value
    new Watcher(this.vm, key, newValue => {
      node.value = newValue
    })
  }
  // 编译文本节点，处理差值表达式
  compileText(node) {
    // {{  msg }}
    let reg = /\{\{(.+?)\}\}/
    let value = node.textContent
    if (reg.test(value)) {
      // console.dir(RegExp)
      let key = RegExp.$1.trim()
      node.textContent = value.replace(reg, this.vm[key])

      // 创建watcher对象，当数据改变更新视图
      new Watcher(this.vm, key, newValue => {
        node.textContent = newValue
      })
    }
  }
  // 判断元素属性是否是指令
  isDirective(attrName) {
    return attrName.startsWith('v-')
  }
  // 判断节点是否是文本节点
  isTextNode(node) {
    return node.nodeType === 3
  }
  // 判断节点是否是元素节点
  isElementNode(node) {
    return node.nodeType === 1
  }
}
```

### Dep（Dependency）

**功能**

- 收集依赖，添加观察者（watcher）
- 通知所有观察者

![image-20220520162459655](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220520162459655.png)

```js
class Dep {
  constructor() {
    // 存储所有的观察者
    this.subs = []
  }
  // 添加观察者
  addSub(sub) {
    if (sub && sub.update) {
      this.subs.push(sub)
    }
  }
  // 发送通知
  notify() {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}
```

### Watcher

![image-20220522154738419](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220522154738419.png)

- data 中的对象在　getter 中通过 Dep 对象收集依赖，在 setter 中触发依赖
- data 中的每一个属性都要创建一个对应的 Dep 对象，在收集依赖时把依赖数据的 watcher 添加到 Dep 对象的 `subs` 数组中，在触发依赖时调用 Dep 对象的 `notify` 发送通知通知所有 wathcer 对象更新视图

**功能**

- 当数据变化触发依赖，dep 通知所有的 Watcher 实例更新视图
- 自身实例化的时候往 dep　对象中添加自己

![image-20220522155102274](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220522155102274.png)

```js
class Watcher {
  constructor(vm, key, cb) {
    // Vue实例
    this.vm = vm
    // data中的属性名称
    this.key = key
    // 回调函数负责更新视图
    this.cb = cb

    // 把watcher对象记录到Dep类的静态属性target
    Dep.target = this
    // 触发get方法，在get方法中会调用addSub
    this.oldValue = vm[key]
    // 防止将来重复添加
    Dep.target = null
  }
  // 当数据发生变化时更新视图
  update() {
    let newValue = this.vm[this.key]
    if (this.oldValue === newValue) {
      return
    }
    this.cb(newValue)
  }
}
```

### 双向绑定

至此直接修改 `vm.msg` 的值，使用差值表达式、`v-text` 以及 `v-model` 绑定的值都发生修改，响应式机制就已经实现了，但是直接修改 input 的值 `vm.msg` 的值并没有修改

```js
class Compiler {
  // 处理v-model指令
  modelUpdater(node, value, key) {
    node.value = value
    new Watcher(this.vm, key, newValue => {
      node.value = newValue
    })
    // 双向绑定
    node.addEventListener('input', () => {
      this.vm[key] = node.value
    })
  }
}
```

## 调试

1. 调试页面首次渲染的过程
2. 调试数据改变更新视图的过程

### 首次渲染

**调用 Observer 对象**

在调用 Observer 之前，会先把 data 中的成员转换成 `getter/setter`

![vue响应式调试1](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/vue%E5%93%8D%E5%BA%94%E5%BC%8F%E8%B0%83%E8%AF%951.jpg)

当 Observer 对象创建过后，内部调用 `walk` 方法会把 `this.$data` 所有的属性转换成 `getter/setter`

![vue响应式调试2](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/vue%E5%93%8D%E5%BA%94%E5%BC%8F%E8%B0%83%E8%AF%952.jpg)

**调用 Compiler 对象处理文本节点**

在 `compile` 方法会先遍历 DOM 对象的子节点，并判断对应的子节点是文本节点还是元素节点

![vue响应式调试3](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/vue%E5%93%8D%E5%BA%94%E5%BC%8F%E8%B0%83%E8%AF%953.jpg)

找到差值表达式对应的节点 h3（这个节点没有属性但是有子节点），并进入 `compileText` 处理这个文本节点，在调用 `this.vm[key]` 时会触发 `vue.js` 中的 `getter` 方法

![vue响应式调试4](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/vue%E5%93%8D%E5%BA%94%E5%BC%8F%E8%B0%83%E8%AF%954.jpg)

在调用 `data[key]` 时会触发 `observer.js` 中的 `getter` 方法

![vue响应式调试5](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/vue响应式调试5.jpg)

由于 `Dep.target` 没有值，会直接返回 val，至此差值表达式就处理完毕了

![vue响应式调试6](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/vue%E5%93%8D%E5%BA%94%E5%BC%8F%E8%B0%83%E8%AF%956.jpg)

**调用 Watcher 对象**

创建了一个 watcher 对象，作用是：当数据更新时

![vue响应式调试7](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/vue%E5%93%8D%E5%BA%94%E5%BC%8F%E8%B0%83%E8%AF%957.jpg)

添加 `Dep.target`，之后访问 `vm[key]` 触发 `vue.js` 中的 `getter` 方法，之后调用 `data[key]` 调用 `observer.js` 中的 `getter` 方法

![vue响应式调试8](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/vue%E5%93%8D%E5%BA%94%E5%BC%8F%E8%B0%83%E8%AF%958.jpg)

此时 `Dep.target` 就有值，并把 watcher 对象添加到 `subs` 数组中，最后把 val 返回，再把 `Dep.target` 设置为 null 防止重复添加

![vue响应式调试9](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/vue%E5%93%8D%E5%BA%94%E5%BC%8F%E8%B0%83%E8%AF%959.jpg)

**调用 Compiler 对象处理元素节点**

执行 `update` 这里 `this.vm[key]` 不会收集依赖

![vue响应式调试10](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/vue%E5%93%8D%E5%BA%94%E5%BC%8F%E8%B0%83%E8%AF%9510.jpg)

通过 `node.textContent` 把内容回显到页面上，再对其进行依赖收集

![vue响应式调试11](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/vue%E5%93%8D%E5%BA%94%E5%BC%8F%E8%B0%83%E8%AF%9511.jpg)

### 数据改变

重新给属性赋值，会触发 `setter` 方法

![vue响应式调试12](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/vue%E5%93%8D%E5%BA%94%E5%BC%8F%E8%B0%83%E8%AF%9512.jpg)

把 watcher 依次取出来调用 `update` 方法

![vue响应式调试13](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/vue%E5%93%8D%E5%BA%94%E5%BC%8F%E8%B0%83%E8%AF%9513.jpg)

判断一下新旧值是否相等，如果不相等会执行回调函数

![vue响应式调试14](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/vue%E5%93%8D%E5%BA%94%E5%BC%8F%E8%B0%83%E8%AF%9514.jpg)

至此数据改变视图改变就完成了

![vue响应式调试15](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/vue%E5%93%8D%E5%BA%94%E5%BC%8F%E8%B0%83%E8%AF%9515.jpg)

### 检测变化的注意事项

> [检测变化的注意事项](https://cn.vuejs.org/v2/guide/reactivity.html#检测变化的注意事项)

```js
Vue.set(vm.someObject, 'b', 2)
this.$set(this.someObject,'b',2)
```

## 总结

![image-20220523215516234](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220523215516234.png)

**Vue**

- 记录传入的选项，设置 $data/$el
- 把 data 的成员注入到 Vue 实例
- 负责调用 Observer 实现数据响应式处理（数据劫持）
- 负责调用 Compiler 编译指令/插值表达式等

**Observer**

- 数据劫持
  - 负责把 data 中的成员转换成 getter/setter
  - 负责把多层属性转换成 getter/setter
  - 如果给属性赋值为新对象，把新对象的成员设置为 getter/setter
- 添加 Dep 和 Watcher 的依赖关系
- 数据变化发送通知

**Compiler**

- 负责编译模板，解析指令/插值表达式
- 负责页面的首次渲染过程
- 当数据变化后重新渲染

**Dep**

- 收集依赖，添加订阅者（watcher）
- 通知所有订阅者

**Watcher**

- 自身实例化的时候往 dep 对象中添加自己
- 当数据变化 dep 通知所有的 Watcher 实例更新视图
