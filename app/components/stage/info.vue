<script lang="ts" setup>
import type { SelectRaceWithRelations, Stage } from "~/types/race";

defineProps<{
  race: SelectRaceWithRelations;
  stage?: Stage;
}>();

const config = useRuntimeConfig();
</script>

<template>
  <article class="stage-box stage-section">
    <div class="stage-box--title stage-section--race">
      <div>
        <h3>{{ race.name }}</h3>
        <div v-if="stage" class="stage-section--stage__info">
          <p>
            {{ stage.stageNr }}:  {{ new Date(stage.date).toLocaleDateString("nl-NL", {
              day: '2-digit',
              month: 'short',
            }) }}. - {{ stage.startCity }} - {{ stage.finishCity }}
          </p>
          <div v-if="stage" class="stage-section--stage__type badge">
            <img :src="`${config.public.s3BucketURL}/${stage.stageType.image}`" :alt="stage.stageType.name" class="stage-type-image"><span>{{ stage.stageType.name }}</span>
          </div>
        </div>
        <p v-else>
          {{ new Date(race.startDate).toLocaleDateString("nl-NL", {
            day: '2-digit',
            month: 'short',
          }) }} -  {{ new Date(race.finishDate).toLocaleDateString("nl-NL", {
            day: '2-digit',
            month: 'short',
          }) }}
        </p>
      </div>
      <div class="avatar avatar-race">
        <img :src="`${config.public.s3BucketURL}/${race.image}`" :alt="race.name">
      </div>
    </div>
    <div v-if="stage" class="stage-box--body">
      <div class="stage-image">
        <img :src="`${config.public.s3BucketURL}/${stage.image}`" :alt="`${stage.startCity}-${stage.finishCity}`">
      </div>
    </div>
  </article>
</template>

<style lang="scss">
.stage-section {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / span 2;

  &--race {
    display: grid;
    grid-template-columns: auto minmax(auto, 75px);
    gap: 0.75rem 0.25rem;
    justify-content: space-between;

    h3 {
      font-weight: 700;
      text-transform: uppercase;
    }

    p {
      margin: 0;
    }
  }

  &--stage {
    &__info {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.75rem;
      align-items: center;
      grid-column: -1/1;
    }
  }
}

.stage-image {
  width: 100%;
  max-height: 180px;
  overflow: hidden;
  border: 1px dotted pink;

  img {
    width: 100%;
    object-fit: cover;
  }
}
</style>
