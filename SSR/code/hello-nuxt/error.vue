<script lang="ts" setup>
defineProps({
  error: Object
})
</script>

<template>
  <div>
    Page: Error
    {{ error }}
    <button @click="clearError({ redirect: '/' })">back</button>
  </div>
</template>

<style scoped></style>
