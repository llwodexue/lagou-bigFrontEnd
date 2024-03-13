# vitepress里使用gitalk

Gitalk 是一个基于 GitHub Issue 和 Preact 开发的评论插件

## 生成client配置

### 创建OAuth application

填写完毕，点击 `Register application` 即可

![image-20240311093820670](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240311093820670.png)

### 生成client secrets

一开始没有自动生成 Client secrets，需要手动生成，点击 `Generate a new client secret`，输入密码即可生成

![image-20240311093958965](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240311093958965.png)

### 粘贴配置

把 `Client ID` 和 `Client secret` 配置进行粘贴即可

![image-20240311094343117](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240311094343117.png)

### 创建评论仓库

点击 `New repository`

![image-20240311094512571](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240311094512571.png)

创建评论仓库，填写完毕点击 `Create repository`

![image-20240311094648308](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240311094648308.png)

## 使用gitalk

### 安装gitalk

在根目录（有 `package.json` 的目录里）执行如下命令

```bash
npm i gitalk blueimp-md5
npm i @types/blueimp-md5 -D
```

![image-20240311091454442](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240311091454442.png)

### 创建评论组件

在 `.vitepress\theme` 目录下创建 `components` 文件夹，之后创建 `Comment.vue` 文件

![image-20240311091853868](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240311091853868.png)

编辑 `Comment.vue` 文件，粘贴如下代码：

```vue
<template>
  <div v-if="showFlag" id="comment-container"></div>
</template>

<script lang="ts" setup>
import { onMounted, watch, ref, nextTick } from 'vue'
import 'gitalk/dist/gitalk.css'
import Gitalk from 'gitalk'
import { useData, useRouter } from 'vitepress'
import md5 from 'blueimp-md5'

const { page } = useData()
const { route } = useRouter()

// 配置（需要自己修改）
const gitDefault = {
  clientID: 'a26e73e5006159d3a513', // !需要改成自己的clientID
  clientSecret: 'b42283a5c15549274fdb4b3f1243d09004804988', // !需要改成自己的clientSecret
  repo: 'gitalk-vitepress', // !需要改成自己创建的评论仓库
  owner: 'llwodexue', // !需要改成自己的用户名
  admin: ['llwodexue'], // !需要改成自己的用户名
  id: md5(page.value.relativePath),
  language: 'zh-CN',
  distractionFreeMode: false,
  // 默认: https://cors-anywhere.azm.workers.dev/https://github.com/login/oauth/access_token
  proxy: 'https://vercel.charles7c.top/github_access_token'
}

const showFlag = ref(true)
// 渲染评论组件
onMounted(() => {
  watch(
    () => route.path,
    () => {
      showFlag.value = false
      nextTick(() => {
        showFlag.value = true
        setTimeout(() => {
          // 初始化评论组件配置
          const gitalk = new Gitalk({ ...gitDefault, id: md5(page.value.relativePath) })

          gitalk.render('comment-container')
          // 点赞前检查登录状态
          const commentContainer: HTMLElement | null =
            document.getElementById('comment-container')

          commentContainer?.addEventListener('click', (event: Event) => {
            if (!window.localStorage.getItem('GT_ACCESS_TOKEN')) {
              alert('点赞前，请先登录')
              event.preventDefault()
            }
          })

          // 提交评论后重置输入框高度
          commentContainer?.addEventListener('click', (event: Event) => {
            const gtTextarea: HTMLElement | null =
              document.querySelector('.gt-header-textarea')
            if (gtTextarea) {
              ;(gtTextarea as HTMLInputElement).style.height = '72px'
            }
          })

          // 点击预览时切换评论按钮可见性
          commentContainer?.addEventListener('click', (event: Event) => {
            const commentButton: HTMLElement | null = document.querySelector(
              '.gt-header-controls .gt-btn-public'
            )
            if (commentButton) {
              commentButton.classList.toggle('hide')
            }
          })
        }, 0)
      })
    },
    { immediate: true }
  )
})
</script>
```

### 创建Layout组件

在 `.vitepress\theme` 目录下创建 `Layout.vue` 文件

![image-20240311092451257](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240311092451257.png)



编辑 `Layout.vue` 文件，粘贴如下代码：

```vue
<template>
  <Layout :class="layoutClass">
    <template #doc-after>
      <Comment />
    </template>
  </Layout>
</template>

<script lang="ts" setup>
import DefaultTheme from 'vitepress/theme'
import Comment from './components/Comment.vue'
import { useData } from 'vitepress'
import { ref } from 'vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()

const layoutClass = ref('')
if (frontmatter.value?.layoutClass) {
  layoutClass.value = frontmatter.value.layoutClass
}
</script>
```

### 引入Layout组件

编辑 `.vitepress\theme\index.ts` 文件

![image-20240311092857786](https://gitee.com/lilyn/pic/raw/master/md-img/image-20240311092857786.png)

在里面引入 `Layout.vue` 文件

```typescript
import Layout from './Layout.vue'

export default {
  ...DefaultTheme,
  Layout: Layout,
}
```

