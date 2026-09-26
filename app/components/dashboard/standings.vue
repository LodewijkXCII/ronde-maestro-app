<script lang="ts" setup>
import type { ResultResponse } from "~/types/results";

const props = withDefaults(
  defineProps<{ latestResult: ResultResponse | undefined, limit?: number }>(),
  { limit: 10 }
);

const sideBarStore = useSideBarStore();
const authStore = useAuthStore();
const raceStore = useRaceStore();

const {
  upcomingRace,
  loading: storeLoading,
} = storeToRefs(sideBarStore);

const resultIsGC = ref(true);

const displayedStandings = computed(() => {
  // If GC: use the raceResult from store
  // If Etappe: use the resultData (which reacts to searchStageId) from store
  const data = resultIsGC.value
    ? raceStore.raceResult
    : raceStore.resultData?.users; // Changed from latestResult.value?.users

  if (!data) return [];

  return data
    .map((user) => {
      const pointsValue =
        "totalPoints" in user ? user.totalPoints : user.points;
      return {
        userId: user.userId,
        name: user.name,
        points: pointsValue,
      };
    })
});

const visibleRows = computed(() =>
  getResultWithUser(displayedStandings.value, authStore.user?.id, props.limit),
);

</script>

<template>
<div
  v-if="latestResult && upcomingRace"
  class="dashboard-card dashboard-standings"
>
  <div class="dashboard-stadings--heading">
    <div class="icon-header">
      <Icon name="tabler:list-numbers" />
      <h3>Klassement</h3>
    </div>

    <div class="btn-group-switch">
      <button
        class="btn"
        :class="{ active: resultIsGC }"
        @click="resultIsGC = true"
      >
        Algemeen
      </button>
      <button
        class="btn"
        :class="{ active: !resultIsGC }"
        @click="resultIsGC = false"
      >
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
  <p v-if="resultIsGC">Algemeen klassement</p>

  <Loading
    v-if="raceStore.resultDataStatus === 'pending' || storeLoading"
  />
  <div v-else class="standings-list">
    <template
      v-for="row in visibleRows"
      :key="row.type === 'gap' ? 'gap' : row.user.userId"
    >
        <AppDivider v-if="row.type === 'gap'"/>
        <div v-else
        class="standings-user"
          :class="{ 'current-user': row.user.userId === authStore.user.id }">

      <div class="standings-user--info">
        <div class="standings-user--info__position">
          <span>{{ row.position }}</span>
        </div>
        {{ row.user.name }}
      </div>
      <div>{{ row.user.points }} ptn</div>
    </div>

</template>

  </div>
  <NuxtLink
    :to="{
      name: 'dashboard-klassement-race',
      params: {
        race: sideBarStore.isClassicSeason
          ? 'klassiekers'
          : slugify(latestResult.stage.race.name),
      },
      query: { race: `${slugify(latestResult.stage.race.name)}` },
    }"
    class="btn btn-primary btn-full-width"
  >
    Volledig klassement
    <Icon name="tabler:arrow-right" />
  </NuxtLink>
</div>
<div v-else class="dashboard-card">
  <div class="icon-header">
    <Icon name="tabler:list-numbers" />
    <h3>Klassement</h3>
  </div>
  <div>
    <p>
      Er is nog geen klassement, deze zal komen na de eerste uitslag.
    </p>
  </div>
</div>

</template>
