<script setup lang="ts">
defineProps<{
  victoryCount?: number;
}>();
</script>

<template>
  <div class="victories">
    <div v-if="victoryCount" class="badge">
      {{ victoryCount }}
    </div>
    <Icon name="tabler:trophy" size="24" />
  </div>
</template>

<style>
.victories {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 40px;
  aspect-ratio: 1/1;
  position: relative;
  border: 1px solid gold;
  background: hsl(51 100% 40% / 0.5);
  border-radius: 50%;

  .badge {
    background: var(--clr-secondary);
    border-radius: 50%;
    width: 25px;
    text-align: center;
    aspect-ratio: 1/1;
    padding: 0.15rem;
    margin: 0;
    line-height: 1;
    position: absolute;
    top: -25%;
    right: -25%;
    color: var(--clr-text-black);
    vertical-align: text-bottom;
    justify-content: center;
    font-weight: 900;
    font-size: var(--fs-300);
  }

  span {
    position: absolute;
    color: gold;
  }
}
</style>
