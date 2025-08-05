<script lang="ts" setup>
import getParamId from "~/utils/param-extractor";

const config = useRuntimeConfig();
const sideBarStore = useSideBarStore();
const startlistStore = useStartlistStore();

const route = useRoute();

const { currentRace } = storeToRefs(sideBarStore);
const { currentStage } = storeToRefs(sideBarStore);
const compkey = ref(0);

const showAllTeams = ref(false);

function toggleAllTeams() {
  showAllTeams.value = !showAllTeams.value;
}
function handleChildToggle() {
  showAllTeams.value = false;
}

async function setRaceAndStageData(newRace: typeof sideBarStore.currentRace) {
  if (!route.params.id) {
    return;
  }

  const raceId = getParamId(route.params.id);
  if (!raceId) {
    return;
  }

  startlistStore.activeRaceIdForFetch = raceId;
  await startlistStore.refreshStartlistData();

  if (newRace && newRace.stages) {
    const stageNr = getParamId(route.params.nr);
    if (stageNr) {
      const foundStage = newRace.stages.find(stage => stage.stageNr === stageNr) || null;
      sideBarStore.currentStage = foundStage;
    }
  }
}

watch(
  () => ({
    raceId: route.params.id,
    stageNr: route.params.nr,
    currentRace: sideBarStore.currentRace,
  }),
  async ({ currentRace: newCurrentRace }) => {
    if (!sideBarStore.upcomingRace && sideBarStore.upcomingRaceStatus !== "pending") {
      await sideBarStore.refreshUpcomingRace();
    }
    setRaceAndStageData(newCurrentRace);
  },
  {
    immediate: true,
    deep: true,
  },
);
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
            <div class="avatar">
              <img :src="`${config.public.s3BucketURL}/${currentRace.image}`" :alt="currentRace.name">
            </div>
          </div>
          <div class="stage-box--body">
            <img :src="`${config.public.s3BucketURL}/${currentStage.image}`" :alt="`${currentStage.startCity}-${currentStage.finishCity}`">
          </div>
        </div>
        <StageTimer v-if="currentStage.date" :key="compkey" :stage-date="String(currentStage.date)" />
      </section>
      <Loading v-if="startlistStore.loading" />
      <section v-else class="cyclistSelector">
        <h2>Teams en renners</h2>
        <!-- TODO ADD FILTERS -->

        <div class="filter-group">
          <div class="toggle-switch">
            <label class="switch">
              <input type="checkbox" switch @click="toggleAllTeams">
              <div class="slider round" />
            </label>
            <p>{{ showAllTeams ? 'Verberg alle teams' : 'Toon alle teams' }}</p>
          </div>
        </div>
        <!-- Startlist -->
        <div v-if="startlistStore.startlistData" class="cyclistSelector--teams">
          <StartlistTeam
            v-for="{ team, cyclists } in startlistStore.startlistData"
            :key="team.id"
            :team="team"
            :cyclists
            :is-all-teams-shown="showAllTeams"
            @toggle-team-state="handleChildToggle"
          />
        </div>
        <!-- Selected Riders -->
      </section>
      <StartlistSelectedRiders />
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

    // FIXME CHECK THIS OUT
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
    grid-area: select;
    // position: sticky;
    // top: 2rem;
  }
}

.cyclistSelector {
  grid-area: startlist;

  &--teams {
    display: grid;
    gap: 2rem 1rem;
    grid-template-columns: repeat(3, var(--rider-card-width));
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

  .cyclistSelector {
    grid-area: startlist;

    &--teams {
      display: grid;
      gap: 1rem;
      grid-template-columns: var(--rider-card-width-dynamic);
    }
  }
}

@media (min-width: 64em) and (max-width: 90em) {
  .cyclistOverview {
    grid-template-columns: repeat(3, var(--rider-card-width));
    grid-template-areas: "info info info" "startlist startlist select";
  }
  .cyclistSelector {
    grid-area: startlist;

    &--teams {
      display: grid;
      grid-template-columns: repeat(2, var(--rider-card-width));
    }
  }
}

@media (min-width: 160em) {
  .cyclistOverview {
    grid-template-columns: repeat(6, var(--rider-card-width));
    grid-template-areas: "info info info info info info" "startlist startlist startlist startlist startlist select";
  }

  .cyclistSelector {
    grid-area: startlist;

    &--teams {
      display: grid;
      grid-template-columns: repeat(5, var(--rider-card-width));
    }
  }
}

.toggle-switch {
  display: flex;
  gap: 0.35rem;
  place-items: center;
  margin-bottom: 1em;

  p {
    margin: 0;
    vertical-align: text-top;
  }
}

.switch {
  position: relative;
  display: inline-block;
  width: 30px;
  height: 17px;
}

.switch input {
  display: none;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 13px;
  width: 13px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #101010;
}

input:focus + .slider {
  box-shadow: 0 0 1px #101010;
}

input:checked + .slider:before {
  -webkit-transform: translateX(13px);
  -ms-transform: translateX(13px);
  transform: translateX(13px);
}

.slider.round {
  border-radius: 17px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
