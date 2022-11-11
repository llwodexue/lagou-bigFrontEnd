<template>
  <div class="editor">
    <el-row>
      <el-col :span="12">
        <!-- markdown 编辑器基本操作 -->
        <textarea name="md-editor" id="md-editor" cols="30" rows="10" :value="content" @input="update"></textarea>
      </el-col>
      <el-col :span="12">
        <div class="markdown-body" v-html="compiledContent"></div>
      </el-col>
      <div class="write-btn">
        <el-button type="primary">提交</el-button>
      </div>
    </el-row>
  </div>
</template>

<script>
import marked from 'marked'
import highlight from 'highlight.js'
import javascript from 'highlight.js/lib/languages/javascript'
import 'highlight.js/styles/monokai-sublime.css'

export default {
  data() {
    return {
      content: ''
    }
  },
  mounted() {
    marked.setOptions({
      rendered: new marked.Renderer(),
      highlight(code) {
        return highlight.highlightAuto(code).value
      }
    })
  },
  computed: {
    compiledContent() {
      return marked(this.content, {})
    }
  },
  methods: {
    update(e) {
      this.content = e.target.value
    }
  }
}
</script>
<style scoped lang="scss">
#md-editor {
  width: 100%;
  min-height: 500px;
}
.markdown-body {
  width: 100%;
  min-height: 500px;
  height: 100%;
  border: 1px solid #ccc;
}
</style>
