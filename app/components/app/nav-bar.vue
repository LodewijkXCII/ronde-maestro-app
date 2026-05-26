<script setup lang="ts">
import { onMounted } from "vue";

const sideBarStore = useSideBarStore();
const authStore = useAuthStore();
const route = useRoute();

const isMounted = ref(false);
const showNavbar = ref(false);

const selectCyclistRef = ref<HTMLElement | null>(null);
const selectResultRef = ref<HTMLElement | null>(null);
const selectTeamsRef = ref<HTMLElement | null>(null);

function closeNavbar() {
  if (event && (event.target as HTMLElement).closest("summary")) {
    return;
  }

  showNavbar.value = false;
  if (selectResultRef.value && selectCyclistRef.value) {
    selectCyclistRef.value.removeAttribute("open");
    selectResultRef.value.removeAttribute("open");
    if (selectTeamsRef.value) {
      selectTeamsRef.value.removeAttribute("open");
    }
  }
}

function handleClickOutside() {
  closeNavbar();
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
  closeNavbar();
});
</script>

<template>
  <div class="nav-wrapper">
    <div class="navbar">
      <div class="nav-left">
        <NuxtLink :to="authStore.session ? '/dashboard' : '/'" class="nav-logo">
          <AppLogo />
        </NuxtLink>
      </div>
      <nav v-if="authStore.session && sideBarStore.upcomingRace" class="nav-middle primary-navigation" :data-visible="showNavbar">
        <ul @click="closeNavbar">
          <li class="nav-link">
            <NuxtLink to="/dashboard">
              Dashboard
            </NuxtLink>
          </li>
          <li class="nav-link">
            <details ref="selectCyclistRef">
              <summary @click.stop>
                Renners selecteren <Icon name="tabler:chevron-right" size="16" class="nav-icon" />
              </summary>

              <AppNavList
                v-if="!sideBarStore.isClassicSeason"
                :grand-tour="sideBarStore.currentRace || undefined"
                :on-closed="closeNavbar"
                comp-location="overzicht"
              />

              <AppNavList
                v-else-if="sideBarStore.classicsRaces"
                :classics-races="sideBarStore.classicsRaces"
                :on-closed="closeNavbar"
                comp-location="overzicht"
              />
            </details>
          </li>
          <li class="nav-link">
            <NuxtLink :to="{ name: 'dashboard-etappe-overzicht' }">
              Etappe overzicht
            </NuxtLink>
          </li>
          <li class="nav-link">
            <details ref="selectResultRef">
              <summary @click.stop>
                Uitslagen <Icon name="tabler:chevron-right" size="16" />
              </summary>

              <div v-if="!sideBarStore.isClassicSeason" class="race-list">
                <AppNavList
                  :grand-tour="sideBarStore.currentRace || undefined"
                  :on-closed="closeNavbar"
                  comp-location="uitslag"
                />
              </div>
              <div v-else-if="sideBarStore.classicsRaces">
                <AppNavList
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
                  race: !sideBarStore.isClassicSeason ? slugify(sideBarStore.currentRace?.name || null) : 'klassiekers',
                },
              }"
            >
              Klassement
            </NuxtLink>
          </li>
          <li class="nav-link">
            <NuxtLink v-if="authStore.userPoules.length <= 0" :to="{ name: 'dashboard-ploegenspel' }">
              Ploegenspel
            </NuxtLink>
            <details v-else ref="selectTeamsRef">
              <summary @click.stop>
                Ploegenspel <Icon name="tabler:chevron-right" size="16" class="nav-icon" />
              </summary>

              <ul class="stage-list">
                <li class="stage-list--item">
                  <NuxtLink
                    :to="{
                      name: 'dashboard-ploegenspel',
                    }"
                  >
                    Klassement
                  </NuxtLink>
                </li>
                <li v-for="team in authStore.userPoules" :key="team.id" class="stage-list--item">
                  <NuxtLink
                    :to="{
                      name: 'dashboard-ploegenspel-ploeg-id',
                      params: {
                        ploeg: slugify(team.name),
                        id: team.id,
                      },
                    }"
                  >
                    {{ team.name }}
                  </NuxtLink>
                </li>
              </ul>
            </details>
          </li>
        </ul>
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

