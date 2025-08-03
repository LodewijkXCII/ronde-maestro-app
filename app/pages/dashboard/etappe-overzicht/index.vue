<script lang="ts" setup>
const sideBarStore = useSideBarStore();

onMounted(() => {
  if (!sideBarStore.upcomingRace) {
    sideBarStore.refreshUpcomingRace();
  }
});
</script>

<template>
  <main class="wrapper-small">
    <h2>Etappe overzicht</h2>

    <RaceTable v-for="race in sideBarStore.upcomingRace" :key="race.id" :race />
  </main>
</template>
