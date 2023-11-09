<template>
  <div>Page: detail03 role={{ role }}</div>
</template>

<script lang="ts" setup>
const route = useRoute()
const { role } = route.params

definePageMeta({
  validate: (route) => {
    // return /^\d+$/.test(route.params.role as string)
    return {
      statusCode: 401,
      statusMessage: 'valid error'
    }
  }
})
</script>