<style>
.mobile-nav-toggle {
  display: none;
}

.mobile-user-list {
  display: none;
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
  a,
  summary {
    color: var(--clr-text);
    text-decoration: none;
    justify-content: end;

    &:hover {
      font-weight: inherit;
    }
  }

  padding: 0.5rem 0.75rem;
  margin: 0;
  border-radius: var(--border-radius);

  &:hover:not(details) {
    cursor: pointer;
    background: var(--clr-secondary);
    transition: background 0.3s ease-in-out;
  }
  &:has(.router-link-active.router-link-exact-active) {
    background: var(--clr-primary-mute);
    color: var(--clr-text);
    border: 1px solid var(--clr-primary);
  }
}

ul.stage-list {
  position: absolute;
  display: grid;
  background: var(--clr-background-mute);
  top: 90%;
  border-radius: var(--border-radius);
  outline: 2px solid var(--clr-secondary);
  padding: 0;
  gap: 0;

  .stage-list--item {
    min-width: fit-content;
    white-space: nowrap;
    padding: 0.5rem;

    &:first-of-type a {
      margin-top: 0.5rem;
    }
    &:last-of-type a {
      margin-bottom: 0.5rem;
    }

    &:hover {
      background: var(--clr-secondary);
      cursor: pointer;
    }
    a {
      display: grid;
      grid-template-columns: minmax(3ch, auto) 1fr minmax(7ch, auto);
      gap: 0.5rem;
    }

    &:has(a.router-link-exact-active) {
      background: var(--clr-primary-dark);
    }
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
      width: 100%;
    }
  }

  .primary-navigation {
    display: none; /* Hidden by default on mobile */
    flex-direction: column;
    width: 100%;
    /* Add these to make it overlay or push content if desired */
    padding: 1rem 0;

    ul:not(.stage-list) {
      align-items: end;
    }
  }

  /* This is the critical fix: override the display: none when data-visible is true */
  .primary-navigation[data-visible="true"] {
    display: flex;
    grid-area: middle;
    opacity: 1;
  }

  .primary-navigation ul:not(.stage-list) {
    flex-direction: column; /* Stack links vertically on mobile */
    width: 100%;
  }

  .mobile-nav-toggle {
    display: block;
  }

  ul.stage-list {
    position: relative;
    outline: none;
    border-radius: 0;

    display: flex;
    flex-direction: row-reverse;
    flex-wrap: nowrap;
    justify-items: end;
    overflow-x: auto;

    width: calc(100vw - 3rem);
    padding: 0.5rem 0;
    gap: 1rem;

    .stage-list--item {
      flex: 0 0 auto; /* CRITICAL: Prevent items from shrinking */
      border: 1px solid var(--clr-primary-mute);
      background: var(--clr-primary-mute);
      padding: 0;
      border-radius: var(--border-radius);

      > a {
        display: grid;
        grid-template-rows: 1fr 1fr;
        grid-template-columns: 4ch auto;
        grid-template-areas:
          "number date  "
          "number cities";
        justify-content: center;
        align-content: center;
        align-items: center;
        margin: 0 !important;
        gap: 0.25rem;
        height: 100%;
      }

      .stage-nr {
        grid-area: number;
        font-size: var(--fs-400);
        height: 100%;
        align-content: center;
        background: var(--clr-background-mute);
        padding: 0.5rem;
        border-radius: var(--border-radius) 0 0 var(--border-radius);
        border: 1px solid var(--clr-primary-mute);
      }
      .stage-date {
        grid-area: date;
        padding-top: 0.5rem;
        padding-right: 0.5rem;
      }
      .stage-city {
        grid-area: cities;
        padding-bottom: 0.5rem;
        padding-right: 0.5rem;
      }
    }
  }
}

/* Rotate the line when open */
details[open] .nav-icon {
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

  span.nav-icon {
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
