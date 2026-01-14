<script setup lang="ts">
import type { Cyclist } from "~/types/common";

defineProps<{
  cyclist: Cyclist;
  result?: {
    position: number;
    points: number;
  };
}>();

const config = useRuntimeConfig();
</script>

<template>
  <div class="cyclistMiniCard">
    <div class="cyclistMiniCard--position">
      <span v-if="result && result.position > 0">{{ result.position }}.</span>
      <span v-else>-</span>
    </div>

    <div class="avatar" :class="{ 'avatar-placeholder': !cyclist.image || cyclist.image === '/' }">
      <img
        v-if="cyclist.image && cyclist.image !== '/'"
        :src="`${config.public.s3BucketURL}/${cyclist.image}`"
        :alt="cyclist.lastName"
      >
      <span v-else>
        {{ cyclist.firstName.charAt(0) }}{{ cyclist.lastName.charAt(0) }}
      </span>
    </div>

    <div class="cyclistMiniCard--cyclist">
      <div class="cyclistMiniCard--cyclist__name">
        <p>
          {{ cyclist.firstName }}
          <strong>{{ cyclist.lastName }}</strong>
        </p>
        <AppFlag :country-code="cyclist.country.abbreviation" size="small" />
      </div>
      <p class="cyclistMiniCard--cyclist__team">
        {{ cyclist.team.name }}
      </p>
    </div>
    <!-- FIXME IF NEEDED USE AS SLOT -->
    <div v-if="result?.points" class="points">
      <span>{{ result?.points }}</span> ptn
    </div>
  </div>
</template>

<style lang="scss">
.cyclistMiniCard {
  --_avatar-width: 35px;
  font-size: 0.9rem;
  margin: 0.5rem 0;
  display: grid;
  grid-template-columns: minmax(3ch, auto) var(--_avatar-width) minmax(auto, 40ch) auto;
  gap: 0.5rem;
  align-items: center;
  max-width: var(--rider-card-width);
  border-radius: var(--border-radius);

  // &:first-of-type {
  //   margin-top: 1rem;
  // }

  &--cyclist {
    p {
      margin: 0;
    }
    &__name {
      display: flex;
      gap: 0.35rem;
      place-items: center;
    }
    &__team {
      font-weight: 300;
      font-style: italic;
    }
  }

  .avatar {
    --_avatar-width: var(--_avatar-width);
  }

  &--raceInfo__number {
    font-weight: 900;
  }

  .points > span {
    font-weight: 800;
  }
}
</style>
