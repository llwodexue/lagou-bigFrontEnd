# CompositionAPI

## Mixin

目前我们是使用组件化的方式开发整个 Vue 的应用程序，但是 **组件和组件之间有时候会存在相同的代码逻辑**，我们希望对 **相同的代码逻辑进行抽取**

在 Vue2 和 Vue3 中都支持一种方式就是 **使用 Mixin 来完成：**

- Mixin 提供了一种非常灵活的方式，来 **分发 Vue 组件中的可复用功能**
- 一个 Mixin 对象可以包含 **任何组件选项**
- 当组件使用 Mixin 对象时，所有 **Mixin 对象的选项将被混合进入该组件本身的选项中**

### Mixin 的合并规则

如果 Mixin 对象中的选项和组件对象中的选项发生了冲突，那么 Vue 会如何操作呢？

- 情况一：如果是 data 函数的返回值对象
  - 返回值对象默认情况下会 **进行合并**
  - 如果 data 返回值对象的属性发生了冲突，那么会 **保留组件自身的数据**
- 情况二：如果生命周期钩子函数
  - 生命周期的钩子函数 **会被合并到数组中**，都会被调用
- 情况三：值为对象选项，例如：methods、components 和 directives，将被合并为同一个对象
  - 比如都有 **methods 选项**，并且都定义了方法，那么 **它们都会生效**
  - 但是如果 **对象的 key 相同**，那么 **会取组件对象的键值对**

![image-20220714103904663](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220714103904663.png)

```js
// 进入页面
执行了demo mixin created
App created 执行
// 点击按钮后
app foo
```

### 全局混入和extends

如果组件中的某些选项，是所有的组件都需要拥有的，那么这个时候我们可以使用全局的 mixin

- 全局的 Mixin 可以使用 应用 app 的方法 mixin 来完成注册
- 一旦注册，那么全局混入的选项将会影响每一个组件

```js
app.mixin({
  data() {
    return {}
  },
  methods: {},
  created() {
    console.log('全局的created生命周期')
  }
})
```

另外一个类似于 Mixin 的方式是通过 extends 属性

- 在开发中 extends 用的非常少，在 Vue2 中比较推荐大家使用 Mixin，而在 Vue3 中推荐使用 Composition API

![image-20220714104410045](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220714104410045.png)

## Composition API

### Options API 弊端

在 Vue2 中，我们编写组件的方式是 Options API：

- Options API 的一大特点就是在对应的属性中编写对应的功能模块
- 比如 data 定义数据、methods 中定义方法、computed 中定义计算属性、watch 中监听属性改变，也包括生命周期钩子

但是这种代码有一个很大的弊端：

- 当我们实现某一个功能时，这个功能对应的代码逻辑会被拆分到各个属性中
- 当我们组件变得更大、更复杂时，逻辑关注点的列表就会增长，那么同一个功能的逻辑就会被拆分的很分散
- 尤其对于那些一开始没有编写这些组件的人来说，这个组件的代码是难以阅读和理解的

如果我们能将同一个逻辑关注点相关的代码收集在一起会更好

- 这就是 Composition API 想要做的事情，以及可以帮助我们完成的事情
- 也有人把 Vue Composition API 简称为 VCA

**认识 Composition API**

- 为了开始使用 Composition API，我们需要有一个可以实际使用它（编写代码）的地方
- 在 Vue 组件中，这个位置就是 setup 函数

### setup

**setup 函数参数** 主要由两个参数

- 第一个参数：props
- 第二个参数：context

props：父组件传递过来的属性会被放到 props 对象中，我们在 setup 中如果需要使用，那么就可以直接通过 props 参数获取：

- 需要在 props 选项中定义，在 template 中是可以正常使用 props 中的属性
- 如果我们在 setup 函数中想要使用 props，那么不可以通过 this 去获取
- props 有直接作为参数传递到 setup 函数中，所以我们可以直接通过参数来使用即可

