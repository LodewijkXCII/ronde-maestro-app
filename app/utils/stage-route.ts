import type { SelectRaceWithRelations, Stage } from "~/types/race";

export async function goToStage(stageId: number | null) {
  const sideBarStore = useSideBarStore();
  const races = sideBarStore.upcomingRace;

  if (!sideBarStore.upcomingRace || !sideBarStore.upcomingRace.length || !races) {
    return undefined;
  }

  let foundRace: SelectRaceWithRelations | null = null;
  let foundStage: Stage | null = null;

  for (const race of races) {
    foundStage = race.stages?.find((s: Stage) => s.id === stageId) || null;
    if (foundStage) {
      foundRace = race;
      break;
    }
  }

  if (!foundRace || !foundStage) {
    return;
  };

  const raceSlug = slugify(foundRace.name);
  const stageNr = foundStage.stageNr;
  const raceId = foundRace.id;

  if (foundStage.done) {
    return await navigateTo({
      name: "dashboard-race-id-uitslagen-nr",
      params: { race: raceSlug, id: raceId, nr: stageNr },
    });
  }

  if (stageUnderway(foundStage.date)) {
    return await navigateTo("/dashboard");
  }

  return await navigateTo({
    name: "dashboard-race-id-selecteer-nr",
    params: { race: raceSlug, id: raceId, nr: stageNr },
  });

  // sideBarStore.upcomingRace.forEach((race) => {
  //   if (race.stages && Array.isArray(race.stages)) {
  //     race.stages.forEach(async (stage) => {
  //       if (stage.id === stageId) {
  //         if (stage.done) {
  //           await navigateTo({
  //             name: "dashboard-race-id-uitslagen-nr",
  //             params: {
  //               race: slugify(race.name),
  //               id: race.id,
  //               nr: stage.stageNr,
  //             },
  //           });
  //         }
  //         else if (stageUnderway(stage.date)) {
  //           await navigateTo("/dashboard");
  //         }

  //         else {
  //           await navigateTo({
  //             name: "dashboard-race-id-selecteer-nr",
  //             params: {
  //               race: slugify(race.name),
  //               id: race.id,
  //               nr: stage.stageNr,
  //             },
  //           });
  //         }
  //       }
  //     });
  //   }
  // });
}
