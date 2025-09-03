<script setup lang="ts">
import type { FetchError } from "ofetch";

import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import * as z from "zod";

import getFetchErrorMessage from "~/utils/get-fetch-error-message";

const schema = z.object({
  email: z.string().email("Onjuist emailadres").nonempty(),
  password: z.string().nonempty(),
});

const loading = ref(false);
const submitted = ref(false);
const submitError = ref("");

const authStore = useAuthStore();

const { errors, handleSubmit, setErrors, defineField } = useForm({
  validationSchema: toTypedSchema(schema),
});

const [email, emailAttrs] = defineField("email");
const [password, passwordAttrs] = defineField("password");

const onSubmit = handleSubmit(async (values) => {
  try {
    submitError.value = "";
    loading.value = true;
    await authStore.inloggen({
      email: values.email,
      password: values.password,
    });

    submitted.value = true;
  }
  catch (e) {
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
</script>

<template>
  <main>
    <div class="wrapper">
      <div class="login-form">
        <h2>Inloggen</h2>

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
        <form @submit="onSubmit">
          <div class="input-group">
            <label for="email" class="input">Email:</label>
            <input
              v-model="email"
              v-bind="emailAttrs"
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
          <div class="input-group">
            <label for="password" class="input">Wachtwoord:</label>
            <input
              v-model="password"
              v-bind="passwordAttrs"
              type="password"
              class="input__text"
              :class="{ input__error: errors.password }"
              placeholder="Wachtwoord"
              name="password"
              autocomplete="current-password"
            >
            <div v-if="errors?.password" class="input-error">
              {{ errors.password }}
            </div>
          </div>
          <button :disabled="loading" class="btn btn-primary" @click="onSubmit">
            Login
            <Loading v-if="loading" />
          </button>
        </form>

        <p>
          Nog geen account bij RondeMaestro? <NuxtLink to="/registreren">
            Registeer je dan snel!
          </Nuxtlink>
        </p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.login-form {
  max-width: 45ch;
  margin: auto;

  & > * + * {
    margin-bottom: 1em;
  }
}
</style>
