<script lang="ts" setup>
import type { FetchError } from "ofetch";

import type { ResultResponse, ResultUsersByStage } from "~/types/results";
import type { UserPouleWithResults } from "~/types/teams";

import getParamId from "~/utils/param-extractor";

const route = useRoute();

const config = useRuntimeConfig();

const authStore = useAuthStore();
const sideBarStore = useSideBarStore();

const errorMessage = ref<string>();
const loading = ref(false);
const loadStagedata = ref(false);
const ploegData = ref<UserPouleWithResults>();
const resultIsGC = ref(false);

const currentUserResults = computed(() => {
  return ploegData.value?.resultByUser.find(user => user.userId === authStore.user.id);
});

const latestPouleResult = computed(() => {
  if (!ploegData.value?.resultByUser) {
    return [];
  }

  return ploegData.value.resultByUser.map((user) => {
    const lastStage = user.stages[user.stages.length - 1];

    return {
      userName: user.name,
      userId: user.userId,
      stage: lastStage,
    };
  }).sort((a, b) => (b.stage?.points || 0) - (a.stage?.points || 0)); ;
});

const pouleGCStandings = computed(() => {
  if (!ploegData.value?.resultByUser) {
    return [];
  }

  return ploegData.value.resultByUser.map((user) => {
    return {
      name: user.name,
      userId: user.userId,
      points: user.totalPoints,
    };
  }).sort((a, b) => (b.points || 0) - (a.points || 0));
});

const pouleStageStandings = ref<ResultUsersByStage[]>([]);
const selectedStage = ref<number>();
const comparedUser = ref<string>();

const totalTeamScore = computed(() => {
  if (!ploegData.value?.resultByUser) {
    return 0;
  }

  return ploegData.value.resultByUser.reduce((acc, user) => {
    return acc + (user.totalPoints || 0);
  }, 0);
});

const currentTotalScore = computed(() => {
  // 1. Check if we even have the base data
  if (!ploegData.value?.resultByUser) {
    return 0;
  }

  // 2. Determine which source to use based on your toggle (resultIsGC)
  const source = resultIsGC.value ? pouleGCStandings.value : pouleStageStandings.value;

  // 3. If the source exists, reduce it; otherwise, return a fallback 0
  if (source) {
    return source.reduce((acc, user) => acc + (+user.points || 0), 0);
  }

  return 0; // The final "safety" return to satisfy ESLint
});

const userLatestStageStats = computed(() => {
  const stages = currentUserResults.value?.stages;
  if (!stages || stages.length === 0) {
    return null;
  }

  const lastStage = stages[stages.length - 1];

  if (!lastStage) {
    return null;
  }

  // Find rank of current user in the latest stage within the poule
  const stageRank = latestPouleResult.value.findIndex(result => result.userId === authStore.user.id) + 1;

  return {
    stageNr: lastStage.stageNr,
    points: lastStage.points,
    rank: stageRank,
  };
});

const userOverallStats = computed(() => {
  if (!ploegData.value?.resultByUser) {
    return null;
  }

  const rank = ploegData.value.resultByUser.findIndex(user => user.userId === authStore.user.id) + 1;

  return {
    rank,
    points: currentUserResults.value?.totalPoints || 0,
  };
});

const userBestStageStats = computed(() => {
  const stages = currentUserResults.value?.stages;
  if (!stages || stages.length === 0 || !ploegData.value?.resultByUser)
    return null;

  // 1. Find the user's best stage object (highest points)
  const bestStage = stages.reduce((prev, current) => (prev.points > current.points) ? prev : current);

  // 2. Find how other users performed in that specific stage number
  const allPerformancesInThatStage = ploegData.value.resultByUser.map((user) => {
    const stageInfo = user.stages.find(s => s.stageNr === bestStage.stageNr);
    return {
      userId: user.userId,
      points: stageInfo?.points || 0,
    };
  });

  // 3. Sort those performances to determine the rank
  allPerformancesInThatStage.sort((a, b) => b.points - a.points);

  // 4. Find the current user's index in that sorted list
  const rank = allPerformancesInThatStage.findIndex(p => p.userId === authStore.user.id) + 1;

  return {
    points: bestStage.points,
    stageNr: bestStage.stageNr,
    rank,
  };
});

