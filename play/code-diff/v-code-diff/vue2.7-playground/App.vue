<script lang="ts" setup>
import { version } from 'vue-demi'
import { reactive } from 'vue'

const form = reactive({
  oldString: '<script setup lang="ts">',
  newString: '<script lang="ts" setup>',
  language: 'python',
  diffStyle: 'word',
})
</script>

<template>
  <div>
    <p align="center">
      Vue version: {{ version }}
    </p>
    <textarea v-model="form.oldString" style="width: 48vw" :rows="20" />
    <textarea v-model="form.newString" style="width: 48vw; margin-left: 20px" :rows="20" />
    <CodeDiff
      :old-string="form.oldString"
      :new-string="form.newString"
      :language="form.language"
      :diff-style="form.diffStyle"
      output-format="side-by-side"
    />
  </div>
</template>

<style>
body > div {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
