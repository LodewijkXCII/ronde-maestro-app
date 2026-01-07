<script lang="ts" setup>
import { passwordSchema } from "~/lib/user-schema";

const authStore = useAuthStore();

const changePassword = ref(false);
const errorMessage = ref("");
const loading = ref(false);
const submitSucces = ref(false);

const { errors, handleSubmit, setErrors, defineField, meta } = useForm({
  validationSchema: toTypedSchema(passwordSchema),
  initialValues: {
    oldPassword: "",
    password: "",
    confirm: "",
  },
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
  <div v-if="authStore.errorMessage" role="alert" class="alert alert-error">
    <Icon name="tabler:alert-square-rounded" />
    <span>
      {{ authStore.errorMessage }}
    </span>
  </div>

  <div
    v-if="errorMessage"
    role="alert"
    class="alert"
    :class="{ 'alert-success': submitSucces }"
  >
    {{ errorMessage }}
  </div>

  <div class="icon-header">
    <Icon name="tabler:lock-password" />
    <h3>Wachtwoord</h3>
  </div>
  <p>Wijzig je wachtwoord</p>

  <div class="form-group">
    <form @submit="onSubmit">
      <div class="input-group">
        <label for="password" class="input">Huidig wachtwoord:</label>
        <input
          v-model="oldPassword"
          v-bind="oldPasswordAttrs"

          type="password"
          class="input__text"
          :class="{ input__error: errors.password }"

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

          type="password"
          class="input__text"
          :class="{ input__error: errors.password }"

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

          type="password"
          class="input__text"
          :class="{ input__error: errors.confirm }"

          name="confirm"
          autocomplete="new-password"
          required
        >
        <div v-if="errors?.confirm && changePassword" class="input-error">
          {{ errors.confirm }}
        </div>
      </div>

      <button class="btn btn-primary" :disabled="!meta.valid">
        Opslaan
      </button>
    </form>
  </div>
</template>
