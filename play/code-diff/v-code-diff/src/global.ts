import CodeDiff from './CodeDiff.vue'
import hljs from './highlight'

function install(app: any) {
  app.component('CodeDiff', CodeDiff)
}

export default {
  install,
  hljs,
}
