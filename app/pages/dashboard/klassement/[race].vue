<script setup lang="ts">
import type { FetchError } from "ofetch";

import type { Stage } from "~/types/race";
import type { RaceTotalPoints, ResultPerStage } from "~/types/results";

const sideBarStore = useSideBarStore();
const raceStore = useRaceStore();
const authUser = useAuthStore().user;
const route = useRoute();
const router = useRouter();

const loading = ref(false);
const errorMessage = ref("");
const { raceResult } = storeToRefs(raceStore);

const selectedStage = ref<number | null>(null);

const currentRace = computed(() => {
  return sideBarStore.currentRace;
});

const resultPerStage = ref<ResultPerStage[]>([]);
const selectedStageResult = ref<ResultPerStage>();

function combineResultsAndStages(result: RaceTotalPoints[]): ResultPerStage[] | undefined {
  if (!sideBarStore.isClassicSeason && (!currentRace.value || !currentRace.value.stages)) {
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

    return resultPerStage.value = combinedResults;
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
    selectStageFromQuery();
  }
  catch (e) {
    const error = e as FetchError;
    errorMessage.value = getFetchErrorMessage(error);
  }
  finally {
    loading.value = false;
  }
}

function selectStageFromQuery() {
  console.log(route);
  const querySlug = route.query.race as string || route.query.stage as string;
  if (querySlug) {
    const foundStage = resultPerStage.value.find(
      stageResult => slugify(getRaceName(stageResult.stage.raceId)) === querySlug,
    );
    if (foundStage) {
      selectedStage.value = foundStage.stage.stageNr;
    }
  }
}

onMounted(() => {
  getRaceData();
});

watch(selectedStage, (newValue) => {
  const foundStage = resultPerStage.value.find(stage => stage.stage.stageNr === newValue);
  if (foundStage) {
    selectedStageResult.value = foundStage;
    const raceName = getRaceName(foundStage.stage.raceId);
    // Update the query parameter without causing a full page reload
    router.push({ query: { race: slugify(raceName) } });
  }
});
</script>

<template>
  <main>
    <div class="wrapper-lg wrapper-nobg">
      <Loading v-if="sideBarStore.loading || loading" />
      <div v-if="!sideBarStore.loading && (!currentRace && !sideBarStore.isClassicSeason)" role="alert" class="alert alert-error">
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

      <template v-else-if="(currentRace || sideBarStore.isClassicSeason) && !loading && raceResult">
        <section>
          <h2>Algemeen klassement</h2>
          <p>Stand na {{ raceResult[0]?.stages.length }} {{ sideBarStore.isClassicSeason ? 'klassiekers' : 'etappes' }}</p>

          <ul v-if="raceResult.length" class="standings-list">
            <li
              v-for="(user, index) in raceResult"
              :key="user.userId"
              class="standings-user"
              :class="{ 'is-user': authUser?.id === user.userId }"
            >
              <div class="standings-user--info__position">
                <span>{{ index + 1 }}</span>
              </div>
              <div class="standings-user--info">
                {{ user.name }}
              </div>
              <div>{{ user.totalPoints }} ptn</div>
            </li>
          </ul>
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
