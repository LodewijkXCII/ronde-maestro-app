<script lang="ts" setup>
defineProps<{
  showNavbarContent: boolean;
}>();
const authStore = useAuthStore();
</script>

<template>
  <div v-if="!authStore.loading && authStore.user" class="user-container">
    <div

      tabindex="0"
      class="user-name"
      role="button"
    >
      <Icon name="tabler:user-check" size="24" />
      <span class="user-name__name">{{ authStore.user.name }}</span>
    </div>
    <ul v-if="showNavbarContent" class="user-nav">
      <li class="hover" @click="authStore.uitloggen">
        Uitloggen
      </li>
    </ul>
  </div>
  <NuxtLink
    v-else
    tabindex="0"
    role="button"
    class="btn btn-primary"
    :disabled="authStore.loading"
    to="/inloggen"
  >
    <Loading v-if="authStore.loading" />
    <Icon v-else name="tabler:user-x" size="24" />
    Inloggen
  </NuxtLink>
</template>

<style lang="scss">
.user-name {
  position: relative;
  display: flex;
  gap: 0.25rem;
  justify-content: center;
  padding: 0.25rem 0.5rem;
  color: var(--clr-text);
  text-decoration: none;
  background: var(--clr-background);
  height: min-content;
  border-radius: 1000px;
}

.user-nav {
  margin-top: 0.75rem;
  list-style: none;
  text-align: right;

  > *:hover {
    color: var(--clr-primary);
    cursor: pointer;
  }
}

@media screen and (max-width: 90em) {
  .user-name__name {
    display: none;
  }
  .navbar:has(.primary-navigation[data-visible="true"]) .user-name__name {
    padding: 0.25rem 0.5rem;
    display: block;
  }
}
</style>
