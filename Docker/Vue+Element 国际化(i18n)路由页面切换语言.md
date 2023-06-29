# 安装 i18n

`internationalization` 这个单词中，i 和 n 之间有 18 个字母

**注意：** 当前 i18n 最新版本为 9 版本，9 版本没有 VueI18n，`import VueI18n from 'vue-i18n'` 解构会报错 `Cannot read property 'install' of undefined`

- 这里为了让 Element 兼容，安装的是 8 版本的

```bash
npm install vue-i18n@8
```

# 基础配置篇

## 1.页面中使用国际化

### * i18n 文件夹下的 index.js 文件

> `require.context`
>
> 它允许传入一个目录进行搜索，一个标志指示是否应该搜索子目录，还有一个正则表达式来匹配文件
>
> - 第一个参数：`directory` 要搜索的文件夹目录不能是变量，否则在编译阶段无法定位目录
> - 第二个参数：`useSubdirectories` 是否搜索子目录
> - 第三个参数：`regExp` 匹配文件的正则表达式
>
> ```js
> require.context('demo', false, /\.js$/)
> ```

```js
/* i18n/index.js */
import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const langFiles = require.context('./config', false, /\.js$/)
const regExp = /\.\/([^\.\/]+)\.([^\.]+)$/
const messages = {}
const lang = {
  zh: zhCNLocale,
  zhTW: zhTWLocale,
  en: enLocale
}
// 默认语言
const loadLanguage = 'zh'

langFiles.keys().forEach(key => {
  messages[k] = langFiles(key).default
})

function getLanguage() {
  // 第一次进入页面或手动清除设置默认语言
  localStorage.getItem('lang') ? null : localStorage.setItem('lang', loadLanguage)
  let locale = localStorage.getItem('lang')
  if (!(locale in messages)) locale = loadLanguage
  return locale
}

const i18n = new VueI18n({
  locale: getLanguage(),
  messages
})
export default i18n
```

- messages 对象

