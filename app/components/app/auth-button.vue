<script lang="ts" setup>
const authStore = useAuthStore();
</script>

<template>
  <div v-if="!authStore.loading && authStore.user" class="user-container">
    <div

      tabindex="0"
      class="user-name"
      role="button"
      @click="navigateTo('/gebruiker')"
    >
      <Icon name="tabler:user-check" size="24" />
      <span class="user-name__name">Hoi, {{ authStore.user.name }}</span>
    </div>
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
  // background: var(--clr-background);
  height: min-content;
  // border-radius: 1000px;

  &:hover {
    // background-color: var(--clr-primary);
    color: var(--clr-primary);
    cursor: pointer;
  }
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
