<script lang="ts" setup>
import type { CyclistWithRelations, StartlistDetails } from "~/types/startlist";

defineProps<{
  cyclist: CyclistWithRelations;
  raceDetails?: StartlistDetails;
  showSpecialies?: boolean;
  showTeamData?: boolean;
}>();

const config = useRuntimeConfig();
</script>

<template>
  <div class="cyclistCardLarge" :class="{ withdraw: raceDetails?.withdraw, selected: riderSelected(cyclist.id) }">
    <div class="cyclistCardLarge--avatar">
      <div class="avatar" :class="{ 'avatar-placeholder': cyclist.image === null }">
        <img v-if="cyclist.image !== '/' && cyclist.image !== null" :src="`${config.public.s3BucketURL}/${cyclist.image}`" :alt="cyclist.lastName">
        <span v-else>
          {{ cyclist.firstName.charAt(0) }}{{ cyclist.lastName.charAt(0) }}
        </span>
      </div>
    </div>
    <div class="cyclistCardLarge--info">
      <div class="cyclistCardLarge--raceInfo">
        <div v-if="raceDetails" class="cyclistCardLarge-raceInfo__number">
          # {{ raceDetails.raceNumber }}
        </div>
      </div>
      <div class="cyclistCardLarge--cyclistInfo">
        <div class="cyclistCardLarge--cyclistInfo__name">
          {{ cyclist.firstName }} <strong>{{ cyclist.lastName }}</strong>
        </div>
        <div v-if="showTeamData" class="cyclistCardLarge--cyclistInfo__team">
          {{ cyclist.team.name }}
        </div>
      </div>
    </div>
    <div v-if="showSpecialies" class="cyclistCardLarge--specialities">
      <img
        v-for="{ speciality } in cyclist.specialities"
        :key="speciality.id"
        :src="`${config.public.s3BucketURL}/${speciality.image}`"
        :alt="speciality.name"
      >
    </div>
    <slot name="actionSlot" />
  </div>
</template>

<style lang="scss">
.cyclistCardLarge {
  display: grid;
  place-content: center;
  gap: 0.75rem;
  background: var(--clr-background-mute);
  text-align: center;
  padding: 0.75rem;
  border-radius: var(--border-radius);
  max-width: 150px;

  &--avatar {
    position: relative;
    display: flex;
    justify-content: center;

    &__flag {
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }

  .avatar {
    --_avatar-width: 85px;
  }

  &--raceInfo,
  &--specialities {
    display: flex;
    gap: 0.5rem;
    place-items: center;
    flex-wrap: wrap;

    img {
      width: 20px;
    }
  }

  &--cyclistInfo__team {
    font-size: var(--fs-200);
  }

  &--actions {
    justify-self: end;
    align-self: start;
  }

  &.withdraw {
    background: var(--clr-background-mute);
    pointer-events: none;
    opacity: 0.5;

    * {
      filter: grayscale(100%);
    }
  }
  &.selected {
    background: var(--clr-primary);
    color: var(--clr-primary-content);
  }
  .points {
    text-align: right;
  }
}
</style>
