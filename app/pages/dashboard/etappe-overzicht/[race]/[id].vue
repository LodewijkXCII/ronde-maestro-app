<script lang="ts" setup>
import getParamId from "~/utils/param-extractor";

const sideBarStore = useSideBarStore();
const route = useRoute();

const currentRace = computed(() => {
  return sideBarStore.currentRace;
});

async function getRaceData() {
  if (!sideBarStore.upcomingRace) {
    await sideBarStore.refreshUpcomingRace();
  }
  if (route && sideBarStore.upcomingRace) {
    const seachId = getParamId(route.params.id);
    sideBarStore.currentRace = sideBarStore.upcomingRace.find(race => race.id === seachId) || null;
  }
}

onMounted(() => {
  getRaceData();
});
</script>

<template>
  <main class="wrapper-small">
    <h2>Etappe overzicht</h2>

    <RaceTable v-if="currentRace" :race="currentRace" />
  </main>
</template>
