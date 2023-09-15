<template>
  <div class="button-container">
    <el-button type="primary" icon="VideoPlay" @click="onRunCode">运行SQL</el-button>
    <el-button type="info" icon="CopyDocument" @click="onCopySQL">复制SQL</el-button>
    <el-button type="success" icon="Brush" @click="onFormatSQL">格式化SQL</el-button>
    <el-button type="primary" icon="Plus" @click="onCopyTabSQL">复制当前页</el-button>
    <span style="color: #ff4949; margin: 0 20px">* 不能选中运行SQL！</span>
    <!-- <el-tooltip :content="tooltip">
      <el-icon style="margin-right: 20px">
        <InfoFilled />
      </el-icon>
    </el-tooltip> -->
  </div>
  <div ref="editorEl" class="codemirror-container"></div>
</template>

<script setup>
import { EditorState, Compartment } from '@codemirror/state'
import { EditorView, dropCursor, keymap } from '@codemirror/view'
import { defaultKeymap, standardKeymap, indentWithTab, history } from '@codemirror/commands'
import { bracketMatching, defaultHighlightStyle, indentOnInput, syntaxHighlighting } from '@codemirror/language'
import { schemaCompletion, StandardSQL, MySQL, PostgreSQL, sql } from '@codemirror/lang-sql'
import { autocompletion, closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete'
import { format } from 'sql-formatter'
import { useClipboard } from '@/hooks'
import { useTabsStore } from '@/store/modules/tabs'

const { proxy } = getCurrentInstance()

// const tooltip = 'select role_id as "角色id", inner_code as "站码", role_name as "角色名" from afcdb.tx_role_define'

const tabsStore = useTabsStore()
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  hintInfo: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'run'])

const editorEl = ref()

const store = reactive({
  doc: ref(props.modelValue),
  view: ref()
})
const { copy } = useClipboard()

const basicExtension = [history(), dropCursor(), indentOnInput(), bracketMatching(), closeBrackets()]
const initEditor = () => {
  const onUpdate = () => {
    return EditorView.updateListener.of(({ state }) => {
      store.doc = state.doc.toString()
      emit('update:modelValue', store.doc)
    })
  }

  const tabBinding = () => {
    return [keymap.of([...defaultKeymap, ...standardKeymap, indentWithTab]), EditorState.tabSize.of(2)]
  }

  /** sql编辑器提示语言 */
  const sqlCompartment = new Compartment()
  const tab = tabsStore.currentTab
  const database = tab.databaseInfo?.dataName
  let dialect = StandardSQL
  if (database === 'mysql') {
    dialect = MySQL
  } else if (database === 'postgres') {
    dialect = PostgreSQL
  }
  const sqlExtension = [
    schemaCompletion({
      dialect,
      tables: props.hintInfo?.tables,
      schema: props.hintInfo?.schema
    }),
    sqlCompartment.of(
      sql({
        dialect,
        tables: props.hintInfo?.tables,
        schema: props.hintInfo?.schema
      })
    )
  ]

  let editorState
  try {
    editorState = EditorState.create({
      doc: store.doc,
      extensions: [
        ...basicExtension,
        ...sqlExtension,

        autocompletion({
          activateOnTyping: true,
          defaultKeymap: true
        }),

        history(),

        onUpdate(),

        tabBinding()
      ]
    })
  } catch (e) {
    console.log(e)
  }

  store.view = new EditorView({
    state: editorState,
    parent: editorEl.value
  })
}

const disposeEditor = () => {
  store?.view?.destroy()
}
const recreateEditor = () => {
  disposeEditor()
  initEditor()
}
/** 方法暴露 */
const redefineVal = val => {
  store.doc = val
  recreateEditor()
}
defineExpose({ redefineVal })

/** 按钮操作 */
const SQLEmpty = () => {
  if (store.doc.trim() === '') {
    proxy.$modal.notifyWarning('请先编辑 SQL 命令！')
    return false
  }
  return true
}
const onRunCode = () => {
  SQLEmpty() && emit('run', store.doc)
}
const onCopySQL = () => {
  if (SQLEmpty()) {
    copy(store.doc)
    proxy.$modal.msgSuccess('SQL 复制成功!')
  }
}
const onFormatSQL = () => {
  SQLEmpty() && redefineVal(format(store.doc))
}

const addNewTab = query => {
  tabsStore.addTab('', query)
}
const onCopyTabSQL = () => {
  const tab = tabsStore.currentTab
  addNewTab(tab.queries)
  tabsStore.setDBInfo(tab.databaseInfo)
  tabsStore.setHintInfo(tab.hintList)
  tabsStore.setTreeInfo(tab.treeList)
  tabsStore.setTableList([])
}

onMounted(initEditor)

onUnmounted(disposeEditor)
</script>

<style lang="scss">
.button-container {
  margin-bottom: 10px;
}
.codemirror-container {
  height: 240px;
  width: 100%;
  border: 1px solid #333;
  background: #fff;

  .cm-editor {
    height: 100%;
  }
}
</style>
