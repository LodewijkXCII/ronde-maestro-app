<script lang="ts" setup>
onMounted(async () => {
  const authStore = useAuthStore();
  await authStore.init();

  if (authStore.user) {
    const sideBarStore = useSideBarStore();
    await sideBarStore.refreshUpcomingRace();
  }
});
</script>

<template>
  <AppNavBar />
  <NuxtPage />
</template>