const displayedStandings = computed(() => {
  const data = resultIsGC.value ? pouleGCStandings.value : pouleStageStandings.value;

  if (!data)
    return [];

  // Normalize the data so the template always finds 'name'
  return data.map(user => ({
    userId: user.userId,
    name: user.name, // Fallback if property names differ
    points: user.points,
  }));
});

async function loadResultData(stageId: number) {
  try {
    errorMessage.value = "";
    pouleStageStandings.value = [];
    loadStagedata.value = true;
    selectedStage.value = stageId;

    const { users } = await $fetch<ResultResponse>(`${config.public.apiBase}/results/stage/${stageId}`, {
      method: "get",
      query: { pouleId: getParamId(route.params.id) },
      credentials: "include",
    });
    if (users) {
      pouleStageStandings.value = users;
    }
  }

  catch (e) {
    const error = e as FetchError;
    errorMessage.value = getFetchErrorMessage(error);
  }
  finally {
    loadStagedata.value = false;
  }
}

async function getTeamData() {
  loading.value = true;
  loadStagedata.value = true;

  errorMessage.value = "";
  if (!route.params.id) {
    return errorMessage.value = "Er is iets mis gegaan";
  }

  const ploegId = getParamId(route.params.id);
  if (!ploegId) {
    return errorMessage.value = "Er is geen juiste ploeg geselecteerd";
  }

  try {
    const queryParams = sideBarStore.isClassicSeason
      ? { seasonTimeId: sideBarStore.classicsRaces?.seasonTimeId }
      : { raceId: sideBarStore.currentRace?.id };

    const response = await $fetch<UserPouleWithResults>(`${config.public.apiBase}/poules/${ploegId}`, {
      method: "get",
      params: queryParams,
      credentials: "include",
    });
    if (response) {
      ploegData.value = response;
    }
  }
  catch (e) {
    const error = e as FetchError;
    errorMessage.value = getFetchErrorMessage(error);
  }
  finally {
    loading.value = false;
    loadStagedata.value = false;
  }
}

watch(
  () => [
    sideBarStore.currentRace?.id,
    sideBarStore.classicsRaces?.seasonTimeId,
    sideBarStore.isClassicSeason,
  ],
  async (newVal) => {
    // Only fetch if the values actually exist
    if (newVal) {
      await getTeamData();
    }
  },
  { immediate: true },
);
</script>

