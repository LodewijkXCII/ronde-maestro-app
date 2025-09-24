<script lang="ts" setup>
import type { ClassicsRaces, SelectRaceWithRelations } from "~/types/race";

const props = defineProps<{
  grandTour?: SelectRaceWithRelations;
  classicsRaces?: ClassicsRaces;
  compLocation: "overzicht" | "uitslag";
}>();

const emit = defineEmits<{
  onClosed: [];
}>();

const race = computed(() => {
  if (props.grandTour) {
    return props.grandTour;
  }
  if (props.classicsRaces) {
    return props.classicsRaces;
  }
  return undefined;
});

const sideBarStore = useSideBarStore();

function onClose() {
  emit("onClosed");
}
</script>

<template>
  <details v-if="race" class="race-list__race">
    <summary>
      {{ race.name }}
    </summary>
    <NuxtLink
      v-if="!sideBarStore.isClassicSeason && grandTour && 'id' in race"
      :to="{
        name: 'dashboard-etappe-overzicht-race-id',
        params: {
          race: slugify(race.name),
          id: race.id,
        },
      }"
      @click="onClose"
    >
      Alle etappes
      <!-- <img v-if="race.image" :src="`${config.public.s3BucketURL}/${race.image}`" :alt="race.name"> -->
    </NuxtLink>
    <ul>
      <li v-for="stage in sideBarStore.allStages" :key="stage.id" class="stage-nav">
        <NuxtLink
          v-if="stage.done && compLocation === 'overzicht'"
          :to="{
            name: 'dashboard-race-id-uitslagen-nr',
            params:
              {
                race: slugify(getRaceName(stage.raceId)),
                id: stage.raceId,
                nr: stage.stageNr,
              },

          }"

          @click="onClose"
        >
          <template v-if="!sideBarStore.isClassicSeason">
            <span>{{ stage.stageNr }}.</span> {{ stage.startCity }} - {{
              stage.finishCity }}
          </template>
          <template v-else>
            <span>{{ new Date(stage.date).toLocaleDateString("nl-NL", {
              day: '2-digit',
              month: 'short',
            }) }}</span>
            {{ getRaceName(stage.raceId) }}
          </template>
          <Icon size="18" name="tabler:trophy" style="color:var(--clr-accent-green)" />
        </NuxtLink>
        <NuxtLink
          v-if="stage.done && compLocation === 'uitslag'"
          :to="{
            name: 'dashboard-race-id-uitslagen-nr',
            params:
              {
                race: slugify(race.name),
                id: stage.raceId,
                nr: stage.stageNr,
              },

          }"
          class=""
          @click="onClose"
        >
          <template v-if="!sideBarStore.isClassicSeason">
            <span>{{ stage.stageNr }}.</span> {{ stage.startCity }} - {{
              stage.finishCity }}
          </template>
          <template v-else>
            <span>{{ new Date(stage.date).toLocaleDateString("nl-NL", {
              day: '2-digit',
              month: 'short',
            }) }}</span>
            {{ getRaceName(stage.raceId) }}
          </template>
        </NuxtLink>
        <NuxtLink
          v-else-if="!stage.done && stageUnderway(stage.date) && compLocation === 'overzicht'"
          :to="{
            name: 'dashboard',
          }"
          @click="onClose"
        >
          <template v-if="!sideBarStore.isClassicSeason">
            <span>{{ stage.stageNr }}.</span> {{ stage.startCity }} - {{
              stage.finishCity }}
          </template>
          <template v-else>
            <span>{{ new Date(stage.date).toLocaleDateString("nl-NL", {
              day: '2-digit',
              month: 'short',
            }) }}</span>
            {{ getRaceName(stage.raceId) }}
          </template>
          <Icon size="18" name="tabler:pencil-off" style="color:var(--clr-alert)" />
        </NuxtLink>
        <NuxtLink
          v-else-if="!stage.done && compLocation === 'overzicht'"
          :to="{
            name: 'dashboard-race-id-selecteer-nr',
            params:
              {
                race: slugify(getRaceName(stage.raceId)),
                id: stage.raceId,
                nr: stage.stageNr,
              },
          }"
          @click="onClose"
        >
          <template v-if="!sideBarStore.isClassicSeason">
            <span>{{ stage.stageNr }}.</span> {{ stage.startCity }} - {{
              stage.finishCity }}
          </template>
          <template v-else>
            <span>{{ new Date(stage.date).toLocaleDateString("nl-NL", {
              day: '2-digit',
              month: 'short',
            }) }}</span>
            {{ getRaceName(stage.raceId) }}
          </template>
          <Icon size="18" name="tabler:pencil" style="color:var(--clr-primary)" />
        </NuxtLink>
      </li>
    </ul>
  </details>
</template>