context：可以称之为是一个 SetupContext，它里面包含三个属性：

- attrs：所有的非 prop 的 attribute
- slots：父组件传递过来的插槽
- emit：我们组件内部需要发出事件时会用到 emit

**setup 函数返回值**

- setup 的返回值可以在模板 template 中被使用
- 也就是说我们可以通过 setup 的返回值来替代 data 选项

我们将 counter 在 increment 或 decrement 进行操作时，是不可以实现页面的响应式的

- 因为对于一个定义的变量来说，默认情况下，Vue 并不会跟踪它的变化，来引起页面的响应式操作

![image-20220725101850285](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220725101850285.png)

### setup 不可以使用 this

- this 并没有指向当前组件实例
- 并且在 setup 被调用之前，data、computed、methods 等都没有被解析
- 所以无法在 setup 中获取 this

![image-20220727105958669](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220727105958669.png)

现在官方的解答

![image-20220727110234105](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220727110234105.png)

- `packages\runtime-core\src\renderer.ts`

  调用 createComponentInstance 创建组件实例

  ![image-20220727111846879](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220727111846879.png)

- `packages\runtime-core\src\component.ts`

  调用 setupComponent 初始化 component 内部的操作

  ![image-20220727143157803](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220727143157803.png)

  调用 setupStatefulComponent 初始化有状态的组件

  在 setupStatefulComponent 取出了 setup 函数

  通过 callWithErrorHandling 的函数执行 setup

  ![image-20220727170106177](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220727170106177.png)

由上可知，组件的 instance 肯定是在执行 setup 函数之前就创建出来的

### Ractive API

- 当我们 **使用 reactive 函数处理我们的数据之后**，数据 **再次被使用** 时就会 **进行依赖收集**
- 当 **数据发生改变** 时，所有 **收集到的依赖** 都是 **进行对应的响应式操作**（比如更新页面）
- 事实上，我们编写 **data 选项**，也是在内部交给了 reactive 函数将其变成响应式对象的

```html
<h2>当前计数: {{ state.counter }}</h2>
<button @click="increment">+1</button>
<script>
import { reactive } from 'vue'
export default {
  setup() {
    const state = reactive({
      counter: 100
    })
    const increment = () => {
      state.counter++
    }
    return {
      state,
      increment
    }
  }
}
</script>
```

### Ref API

reactive API **对传入的类型是有限制的**，它要求我们必须传入的是一个对象或数组类型

- 如果我们传入一个基本数据类型（String、Number、Boolean）会报一个警告

这时候 Vue3 提供了另一个 API：ref API

- ref 会返回一个 **可变的响应式对象**，该对象作为一个 **响应式的引用** 维护者它内部的值（reference）
- 它内部的值是在 ref 的 value 属性中被维护的

这里有两个注意事项：

- 在 **模板中引入 ref 的值** 时，**Vue 会自动帮助我们进行解包操作**，所以我们并 **不需要字模板中通过 ref.value** 的方式来使用
- 但是在 **setup 函数内部**，它依然是一个 **ref 引用**，所以对其进行操作时，我们依然需要 **使用 ref.value** 的方式

```html
<!-- 当我们在template模板中使用ref对象, 它会自动进行解包 -->
<h2>当前计数: {{ counter }}</h2>
<button @click="increment">+1</button>
<script>
import { ref } from 'vue'
export default {
  setup() {
    // counter编程一个ref的可响应式的引用
    let counter = ref(100)
    const increment = () => {
      counter.value++
    }
    return {
      counter,
      increment
    }
  }
}
</script>
```

**Ref 自动解包**

- 模板中的解包是浅层解包
- 如果我们将 ref 放到一个 reactive 的属性中，那么在模板使用时，它会自动解包

