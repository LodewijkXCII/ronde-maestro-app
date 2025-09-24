<script setup lang="ts">
import type { ClassicsRaces, SelectRaceWithRelations } from "~/types/race";

const props = defineProps<{
  grandTour?: SelectRaceWithRelations;
  classicsRaces?: ClassicsRaces;
}>();

const sideBarStore = useSideBarStore();
const race = computed(() => {
  if (props.grandTour) {
    return props.grandTour;
  }
  if (props.classicsRaces) {
    return props.classicsRaces;
  }
  return undefined;
});
</script>

<template>
  <article v-if="race" class="race">
    <h3>Etappes voor {{ race.name }} {{ race.year }}</h3>
    <p>
      {{ new Date(race.startDate).toLocaleDateString("nl-NL", {
        day: '2-digit',
        month: 'short',
      }) }} -  {{ new Date(race.finishDate).toLocaleDateString("nl-NL", {
        day: '2-digit',
        month: 'short',
      }) }}
    </p>
    <ul class="table race-table">
      <li class="table-row table-header">
        <div class="table-stage-nr">
          #
        </div>
        <div class="table-date" />
        <div class="table-start-finish">
          Start en finish
        </div>

        <div class="table-type">
          Afstand
        </div>
        <div class="table-action" />
      </li>
      <li
        v-for="stage in sideBarStore.allStages"
        :key="stage.id"
        class="table-row"
        @click="goToStage(stage.id)"
      >
        <EtappeRow :stage="stage" :race-name="getRaceName(stage.raceId)" />
      </li>
    </ul>
  </article>
</template>

<style>
@media screen and (max-width: 1300px) {
  .table-row {
    grid-template-areas:
      "stageNr startFinish action"
      "date type action";
    align-items: start;
  }

  .table-stage-nr {
    grid-area: stageNr;
  }
  .table-date {
    grid-area: date;
  }
  .table-start-finish {
    grid-area: startFinish;
  }
  .table-type {
    display: type;
  }
  .table-distance {
    grid-area: distance;
  }
  .table-action {
    grid-area: action;
    align-self: center;
  }

  .table-stage-nr,
  .table-start-finish {
    align-self: last baseline;
  }
}
</style>
