<script lang="ts" setup>
const authStore = useAuthStore();
</script>

<template>
  <section>
    <div v-if="authStore.errorMessage" role="alert" class="alert alert-error">
      <Icon name="tabler:alert-square-rounded" />
      <span>
        {{ authStore.errorMessage }}
      </span>
    </div>

    <h2>Account gegevens</h2>
    <p>Hier kan je account gegevens inzien en wijzigen.</p>

    <UserInfo />

    <UserPassword />
  </section>
</template>

<style>
.form-group {
  margin-block: 2rem;

  .btn {
    margin-bottom: 1rem;
  }
}

.input-group > input:has(form),
select,
textarea,
fieldset {
  max-width: 40ch;
}
</style>
