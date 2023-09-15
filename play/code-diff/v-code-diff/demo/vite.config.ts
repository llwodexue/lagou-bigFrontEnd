import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [Vue(), Components({ resolvers: [AntDesignVueResolver()], dts: false })],
  resolve: {
    alias: {
      'vue': 'vue3',
      'vue-demi': '../node_modules/vue-demi/lib/v3/index.mjs',
    },
  },
})
