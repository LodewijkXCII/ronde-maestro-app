<script lang="ts" setup>
import type { FetchError } from "ofetch";

import type { UserPref } from "~/lib/user-schema";

import { userPrefSchema } from "~/lib/user-schema";

const config = useRuntimeConfig();

const authStore = useAuthStore();
const toastStore = useToastStore();

const submitError = ref("");
const loading = ref(false);
const submitted = ref(false);

const { meta, errors, handleSubmit, setErrors, defineField, setValues } = useForm({
  validationSchema: toTypedSchema(userPrefSchema),
});

// Define fields for each radio button group
const [startlist, startlistAttrs] = defineField("startlistNotif");
const [result, resultAttrs] = defineField("resultNotif");
const [reminder, reminderAttrs] = defineField("reminderNotif");

const onSubmit = handleSubmit(async (values) => {
  try {
    submitError.value = "";
    loading.value = true;

    const sendBody: UserPref = values;

    const reponse = await $fetch<UserPref>(`${config.public.apiBase}/users/preferences/${authStore.user.id}`, {
      method: "put",
      body: JSON.stringify(sendBody),
      credentials: "include",
    });

    if (!reponse) {
      submitError.value = "Er is iest mis gegaan";
    }

    const toastBody: ToastBody = {
      title: "Voorkeuren opgeslagen",
      description: "Je voorkeuren zijn succesvol opgeslagen",
      responseStatus: "success",
    };
    toastStore.showToast(toastBody);
    submitted.value = true;

    localStorage.setItem("userPrefs", JSON.stringify({ updated: true, needsUpdate: false, ...sendBody }));
  }
  catch (e: any) {
    const error = e as FetchError;

    if (error.data?.data) {
      setErrors(error.data?.data);
    }
    submitError.value = getFetchErrorMessage(error);
  }
  finally {
    loading.value = false;
  }
});

onMounted(async () => {
  if (authStore.user) {
    loading.value = true;
  }

  const userData = await authStore.getUserPreference(authStore.user.id);

  if (userData) {
    setValues(userData);
  }

  loading.value = false;
});
</script>

<template>
  <section>
    <div v-if="submitError" role="alert" class="alert alert-error">
      <Icon name="tabler:alert-square-rounded" />
      <span>
        {{ submitError }}
      </span>
    </div>
    <div v-if="authStore.errorMessage" role="alert" class="alert alert-error">
      <Icon name="tabler:alert-square-rounded" />
      <span>
        {{ authStore.errorMessage }}
      </span>
    </div>

    <div class="icon-header">
      <Icon name="tabler:bell-ringing" />
      <h3>Account voorkeuren</h3>
    </div>
    <p>
      Hier kan je account gegevens inzien en wijzigen. Voor de beste ervaring is het verstanding om de onderstaande notificaties aan te zetten.
    </p>

    <form @submit="onSubmit">
      <!-- Startlijst -->
      <fieldset>
        <legend>Startlijst bekend</legend>
        <p class="subtle">
          Voor elke klassieker en elke grote ronde komt er één melding van een complete startlijst.
        </p>
        <div v-if="errors?.startlistNotif" class="input-error">
          {{ errors.startlistNotif }}
        </div>
        <div class="input-group">
          <input
            id="startlist-email"

            v-model="startlist"
            type="radio"
            value="email"
            name="startlistNotif"
            v-bind="startlistAttrs"
            required
          >
          <label for="startlist-email">Email notificatie</label>
        </div>

        <!-- <div class="input-group">
          <input
            id="startlist-push"

            v-model="startlist"
            type="radio"
            name="startlistNotif"
            v-bind="startlistAttrs"
            value="Push"
            required
          >
          <label for="startlist-push">Push notificatie</label>
        </div>
        <div class="input-group">
          <input
            id="startlist-email-push"

            v-model="startlist"
            type="radio"
            name="startlistNotif"
            v-bind="startlistAttrs"
            value="Email and push"
            required
          >
          <label for="startlist-email-push">Email en push notificatie</label>
        </div> -->
        <div class="input-group">
          <input
            id="startlist-none"

            v-model="startlist"
            type="radio"
            name="startlistNotif"
            v-bind="startlistAttrs"
            value="none"
            required
          >
          <label for="startlist-none">Geen notificatie</label>
        </div>
        <span class="error-message" aria-live="polite" />
      </fieldset>

      <!-- Uitslag -->
      <fieldset>
        <legend>Uitslag bekend</legend>
        <p class="subtle">
          Na elke race of etappe komt er een melding van de uitslag.
        </p>
        <div v-if="errors?.resultNotif" class="input-error">
          {{ errors.resultNotif }}
        </div>
        <div class="input-group">
          <input
            id="result-email"
            v-model="result"
            type="radio"
            name="resultNotif"
            v-bind="resultAttrs"
            value="email"
            required
          >
          <label for="result-email">Email notificatie</label>
        </div>

        <!-- <div class="input-group">
          <input
            id="result-push"
            v-model="result"
            type="radio"
            name="resultNotif"
            v-bind="resultAttrs"
            value="Push"
            required
          >
          <label for="result-push">Push notificatie</label>
        </div>
        <div class="input-group">
          <input
            id="result-email-push"
            v-model="result"
            type="radio"
            name="resultNotif"
            v-bind="resultAttrs"
            value="Email and push"
            required
          >
          <label for="result-email-push">Email en push notificatie</label>
        </div> -->
        <div class="input-group">
          <input
            id="result-none"
            v-model="result"
            type="radio"
            name="resultNotif"
            v-bind="resultAttrs"
            value="none"
            required
          >
          <label for="result-none">Geen notificatie</label>
        </div>
        <span class="error-message" aria-live="polite" />
      </fieldset>
      <!-- Herinnering -->
      <fieldset>
        <legend>Team herrinnering</legend>
        <p class="subtle">
          Elke ochtend om 09:00u komt er een herrinnering wanneer je nog geen team hebt ingevuld.
        </p>
        <div v-if="errors?.reminderNotif" class="input-error">
          {{ errors.reminderNotif }}
        </div>
        <div class="input-group">
          <input
            id="reminder-email"
            v-model="reminder"
            type="radio"
            name="reminderNotif"
            v-bind="reminderAttrs"
            value="email"
            required
          >
          <label for="reminder-email">Email notificatie</label>
        </div>

        <!-- <div class="input-group">
          <input
            id="reminder-push"
            v-model="reminder"
            type="radio"
            name="reminderNotif"
            v-bind="reminderAttrs"
            value="Push"
            required
          >
          <label for="reminder-push">Push notificatie</label>
        </div>
        <div class="input-group">
          <input
            id="reminder-email-push"
            v-model="reminder"
            type="radio"
            name="reminderNotif"
            v-bind="reminderAttrs"
            value="Email and push"
            required
          >
          <label for="reminder-email-push">Email en push notificatie</label>
        </div> -->
        <div class="input-group">
          <input
            id="reminder-none"
            v-model="reminder"
            type="radio"
            name="reminderNotif"
            v-bind="reminderAttrs"
            value="none"
            required
          >
          <label for="reminder-none">Geen notificatie</label>
        </div>
        <span class="error-message" aria-live="polite" />
      </fieldset>

      <button class="btn btn-primary" :disabled="!meta.touched">
        Opslaan
      </button>
    </form>
  </section>
</template>
