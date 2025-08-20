<script setup lang="ts">
const config = useRuntimeConfig();

const sideBarStore = useSideBarStore();

const isMounted = ref(false);
const showNavbar = ref(false);
const navbarRef = ref(null);

function closeNavbar() {
  showNavbar.value = false;
}

function handleClickOutside(e: Event) {
  if (navbarRef.value && !navbarRef.value.contains(e.target)) {
    closeNavbar();
  }
}

onMounted(() => {
  isMounted.value = true;
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  // Clean up the event listener to prevent memory leaks
  document.removeEventListener("click", handleClickOutside);
});

const isNavbarActive = computed({
  get() {
    return showNavbar.value === false;
  },
  set() {
    showNavbar.value = !showNavbar.value;
  },
});
</script>

<template>
  <div ref="navbarRef" class="nav-wrapper">
    <div class="navbar">
      <div class="nav-left">
        <NuxtLink to="/" class="nav-logo" @click="closeNavbar">
          <AppLogo />
        </NuxtLink>
      </div>
      <nav class="nav-middle primary-navigation" :data-visible="showNavbar">
        <div class="link-block">
          <div class="link-block__title">
            <NuxtLink to="/dashboard" @click="closeNavbar">
              Dashboard
            </NuxtLink>
          </div>
        </div>
        <div class="link-block">
          <div class="link-block__title">
            <NuxtLink :to="{ name: 'dashboard-etappe-overzicht' }" @click="closeNavbar">
              Etappe overzicht
            </NuxtLink>
          </div>
          <div class="race-list">
            <div v-for="race in sideBarStore.upcomingRace" :key="race.id" class="race-list__race">
              <NuxtLink
                :to="{
                  name: 'dashboard-etappe-overzicht-race-id',
                  params: {
                    race: slugify(race.name),
                    id: race.id,
                  },
                }"
                @click="closeNavbar"
              >
                {{ race.name }}

                <img v-if="race.image" :src="`${config.public.s3BucketURL}/${race.image}`" :alt="race.name">
              </NuxtLink>
              <ul>
                <!-- TODO ADD CLASS BASED ON STAGE SETTING -->
                <li v-for="stage in race.stages" :key="stage.id" class="stage-nav">
                  <NuxtLink
                    v-if="stage.done"
                    :to="{
                      name: 'dashboard-race-id-uitslagen-nr',
                      params:
                        {
                          race: slugify(race.name),
                          id: stage.raceId,
                          nr: stage.stageNr,
                        },

                    }"
                    class=""
                    @click="closeNavbar"
                  >
                    <span>{{ stage.stageNr }}.</span> {{ stage.startCity }} - {{
                      stage.finishCity }} <Icon size="18" name="tabler:trophy" />
                  </NuxtLink>
                  <NuxtLink
                    v-else-if="!stage.done && stageUnderway(stage.date)"
                    :to="{
                      name: 'dashboard',

                    }"
                    class=""
                    @click="closeNavbar"
                  >
                    <span>{{ stage.stageNr }}.</span> {{ stage.startCity }} - {{
                      stage.finishCity }} <Icon size="18" name="tabler:pencil-off" />
                  </NuxtLink>
                  <NuxtLink
                    v-else
                    :to="{
                      name: 'dashboard-race-id-selecteer-nr',
                      params:
                        {
                          race: slugify(race.name),
                          id: stage.raceId,
                          nr: stage.stageNr,
                        },
                    }"
                    class=""
                    @click="closeNavbar"
                  >
                    <span>{{ stage.stageNr }}.</span> {{ stage.startCity }} - {{
                      stage.finishCity }} <Icon size="18" name="tabler:pencil" color="green" />
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="link-block">
          <div class="link-block__title">
            Uitslagen
          </div>
          <ul>
            <li>
              <template v-for="race in sideBarStore.upcomingRace" :key="race.id">
                <ul v-if="race.stages.some(stage => stage.done)">
                  <NuxtLink
                    :to="{
                      name: 'dashboard-etappe-overzicht-race-id',
                      params: {
                        race: slugify(race.name),
                        id: race.id,
                      },
                    }"
                    @click="closeNavbar"
                  >
                    {{ race.name }}
                  </NuxtLink>
                </ul>
                <template v-for="stage in race.stages" :key="stage.id">
                  <li v-if="stage.done" class="stage-nav">
                    <NuxtLink
                      :to="{
                        name: 'dashboard-race-id-uitslagen-nr',
                        params:
                          {
                            race: slugify(race.name),
                            id: stage.raceId,
                            nr: stage.stageNr,
                          },

                      }"
                      class=""
                      @click="closeNavbar"
                    >
                      <span>{{ stage.stageNr }}.</span> {{ stage.startCity }} - {{
                        stage.finishCity }}
                    </NuxtLink>
                  </li>
                </template>
              </template>
            </li>
          </ul>
        </div>
        <div class="link-block">
          <div class="link-block__title">
            Klassement
          </div>
          <ul>
            <li v-for="race in sideBarStore.upcomingRace" :key="race.id">
              <NuxtLink
                :to="{
                  name: 'dashboard-race-id-klassement',
                  params: {
                    race: slugify(race.name),
                    id: race.id,
                  },
                }"
                @click="closeNavbar"
              >
                {{ race.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </nav>

      <div class="nav-right">
        <AppAuthButton :show-navbar-content="showNavbar" />
        <AppThemeToggle />

        <label class="swap" aria-label="Toggle menu">
          <input v-model="isNavbarActive" type="checkbox">

          <Icon
            class="swap-icon"
            :class="{ active: isMounted && isNavbarActive }"

            name="tabler:menu-2"
            size="24"
            color="currentColor"
          />
          <Icon
            class="swap-icon"
            :class="{ active: isMounted && !isNavbarActive }"
            name="tabler:x"
            size="24"
            color="currentColor"
          />

          <span class="visually-hidden">Menu</span>
        </label>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;

  li {
    padding: 0;
    margin: 0;
  }
}

.nav-wrapper {
  padding: 1rem;
  background: var(--clr-background-mute);
  margin-bottom: 1rem;
  width: 100%;
  position: absolute;
  z-index: 1000;
  top: 0;
  min-height: var(--navbar-height);
  box-shadow: var(--box-shadow);
}

.nav-wrapper:has(.primary-navigation[data-visible="true"]) {
  position: absolute;
}

.navbar {
  display: grid;
  gap: 1rem;
  justify-content: space-between;
  border-top: 1px solid var(--clr-primary);
  padding-top: 1rem;
  grid-template-columns: minmax(0, auto) auto minmax(0, auto);
  grid-template-areas: "left middle right";

  .nav-left {
    display: flex;
    gap: 1rem;
    grid-area: left;
  }

  .nav-right {
    display: flex;
    gap: 1rem;
    grid-area: right;
    flex-wrap: wrap;
  }
}

.primary-navigation {
  display: none;
}

.primary-navigation[data-visible="true"] {
  display: flex;
  flex-direction: row;
  grid-column-gap: 5rem;
  grid-row-gap: 1rem;

  a {
    text-decoration: none;
    color: currentColor;

    &:hover {
      color: var(--clr-primary);
      font-weight: 800;
    }
  }

  .router-link-active {
    color: var(--clr-primary);
    box-shadow: none;
    font-weight: 600;
  }
}

.link-block {
  min-width: 15ch;
  &__title {
    font-weight: 800;
    margin-bottom: 0.75rem;
  }
}

@media screen and (max-width: 90em) {
  .navbar {
    grid-template-columns: minmax(0, auto) minmax(0, auto);
    grid-template-rows: minmax(0, auto) 1fr;
    grid-template-areas: "left right" "middle middle";

    .nav-right {
      gap: 0.25rem 0.5rem;
      justify-content: flex-end;
    }
  }

  .navbar:has(.primary-navigation[data-visible="true"]) {
    height: 100dvh;

    .user-container {
      position: absolute;
      bottom: 3rem;
      display: flex;
      flex-direction: column-reverse;
      gap: 1rem;
    }
  }

  .primary-navigation[data-visible="true"] {
    flex-flow: column wrap;
    grid-area: middle;
  }

  .link-block {
    max-width: 100%;
  }
}

.nav-wrapper:has(.primary-navigation[data-visible="true"]) {
  height: auto;
}

.hover {
  cursor: pointer;
}

.race-list {
  &:not(:last-child) {
    margin-bottom: 1em;
  }

  &__race > a {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
    align-items: center;

    &:hover {
      color: var(--clr-primary);
      font-weight: 800;
    }

    img {
      max-width: 75px;
      height: auto;
    }
  }
}

.stage-nav a {
  display: grid;
  grid-template-columns: 2ch minmax(150px, auto) 30px;
  gap: 0.75rem;
  align-items: center;

  &:hover {
    color: var(--clr-primary);
    font-weight: 800;
  }
}

.nav-logo {
  svg {
    width: 100px;
    height: auto;
  }
}
.mobile-nav-toggle {
  display: none;
}

.mobile-user-list {
  display: none;
}
</style>
