<script setup lang="ts">
import { NuxtLink } from "#components";

const authStore = useAuthStore();
const sideBarStore = useSideBarStore();

const { currentRace } = storeToRefs(sideBarStore);

onMounted(() => {
  if (authStore.user && authStore.session) {
    navigateTo("/dashboard");
  }

  if (!sideBarStore.currentRace) {
    sideBarStore.refreshUpcomingRace();
  }
});
</script>

<template>
  <main>
    <section class="hero">
      <div class="hero-image">
        <picture>
          <img src="/img/bryan-lucas.webp" alt="RondeMaestro" srcset="">
        </picture>
      </div>

      <div class="hero-wrapper">
        <div class="hero-text">
          <div class="badge badge-outline">
            Binnenkort de {{ currentRace?.name }}!
          </div>
          <h1 class="title">
            Word de ultieme ploegleider
          </h1>
          <p>
            RondeMaestro, hét wielerspel waarbij je <strong>dagelijks</strong> dezelfde kansen hebt. Selecteer elke dag acht renners en bewijs dat jij thuishoort in de ploegleiderswagen.
          </p>

          <div class="btn-group">
            <button class="btn btn-primary">
              <NuxtLink v-if="!authStore.user" to="/registreren">
                Gratis inschrijven <Icon name="tabler:chevron-right" />
              </NuxtLink>
              <NuxtLink v-else to="/dashboard">
                Naar dashboard
              </NuxtLink>
            </button>
            <div class="btn">
              Hoe werkt het?
            </div>
          </div>
        </div>
        <!-- <div class="hero-image">
          <picture>
            <img src="/img/homepage-screen.jpg" alt="Homepage RondeMaestro">
          </picture>
        </div> -->
      </div>
    </section>
    <!-- <div class="wrapper-lg wrapper-nobg"> -->
    <section class="home-section">
      <div class="text-block">
        <h1>
          Tourpoules, maar dan <div class="highlight">
            beter
          </div>
        </h1>
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
      <div class="usp-list">
        <div class="usp-card">
          <div class="card-image">
            <Icon size="32" name="tabler:refresh" />
          </div>
          <div class="card-body">
            <h3>Dagelijks dezelfde kansen</h3>
            <p>
              Zat je er gisteren naast? Geen zorgen! Selecteer elke dag opnieuw acht renners en doe een gooi naar eeuwige roem.
            </p>
          </div>
        </div>
        <div class="usp-card">
          <div class="card-image">
            <Icon size="32" name="tabler:list-check" />
          </div>
          <div class="card-body">
            <h3>Duidelijke puntentelling</h3>
            <p>
              Geen ingewikkelde regels. De eerste 15 renners over de streep krijgen punten. Simpel, eerlijk en overzichtelijk.
            </p>
          </div>
        </div>
        <div class="usp-card">
          <div class="card-image">
            <Icon size="32" name="tabler:wallet" />
          </div>
          <div class="card-body">
            <h3>Geen gedoe met budget</h3>
            <p>
              Bij RondeMaestro hoef je geen renners te laten schieten vanwege budget. Elke dag kun je elke renner selecteren, zonder beperkingen.
            </p>
          </div>
        </div>
        <div class="usp-card">
          <div class="card-image">
            <Icon size="32" name="tabler:users" />
          </div>
          <div class="card-body">
            <h3>Speel met vrienden</h3>
            <p>
              Maak een team aan, daag je vrienden uit en strijd samen om de beste score in het ploegenklassement.
            </p>
          </div>
        </div>
      </div>
    </section>
    <section class="home-section">
      <h2>In 3 stappen meedoen</h2>

      <div class="steps-list">
        <div class="step-item">
          <div class="card-image">
            <span>
              01</span>
          </div>
          <h3>Meld je aan</h3>
          <p>Maak gratis een account aan en je kunt direct meedoen met alle wedstrijden.</p>
        </div>
        <div class="step-item">
          <div class="card-image">
            <span>
              02</span>
          </div>
          <h3>Selecteer 8 renners</h3>
          <p>Kies elke dag opnieuw acht renners waarvan jij denkt dat ze hoog eindigen.</p>
        </div>
        <div class="step-item">
          <div class="card-image">
            <span>
              03</span>
          </div>
          <h3>Verdien punten</h3>
          <p>Elke renner in de top 15 levert punten op. Klim in het klassement en versla je vrienden!</p>
        </div>
      </div>
    </section>
    <section class="home-section">
      <div class="two-cols">
        <picture>
          <img src="/img/tour-de-france-5543968_1920.webp" alt="">
        </picture>

        <div>
          <h2>Strijd tegen je vrienden</h2>
          <p>Maak een team aan of sluitje aan bij vrienden. Jullie dagelijkse scores worden gecombineerd in het ploegenklassement. Wie heeft de beste wielertactiek?</p>
          <div class="highlight-list">
            <div class="highlight-item">
              <div class="card-image">
                <Icon name="tabler:users" />
              </div>
              Maak teams met vrienden en collega's
            </div>
            <div class="highlight-item">
              <div class="card-image">
                <Icon name="tabler:trophy" />
              </div>
              Apart ploegenklassement
            </div>
            <div class="highlight-item">
              <div class="card-image">
                <Icon name="tabler:bolt" />
              </div>
              Dagelijkse updates en ranglijsten
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="cta card text-center">
      <h2>Klaar om mee te doen?</h2>
      <p>Meld je vandaag nog gratis aan en bewijs dat jij de ultieme ploegleider bent. De Tour de France wacht op niemand!</p>
      <button class="btn btn-primary">
        <NuxtLink v-if="!authStore.user" to="/registreren">
          Inschrijven <Icon name="tabler:chevron-right" />
        </NuxtLink>
        <NuxtLink v-else to="/dashboard">
          Naar dashboard <Icon name="tabler:chevron-right" />
        </NuxtLink>
      </button>
    </section>
  </main>
