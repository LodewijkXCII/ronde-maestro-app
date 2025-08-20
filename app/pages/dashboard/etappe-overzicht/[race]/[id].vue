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
    <AppNavigation current-route="Etappe overzicht" />
    <div class="title-bar">
      <h2>Etappe overzicht</h2>
      <NuxtLink
        v-if="currentRace"
        :to="{
          name: 'dashboard-race-id-klassement',
          params: {
            race: slugify(currentRace.name),
            id: currentRace.id,
          },
        }"
        class="btn btn-secondary"
      >
        Ga naar klassement
        <Icon name="tabler:arrow-right" />
      </NuxtLink>
    </div>
    <RaceTable v-if="currentRace" :race="currentRace" />
  </main>
</template>

<style>
.title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
