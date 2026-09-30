<script setup lang="ts">
import type { FetchError } from "ofetch";

import type { Stage } from "~/types/race";
import type { RaceTotalPoints, ResultPerStage } from "~/types/results";

const sideBarStore = useSideBarStore();
const raceStore = useRaceStore();
const authUser = useAuthStore().user;

const loading = ref(false);
const errorMessage = ref("");
const { raceResult } = storeToRefs(raceStore);

const currentRace = computed(() => {
  return sideBarStore.currentRace;
});

const leaders = computed(() =>
  (raceResult.value ?? []).filter(user => user.absolutePosition === 1),
);

const resultPerStage = ref<ResultPerStage[]>([]);

function combineResultsAndStages(
  result: RaceTotalPoints[],
): ResultPerStage[] | undefined {
  if (
    !sideBarStore.isClassicSeason
    && (!currentRace.value || !currentRace.value.stages)
  ) {
    return [];
  }
  else if (sideBarStore.isClassicSeason && !sideBarStore.allStages) {
    return [];
  }

  const combinedResults: ResultPerStage[] = [];

  const allStages: Stage[] | undefined = sideBarStore.isClassicSeason
    ? sideBarStore.allStages
    : currentRace.value!.stages;

  if (allStages) {
    for (const stage of allStages) {
      combinedResults.push({
        stage,
        results: [],
      });
    }
    for (const user of result) {
      for (const userStageResult of user.stages) {
        const foundStage = combinedResults.find(
          combined => combined.stage.stageNr === userStageResult.stageNr,
        );

        if (foundStage) {
          foundStage.results.push({
            ...userStageResult,
          });
        }
      }
    }

    for (const stageResult of combinedResults) {
      if (stageResult.results.length > 0) {
        stageResult.results.sort((a, b) => b.points - a.points);
      }
    }

    return (resultPerStage.value = combinedResults);
  }
}

async function getRaceData() {
  if (!raceStore.raceResult) {
    await raceStore.refreshRaceResult();
  }
  try {
    loading.value = true;
    if (!raceStore.raceResult) {
      return;
    }
    combineResultsAndStages(raceStore.raceResult);
  }
  catch (e) {
    const error = e as FetchError;
    errorMessage.value = getFetchErrorMessage(error);
  }
  finally {
    loading.value = false;
  }
}

const pageSize = 10;
const { page, totalPages, pagedItems, userPage, showPagination, goToUser }
  = usePagination(() => raceResult.value ?? [], pageSize);

onMounted(() => {
  getRaceData();
});

// watch(selectedStage, (newValue) => {
//   const foundStage = resultPerStage.value.find(
//     stage => stage.stage.stageNr === newValue,
//   );
//   if (foundStage) {
//     selectedStageResult.value = foundStage;
//     const raceName = getRaceName(foundStage.stage.raceId);
//     // Update the query parameter without causing a full page reload
//     router.push({ query: { race: slugify(raceName) } });
//   }
// });
</script>

<template>
  <main>
    <div class="wrapper-lg wrapper-nobg">
      <Loading v-if="sideBarStore.loading || loading" />
      <div
        v-if="
          !sideBarStore.loading && !currentRace && !sideBarStore.isClassicSeason
        "
        role="alert"
        class="alert alert-error"
      >
        <Icon name="tabler:alert-square-rounded" />
        <span> Er is geen race data gevonden! </span>
      </div>
      <div v-if="errorMessage" role="alert" class="alert alert-error">
        <Icon name="tabler:alert-square-rounded" />
        <span>
          {{ errorMessage }}
        </span>
      </div>

      <template
        v-else-if="
          (currentRace || sideBarStore.isClassicSeason)
            && !loading
            && raceResult
        "
      >
        <section>
          <h2>Algemeen klassement</h2>
          <p>
            Stand na {{ raceResult[0]?.stages.length }}
            {{ sideBarStore.isClassicSeason ? "klassiekers" : "etappes" }}
          </p>

          <ul v-if="raceResult.length" class="standings-list">
            <template v-if="page > 1">
              <li
                v-for="user in leaders"
                :key="user.userId"
                class="standings-user winner"
                :class="{ 'current-user': authUser?.id === user.userId }"
              >
                <div class="standings-user--info__position">
                  <span>{{ user.absolutePosition }}</span>
                </div>
                <div class="standings-user--info">
                  {{ user.name }}
                </div>
                <div>{{ user.totalPoints }} ptn</div>
              </li>
              <AppDivider />
            </template>
            <li
              v-for="user in pagedItems"
              :key="user.userId"
              class="standings-user"
              :class="[
                { 'current-user': authUser?.id === user.userId },
                placedUser(user.absolutePosition),
              ]"
            >
              <div class="standings-user--info__position">
                <span>{{ user.absolutePosition }}</span>
              </div>
              <div class="standings-user--info">
                {{ user.name }}
              </div>
              <div>{{ user.totalPoints }} ptn</div>
            </li>
          </ul>

          <div v-if="showPagination" class="pagination">
            <div class="pagination-controls">
              <button class="btn" :disabled="page === 1" @click="page--">
                <Icon name="tabler:chevron-left" />
              </button>
              <span>Pagina {{ page }} van {{ totalPages }}</span>
              <button class="btn" :disabled="page === totalPages" @click="page++">
                <Icon name="tabler:chevron-right" />
              </button>
            </div>
            <button v-if="userPage && userPage !== page" class="btn" @click="goToUser">
              Mijn positie
            </button>
          </div>
        </section>
        <p v-if="!raceResult.length && !resultPerStage.length">
          Er is nog geen uitslag bekend. Kom later terug.
        </p>
      </template>
    </div>
  </main>
</template>

<style>
.standings-action {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}
</style>
