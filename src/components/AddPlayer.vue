<template>
  <div class="card add-player">
    <input v-model="name" placeholder="玩家姓名" />
    <select v-model="level">
      <option v-for="l in levels" :key="l.name" :value="l">{{ l.name }}</option>
    </select>
    <button @click="submit">新增</button>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
const props = defineProps({ levels: Array });
const emit = defineEmits(["add"]);
const name = ref("");
const level = ref(props.levels[0]);

function submit() {
  if (!name.value) return;
  emit("add", { name: name.value, level: level.value });
  name.value = "";
  level.value = props.levels[0];
}
</script>
