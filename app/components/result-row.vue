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
    </div>
  </li>
</template>

<style lang="scss">
.table-row .selected-riders {
  grid-column: -1 / 1;
  padding: 0;
  list-style-type: none;

  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  h4 {
    grid-column: -1 / 1;
  }
}
.is-user {
  font-weight: 900;
}

@media screen and (max-width: 90em) {
  .table-row .selected-riders {
    grid-template-columns: 1fr;
  }
}
</style>
