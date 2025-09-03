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
    onResponseError({ response }) {
      if (response.status === 401) {
        navigateTo("/inloggen");
      }
    },
  });

  const currentRace = computed<SelectRaceWithRelations | null>(() => {
    const routeRaceId = getParamId(route.params.id);
    if (upcomingRace.value && routeRaceId) {
      return upcomingRace.value.find(race => race.id === routeRaceId) || null;
    }
    return null;
  });

  const upComingStage = computed<Stage | null>(() => {
    if (!upcomingRace || !upcomingRace.value) {
      return null;
    }

    const nextStage = upcomingRace.value[0]?.stages.find(stage => stage.done === false && stageUnderway(stage.date));

    if (!nextStage) {
      return null;
    }

    return nextStage;
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
    upComingStage,
  };
});
