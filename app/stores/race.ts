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
  } = useFetch<RaceTotalPoints[]>((): string => {
    // 2. If urlPath is null, this returns null and useFetch will NOT execute
    if (!url.value) {
      return null as unknown as string;
    }
    return `${config.public.apiBase}/results/race/${url.value}`;
  }, {
    method: "get",
    credentials: "include",
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
  } = useFetch<ResultResponse>(() => {
    if (!searchStageId.value) {
      return null as unknown as string;
    }

    return `${config.public.apiBase}/results/stage/${searchStageId.value}`;
  }, {
    query: computed(() => ({
      pouleId: currentPouleId.value || undefined,
    })),
    method: "get",
    credentials: "include",
    watch: [searchStageId],
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