```html
<!-- 当我们在template模板中使用ref对象, 它会自动进行解包 -->
<h2>当前计数: {{ counter }}</h2>
<!-- ref的解包只能是一个浅层解包(info是一个普通的JavaScript对象) -->
<h2>当前计数: {{ info.counter.value }}</h2>
<!-- 当如果最外层包裹的是一个reactive可响应式对象, 那么内容的ref可以解包 -->
<h2>当前计数: {{ reactiveInfo.counter }}</h2>
<button @click="increment">+1</button>
<script>
import { ref, reactive } from 'vue'
export default {
  setup() {
    let counter = ref(100)
    const info = {
      counter
    }
    const reactiveInfo = reactive({
      counter
    })
    const increment = () => {
      counter.value++
    }
    return {
      counter,
      info,
      reactiveInfo,
      increment
    }
  }
}
</script>
```

### readonly

我们通过 reactive 或 ref 可以获取到一个响应式对象，但是某些情况下，我们传入给其他地方（组件）的这个响应式对象希望在另外一个地方（组件）被使用，但是不能被修改，这时就可以使用 readonly 方法

- readonly 会返回原生对象的只读代理（也就是它依然四一个 Proxy，这是一个 proxy 的 set 方法被劫持，并且不能对其进行修改）

在开发中常见的 readonly 方法会传入三个类型的参数：

- 类型一：普通对象
- 类型二：reactive 返回的对象
- 类型三：ref 的对象

在 readonly 的使用过程中，有如下规则：

- readonly 返回的对象都是不允许修改的

- 但是经过 readonly 处理的原来的对象是允许被修改的

  比如：`const info = readonly(obj)`，info 对象是不允许修改的，但是 obj 被修改时，readonly 返回的 info 对象会被修改

- 其实本质上就是 readonly 返回的对象的 setter 方法被劫持而已

```html
<button @click="updateState">修改状态</button>
<script>
import { reactive, ref, readonly } from 'vue'
export default {
  setup() {
    // 1.普通对象
    const info1 = { name: 'why' }
    const readonlyInfo1 = readonly(info1)
    // 2.响应式的对象reactive
    const info2 = reactive({
      name: 'why'
    })
    const readonlyInfo2 = readonly(info2)
    // 3.响应式的对象ref
    const info3 = ref('why')
    const readonlyInfo3 = readonly(info3)
    const updateState = () => {
      readonlyInfo1.name = 'cat'
      readonlyInfo2.value = "dog"
      readonlyInfo3.value = 'bird'
      info3.value = 'lion'
    }
    return {
      updateState
    }
  }
}
</script>
```

作用：在我们传递给其他组件数据时，往往希望其他组件使用我们传递的内容，但是不允许它们修改时，就可以使用 readonly 了

## Composition API 2

### Reactive 判断的 API

**isProxy**

- 检查对象 **是否由 reactive 或 readonly 创建的 proxy**

**isReactive**

- 检查对象 **是否由 reactive 创建的响应式代理**
- 如果 **该代理是 readonly 建的**，但 **包裹了由 reactive 创建的另一个代理**，它也会返回 true

**isReadonly**

- 检查对 **是否由 readonly 创建的只读代理**

**toRaw**

- 返回 reactive 或 readonly 代理的原始对象（不建议保留对原始对象的持久引用。请谨慎使用）

**shallowReactive**

- 创建一个响应式代理，它跟踪其自身 property 的响应性，但不执行嵌套对象的深层响应式转换 (深层还是原生对象)

**shallowReadonly**

- 创建一个 proxy，使其自身的 property 为只读，但不执行嵌套对象的深度只读转换（深层还是可读、可写的）

### toRefs

如果我们使用 ES6 的解构语法，对 reactive 返回的对象进行解构获取值，那么之后无论是修改解构后的变量，还是修改 reactive 返回的 state 对象，数据都不再是响应式的

```js
const info = reactive({ name: 'cat', age: 12 })
let { name, age } = info
```

如果想让解构出来的属性也是响应式的，可以使用 toRefs 函数，将 reactive 返回的对象中的属性都转成 ref

