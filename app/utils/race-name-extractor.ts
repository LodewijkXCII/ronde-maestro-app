export function getRaceName(searchId: number): string {
  const sidebarStore = useSideBarStore();

  if (sidebarStore.allStages) {
    const findRaceId = sidebarStore.allStages.find(stage => stage.raceId === searchId);

    return sidebarStore.upcomingRace?.find(race => race.id === findRaceId?.raceId)?.name as string;
  }

  return "";
};
