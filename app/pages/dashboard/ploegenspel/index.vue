<script lang="ts" setup>
const loading = ref(false);
const errorMessage = ref("");
</script>

<template>
  <main>
    <Loading v-if="loading" />
    <div v-else class="wrapper-lg wrapper-nobg">
      <div v-if="errorMessage" role="alert" class="alert alert-warning">
        <Icon name="tabler:alert-square-rounded" />
        <span>
          {{ errorMessage }}
        </span>
      </div>
      <div class="poule-container--header">
        <h2>Ploegenspel</h2>
        <p>Bekijk alle teams, maak teams aan en lees hoe het ploegenspel werkt.</p>
      </div>

      <div class="poule-container">
        <div class="poule-card">
          <div class="icon-header">
            <Icon name="tabler:list-numbers" />
            <h3>
              Ploegen klassement
            </h3>
          </div>
        </div>
        <aside>
          <div class="poule-card">
            <div class="icon-header">
              <Icon name="tabler:question-circle" />
              <h4>Spelregels</h4>
            </div>
          </div>
          <div class="poule-card">
            <PoulesOverview />
          </div>
          <div class="poule-card">
            <UserNewTeam />
          </div>
        </aside>
      </div>
    </div>
  </main>
</template>

<style>
.poule-container {
  display: grid;
  grid-template-columns: 1fr minmax(auto, 444px);
  gap: 1rem;

  .poule-card {
    height: fit-content;
  }

  aside {
    display: grid;
    gap: 1rem;
  }
}
</style>
