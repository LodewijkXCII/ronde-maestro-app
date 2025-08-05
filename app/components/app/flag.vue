<script lang="ts" setup>
defineProps<{
  countryCode?: string | undefined;
  countryId?: number | undefined;
  size?: "small" | "normal" | "big";
}>();
</script>

<template>
  <CountryFlag
    v-if="countryCode"
    :country="countryCode"
    :size
    rounded
  />
</template>

<style>
.normal-flag {
  /* margin: 0 !important; */
}

.small-flag {
  margin-bottom: -1.1em !important;
  transform: scale(0.3) !important;
}
</style>
