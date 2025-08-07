<script setup lang="ts">
const selectedRidersStore = useSelectedRidersStore();

function backToTop() {
  globalThis.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}

const showIcon = ref(false);

function showIconEvent() {
  if (window.pageYOffset >= 100) {
    return showIcon.value = true;
  }

  return showIcon.value = false;
}
;

const countRiders = computed(() => {
  if (selectedRidersStore.selectedRiders.length > 8) {
    return "alert-bg";
  }
  return null;
});

onMounted(() => {
  window.addEventListener("scroll", showIconEvent);
});

onUnmounted(() => {
  window.removeEventListener("scroll", showIconEvent);
});
</script>

<template>
  <div
    v-if="showIcon"
    class="overlay-button"
    :class="countRiders"
    @click="backToTop"
  >
    <span v-show="selectedRidersStore.selectedRiders.length >= 1">
      {{ selectedRidersStore.selectedRiders.length }} / 8 geslecteerd
    </span>
    <Icon name="tabler:chevrons-up" size="24" />
  </div>
</template>

<style lang="scss">
.overlay-button {
  position: fixed;
  bottom: 3rem;
  right: 3rem;
  background: var(--clr-secondary);
  border-radius: 999px;
  padding: 1rem;
  font-weight: 800;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
  }
}

@media (min-width: 20em) and (max-width: 30em) {
  .overlay-button {
    right: 0.75rem;
  }
}

.top-icon {
  display: flex;
  aspect-ratio: 1;
}

.alert-bg {
  background: var(--clr-alert);
  font-weight: 900;
}

.danger-bg {
  background: var(--clr-accent);
  font-weight: 900;
}
</style>
