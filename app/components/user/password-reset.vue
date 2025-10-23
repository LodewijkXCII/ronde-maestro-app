<script setup lang="ts">
import type { FetchError } from "ofetch";

import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import * as z from "zod";

import getFetchErrorMessage from "~/utils/get-fetch-error-message";

const schema = z.object({
  email: z.string().email("Onjuist emailadres").nonempty(),

});

const loading = ref(false);
const submitted = ref(false);
const submitError = ref("");

const authStore = useAuthStore();

const { errors, handleSubmit, setErrors, defineField } = useForm({
  validationSchema: toTypedSchema(schema),
});

const [email, emailAttrs] = defineField("email");

const onSubmit = handleSubmit(async (values) => {
  try {
    submitError.value = "";
    loading.value = true;

    await authStore.resetPasswordRequest(values.email);

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
  <div>
    <h2>Wachtwoord vergeten?</h2>

    <p v-if="submitted">
      Als er een account bestaat met het ingevulde e-mailadres, is er een e-mail verzonden met instructies om je wachtwoord opnieuw in te stellen.
    </p>
    <p v-else>
      Vul je e-mailadres in en we sturen je een link om je wachtwoord opnieuw in te stellen.
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

    <form>
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

      <div class="btn-group">
        <button :disabled="loading" class="btn btn-primary" @click="onSubmit">
          <Icon v-if="submitted" name="tabler:check" />
          Reset wachtwoord
          <Loading v-if="loading" />
        </button>
      </div>
    </form>
  </div>
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
