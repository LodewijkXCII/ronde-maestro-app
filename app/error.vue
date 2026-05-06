<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps({
  error: Object as () => NuxtError,
});

const router = useRouter();

const handleError = () => clearError({ redirect: "/" });
function handleReverse() {
  clearError();
  router.back();
}
</script>

<template>
  <div class="wrapper wrapper-nobg">
    <div class="card error-card">
      <div class="card-image">
        <Icon name="tabler:bike-off" size="60" />
      </div>
      <h1>{{ error?.status }}</h1>
      <h2>Je bent het peloton kwijt geraakt!</h2>

      <p>Dit is de foutmelding: {{ error?.statusText }}</p>
      <div class="btn-group">
        <button class="btn btn-primary" @click="handleError">
          Startpagina <Icon name="tabler:home" />
        </button>
        <button class="btn" @click="handleReverse">
          Ga terug <Icon name="tabler:arrow-back-up" />
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.error-card {
  display: grid;
  gap: 0.5rem;
  place-items: center;

  padding: 4rem;
  width: min(80ch, 80%);
  height: fit-content;

  text-align: center;

  h1 {
    font-size: 78px;
    margin-bottom: 0.05em;
  }

  .btn-group {
    justify-content: center;
  }

  .card-image {
    --_image-size: 75px;
    --_image-bg-color: hsl(from var(--clr-error) h s l / 25%);
    --_image-color: var(--clr-error);
  }
}

.wrapper:has(.error-card) {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
</style>
