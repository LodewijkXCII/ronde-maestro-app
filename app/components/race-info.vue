<script lang="ts" setup>
import type { ClassicsRaces, Stage } from "~/types/race";

defineProps<{
  race: ClassicsRaces;
  stage?: Stage;
}>();
</script>

<template>
  <article class="stage-box stage-section">
    <div class="stage-box--title stage-section--race">
      <div>
        <h3>{{ race.name }}</h3>

        <p>
          {{ new Date(race.startDate).toLocaleDateString("nl-NL", {
            day: '2-digit',
            month: 'short',
          }) }} -  {{ new Date(race.finishDate).toLocaleDateString("nl-NL", {
            day: '2-digit',
            month: 'short',
          }) }}
        </p>
      </div>
    </div>
  </article>
</template>
