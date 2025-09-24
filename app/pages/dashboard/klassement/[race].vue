<script setup lang="ts">
import type { FetchError } from "ofetch";

import type { Stage } from "~/types/race";
import type { RaceTotalPoints, TotalPointsUser } from "~/types/results";

const config = useRuntimeConfig();
const sideBarStore = useSideBarStore();
const authUser = useAuthStore().user;
const route = useRoute();
const router = useRouter();

const loading = ref(false);
const errorMessage = ref("");
const raceResult = ref<RaceTotalPoints[]>([]);

const selectedStage = ref<number | null>(null);

const currentRace = computed(() => {
  return sideBarStore.currentRace;
});

type ResultPerStage = {
  stage: Stage;
  results: (TotalPointsUser & { winner: boolean })[];
};

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
  if (!sideBarStore.upcomingRace) {
    await sideBarStore.refreshUpcomingRace();
  }

  if (currentRace.value || sideBarStore.isClassicSeason) {
    try {
      loading.value = true;

      const searchQuery = sideBarStore.isClassicSeason ? `0?seasonTimeId=${sideBarStore.classicsRaces?.seasonTimeId}` : `${currentRace.value?.id}`;
      const response = await $fetch<RaceTotalPoints[]>(`${config.public.apiBase}/results/race/${searchQuery}`, {
        method: "get",
        credentials: "include",
      });

      if (response) {
        raceResult.value = response;
        combineResultsAndStages(response);

        selectStageFromQuery();
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

function selectStageFromQuery() {
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
    <div class="wrapper wrapper-sm">
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

      <template v-else-if="(currentRace || sideBarStore.isClassicSeason) && !loading">
        <AppNavigation current-route="Klassement" />
        <StageInfo v-if="!sideBarStore.isClassicSeason && currentRace" :race="currentRace" />
        <RaceInfo v-if="sideBarStore.isClassicSeason && sideBarStore.classicsRaces" :race="sideBarStore.classicsRaces" />

        <section>
          <h3>Algemeen klassement</h3>
          <ul v-if="raceResult.length" class="table standings-table">
            <li class="table-row table-header">
              <div>#</div>
              <div>Naam</div>
              <div>Punten</div>
              <div />
            </li>
            <li
              v-for="(user, index) in raceResult"
              :key="user.userId"
              class="table-row"
              :class="{ 'is-user': authUser?.id === user.userId }"
            >
              <div>{{ index + 1 }}</div>
              <div>{{ user.name }}</div>
              <div>{{ user.totalPoints }}</div>
              <div class="standings-action">
                <AppTrophy v-if="user.totalWins" :victory-count="user.totalWins" />
              </div>
            </li>
          </ul>
        </section>

        <section v-if="resultPerStage">
          <h3><span v-if="sideBarStore.isClassicSeason">Klassieker</span><span v-else>Etappe</span> klassement</h3>
          <div class="input-group">
            <label>Selecteer <span v-if="sideBarStore.isClassicSeason">klassieker</span><span v-else>etappe</span>:</label>
            <select v-model="selectedStage">
              <option value="null" disabled selected>
                Selecteer <span v-if="sideBarStore.isClassicSeason">klassieker</span><span v-else>etappe</span>
              </option>
              <option
                v-for="{ stage } in resultPerStage"
                :key="stage.id"
                :value="stage.stageNr"
              >
                <template v-if="sideBarStore.isClassicSeason">
                  {{ getRaceName(stage.raceId) }}
                </template>
                <template v-else>
                  {{ stage.stageNr }}. {{ stage.startCity }} - {{ stage.finishCity }}
                </template>
              </option>
            </select>
          </div>
          <div v-if="selectedStage && selectedStageResult && selectedStageResult.results.length">
            <NuxtLink
              v-if="currentRace"
              :to="{
                name: 'dashboard-race-id-uitslagen-nr',
                params: {
                  race: slugify(currentRace.name),
                  id: currentRace.id,
                  nr: selectedStage,
                },
              }"
              class="btn btn-secondary"
            >
              Ga naar etappe uitslag
              <Icon name="tabler:arrow-right" />
            </NuxtLink>
            <ul class="table standings-table">
              <li class="table-row table-header">
                <div>#</div>
                <div>Naam</div>
                <div>Punten</div>
                <div />
              </li>
              <li
                v-for="(user, index) in selectedStageResult.results"
                :key="user.userId"
                class="table-row"
                :class="{ 'is-user': authUser?.id === user.userId }"
              >
                <div>{{ index + 1 }}</div>
                <div>{{ user.name }}</div>
                <div>{{ user.points }}</div>
                <div class="standings-action">
                  <AppTrophy v-if="user.winner" />
                </div>
              </li>
            </ul>
          </div>
          <p v-else-if="selectedStage && selectedStageResult && !stageUnderway(selectedStageResult.stage.date)">
            Je kan nog je renners voor deze etappe invullen. <NuxtLink
              :to="{
                name: 'dashboard-race-id-selecteer-nr',
                params: {
                  race: slugify(getRaceName(selectedStageResult.stage.raceId)),
                  id: currentRace?.id ? currentRace.id : 0,
                  nr: selectedStageResult.stage.stageNr,
                },
              }"
            >
              Selecteer renners.
            </NuxtLink>
          </p>
          <p v-else-if="selectedStage">
            De uitslag van deze etappe is nog niet bekend. Kom later terug.
          </p>
        </section>

        <p v-if="!raceResult.length && !resultPerStage.length">
          Er is nog geen uitslag bekend. Kom later terug.
        </p>
      </template>
    </div>
  </main>
</template>

<style lang="scss">
.standings-action {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}
</style>
