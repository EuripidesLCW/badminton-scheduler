<template>
  <div class="container">
    <h1>🏸 羽球排場系統</h1>

    <!-- 新增玩家 -->
    <div class="addPlayer">
      <input v-model="playerName" placeholder="玩家名稱" />
      <select v-model="playerLevel">
        <option v-for="l in levels" :key="l.name" :value="l.name">
          {{ l.name }}
        </option>
      </select>
      <button @click="addPlayer">新增玩家</button>
    </div>

    <!-- 場地設定 -->
    <div class="courtSetting">
      場地數量
      <input type="number" v-model="courtCount" min="1" style="width: 60px" />
      <button @click="updateCourts">更新場地</button>
    </div>

    <!-- 休息區 -->
    <h2>休息區 ({{ bench.length }})</h2>
    <div class="bench">
      <div
        v-for="player in bench"
        :key="player.id"
        class="player"
        :class="{ selected: selectedPlayers.includes(player.id) }"
        :style="{ background: levelColor[player.level] }"
        @click="toggleSelect(player)"
      >
        {{ player.name }} - {{ player.level }}
      </div>
    </div>

    <!-- 帶入按鈕 -->
    <div style="text-align: center; margin: 10px 0">
      <label>選擇要帶入的場地：</label>
      <select v-model="selectedCourtId">
        <option v-for="c in courts" :key="c.id" :value="c.id">
          {{ c.name }}
        </option>
      </select>
      <button @click="moveSelectedToSlots">帶入場地</button>
      <button @click="moveSelectedToReserve">帶入預備區</button>
    </div>

    <!-- 場地顯示 -->
    <div class="courts">
      <div v-for="court in courts" :key="court.id" class="court">
        <input v-model="court.name" class="courtName" />

        <h4>場地玩家</h4>
        <draggable
          v-model="court.slots"
          item-key="id"
          class="slots"
          animation="150"
        >
          <template #item="{ element }">
            <div
              class="player"
              :style="{ background: levelColor[element.level] }"
            >
              {{ element.name }} - {{ element.level }}
            </div>
          </template>
        </draggable>

        <h4>預備區 (最多4人)</h4>
        <draggable
          v-model="court.reserve"
          item-key="id"
          class="bench"
          animation="150"
        >
          <template #item="{ element }">
            <div
              class="player"
              :style="{ background: levelColor[element.level] }"
            >
              {{ element.name }} - {{ element.level }}
            </div>
          </template>
        </draggable>

        <button class="finish" @click="finishCourt(court)">Finish</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import draggable from "vuedraggable";

// 等級設定
const levels = [
  { name: "新手", color: "#69db7c" },
  { name: "初階", color: "#f78fb3" },
  { name: "初中", color: "#f7e967" },
  { name: "中階", color: "#e6c200" },
  { name: "中進", color: "#4dabf7" },
  { name: "高階", color: "#888" },
  { name: "職業", color: "#000" },
];
const levelColor = {};
levels.forEach((l) => (levelColor[l.name] = l.color));

// 玩家與場地
const playerName = ref("");
const playerLevel = ref(levels[0].name);
const bench = ref([]);
const selectedPlayers = ref([]);

const courts = reactive([]);
const courtCount = ref(3);
const selectedCourtId = ref(null);

// 新增玩家
function addPlayer() {
  if (!playerName.value) {
    alert("請輸入玩家名稱");
    return;
  }
  const id = Date.now() + Math.random();
  bench.value.push({ id, name: playerName.value, level: playerLevel.value });
  playerName.value = "";
  playerLevel.value = levels[0].name;
}

// 選取玩家
function toggleSelect(player) {
  const idx = selectedPlayers.value.indexOf(player.id);
  if (idx >= 0) selectedPlayers.value.splice(idx, 1);
  else selectedPlayers.value.push(player.id);
}

