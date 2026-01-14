<script lang="ts" setup>
import type { ClassicsRaces, Stage } from "~/types/race";

const props = defineProps<{
  stages?: Stage[];
  classics?: ClassicsRaces | null;
}>();

// Emit the ID to the parent component when it changes
const emit = defineEmits(["update:stageId"]);

const selectedStageId = ref<number>();

const completedStages = computed<{ id: number; label: string }[]>(() => {
  if (props.classics) {
    return (props.classics.races || [])
      .filter(race => race.stages[0]?.done && typeof race.stages[0].id === "number") // Only races that are 'done'
      .map(race => ({
        id: race.stages[0]?.id as number, // The stageId of the first (and usually only) stage
        label: race.name,
      }));
  }

  // Scenario B: Grand Tour (Stages)
  return (props.stages || [])
    .filter(stage => stage.done)
    .map(stage => ({
      id: stage.id,
      label: `Etappe ${stage.stageNr}: ${stage.startCity} - ${stage.finishCity}`,
    }));
});
const isFirst = computed(() => selectedStageId.value === completedStages.value[0]?.id);
const isLast = computed(() => selectedStageId.value === completedStages.value[completedStages.value.length - 1]?.id);

function changeSelectedStage(selector: number) {
  const currentStageIndex = completedStages.value.findIndex(stage => stage.id === selectedStageId.value);
  const newStageIndex = completedStages.value[currentStageIndex + selector];

  if (newStageIndex) {
    selectedStageId.value = newStageIndex.id;
  }
}

watch(completedStages, (newOptions) => {
  if (newOptions && newOptions.length > 0 && !selectedStageId.value) {
    const lastId = newOptions.findLast(s => s)?.id;
    if (lastId !== undefined) {
      selectedStageId.value = lastId;
    }
  }
}, { immediate: true });

watch(selectedStageId, (newId) => {
  emit("update:stageId", newId);
});

onMounted(() => {
  emit("update:stageId", selectedStageId.value);
});
</script>

<template>
  <div class="select-buttons">
    <button
      class="select-button select-button-left"
      :disabled="isFirst"
      @click="changeSelectedStage(-1)"
    >
      <Icon name="tabler:chevron-left" size="24" />
    </button>
    <select v-model="selectedStageId">
      <option
        v-for="option in completedStages"
        :key="option.id"
        :value="option.id"
      >
        {{ option.label }}
      </option>
    </select>
    <button
      class="select-button select-button-right"
      :disabled="isLast"
      @click="changeSelectedStage(1)"
    >
      <Icon name="tabler:chevron-right" size="24" />
    </button>
  </div>
</template>

<style>
.select-buttons {
  margin-block: 0.5rem;
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
  border: 1px solid var(--clr-primary);
  border-radius: var(--border-radius);
  font-size: var(--fs-300);

  .select-button {
    display: flex;
    place-items: center;
    background: var(--clr-primary-mute);
    padding: 0.5rem;
    margin: 0;
    border: none;
    transition: background 0.2s;

    &:hover {
      cursor: pointer;
      background-color: var(--clr-primary);
    }

    &:disabled {
      cursor: not-allowed;
      filter: grayscale(100%);
      pointer-events: none;
      opacity: 0.5;
    }
  }

  select {
    margin: 0;
    border-radius: 0;
    border: none;
  }
}
</style>
