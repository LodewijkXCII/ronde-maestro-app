<script setup lang="ts">
import type { FetchError } from "ofetch";

import type { AccountSchema } from "~/lib/user-schema";

import { accountSchema } from "~/lib/user-schema";

const config = useRuntimeConfig();

const changeUser = ref(false);

const loading = ref(false);
const submitted = ref(false);
const submitError = ref("");
const submitText = ref("Opslaan");

const authStore = useAuthStore();

const { errors, handleSubmit, setErrors, defineField, setValues } = useForm({
  validationSchema: toTypedSchema(accountSchema),
});

const [email, emailAttrs] = defineField("email");
const [name, nameAttrs] = defineField("name");

const onSubmit = handleSubmit(async (values) => {
  try {
    submitError.value = "";
    loading.value = true;

    const sendBody: AccountSchema = values;

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

onMounted(() => {
  if (authStore.user) {
    setValues({
      email: authStore.user.email,
      name: authStore.user.name,
    });
  }
});
</script>

<template>
  <div class="form-group">
    <button class="btn" :class="!changeUser ? 'btn-secondary' : 'btn-alert'" @click="changeUser = !changeUser">
      <template v-if="!changeUser">
        <Icon name="tabler:lock" />
        Wijzig account gegevens
      </template>
      <template v-else>
        <Icon name="tabler:lock-open" />
        Annuleer
      </template>
    </button>

    <form @submit="onSubmit">
      <div class="input-group">
        <label for="userName" class="input">Gebruikersnaam:</label>
        <input
          v-model="name"
          v-bind="nameAttrs"
          :disabled="!changeUser"
          type="text"
          class="input__text"
          :class="{ input__error: errors.name }"
          placeholder="Naam"
          required
          name="name"
          autocomplete="name"
        >
        <div v-if="errors?.name" class="input-error">
          {{ errors.name }}
        </div>
      </div>
      <div class="input-group">
        <label for="email" class="input">Email:</label>
        <input
          v-model="email"
          v-bind="emailAttrs"
          :disabled="!changeUser"

          type="email"
          class="input__text"
          :class="{ input__error: errors.email }"
          placeholder="Email"
          required
          name="email"
          autocomplete="email"
        >
        <div v-if="errors?.email" class="input-error">
          {{ errors.email }}
        </div>
      </div>
      <button class="btn btn-primary" :disabled="!changeUser">
        {{ submitText }}
      </button>
    </form>
  </div>
</template>
