import type { RaceTotalPoints, ResultResponse } from "~/types/results";

export const useRaceStore = defineStore("useRaceStore", () => {
  const loading = ref(false);
  const isInitialLoad = ref(true);

  const config = useRuntimeConfig();
  const sideBarStore = useSideBarStore();

  const url = computed(() => {
    // Return null if data isn't ready to prevent a junk request
    if (!sideBarStore.upcomingRace) {
      return null;
    }

    const id = sideBarStore.isClassicSeason
      ? `0?seasonTimeId=${sideBarStore.classicsRaces?.seasonTimeId}`
      : `${sideBarStore.currentRace?.id}`;

    return id;
  });

  const {
    data: raceResult,
    status: raceResultStatus,
    refresh: refreshRaceResult,
    error,
  } = useAsyncData("race-result", () => {
    // Skip the request until the race data is ready (useFetch would request "/null")
    if (!url.value) {
      return Promise.resolve(null);
    }
    return $fetch<RaceTotalPoints[]>(`${config.public.apiBase}/results/race/${url.value}`, {
      method: "get",
      credentials: "include",
    });
  }, {
    watch: [url],
    immediate: false,
    lazy: true,
  });

  const searchStageId = ref<number>();
  const currentPouleId = ref<number | null>(null); // New ref for the ID

  const {
    data: resultData,
    status: resultDataStatus,
    refresh: refreshResultData,
  } = useAsyncData("stage-result", () => {
    if (!searchStageId.value) {
      return Promise.resolve(null);
    }

    return $fetch<ResultResponse>(`${config.public.apiBase}/results/stage/${searchStageId.value}`, {
      query: {
        pouleId: currentPouleId.value || undefined,
      },
      method: "get",
      credentials: "include",
    });
  }, {
    watch: [searchStageId, currentPouleId],
    immediate: true,
    lazy: true,
  });

  const errorMessage = computed(() => error.value ? error.value.message : "");

  function setNewStageData(stageId: number) {
    isInitialLoad.value = false; // Also disable auto-select if user clicks something
    searchStageId.value = stageId;
  }

  watch(() => sideBarStore.allStages, (newStages) => {
    // 2. Only auto-select if it's the first time and we don't have an ID yet
    if (isInitialLoad.value && newStages && newStages?.length > 0) {
      const lastDone = newStages.findLast(s => s.done);
      searchStageId.value = lastDone ? lastDone.id : newStages[0]?.id;

      // 3. Lock the auto-selector so it doesn't run again
      isInitialLoad.value = false;
    }
  }, { immediate: true });

  return {
    url,
    raceResult,
    raceResultStatus,
    refreshRaceResult,
    loading,
    errorMessage,
    searchStageId,
    currentPouleId,
    resultData,
    resultDataStatus,
    refreshResultData,
    setNewStageData,
  };
});
