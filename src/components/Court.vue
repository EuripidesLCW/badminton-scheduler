<template>
  <div class="card">
    <input v-model="court.name" class="court-name" />
    <h4>場上</h4>
    <div class="grid">
      <PlayerCard
        v-for="p in court.players"
        :key="p.id"
        :player="p"
        :selected="selectedIds.includes(p.id)"
        @toggle="$emit('toggle', p)"
      />
    </div>
    <h4>預備 ({{ court.standby.length }})</h4>
    <div class="grid">
      <PlayerCard
        v-for="p in court.standby"
        :key="p.id"
        :player="p"
        :selected="selectedIds.includes(p.id)"
        @toggle="$emit('toggle', p)"
      />
    </div>
    <div class="buttons">
      <button @click="$emit('addCourt', court)">帶入場地</button>
      <button class="secondary" @click="$emit('addStandby', court)">
        預備
      </button>
      <button class="danger" @click="$emit('finish', court)">Finish</button>
      <button @click="$emit('auto', court)">自動</button>
    </div>
  </div>
</template>

<script setup>
import PlayerCard from "./PlayerCard.vue";
defineProps({
  court: Object,
  selectedIds: Array,
});
</script>
