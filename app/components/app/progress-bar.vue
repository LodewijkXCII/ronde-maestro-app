<script lang="ts" setup>
// Assuming these are passed as props or defined in your state
const props = defineProps<{
  selectedCount: number;
  maxSelectRiders: number;
}>();

const totalCount = 8;

// Calculate percentage: (current / total) * 100
const progressPercentage = computed(() => {
  return (props.selectedCount / totalCount) * 100;
});
</script>

<template>
  <div class="progress-container">
    <div class="bar-background">
      <div class="bar-fill" :class="{ 'bar-error': selectedCount > maxSelectRiders }" :style="{ width: `${progressPercentage}%` }" />
    </div>
  </div>
</template>

<style scoped>
/* The grey/teal background track */
.bar-background {
  width: 100%;
  height: 8px;
  background-color: var(--clr-secondary); /* The light teal color */
  border-radius: var(--border-radius);
  overflow: hidden;
}

/* The dark blue/grey moving part */
.bar-fill {
  height: 100%;
  background-color: var(--clr-primary); /* The darker blue-grey color */
  transition: width 0.3s ease; /* Makes the bar move smoothly */
  border-radius: 10px;
}
.bar-error {
  background-color: var(--clr-error);
}
</style>
