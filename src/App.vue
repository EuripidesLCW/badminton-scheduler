<template>
  <div class="app">
    <h1>羽球排場系統</h1>

    <AddPlayer :levels="levels" @add="addPlayer" />

    <RestArea
      :players="restPlayers"
      :selectedIds="selectedIds"
      @toggle="toggle"
      @delete="removePlayer"
    />

    <div class="courts">
      <Court
        v-for="court in courts"
        :key="court.id"
        :court="court"
        :selectedIds="selectedIds"
        @toggle="toggle"
        @addCourt="addCourt"
        @addStandby="addStandby"
        @finish="finishCourt"
        @auto="autoFill"
      />
    </div>
  </div>
</template>

<script setup>
import AddPlayer from "./components/AddPlayer.vue";
import RestArea from "./components/RestArea.vue";
import Court from "./components/Court.vue";
import { useCourtSystem } from "./composables/useCourtSystem.js";

const levels = [
  { name: "新手", color: "#FFE0B2" },
  { name: "初階", color: "#FFCC80" },
  { name: "初中", color: "#FFB74D" },
  { name: "中階", color: "#FFA726" },
  { name: "中進", color: "#FF9800" },
  { name: "高階", color: "#FB8C00" },
  { name: "職業", color: "#F57C00" },
];

const {
  restPlayers,
  courts,
  selectedIds,
  addPlayer,
  toggle,
  addCourt,
  addStandby,
  finishCourt,
  autoFill,
  removePlayer,
} = useCourtSystem();
</script>
