<template>
  <div
    class="player-card"
    :style="{ backgroundColor: player.level.color }"
    :class="{ selected: selected }"
    @click.stop="toggleSelect"
  >
    {{ player.name }} ({{ player.level.name }})
    <span v-if="deletable" class="delete-btn" @click.stop="deletePlayer"
      >×</span
    >
  </div>
</template>

<script setup>
const props = defineProps({
  player: Object,
  selected: Boolean,
  deletable: { type: Boolean, default: false },
});

const emit = defineEmits(["toggle", "delete"]);

function toggleSelect() {
  // 一定要使用 props.player
  emit("toggle", props.player);
}

function deletePlayer() {
  // 一定要使用 props.player
  emit("delete", props.player);
}
</script>
