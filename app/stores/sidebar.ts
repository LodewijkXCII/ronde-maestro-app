import type { SelectRaceWithRelations, Stage } from "~/types/race";

import getParamId from "~/utils/param-extractor";

export const useSideBarStore = defineStore("useSideBarStore", () => {
  const config = useRuntimeConfig();
  const route = useRoute();

  // const currentRace = ref<SelectRaceWithRelations | null>(null);

  const {
    data: upcomingRace,
    status: upcomingRaceStatus,
    refresh: refreshUpcomingRace,
  } = useFetch<SelectRaceWithRelations[]>(`${config.public.apiBase}/races/next-race`, {
    method: "get",
    credentials: "include",
    immediate: false,
    lazy: true,
  });

  const currentRace = computed<SelectRaceWithRelations | null>(() => {
    const routeRaceId = getParamId(route.params.id);
    if (upcomingRace.value && routeRaceId) {
      return upcomingRace.value.find(race => race.id === routeRaceId) || null;
    }
    return null;
  });

  const currentStage = ref<Stage | null>(null);

  const loading = computed(() => upcomingRaceStatus.value === "pending");

  return {
    loading,
    upcomingRace,
    upcomingRaceStatus,
    refreshUpcomingRace,
    currentRace,
    currentStage,
  };
});
