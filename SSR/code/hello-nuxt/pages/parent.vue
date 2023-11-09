<script lang="ts" setup></script>

<template>
  <div>
    Page: Parent
    <NuxtLink to="/parent/child1">
      <button>child1</button>
    </NuxtLink>
    <NuxtLink to="/parent/child2">
      <button>child2</button>
    </NuxtLink>
    <NuxtLink to="/parent">
      <button>parent</button>
    </NuxtLink>

    <NuxtPage></NuxtPage>
  </div>
</template>

<style scoped></style>
