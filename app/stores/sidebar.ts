import { addDays, endOfDay, isAfter, isBefore, isWithinInterval, startOfDay } from "date-fns";

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
    immediate: true,
    lazy: true,
    onResponseError({ response }) {
      if (response.status === 401) {
        navigateTo("/inloggen");
      }
    },
  });

  const currentRace = computed<SelectRaceWithRelations | null>(() => {
    if (!upcomingRace.value || upcomingRace.value.length === 0) {
      return null;
    }
    const routeRaceId = getParamId(route.params.id);
    if (routeRaceId) {
      return upcomingRace.value.find(race => race.id === routeRaceId) || null;
    }

    const today = new Date();

    const activeRace = upcomingRace.value.find((race) => {
      return isWithinInterval(today, {
        start: startOfDay(new Date(race.startDate)),
        end: endOfDay(new Date(race.finishDate)),
      });
    });

    if (activeRace) {
      return activeRace;
    }

    const nextWeek = addDays(today, 7);
    const upcomingSoon = upcomingRace.value.find((race) => {
      const startDate = new Date(race.startDate);
      return isAfter(startDate, today) && isBefore(startDate, nextWeek);
    });

    return upcomingSoon || null;
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

  const upcomingStage = computed<Stage | null>(() => {
    if (!isClassicSeason.value) {
      if (!currentRace.value?.stages?.length)
        return null;

      // Find the first one not done, OR return the last one if all are done
      return currentRace.value.stages.find(stage => !stage.done)
        || currentRace.value.stages[currentRace.value.stages.length - 1];
    }
    else {
      if (!allStages.value?.length)
        return null;

      // Find the first one not done, OR return the last one if all are done
      return allStages.value.find(stage => !stage.done)
        || allStages.value[allStages.value.length - 1];
    }
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
    upComingStage: upcomingStage,
    allStages,
  };
});
