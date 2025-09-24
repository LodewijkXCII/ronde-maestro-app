import type { ClassicsRaces, SelectRaceWithRelations, Stage } from "~/types/race";

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

  const isClassicSeason = computed(() => {
    if (upcomingRaceStatus.value === "success" && upcomingRace.value) {
      if (upcomingRace.value[0]?.seasonTime.name === "Klassiekers") {
        return true;
      }
      else {
        return false;
      }
    }
  });

  const classicsRaces = computed<ClassicsRaces | null>(() => {
    if (isClassicSeason.value && upcomingRace.value && upcomingRace.value.length) {
      return {
        name: "Klassiekers",
        startDate: upcomingRace.value[0]?.startDate || new Date(),
        finishDate: upcomingRace.value.at(-1)?.finishDate || new Date(),
        races: upcomingRace.value,
        year: upcomingRace.value[0]?.year || new Date().getFullYear(),
        seasonTimeId: upcomingRace.value[0]?.seasonTimeId || null,
      };
    }
    else {
      return null;
    }
  });

  const allStages = computed(() => {
    if (classicsRaces.value && classicsRaces.value.races && classicsRaces.value.races.length) {
    // Type guard to ensure that the array contains SelectRaceWithRelations
      const racesWithStages = classicsRaces.value.races as SelectRaceWithRelations[];
      // Use reduce to flatten the stages from all races into a single array
      return racesWithStages.reduce((allStages, race) => {
        return allStages.concat(race.stages);
      }, [] as Stage[]).toSorted((a, b) => a.stageNr - b.stageNr); // Initialize the accumulator as an empty Stage array
    }
    if (!classicsRaces.value && upcomingRace.value) {
      return upcomingRace.value[0]?.stages;
    }

    return [];
  });

  return {
    loading,
    isClassicSeason,
    classicsRaces,
    upcomingRace,
    upcomingRaceStatus,
    refreshUpcomingRace,
    currentRace,
    currentStage,
    upComingStage,
    allStages,
  };
});
