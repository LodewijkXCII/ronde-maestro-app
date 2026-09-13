<script setup lang="ts">
import type { FetchError } from "ofetch";

import type { UserPoule } from "~/types/teams";

const props = defineProps<{ poule: UserPoule }>();
const config = useRuntimeConfig();
const toastStore = useToastStore();

const userId = ref<string>(useAuthStore().user?.id);
const loading = ref(false);
const submitError = ref("");

const userIsInPoule = computed(() => {
  return !!props.poule.users.find(user => user.user.id === userId.value);
});

const userIsAdmin = computed(() => {
  return props.poule.adminUserId === userId.value;
});

async function addUserToPoule() {
  if (userIsInPoule.value || userIsAdmin.value) {
    return;
  }

  try {
    submitError.value = "";
    loading.value = true;

    await $fetch(`${config.public.apiBase}/poules/${props.poule.id}/user`, {
      method: "post",
      credentials: "include",
    });

    const toastBody: ToastBody = {
      title: `Je bent ingeschreven bij ${props.poule.name}`,
      description: "Bekijk hier je nieuwe ploeg",
      responseStatus: "success",
    };
    toastStore.showToast({ ...toastBody, linkText: "Bekijk je ploeg", link: `/poule/${props.poule.id}` });
  }
  catch (e: any) {
    const error = e as FetchError;

    submitError.value = getFetchErrorMessage(error);
  }
  finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="team-list--item" :class="{ 'has-user': userIsInPoule }" @click="addUserToPoule">
    {{ poule.name }}
    <button v-if="!userIsInPoule && !userIsAdmin" class="btn btn-link">
      Inschrijven
    </button>
    <div v-else class="icon-list">
      <Icon v-if="userIsInPoule && !userIsAdmin" name="tabler:circle-check" />
      <Icon v-if="userIsAdmin" name="tabler:shield" />
    </div>
  </div>
</template>

<style>
.team-list--item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background: var(--clr-primary-mute);
  border-radius: var(--border-radius);

  &:not(.has-user):hover {
    cursor: pointer;
    background-color: var(--clr-primary-dark);
    outline: 1px solid var(--clr-primary);
  }

  .icon-list {
    display: flex;
    gap: 0.25rem;
    align-items: center;
  }
}
</style>
