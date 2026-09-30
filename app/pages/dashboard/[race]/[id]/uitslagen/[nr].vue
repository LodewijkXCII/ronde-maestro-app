<!-- eslint-disable unicorn/filename-case -->
<script lang="ts" setup>
import type { FetchError } from "ofetch";

import type {
  ResultCyclistByStage,
  ResultResponse,
  ResultUsersByStage,
} from "~/types/results";

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
const notRiddenRef = ref(false);

// const resultLimit = 100

const loading = ref(false);

const leaders = computed(() =>
  (usersResult.value ?? []).filter(user => user.absolutePosition === 1),
);

// Prevent late async results from overwriting shared store state after navigating away
let active = true;
onBeforeUnmount(() => {
  active = false;
});

// const visibleRows = computed(() =>
//   getResultWithUser(usersResult.value, authStore.user.id, resultLimit)
// );
//

const userStandingData = computed(() => {
  if (usersResult.value) {
    const foundUser = usersResult.value.find(
      user => user.userId === authStore.user.id,
    );
    if (!foundUser) {
      return {
        points: 0,
        position: 0,
        winnerDiff: 0,
      };
    }
    return {
      points: foundUser.points,
      position: foundUser.absolutePosition,
      winnerDiff:
        (usersResult.value.find(user => user.absolutePosition === 1)
          ?.points || 0) - foundUser.points,
    };
  }
  return {
    points: 0,
    position: 0,
    winnerDiff: 0,
  };
});

