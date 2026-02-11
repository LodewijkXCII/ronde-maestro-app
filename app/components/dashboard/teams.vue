<script lang="ts" setup>
const authStore = useAuthStore();
const { userPoules } = storeToRefs(authStore);
</script>

<template>
  <div class="dashboard-card dashboard-teams">
    <div class="icon-header">
      <Icon name="tabler:users-group" />
      <h3>Jouw ploegen</h3>

      <div class="badge">
        {{ userPoules.length }} ploegen
      </div>
    </div>

    <div v-if="userPoules.length === 0">
      Je bent nog niet lid van een ploeg. Maak een ploeg aan of meld je aan in een van de bestaande ploegen
    </div>

    <div v-else class="team-cards">
      <div v-for="team in userPoules" :key="team.id" class="team-card">
        <div class="team-card--title">
          <h4>{{ team.name }}</h4>
          <div class="badge">
            {{ team.users.length }} {{ team.users.length > 1 ? 'deelnemers' : 'deelnemer' }}
          </div>
        </div>
        <div class="team-card--body" />

        <NuxtLink
          role="button"
          :to="{
            name: 'dashboard-ploegenspel-ploeg-id',
            params: {
              ploeg: slugify(team.name),
              id: team.id,
            },
          }"
          class="btn btn-primary btn-full-width"
        >
          Bekijk ploeg
          <Icon name="tabler:arrow-right" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.dashboard-teams {
  margin-top: 2rem;

  .badge {
    margin-left: auto;
  }
}

.team-cards {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding: 1rem 0;
  margin: 1rem 0;

  .team-card {
    background: var(--clr-primary-mute);
    border-radius: var(--border-radius);
    border: 1px solid var(--clr-primary);
    width: 300px;
    padding: 1rem;
    scroll-snap-align: start;

    &:hover {
      box-shadow: 0px 0 28px -7px var(--clr-secondary);
    }

    &--title {
      display: flex;
      gap: 1rem;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;
      font-size: var(--fs-500);
    }
  }
}
</style>
