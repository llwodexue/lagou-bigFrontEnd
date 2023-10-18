const PageTemplate = (pageName) => `<template>
<view class="${pageName}">
</view>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ${pageName} extends Vue {
onLoad() {}
}
</script>

<style>
</style>
`

const ComponentTemplate = (componentName) => `<template>
<view class="${componentName}">
</view>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ${componentName} extends Vue {
onAttach() {}
}
</script>

<style>
</style>
`

module.exports = {
    PageTemplate,
    ComponentTemplate
}