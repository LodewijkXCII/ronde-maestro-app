<script lang="ts" setup>
import getParamId from "~/utils/param-extractor";

const config = useRuntimeConfig();
const sideBarStore = useSideBarStore();
const route = useRoute();

async function getRaceData() {
  if (!sideBarStore.upcomingRace) {
    await sideBarStore.refreshUpcomingRace();
  }
  if (route && sideBarStore.upcomingRace) {
    const seachId = getParamId(route.params.id);
    sideBarStore.currentRace = sideBarStore.upcomingRace.find(race => race.id === seachId) || null;
  }
}

onMounted(() => {
  getRaceData();
});
</script>

<template>
  <main class="wrapper-small">
    <h2>Etappe overzicht</h2>

    <article v-if="sideBarStore.currentRace">
      <h3>Etappes voor {{ sideBarStore.currentRace.name }}</h3>
      <ul class="table">
        <li class="table-row table-header">
          <div>#</div>
          <div />
          <div>Start en finish</div>
          <div />
          <div>Afstand</div>
        </li>
        <li
          v-for="stage in sideBarStore.currentRace.stages"
          :key="stage.id"
          class="table-row"
          @click="goToStage(stage.id)"
        >
          <div>{{ stage.stageNr }}</div>
          <div>
            {{ new Date(stage.date).toLocaleDateString("nl-NL", {
              day: '2-digit',
              month: 'short',
            }) }}
          </div>
          <div class="table-grow">
            {{ stage.startCity }} - {{ stage.finishCity }}
          </div>
          <div>
            <img :src="`${config.public.s3BucketURL}/${stage.stageType.image}`" :alt="stage.stageType.name">
          </div>
          <div>{{ stage.distance }} km</div>
          <div class="table-action">
            <NuxtLink v-if="stage.done" to="/dashboard">
              <Icon name="tabler:trophy" size="24" style="color:var(--clr-accent-green)" />
              Bekijk uitslag
            </NuxtLink>
            <NuxtLink v-else-if="!stage.done && stageUnderway(stage.date)" to="/dashboard">
              <Icon name="tabler:pencil-off" size="24" style="color:var(--clr-alert)" />
              Etappe onderweg
            </NuxtLink>
            <NuxtLink v-else to="/dashboard">
              <Icon name="tabler:pencil" size="24" style="color:var(--clr-primary)" />
              Selecteer renners
            </NuxtLink>
          </div>
        </li>
      </ul>
    </article>
  </main>
</template>
