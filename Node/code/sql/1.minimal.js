import { EditorView, keymap } from '@codemirror/view'
import { defaultKeymap } from '@codemirror/commands'

let myView = new EditorView({
  doc: 'hello',
  extensions: [keymap.of(defaultKeymap)],
  parent: document.body
})
