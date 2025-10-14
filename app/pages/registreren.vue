<script setup lang="ts">
import type { FetchError } from "ofetch";

import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";

import { schema } from "~/lib/user-schema";
import { useAuthStore } from "~/stores/auth";

const loading = ref(false);
const submitted = ref(false);
const submitError = ref("");
const verifcationEmail = ref("");
const authStore = useAuthStore();

const { errors, handleSubmit, setErrors, defineField, resetForm } = useForm({
  validationSchema: toTypedSchema(schema),
});

const [email, emailAttrs] = defineField("email");
const [password, passwordAttrs] = defineField("password");
const [userName, userNameAttrs] = defineField("name");
const [confirm, confirmAttrs] = defineField("confirm");

const onSubmit = handleSubmit(async (values) => {
  try {
    submitError.value = "";
    loading.value = true;
    await authStore.registreren({
      email: values.email.trim(),
      password: values.password,
      userName: values.name.trim(),
    });

    submitted.value = true;
    verifcationEmail.value = values.email.trim();

    resetForm();
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

        <Verification
          v-if="authStore.showVerificationButton"
          title="Registeren gelukt!"
          message="Je hebt een email ontvangen om je account te verifiëren. Klik op link in je email om mee te kunnen doen aan RondeMaestro. Geen email ontvangen? Gebruik onderstaande knop om een nieuwe link aan te vragen."
          :email="verifcationEmail"
          role="success"
        />

        <form @submit="onSubmit">
          <div class="input-group">
            <label for="userName" class="input">Gebruikersnaam:</label>
            <input
              v-model="userName"
              v-bind="userNameAttrs"
              type="text"
              class="input__text"
              :class="{ input__error: errors.name }"
              placeholder="Naam"
              required
              name="userName"
              autocomplete="username"
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

          <button :disabled="loading" class="btn btn-primary" @click="onSubmit">
            Registeer
            <Loading v-if="loading" />
          </button>
        </form>
        <p class="small">
          Door te registeren ga je akkoord met de
          <a href="https://rondemaestro.com/privacy/" target="_blank">Privacy Policy</a>
          en de
          <a href="https://rondemaestro.com/voorwaarden/" target="_blank">Algemene voorwaarden</a>
          van RondeMaestro
        </p>
        <p>
          Al een account bij RondeMaesto? <NuxtLink to="/inloggen">
            Ga naar inloggen.
          </NuxtLink>
        </p>
      </div>
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
