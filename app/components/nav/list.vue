<script lang="ts" setup>
import type { ClassicsRaces, SelectRaceWithRelations } from "~/types/race";

const props = defineProps<{
  grandTour?: SelectRaceWithRelations;
  classicsRaces?: ClassicsRaces;
  compLocation: "overzicht" | "uitslag";
}>();

const race = computed(() => {
  if (props.grandTour) {
    return props.grandTour;
  }
  if (props.classicsRaces) {
    return props.classicsRaces;
  }
  return undefined;
});

const sideBarStore = useSideBarStore();
</script>

<template>
  <ul v-if="race" class="stage-list">
    <template v-for="stage in sideBarStore.allStages" :key="stage.id">
      <li v-if="stage.done && compLocation === 'uitslag'" class="stage-list--item">
        <NuxtLink

          :to="{
            name: 'dashboard-race-id-uitslagen-nr',
            params:
              {
                race: slugify(getRaceName(stage.raceId)),
                id: stage.raceId,
                nr: stage.stageNr,
              },
          }"
        >
          <template v-if="!sideBarStore.isClassicSeason">
            <span>{{ stage.stageNr }}.</span> {{ stage.startCity }} - {{
              stage.finishCity }}
          </template>
          <template v-else>
            <span>{{ new Date(stage.date).toLocaleDateString("nl-NL", {
              day: '2-digit',
              month: 'short',
            }) }}</span>
            {{ getRaceName(stage.raceId) }}
          </template>
        </NuxtLink>
      </li>

      <li v-else-if="!stage.done && !stageUnderway(stage.date) && compLocation === 'overzicht'" class="stage-list--item">
        <NuxtLink
          :to="{
            name: 'dashboard-race-id-selecteer-nr',
            params:
              {
                race: slugify(getRaceName(stage.raceId)),
                id: stage.raceId,
                nr: stage.stageNr,
              },
          }"
        >
          <template v-if="!sideBarStore.isClassicSeason">
            <span>{{ stage.stageNr }}.</span> {{ stage.startCity }} - {{
              stage.finishCity }}
          </template>
          <template v-else>
            <span>{{ new Date(stage.date).toLocaleDateString("nl-NL", {
              day: '2-digit',
              month: 'short',
            }) }}</span>
            {{ getRaceName(stage.raceId) }}
          </template>
        </NuxtLink>
      </li>
    </template>
  </ul>
</template>
