<script lang="ts" setup>
import type { CyclistWithRelations, StartlistDetails } from "~/types/startlist";

const props = defineProps<{
  cyclist: CyclistWithRelations;
  raceDetails?: StartlistDetails;
  showSpecialies?: boolean;
  showTeamData?: boolean;
  noUserSelect?: boolean;
}>();

const config = useRuntimeConfig();

const isSelected = riderSelected(props.cyclist.id);
</script>

<template>
  <div class="cyclistCard" :class="{ withdraw: raceDetails?.withdraw, selected: isSelected }" :data-user-select="noUserSelect ? false : true">
    <div class="cyclistCard--avatar">
      <div class="avatar" :class="{ 'avatar-placeholder': cyclist.image === '/' }">
        <img v-if="cyclist.image !== '/' || !cyclist.image" :src="`${config.public.s3BucketURL}/${cyclist.image}`" :alt="cyclist.lastName">
        <span v-else>
          {{ cyclist.firstName.charAt(0) }}{{ cyclist.lastName.charAt(0) }}
        </span>
      </div>
      <div v-if="cyclist.country.abbreviation" class="cyclistCard--avatar__flag">
        <AppFlag :country-code="cyclist.country.abbreviation" size="small" />
      </div>
    </div>
    <div class="cyclistCard--info">
      <div class="cyclistCard--raceInfo">
        <div v-if="raceDetails" class="cyclistCard-raceInfo__number">
          # {{ raceDetails.raceNumber }}
        </div>
      </div>
      <div class="cyclistCard--cyclistInfo">
        <div class="cyclistCard--cyclistInfo__name">
          {{ cyclist.firstName }} <strong>{{ cyclist.lastName }}</strong>
        </div>
        <div v-if="showTeamData">
          {{ cyclist.team.name }}
        </div>
      </div>
    </div>
    <div v-if="showSpecialies" class="cyclistCard--specialities">
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
.cyclistCard {
  --_avatar-width: 45px;
  display: grid;
  grid-template-columns: var(--_avatar-width) 1fr minmax(35px, 65px) minmax(1px, auto);
  align-items: center;
  gap: 0.5rem;
  background: var(--clr-background-mute);
  user-select: none;

  &:hover:not([data-user-select="false"]) {
    transition: transform ease-in-out 0.3s;
    transform: scale(1.03);
    outline: 2px solid var(--clr-primary-dark);
    color: var(--clr-text);
    cursor: pointer;
  }

  &--avatar {
    position: relative;

    &__flag {
      position: absolute;
      right: 0;
      bottom: -10px;
    }
  }

  .avatar {
    --_avatar-width: 45px;
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
