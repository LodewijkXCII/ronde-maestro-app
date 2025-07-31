<script lang="ts" setup>
const authStore = useAuthStore();

const loading = ref(false);
const userMenuOpen = ref(false);

onMounted(() => {
  loading.value = true;
});
</script>

<template>
  <div
    v-if="!authStore.loading && authStore.user"
    tabindex="0"
    class="btn user-name"
    :user-menu-open="userMenuOpen"
    role="button"
    @click="userMenuOpen = !userMenuOpen"
  >
    <Icon name="tabler:user-check" />
    {{ authStore.user.name }}
    <Icon name="tabler:chevron-down" class="menu-icon" />

    <div v-show="userMenuOpen" class="user-menu">
      <p class="menu-title">
        Hoi, {{ authStore.user.name }}
      </p>

      <ul>
        <li @click="authStore.uitloggen">
          Uitloggen
        </li>
      </ul>
    </div>
  </div>
  <NuxtLink
    v-else
    class="btn"
    tabindex="0"
    role="button"
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

  &:is([user-menu-open="true"]) {
    border-radius: var(--border-radius) var(--border-radius) 0 0;
    box-shadow: rgba(20, 20, 20, 0.4) 0px 0px 5px;

    .menu-icon {
      transform: rotate(-180deg);
      transition: transform 0.5s ease;
    }

    &:hover {
      outline: none;
    }
    &::after {
      content: "";
      position: absolute;
      top: 99%;
      width: 100%;
      height: 0.3rem;
      background-color: var(--clr-background);
      z-index: 7;
      left: 0;
    }
  }
}

.user-menu {
  position: absolute;
  top: 100%;
  margin-top: 0.25rem;
  min-width: 25ch;
  right: 0;
  text-align: left;
  border-radius: 0 0 var(--border-radius) var(--border-radius);
  background-color: inherit;
  padding: inherit;
  box-shadow: 0 0 5px rgba(50 50 50 / 60%);
  padding-top: 1rem;

  &:hover {
    cursor: initial;
  }

  .menu-title {
    font-size: var(--fs-500);
    margin-bottom: 0.25rem;
  }

  ul {
    list-style-type: none;
    font-weight: 400;
    padding: 0;

    li {
      padding-bottom: 5px;
      &:hover {
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }
}
</style>