</template>

<style>
.hero {
  width: 100%;
  min-height: 90dvh;
  display: flex;
  flex: 1;
  margin-top: -1rem;
  padding-top: 3rem;
  background: linear-gradient(10deg, var(--clr-background-app) 30%, var(--clr-primary-mute));
  color: var(--clr-primary-content);
  /* box-shadow: var(--box-shadow); */
  overflow: hidden;
  position: relative;

  /* &::after {
    content: "RondeMaestro";

    position: absolute;
    bottom: -15px;
    left: 0;
    font-weight: 900;
    font-size: var(--fs-900);
    font-family: var(--ff-heading);
    color: hsl(from var(--clr-text-black) h s l / 0.05);
    line-height: 0.7;
    text-align: left;
    width: 100%;
    overflow: hidden;
  } */

  .hero-wrapper {
    display: flex;
    width: 100%;
    gap: 3rem;
    align-self: end;
    bottom: 6rem;
    max-width: min(100% - 3rem, 135ch);
    margin-inline: auto;
    position: relative;
    z-index: 10;
    color: var(--clr-text);

    @media (width < 800px) {
      flex-direction: column;
      max-width: calc(100% - 2rem);
    }
  }

  .hero-text {
    max-width: 55ch;
  }
  .title {
    color: var(--clr-primary);
    font-size: var(--fs-800);
    line-height: 0.9;
    margin-block: 0.25em;
  }

  .hero-image {
    /* transform: perspective(1500px) rotateY(-10deg) translateX(5%);
    transition: transform 1s ease 0s;
    box-shadow: var(--box-shadow);

    &:hover {
      transform: perspective(3000px) rotateY(5deg);
    }
    img {
      width: min(100%, 725px);
      border-radius: var(--border-radius);
      margin-inline: auto;
    } */

    position: absolute;
    height: 100%;
    inset: 0;
    z-index: -1;

    & picture {
      img {
        height: auto;
        min-width: 100%;
      }
    }

    @media (width < 800px) {
      display: none;
    }
  }
}

.home-section {
  padding-block: 6rem;

  h1,
  h2,
  h3 {
    text-align: center;
    color: var(--clr-text);
  }

  > * {
    width: min(100% - 3rem, 1366px);
    margin-inline: auto;
  }

  &:nth-child(odd) {
    background: var(--clr-background);
  }
}

.text-block {
  width: min(100% - 3rem, 110ch);
  padding-block: 3rem;
  padding-inline: 2rem;

  margin-inline: auto;

  h1,
  h2,
  h3,
  h4 {
    text-align: center;
    margin-bottom: 0.75em;
  }

  @media (width < 800px) {
    padding: 1rem;
  }
}
.two-cols {
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr 1fr;

  h2,
  h3,
  h4 {
    text-align: left;
  }

  @media (width < 800px) {
    grid-template-columns: 1fr;
  }
}

.card-image {
  --_image-size: 50px;
  --_image-bg-color: var(--clr-primary-mute);
  --_image-color: var(--clr-primary);
  background-color: var(--_image-bg-color);
  height: var(--_image-size);
  aspect-ratio: 1/1;
  display: flex;
  place-items: center;
  border-radius: var(--border-radius);
  border: 1px solid var(--_image-color);

  span {
    width: 100%;
    color: var(--_image-color);
  }
}

.usp-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-content: center;
  gap: 1rem;

  @media (width < 800px) {
    grid-template-columns: 1fr;
  }

  .usp-card {
    display: grid;
    gap: 1rem;
    grid-template-columns: 75px auto;

    .card-image {
      place-self: center;
    }

    h2,
    h3,
    h4 {
      text-align: left;
      margin-bottom: 0.5em;
      font-size: var(--fs-400);
    }

    @media (width < 800px) {
      grid-template-columns: 1fr;
    }
  }
}

.steps-list {
  display: flex;
  gap: 2rem;
  text-align: center;
  margin-block: 3rem;

  @media (width < 800px) {
    flex-direction: column;
  }

  .step-item {
    display: grid;
    gap: 1rem;
    place-items: center;
    text-wrap: balance;

    .card-image {
      --_image-size: 60px;
      font-weight: 800;
      font-size: var(--fs-500);
    }
  }
}

.highlight-list {
  display: grid;
  gap: 0.75rem;
}
.highlight-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;

  .card-image {
    --_image-size: 30px;
  }
}

.cta {
  background: linear-gradient(to bottom, var(--clr-primary-mute), hsl(from var(--clr-primary-mute) h s l / 10%));
  max-width: 80ch;

  padding-inline: 6rem;
  margin: 1rem;
  text-wrap: balance;
  outline: 1px solid var(--clr-primary);

  @media (width < 800px) {
    padding: 1rem;
  }

  h2 {
    font-size: var(--fs-700);
    color: var(--clr-text);
    margin-bottom: 0.5em;
  }

  .btn {
    margin-block: 1rem;
  }
}
</style>
