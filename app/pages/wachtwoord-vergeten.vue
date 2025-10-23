<script setup lang="ts">
import type { FetchError } from "ofetch";

import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import * as z from "zod";

import getFetchErrorMessage from "~/utils/get-fetch-error-message";

const schema = z.object({
  password: z.string().nonempty().min(8, "Het wachtwoord moet uit minimaal 8 karakters bestaan."),
});

const loading = ref(false);
const submitted = ref(false);
const submitError = ref("");
const token = ref("");

const authStore = useAuthStore();
const route = useRoute();

const { errors, handleSubmit, setErrors, defineField } = useForm({
  validationSchema: toTypedSchema(schema),
});

const [password, passwordAttrs] = defineField("password");

const onSubmit = handleSubmit(async (values) => {
  try {
    submitError.value = "";
    loading.value = true;

    const { data } = await authStore.resetPassword(values.password, token.value);

    if (data && data.status === true) {
      navigateTo("/inloggen");
    }

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
onMounted(() => {
  if (!route.query.token) {
    submitError.value = "Er is geen token gevonden. Probeer het opnieuw.";
  }
  else {
    token.value = route.query.token as string || "";
  }
});
</script>

<template>
  <main>
    <div class="wrapper">
      <div class="login-form">
        <h2>Wachtwoord vergeten?</h2>

        <p>
          Vul hieronder je nieuwe wachtwoord in.
        </p>

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
          :title="authStore.errorMessage"
          role="alert"
          message="Je hebt een email ontvangen om je account te verifiëren. Klik op link in je email om mee te kunnen doen aan RondeMaestro. Geen email ontvangen? Gebruik onderstaande knop om een nieuwe link aan te vragen."
        />

        <form>
          <div class="input-group">
            <label for="password" class="input">Nieuw wachtwoord:</label>
            <input
              v-model="password"
              v-bind="passwordAttrs"
              :disabled="!token"
              type="password"
              class="input__text"
              :class="{ input__error: errors.password }"
              placeholder="Wachtwoord"
              name="password"
              autocomplete="new-password"
              required
            >
            <div v-if="errors?.password" class="input-error">
              {{ errors.password }}
            </div>
          </div>

          <div class="btn-group">
            <button :disabled="loading" class="btn btn-primary" @click="onSubmit">
              Update wachwoord
              <Loading v-if="loading" />
            </button>
          </div>
        </form>
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
