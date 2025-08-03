<script setup lang="ts">
import type { SelectRaceWithRelations } from "~/types/race";

defineProps<{
  race: SelectRaceWithRelations;
}>();
</script>

<template>
  <article>
    <h3>Etappes voor {{ race.name }}</h3>
    <p>
      {{ new Date(race.startDate).toLocaleDateString("nl-NL", {
        day: '2-digit',
        month: 'short',
      }) }} -  {{ new Date(race.finishDate).toLocaleDateString("nl-NL", {
        day: '2-digit',
        month: 'short',
      }) }}
    </p>
    <ul class="table">
      <li class="table-row table-header">
        <div>#</div>
        <div />
        <div>Start en finish</div>
        <div />
        <div>Afstand</div>
        <div />
      </li>
      <li
        v-for="stage in race.stages"
        :key="stage.id"
        class="table-row"
        @click="goToStage(stage.id)"
      >
        <EtappeRow :stage="stage" :race-name="race.name" />
      </li>
    </ul>
  </article>
</template>
