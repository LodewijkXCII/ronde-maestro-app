<script lang="ts" setup>
const authStore = useAuthStore();
const sideBarStore = useSideBarStore();
const raceStore = useRaceStore();

onMounted(async () => {
  await authStore.init();

  if (authStore.user) {
    await sideBarStore.refreshUpcomingRace();

    if (!raceStore.raceResult) {
      await raceStore.refreshRaceResult();
    }
  }
});
</script>

<template>
  <AppNavBar />
  <NuxtPage />
  <AppToast />
  <AppFooter />
</template>
