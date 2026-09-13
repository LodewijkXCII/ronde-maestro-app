<script lang="ts" setup>
import type { FetchError } from "ofetch";

import type { AccountSchema } from "~/lib/user-schema";

import { accountSchema } from "~/lib/user-schema";

const authStore = useAuthStore();

const config = useRuntimeConfig();

const loading = ref(false);
const submitted = ref(false);
const submitError = ref("");
const submitText = ref("Opslaan");

const { errors, handleSubmit, setErrors, defineField, meta } = useForm({
  validationSchema: toTypedSchema(accountSchema),
  initialValues: {
    email: "nieuw@voorbeeld.nl",
    name: authStore.user.name,
  },
});

const [email, emailAttrs] = defineField("email");
const [name, nameAttrs] = defineField("name");

const onSubmit = handleSubmit(async (values) => {
  try {
    submitError.value = "";
    loading.value = true;

    const sendBody: AccountSchema = values;

    if (values.email === meta.value.initialValues?.email) {
      sendBody.email = authStore.user.email;
    }

    const res = await $fetch<AccountSchema>(`${config.public.apiBase}/users/${authStore.user.id}`, {
      method: "put",
      body: JSON.stringify(sendBody),
      credentials: "include",
    });

    if (res.email !== values.email) {
      submitError.value = "Er is iets mis gegaan";
    }
    else {
      submitText.value = "Opgeslagen!";
      authStore.init();
    }

    submitted.value = true;
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
  <div v-if="authStore.errorMessage" role="alert" class="alert alert-error">
    <Icon name="tabler:alert-square-rounded" />
    <span>
      {{ authStore.errorMessage }}
    </span>
  </div>

  <div class="icon-header">
    <Icon name="tabler:user" />
    <h3>Persoonlijke gegevens</h3>
  </div>
  <p>Bewerk je gebruikersnaam en e-mailadres</p>

  <div class="form-group">
    <form @submit="onSubmit">
      <div class="input-group">
        <label for="userName" class="input">Gebruikersnaam:</label>
        <input
          v-model="name"
          v-bind="nameAttrs"
          type="text"
          class="input__text"
          :class="{ input__error: errors.name }"
          placeholder="Naam"
          required
          name="name"
        >
        <div v-if="errors?.name" class="input-error">
          {{ errors.name }}
        </div>
      </div>
      <div class="input-group">
        <label for="email" class="input">Huidig e-mailadres:</label>

        <p class="input__text-email">
          {{ authStore.user.email }}
        </p>
      </div>
      <div class="input-group">
        <label for="email" class="input">Nieuw e-mailadres:</label>
        <input
          v-model="email"
          v-bind="emailAttrs"

          type="email"
          class="input__text"
          :class="{ input__error: errors.email }"
          required
          name="email"
        >
        <div v-if="errors?.email" class="input-error">
          {{ errors.email }}
        </div>
      </div>

      <button class="btn btn-primary" :disabled="!meta.dirty">
        {{ submitText }}
      </button>
    </form>
  </div>
</template>

<style>
.form-group {
  margin-block: 2rem;

  .btn {
    margin-bottom: 1rem;
  }
}

.input-group > input:has(form),
select,
textarea {
  max-width: 40ch;
}

.input__text-email {
  padding: 0.5rem;
  background: var(--clr-primary-mute);
  border-radius: var(--border-radius);
  border-bottom: 3px solid var(--clr-primary);
  margin: 0.5rem 0;
}
</style>