- 这种做法相当于已经在 `info.name` 和 `ref.value` 之间建立了连接，任何一个修改都会引起另外一个变化

```JS
const info = reactive({ name: 'cat', age: 12 })
let { name, age } = toRefs(info)
```

### toRef

如果我们只希望转换一个 reactive 对象中的属性为 ref，那么可以使用 toRef 方法

```js
const info = reactive({ name: 'cat', age: 12 })
let { name } = info
let age = toRef(info, 'age')
```

### ref 其他的 API

**unref**

- 如果我们想要获取一个 ref 引用中的 value，那么也可以通过 unref 方法

  - **如果参数是一个 ref，则返回内部值，否则返回参数本身**

    这个是 `val = isRef(val) ? val.value : val` 的语法糖函数

**isRef**

- 判断值 **是否是一个 ref 对象**

**shallowRef**

- 创建一个 **浅层的 ref 对象**

**triggerRef**

- **手动触发和 shallowRef 相关联的副作用**

```html
<h2>{{ info }}</h2>
<button @click="changeInfo">修改Info</button>

<script>
import { shallowRef, triggerRef } from 'vue'

export default {
  setup() {
    const info = shallowRef({ name: 'why' })
    const changeInfo = () => {
      // 直接修改，页面是不会重新渲染的
      info.value.name = 'james'
      triggerRef(info)
    }
    return {
      info,
      changeInfo
    }
  }
}
</script>
```

### customRef

```html
<input v-model="message" />
<h2>{{ message }}</h2>
<script>
import debounceRef from './hook/useDebounceRef'
export default {
  setup() {
    const message = debounceRef('Hello World')
    return {
      message
    }
  }
}
</script>
```

- `hook\useDebounceRef.js`

```js
import { customRef } from 'vue'

// 自定义 ref
export default function (value) {
  let timer = null
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        clearTimeout(timer)
        timer = setTimeout(() => {
          value = newValue
          trigger()
        }, 1000)
      }
    }
  })
}
```

### computed

- 在 Options API 中，我们是使用 computed 选项来完成的
- 在 Composition API 中，我们可以在 setup 函数中使用 computed 方法来编写一个计算属性

如何使用 computed

- 接收一个 getter 函数，并为 getter 函数返回的值，返回一个不变的 ref 对象
- 接收一个具有 get 和 set 的对象，返回一个可变的（可读写）ref 对象

```js
// 1.用法一: 传入一个 getter 函数
// computed 的返回值是一个 ref 对象
const fullName = computed(() => firstName.value + ' ' + lastName.value)

// 2.用法二: 传入一个对象, 对象包含 getter/setter
const fullName = computed({
  get: () => firstName.value + ' ' + lastName.value,
  set(newValue) {
    const names = newValue.split(' ')
    firstName.value = names[0]
    lastName.value = names[1]
  }
})
```

### watchEffect

- 在 Options API 中，我们可以通过 watch 选项来侦听 data 或者 props 的数据变化，当数据变化时执行某一些操作
- 在 Composition API 中，我们可以使用 watchEffect 和 watch 来完成响应式数据的侦听
  - watchEffect 用于自动收集响应式数据的依赖
  - watch 需要手动指定侦听的数据源

当侦听到某些响应式数据变化时，我们希望执行某些操作，这时候可以使用 watchEffect

- 首先，watchEffect 传入的函数会被立即执行一次，并且在执行过程中会收集依赖
- 其次，只有收集的依赖发生变化时，watchEffect 传入的函数才会再次执行

```js
const name = ref('why')
const age = ref(18)

watchEffect(() => {
  console.log('name:', name.value, 'age:', age.value)
})
```

**watchEffect 停止侦听**

- 如果我们希望停止侦听，这个时候我们可以获取 watchEffect 的返回值函数，调用该函数即可

```js
const stop = watchEffect(() => {
  console.log('name:', name.value, 'age:', age.value)
})

const changeAge = () => {
  age.value++
  if (age.value > 25) {
    stop()
  }
}
```

