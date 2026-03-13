<template>
  <div class="app-container">
    <h1>羽球排場系統</h1>

    <!-- 新增玩家 -->
    <div class="add-player">
      <input v-model="newPlayerName" placeholder="玩家姓名" />
      <select v-model="newPlayerLevel">
        <option v-for="level in levels" :key="level.name" :value="level">
          {{ level.name }}
        </option>
      </select>
      <button @click="addPlayer">新增玩家</button>
    </div>

    <!-- 休息區 -->
    <div class="rest-area">
      <h2>休息區</h2>
      <div class="player-list">
        <div
          v-for="player in restPlayers"
          :key="player.id"
          :style="{ backgroundColor: player.level.color }"
          :class="{ selected: selectedPlayers.includes(player) }"
          @click="toggleSelect(player)"
        >
          {{ player.name }} ({{ player.level.name }})
        </div>
      </div>
    </div>

    <!-- 場地區 -->
    <div class="courts-area">
      <div v-for="court in courts" :key="court.id" class="court-container">
        <!-- 場地名稱可編輯 -->
        <input v-model="court.name" class="court-name" />

        <!-- 場地玩家 -->
        <div class="players-grid">
          <div
            v-for="player in court.players"
            :key="player.id"
            :style="{ backgroundColor: player.level.color }"
            :class="{ selected: selectedPlayers.includes(player) }"
            @click="toggleSelect(player)"
          >
            {{ player.name }} ({{ player.level.name }})
          </div>
          <div
            v-for="n in 4 - court.players.length"
            :key="n"
            class="empty-slot"
          ></div>
        </div>

        <!-- 預備區 -->
        <div class="players-grid standby">
          <div
            v-for="player in court.standby"
            :key="player.id"
            :style="{ backgroundColor: player.level.color }"
            :class="{ selected: selectedPlayers.includes(player) }"
            @click="toggleSelect(player)"
          >
            {{ player.name }} ({{ player.level.name }})
          </div>
          <div
            v-for="n in 4 - court.standby.length"
            :key="n"
            class="empty-slot"
          ></div>
        </div>

        <!-- 帶入 / Finish 按鈕 -->
        <div class="court-buttons">
          <button @click="addSelectedToCourt(court)">帶入場地</button>
          <button @click="addSelectedToStandby(court)">帶入預備區</button>
          <button @click="finishCourt(court)">Finish</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let idCounter = 1;
export default {
  data() {
    return {
      newPlayerName: "",
      newPlayerLevel: null,
      levels: [
        { name: "新手", color: "green" },
        { name: "初階", color: "pink" },
        { name: "初中", color: "yellow" },
        { name: "中階", color: "orange" },
        { name: "中進", color: "blue" },
        { name: "高階", color: "gray" },
        { name: "職業", color: "black" },
      ],
      restPlayers: [],
      selectedPlayers: [],
      courts: Array.from({ length: 6 }, (_, i) => ({
        id: i + 1,
        name: `場地${String.fromCharCode(65 + i)}`, // 預設 A~F
        players: [],
        standby: [],
      })),
    };
  },
  mounted() {
    this.newPlayerLevel = this.levels[0];
  },
  methods: {
    addPlayer() {
      if (!this.newPlayerName) return;
      const player = {
        id: idCounter++,
        name: this.newPlayerName,
        level: this.newPlayerLevel,
      };
      this.restPlayers.push(player);
      this.newPlayerName = "";
      this.newPlayerLevel = this.levels[0];
    },
    toggleSelect(player) {
      const index = this.selectedPlayers.indexOf(player);
      if (index >= 0) this.selectedPlayers.splice(index, 1);
      else this.selectedPlayers.push(player);
    },
    addSelectedToCourt(court) {
      for (let player of [...this.selectedPlayers]) {
        if (court.players.length < 4 && this.restPlayers.includes(player)) {
          court.players.push(player);
          this.restPlayers.splice(this.restPlayers.indexOf(player), 1);
        }
      }
      this.selectedPlayers = [];
    },
    addSelectedToStandby(court) {
      for (let player of [...this.selectedPlayers]) {
        if (court.standby.length < 4 && this.restPlayers.includes(player)) {
          court.standby.push(player);
          this.restPlayers.splice(this.restPlayers.indexOf(player), 1);
        }
      }
      this.selectedPlayers = [];
    },
    finishCourt(court) {
      // 場地玩家回休息區
      this.restPlayers.push(...court.players);
      court.players = [];
      // 從預備區補滿場地
      while (court.players.length < 4 && court.standby.length > 0) {
        court.players.push(court.standby.shift());
      }
    },
  },
};
</script>

<style scoped>
.app-container {
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  color: #333;
}

/* 新增玩家區 */
.add-player {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
  background-color: #fff;
  justify-content: center;
  align-items: center;
}
.add-player input,
.add-player select {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* 按鈕統一風格 */
button {
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
}
button:hover {
  opacity: 0.9;
}

/* 休息區 */
.rest-area {
  margin-bottom: 20px;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
  background-color: #fff;
}
.player-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.player-list div {
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  color: white;
  min-width: 80px;
  text-align: center;
  transition: transform 0.1s;
}
.player-list div.selected,
.players-grid div.selected {
  background-color: #ffd700 !important; /* 選取時背景色（金黃色） */
  color: #000 !important; /* 文字顏色改深色，提高對比 */
  outline: 2px solid #ff8c00; /* 邊框加深橙色 */
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.3); /* 陰影 */
  transform: scale(1.05); /* 微放大 */
  transition: transform 0.15s, box-shadow 0.15s, background-color 0.15s,
    outline 0.15s;
}

/* 場地區 */
.courts-area {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.court-container {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 15px;
  flex: 1 1 300px;
  min-width: 250px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}
.court-name {
  font-weight: bold;
  font-size: 1.1em;
  margin-bottom: 10px;
  padding: 5px;
  text-align: center;
}

/* 場地玩家 & 預備區 */
.players-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 10px;
}
.players-grid.standby {
  margin-bottom: 15px;
}
.players-grid div {
  padding: 10px;
  border-radius: 6px;
  color: white;
  text-align: center;
  cursor: pointer;
  transition: transform 0.1s;
}
.players-grid div.selected {
  outline: 3px solid #555;
  transform: scale(1.05);
}
.empty-slot {
  border: 1px dashed #bbb;
  height: 40px;
  border-radius: 6px;
  background-color: #fafafa;
}

/* 場地按鈕 */
.court-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.court-buttons button {
  flex: 1 1 30%;
  background-color: #4caf50; /* 綠色乾淨按鈕 */
  color: white;
}
.court-buttons button:nth-child(2) {
  background-color: #2196f3; /* 藍色按鈕 */
}
.court-buttons button:nth-child(3) {
  background-color: #f44336; /* 紅色 Finish 按鈕 */
}

/* 響應式 */
@media (max-width: 600px) {
  .courts-area {
    flex-direction: column;
  }
  .court-buttons button {
    flex: 1 1 100%;
  }
}
</style>
