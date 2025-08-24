<script setup lang="ts">
import type { Stage } from "~/types/race";

defineProps<{
  stage: Stage;
  raceName: string;
}>();

const config = useRuntimeConfig();
</script>

<template>
  <div class="table-stage-nr">
    {{ stage.stageNr }}
  </div>
  <div class="table-date">
    {{ new Date(stage.date).toLocaleDateString("nl-NL", {
      day: '2-digit',
      month: 'short',
    }) }}
  </div>
  <div class="table-grow table-start-finish">
    {{ stage.startCity }} - {{ stage.finishCity }}
  </div>
  <div class="table-type">
    <img :src="`${config.public.s3BucketURL}/${stage.stageType.image}`" :alt="stage.stageType.name">
    {{ stage.distance }} km
  </div>

  <div class="table-action">
    <NuxtLink
      v-if="stage.done"
      :to="{
        name: 'dashboard-race-id-uitslagen-nr',
        params:
          {
            race: slugify(raceName),
            id: stage.raceId,
            nr: stage.stageNr,
          },

      }"
    >
      <Icon name="tabler:trophy" size="24" style="color:var(--clr-accent-green)" />
      Bekijk uitslag
    </NuxtLink>
    <NuxtLink v-else-if="!stage.done && stageUnderway(stage.date)" to="/dashboard">
      <Icon name="tabler:pencil-off" size="24" style="color:var(--clr-alert)" />
      Etappe onderweg
    </NuxtLink>
    <NuxtLink
      v-else
      :to="{
        name: 'dashboard-race-id-selecteer-nr',
        params:
          {
            race: slugify(raceName),
            id: stage.raceId,
            nr: stage.stageNr,
          },
      }"
    >
      <Icon name="tabler:pencil" size="24" style="color:var(--clr-primary)" />
      Selecteer renners
    </NuxtLink>
  </div>
</template>
