<script setup lang="ts">
import type { Team } from "~/types/common";
import type { CyclistWithRaceDetails } from "~/types/startlist";

const props = defineProps<{
  team: Team;
  cyclists: CyclistWithRaceDetails[];
  isAllTeamsShown: boolean;
}>();
const emit = defineEmits(["toggleTeamState"]);

const selectedRidersStore = useSelectedRidersStore();

const config = useRuntimeConfig();

const currentTeam = computed(() => {
  if (props.team) {
    return props.team;
  }
  return null;
});

const showTeam = ref(false);

const isActive = computed(() => {
  return props.isAllTeamsShown || showTeam.value;
});

function toggleTeam() {
  if (props.isAllTeamsShown) {
    emit("toggleTeamState");
  }
  showTeam.value = !showTeam.value;
}

function addToSelection(cyclist: CyclistWithRaceDetails) {
  selectedRidersStore.handleCyclist(cyclist.id);
}
</script>

<template>
  <div v-if="!currentTeam" role="alert" class="alert alert-error">
    <Icon name="tabler:alert-square-rounded" />
    <span>
      Er is geen team gevonden!
    </span>
  </div>
  <div v-else>
    <div class="team-info" :class="{ active: isActive }" @click="toggleTeam">
      <div class="team-info--info">
        <div class="avatar">
          <img v-if="currentTeam.image !== '/'" :src="`${config.public.s3BucketURL}/${currentTeam.image}`" :alt="currentTeam.name">
        </div>

        <h4>{{ currentTeam.name }}</h4>
      </div>
      <div class="team-info--action">
        <Icon v-if="showTeam" name="tabler:circle-chevron-down" size="24" />
        <Icon v-else name="tabler:circle-chevron-right" size="24" />
      </div>
    </div>
    <div v-if="isActive">
      <CyclistCardMedium
        v-for="cyclist in cyclists"
        :key="cyclist.id"
        :cyclist="cyclist"
        :race-details="cyclist.startlistDetails"
        show-specialies

        @click="addToSelection(cyclist)"
      >
        <template #actionSlot>
          <div class="cyclistCard--actions">
            <Icon
              v-if="riderSelected(cyclist.id)"
              name="tabler:circle-minus"
              size="24"
              style="color: var(--clr-alert)"
            />
            <Icon
              v-else
              name="tabler:circle-plus"
              size="24"
              style="color: var(--clr-accent-green)"
            />
          </div>
        </template>
      </CyclistCardMedium>
    </div>
  </div>
</template>

<style lang="scss">
.team-info {
  background: var(--clr-primary);
  color: var(--clr-text-white);
  user-select: none;
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  place-items: center;
  margin-bottom: 0.25rem;

  &--info {
    display: flex;
    gap: 0.5rem;
    place-items: center;
  }

  &:hover,
  &:focus-visible,
  &:focus-within {
    cursor: pointer;
  }

  .avatar {
    --_avatar-width: 50px;
  }

  &.active {
    outline: 2px solid var(--clr-primary);
    background: var(--clr-primary-dark);
  }
}
</style>
