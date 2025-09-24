<script lang="ts" setup>
import { ref, watch } from "vue";

const props = withDefaults(defineProps<{
  timeout?: number;
}>(), {
  timeout: 5000,
});

const toastStore = useToastStore();

const showToast = ref(true);

const responseIcon = computed<string>(() => {
  if (toastStore.response === "warning") {
    return "tabler:alert-square-rounded";
  }
  if (toastStore.response === "error") {
    return "tabler:square-rounded-x";
  }
  if (toastStore.response === "success") {
    return "tabler:square-rounded-check";
  }
  else {
    return "tabler:info-square-rounded";
  }
});

let timeoutId: ReturnType<typeof setTimeout> | null = null;

// Use a watcher to start the timeout when the toast becomes visible
watch(() => toastStore.show, (newValue) => {
  if (newValue) {
    showToast.value = true;
    if (timeoutId)
      clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      showToast.value = false;
      toastStore.hideToast();
    }, props.timeout);
  }
  else {
    showToast.value = false;
  }
});

// Expose a function to be called from the parent component
function show() {
  showToast.value = true;
}

function removeToast() {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  toastStore.hideToast();
}

defineExpose({
  show,
});
</script>

<template>
  <Transition name="fade-slide">
    <div
      v-if="showToast && toastStore.title && toastStore.description"
      class="toast"
      :style="{ '--animation-duration': `${props.timeout}ms` }"
      :class="`toast-${toastStore.response}`"
    >
      <div class="toast-icon">
        <Icon :name="responseIcon" size="36" />
      </div>
      <div class="toast-content">
        <h4 class="toast-title">
          {{ toastStore.title }}
        </h4>
        <p class="toast-description">
          {{ toastStore.description }}
        </p>
      </div>
      <div class="close-icon" @click="removeToast">
        <Icon name="tabler:x" />
      </div>
      <span class="loading-bar" />
    </div>
  </Transition>
</template>

<style>
.toast {
  --toast-color: var(--clr-primary);
  position: fixed;
  bottom: 2rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  background: var(--clr-background-mute);
  padding: 1rem;
  border-radius: var(--border-radius);
  border: 2px solid var(--toast-color);
  box-shadow: var(--box-shadow);
  z-index: 100;
  overflow: hidden;
  width: 350px;

  .close-icon {
    position: absolute;
    top: 0.35rem;
    right: 0.35rem;
    height: 25px;
    aspect-ratio: 1/1;
    display: flex;
    place-content: center;
    place-items: center;

    &:hover {
      cursor: pointer;
      background-color: var(--clr-background-mute);
      border: 1px solid var(--toast-color);
      border-radius: 50%;
    }
  }
}

.toast-success {
  --toast-color: var(--clr-accent-green);
}
.toast-error {
  --toast-color: var(--clr-error);
}
.toast-warning {
  --toast-color: var(--clr-alert);
}

.toast-content {
  margin-bottom: 0.5rem;
  margin-right: 1rem;
}

.toast-icon {
  color: var(--toast-color);
}
.toast-title {
  color: var(--toast-color);
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.toast-description {
  font-size: 0.875rem;
  color: var(--clr-text-secondary);
  margin-bottom: 0;
}

.loading-bar {
  display: block;
  position: absolute;
  bottom: 0;
  left: 0;
  border-radius: 0 0 var(--border-radius) var(--border-radius);
  width: 100%;
  height: 7px;
  background: var(--toast-color);
  animation: loading-bar var(--animation-duration) linear forwards;
}

@keyframes loading-bar {
  0% {
    border-radius: 0 100vw 100vw 0;
  }
  to {
    width: 0%;
  }
}

.fade-slide-enter-active {
  transition: all 0 var(--animation-duration) ease-out;
}

.fade-slide-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
