<script lang="ts" setup>
import { passwordSchema } from "~/lib/user-schema";

const changePassword = ref(false);

const { errors, handleSubmit, setErrors, defineField } = useForm({
  validationSchema: toTypedSchema(passwordSchema),
});

const [oldPassword, oldPasswordAttrs] = defineField("oldPassword");
const [password, passwordAttrs] = defineField("password");

const [confirm, confirmAttrs] = defineField("confirm");
</script>

<template>
  <div class="form-group">
    <button class="btn" :class="!changePassword ? 'btn-secondary' : 'btn-alert'" @click="changePassword = !changePassword">
      <template v-if="!changePassword">
        <Icon name="tabler:lock" />
        Wijzig wachtwoord
      </template>
      <template v-else>
        <Icon name="tabler:lock-open" />
        Annuleer
      </template>
    </button>
    <form action="">
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
