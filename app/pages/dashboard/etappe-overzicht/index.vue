<script lang="ts" setup>
const sideBarStore = useSideBarStore();

onMounted(() => {
  if (!sideBarStore.upcomingRace) {
    sideBarStore.refreshUpcomingRace();
  }
});
</script>

<template>
  <main class="wrapper-small">
    <h2>Etappe overzicht</h2>

    <article v-for="race in sideBarStore.upcomingRace" :key="race.id">
      <h3>Etappes voor {{ race.name }}</h3>
      <ul class="table">
        <li class="table-row table-header">
          <div>#</div>
          <div />
          <div>Start en finish</div>
          <div />
          <div>Afstand</div>
          <div />
        </li>
        <li
          v-for="stage in race.stages"
          :key="stage.id"
          class="table-row"
          @click="goToStage(stage.id)"
        >
          <EtappeRow :stage="stage" />
        </li>
      </ul>
    </article>
  </main>
</template>
