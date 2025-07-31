<script lang="ts" setup>
const colorMode = useColorMode();

const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
});

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(value) {
    colorMode.preference = value ? "dark" : "light";
  },
});
</script>

<template>
  <label class="swap mx-4" aria-label="Toggle theme">
    <input v-model="isDark" type="checkbox">

    <Icon
      class="swap-icon"
      :class="{ active: isMounted && colorMode.value === 'dark' }"
      name="tabler:sun"
      size="24"
      color="currentColor"
    />
    <Icon
      class="swap-icon"
      :class="{ active: isMounted && colorMode.value === 'light' }"
      name="tabler:moon-filled"
      size="24"
      color="currentColor"
    />
  </label>
</template>

<style lang="scss">
.swap {
  position: relative;
  display: inline-grid;
  cursor: pointer;
  place-content: center;

  & input {
    appearance: none;
    border: none;
  }

  & > * {
    grid-column-start: 1;
    grid-row-start: 1;
  }
}

.swap-icon {
  font-size: 1.8rem;
  opacity: 0;
  transition-property: transform, rotate, opacity;
  transition-duration: 0.2s;
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
  transform: rotate(45deg);
  pointer-events: none;

  &:hover {
    color: var(--clr-primary);
  }
}

.swap-icon.active {
  opacity: 1;
  transform: rotate(0deg);
  pointer-events: auto;
}
</style>
