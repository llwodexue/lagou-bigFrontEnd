## 快速上手



## 文档内容增强

### 访问图床403

默认的加载文档后，因为防盗链机制，直接访问图床会报 403

![image-20231201154438057](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231201154438057.png)

修改 `.vitepress/config.ts`

- 解决方法：删除 http head 中的 referer

```typescript
export default defineConfig({
  head: [['meta', { name: 'referrer', content: 'never' }]]
})
```

### 点击图片放大

默认的 Vitepress 加载图片后，因为布局的原因，图片会显得很小，很多图片里的内容看不清晰

如果想点击图片放大可以使用 medium-zoom 库

