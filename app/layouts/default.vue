<script lang="ts" setup>
const authStore = useAuthStore();
const sideBarStore = useSideBarStore();

onMounted(async () => {
  await authStore.init();

  if (authStore.user) {
    await sideBarStore.refreshUpcomingRace();
  }
});
</script>

<template>
  <AppNavBar />
  <NuxtPage />
</template>
