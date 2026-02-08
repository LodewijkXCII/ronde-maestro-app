<!--
  TODO UPCOMPING RACE IS NU ALLE RACES IN BIJV KLASSIEKERS
  hierdoor zijn de gegevens niet juist bij Geselecteerde renners. Hier wordt nog gebruik gemaakt van eerst volgende race.
  Hierdoor kan het zijn dat geslecteerde renners wel van nieuwe rit zijn, maar info nog niet.
-->
<script lang="ts" setup>
import type { FetchError } from "ofetch";

import type { GetEntry } from "~/types/entries";
import type { ResultResponse } from "~/types/results";

const config = useRuntimeConfig();
const errorMessage = ref<string[]>([]);

const entriesLoading = ref(false);
const resultsLoading = ref(false);
const userEntries = ref<GetEntry[] | []>([]);
const resultIsGC = ref(false);

const sideBarStore = useSideBarStore();
const authStore = useAuthStore();
const raceStore = useRaceStore();
const { upComingStage, currentRace, upcomingRace, allStages, loading: storeLoading } = storeToRefs(sideBarStore);
const latestResult = ref<ResultResponse>();

const displayedStandings = computed(() => {
  // If GC: use the raceResult from store
  // If Etappe: use the resultData (which reacts to searchStageId) from store
  const data = resultIsGC.value
    ? raceStore.raceResult
    : raceStore.resultData?.users; // Changed from latestResult.value?.users

  if (!data)
    return [];

  return data.map((user) => {
    const pointsValue = "totalPoints" in user ? user.totalPoints : user.points;
    return {
      userId: user.userId,
      name: user.name,
      points: pointsValue,
    };
  });
});

async function getUpcomingStage() {
  if (!upComingStage.value) {
    return errorMessage.value.push("Er is geen aankomende etappe.");
  }

  try {
    errorMessage.value = [];
    entriesLoading.value = true; // Start loader

    const data = await $fetch<GetEntry[]>(`${config.public.apiBase}/entries/${upComingStage.value.id}`, {
      method: "get",
      credentials: "include",
    });

    userEntries.value = data as GetEntry[];
  }

  catch (e) {
    const error = e as FetchError;
    errorMessage.value = getFetchErrorMessage(error);
  }
  finally {
    entriesLoading.value = false; // Stop loader  }
  }
}

async function getLatestResult() {
  const lastDoneStage = allStages.value?.findLast(stage => stage.done);

  if (!lastDoneStage) {
    console.error("Geen voltooide etappe gevonden voor deze race.");
    return null;
  }

  try {
    resultsLoading.value = true; // Start loader
    console.error(`Fetching results for stage: ${lastDoneStage.id}`);
    const data = await $fetch<ResultResponse>(`${config.public.apiBase}/results/stage/${lastDoneStage.id}`, {
      method: "get",
      credentials: "include",
    });

    if (data) {
      if (data.cyclist) {
        data.cyclist = data.cyclist.slice(0, 5);
      }

      if (data.users) {
        data.users = data.users.sort((a, b) => b.points - a.points);
      }
    }

    latestResult.value = data as ResultResponse;
  }
  catch (e) {
    const error = e as FetchError;
    errorMessage.value = getFetchErrorMessage(error);
  }
  finally {
    resultsLoading.value = false; // Stop loader
  }
}

onMounted(async () => {
  // Ensure the store fetch is actually triggered if it hasn't been
  if (!upcomingRace.value || upcomingRace.value.length === 0) {
    await sideBarStore.refreshUpcomingRace();
  }

  if (!raceStore.raceResult) {
    await raceStore.refreshRaceResult();
  }
});

// Watch for the race data to arrive, then trigger local API calls
watch(currentRace, async (newRace) => {
  if (newRace) {
    await getUpcomingStage();
    await getLatestResult();
  }
}, { immediate: true });
</script>

