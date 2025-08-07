<script lang="ts" setup>
const sideBarStore = useSideBarStore();

const currentRace = computed(() => {
  return sideBarStore.currentRace;
});

async function getRaceData() {
  if (!sideBarStore.upcomingRace) {
    await sideBarStore.refreshUpcomingRace();
  }
}

onMounted(() => {
  getRaceData();
});
</script>

<template>
  <main class="wrapper-sm">
    <h2>Etappe overzicht</h2>

    <RaceTable v-if="currentRace" :race="currentRace" />
  </main>
</template>
