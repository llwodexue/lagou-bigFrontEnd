<template>
  <section class="todoapp">
    <toDoHeader />
    <section class="main">
      <input id="toggle-all" class="toggle-all" type="checkbox" />
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <toDoItem v-for="todo in todos" :key="todo.id" data-testid="todo-item" />
      </ul>
    </section>
    <todoFooter />
  </section>
</template>
<script>
import toDoHeader from './toDoHeader.vue'
import todoFooter from './toDoFooter.vue'
import toDoItem from './toDoItem.vue'

export default {
  components: { toDoHeader, todoFooter, toDoItem },
  data () {
    return {
      todos: [{ id: 1, text: 'eat', done: false },
        { id: 2, text: 'sleep', done: true },
        { id: 3, text: 'play', done: false }]
    }
  }
}
</script>
