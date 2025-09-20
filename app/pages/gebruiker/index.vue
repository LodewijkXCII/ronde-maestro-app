<script setup lang="ts">
import type { Component } from "vue";

import { UserAccount, UserPreferences } from "#components";
import { slugify } from "#imports";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const activeComponent = ref<Component>(UserAccount);
const errorMessage = ref("");
const loading = ref(false);

const menuItems = ref([
  { name: "Account gegevens", slug: slugify("Account gegevens"), component: UserAccount },
  { name: "Voorkeuren", slug: slugify("Voorkeuren"), component: UserPreferences },
]);

function changeComponent(componentName: Component) {
  activeComponent.value = componentName;

  const queryString = menuItems.value.find(comp => comp.component === componentName);
  if (queryString) {
    router.push({ query: { component: queryString.slug } });
  }
}

onMounted(() => {
  if (route.query && menuItems.value.some(item => item.slug === route.query.component)) {
    const queryComponent = menuItems.value.find(comp => comp.slug === route.query.component);
    if (queryComponent) {
      changeComponent(queryComponent?.component);
    }
  }
});
</script>

<template>
  <main>
    <Loading v-if="authStore.loading || loading" />

    <div v-if="errorMessage && !authStore.loading" class="alert alert-error">
      <h2 class="text-lg">
        {{ errorMessage }}
      </h2>
    </div>
    <div v-else-if="authStore.user" class="wrapper">
      <h1>Hallo, {{ authStore.user.name }}</h1>

      <div class="user-dashboard">
        <aside>
          <h3>Overzicht</h3>
          <ul>
            <li
              v-for="item in menuItems"
              :key="item.component.toString()"
              :class="{ active: activeComponent === item.component }"
              @click="changeComponent(item.component)"
            >
              {{ item.name }}
            </li>
            <li @click="authStore.uitloggen()">
              Uitloggen
            </li>
          </ul>
        </aside>

        <component :is="activeComponent" />
      </div>
    </div>
  </main>
</template>

<style>
.user-dashboard {
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 2rem;
  margin-top: 2rem;
}

aside ul {
  padding-right: 1rem;
  margin-top: 1rem;

  li {
    padding-block: 0.75rem;
    padding-left: 0.5rem;

    &:hover {
      background: var(--clr-primary-mute);
      cursor: pointer;
    }

    &.active {
      font-weight: 800;
      border-left: 2px solid var(--clr-primary);
      padding-left: 1rem;
    }
  }
}
</style>
