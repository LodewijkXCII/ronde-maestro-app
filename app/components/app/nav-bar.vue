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
    return showNavbar.value;
  },
  set(val) {
    showNavbar.value = val;
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
        <NuxtLink :to="authStore.session ? '/dashboard' : '/'" class="nav-logo">
          <AppLogo />
        </NuxtLink>
      </div>
      <nav v-if="authStore.session" class="nav-middle primary-navigation" :data-visible="showNavbar">
        <ul>
          <li class="nav-link">
            <NuxtLink to="/dashboard">
              Dashboard
            </NuxtLink>
          </li>
          <li class="nav-link">
            <details>
              <summary>Renners selecteren <Icon name="tabler:chevron-right" size="16" /></summary>

              <NavList
                v-if="!sideBarStore.isClassicSeason"
                :grand-tour="sideBarStore.upcomingRace[0]"
                comp-location="overzicht"
              />

              <NavList
                v-else-if="sideBarStore.classicsRaces"
                :classics-races="sideBarStore.classicsRaces"
                comp-location="uitslag"
              />
            </details>
          </li>
          <li class="nav-link">
            <NuxtLink :to="{ name: 'dashboard-etappe-overzicht' }">
              Etappe overzicht
            </NuxtLink>
          </li>
          <li class="nav-link">
            <details>
              <summary>Uitslagen <Icon name="tabler:chevron-right" size="16" /></summary>

              <div v-if="!sideBarStore.isClassicSeason" class="race-list">
                <NavList
                  :grand-tour="sideBarStore.upcomingRace[0]"
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
            </details>
          </li>
          <li class="nav-link">
            <NuxtLink
              :to="{
                name: 'dashboard-klassement-race',
                params: {
                  race: !sideBarStore.isClassicSeason ? slugify(sideBarStore.upcomingRace[0].name) : 'klassiekers',
                },
              }"
            >
              Klassement
            </NuxtLink>
          </li>
          <li class="nav-link">
            <NuxtLink :to="{ name: 'dashboard-ploegenspel' }">
              Ploegenspel
            </NuxtLink>
          </li>
        </ul>

        <!-- <div class="link-block">
          <div class="link-block__title" />
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
        <div class="link-block">
          <div class="link-block__title">
            Uitslagen
          </div>
        </div>
        <div class="link-block">
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
        </div> -->
      </nav>

      <div class="nav-right">
        <AppAuthButton />
        <AppThemeToggle />

        <span class="mobile-nav-toggle">
          <label class="swap" aria-label="Toggle menu">
            <input v-model="isNavbarActive" type="checkbox">

            <Icon
              class="swap-icon"
              :class="{ active: isMounted && isNavbarActive }"
              name="tabler:x"
              size="24"
              color="currentColor"
            />
            <Icon
              class="swap-icon"
              :class="{ active: isMounted && !isNavbarActive }"
              name="tabler:align-justified"
              size="24"
              color="currentColor"
            />
          </label>
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.mobile-nav-toggle {
  display: none;
}

.mobile-user-list {
  display: none;
}

.nav-wrapper {
  padding: 1rem;
  background: hsla(from var(--clr-background-mute) h s l / 80%);
  backdrop-filter: blur(4px);
  margin-bottom: 1rem;
  width: 100%;
  position: sticky;
  z-index: 1000;
  top: 0;
  min-height: var(--navbar-height);
  box-shadow: var(--box-shadow);
  border-bottom: 2px solid var(--clr-primary-mute);
}

.navbar {
  display: grid;
  align-items: center;
  gap: 1rem;
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

.nav-link {
  a {
    color: var(--clr-text);
    text-decoration: none;

    &:hover {
      font-weight: inherit;
    }
  }
  padding: 0.5rem 0.75rem;
  margin: 0;
  border-radius: var(--border-radius);

  &:hover {
    cursor: pointer;
    background: var(--clr-secondary);
    transition: background 0.3s ease-in-out;
  }
  &:has(.router-link-active.router-link-exact-active) {
    background: var(--clr-primary-mute);
    color: var(--clr-primary-content);
    border: 1px solid var(--clr-primary);
  }

  .stage-list {
    position: absolute;
    display: grid;
    gap: 0;
    background: var(--clr-background-mute);
    top: 90%;
    padding: 0;
    border-radius: var(--border-radius);
    outline: 2px solid var(--clr-secondary);

    .stage-list--item {
      min-width: fit-content;
      white-space: nowrap;
      padding: 0.75rem;

      &:first-of-type {
        padding-top: 1rem;
      }
      &:last-of-type {
        padding-bottom: 1rem;
      }

      &:hover {
        background: var(--clr-secondary);
      }
      a {
        display: grid;
        grid-template-columns: 3ch 1fr;
      }

      &:has(a.router-link-exact-active) {
        background: var(--clr-primary-dark);
      }
    }
  }
}

.primary-navigation {
  display: flex;

  grid-column-gap: 3rem;
  grid-row-gap: 1rem;
  overflow: hidden;

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: flex;
    gap: 0.75rem;
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
    align-items: start;

    .nav-right {
      gap: 0.25rem 0.5rem;
      justify-content: flex-end;
    }
  }

  .navbar:has(.primary-navigation[data-visible="true"]) {
    min-height: 100svh;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: var(--clr-background-mute);
    padding: 1rem;
    padding-top: 2rem;
    border: none;

    .user-container {
      position: absolute;
      bottom: 3rem;
      display: flex;
      flex-direction: column-reverse;
      gap: 1rem;
    }
  }

  .primary-navigation {
    display: none; /* Hidden by default on mobile */
    flex-direction: column;
    width: 100%;
    /* Add these to make it overlay or push content if desired */
    padding: 1rem 0;
  }

  /* This is the critical fix: override the display: none when data-visible is true */
  .primary-navigation[data-visible="true"] {
    display: flex;
    grid-area: middle;
    opacity: 1;
  }

  .primary-navigation ul {
    flex-direction: column; /* Stack links vertically on mobile */
    width: 100%;
  }

  .mobile-nav-toggle {
    display: block;
  }

  .nav-link .stage-list {
    position: inherit;
    outline: none;
    border-radius: 0;
  }
}

.hover {
  cursor: pointer;
}

summary {
  list-style: none;
  display: flex;
  gap: 0.25rem;
  align-items: center;
}

/* Rotate the line when open */
details[open] .iconify {
  transform: rotate(90deg);
  transition: transform 0.3s ease-in-out;
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
</style>
