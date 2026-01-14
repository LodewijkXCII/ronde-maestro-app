<script lang="ts" setup>
import type { EntryWithResult, ResultUsersByStage } from "~/types/results";

defineProps<{ userSelection: ResultUsersByStage | undefined; compareUserSelection: ResultUsersByStage | undefined; stageId: number | undefined }>();
const emit = defineEmits<{
  (e: "close"): void;
}>();

function sortEntries(entries: EntryWithResult[]): EntryWithResult[] {
  return [...entries].sort((a, b) => {
    const pointsA = a.cyclist.results[0]?.points || 0;
    const pointsB = b.cyclist.results[0]?.points || 0;
    return pointsB - pointsA;
  });
}
</script>

<template>
  <div class="team-card">
    <div class="icon-header">
      <Icon name="tabler:user" />
      <h3>Selectie vergelijken</h3>
      <div v-if="userSelection && compareUserSelection" class="close-icon" @click="emit('close')">
        <Icon name="tabler:x" size="24" class="end-icon" />
      </div>
    </div>

    <div v-if="!compareUserSelection" class="card-info">
      <Icon name="tabler:users" size="48" />
      <p>Klik op een teamlid om jullie selecties te vergelijken</p>
    </div>

    <div v-if="userSelection && compareUserSelection" class="selection-compare">
      <div>
        <h4>Jouw selectie</h4>
        <div class="selection-list">
          <CyclistCardMedium
            v-for="{ cyclist } in sortEntries(userSelection?.entries)"
            :key="cyclist.id"
            :cyclist
            no-user-select
            show-team-data
          >
            <template #actionSlot>
              <div v-if="cyclist.results[0]" class="points">
                <span>{{ cyclist.results[0]?.points }}</span> pnt
              </div>
            </template>
          </CyclistCardMedium>
        </div>
      </div>
      <div v-if="compareUserSelection.userId !== userSelection.userId">
        <h4>Selectie van {{ compareUserSelection.name }}</h4>
        <div class="selection-list">
          <CyclistCardMedium
            v-for="{ cyclist } in sortEntries(compareUserSelection?.entries)"
            :key="cyclist.id"
            :cyclist
            no-user-select
            show-team-data
          >
            <template #actionSlot>
              <div v-if="cyclist.results[0]" class="points">
                <span>{{ cyclist.results[0]?.points }}</span> pnt
              </div>
            </template>
          </CyclistCardMedium>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.selection-compare {
  display: flex;
  gap: 2rem;

  h4 {
    border-bottom: 1px solid var(--clr-primary-mute);
    padding-bottom: 0.5rem;
  }

  > * {
    flex-basis: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .selection-list {
      flex-grow: 1;
    }
  }
}

.close-icon {
  padding: 0.25rem;
  border-radius: 500px;
  margin-left: auto;
  display: flex;
  outline: 1px solid transparent;
  transition: all 0.2s;

  &:hover {
    background-color: hsl(from var(--clr-error) h s l / 40%);
    outline-color: var(--clr-error);
    color: var(--clr-error);
    cursor: pointer;
  }
}
</style>