async function setRaceAndStageData(newRace: typeof sideBarStore.currentRace) {
  errorMessage.value = "";
  loading.value = true;

  const raceId = getParamId(route.params.id);
  const stageNr = getParamId(route.params.nr);

  if (!route.params.id || !raceId || !stageNr || !newRace || !newRace.stages) {
    loading.value = false;
    return (errorMessage.value = "Er is geen juiste data gevonden");
  }

  startlistStore.activeRaceIdForFetch = raceId;
  await startlistStore.refreshStartlistData();

  if (!active) {
    return;
  }

  const foundStage
    = newRace.stages.find(stage => stage.stageNr === stageNr) || null;

  sideBarStore.currentStage = foundStage;

  if (!foundStage || !foundStage.id) {
    console.warn("No valid stage found for results fetch.");
    loading.value = false;
    return (errorMessage.value = "Geen etappe gevonden met deze gegevens.");
  }

  try {
    const { cyclist, users, notRidden } = await $fetch<ResultResponse>(
      `${config.public.apiBase}/results/stage/${currentStage.value?.id}`,
      {
        method: "get",
        credentials: "include",
      },
    );
    if (!active) {
      return;
    }

    if (notRidden) {
      notRiddenRef.value = true;
      return;
    }

    if (cyclist && users) {
      cyclistResult.value = cyclist.sort((a, b) => a.position - b.position);
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

const { page, totalPages, pagedItems, userPage, showPagination, goToUser }
  = usePagination(usersResult, 10);

watch(
  () => [route.params.id, route.params.nr, sideBarStore.currentRace?.id],
  async () => {
    if (
      !sideBarStore.upcomingRace
      && sideBarStore.upcomingRaceStatus !== "pending"
    ) {
      await sideBarStore.refreshUpcomingRace();
    }
    if (!active) {
      return;
    }
    setRaceAndStageData(sideBarStore.currentRace);
  },
  { immediate: true },
);
</script>

<template>
  <main>
    <div class="wrapper-lg wrapper-nobg">
      <Loading v-if="sideBarStore.loading || loading" />

      <div
        v-if="!sideBarStore.loading && !loading && !currentRace"
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

      <div
        v-else-if="
          !currentRace && !currentStage && !sideBarStore.loading && !loading
        "
        role="alert"
        class="alert alert-error"
      >
        <Icon name="tabler:alert-square-rounded" />
        <span> Er is geen juiste data gevonden. Probeer het opnieuw. </span>
      </div>

      <section v-else-if="currentRace && currentStage">
        <h2>Uitslag</h2>

        <div class="result-header">
          <div>
            <div class="stage-info">
              <h3>{{ currentRace.name }}</h3>
              <div v-if="currentStage" class="stage-section--stage__info">
                <p>
                  <span v-if="!sideBarStore.isClassicSeason">{{ currentStage.stageNr }}: </span>{{
                    new Date(currentStage.date).toLocaleDateString("nl-NL", {
                      day: "2-digit",
                      month: "short",
                    })
                  }}. - {{ currentStage.startCity }} -
                  {{ currentStage.finishCity }}
                </p>
              </div>
              <div v-if="currentStage" class="stage-section--stage__type badge">
                <img
                  :src="`${config.public.s3BucketURL}/${currentStage.stageType.image}`"
                  :alt="currentStage.stageType.name"
                  class="stage-type-image"
                ><span>{{ currentStage.stageType.name }}</span>
              </div>
              <p v-else>
                {{
                  new Date(currentRace.startDate).toLocaleDateString("nl-NL", {
                    day: "2-digit",
                    month: "short",
                  })
                }}
                -
                {{
                  new Date(currentRace.finishDate).toLocaleDateString("nl-NL", {
                    day: "2-digit",
                    month: "short",
                  })
                }}
              </p>
            </div>

            <!-- TODO Selecter won't fetch new racedata -->
            <!-- <AppStageSelector
              v-if="sideBarStore.isClassicSeason"
              v-model:stage-id="raceStore.searchStageId"
              :classics="sideBarStore.classicsRaces"
            />
            <AppStageSelector
              v-else
              v-model:stage-id="raceStore.searchStageId"
              :stages="sideBarStore.allStages"
            /> -->
          </div>
          <div v-if="notRiddenRef" class="profile-list">
            <div
              role="alert"
              class="alert alert-warning"
            >
              <Icon name="tabler:alert-square-rounded" />
              <span>Deze etappe heeft geen uitslag, maar is wel verreden. Dit kan verschillende oorzaken hebben. Er zijn geen punten gescoordt deze etappe.</span>
            </div>
          </div>
          <div v-else class="profile-list">
            <div class="profile-list--item">
              <span>Jouw positie</span>
              <h4 class="rank-highlight">
                # {{ userStandingData.position }}
              </h4>
            </div>
            <div class="profile-list--item">
              <span>Jouw punten</span>
              <h4 class="rank-highlight">
                {{ userStandingData.points }} pnt
              </h4>
            </div>
            <div class="profile-list--item">
              <span>Winnaar</span>
              <h4 class="rank-highlight">
                {{
                  usersResult.find((user) => user.absolutePosition === 1)?.name
                }}
                <span
                  v-if="userStandingData.winnerDiff > 0"
                  class="points-difference"
                >
                  + {{ userStandingData.winnerDiff }} pnt
                </span>
              </h4>
            </div>
          </div>
        </div>

        <div v-if="!notRiddenRef" class="result-body">
          <div>
            <h3>Etappe klassement</h3>

            <div class="standings-list">
              <template v-if="page > 1">
                <li
                  v-for="user in leaders"
                  :key="user.userId"
                  class="standings-user winner"
                  :class="{ 'current-user': authStore.user?.id === user.userId }"
                >
                  <details :open="authStore.user?.id === user.userId">
                    <summary>
                      <div class="standings-user--info__position">
                        <span>{{ user.absolutePosition }}</span>
                      </div>
                      <div class="standings-user--info">
                        {{ user.name }}
                      </div>
                      <div>{{ user.points }} ptn</div>
                      <Icon
                        name="tabler:chevron-right"
                        size="16"
                        class="nav-icon"
                      />
                    </summary>

                    <h4>Geselecteerde renners</h4>
                    <div class="cyclist-result-list">
                      <CyclistCardMedium
                        v-for="{ cyclist } in user.entries"
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
                    </div>
                  </details>
                </li>
                <AppDivider />
              </template>
              <div
                v-for="user in pagedItems"
                :key="user.userId"
                class="standings-user"
                :class="[{ 'current-user': authStore.user?.id === user.userId }, placedUser(user.absolutePosition)]"
              >
                <details :open="authStore.user?.id === user.userId">
                  <summary>
                    <div class="standings-user--info__position">
                      <span>{{ user.absolutePosition }}</span>
                    </div>
                    <div class="standings-user--info">
                      {{ user.name }}
                    </div>
                    <div>{{ user.points }} ptn</div>
                    <Icon
                      name="tabler:chevron-right"
                      size="16"
                      class="nav-icon"
                    />
                  </summary>

                  <h4>Geselecteerde renners</h4>
                  <div class="cyclist-result-list">
                    <CyclistCardMedium
                      v-for="{ cyclist } in user.entries"
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
                  </div>
                </details>
              </div>
            </div>

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
          </div>

          <!-- USER SELECTION WITH RESULT -->
          <div class="cyclist-result">
            <!-- CYCLIST RESULT -->
            <section v-if="cyclistResult">
              <h3>Etappe uitslag</h3>
              <div class="cyclist-result-list">
                <CyclistCardSmall
                  v-for="{ cyclist, position, points } in cyclistResult"
                  :key="cyclist.id"
                  :cyclist="cyclist"
                  :result="{ position, points }"
                />
              </div>
            </section>
          </div>
        </div>

        <NuxtLink
          v-if="currentRace"
          :to="{
            name: 'dashboard-klassement-race',
            params: {
              race: sideBarStore.isClassicSeason
                ? 'klassiekers'
                : slugify(currentRace.name),
            },
            query: { race: `${slugify(currentRace.name)}` },
          }"
          class="btn btn-secondary"
          style="float: right"
        >
          Bekijk algemeen klassement
          <Icon name="tabler:arrow-right" />
        </NuxtLink>
      </section>
    </div>
  </main>
</template>

<style>
.result-header {
  background: var(--clr-background);
  border-radius: var(--border-radius);
  padding-block: 2rem;
  padding-inline: 1rem;

  > div:first-child {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    margin-bottom: 2rem;
  }
}
.result-body {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(275px, 1fr));
  gap: 1rem;
  padding: 1rem;

  > :first-child {
    grid-column: span 2;
  }
}
.cyclist-result-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(var(--rider-card-width), 1fr));
  gap: 0.75rem 1rem;
  justify-content: space-between;
  margin-top: 0.75rem;

  /* @media (max-width: 90em) {
    grid-template-columns: auto;
  } */

  /* div {
    margin-top: 1rem;
    display: grid;
    gap: 0.5rem;
  } */
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
