export async function goToStage(stageId: number) {
  const sideBarStore = useSideBarStore();

  if (!sideBarStore.upcomingRace || !sideBarStore.upcomingRace.length) {
    return undefined;
  }

  sideBarStore.upcomingRace.forEach((race) => {
    if (race.stages && Array.isArray(race.stages)) {
      race.stages.forEach(async (stage) => {
        if (stage.id === stageId) {
          if (stage.done) {
            await navigateTo({
              name: "dashboard-race-id-uitslagen-etappe-nr",
              params: {
                race: slugify(race.name),
                id: race.id,
                nr: stage.stageNr,
              },
            });
          }
          else if (stageUnderway(stage.date)) {
            await navigateTo("/dashboard");
          }

          else {
            await navigateTo({
              name: "dashboard-race-id-selecteer-etappe-nr",
              params: {
                race: slugify(race.name),
                id: race.id,
                nr: stage.stageNr,
              },
            });
          }
        }
      });
    }
  });
}
