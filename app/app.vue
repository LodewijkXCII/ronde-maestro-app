<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `🚴 ${titleChunk} | RondeMaestro` : "RondeMaestro | Het wielerspel waarbij je elke dag dezelfde kansen hebt!";
  },
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
