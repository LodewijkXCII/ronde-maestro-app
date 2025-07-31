import type { SelectRaceWithRelations } from "~/types/race";

export const useSideBarStore = defineStore("useSideBarStore", () => {
  const config = useRuntimeConfig();

  const currentRace = ref<SelectRaceWithRelations | null>(null);

  const {
    data: upcomingRace,
    status: upcomingRaceStatus,
    refresh: refreshUpcomingRace,
  } = useFetch<SelectRaceWithRelations[]>(`${config.public.apiBase}/races/next-race`, {
    lazy: true,
    credentials: "include",
  });

  const loading = computed(() => {
    if (upcomingRace) {
      return false;
    }
    return true;
  });

  return {
    loading,
    upcomingRace,
    upcomingRaceStatus,
    refreshUpcomingRace,
    currentRace,
  };
});