// 更新場地數量，不清空玩家
function updateCourts() {
  const currentCount = courts.length;
  const targetCount = courtCount.value;

  if (targetCount > currentCount) {
    for (let i = currentCount + 1; i <= targetCount; i++) {
      courts.push({ id: i, name: `Court ${i}`, slots: [], reserve: [] });
    }
  } else if (targetCount < currentCount) {
    const removedCourts = courts.splice(targetCount);
    removedCourts.forEach((court) => {
      bench.value.push(...court.slots, ...court.reserve);
    });
  }
}

// 帶入場地
function moveSelectedToSlots() {
  if (!selectedCourtId.value) return;
  const court = courts.find((c) => c.id === selectedCourtId.value);
  if (!court) return;

  const selected = bench.value.filter((p) =>
    selectedPlayers.value.includes(p.id)
  );
  selectedPlayers.value = [];

  const availableSlots = 4 - court.slots.length;
  const toSlots = selected.slice(0, availableSlots);
  court.slots.push(...toSlots);

  bench.value = bench.value.filter((p) => !toSlots.includes(p));
}

// 帶入預備區
function moveSelectedToReserve() {
  if (!selectedCourtId.value) return;
  const court = courts.find((c) => c.id === selectedCourtId.value);
  if (!court) return;

  const selected = bench.value.filter((p) =>
    selectedPlayers.value.includes(p.id)
  );
  selectedPlayers.value = [];

  const availableReserve = 4 - court.reserve.length;
  const toReserve = selected.slice(0, availableReserve);
  court.reserve.push(...toReserve);

  bench.value = bench.value.filter((p) => !toReserve.includes(p));
}

// Finish 按鈕
function finishCourt(court) {
  bench.value.push(...court.slots);
  court.slots.splice(0);
  const fillCount = Math.min(court.reserve.length, 4);
  const toFill = court.reserve.splice(0, fillCount);
  court.slots.push(...toFill);
}
</script>

<style>
body {
  background: #f0f2f5;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 0;
}
.container {
  max-width: 1400px;
  margin: auto;
  padding: 20px;
}
h1 {
  text-align: center;
  margin-bottom: 25px;
  color: #333;
}
.addPlayer {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
  flex-wrap: wrap;
}
.addPlayer input,
.addPlayer select,
.addPlayer button {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
}
.addPlayer button {
  background-color: #4dabf7;
  color: white;
  border: none;
  cursor: pointer;
  transition: 0.2s;
}
.addPlayer button:hover {
  background-color: #1c7ed6;
}
.courtSetting {
  margin-bottom: 25px;
  text-align: center;
}
.courts {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}
.court {
  background-color: #fff;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s;
}
.court:hover {
  transform: translateY(-3px);
}
.courtName {
  width: 90%;
  margin-bottom: 10px;
  padding: 6px;
  font-weight: bold;
  font-size: 16px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 6px;
}
h4 {
  margin: 8px 0 4px 0;
  color: #555;
}
.slots,
.bench {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  padding: 10px;
  min-height: 100px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  width: 100%;
  background: #fafafa;
  margin-bottom: 10px;
  box-sizing: border-box;
}
.player {
  padding: 8px 10px;
  border-radius: 8px;
  color: white;
  text-align: center;
  font-weight: 500;
  cursor: grab;
  user-select: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  transition: transform 0.1s, box-shadow 0.2s, outline 0.2s, background 0.2s;
  position: relative;
}
/* 新增選取樣式 */
.player.selected {
  outline: 3px solid #ffd43b;
  background: #ffeaa7 !important;
  color: #333 !important;
}

.player:active {
  cursor: grabbing;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}
.finish {
  margin-top: 10px;
  padding: 8px 0;
  width: 90%;
  border: none;
  border-radius: 6px;
  background-color: #f03e3e;
  color: white;
  cursor: pointer;
  font-weight: bold;
  transition: 0.2s;
}
.finish:hover {
  background-color: #c92a2a;
}
h2 {
  text-align: center;
  margin-top: 25px;
  margin-bottom: 10px;
  color: #333;
}

/* 響應式 */
@media (max-width: 768px) {
  .courts {
    flex-direction: column;
    align-items: center;
  }
  .court {
    width: 90%;
  }
  .addPlayer {
    flex-direction: column;
    align-items: center;
  }
}
</style>
