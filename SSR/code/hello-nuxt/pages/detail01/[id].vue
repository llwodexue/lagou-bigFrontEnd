<template>
  <div>Page: detail01  id={{ id }}</div>
</template>

<script lang="ts" setup>
const route = useRoute()
const { id } = route.params
</script>
