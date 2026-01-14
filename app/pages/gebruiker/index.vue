<script setup lang="ts">
import { UserAccount, UserPreferences } from "#components";

const authStore = useAuthStore();

const errorMessage = ref("");
const loading = ref(false);
</script>

<template>
  <main>
    <Loading v-if="authStore.loading || loading" />

    <div v-if="errorMessage && !authStore.loading" class="alert alert-error">
      <h2 class="text-lg">
        {{ errorMessage }}
      </h2>
    </div>
    <div v-else-if="authStore.user" class="wrapper-lg wrapper-nobg">
      <div class="user-welcome">
        <div>
          <h1>Hallo, {{ authStore.user.name }}</h1>
          <p>Beheer hier je profiel, wachtwoord en voorkeuren</p>
        </div>
        <button class="btn btn-alert" @click="authStore.uitloggen">
          <Icon name="tabler:logout" size="24" />
          Uitloggen
        </button>
      </div>

      <div class="user-dashboard">
        <div class="user-dashboard--profile">
          <div class="user-dashboard--profile__user-info">
            <Icon name="tabler:user" size="32" />
            <div>
              <h3>Profiel overzicht</h3>
              <p>Je account in één oogopslag</p>
            </div>
          </div>
          <div class="profile-list">
            <div class="profile-list--item">
              <span>Gerbruikersnaam</span>
              <p>{{ authStore.user.name }}</p>
            </div>
            <div class="profile-list--item">
              <span>Teams</span>
              <p>{{ authStore.userPoules.length }}</p>
            </div>
            <div class="profile-list--item">
              <span>Beste positie</span>
              <p>#2</p>
            </div>
            <div class="profile-list--item">
              <span>Lid sinds</span>
              <p>
                {{
                  new Date(authStore.user.createdAt).toLocaleDateString("nl-NL", {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                }}
              </p>
            </div>
          </div>
        </div>

        <div class="user-block">
          <UserAccount />
        </div>
        <div class="user-block">
          <UserPassword />
        </div>
        <div class="user-block">
          <UserPreferences />
        </div>
        <div class="user-block">
          <UserNewTeam />
        </div>

        <div class="user-block alert-error" role="alert">
          <h3>Gevarenzone</h3>
          <p>Verwijder je account, alle gegevens en resultaten zullen verwijderd worden bij RondeMaestro. Deze actie kan niet terug gedraaid worden!</p>

          <button class="btn btn-danger" @click="authStore.deleteUser">
            Verwijder account
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style>
.user-welcome {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-top: 2rem;
}
.user-dashboard {
  gap: 2rem;
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 1rem;
}

.user-dashboard--profile {
  grid-column: -1 / 1;
  background: var(--clr-primary-mute);
  border: 1px solid var(--clr-primary);
  border-radius: var(--border-radius);
  padding: 2rem;
}
.user-dashboard--profile__user-info {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;

  h3,
  p {
    margin-bottom: 0;
  }
}

.user-block {
  background: var(--clr-background-mute);
  border-radius: var(--border-radius);
  padding: 2rem;
  border: 1px solid var(--clr-background);

  &:hover,
  &:focus-within {
    border-color: var(--clr-primary);
    box-shadow: var(--box-shadow);
    transition: 500ms ease-in;
  }

  &.alert-error {
    background-color: hsl(from var(--clr-error) h 27 73);
    border-color: var(--clr-error);
    color: var(--clr-text);

    > h3 {
      color: var(--clr-error);
    }
  }
}

.user-block.alert-error {
  grid-column: -1/1;
}
</style>
