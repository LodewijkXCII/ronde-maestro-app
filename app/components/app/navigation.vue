<script lang="ts" setup>
defineProps<{
  currentRoute: string;
}>();
const router = useRouter();

const sideBarStore = useSideBarStore();
const { currentRace } = storeToRefs(sideBarStore);

// const currentRoute = computed<string | null>(() => {
//   if (!route.name && !currentRace.value && !currentRace) {
//     return null;
//   }
//   if (route.name?.includes("klassement")) {
//     return "Klassement";
//   }
//   if (route.name?.includes("uitslagen")) {
//     return `Uitslag etappe ${route.params.nr}`;
//   }
//   if (route.name?.includes("selecteer")) {
//     return `Selectie etappe ${route.params.nr}`;
//   }

//   //   if (route.name?.includes("klassement")) {

//   //     return {
//   //       name: "dashboard-race-id-klassement",
//   //       params: {
//   //         race: slugify(currentRace.value.name),
//   //         id: currentRace.value?.id,
//   //       },
//   //       label: "Klassement",
//   //     };
//   //   }
//   //   if (route.name?.includes("uitslagen")) {
//   //     return {
//   //       name: "dashboard-race-id-uitslagen-nr",
//   //       params: {
//   //         race: slugify(currentRace.value.name),
//   //         id: currentRace.value?.id,
//   //         nr: route.params.nr,
//   //       },
//   //       label: `Uitlag etappe ${route.params.nr}`,
//   //     };
//   //   }
//   //   if (route.name?.includes("selecteer")) {
//   //     return {
//   //       name: "dashboard-race-id-selecteer-nr",
//   //       params: {
//   //         race: slugify(currentRace.value.name),
//   //         id: currentRace.value?.id,
//   //         nr: route.params.nr,
//   //       },
//   //       label: `Selectie etappe ${route.params.nr}`,
//   //     };
//   //   }
//   return null;
// });
</script>

<template>
  <div class="breadcrumbs">
    <ul class="breadcrumb-list">
      <li>
        <NuxtLink to="/dashboard">
          Dashboard
        </NuxtLink>
      </li>
      <li v-if="currentRace">
        <NuxtLink
          :to="{
            name: 'dashboard-etappe-overzicht-race-id',
            params: {
              race: slugify(currentRace.name),
              id: currentRace.id,
            },
          }"
        >
          {{ currentRace.name }}
        </NuxtLink>
      </li>
      <li v-if="currentRoute">
        {{ currentRoute }}
      </li>
    </ul>

    <button
      class="btn btn-outline"
      @click="router.back()"
    >
      <Icon name="tabler:arrow-left" size="18" />
      Terug
    </button>
  </div>
</template>

<style>
.breadcrumbs {
  background-color: var(--clr-background-mute);
  border-radius: var(--border-radius);
  padding: 1rem;
  margin-bottom: 1em;
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
}

/* Style the list */
ul.breadcrumb-list {
  list-style: none;
}

/* Display list items side by side */
ul.breadcrumb-list li {
  display: inline;
  font-size: 18px;
}

/* Add a slash symbol (/) before/behind each list item */
ul.breadcrumb-list li + li:before {
  padding: 8px;
  color: var(--clr-text);
  content: "/\00a0";
}

/* Add a color to all links inside the list */
ul.breadcrumb-list li a {
  color: #0275d8;
  text-decoration: none;
}

/* Add a color on mouse-over */
ul.breadcrumb-list li a:hover {
  color: #01447e;
  text-decoration: underline;
}
</style>
