<script setup lang="ts">
import type { FetchError } from "ofetch";

import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import * as z from "zod";

import { useAuthStore } from "~/stores/auth";

const schema = z.object({
  email: z.string().email("Onjuist emailadres").nonempty(),
  password: z.string().nonempty().min(8, "Het wachtwoord moet uit minimaal 8 karakters bestaan."),
  confirm: z.string().nonempty(),
  userName: z.string().nonempty({ message: "Naam mag niet leeg zijn." }),
}).refine(data => data.password === data.confirm, {
  message: "Wachtwoord is niet gelijk.",
  path: ["confirm"],
}); ;

const loading = ref(false);
const submitted = ref(false);
const submitError = ref("");

const authStore = useAuthStore();

const { errors, handleSubmit, setErrors, defineField } = useForm({
  validationSchema: toTypedSchema(schema),
});

const [email, emailAttrs] = defineField("email");
const [password, passwordAttrs] = defineField("password");
const [userName, userNameAttrs] = defineField("userName");
const [confirm, confirmAttrs] = defineField("confirm");

const onSubmit = handleSubmit(async (values) => {
  try {
    submitError.value = "";
    loading.value = true;
    authStore.registreren({
      email: values.email.trim(),
      password: values.password,
      userName: values.userName.trim(),
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
  <main class="wrapper">
    <div class="register-form">
      <h2>Registeren voor RondeMaestro</h2>

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
          <label for="userName" class="input">Gebruikersnaam:</label>
          <input
            v-model="userName"
            v-bind="userNameAttrs"
            type="text"
            class="input__text"
            :class="{ input__error: errors.userName }"
            placeholder="Naam"
            required
            name="userName"
            autocomplete="username"
          >
          <div v-if="errors?.userName" class="input-error">
            {{ errors.userName }}
          </div>
        </div>
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
        <div class="input-group">
          <label for="confirm" class="input">Bevestig wachtwoord:</label>
          <input
            v-model="confirm"
            v-bind="confirmAttrs"
            type="password"
            class="input__text"
            :class="{ input__error: errors.confirm }"
            placeholder="Wachtwoord"
            name="confirm"
            autocomplete="new-password"
          >
          <div v-if="errors?.confirm" class="input-error">
            {{ errors.confirm }}
          </div>
        </div>
        <p class="small">
          Door te registeren ga je akkoord met de
          <a href="https://rondemaestro.com/privacy/" target="_blank">Privacy Policy</a>
          en de
          <a href="https://rondemaestro.com/voorwaarden/" target="_blank">Algemene voorwaarden</a>
          van RondeMaestro
        </p>
        <button :disabled="loading" class="btn btn-primary" @click="onSubmit">
          Registeer
          <Loading v-if="loading" />
        </button>
      </form>

      <p>
        Al een account bij RondeMaesto? <NuxtLink to="/inloggen">
          Ga naar inloggen.
        </NuxtLink>
      </p>
    </div>
  </main>
</template>

<style scoped>
.register-form {
  max-width: 45ch;
  margin: auto;

  & > * + * {
    margin-bottom: 1em;
  }
}
</style>
