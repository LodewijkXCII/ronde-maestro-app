<!-- eslint-disable unicorn/filename-case -->
<script lang="ts" setup>
import type { FetchError } from "ofetch";

import type { EntryWithResult, ResultCyclistByStage, ResultResponse, ResultUsersByStage } from "~/types/results";

import getParamId from "~/utils/param-extractor";

const route = useRoute();

const config = useRuntimeConfig();
const sideBarStore = useSideBarStore();
const startlistStore = useStartlistStore();
const authStore = useAuthStore();

const { currentRace } = storeToRefs(sideBarStore);
const { currentStage } = storeToRefs(sideBarStore);

const errorMessage = ref("");
const cyclistResult = ref<ResultCyclistByStage[]>([]);
const usersResult = ref<ResultUsersByStage[]>([]);
const usersEntry = ref<EntryWithResult[]>([]);
const totalUserScoredPoints = computed(() => {
  if (usersResult.value) {
    const foundUser = usersResult.value.find(user => user.userId === authStore.user.id);
    if (!foundUser) {
      return 0;
    }
    return foundUser.points;
  }
  return 0;
});

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
    // GET RESULT DATA

    try {
      errorMessage.value = "";

      const { cyclist, users, entry } = await $fetch<ResultResponse>(`${config.public.apiBase}/results/stage/${currentStage.value?.id}`, {
        method: "get",
        credentials: "include",
      });
      if (cyclist && users && entry) {
        cyclistResult.value = cyclist;
        usersResult.value = users;
        usersEntry.value = entry;
      }
    }

    catch (e) {
      const error = e as FetchError;

      errorMessage.value = getFetchErrorMessage(error);
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
  <main class="wrapper wrapper-small">
    <Loading v-if="sideBarStore.loading" />

    <div v-if="!sideBarStore.loading && !currentRace" role="alert" class="alert alert-error">
      <Icon name="tabler:alert-square-rounded" />
      <span>
        Er is geen race data gevonden!
      </span>
    </div>

    <section v-else-if="currentRace && currentStage">
      <article>
        <div class="stage-box stage-section">
          <div class="stage-box--title stage-section--race">
            <div>
              <h3>Uitslag {{ currentRace.name }}</h3>
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
      </article>

      <!-- USER RESULT -->
      <pre>{{ usersResult }}</pre>
      <!-- USER SELECTION WITH RESULT -->
      <div class="testClass">
        <section v-if="usersEntry">
          <h3>Geslecteerder renners</h3>
          <CyclistCardMedium
            v-for="{ cyclist } in usersEntry"
            :key="cyclist.id"
            :cyclist
            :show-specialies="false"
            show-team-data
            no-user-select
          >
            <template #actionSlot>
              <div class="points">
                <span>{{ cyclist.results[0]?.points }}</span> pnt
              </div>
            </template>
          </CyclistCardMedium>
          <span class="sum-line"><span class="plus">+</span></span>

          <div class="cyclist-info-box totalScore">
            <p>Totaal gescoorde punten: </p>
            <span class="points">{{ totalUserScoredPoints }} pnt</span>
          </div>
        </section>

        <!-- CYCLIST RESULT -->
        <section v-if="cyclistResult">
          <h3>Etappe uitslag</h3>
          <CyclistCardSmall
            v-for="{ cyclist, position, points } in cyclistResult"
            :key="cyclist.id"
            :cyclist="cyclist"
            :result="{ position, points }"
          />
        </section>
      </div>
    </section>
  </main>
</template>

<style lang="scss">
.testClass {
  display: grid;
  grid-template-columns: repeat(2, var(--rider-card-width));
  gap: 2rem;
  justify-content: space-between;
}

.cyclist-info-box {
  background: var(--clr-primary);
  color: var(--clr-primary-content);
  display: flex;
  justify-content: space-between;
  place-items: center;
  font-weight: 800;

  .points {
    margin-right: 0.5rem;
  }

  p {
    margin: 0;
  }
}
</style>
