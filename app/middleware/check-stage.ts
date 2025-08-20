// import getParamId from "~/utils/param-extractor";

// // TODO CHECK IF IT IS POSSIBLE TO USE THIS MIDDLEWARE

// export default defineNuxtRouteMiddleware(async (to, from) => {
//   if (to === from) {
//     return;
//   }

//   console.log(to, from);
//   const sideBarStore = useSideBarStore();
//   if (!sideBarStore.currentRace) {
//     await sideBarStore.refreshUpcomingRace();
//   }
//   const currentRace = sideBarStore.currentRace;

//   const stageNr = getParamId(to.params.nr);
//   if (stageNr && currentRace) {
//     const foundStage = currentRace.stages.find(stage => stage.stageNr === stageNr) || null;
//     sideBarStore.currentStage = foundStage;

//     if (to.fullPath?.includes("selecteer")) {
//       const startlistStore = useStartlistStore();
//       startlistStore.activeRaceIdForFetch = currentRace.id;
//     }

//     if (foundStage && stageUnderway(foundStage.date) && !foundStage.done) {
//       return navigateTo({
//         name: "dashboard",
//       });
//     }
//     else if (foundStage && foundStage.done && currentRace) {
//       return navigateTo({
//         name: "dashboard-race-id-uitslagen-nr",
//         params: {
//           race: slugify(currentRace.name),
//           id: foundStage.raceId,
//           nr: foundStage.stageNr,
//         },
//       });
//     }
//   }
// });
