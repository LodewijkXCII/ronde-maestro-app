<script setup lang="ts">
import type { Team } from "~/types/common";
import type { CyclistWithRaceDetails } from "~/types/startlist";

const props = defineProps<{
  team: Team;
  cyclists: CyclistWithRaceDetails[];
  isAllTeamsShown: boolean;
}>();

defineEmits(["toggleTeamState"]);

const selectedRidersStore = useSelectedRidersStore();
const sideBarStore = useSideBarStore();
const { currentStage } = storeToRefs(sideBarStore);

const config = useRuntimeConfig();

const currentTeam = computed(() => {
  if (props.team) {
    return props.team;
  }
  return null;
});

const tttCyclist = computed<CyclistWithRaceDetails | null | undefined>(() => {
  if (currentStage.value?.stageType.name === "Ploegentijdrit" && props.cyclists && props.cyclists.length > 0) {
    const firstActiveCyclist = props.cyclists.find(cyclist => cyclist.startlistDetails.withdraw === false);

    return firstActiveCyclist;
  }
  return null;
});

const cyclistsToShow = computed<CyclistWithRaceDetails[]>(() => {
  if (tttCyclist.value) {
    // If it's a TTT stage, return a single-item array with the TTT cyclist
    return [tttCyclist.value];
  }
  // Otherwise, return the full array of cyclists
  return props.cyclists;
});

// const showTeam = ref(false);

// const isActive = computed(() => {
//   return props.isAllTeamsShown || showTeam.value;
// });

// function toggleTeam() {
//   if (props.isAllTeamsShown) {
//     emit("toggleTeamState");
//   }
//   showTeam.value = !showTeam.value;
// }

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

  <details v-else class="team-selection">
    <summary class="team-info">
      <div class="team-info--info">
        <div class="avatar">
          <img v-if="currentTeam.image !== '/' || !currentTeam.image" :src="`${config.public.s3BucketURL}/${currentTeam.image}`" :alt="currentTeam.name">
        </div>

        <h4>{{ currentTeam.name }}</h4>
      </div>
      <div class="team-info--action">
        <Icon name="tabler:circle-chevron-right" size="24" />
      </div>
    </summary>
    <div class="team-selection--active">
      <div class="animation-wrapper">
        <CyclistCardMedium
          v-for="cyclist in cyclistsToShow"
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
                style="color: var(--clr-error)"
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
  </details>
</template>

<style lang="scss">
.team-selection {
  background: var(--clr-background-mute);
  height: fit-content;
  border-radius: var(--border-radius);
  overflow: hidden; /* Ensures the border-radius clips the sliding content */
}

.team-info--action .iconify {
  transition: transform 0.3s ease-in-out;
}

.team-selection[open] {
  box-shadow: var(--box-shadow);
  outline: 1px solid var(--clr-primary);

  .team-info--action .iconify {
    transform: rotate(90deg);
  }

  .team-selection--active {
    grid-template-rows: 1fr;
    padding: 0.5rem; /* Only show padding when open to prevent "jump" */

    .animation-wrapper {
      opacity: 1;
    }
  }
}

.team-selection--active {
  display: grid;
  grid-template-rows: 0fr; /* Start collapsed */
  transition:
    grid-template-rows 0.4s ease-out,
    padding 0.4s ease;
  overflow: hidden;
  padding: 0 0.5rem; /* Collapsed padding */

  .animation-wrapper {
    min-height: 0;
    opacity: 0;
    transition: opacity 0.3s ease;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
}

.team-info {
  background: var(--clr-primary);
  color: var(--clr-text-white);
  user-select: none;
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  place-items: center;
  padding: 0.75rem;

  &--info {
    display: flex;
    gap: 0.5rem;
    place-items: center;
  }

  &:hover,
  &:focus-visible,
  &:focus-within {
    cursor: pointer;
    filter: brightness(1.1);
  }

  .avatar {
    --_avatar-width: 50px;
  }

  // &:has(.team-selection[open]) {
  //   border: 2px solid var(--clr-primary);
  //   border-bottom: 0;
  //   background: var(--clr-primary-dark);
  //   color: var(--clr-text);
  //   border-radius: var(--border-radius) var(--border-radius) 0 0;
  // }
}

.cyclistCard:not(.selected) {
  background-color: var(--clr-background-app);
}
</style>
