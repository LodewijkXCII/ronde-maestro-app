<script lang="ts" setup>
onMounted(async () => {
  const authStore = useAuthStore();
  await authStore.init();

  const sideBarStore = useSideBarStore();
  await sideBarStore.refreshUpcomingRace();
});
</script>

<template>
  <AppNavBar />
  <NuxtPage />
</template>
