<script lang="ts" setup>
import type { FetchError } from "ofetch";

import type { TeamSchema } from "~/lib/team-schema";
import type { ReturnNewTeam } from "~/types/teams";

import { teamSchema } from "~/lib/team-schema";

const config = useRuntimeConfig();
const toastStore = useToastStore();

const loading = ref(false);
const submitted = ref(false);
const submitError = ref("");
const submitText = ref("Aanmaken");

const { errors, handleSubmit, setErrors, defineField, meta } = useForm({
  validationSchema: toTypedSchema(teamSchema),
  initialValues: {
    open: true,
  },
});

const [name, nameAttrs] = defineField("name");
const [password, passwordAttrs] = defineField("password");
const [open, openAttrs] = defineField("open");

const onSubmit = handleSubmit(async (values) => {
  try {
    submitError.value = "";
    loading.value = true;

    const sendBody: TeamSchema = values;

    const { insertedPouleId } = await $fetch<ReturnNewTeam>(`${config.public.apiBase}/poules`, {
      method: "post",
      body: JSON.stringify(sendBody),
      credentials: "include",
    });

    submitText.value = "Aangemaakt!";
    submitted.value = true;

    const toastBody: ToastBody = {
      title: "Je ploeg is aangemaakt",
      description: "Bekijk hier je nieuwe ploeg",
      responseStatus: "success",
    };
    toastStore.showToast({ ...toastBody, linkText: "Bekijk je ploeg", link: `/poule/${insertedPouleId.id}` });
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
    submitText.value = "Opslaan";
  }
});
</script>

<template>
  <div class="icon-header">
    <Icon name="tabler:users" />
    <h3>Nieuwe ploeg starten</h3>
  </div>
  <p>Om goed tegen je vrienden te kunnen spelen.</p>

  <div class="form-group">
    <form @submit="onSubmit">
      <div class="input-group">
        <label for="name" class="input">Ploegnaam:</label>
        <input
          v-model="name"
          v-bind="nameAttrs"
          type="text"
          class="input__text"
          :class="{ input__error: errors.name }"
          placeholder="RondeMaestro"
          required
          name="name"
          autocomplete="name"
        >
        <div v-if="errors?.name" class="input-error">
          {{ errors.name }}
        </div>
      </div>
      <div class="input-group">
        <input
          v-model="open"
          v-bind="openAttrs"
          type="checkbox"
          :class="{ input__error: errors.open }"
          required
          name="open"
        >
        <label for="open" class="input">Publiekelijk</label>
        <p>Mag iedereen bij deze ploeg of niet?</p>
        <div v-if="errors?.open" class="input-error">
          {{ errors.open }}
        </div>
      </div>

      <div v-if="!open" class="input-group">
        <label for="password" class="input">Wachtwoord:</label>
        <input
          v-model="password"
          v-bind="passwordAttrs"
          type="password"
          class="input__text"
          :class="{ input__error: errors.password }"
          required
          name="password"
        >
        <div v-if="errors?.password" class="input-error">
          {{ errors.password }}
        </div>
      </div>

      <button class="btn btn-primary" :disabled="!meta.dirty && !meta.valid">
        {{ submitText }}
      </button>
    </form>
  </div>
</template>
