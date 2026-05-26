<script lang="ts" setup>
import type { FetchError } from "ofetch";

import type { CyclistWithRaceDetails } from "~/types/startlist";

const config = useRuntimeConfig();

const selectedRidersStore = useSelectedRidersStore();
const sideBarStore = useSideBarStore();
const toastStore = useToastStore();

const { currentStage } = storeToRefs(sideBarStore);
const { selectedRidersComponents } = storeToRefs(selectedRidersStore);
async function getSelectedRiders(stageId: number) {
  selectedRidersStore.clearSelection();
  selectedRidersStore.activeStageIdForFetch = stageId;
  await selectedRidersStore.refreshEntryData();
}

const loading = ref(false);
const submitted = ref(false);
const errorMessage = ref("");
const submitMessage = ref("");

const selectableRiders = computed(() => {
  return currentStage.value?.stageType?.name === "Ploegentijdrit" ? 3 : 8;
});

function addToSelection(cyclist: CyclistWithRaceDetails) {
  selectedRidersStore.handleCyclist(cyclist.id);
}

async function handleSubmit() {
  if (!currentStage.value) {
    return errorMessage.value = "Er is geen etappe ingeladen!";
  }
  // Check count
  loading.value = true;
  if (selectedRidersComponents.value.length > selectableRiders.value) {
    loading.value = false;
    return errorMessage.value = `Er zijn meer dan ${selectableRiders.value} renners geselecteerd!`;
  }

  if (stageUnderway(currentStage.value.date)) {
    loading.value = false;
    return errorMessage.value = "De rit is al onderweg. Je kan niet meer invullen.";
  }

  if (selectedRidersComponents.value.length < selectableRiders.value && selectedRidersComponents.value.length >= 1) {
    // TODO MAKE USE OF OTHER LIBARY
    // eslint-disable-next-line no-alert
    const confirm = window.confirm(`Weet je zeker dat je minder dan ${selectableRiders.value} renners wil inzetten?`);
    if (!confirm) {
      loading.value = false;

      return errorMessage.value = "Niets verstuurd";
    }
  }
  try {
    errorMessage.value = "";
    const sendBody = selectedRidersStore.selectedRiders;

    await $fetch(`${config.public.apiBase}/entries/${currentStage.value.id}`, {
      body: JSON.stringify(sendBody),
      method: "post",
      credentials: "include",
    });

    submitMessage.value = "Je team is ingevuld!";

    const toastBody: ToastBody = {
      title: "Je team is ingevuld!",
      description: "Je team is succesvol opgeslagen, veel geluk!",
      responseStatus: "success",
    };
    toastStore.showToast(toastBody);

    submitted.value = true;

    navigateTo({ name: "dashboard-etappe-overzicht" });
    // if (!sideBarStore.isClassicSeason) {
    //   navigateTo({ name: "dashboard-etappe-overzicht-race-id", params: {
    //     race: slugify(sideBarStore.currentRace?.name as string),
    //     id: sideBarStore.currentRace?.id,
    //   } });
    // }
    // else {
    // }
  }
  catch (e) {
    const error = e as FetchError;

    errorMessage.value = getFetchErrorMessage(error);
  }
  finally {
    loading.value = false;
  }
}

watch(currentStage, (newStage) => {
  if (newStage) {
    getSelectedRiders(newStage.id);
  }
}, { immediate: true });

function emptyErrorMessage() {
  errorMessage.value = "";
}

watch(() => errorMessage.value, (newMessage) => {
  if (newMessage) {
    setTimeout(emptyErrorMessage, 2000);
  }
});

onBeforeRouteLeave(() => {
  if (selectedRidersStore.formDirty && !submitted.value) {
    // eslint-disable-next-line no-alert
    const confirm = window.confirm("Weet je zeker dat je weg gaat, je team wordt niet opgeslagen.");
    if (!confirm) {
      return false;
    }

    selectedRidersStore.clearSelection();
  }
});
</script>

<template>
  <div class="selected-riders">
    <h3>Geselecteerde renners</h3>

    <p>{{ selectedRidersComponents.length }} van {{ selectableRiders }} renners geselecteerd</p>

    <AppProgressBar :selected-count="selectedRidersComponents.length" :max-select-riders="selectableRiders" />

    <div v-if="errorMessage" role="alert" class="alert alert-error">
      <Icon name="tabler:alert-square-rounded" />
      <span>
        {{ errorMessage }}
      </span>
    </div>

    <div class="selected-riders-container">
      <CyclistCardMedium
        v-for="cyclist in selectedRidersComponents"
        :key="cyclist.id"
        :cyclist="cyclist"
        :race-details="cyclist.startlistDetails"
        @click="addToSelection(cyclist)"
      >
        <template #actionSlot>
          <div class="cyclistCard--actions">
            <Icon
              name="tabler:circle-minus"
              size="24"
            />
          </div>
        </template>
      </CyclistCardMedium>
    </div>

    <div v-if="submitMessage" role="alert" class="alert alert-success">
      <Icon name="tabler:alert-square-rounded" />
      <span>
        {{ submitMessage }}
      </span>
    </div>

    <div class="btn-group">
      <button
        class="btn btn-primary btn-full-width"
        :disabled="!selectedRidersStore.formDirty
          || selectedRidersComponents.length === 0
          || selectedRidersComponents.length > selectableRiders
          || loading"
        @click="handleSubmit"
      >
        <Loading v-if="loading" />
        <Icon v-else name="tabler:send" />
        Verzenden
      </button>
      <button class="btn btn-alert btn-full-width" @click="selectedRidersStore.clearSelection">
        <Icon name="tabler:trash-x" />
        Wis selectie
      </button>
    </div>
  </div>
  <div v-if="submitMessage" role="alert" class="alert alert-success">
    <Icon name="tabler:alert-square-rounded" />
    <span>
      {{ submitMessage }}
    </span>
  </div>
</template>

<style>
/* FIX: Standardized Nesting selectors for seamless Vite compiling */
.selected-riders {
  --_padding-size: 1rem;
  padding: 1.25rem var(--_padding-size);
  border-radius: var(--border-radius);
  height: fit-content;
  background: var(--clr-background-mute);
  @media (min-width: 750px) {
    position: sticky;
    top: calc(var(--navbar-height) + 2rem);
  }

  .btn-group {
    margin-top: 1rem;
  }
}

.selected-riders .dashboard-card .selected-riders {
  background: transparent;
  padding: 0;
  position: initial;
}

.selected-riders-container {
  display: grid;
  gap: 0.5rem;
  margin-block: calc(2 * var(--_padding-size));
  position: relative;
}

.selected-riders-container::before,
.selected-riders-container::after {
  content: "";
  position: absolute;
  width: calc(100% + (2 * var(--_padding-size)));
  height: 2px;
  background-color: var(--clr-primary-mute);
  left: calc(var(--_padding-size) * -1);
}

.selected-riders-container::before {
  top: calc(var(--_padding-size) * -1);
}

.selected-riders-container::after {
  bottom: calc(var(--_padding-size) * -1);
}

.selected-riders-container > .selected:nth-of-type(n + 9) {
  background-color: var(--clr-error);
}

.selected-riders-container > .selected:nth-of-type(n + 9):hover {
  outline-color: hsl(354 51% 59% / 0.9);
}
</style>
