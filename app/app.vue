<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `🚴 ${titleChunk} | RondeMaestro` : "RondeMaestro | Het wielerspel waarbij je elke dag dezelfde kansen hebt!";
  },
});
</script>

<template>
  <NuxtLoadingIndicator color="#3b82f6" :height="4" :duration="2000" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
