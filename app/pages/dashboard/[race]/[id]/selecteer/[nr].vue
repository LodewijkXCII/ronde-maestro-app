<script lang="ts" setup>
import getParamId from "~/utils/param-extractor";

const config = useRuntimeConfig();
const sideBarStore = useSideBarStore();
const startlistStore = useStartlistStore();

const route = useRoute();

const currentRace = computed(() => {
  if (sideBarStore.currentRace) {
    return sideBarStore.currentRace;
  }
  return null;
});
const { currentStage } = storeToRefs(sideBarStore);
const compkey = ref(0);

async function getRaceData() {
  if (route.params.id) {
    const searchId = getParamId(route.params.id);

    if (searchId) {
      startlistStore.activeRaceIdForFetch = searchId;
      await startlistStore.refreshStartlistData();

      const stageId = getParamId(route.params.nr);

      if (stageId) {
        sideBarStore.currentStage = currentRace.value?.stages.find(stage => stage.stageNr === stageId) || null;
      }
    }

    if (!sideBarStore.upcomingRace && sideBarStore.upcomingRaceStatus !== "pending") {
      await sideBarStore.refreshUpcomingRace();
    }
  }
}

onMounted(() => {
  getRaceData();
});
</script>

<template>
  <main class="wrapper">
    <Loading v-if="sideBarStore.loading" />

    <div v-if="!sideBarStore.loading && !currentRace" role="alert" class="alert alert-error">
      <Icon name="tabler:alert-square-rounded" />
      <span>
        Er is geen race data gevonden!
      </span>
    </div>
    <div class="cyclistOverview">
      <section v-if="currentRace && currentStage" class="cyclistOverview-cards">
        <div class="stage-box stage-section">
          <div class="stage-box--title stage-section--race">
            <div>
              <h3>{{ currentRace.name }}</h3>
              <p class="stage-section--stage__info">
                Etappe {{ currentStage.stageNr }}: {{ currentStage.startCity }} - {{ currentStage.finishCity }}
              </p>
            </div>
            <img :src="`${config.public.s3BucketURL}/${currentRace.image}`" :alt="currentRace.name">
          </div>
          <div class="stage-box--body">
            <img :src="`${config.public.s3BucketURL}/${currentStage.image}`" :alt="`${currentStage.startCity}-${currentStage.finishCity}`">
          </div>
        </div>
        <StageTimer v-if="currentStage.date" :key="compkey" :stage-date="String(currentStage.date)" />
      </section>
      <section>
      <!-- Startlist -->
      <!-- Selected Riders -->
      </section>
    </div>
  </main>
  <!-- TO TOP COMPONENT -->
</template>

<style lang="scss">
.cyclistOverview {
  display: grid;
  grid-template-columns: repeat(4, var(--rider-card-width));
  grid-template-rows: auto auto;
  grid-template-areas:
    "info info info info"
    "startlist startlist startlist select";
  gap: 2rem 1rem;
  justify-content: center;

  .startlist {
    grid-area: startlist;
    display: grid;
    grid-template-columns: subgrid;
    row-gap: 1rem;
    grid-template-rows: max-content max-content auto;
  }

  aside {
    grid-area: select;
  }

  &-cards {
    grid-area: info;
    grid-template-columns: subgrid;
    display: grid;
    position: relative;

    // TODO CHECK THIS OUT
    // &::after {
    //   content: "";
    //   height: 100%;
    //   width: 100px;
    //   background-image: linear-gradient(to right, transparent, var(--clr-background));
    //   position: absolute;
    //   right: 0;
    // }
  }

  .selected-riders {
    position: sticky;
    top: 2rem;
  }
}

.stage-box {
  background: var(--clr-background-mute);
  padding: 1rem;
  border-radius: 5px;
  min-width: 90%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  &--body {
    justify-content: start;
  }
}

.stage-section {
  &--race {
    display: flex;
    gap: 0.25rem;
    justify-content: space-between;
    align-items: center;

    img {
      width: 75px;
      aspect-ratio: 1;
      object-fit: cover;
    }
    h3 {
      font-weight: 700;
      text-transform: uppercase;
    }
    p {
      margin: 0;
    }
  }
}

@media (min-width: 20em) and (max-width: 64em) {
  .cyclistOverview {
    grid-template-columns: var(--rider-card-width-dynamic);
    grid-template-rows: auto;
    grid-template-areas:
      "info"
      "select"
      "startlist";

    &-cards {
      display: flex;
      overflow: scroll;
      gap: 1rem;

      > * {
        min-width: 80%;
      }
    }
  }
}

@media (min-width: 64em) and (max-width: 90em) {
  .cyclistOverview {
    grid-template-columns: repeat(3, var(--rider-card-width));
    grid-template-areas: "info info info" "startlist startlist select";
  }
}

@media (min-width: 160em) {
  .cyclistOverview {
    grid-template-columns: repeat(6, var(--rider-card-width));
    grid-template-areas: "info info info info info info" "startlist startlist startlist startlist startlist select";
  }
}
</style>
