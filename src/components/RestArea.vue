<template>
  <div class="card">
    <h3>休息區 ({{ players.length }})</h3>
    <div class="player-list">
      <PlayerCard
        v-for="p in players"
        :key="p.id"
        :player="p"
        :selected="selectedIds.includes(p.id)"
        :deletable="true"
        @toggle="$emit('toggle', p)"
        @delete="$emit('delete', p)"
      />
    </div>
  </div>
</template>

<script setup>
import PlayerCard from "./PlayerCard.vue";
defineProps({
  players: Array,
  selectedIds: Array,
});
const emit = defineEmits(["toggle", "delete"]);
</script>
