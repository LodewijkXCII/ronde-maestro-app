<!-- eslint-disable unicorn/filename-case -->
<script lang="ts" setup>
const route = useRoute();
</script>

<template>
  <main class="wrapper">
    <h2>Etappe uitslag van {{ route.params.race }}</h2>
    <pre>{{ route.fullPath }}</pre>
  </main>
</template>
