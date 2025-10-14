<script setup lang="ts">
import type { FetchError } from "ofetch";

import * as z from "zod";

const props = defineProps<{
  title: string;
  role: "alert" | "warning" | "success";
  message: string;
  email?: string;
}>();

const colorStyle = computed(() => {
  if (props.role === "alert") {
    return "--_accent-color: var(--clr-alert);";
  }
  else if (props.role === "success") {
    return "--_accent-color: var(--clr-accent-green);";
  }
  else {
    return "--_accent-color: var(--clr-error);";
  }
},
);

const authStore = useAuthStore();
const { errors, handleSubmit, setErrors, defineField } = useForm({
  validationSchema: toTypedSchema(z.object({
    email: z.string().email("Onjuist emailadres").nonempty(),
  })),
});

const [email, emailAttrs] = defineField("email");

if (props.email) {
  email.value = props.email;
}
const loading = ref(false);
const submitted = ref(false);

const sendNewLink = ref(false);
const errorMessage = ref("");
const submitError = ref("");

const onSubmit = handleSubmit(async (values) => {
  if (!values.email) {
    return errorMessage.value = "Er is geen email ingevuld!";
  }

  try {
    submitError.value = "";
    loading.value = true;
    await authStore.resendVerification(
      values.email.trim(),

    );

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
  <div class="verification-wrapper" :style="colorStyle">
    <h4>{{ props.title }}</h4>
    <p>{{ props.message }}</p>

    <div class="btn btn-outline" role="button" @click="sendNewLink = !sendNewLink">
      Nieuwe link aanvragen
    </div>

    <div v-if="sendNewLink" class="verification-form">
      <p>Vul hier onder je email adres in van het account waarmee je bent geregisteerd. Wanneer deze juist is, zal je de email ontvangen.</p>
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
        <button :disabled="loading" class="btn btn-primary">
          Verstuur
          <Loading v-if="loading" />
        </button>
        <div v-if="errorMessage" role="alert" class="alert alert-error">
          <Icon name="tabler:alert-square-rounded" />
          <span>
            {{ errorMessage }}
          </span>
        </div>
        <div v-if="submitError" role="alert" class="alert alert-error">
          <Icon name="tabler:alert-square-rounded" />
          <span>
            {{ submitError }}
          </span>
        </div>
      </form>
    </div>
  </div>
</template>

<style>
.verification-wrapper {
  padding: 0.75rem;
  background: hsl(from var(--_accent-color) h s l / 0.25);
  border: 2px solid var(--_accent-color);
  border-radius: var(--border-radius);

  &:has(.verification-form) {
    --_accent-color: var(--clr-alert);
  }
}
</style>
