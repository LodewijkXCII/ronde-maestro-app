import type { CyclistWithRaceDetails, TeamWithStartlistCyclists } from "~/types/startlist";

export const useStartlistStore = defineStore("useStartlistStore", () => {
  const config = useRuntimeConfig();

  const activeRaceIdForFetch = ref<number | null>(null);

  const startlistId = computed(() => {
    return activeRaceIdForFetch.value ? String(activeRaceIdForFetch.value) : null;
  });
  const showAllTeams = ref(false);

  const {
    data: startlistData,
    status: startlistDataStatus,
    refresh: refreshStartlistData,
  } = useFetch<TeamWithStartlistCyclists[]>(() => `${config.public.apiBase}/startlists/${startlistId.value}`, {
    method: "get",
    credentials: "include",
    lazy: true,
    immediate: false,
    watch: [activeRaceIdForFetch],
  });

  const riderStartlist = computed<CyclistWithRaceDetails[]>(() => {
    if (!startlistData.value) {
      return [];
    }
    const cyclists: CyclistWithRaceDetails[] = [];
    startlistData.value.forEach((teamEntry) => {
      teamEntry.cyclists.forEach((cyclist) => {
        cyclists.push({
          ...cyclist,
          fullName: `${cyclist.firstName} ${cyclist.lastName}`,
        });
      });
    });
    return cyclists;
  });

  const loading = computed(() => startlistDataStatus.value === "pending");



  return {
    activeRaceIdForFetch,
    loading,
    startlistData,
    startlistDataStatus,
    refreshStartlistData,
    riderStartlist,
    showAllTeams,
  };
});
