<template>
  <div id="child">
    <h2>子组件h2</h2>
    <h3>子组件h3</h3>
  </div>
</template>

<script>
export default {
  name: "ChildChild"
}
</script>

<style scoped>
h3 {
  background-color: blue;
}
</style>
<style>
h2 {
  background-color: blue;
}
</style>