<template>
  <main>
    <Loading v-if="loading && !ploegData" />
    <div v-else class="wrapper-lg wrapper-nobg">
      <div v-if="errorMessage" role="alert" class="alert alert-warning">
        <Icon name="tabler:alert-square-rounded" />
        <span>
          {{ errorMessage }}
        </span>
      </div>

      <div v-if="ploegData && currentUserResults" class="team-container">
        <div class="team-heading">
          <div class="team-heading--info">
            <div class="team-heading--info__title">
              <h2>
                Ploeg {{ ploegData.name }}
              </h2>

              <div v-if="ploegData.adminUserId === currentUserResults?.userId" class="badge">
                <Icon name="tabler:shield" />
                Admin
              </div>
            </div>
            <p>{{ ploegData.users.length > 1 ? `${ploegData.users.length} deelnemers` : `${ploegData.users.length} deelnemer` }} {{ }}</p>
          </div>
          <div class="team-heading--invite">
            <span>Uitnodigingslink</span>
            <button class="btn btn-alert">
              <Icon name="tabler:link" />
              Kopier link
            </button>
          </div>
        </div>

        <!-- TODO ADD TO COMPONENT -->
        <div class="team-user-info">
          <div class="icon-header">
            <Icon name="tabler:user" />
            <h3>Jouw positie</h3>
          </div>
          <p>Je huidige stand binnen {{ ploegData.name }}</p>

          <div class="profile-list">
            <div class="profile-list--item">
              <span>Laatste etappe uitslag (#{{ userLatestStageStats?.stageNr }})</span>
              <h4 class="rank-highlight">
                #{{ userLatestStageStats?.rank }}
              </h4>
              <p>{{ userLatestStageStats?.points }}  pnt</p>
            </div>
            <div class="profile-list--item">
              <span>Huidige plek</span>
              <h4 class="rank-highlight">
                #{{ userOverallStats?.rank }}
              </h4>
              <p>{{ userOverallStats?.points }} pnt</p>
            </div>
            <div class="profile-list--item">
              <span>Beste etappe uitslag</span>
              <h4 class="rank-highlight">
                #{{ userBestStageStats?.rank }}
              </h4>
              <p>Etappe {{ userBestStageStats?.stageNr }} ({{ userBestStageStats?.points }} pnt)</p>
            </div>
            <div class="profile-list--item">
              <span>Totaal punten ploeg</span>
              <h4 class="rank-highlight">
                {{ totalTeamScore }} pnt
              </h4>
            </div>
          </div>
        </div>

        <div class="team-card team-standings">
          <div class="team-standings--header">
            <div class="icon-header">
              <Icon name="tabler:trophy" />
              <h3>Ploeg klassement</h3>
            </div>

            <div class="btn-group-switch">
              <button class="btn" :class="{ active: resultIsGC }" @click="resultIsGC = true, comparedUser = undefined">
                Algemeen
              </button>
              <button class="btn" :class="{ active: !resultIsGC }" @click="resultIsGC = false, comparedUser = undefined">
                Etappe
              </button>
            </div>
          </div>

          <div v-if="!resultIsGC">
            <AppStageSelector
              v-if="sideBarStore.isClassicSeason"
              :classics="sideBarStore.classicsRaces"
              @update:stage-id="loadResultData"
            />
            <AppStageSelector
              v-else
              :stages="sideBarStore.allStages"
              @update:stage-id="loadResultData"
            />
          </div>
          <p>Ploeg score: {{ currentTotalScore }} pnt</p>

          <Loading v-if="loadStagedata" />
          <div v-else class="standings-list">
            <div
              v-for="(user, index) in displayedStandings"
              :key="user.userId"
              class="standings-user"
              :class="{ 'current-user': user.userId === authStore.user.id, 'selected-user': comparedUser === user.userId, 'hover': !resultIsGC }"
              @click="!resultIsGC ? comparedUser = user.userId : null"
            >
              <div class="standings-user--info">
                <div class="standings-user--info__position">
                  <span>{{ index + 1 }}</span>
                </div>
                {{ user.name }}
              </div>
              <div>{{ user.points }} ptn</div>
              <Icon v-if="!resultIsGC" name="tabler:chevron-right" class="standings-user--action" />
            </div>
          </div>
        </div>

        <SelectionCompare
          v-if="!resultIsGC"
          :user-selection="pouleStageStandings.find(user => user.userId === authStore.user.id)"
          :compare-user-selection="pouleStageStandings.find(user => user.userId === comparedUser)"
          :stage-id="selectedStage"
          @close="comparedUser = undefined"
        />

        <div v-if="ploegData.adminUserId === currentUserResults.userId" class="team-card team-users">
          <div class="icon-header">
            <Icon name="tabler:users" />
            <h3>Ploeg beheer</h3>
          </div>

          <div>
            <h4>Deelnemers</h4>
            <ul class="table users-table">
              <li class="table-row table-header">
                <div>Naam</div>
                <div>Lid sinds</div>
                <div>Acties</div>
              </li>
              <li v-for="{ user } in ploegData.users" :key="user.id" class="table-row">
                <div>
                  {{ user.name }}
                </div>
                <div>
                  {{ new Date(user.createdAt).toLocaleDateString("nl-NL", {
                    day: '2-digit',
                    month: 'short',
                  }) }}
                </div>
                <div><Icon name="tabler:trash" style="color: var(--clr-error)" /></div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss">
.team-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 1rem;
}
.team-heading {
  grid-column: -1/1;
  display: flex;
  justify-content: space-between;
  margin-block: 2rem;

  &--info__title {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &--invite {
    background: var(--clr-primary-mute);
    border: 1px solid var(--clr-primary);
    border-radius: var(--border-radius);
    display: grid;
    gap: 0.5rem;
    padding: 1rem;
    font-size: var(--fs-300);
  }
}

.team-user-info {
  grid-column: -1/1;
  background: var(--clr-primary-mute);
  border: 1px solid var(--clr-primary);
  border-radius: var(--border-radius);
  padding: 2rem;
}

.team-standings {
  &--header {
    display: flex;
    justify-content: space-between;
  }
}

.team-users {
  grid-column: -1/1;
}

.users-result-list {
  display: grid;
  gap: 1rem;
}
</style>