**watchEffect 清除副作用**

比如在开发中我们需要在侦听函数中执行网络请求，但是在网络请求还没有达到的时候，我们停止了侦听器，或者侦听器侦听函数再次被执行了，那么上一次的网络请求应该被取消掉，这个时候我们就可以清除上一次的副作用

- 在我们给 watchEffect 传入的函数被回调时，其实可以获取到一个参数：onInvalidate

  当 **副作用即将重新执行** 或者 **侦听器被停止** 时会执行该函数传入的回调函数

```js
const stop = watchEffect(onInvalidate => {
  const timer = setTimeout(() => {
    console.log('网络请求成功~')
  }, 2000)
  // 在这个函数中清除额外的副作用
  onInvalidate(() => {
    clearTimeout(timer)
  })
  console.log('name:', name.value, 'age:', age.value)
})
```

**watchEffect 执行时机**

会发现结果打印了两次

- 因为 setup 函数在执行时就会立即传入副作用函数，这个时候 DOM 并没有挂载，所以打印 null
- 而当 DOM 挂载时，会给 title 的 ref 对象赋值新的值，副作用函数会再次执行，打印出对应的元素

```js
watchEffect(() => {
  console.log(title.value)
})
```

默认情况下，组件的更新会在副作用函数执行之前，如果我们希望在副作用函数中获取到元素

- 这时候我们需要改变副作用函数执行时机（第二个参数）

- 第二个参数默认值是 pre，它会在元素挂载或更新之前执行

  flush 如果为 post，会在元素挂载之后执行

  flush 还接收 sync，这个将强制效果始终同步触发，这是低效的，很少需要使用

```js
watchEffect(
  () => {
    console.log(title.value)
  },
  { flush: 'post' }
)
```

### setup 中使用 ref

在 setup 中如何使用 ref 或者元素或组件，需要我们定义一个 ref 对象，绑定到元素或者组件的 ref 属性上即可

```html
<h2 ref="title">哈哈哈</h2>
<script>
import { ref, watchEffect } from 'vue'
export default {
  setup() {
    const title = ref(null)
    watchEffect(
      () => {
        console.log(title.value)
      },
      { flush: 'post' }
    )
    return {
      title
    }
  }
}
</script>
```

### watch

watch 的 API 完全等同于组件 watch 选项的 Property：

- watch 需要侦听特定的数据源，并在回调函数中执行副作用
- 默认情况下它是惰性的，只有当侦听的源发生变化时才会执行回调

与 watchEffect 的比较，watch 允许我们：

- 懒执行副作用（第一次不会直接执行）
- 更具体的说明当哪个状态发生改变时，触发侦听器的执行
- 访问侦听器变化前后的值

**侦听单个数据源**

watch 侦听函数的数据源有两种类型：

- 一个 getter 函数：但是该 getter 函数必须引用可响应式的对象（比如 reactive 或 ref）
- 直接写入一个可响应式的对象，reactive 或者 ref（比较常用的是 ref）

```js
// 1.侦听 watch 时,传入一个 getter 函数
watch(
  () => info.name,
  (newValue, oldValue) => {
    console.log('newValue:', newValue, 'oldValue:', oldValue)
  }
)

// 2.传入一个可响应式对象: reactive/ref 对象
// 情况一: reactive 对象获取到的 newValue 和 oldValue 本身都是 reactive 对象
watch(info, (newValue, oldValue) => {
  console.log('newValue:', newValue, 'oldValue:', oldValue)
})
// 如果希望 newValue 和 oldValue 是一个普通的对象
watch(
  () => {
    return { ...info }
  },
  (newValue, oldValue) => {
    console.log('newValue:', newValue, 'oldValue:', oldValue)
  }
)
// 情况二: ref 对象获取 newValue 和 oldValue 是 value 值的本身
const name = ref('why')
watch(name, (newValue, oldValue) => {
  console.log('newValue:', newValue, 'oldValue:', oldValue)
})
```

