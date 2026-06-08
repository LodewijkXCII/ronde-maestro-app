<script lang="ts" setup>
import getParamId from "~/utils/param-extractor";

const sideBarStore = useSideBarStore();
const startlistStore = useStartlistStore();
const route = useRoute();

const { currentStage, currentRace } = storeToRefs(sideBarStore);

const compkey = ref(0);

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
  { deep: true, immediate: true },
);
</script>

<template>
  <main>
    <div class="wrapper wrapper-nobg">
      <Loading v-if="sideBarStore.loading" />

      <div v-if="!sideBarStore.loading && !currentRace" role="alert" class="alert alert-error">
        <Icon name="tabler:alert-square-rounded" />
        <span>
          Er is geen race data gevonden!
        </span>
      </div>
      <div class="cyclistOverview">
        <section v-if="currentRace && currentStage" class="cyclistOverview-cards">
          <StageInfo :race="currentRace" :stage="currentStage" />
          <StageTimer
            v-if="currentStage.date"
            :key="compkey"
            :stage-date="String(currentStage.date)"
            :stage-id="currentStage.id"
          />
        </section>

        <div v-if="startlistStore.loading" class="cyclistSelector">
          <Loading text="Renners zoeken..." />
        </div>
        <section v-else class="cyclistSelector">
          <h2>Teams en renners</h2>

          <div class="alert alert-success">
            <Icon name="tabler:info-square-rounded" />
            <span>
              Ploegentijdritten zijn net wat anders dan andere races. Selecteer de kopman (nr 1) van het team. Ook kan je in plaats van 8 renners, nu 3 teams selecteren. Voor de uitslag zal alleen de top 5 teams en hun kopman in de uitslag komen te staan.
            </span>
          </div>
          <!-- TODO ADD FILTERS -->

          <div class="filter-group">
            <div class="toggle-switch">
              <label class="switch">
                <input type="checkbox" switch @click="startlistStore.showAllTeams = !startlistStore.showAllTeams">
                <div class="slider round" />
              </label>
              <p>{{ startlistStore.showAllTeams ? 'Verberg alle teams' : 'Toon alle teams' }}</p>
            </div>
          </div>

          <div v-if="!startlistStore.loading && startlistStore.startlistDataStatus === 'success' && !startlistStore.startlistData?.length" role="alert" class="alert alert-warning">
            <Icon name="tabler:alert-square-rounded" />
            <span>
              Er is nog geen startlijst voor deze race. Houd je mail in de gaten wanneer de startlijst defitief is, meestal is dit 24u voor het start van de race.
            </span>
          </div>
          <!-- Startlist -->
          <div else class="cyclistSelector--teams">
            <StartlistTeam
              v-for="{ team, cyclists } in startlistStore.startlistData"
              :key="team.id"
              :team="team"
              :cyclists
            />
          </div>
        <!-- Selected Riders -->
        </section>
        <StartlistSelectedRiders />
      </div>
    </div>
  </main>
  <!-- TO TOP COMPONENT -->
  <AppToTop />
</template>

<style lang="scss" scoped>
.cyclistOverview {
  display: grid;
  grid-template-columns: repeat(4, var(--rider-card-width));
  grid-template-rows: auto minmax(215px, auto) auto;
  grid-template-areas:
    "info info info info"
    "startlist startlist startlist select";
  gap: 2rem 1rem;
  justify-content: center;
  align-items: start;

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
  }

  .selected-riders {
    grid-area: select;
  }

  @media (min-width: 20em) and (max-width: 900px) {
    grid-template-columns: var(--rider-card-width-dynamic);
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

    .cyclistSelector {
      grid-area: startlist;

      &--teams {
        display: grid;
        gap: 1rem;
        grid-template-columns: var(--rider-card-width-dynamic);
      }
    }
  }

  @media (min-width: 900px) and (max-width: 1300px) {
    grid-template-columns: repeat(2, var(--rider-card-width));
    grid-template-areas:
      "info  info"
      "startlist  select";

    .cyclistSelector {
      grid-area: startlist;

      &--teams {
        display: grid;
        grid-template-columns: repeat(1, var(--rider-card-width));
      }
    }
  }
  @media (min-width: 1300px) and (max-width: 1720px) {
    grid-template-columns: repeat(3, var(--rider-card-width));
    grid-template-areas:
      "info info info"
      "startlist startlist select";

    .cyclistSelector {
      grid-area: startlist;

      &--teams {
        display: grid;
        grid-template-columns: repeat(2, var(--rider-card-width));
      }
    }
  }

  @media (min-width: 1720px) and (max-width: 90em) {
    grid-template-columns: repeat(3, var(--rider-card-width));
    grid-template-areas:
      "info info info"
      "startlist startlist select";

    .cyclistSelector {
      grid-area: startlist;

      &--teams {
        display: grid;
        grid-template-columns: repeat(2, var(--rider-card-width));
      }
    }
  }

  @media (min-width: 160em) {
    grid-template-columns: repeat(6, var(--rider-card-width));
    grid-template-areas:
      "info info info info info info"
      "startlist startlist startlist startlist startlist select";

    .cyclistSelector {
      grid-area: startlist;

      &--teams {
        display: grid;
        grid-template-columns: repeat(5, var(--rider-card-width));
      }
    }
  }
}

.cyclistSelector {
  grid-area: startlist;

  &--teams {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(3, var(--rider-card-width));
  }
}

.breadcrumbs {
  grid-column: 1 / -1;
  grid-area: breadcrumbs;
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
