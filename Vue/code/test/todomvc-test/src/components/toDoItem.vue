<template>
  <li class="completed">
    <div class="view">
      <input data-testid="todo-done" class="toggle" type="checkbox" :checked="todo.done" />
      <label data-testid="todo-text">{{ todo.text }}</label>
      <button class="destroy"></button>
    </div>
    <input class="edit" value="Create a TodoMVC template" />
  </li>
</template>

<script>
export default {
  props: {
    todo: {
      type: Object,
      require: true
    }
  }
}
</script>
