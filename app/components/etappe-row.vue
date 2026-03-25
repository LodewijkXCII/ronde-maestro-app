<script setup lang="ts">
import type { Stage } from "~/types/race";

defineProps<{
  stage: Stage;
  raceName: string;
}>();

const config = useRuntimeConfig();
const sideBarStore = useSideBarStore();
</script>

<template>
  <li class="stage-row">
    <div class="stage-nr">
      <span>
        {{ stage.stageNr }}
      </span>
    </div>
    <div class="stage-info">
      <div v-if="!sideBarStore.isClassicSeason">
        {{ stage.startCity }} - {{ stage.finishCity }}
      </div>
      <div v-else>
        {{ raceName }}
      </div>
      <div class="stage-details">
        {{ new Date(stage.date).toLocaleDateString("nl-NL", {
          day: '2-digit',
          month: 'short',
        }) }} -
        {{ stage.distance }} km  -
        <img :src="`${config.public.s3BucketURL}/${stage.stageType.image}`" :alt="stage.stageType.name">
      </div>
    </div>
    <div>
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
        class="btn btn-success"
      >
        <Icon name="tabler:trophy" size="24" />
        Uitslag
      </NuxtLink>
      <NuxtLink
        v-else-if="!stageUnderway(stage.date)"
        :to="{
          name: 'dashboard-race-id-selecteer-nr',
          params:
            {
              race: slugify(raceName),
              id: stage.raceId,
              nr: stage.stageNr,
            },
        }"
        class="btn btn-primary"
      >
        <Icon name="tabler:pencil" size="24" />
        Selecteren
      </NuxtLink>
    </div>
  </li>
</template>

<style>
.stage-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--clr-background-mute);
  padding: 1rem;
  border-radius: var(--border-radius);
  margin-block: 0.75rem;

  .stage-nr {
    width: 6ch;
    height: 100%;
    aspect-ratio: 1 / 1;
    background-color: var(--clr-primary-mute);
    border-radius: var(--border-radius);

    display: flex;
    place-items: center;
    place-content: center;
    margin: 0;

    span {
      font-size: var(--fs-500);
      font-weight: 900;
    }
  }

  .stage-info {
    flex: 1;
    display: grid;
    gap: 0.25rem;

    > div:first-child {
      font-weight: 800;
    }

    .stage-details {
      display: flex;
      gap: 0.5rem;
      font-size: var(--fs-300);
    }
  }
}
</style>