![image-20220802154115346](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220802154115346.png)

**侦听多个数据源**

```js
watch([() => ({ ...info }), name], ([newInfo, newName], [oldInfo, oldName]) => {
  console.log(newInfo, newName, oldInfo, oldName)
})
```

**watch 的选项**

```js
watch(
  () => ({ ...info }),
  (newInfo, oldInfo) => {
    console.log(newInfo, oldInfo)
  },
  {
    deep: true,
    immediate: true
  }
)
```

## Composition API 3

### 生命周期钩子

> [生命周期钩子](https://v3.cn.vuejs.org/guide/composition-api-lifecycle-hooks.html)

在 setup 中可以直接导入 onX 函数注册生命周期钩子

```js
import { onMounted, onUpdated, onUnmounted } from 'vue'

onMounted(() => {
  console.log('App Mounted1')
})
onMounted(() => {
  console.log('App Mounted2')
})
onUpdated(() => {
  console.log('App onUpdated')
})
onUnmounted(() => {
  console.log('App onUnmounted')
})
```

![image-20220802155319928](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220802155319928.png)

### provide inject

通过 provide 来提供数据，provide 可以传入两个参数：

- name：提供的属性名
- value：提供的属性值

在 代组件中可以通过 inject 来注入需要的属性和对应的值，inject 可以传入两个参数：

- 要 inject 的 property 的 name
- 默认值

```js
// 父组件
import { provide, ref, readonly } from 'vue'
const name = ref('coderwhy')
let counter = ref(100)
provide('name', readonly(name))
provide('counter', readonly(counter))

// 子组件
import { inject } from 'vue'
const name = inject('name')
const counter = inject('counter')
```

### hooks

**useCounter**

```js
import { ref, computed } from 'vue'

export default function () {
  const counter = ref(0)
  const doubleCounter = computed(() => counter.value * 2)
  const increment = () => counter.value++
  const decrement = () => counter.value--
  return {
    counter,
    doubleCounter,
    increment,
    decrement
  }
}
```

**useTitle**

```js
import { ref, watch } from 'vue'

export default function (title = '默认的title') {
  const titleRef = ref(title)
  watch(
    titleRef,
    newValue => {
      document.title = newValue
    },
    {
      immediate: true
    }
  )
  return titleRef
}
```

**useScrollPosition**

```js
import { ref } from 'vue'

export default function () {
  const scrollX = ref(0)
  const scrollY = ref(0)
  document.addEventListener('scroll', () => {
    scrollX.value = window.scrollX
    scrollY.value = window.scrollY
  })
  return {
    scrollX,
    scrollY
  }
}
```

**useMousePosition**

```js
import { ref } from 'vue'

export default function () {
  const mouseX = ref(0)
  const mouseY = ref(0)
  window.addEventListener('mousemove', event => {
    mouseX.value = event.pageX
    mouseY.value = event.pageY
  })
  return {
    mouseX,
    mouseY
  }
}
```

**useLocalStorage**

```js
import { ref, watch } from 'vue'

export default function (key, value) {
  const data = ref(value)
  if (value) {
    window.localStorage.setItem(key, JSON.stringify(value))
  } else {
    data.value = JSON.parse(window.localStorage.getItem(key))
  }
  watch(data, newValue => {
    window.localStorage.setItem(key, JSON.stringify(newValue))
  })
  return data
}
```

### setup 顶层编写方式

```html
<h2>当前计数: {{ counter }}</h2>
<button @click="increment">+1</button>
<hello-world message="呵呵呵" @increment="getCounter"></hello-world>

<script setup>
import { ref } from 'vue'
import HelloWorld from './HelloWorld.vue'
const counter = ref(0)
const increment = () => counter.value++
const getCounter = payload => {
  console.log(payload)
}
</script>
```

- `HelloWorld.vue`

```html
<h2>{{ message }}</h2>
<button @click="emitEvent">发射事件</button>

<script setup>
import { defineProps, defineEmits } from 'vue'
const props = defineProps({
  message: {
    type: String,
    default: '哈哈哈'
  }
})
const emit = defineEmits(['increment'])
const emitEvent = () => {
  emit('increment', '100000')
}
</script>
```

### h 函数

Vue 推荐在绝大多数情况下使用模板来创建你的 HTML，有一些特殊场景，你需要 JavaScript 完全编程的能力，可以使用渲染函数，它比模板更接近编译器

- Vue 在生成真实 DOM 之前，会将我们的节点转换成 VNode，而 VNode 组合在一起形成一颗树结构，就是虚拟 DOM（VDOM）
- 事实上，我们之前编写的 template 中的 HTML 最终也是使用渲染函数生成对应的 VNode
- 如果你想充分利用 JavaScript 的编程能力，我们可以自己来编写 createVNode 函数，生成对应的 VNode

使用 `h()` 函数

- `h()` 函数是一个用于创建 vnode 的一个函数
- 其实更准确的命名是 `createVNode()` 函数，但是为了简便在 Vue 将指称为 `h -> hyperscript` 函数

**h() 函数使用**

它接收三个参数：

- tag：HTML 标签名、组件、异步组件或函数式组件
- props：与 attribute、prop 和事件相对应的对象
- children：子 VNodes，使用 `h()` 函数构建

![image-20220803143817401](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220803143817401.png)

**注意事项：**

- 如果没有 props，那么通常可以将 children 作为第二个参数传入
- 如果会产生歧义，可以将 null 作为第二个参数传入，将 children 作为第三个参数传入

```js
import { ref, h } from 'vue'

export default {
  setup() {
    const counter = ref(0)

    return () => {
      return h('div', { class: 'app' }, [
        h('h2', null, `当前计数: ${counter.value}`),
        h(
          'button',
          {
            onClick: () => counter.value++
          },
          '+1'
        ),
        h(
          'button',
          {
            onClick: () => counter.value--
          },
          '-1'
        )
      ])
    }
  }
}
```

函数组件和插槽使用

```js
/* App.vue */
import { h } from 'vue'
import HelloWorld from './HelloWorld.vue'
export default {
  render() {
    return h('div', null, [
      h(HelloWorld, null, {
        default: props => h('span', null, `app传入到HelloWorld的内容：${props.name}`)
      })
    ])
  }
}

/* HelloWorld.vue */
import { h } from 'vue'
export default {
  render() {
    return h('div', null, [
      h('h2', null, 'Hello World'),
      this.$slots.default
        ? this.$slots.default({ name: 'code' })
        : h('span', null, '我是HelloWorld的插槽默认值')
    ])
  }
}
```

### jsx

如果我们希望在项目中使用 jsx，我们需要添加对 jsx 的支持：

- jsx 我们通常会通过 Babel 来进行转换
- React 编写的 jsx 就是通过 Babel 转换的
- Vue 我们只需在 Babel 中配置对应的插件即可

```bash
npm install @vue/babel-plugin-jsx -D
```

在 babel.config.js 配置文件中配置插件

```js
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    '@vue/babel-plugin-jsx'
  ]
}
```

最新脚手架无需进行此配置

```js
/* App.vue */
import HelloWorld from './HelloWorld.vue'
export default {
  data() {
    return {
      counter: 0
    }
  },
  render() {
    const increment = () => this.counter++
    const decrement = () => this.counter--
    return (
      <div>
        <h2>当前计数: {this.counter}</h2>
        <button onClick={increment}>+1</button>
        <button onClick={decrement}>-1</button>
        <HelloWorld></HelloWorld>
      </div>
    )
  }
}

/* HelloWorld.vue */
export default {
  render() {
    return (
      <div>
        <h2>HelloWorld</h2>
        {this.$slots.default ? this.$slots.default() : <span>哈哈哈</span>}
      </div>
    )
  }
}
```

