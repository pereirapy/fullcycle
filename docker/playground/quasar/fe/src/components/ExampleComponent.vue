<template>
  <div>
    <p>{{ title }}</p>
    <ul>
      <li v-for="todo in todos" :key="todo.id" @click="increment">
        {{ todo.id }} - {{ todo.content }}
      </li>
    </ul>
    <p>Count: {{ todoCount }} / {{ meta.totalCount }}</p>
    <p>Active: {{ active ? 'yes' : 'no' }}</p>
    <p>Clicks on todos: {{ clickCount }}</p>
    <p @click="loadData">Load data from local DB</p>
    <p>Loading: {{ loading ? 'yes' : 'no' }}</p>

    <ul>
      <li v-for="item in people" :key="item.id" >
        {{ item.id }} - {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  computed,
  ref,
  toRef,
  Ref,
} from 'vue';
import { api } from 'boot/axios'
import { Todo, Meta, People } from './models';

function useClickCount() {
  const clickCount = ref(0);
  function increment() {
    clickCount.value += 1
    return clickCount.value;
  }

  return { clickCount, increment };
}

function useLoadData () {
  const people = ref<People[]>([]);
  const error = ref(null);
  const loading = ref(false);
  function loadData () {
    loading.value = true;
    api.get('/')
      .then((response) => {
        people.value = response.data.rows;
        loading.value = false;

      })
      .catch((e) => {
       error.value = e;
       loading.value = false;

      })
  }
  return {people, error, loadData, loading};
  }

function useDisplayTodo(todos: Ref<Todo[]>) {
  const todoCount = computed(() => todos.value.length);
  return { todoCount };
}

export default defineComponent({
  name: 'ExampleComponent',
  props: {
    title: {
      type: String,
      required: true
    },
    todos: {
      type: Array as PropType<Todo[]>,
      default: () => []
    },
    people: {
      type: Array as PropType<People[]>,
      default: () => []
    },
    meta: {
      type: Object as PropType<Meta>,
      required: true
    },
    active: {
      type: Boolean
    },
    loading: {
      type: Boolean
    }

  },
  setup (props) {
    return { ...useClickCount(), ...useLoadData(), ...useDisplayTodo(toRef(props, 'todos')) };
  },
});
</script>
