import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { createVuePlugin as vue2 } from 'vite-plugin-vue2'
import ScriptSetup from 'unplugin-vue2-script-setup/vite'
import { baseBuildConfig, defaultPlugins } from '../vite.base.config'

export const viteVue2Config = defineConfig({
  plugins: [vue2(), ...defaultPlugins, ScriptSetup({ reactivityTransform: true })],
  server: {
    port: 2000,
  },
  resolve: {
    alias: {
      'vue': resolve(__dirname, './node_modules/vue/dist/vue.runtime.esm.js'),
      'vue-demi': resolve(__dirname, '../node_modules/vue-demi/lib/v2/index.mjs'),
    },
  },
  ...baseBuildConfig,
})

export default viteVue2Config
