<!-- eslint-disable unicorn/filename-case -->
<script lang="ts" setup>
import type { FetchError } from "ofetch";

import type { ResultCyclistByStage, ResultResponse, ResultUsersByStage } from "~/types/results";

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

const loading = ref(false);

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

const findUsersEntry = computed<ResultUsersByStage | null>(() => {
  if (usersResult.value) {
    const foundUser = usersResult.value.find(user => user.userId === authStore.user.id);
    if (!foundUser) {
      return null;
    }
    return foundUser;
  }
  return null;
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

    if (!currentStage.value?.id) {
      return;
    }

    try {
      errorMessage.value = "";
      loading.value = true;

      const { cyclist, users } = await $fetch<ResultResponse>(`${config.public.apiBase}/results/stage/${currentStage.value?.id}`, {
        method: "get",
        credentials: "include",
      });
      if (cyclist && users) {
        cyclistResult.value = cyclist;
        usersResult.value = users;
      }
    }

    catch (e) {
      const error = e as FetchError;
      errorMessage.value = getFetchErrorMessage(error);
    }
    finally {
      loading.value = false;
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
  <main class="wrapper wrapper-sm">
    <Loading v-if="sideBarStore.loading || loading" />

    <div v-if="!sideBarStore.loading && !currentRace" role="alert" class="alert alert-error">
      <Icon name="tabler:alert-square-rounded" />
      <span>
        Er is geen race data gevonden!
      </span>
    </div>
    <div v-if="errorMessage" role="alert" class="alert alert-error">
      <Icon name="tabler:alert-square-rounded" />
      <span>
        {{ errorMessage }}
      </span>
    </div>

    <section v-else-if="currentRace && currentStage">
      <AppNavigation :current-route="`Uitslag etappe ${currentStage.stageNr}`" />
      <StageInfo :race="currentRace" :stage="currentStage" />

      <!-- USER RESULT -->
      <NuxtLink
        v-if="currentRace"
        :to="{
          name: 'dashboard-race-id-klassement',
          params: {
            race: slugify(currentRace.name),
            id: currentRace.id,
          },
        }"
        class="btn btn-secondary"
      >
        Ga naar klassement
        <Icon name="tabler:arrow-right" />
      </NuxtLink>
      <ul class="table result-table">
        <li class="table-row table-header">
          <div>Plaats</div>
          <div>Naam </div>
          <div>Punten</div>
          <div />
        </li>
        <!-- TODO BOLD IF USER IS CURRENTUSER -->
        <ResultRow
          v-for="(user, index) in usersResult"
          :key="index"
          :user
          :position="index + 1"
        />
      </ul>
      <!-- USER SELECTION WITH RESULT -->
      <div class="cyclist-result">
        <section v-if="findUsersEntry">
          <h3>Geslecteerder renners</h3>
          <CyclistCardMedium
            v-for="{ cyclist } in findUsersEntry.entries"
            :key="cyclist.id"
            :cyclist
            :show-specialies="false"
            show-team-data
            no-user-select
            rider-selected="false"
          >
            <template #actionSlot>
              <div v-if="cyclist.results[0]" class="points">
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
.cyclist-result {
  display: grid;
  grid-template-columns: repeat(2, var(--rider-card-width));
  gap: 2rem;
  justify-content: space-between;
}

@media screen and (max-width: 90em) {
  .cyclist-result {
    grid-template-columns: auto;
  }
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
