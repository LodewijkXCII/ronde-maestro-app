<script lang="ts" setup>
import type { FetchError } from "ofetch";

import type { GetEntry } from "~/types/entries";

const config = useRuntimeConfig();
const errorMessage = ref("");
const loading = ref(false);
const userEntries = ref<GetEntry[] | []>([]);

const sideBarStore = useSideBarStore();
const { upComingStage } = storeToRefs(sideBarStore);

async function getRaceData() {
  if (!upComingStage.value) {
    return errorMessage.value = "Er is geen aankomende etappe.";
  }

  try {
    errorMessage.value = "";
    loading.value = true;

    const data = await $fetch<GetEntry[]>(`${config.public.apiBase}/entries/${upComingStage.value.id}`, {
      method: "get",
      credentials: "include",
    });

    userEntries.value = data as GetEntry[];
  }

  catch (e) {
    const error = e as FetchError;
    errorMessage.value = getFetchErrorMessage(error);
  }
  finally {
    loading.value = false;
  }
}

onMounted(async () => {
  if (!sideBarStore.upcomingRace) {
    await sideBarStore.refreshUpcomingRace();
  }

  getRaceData();
});
</script>

<template>
  <main>
    <div class="wrapper">
      <h1>Dashboard</h1>

      <section v-if="upComingStage">
        <div v-if="errorMessage" role="alert" class="alert alert-error">
          <Icon name="tabler:alert-square-rounded" />
          <span>
            {{ errorMessage }}
          </span>
        </div>

        <h4>Jouw selectie voor etappe {{ upComingStage.stageNr }}:</h4>
        <p>{{ upComingStage.startCity }} - {{ upComingStage.finishCity }}</p>

        <div class="selected-stage">
          <CyclistCardLarge
            v-for="{ cyclist } in userEntries"
            :key="cyclist.id"
            :cyclist

            show-team-data
          />
        </div>
      </section>
    </div>
  </main>
</template>

<style>
.selected-stage {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(auto, 150px));
  place-content: center;
  gap: 1rem;
}
</style>
