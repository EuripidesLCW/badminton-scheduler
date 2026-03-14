import { ref } from "vue";

let idCounter = 1;

export function useCourtSystem() {
  const restPlayers = ref([]);
  const selectedIds = ref([]);
  const courts = ref(
    Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `場地${String.fromCharCode(65 + i)}`,
      players: [],
      standby: [],
    })),
  );

  function addPlayer(player) {
    restPlayers.value.push({ id: idCounter++, ...player });
  }

  function toggle(player) {
    const idx = selectedIds.value.indexOf(player.id);
    if (idx >= 0) selectedIds.value.splice(idx, 1);
    else selectedIds.value.push(player.id);
  }

  function addCourt(court) {
    selectedIds.value.forEach((id) => {
      const i = restPlayers.value.findIndex((p) => p.id === id);
      if (i !== -1 && court.players.length < 4) {
        court.players.push(restPlayers.value[i]);
        restPlayers.value.splice(i, 1);
      }
    });
    selectedIds.value = [];
  }

  function addStandby(court) {
    selectedIds.value.forEach((id) => {
      const i = restPlayers.value.findIndex((p) => p.id === id);
      if (i !== -1 && court.standby.length < 4) {
        court.standby.push(restPlayers.value[i]);
        restPlayers.value.splice(i, 1);
      }
    });
    selectedIds.value = [];
  }

  function finishCourt(court) {
    restPlayers.value.push(...court.players);
    court.players = [];
    while (court.players.length < 4 && court.standby.length) {
      court.players.push(court.standby.shift());
    }
  }

  function autoFill(court) {
    while (court.players.length < 4 && restPlayers.value.length) {
      court.players.push(restPlayers.value.shift());
    }
  }

  function removePlayer(player) {
    restPlayers.value = restPlayers.value.filter((p) => p.id !== player.id);
    courts.value.forEach((c) => {
      c.players = c.players.filter((p) => p.id !== player.id);
      c.standby = c.standby.filter((p) => p.id !== player.id);
    });
    selectedIds.value = selectedIds.value.filter((id) => id !== player.id);
  }

  return {
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
  };
}
