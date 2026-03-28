<script lang="ts" setup>
import type { ResultUsersByStage } from "~/types/results";

defineProps<{
  user: ResultUsersByStage;
  position: number;
}>();

const authUser = useAuthStore().user;

const showTeam = ref(false);
</script>

<template>
  <li class="table-row" :class="{ 'is-user': authUser?.id === user.userId }" @click="showTeam = !showTeam">
    <div>{{ position }}.</div>
    <div>{{ user.name }}</div>
    <div class="points">
      <span>{{ user.points }}</span> pnt
    </div>
    <div class="standings-action">
      <AppTrophy v-if="user.winner" />
    </div>
    <div>
      <Icon v-if="showTeam" name="tabler:circle-chevron-down" size="24" />
      <Icon v-else name="tabler:circle-chevron-right" size="24" />
    </div>

    <div v-if="showTeam" class="selected-riders">
      <h4>Gekozen renners</h4>

      <CyclistCardSmall
        v-for="{ cyclist } in user.entries"
        :key="cyclist.id"
        :cyclist="cyclist"
        :result="cyclist.results[0]"
      />

      <!-- <p class="entry-date">
        Ingediend op {{ firstEntry(user.entries)?.toLocaleString("nl-NL", {
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) }}
      </p> -->
    </div>
  </li>
</template>

<style>
.table-row .selected-riders {
  grid-column: -1 / 1;
  padding: 1rem;
  list-style-type: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem 2rem;

  h4,
  p {
    grid-column: -1 / 1;
  }

  .entry-date {
    font-size: var(--fs-300);
    text-align: right;
  }

  @media (max-width: 90em) {
    grid-template-columns: 1fr;
  }
}

.is-user {
  font-weight: 900;
}
</style>
