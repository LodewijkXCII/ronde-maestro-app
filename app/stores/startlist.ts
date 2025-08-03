import type { StartlistWithTeam } from "~/types/startlist";

export const useStartlistStore = defineStore("useStartlistStore", () => {
  const config = useRuntimeConfig();

  const activeRaceIdForFetch = ref<number | null>(null);

  const startlistId = computed(() => {
    return activeRaceIdForFetch.value ? String(activeRaceIdForFetch.value) : null;
  });

  const {
    data: startlistData,
    status: startlistDataStatus,
    refresh: refreshStartlistData,
  } = useFetch<StartlistWithTeam[]>(() => `${config.public.apiBase}/startlists/${startlistId.value}`, {
    method: "get",
    credentials: "include",
    lazy: true,
    immediate: false,
    watch: [activeRaceIdForFetch],
  });

  const loading = computed(() => startlistDataStatus.value === "pending");

  return {
    activeRaceIdForFetch,
    loading,
    startlistData,
    startlistDataStatus,
    refreshStartlistData,
  };
});
