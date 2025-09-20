<script setup lang="ts">
import { NuxtLink } from "#components";

const authStore = useAuthStore();

onMounted(() => {
  if (authStore.user && authStore.session) {
    navigateTo("/dashboard");
  }
});
</script>

<template>
  <main>
    <section class="hero">
      <div class="hero-wrapper">
        <div class="hero-text">
          <h1 class="title">
            Welkom bij RondeMaestro
          </h1>
          <p class="subtitle">
            Hét wielerspel waarbij je dagelijks dezelfde kansen hebt!
          </p>

          <button class="btn btn-primary">
            <NuxtLink v-if="!authStore.user" to="/registreren">
              Inschrijven
            </NuxtLink>
            <NuxtLink v-else to="/dashboard">
              Naar dashboard
            </NuxtLink>
          </button>
        </div>
        <div class="hero-image">
          <picture>
            <img src="/img/homepage-screen.jpg" alt="Homepage RondeMaestro">
          </picture>
        </div>
      </div>
    </section>
    <div class="text-block">
      <h2>Wat is RondeMaestro?</h2>
      <div class="two-cols">
        <picture>
          <img src="/img/cyclists.svg" alt="wielrenners">
        </picture>
        <div>
          <p>
            RondeMaestro vindt dat de standaard Tourpoules leuker kunnen. En beter. Daarom mag je bij RondeMaestro elke dag
            een nieuwe ploeg van acht renners aanmaken! Het grote voordeel: mocht je er vandaag goed naast zitten, dan heb je
            morgen weer een nieuwe kans een gooi te doen naar de eeuwige roem!
          </p>
          <p>
            Het werkt heel simpel. Voor elke wedstrijd - of dat nu een klassieker of grote ronde is - selecteer je acht renner
            waarvan jij denkt dat ze hoog in de uitslag eindigen. En voor elke van die renners die zich in de top 15 weet te
            fietsen krijg je punten. Zo simpel is dat!
          </p>
          <p>
            Laat zien dat jij met jouw koersinzicht in die ploegleiderswagen thuis hoort en
            <NuxtLink to="/registreren">
              meld je aan voor RondeMaestro!
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
    <div class="text-block">
      <h2>Wat maakt RondeMaestro anders?</h2>

      <div class="usp-list">
        <div class="usp-card">
          <div class="card-image">
            <img src="/img/trophy.svg" alt="Trofee icon">
          </div>
          <div class="card-body">
            <h3>Dagelijks dezelfde kansen</h3>
            <p>
              Zat je er gisteren naast? Geen zorgen! Vandaag krijg je weer de kans om een gooi te doen naar eeuwige roem. Ga niet bij de pakken neerzitten en selecteer opnieuw acht renners. Bij RondeMaestro krijg je elke dag een nieuwe kans!
            </p>
          </div>
        </div>
        <div class="usp-card">
          <div class="card-image">
            <img src="/img/plan-list.svg" alt="Clipboard icon">
          </div>
          <div class="card-body">
            <h3>Duidelijke puntentelling</h3>
            <p>
              Bij RondeMaestro hoef je geen kopman te selecteren of rekening te houden met klassementsleiders. Ons puntensysteem is eenvoudig: de eerste 15 renners over de streep krijgen punten. That&#39;s it. Zo blijft het spel eerlijk, overzichtelijk en puur koersplezier!
            </p>
          </div>
        </div>
        <div class="usp-card">
          <div class="card-image">
            <img src="/img/wallet.svg" alt="Wallet icon">
          </div>
          <div class="card-body">
            <h3>Geen gedoe met budget</h3>
            <p>
              Bij RondeMaestro hoef je geen renners te laten schieten vanwege budget. Elke dag kun je elke renner selecteren, zonder beperkingen. Zo maak je altijd de beste keuzes en geniet je volop van het spel!
            </p>
          </div>
        </div>
        <div class="usp-card">
          <div class="card-image">
            <img src="/img/money.svg" alt="Money icon">
          </div>
          <div class="card-body">
            <h3>Geen verplichte inleg</h3>
            <p>
              Wil je een poultje tussen vrienden of op het werk? Dat kan bij RondeMaestro! Geen verplichte inleg, gewoon meedoen en plezier maken. Creëer je eigen competitie en laat zien wie de beste ploegleider is!
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="text-block text-center">
      <h2>Waar wacht je nog op?</h2>
      <button class="btn btn-primary">
        <NuxtLink v-if="!authStore.user" to="/registreren">
          Inschrijven
        </NuxtLink>
        <NuxtLink v-else to="/dashboard">
          Naar dashboard
        </NuxtLink>
      </button>
    </div>
  </main>
</template>

<style>
.hero {
  width: 100%;
  margin-top: -1rem;
  padding-top: 3rem;
  background-color: var(--clr-primary-mute);
  color: var(--clr-primary-content);

  position: relative;

  &::after {
    content: "RondeMaestro";

    position: absolute;
    bottom: 0;
    left: 0;
    font-weight: 900;
    font-size: var(--fs-900);
    font-family: var(--ff-heading);
    color: rgba(217, 217, 217, 0.25);
    line-height: 0.7;
    text-align: left;
    width: 100%;
    overflow: hidden;
  }

  .hero-wrapper {
    height: 700px;
    display: flex;
    gap: 3rem;
    justify-content: center;
    align-items: center;
    max-width: min(100% - 3rem, 135ch);
    margin-inline: auto;
    position: relative;
    z-index: 10;

    @media (width < 800px) {
      flex-direction: column;
    }
  }
  .title {
    color: var(--clr-primary);
    font-size: var(--fs-800);
    line-height: 0.9;
  }

  .subtitle {
    font-weight: 600;
    color: var(--clr-text);
  }

  .hero-image {
    transform: perspective(1500px) rotateY(-10deg) translateX(5%);
    transition: transform 1s ease 0s;
    box-shadow: var(--box-shadow);

    &:hover {
      transform: perspective(3000px) rotateY(5deg);
    }
    img {
      width: min(100%, 725px);
      border-radius: var(--border-radius);
      margin-inline: auto;
    }
  }
}

.text-block {
  width: min(100% - 3rem, 110ch);
  padding-block: 2rem;
  padding-inline: 2rem;
  background-color: var(--clr-background);
  margin-inline: auto;

  h2,
  h3,
  h4 {
    text-align: center;
    margin-bottom: 0.5em;
  }

  @media (width < 800px) {
    padding: 1rem;
  }
}
.two-cols {
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr 1fr;
  align-items: center;

  @media (width < 800px) {
    grid-template-columns: 1fr;
  }
}

.usp-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(auto, 260px));
  justify-content: center;
  gap: 1rem;

  @media (width < 800px) {
    grid-template-columns: 1fr;
  }

  .usp-card {
    padding: 1rem;
    font-size: var(--fs-300);
    background-color: var(--clr-primary-mute);
    border-radius: var(--border-radius);
    display: grid;
    gap: 1rem;
    grid-template-rows: 150px auto;

    .card-image img {
      height: 100%;
      margin-inline: auto;
    }

    h2,
    h3,
    h4 {
      text-align: left;
      margin-bottom: 0.5em;
      font-size: var(--fs-400);
    }
  }
}
</style>
