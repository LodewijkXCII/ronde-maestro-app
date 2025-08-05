import type { GetEntry, ValidEntry } from "~/types/entries";
import type { CyclistWithRaceDetails } from "~/types/startlist";

export const useSelectedRidersStore = defineStore("useSelectedRidersStore", () => {
  const config = useRuntimeConfig();
  const startlistStore = useStartlistStore();

  const activeStageIdForFetch = ref<number | null>(null);
  const formDirty = ref(false);

  const stageId = computed(() => {
    return activeStageIdForFetch.value ? String(activeStageIdForFetch.value) : null;
  });

  const {
    data: entryData,
    status: statusEntryData,
    refresh: refreshEntryData,
  } = useFetch<GetEntry[]>(() => `${config.public.apiBase}/entries/${stageId.value}`, {
    method: "get",
    credentials: "include",
    immediate: false,
    lazy: true,
    watch: [activeStageIdForFetch],
  });

  const selectedRiders = ref<ValidEntry[]>([]);
  const selectedRidersComponents = computed(() => {
    const returnArray: CyclistWithRaceDetails[] = [];

    selectedRiders.value.forEach(({ cyclistId }) => {
      const foundRider = startlistStore.riderStartlist.find(rider => rider.id === cyclistId);

      if (foundRider) {
        returnArray.push(foundRider);
      }
    });
    return returnArray;
  });

  watch(() => entryData.value, (newData) => {
    if (newData && newData.length) {
      selectedRiders.value = [];
      newData.forEach((entry) => {
        return selectedRiders.value.push({ cyclistId: entry.cyclist.id });
      });
    }
  });

  function handleCyclist(searchId: number) {
    if (!formDirty.value) {
      formDirty.value = true;
    }
    const foundIndex = selectedRiders.value.findIndex(rider => rider.cyclistId === searchId);

    if (foundIndex === -1) {
      if (startlistStore.riderStartlist.find(rider => rider.id === searchId)) {
        selectedRiders.value.push({ cyclistId: searchId });
      }
    }
    else {
      selectedRiders.value.splice(foundIndex, 1);
    }
  }

  function clearSelection() {
    selectedRiders.value = [];
  }

  return {
    entryData,
    statusEntryData,
    refreshEntryData,
    activeStageIdForFetch,
    selectedRiders,
    handleCyclist,
    selectedRidersComponents,
    clearSelection,
    formDirty,
  };
});