<template>
  <main>
    <div class="wrapper-lg wrapper-nobg">
      <h1>Hoi {{ authStore.user?.name }}</h1>
      <p>Welkom terug! Hier vind je een overzicht van je ploegen en de laatste resultaten.</p>

      <!-- <div v-if="errorMessage || errorMessage.length > 0" role="alert" class="alert alert-warning">
        <Icon name="tabler:alert-square-rounded" />
        <span>
          {{ errorMessage }} <NuxtLink v-if="!currentRace" to="/kalender">Bekijk kalender</NuxtLink>
        </span>
      </div> -->

      <div
        v-if="currentRace"
        class="dashboard-cover"
      >
        <Loading v-if="storeLoading" />

        <template v-else-if="currentRace">
          <img

            class="dasboard-cover--image"
            :src="`${config.public.s3BucketURL}/${currentRace?.coverImage}`"
          >
          <div class="dashboard-cover--text">
            <div class="dashboard-cover--text__inner">
              <h2>De {{ sideBarStore.isClassicSeason ? 'klassiekers' : currentRace?.name }} bij RondeMaestro</h2>
              <div v-if="sideBarStore.isClassicSeason">
                <p>
                  {{ new Date(currentRace.startDate).toLocaleDateString("nl-NL", {
                    day: '2-digit',
                    month: 'short',
                  }) }} • {{ currentRace?.name }} • {{ currentRace?.stages[0]?.stageType.name }}
                </p>
                <button class="btn btn-primary" @click="goToStage(currentRace?.stages[0]?.id || null)">
                  {{ currentRace?.stages[0]?.done ? 'Bekijk de uitslag' : "Selecteer je renners" }}
                </button>
              </div>
              <div v-else-if="upComingStage">
                <span>Eerstvolgende etappe:</span>
                <p>Etappe {{ upComingStage.stageNr }} • {{ upComingStage.startCity }} - {{ upComingStage.finishCity }} • {{ upComingStage.stageType.name }}</p>
                <button class="btn btn-primary" @click="goToStage(upComingStage.id)">
                  {{ upComingStage.done ? 'Bekijk de uistlag' : "Selecteer je renners" }}
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>

      <DashboardTeams />

      <div class="dashboard-cards">
        <div v-if="upComingStage" class="dashboard-card dashboard-selected-riders">
          <div>
            <div class="icon-header">
              <Icon name="tabler:users" />
              <h3>Geselecteerde renners</h3>
            </div>
            <p v-if="!sideBarStore.isClassicSeason">
              Voor etappe {{ upComingStage?.stageNr }} van {{ new Date(upComingStage.date).toLocaleDateString("nl-NL", {
                day: '2-digit',
                month: 'short',
              }) }}
            </p>
            <p v-else>
              Voor {{ currentRace?.name }} van {{ new Date(upComingStage.date).toLocaleDateString("nl-NL", {
                day: '2-digit',
                month: 'short',
              }) }}
            </p>
          </div>
          <Loading v-if="raceStore.resultDataStatus === 'pending' || storeLoading" />
          <div v-if="userEntries.length > 0 && !entriesLoading" class="selected-riders">
            <CyclistCardMedium
              v-for="entry in userEntries"
              :key="entry.id"
              show-team-data
              no-user-select
              :cyclist="entry.cyclist"
            />

            <button v-if="!stageUnderway(upComingStage.date)" class="btn btn-primary btn-full-width" @click="goToStage(upComingStage.id)">
              Pas je team aan
              <Icon name="tabler:arrow-right" />
            </button>
          </div>
          <div v-if="!entriesLoading && !userEntries">
            <p>
              Geen renners geselecteerd voor deze etappe.
            </p>

            <button class="btn btn-primary btn-full-width" @click="goToStage(upComingStage.id)">
              Vul je team in
              <Icon name="tabler:arrow-right" />
            </button>
          </div>
        </div>

        <div v-if="latestResult" class="dashboard-card dashboard-latest-result">
          <div>
            <div class="icon-header">
              <Icon name="tabler:trophy" />
              <h3>Laatste uitslag</h3>
            </div>
            <p v-if="!sideBarStore.isClassicSeason">
              Voor de etappe van {{ new Date(latestResult.stage.date).toLocaleDateString("nl-NL", {
                day: '2-digit',
                month: 'short',
              }) }}
            </p>
            <p v-else>
              Voor {{ latestResult.stage.race.name }} van {{ new Date(latestResult.stage.date).toLocaleDateString("nl-NL", {
                day: '2-digit',
                month: 'short',
              }) }}
            </p>
          </div>
          <Loading v-if="raceStore.resultDataStatus === 'pending' || storeLoading" />
          <template v-if="!resultsLoading">
            <div class="stage-box">
              <div class="stage-box--heading">
                <p>{{ latestResult.stage.startCity }} - {{ latestResult.stage.finishCity }}</p>
                <img :src="`${config.public.s3BucketURL}/${latestResult.stage.stageType.image}`" :alt="latestResult.stage.stageType.name">
              </div>
              <img :src="`${config.public.s3BucketURL}/${latestResult.stage.image}`" :alt="latestResult.stage.race.name">
            </div>

            <div>
              <span>De top 5 van de etappe</span>
              <CyclistCardSmall
                v-for="entry in latestResult.cyclist"
                :key="entry.id"
                :cyclist="entry.cyclist"
                :result="{ position: entry.position, points: entry.points }"
              />
            </div>

            <div class="points-box ">
              Jouw score: <span>{{ latestResult.users.find(user => user.userId === authStore.user.id)?.points }} ptn</span>
            </div>

            <button class="btn btn-primary btn-full-width" @click="goToStage(latestResult.stage.id)">
              Bekijk volledige uitslag
              <Icon name="tabler:arrow-right" />
            </button>
          </template>
          <p v-if="!resultsLoading && !latestResult">
            Er is nog geen uitslag beschikbaar.
          </p>
        </div>

        <div v-else class="dashboard-card dashboard-latest-result">
          <div class="icon-header">
            <Icon name="tabler:trophy" />
            <h3>Laatste uitslag</h3>
          </div>

          <div v-if="upcomingRace">
            <p>Er is nog geen uitslag voor {{ upcomingRace[0]?.name }}</p>
          </div>
        </div>
        <div v-if="latestResult && upcomingRace" class="dashboard-card dashboard-standings">
          <div class="dashboard-stadings--heading">
            <div class="icon-header">
              <Icon name="tabler:list-numbers" />
              <h3>
                Klassement
              </h3>
            </div>

            <div class="btn-group-switch">
              <button class="btn" :class="{ active: resultIsGC }" @click="resultIsGC = true">
                Algemeen
              </button>
              <button class="btn" :class="{ active: !resultIsGC }" @click="resultIsGC = false">
                Etappe
              </button>
            </div>
          </div>

          <div v-if="!resultIsGC">
            <AppStageSelector
              v-if="sideBarStore.isClassicSeason"
              v-model:stage-id="raceStore.searchStageId"
              :classics="sideBarStore.classicsRaces"
            />
            <AppStageSelector
              v-else
              v-model:stage-id="raceStore.searchStageId"
              :stages="sideBarStore.allStages"
            />
          </div>
          <p v-if="!resultIsGC">
            Voor de etappe van {{ new Date(latestResult.stage.date).toLocaleDateString("nl-NL", {
              day: '2-digit',
              month: 'short',
            }) }}
          </p>
          <p v-else>
            Algemeen klassement
          </p>

          <Loading v-if="raceStore.resultDataStatus === 'pending' || storeLoading" />          <div v-else class="standings-list">
            <div
              v-for="(user, index) in displayedStandings"
              :key="user.userId"
              class="standings-user"
              :class="{ 'current-user': user.userId === authStore.user.id }"
            >
              <div class="standings-user--info">
                <div class="standings-user--info__position">
                  <span>{{ index + 1 }}</span>
                </div>
                {{ user.name }}
              </div>
              <div>{{ user.points }} ptn</div>
            </div>
            <NuxtLink

              :to="{
                name: 'dashboard-klassement-race',
                params: {
                  race: sideBarStore.isClassicSeason ? 'klassiekers' : slugify(latestResult.stage.race.name),
                },
                query: { race: `${slugify(latestResult.stage.race.name)}` },
              }"
              class="btn btn-primary btn-full-width"
            >
              Volledig klassement
              <Icon name="tabler:arrow-right" />
            </NuxtLink>
          </div>
        </div>
        <div v-else class="dashboard-card">
          <div class="icon-header">
            <Icon name="tabler:list-numbers" />
            <h3>
              Klassement
            </h3>
          </div>
          <div>
            <p>Er is nog geen klassement, deze zal komen na de eerste uitslag.</p>
          </div>
        </div>
      </div>

      <!-- <section v-if="upComingStage">
        <h4>Jouw selectie voor etappe {{ upComingStage.stageNr }}:</h4>
        <p>{{ upComingStage.startCity }} - {{ upComingStage.finishCity }}</p>

        <div class="selected-stage">
          <CyclistCardLarge
            v-for="{ cyclist } in userEntries"
            :key="cyclist.id"
            :cyclist

            show-team-data
          />
        </div>
      </section> -->
    </div>
  </main>
