<script lang="ts" setup>
import { schema } from "~/lib/user-schema";

const changeUser = ref(false);
const changePassword = ref(false);

const loading = ref(false);
const submitted = ref(false);
const submitError = ref("");

const authStore = useAuthStore();

const { errors, handleSubmit, setErrors, defineField, setValues } = useForm({
  validationSchema: toTypedSchema(schema),
});

const [email, emailAttrs] = defineField("email");
const [oldPassword, oldPasswordAttrs] = defineField("oldPassword");
const [password, passwordAttrs] = defineField("password");
const [userName, userNameAttrs] = defineField("userName");
const [confirm, confirmAttrs] = defineField("confirm");

onMounted(() => {
  // Check if the user object exists and is not null or undefined
  if (authStore.user) {
    // Populate the form fields with user data
    setValues({
      email: authStore.user.email,
      userName: authStore.user.name,

    });
  }
});
</script>

<template>
  <section>
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

    <h2>Account gegevens</h2>
    <p>Hier kan je account gegevens inzien en wijzigen.</p>

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

      <form>
        <div class="input-group">
          <label for="userName" class="input">Gebruikersnaam:</label>
          <input
            v-model="userName"
            v-bind="userNameAttrs"
            :disabled="!changeUser"
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
          Opslaan
        </button>
      </form>
    </div>
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
  </section>
</template>

<style>
.form-group {
  margin-block: 2rem;

  .btn {
    margin-bottom: 1rem;
  }
}

.input-group > input,
select,
textarea,
fieldset {
  max-width: 40ch;
}
</style>
