<script setup lang="ts">
import { watch } from "vue";

const sideBarStore = useSideBarStore();
const authStore = useAuthStore();
const route = useRoute();

const isMounted = ref(false);
const showNavbar = ref(false);
const navbarRef = ref<HTMLElement | null>(null);

function closeNavbar() {
  showNavbar.value = false;
}

function handleClickOutside(e: Event) {
  if (navbarRef.value && !navbarRef.value.contains(e.target as Node)) {
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

watch(route, () => {
  if (showNavbar.value) {
    closeNavbar();
  }
});
</script>

<template>
  <div ref="navbarRef" class="nav-wrapper">
    <div class="navbar">
      <div class="nav-left">
        <NuxtLink :to="authStore.session ? '/dashboard' : '/'" class="nav-logo" @click="closeNavbar">
          <AppLogo />
        </NuxtLink>
      </div>
      <nav class="nav-middle primary-navigation" :data-visible="showNavbar">
        <div class="link-block">
          <div v-if="authStore.session" class="link-block__title">
            <NuxtLink to="/dashboard" @click="closeNavbar">
              Dashboard
            </NuxtLink>
          </div>
          <ul>
            <li>
              <NuxtLink to="/kalender" @click="closeNavbar">
                Kalender
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/spelregels" @click="closeNavbar">
                Spelregels
              </NuxtLink>
            </li>
          </ul>
        </div>
        <div v-if="authStore.session" class="link-block">
          <div class="link-block__title">
            <NuxtLink :to="{ name: 'dashboard-etappe-overzicht' }" @click="closeNavbar">
              Etappe overzicht
            </NuxtLink>
          </div>
          <div v-if="!sideBarStore.isClassicSeason" class="race-list">
            <NavList
              v-for="race in sideBarStore.upcomingRace"
              :key="race.id"
              :grand-tour="race"
              :on-closed="closeNavbar"
              comp-location="overzicht"
            />
          </div>
          <div v-else-if="sideBarStore.classicsRaces">
            <NavList
              :classics-races="sideBarStore.classicsRaces"
              :on-closed="closeNavbar"
              comp-location="overzicht"
            />
          </div>
        </div>
        <div v-if="authStore.session" class="link-block">
          <div class="link-block__title">
            Uitslagen
          </div>
          <div class="race-list">
            <div v-if="!sideBarStore.isClassicSeason" class="race-list">
              <NavList
                v-for="race in sideBarStore.upcomingRace"
                :key="race.id"
                :grand-tour="race"
                :on-closed="closeNavbar"
                comp-location="uitslag"
              />
            </div>
            <div v-else-if="sideBarStore.classicsRaces">
              <NavList
                :classics-races="sideBarStore.classicsRaces"
                :on-closed="closeNavbar"
                comp-location="uitslag"
              />
            </div>
          </div>
        </div>
        <div v-if="authStore.session" class="link-block">
          <div class="link-block__title">
            Klassement
          </div>
          <ul>
            <template v-if="!sideBarStore.isClassicSeason">
              <li v-for="race in sideBarStore.upcomingRace" :key="race.id">
                <NuxtLink
                  :to="{
                    name: 'dashboard-klassement-race',
                    params: {
                      race: slugify(race.name),
                    },
                  }"
                  @click="closeNavbar"
                >
                  {{ race.name }}
                </NuxtLink>
              </li>
            </template>

            <template v-else>
              <li>
                <NuxtLink
                  :to="{
                    name: 'dashboard-klassement-race',
                    params: {
                      race: 'klassiekers',
                    },
                  }"
                  @click="closeNavbar"
                >
                  Klassiekers
                </NuxtLink>
              </li>
            </template>
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
            name="tabler:align-justified"
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
  grid-template-columns: minmax(0, auto) 1fr minmax(0, auto);
  grid-template-areas: "left middle right";

  .nav-left {
    display: flex;
    gap: 1rem;
    grid-area: left;
    align-items: center;
  }

  .nav-right {
    display: flex;
    gap: 1rem;
    grid-area: right;
    flex-wrap: wrap;
    align-items: baseline;
  }
}

.primary-navigation {
  display: flex;

  grid-column-gap: 3rem;
  grid-row-gap: 1rem;
  overflow: hidden;

  visibility: hidden;
  pointer-events: none;
  max-height: 0;

  opacity: 0;
  transition:
    max-height 0.5s ease-in-out,
    opacity 0.3s ease-in-out,
    visibility 0.5s;
}

.primary-navigation[data-visible="true"] {
  max-height: 200vh;
  /* A value that is larger than the content's height */
  opacity: 1;
  visibility: visible;
  pointer-events: auto;

  // display: flex;
  // opacity: 1;
  // flex-direction: row;
  // grid-column-gap: 3rem;
  // grid-row-gap: 1rem;

  @starting-style {
    opacity: 0;
  }

  a {
    color: currentColor;
    text-decoration: none;

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
  min-width: 25ch;
  max-width: 35ch;

  &__title {
    font-weight: 800;
    margin-bottom: 0.75rem;
    text-transform: uppercase;
  }

  a:has(:not(.link-block__title)) {
    font-weight: 400;
  }
}

@media screen and (max-width: 90em) {
  .nav-wrapper {
    --navbar-height: 45px;
  }

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
    min-height: 100dvh;

    .user-container {
      position: absolute;
      bottom: 3rem;
      display: flex;
      flex-direction: column-reverse;
      gap: 1rem;
    }
  }

  .primary-navigation[data-visible="true"] {
    display: flex;
    flex-flow: column;
    grid-area: middle;
  }

  .link-block {
    max-width: 100%;
  }

  .primary-navigation {
    /* Reset styles for desktop */
    display: none;
    opacity: 0;
  }
}

.hover {
  cursor: pointer;
}

.race-list {
  &:not(:last-child) {
    margin-bottom: 1em;
  }
}

summary a {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  align-items: center;
  font-weight: 400;

  &:hover {
    color: var(--clr-primary);
    font-weight: 800;
  }

  img {
    max-width: 75px;
    height: 50px;
    object-fit: contain;
  }
}

details {
  margin-block: 0.5rem;
  padding-block: 0.5rem;
}

summary {
  /* Pin the custom marker to the container */
  position: relative;
  /* Register summary as an anchor element */
  anchor-name: --summary;

  &::marker {
    content: "";
  }

  &::before,
  &::after {
    /* Custom marker dimensions */
    content: "";
    border-block-start: 3px solid var(--clr-primary);
    height: 0;
    width: 1rem;

    /* Positions the lines */
    inset-block-start: 50%;
    inset-inline-end: 0;

    /* Anchor the shape to the summary */
    position: absolute;
    position-anchor: --summary;
    position-area: top end;
  }

  /* Rotate just the ::after line to create a "+"" shape */
  &::after {
    transform: rotate(90deg);
    transform-origin: 50%;
  }
}

/* Rotate the line when open */
details[open] summary::after {
  transform: rotate(0deg);
}

.stage-nav a {
  display: grid;
  grid-template-columns: auto minmax(150px, auto) 30px;
  gap: 0.75rem;
  align-items: baseline;
  margin-bottom: 0.5rem;
  font-weight: 400;

  &:hover {
    color: var(--clr-primary);
    font-weight: 800;
  }

  span.iconify {
    justify-self: end;
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