</template>

<style lang="scss">
.dashboard {
  &-cover {
    border-radius: var(--border-radius);
    height: 320px;
    overflow: hidden;
    display: flex;
    align-items: center;
    position: relative;
    outline: 1px solid var(--clr-primary);
    transition: all 0.2s ease;

    &:hover {
      box-shadow: var(--box-shadow);
      outline: 3px solid var(--clr-primary);
    }

    > img {
      width: 100%;
      object-fit: cover;
      min-height: 100%;
    }

    .btn:hover {
      background: hsl(from var(--clr-primary) h s l / 0.55);
      color: var(--clr-primary-content);
    }

    &--text {
      background-image: linear-gradient(
        to right,
        hsl(from black h s l / 0.35),
        hsl(from var(--clr-primary) h s l / 0.95)
      );
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;

      &__inner {
        max-width: 50ch;
        margin-left: 2rem;
        display: grid;
        gap: 0.75rem;

        h2,
        p,
        span {
          color: var(--clr-primary-content);
        }

        span {
          text-transform: uppercase;
          font-size: var(--fs-300);
        }
      }
    }
  }

  &-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-top: 2rem;

    span:has(:not(.points-box, .cyclistMiniCard)) {
      text-transform: uppercase;
      font-size: var(--fs-300);
    }
  }

  &-stadings--heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.dashboard-card,
.team-card,
.poule-card {
  padding: 1.5rem;
  border-radius: var(--border-radius);
  outline: 1px solid var(--clr-background-mute);
  background: var(--clr-background);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: var(--box-shadow);
    outline: 1px solid var(--clr-primary);
  }

  .card-info {
    display: grid;
    place-items: center;
    align-content: center;
    max-width: 40ch;
    margin: auto;
    height: 100%;

    .iconify {
      color: var(--clr-primary-mute);
    }
  }
}

.dashboard-selected-riders {
  .selected-riders {
    display: grid;
    gap: 0.5rem;
    margin-top: 0.75rem;
  }

  .cyclistCard {
    background: var(--clr-primary-mute);
    color: var(--clr-text);
  }
}

.dashboard-latest-result {
  .cyclistMiniCard {
    > .cyclistMiniCard--position {
      display: flex;
      place-content: center;
      padding: 2px;
      aspect-ratio: 1/1;
    }
    &:first-of-type > .cyclistMiniCard--position {
      border: 1px solid gold;
      background: hsl(51 100% 40% / 0.5);
      border-radius: 5000px;
      font-weight: 800;
    }
  }
}

.selected-stage {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(auto, 150px));
  place-content: center;
  gap: 1rem;
}
</style>