![](https://gitee.com/lilyn/pic/raw/master/js-img/%E5%9B%BD%E9%99%85%E5%8C%96%E8%AF%AD%E8%A8%80%E6%96%87%E4%BB%B6.jpg)

### main.js 引入

```js
/* main.js */
import Vue from 'vue'
import App from './App.vue'
import i18n from './i18n'

new Vue({
  render: h => h(App),
  i18n
}).$mount('#app')
```

### 展示页面

效果图如下：

![](https://gitee.com/lilyn/pic/raw/master/company-img/%E5%88%87%E6%8D%A2%E8%AF%AD%E8%A8%80.gif)

```html
<template>
  <div>
    <el-dropdown
      trigger="click"
      class="international"
      @command="handleSetLanguage"
    >
      <div><i class="el-icon-s-tools" />切换语言</div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item :disabled="language === 'zh'" command="zh">
          中文
        </el-dropdown-item>
        <el-dropdown-item :disabled="language === 'en'" command="en">
          English
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" :label="$t('table.date')" width="180">
      </el-table-column>
      <el-table-column prop="name" :label="$t('table.name')" width="180">
      </el-table-column>
      <el-table-column prop="age" :label="$t('table.age')"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          age: '23'
        },
        {
          date: '2016-05-04',
          name: '李小鸭',
          age: '14'
        }
      ],
      language: localStorage.getItem('lang')
    }
  },
  methods: {
    handleSetLanguage(lang) {
      this.$i18n.locale = lang
      this.language = lang
      localStorage.setItem('lang', lang)
      // window.location.reload()
    }
  }
}
</script>
```

### 语言配置文件

```js
/* en.js */
export default {
  table: {
    date: 'Date',
    name: 'Name',
    age: 'Age'
  }
}

/* zh.js */
export default {
  table: {
    date: '日期',
    name: '姓名',
    age: '年龄'
  }
}
```

### 英文首字母大写

英文情况下，需要对其进行大小写转换处理（让每个单词首字母大写）

```js
for (const k in langs) {
  const item = langs[k]
  for (const j in item) {
    item[j] = item[j].toLowerCase().replace(/( |^)[a-z]/g, L => L.toUpperCase())
  }
}
```

## 2.Element 国际化

### main.js 引入

- 参考 [兼容 `vue-i18n@6.x`](https://element.eleme.cn/#/zh-CN/component/i18n#jian-rong-vue-i18n-6-x)  的步骤（需要手动处理）

```js
/* main.js */
import Vue from 'vue'
import App from './App.vue'
import i18n from './i18n'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 8版本以上需要这么使用
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value),
  size: 'mini'
})

new Vue({
  render: h => h(App),
  i18n
}).$mount('#app')
```

### * i18n 文件夹下的 index.js 文件

在 index.js 中使用 `Object.assign`  合并有一个好处：方便扩展（相对于在语言配置表引入使用扩展运算符）

```js
/* i18n/index.js */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhCNLocale from 'element-ui/lib/locale/lang/zh-CN'
import zhTWLocale from 'element-ui/lib/locale/lang/zh-TW'

Vue.use(VueI18n)

const langFiles = require.context('./config', false, /\.js$/)
const regExp = /\.\/([^\.\/]+)\.([^\.]+)$/
const messages = {}
const lang = {
  zh: zhCNLocale,
  zhTW: zhTWLocale,
  en: enLocale
}
// 默认语言
const loadLanguage = 'zh'

langFiles.keys().forEach(key => {
  const k = regExp.exec(key)[1]
  // 合并Element国际化配置
  messages[k] = Object.assign(langFiles(key).default, lang[k])
})

function getLanguage() {
  // 第一次进入页面或手动清除设置默认语言
  localStorage.getItem('lang') ? null : localStorage.setItem('lang', loadLanguage)
  let locale = localStorage.getItem('lang')
  if (!(locale in messages)) locale = loadLanguage
  return locale
}

const i18n = new VueI18n({
  locale: getLanguage(),
  messages
})

export default i18n
```

到此为止，Element 和 页面国际化基本做完了，不过还有一些国际化难点，接下来说一下

## 3.与vuex进行关联

> 参考：[ant-design-vue-pro](https://github.com/vueComponent/ant-design-vue-pro)

- 增加给 HTML 根节点增加 `lang` 属性
- 可以在 `loadLanguageAsync` 力作缓存语言设置，切换语言时懒加载对应语言，以提升性能
- 增加 `i18nRender` 方法

```js
/* i18n/index.js */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhCNLocale from 'element-ui/lib/locale/lang/zh-CN'
import zhTWLocale from 'element-ui/lib/locale/lang/zh-TW'

Vue.use(VueI18n)

const langFiles = require.context('./config', false, /\.js$/)
const regExp = /\.\/([^\.\/]+)\.([^\.]+)$/
const messages = {}
const lang = {
  zh: zhCNLocale,
  zhTW: zhTWLocale,
  en: enLocale
}
// 默认语言
const loadLanguage = 'zh'

langFiles.keys().forEach(key => {
  const k = regExp.exec(key)[1]
  // 合并Element国际化配置
  messages[k] = Object.assign(langFiles(key).default, lang[k])
})

function setI18nLanguage(lang) {
  i18n.locale = lang
  localStorage.setItem('lang', lang)
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}

const i18n = new VueI18n({
  silentTranslationWarn: true, // 取消本地化失败时输出的警告
  locale: getLanguage(), // 语言环境
  messages
})

export function getLanguage() {
  // 第一次进入页面或手动清除设置默认语言
  localStorage.getItem('lang') ? null : localStorage.setItem('lang', loadLanguage)
  let locale = localStorage.getItem('lang')
  if (!(locale in messages)) locale = loadLanguage
  return locale
}

// 可以在这里做动态加载国际化语言
export function loadLanguageAsync(lang) {
  return new Promise(resolve => {
    return resolve(setI18nLanguage(lang))
  })
}

export function i18nRender(key) {
  return i18n.t(`${key}`)
}

export default i18n
```

在 vuex 里增加 `state`、`mutation`、`actions`

```js
/* store/modules/app.js */
import { loadLanguageAsync } from '@/i18n'

const state = {
  lang: 'zh'
}

const mutations = {
  SET_LANG: (state, lang) => {
    state.lang = lang
  }
}

const actions = {
  setLang({ commit }, lang) {
    return new Promise((resolve, reject) => {
      commit('SET_LANG', lang)
      loadLanguageAsync(lang)
        .then(() => {
          resolve()
        })
        .catch(e => {
          reject(e)
        })
    })
  }
}
```

在 vuex 的 `getters` 里增加 lang

```js
/* store/getters.js */
const getters = {
  lang: state => state.app.lang
}
export default getters
```

在创建 Vue 实例时 `dispatch` 让 `state` 有 lang 的状态

```js
/* main.js */
import App from './App'
import store from '@/store'
import i18n from '@/i18n' 
import { getLanguage } from '@/i18n'

function createdConfig() {
  store.dispatch('app/setLang', getLanguage())
}

new Vue({
  el: '#app',
  store,
  i18n,
  created: createdConfig,
  render: h => h(App)
})
```

可以将修改语言抽成组件（这里只写 JS 部分）

```js
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      language: state => state.app.lang
    })
  },
  methods: {
    handleSetLanguage(lang) {
      this.$store.dispatch('app/setLang', lang).then(() => {
        window.location.reload()
      }).catch(() => {})
    }
  }
}
```

# 路由导航篇

这里有一些前端后端都可以处理，如果后端进行国际化处理，前端需要在请求拦截器里加 `Accept-Language` 请求头

```js
import axios from 'axios'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  withCredentials: true,
  timeout: 5000
})

service.interceptors.request.use(
  config => {
    const langConfig = {
      zh: 'zh_CN',
      en: 'en_US',
      zhTW: 'zh_TW',
      other: 'other'
    }
    config.headers['Accept-Language'] = langConfig[locale]
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
```

## 1.路由菜单国际化

### * 使用 $te 判断是否存在语言包内

- 首先需要处理一下菜单名，如果这个名在语言配置文件中就直接返回，如果不在返回原信息中的菜单。这个可以后端进行国际化处理，如果想修改 `UPDATE` 数据库一下即可

  `$te` 这个方法用以判断需要翻译的 `key` 在你提供的 `语言包(messages)` 中是否存在

```js
/* utils/get-page-title.js */
export function routeTitle(item) {
  const name = `sidebar.${item.path}`
  if (this.$te(name)) {
    return this.$t(name)
  }
  return item.meta.title
}
```

### 展示页面

把每一项传到处理菜单的方法中，这样路由菜单国际化基本完成了，如果有多级路由，基本同理

```html
<template v-for="(item, index) in routesSystem">
  <el-menu-item :index="index.toString()">{{ routeTitle(item) }}</el-menu-item>
</template>

<script>
import { routeTitle } from '@/utils/get-page-title'
export default {
  methods: {
    routeTitle // 声明一下
  }
}
</script>
```

## 2.面包屑导航国际化

面包屑导航使用的是 `vue-element-admin` 的 Breadcrumb 组件

```html
<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span v-if="item.redirect === 'noRedirect' || index == levelList.length - 1" class="no-redirect">{{ breadTitle(item) }}</span>
        <a v-else>{{ breadTitle(item) }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>


<script>
import { breadTitle } from '@/utils/get-page-title'
export default {
  methods: {
    breadTitle // 声明一下
  }
}
</script>
```

可以通过 `/` 去判断它是几级路由；也可以在路由的 `meta` 中设定一个标识，判断这个标识即可

- 三级路由场景：一、二级路由可以放在 `sidebar` 对象中，三级路由放在 `menu` 中（当然也可以都放在一个对象里）

```js
/* utils/get-page-title.js */
export function breadTitle(item) {
  if (window.indexConfig.afterTitle) return item.meta.title
  const n = item.name || item.path.slice(1)
  let name
  if (item.path.match(/\//g).length !== 3) {
    name = `sidebar.${n}`
  } else {
    name = `menu.${n}`
  }
  if (this.$te(name)) {
    return this.$t(name)
  }
  return item.meta.title
}
```

## 3.导航守卫国际化

因为导航守卫中拿不到 `this`，所以可以采用了一种取巧的方式。首先在 `router` 文件中引入 `i18n` 文件夹下的 `index.js`，之后直接取它的 `messages` 和 `locale` 即可拿到对应语言文件

- 不过这样写会产生一个问题，就是切换语言无法实时更新，需要刷新状态

```js
/* src/permission.js */
import router from './router/index'
import i18n from '@jp/i18n'
import modal from '@jp/utils/modal' // 二次封装的弹出框
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken, removeCookies, removeToken } from '@/utils/auth'
import { isDebugger } from '@/settings' // 也可以维护在store里

NProgress.configure({ showSpinner: false })

const locale = i18n.locale
const msg = i18n.messages[locale]
const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    document.title = getPageTitle(to.meta.title)
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      // debugger下不获取用户权限
      if (isDebugger) {
        next()
      } else {
        // 设置动态路由，拉取user_info...
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      removeCookies()
      modal.msgError(msg.info.tokenExpire) // 弹出框国际化
      next({ path: '/login' })
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
```

## 4.render 函数展示文字

 `vue-element-admin` 里的 Item 组件，是采用 `render` 函数渲染的，这个一般

```html
<!-- src/layout/components/Sidebar/Item.vue -->
<script>
import { childTitle } from '@/utils/get-page-title'
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    path: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      if (icon.includes('el-icon')) {
        vnodes.push(<i class={[icon, 'sub-el-icon']} />)
      } else {
        vnodes.push(<svg-icon icon-class={icon}/>)
      }
    }

    if (title) {
      // 三级目录文字展示
      vnodes.push(<span slot="title">{childTitle(context)}</span>)
    }
    return vnodes
  }
}
</script>
```

这里可以用一个取巧的方式，因为 `render` 函数里的 `context` 里面有 `parent` 父节点，可以使用这个父节点上面的方法（`$t`、`$te`）

```js
export function childTitle(item) {
  const p = item.props.path
  const parent = item.parent
  const name = `menu.${p}`
  if (parent.$te(name)) {
    return parent.$t(name)
  }
  return item.props.title
}
```

这样路由菜单、面包屑导航及导航守卫国际化基本做完事了

# 组件篇

## 1.选择框、输入框组件

```html
<el-form-item :label="$t('viewsC.animal')" prop="animal">
  <el-input v-model="rowsFormData.animal" :placeholder="$t('viewsC.animalHolder')" />
</el-form-item>
```

选择框输入框，我将其都放在 viewC 对象中，并按照，如下方式命名：

- 没有加 Holder 后缀的后面需要加 `：`，有加 Holder 后缀的前面需要加 `请输入/请选择`

```js
const ps = '请选择'
const pi = '请输入'
const end = '：'

const viewsC = {
  startDate: '起始日期',
  startDateHolder: ps + '起始日期',
  stopDate: '截止日期',
  stopDateHolder: ps + '截止日期'
}

for (const item in viewsC) {
  if (!item.includes('Holder')) {
    viewsC[item] = viewsC[item] + end
  } else {
    if (!viewsC[item].includes('请')) {
      console.log(viewsC[item] + '需要加 ps 或 pi')
    }
  }
}
```

详细例子可以参考 `2.选择框、输入框表单校验`，表格 Table 跟这个同理 `el-table-column : label="$t('tableC.xxx)"` 即可

## * 2.选择框、输入框表单校验

如果直接把 `rules` 校验规则写在 `data` 里面，Element 内部对其 `this` 进行了处理，所以需要换一种思路

1. 使用 `computed` 计算属性

2. 写在 `data` 里面，在 return 之前是可以拿到 `this` 的，`message` 取到这个变量即可（不过这个切换语言不能实时更新）

   注意：如果使用自定义规则是可以实时更新的，但是出于复用性一般会将其抽到 utils 方法库中，这样就会产生其他问题

   - `this` 无法处理
   - 简单认证还得写复杂的自定义规则

   所以这个不是一个好方法，推荐使用计算属性

**一般出于复用性将方法抽到 utils 方法库中，直接写是不行的**（Element 内部对其 `this` 进行了处理），需要结合 `bind/call/apply` 来使用

- `pattern: '[^ \x22]+'` 是校验不能全部为空格

```html
<el-scrollbar wrap-class="scrollbar-wrapper" style="height: 100%;">
  <el-form ref="rowsForm" :model="rowsFormData" :rules="rules" label-width="130px">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item :label="$t('viewsC.animal')" prop="animal">
          <el-input v-model="rowsFormData.animal" :placeholder="$t('viewsC.animalHolder')" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="$t('viewsC.plants')" prop="plants">
          <el-input v-model="rowsFormData.plants" :placeholder="$t('viewsC.plantsHolder')" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</el-scrollbar>

<script>
import { ValidAnimal } from '@/utils/viewValidate'
export default {
  data() {
    return {
      rowsFormData: {
        animal: '',
        plants: ''
      }
    }
  },
  computed: {
    rules() {
      return {
        animal: [{ required: true, validator: ValidAnimal.bind(this), trigger: 'change', pattern: '[^ \x22]+' }],
        plants: [
          { required: true, message: this.$t('form.plantsTip'), trigger: 'blur', pattern: '[^ \x22]+' },
          { max: 5, message: this.$t('form.maxLength10'), trigger: 'blur' }
        ]
      }
    }
  },
}
</script>
```

## 3.弹出框（MessageBox 或 Notification）

弹出框的 `title` 是可以使用 `this` 的，不过需要注意：

- 如果使用 function，拿到的是错误的 `this` （可能由于代码不规范导致有这个问题）

  **要么用一个变量存，要么使用箭头函数**

```js
this.$confirm(this.$t('info.notify') , this.$t('info.friendlyTips'), {
  type: 'warning'
})
  .then(function() {
    const params = {}
    Api(params)
      .then(res => {
        this.$notify({ title: this.$t('info.friendlyTips'), message: res.data.msg, type: 'success' })
        this.getList()
      })
      .catch(e => console.log(e))
  })
```

## 4.自制弹出框组件国际化（Vue.extend）

`Vue.extend` 其实相当于创建了一个 `Vue` 子类，然后对这个子类上扩展一些 `options` 属性

### popup.js 中处理

结合 `el-dialog` 自制弹出框组件，需要在创建实例时混入 `$i18n` ，这样弹出框组件才能使用 `$t`、`$te`

```js
import store from '@/store'
import i18n from '@/i18n' // 引入国际化
import Vue from 'vue'
export default function(el, params) {
  // 初始化一个Promise
  let resolve
  let reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  // 初始化弹窗
  const Popups = Vue.extend(el)
  const vEl = new Popups({
    store,
    i18n,
    propsData: {
      params: Object.assign({}, params)
    },
    data() {
      return {
        visible: true
      }
    },
    methods: {
      resolve(arg) {
        resolve(arg)
        this.visible = false
      },
      reject(arg) {
        reject(arg)
        this.visible = false
      },
      closed() {
        this.visible = false
        removePopup()
      }
    }
  })
  // 把弹窗挂载到body
  const shadeEl = vEl.$mount().$el
  document.body.appendChild(shadeEl)
  // 从body中移除弹窗体
  function removePopup() {
    document.body.removeChild(shadeEl)
  }
  return promise
}
```

### popup.vue 组件

```html
<template>
  <el-dialog
    :title="title"
    :width="width"
    :visible.sync="visible"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="showClose"
    :modal="modal"
    :custom-class="customClass"
    class="popup-wrapper"
    :top="top"
    @closed="closed"
  >
    <div class="popup__body">
      <slot />
    </div>
    <div v-if="!isFooter" slot="footer" class="dialog-footer">
      <slot name="footer">
        <el-button @click="onCancel">{{ $t('tools.cancel') }}</el-button>
        <el-button type="primary" @click="onSubmit">{{ $t('tools.confirm') }}</el-button>
      </slot>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'UiPopup',
  props: {
    value: {
      type: [String, Object, Array, Number, Boolean],
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: ''
    },
    isFooter: {
      type: String,
      default: ''
    },
    showClose: {
      type: Boolean,
      default: true
    },
    modal: {
      type: Boolean,
      default: true
    },
    customClass: {
      type: String,
      default: ''
    },
    top: {
      type: String,
      default: ''
    }
  },
  computed: {
    // visible控制器，点X时调用取消
    visible: {
      get: function() {
        return this.$parent.visible
      },
      set: function(v) {
        this.$parent.reject(this.value)
      }
    }
  },
  methods: {
    onCancel() {
      this.$emit('onCancel', this.value)
    },
    onSubmit() {
      this.$emit('onSubmit', this.value)
    },
    // 点 X 关闭时调用父组件的注入
    closed() {
      this.$parent.closed()
    }
  }
}
</script>
```

### components 下的 index.js

把 popup 通过全局方式注册

```js
import popup from './Popup/popup.vue'
import jsPopup from './Popup/popup.js'
const components = [
  popup
]
const jsComponents = {
  $popup: jsPopup
}
// 出口函数为组件安装函数
const install = Vue => {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
  for (const key in jsComponents) {
    if (!Vue.prototype.hasOwnProperty(key)) {
      Vue.prototype[key] = jsComponents[key]
    } else {
      console.warn(key + '被占用')
    }
  }
}
export default {
  install
}
```

### main.js

这样就可以在全局使用 `$popup` 了

```js
import Vue from 'vue'
import globalComponents from '@/components'

Vue.use(globalComponents)
```

# 打包篇

toB 的项目可能会有这个需求：

- 因为页面组件和表格很多，如果有一个字段名想改，就需要重新打包，很麻烦，现在想将其提出去（比如提取到 `public` 文件夹下的 config.js 文件中，这个 config.js 在 index.html 中引入一下），这样以后只需要改一下这个 js 文件无需重新打包

## 基础配置

首先将各个配置文件复制到 `public` 下面，**并将其用匿名函数包裹**，之后在入口 index.html 中，引入如下配置文件

```html
<script>
  var now = new Date().getTime();
  document.write('<script src="../config.js?t=' + now + '"><\/script\>')
  document.write('<script src="../i18n/en.js?t=' + now + '"><\/script\>')
  document.write('<script src="../i18n/zh.js?t=' + now + '"><\/script\>')
  document.write('<script src="../i18n/zhTW.js?t=' + now + '"><\/script\>')
</script>
```

config.js 中用 `var` 声明变量挂载到 window 上，并在 `en/zh/zhTW` js文件中把配置加到 `lang` 对象中

```js
var indexConfig = {}
indexConfig.lang = {}
// zh中文-简体； en-英文； zhTW-中文繁体
indexConfig.langShow = ['zh', 'en', 'zhTW']
```

最后在各个 `lang` 文件下用 `window.indexConfig.lang` 获取即可

## 打包配置

由于打包时不会携带 `i18n` 文件夹下面的配置文件，所以需要借助 CopyWebpackPlugin 插件进行复制

```js
const copyWebpackPlugins = ['', '/i18n'].map(item => {
  return new CopyWebpackPlugin([
    {
      from: `./public${item}/*`,
      to: path.resolve(__dirname, `dist/`),
      transformPath(targetPath, absolutePath) {
        return targetPath.replace(`public`, '')
      },
      toType: 'dir'
    }
  ])
})

module.exports = {
    plugins: [
      new HtmlWebpackPlugin('src/index.html')
    ].concat(copyWebpackPlugins)
}
```

这样配置文件就提出去了，不过有安全风险，这个以后再说

## 推荐参考

[前端国际化之Vue-i18n源码分析](https://segmentfault.com/a/1190000008752459)

[vue中如何使用i18n实现国际化](https://segmentfault.com/a/1190000016445415)

[Element国际化](https://element.eleme.cn/#/zh-CN/component/i18n)

[elementUI——locale，国际化方案](https://www.jianshu.com/p/c49296f13a17)

