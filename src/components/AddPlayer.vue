<template>
  <div class="card">
    <!-- 單一新增 -->
    <div class="add-player">
      <input v-model="name" placeholder="玩家姓名" />

      <select v-model="level">
        <option v-for="l in levels" :key="l.name" :value="l">
          {{ l.name }}
        </option>
      </select>

      <button @click="add">新增</button>
    </div>

    <!-- 批次新增 -->
    <div class="batch-import">
      <h3>批次載入</h3>

      <textarea
        v-model="batchText"
        placeholder="
        規則:
        *開頭 *結尾 數字 + _ + 等級
        數字中間可以有空格或是換行
        範例:
        *1.王曉明_新手 2.李曉明_初階*"
        rows="6"
      ></textarea>

      <button class="secondary" @click="importBatch">批次載入</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

/* 接收 App.vue 的等級設定 */
const props = defineProps({
  levels: {
    type: Array,
    required: true,
  },
});

/* 發送新增玩家事件 */
const emit = defineEmits(["add"]);

const name = ref("");
const level = ref(null);
const batchText = ref("");

/* 預設等級 */
level.value = props.levels[0];

/* 單一新增 */
function add() {
  if (!name.value) return;

  emit("add", {
    name: name.value,
    level: level.value,
  });

  name.value = "";
}

/* 批次新增 */
function importBatch() {
  let text = batchText.value.trim();

  if (!text.startsWith("*") || !text.endsWith("*")) {
    alert("格式錯誤，需以 * 開頭與結尾");
    return;
  }

  text = text.slice(1, -1);

  const lines = text.split("\n");

  lines.forEach((line) => {
    line = line.trim();
    if (!line) return;

    const match = line.match(/^\d+\.\s*(.+)$/);
    if (!match) return;

    const data = match[1].split("_");

    const playerName = data[0]?.trim();
    const levelName = data[1]?.trim();

    if (!playerName) return;

    /* 找對應等級 */
    let levelObj = props.levels.find((l) => l.name === levelName);

    /* 如果找不到等級 → X */
    if (!levelObj) {
      levelObj = props.levels.find((l) => l.name === "X");
    }

    emit("add", {
      name: playerName,
      level: levelObj,
    });
  });

  batchText.value = "";
}
</script>

<style scoped>
.batch-import {
  margin-top: 15px;
}

.batch-import textarea {
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #e7cfc3;
  margin-bottom: 8px;
  resize: vertical;
}
</style>
