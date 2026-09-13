<script lang="ts" setup>
import { computed } from "vue";

import type { ClassicsRaces, SelectRaceWithRelations } from "~/types/race";

const props = defineProps<{
  grandTour?: SelectRaceWithRelations;
  classicsRaces?: ClassicsRaces;
  compLocation: "overzicht" | "uitslag";
  onClosed?: () => void;
}>();

const sideBarStore = useSideBarStore();

// Check if a race exists to render the list
const hasRace = computed(() => !!(props.grandTour || props.classicsRaces));

// 1. Centralized Route Name mapping based on compLocation
const routeName = computed(() => {
  return props.compLocation === "uitslag"
    ? "dashboard-race-id-uitslagen-nr"
    : "dashboard-race-id-selecteer-nr";
});

// Helper function to format the dates cleanly
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("nl-NL", {
    day: "2-digit",
    month: "short",
  });
}

// 2. Filter stages early to keep template conditions simple
const visibleStages = computed(() => {
  const filteredStages = sideBarStore.allStages.filter((stage) => {
    if (props.compLocation === "uitslag") {
      return stage.done;
    }
    if (props.compLocation === "overzicht") {
      return !stage.done && !stageUnderway(stage.date);
    }
    return false;
  });

  if (props.compLocation === "uitslag") {
    filteredStages.reverse();
  }

  return filteredStages;
});

function handleClick() {
  if (props.onClosed) {
    props.onClosed();
  }
}
</script>

<template>
  <ul v-if="hasRace" class="stage-list">
    <li
      v-for="stage in visibleStages"
      :key="stage.id"
      class="stage-list--item"
    >
      <NuxtLink
        :to="{
          name: routeName,
          params: {
            race: slugify(getRaceName(stage.raceId)),
            id: stage.raceId,
            nr: stage.stageNr,
          },
        }"
        @click="handleClick"
      >
        <template v-if="!sideBarStore.isClassicSeason">
          <span class="stage-nr">{{ stage.stageNr }}.</span>

          <span class="stage-city">{{ stage.startCity }} - {{ stage.finishCity }}</span>
          <span class="stage-date">{{ formatDate(stage.date) }}</span>
        </template>

        <template v-else>
          <span class="stage-date">{{ formatDate(stage.date) }}. </span>
          <span :class="{ 'stage-race': compLocation === 'overzicht' }">
            {{ getRaceName(stage.raceId) }}
          </span>
        </template>
      </NuxtLink>
    </li>
  </ul>
</template>
