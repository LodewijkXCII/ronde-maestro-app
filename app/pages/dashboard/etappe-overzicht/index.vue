<script lang="ts" setup>
const sideBarStore = useSideBarStore();

onMounted(() => {
  if (!sideBarStore.upcomingRace) {
    sideBarStore.refreshUpcomingRace();
  }
});
</script>

<template>
  <main>
    <div class="wrapper-sm">
      <h2>Etappe overzicht</h2>

      <template v-if="sideBarStore.isClassicSeason && sideBarStore.classicsRaces">
        <RaceTable :classics-races="sideBarStore.classicsRaces" />
      </template>
      <template v-else>
        <RaceTable v-for="race in sideBarStore.upcomingRace" :key="race.id" :grand-tour="race" />
      </template>
    </div>
  </main>
</template>
