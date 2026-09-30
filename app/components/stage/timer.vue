<script setup lang="ts">
import VueCountdown from "@chenfengyuan/vue-countdown";

const props = defineProps<{
  stageDate: string;
  stageId: number;
}>();

const timeRemaining = computed(() => {
  const targetDate = new Date(props.stageDate); // Ensure it's a Date object
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  return diff > 0 ? diff : 0; // Ensure time is not negative
});

function transformSlotProps(props: { days: number; hours: number; minutes: number; seconds: number; [key: string]: number }) {
  const formattedProps: { [key: string]: string } = {}; // Use a type for clarity

  Object.entries(props).forEach(([key, value]) => {
    // Check for days, hours, minutes, seconds, etc.
    // If the value is less than 10, prepend a '0'
    formattedProps[key] = value < 10 && key !== "milliseconds" && value >= 0 ? `0${value}` : String(value);
  });

  return formattedProps;
}
</script>

<template>
  <section class="stage-box stage-timer" :class="{ 'stage-timer--finished': timeRemaining === 0 }">
    <h3 class="strong stage-box--title">
      Etappe sluit over:
    </h3>

    <div v-if="timeRemaining === 0">
      De etappe is onderweg maar de uitslag nog niet bekend, je kan niet meer invullen. Veel kijk plezier!
    </div>

    <VueCountdown
      v-slot="{ days, hours, minutes, seconds }"
      :time="timeRemaining"
      :interval="1000"
      :transform="transformSlotProps"
      class="counter stage-box--body"
    >
      <div class="counter-days">
        <span>
          <h3>{{ days }}</h3>
        </span>
        <p v-if="days > 1 || days === 0">
          dagen
        </p>
        <p v-else>
          dag
        </p>
      </div>
      <div class="counter-hours">
        <span>
          <h3>{{ hours }}</h3>
        </span>
        <p>uur</p>
      </div>
      <div class="counter-minutes">
        <span>
          <h3>{{ minutes }}</h3>
        </span>
        <p>minuten</p>
      </div>
      <div class="counter-seconds">
        <span>
          <h3>{{ seconds }}</h3>
        </span>
        <p>seconden</p>
      </div>
    </VueCountdown>
  </section>
</template>

<style>
.stage-timer {
  padding: 1rem;

  .counter {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    text-align: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;

    span {
      background: var(--clr-background);
      display: block;
      margin-top: 0.5rem;
      margin-bottom: 0.2rem;
      padding: 1rem 0.5rem;
      color: var(--clr-primary);
      border-radius: var(--border-radius);
    }

    h3 {
      margin-bottom: 0;
    }
  }
}
.stage-timer--finished {
  outline: 2px solid var(--clr-error);
  .counter {
    span {
      color: var(--clr-error);
    }
  }
}
</style>
