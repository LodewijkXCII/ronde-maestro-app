<script setup lang="ts">
const sideBarStore = useSideBarStore();

const { pouleData } = storeToRefs(sideBarStore);

onMounted(() => {
  if (!sideBarStore.pouleData) {
    sideBarStore.refreshPouleData();
  }
});
</script>

<template>
  <div class="icon-header">
    <Icon name="tabler:users" />
    <h3>Lid worden van een ploeg</h3>
  </div>
  <div class="team-list">
    <PoulesTeam v-for="poule in pouleData" :key="poule.id" :poule />
  </div>
</template>

<style lang="scss">
.team-list {
  display: grid;
  gap: 0.5rem;
  margin-top: 1rem;
}
</style>
