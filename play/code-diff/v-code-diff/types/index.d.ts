import { HLJSApi } from "highlight.js"
import { DefineComponent } from "vue-demi"

declare const _default: {
  install: (app: any) => void,
  hljs: HLJSApi
}

declare const CodeDiff: DefineComponent<{}, {}, any>
export {
  CodeDiff
}

export default _default
