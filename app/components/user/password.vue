<script lang="ts" setup>
import { passwordSchema } from "~/lib/user-schema";

const authStore = useAuthStore();

const changePassword = ref(false);
const errorMessage = ref("");
const loading = ref(false);
const submitSucces = ref(false);

const { errors, handleSubmit, setErrors, defineField } = useForm({
  validationSchema: toTypedSchema(passwordSchema),
});

const [oldPassword, oldPasswordAttrs] = defineField("oldPassword");
const [password, passwordAttrs] = defineField("password");

const [confirm, confirmAttrs] = defineField("confirm");

const onSubmit = handleSubmit(async (values) => {
  errorMessage.value = "";
  loading.value = true;

  if (values.password !== values.confirm) {
    loading.value = false;
    return setErrors({ confirm: "Wachtwoorden komen niet overeen" });
  }

  const { error } = await authStore.changePassword({ currentPassword: values.oldPassword, newPassword: values.password });

  if (error) {
    loading.value = false;
    return errorMessage.value = `Er is iets fout gegaan bij het wijzigen van het wachtwoord: ${error.message}`;
  }

  loading.value = false;
  submitSucces.value = true;
  errorMessage.value = "Succesvol je wachtwoord aangepast!";
});
</script>

<template>
  <div class="form-group">
    <button
      class="btn"
      :class=" !changePassword ? 'btn-secondary' : 'btn-alert'"
      :disabled="loading"
      @click="changePassword = !changePassword"
    >
      <template v-if="!changePassword">
        <Loading v-if="loading" />
        <Icon v-else name="tabler:lock" />
        <Icon v-if="submitSucces" name="tabler:check" />
        Wijzig wachtwoord
      </template>
      <template v-else>
        <Icon name="tabler:lock-open" />
        Annuleer
      </template>
    </button>

    <div
      v-if="errorMessage"
      role="alert"
      class="alert"
      :class="{ 'alert-success': submitSucces }"
    >
      {{ errorMessage }}
    </div>

    <form @submit="onSubmit">
      <div class="input-group">
        <label for="password" class="input">Oud wachtwoord:</label>
        <input
          v-model="oldPassword"
          v-bind="oldPasswordAttrs"
          :disabled="!changePassword"
          type="password"
          class="input__text"
          :class="{ input__error: errors.password }"
          placeholder="Wachtwoord"
          name="password"
          autocomplete="current-password"
          required
        >
        <div v-if="errors?.password && changePassword" class="input-error">
          {{ errors.password }}
        </div>
      </div>
      <div class="input-group">
        <label for="password" class="input">Nieuw wachtwoord:</label>
        <input
          v-model="password"
          v-bind="passwordAttrs"
          :disabled="!changePassword"
          type="password"
          class="input__text"
          :class="{ input__error: errors.password }"
          placeholder="Wachtwoord"
          name="password"
          autocomplete="new-password"
          required
        >
        <div v-if="errors?.password && changePassword" class="input-error">
          {{ errors.password }}
        </div>
      </div>
      <div class="input-group">
        <label for="confirm" class="input">Bevestig nieuw wachtwoord:</label>
        <input
          v-model="confirm"
          v-bind="confirmAttrs"
          :disabled="!changePassword"
          type="password"
          class="input__text"
          :class="{ input__error: errors.confirm }"
          placeholder="Wachtwoord"
          name="confirm"
          autocomplete="new-password"
          required
        >
        <div v-if="errors?.confirm && changePassword" class="input-error">
          {{ errors.confirm }}
        </div>
      </div>
      <button class="btn btn-primary" :disabled="!changePassword">
        Opslaan
      </button>
    </form>
  </div>
</template>
