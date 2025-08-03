<script setup lang="ts">
const showMobileDropdown = ref(false);
const sideBarStore = useSideBarStore();

const SHOWNAVBARDROPDOWN = ref(false);
</script>

<template>
  <div class="nav-wrapper">
    <div class="navbar">
      <div class="nav-left">
        <NuxtLink to="/" class="nav-logo">
          <AppLogo />
        </NuxtLink>

        <nav
          v-if="!sideBarStore.loading"
          class="primary-navigation"
          :data-visible="showMobileDropdown"
          @mouseover="SHOWNAVBARDROPDOWN = true"
          @mouseleave="SHOWNAVBARDROPDOWN = false"
        >
          <ul
            id="primary-navigation"
            aria-label="Primary"
            role="list"
            class="menu"
          >
            <li>
              <NuxtLink to="/dashboard">
                Dashboard
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="{ name: 'dashboard-etappe-overzicht' }">
                Etappe overzicht
              </NuxtLink>
              <div v-if="SHOWNAVBARDROPDOWN" class="menu-separate">
                <ul v-for="race in sideBarStore.upcomingRace" :key="race.id">
                  <NuxtLink
                    :to="{
                      name: 'dashboard-etappe-overzicht-race-id',
                      params: {
                        race: slugify(race.name),
                        id: race.id,
                      },
                    }"
                  >
                    {{ race.name }}
                  </NuxtLink>
                  <ul>
                    <!-- TODO NAVIGEER NAAR JUISTE GEDEELTE VAN ETAPPE -->
                    <li v-for="stage in race.stages" :key="stage.id" class="stage-nav">
                      <NuxtLink
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
                      >
                        <span>{{ stage.stageNr }}.</span> {{ stage.startCity }} - {{
                          stage.finishCity }}
                      </NuxtLink>
                    </li>
                  </ul>
                </ul>
              </div>
            </li>
          </ul>
        </nav>
      </div>
      <div class="nav-right">
        <AppThemeToggle />
        <AppAuthButton />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav-wrapper {
  padding: 1rem;
  background: var(--clr-background-mute);
  margin-bottom: 1rem;
  width: 100%;
  position: relative;

  .navbar {
    display: flex;
    gap: 1rem;
    justify-content: space-between;

    .nav-left {
      display: flex;
      gap: 1rem;
    }

    .nav-right {
      display: flex;
      gap: 1rem;
    }
  }
}

.menu {
  display: inline-flex;
  flex-direction: row;
  gap: 1rem;
  padding: 0;
  font-weight: 200;
  font-size: var(--fs-400);
  list-style: none;
  position: relative;

  :where(li) {
    position: relative;
    display: flex;
    flex-shrink: 0;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: stretch;
    margin-block: 0.35rem;

    // padding-inline: .5rem;
    // padding-block: .75rem;
    // border-radius: var(--border-radius);
  }

  :where(li ul) {
    position: relative;
    margin-inline-start: 1rem;
    padding-inline-start: 0.5rem;
    white-space: nowrap;
  }
  // a,
  // .nav-item {
  //   text-decoration: none;
  //   color: var(--clr-text);
  //   position: relative;
  //   display: flex;
  //   flex-shrink: 0;
  //   flex-direction: column;
  //   flex-wrap: wrap;
  //   align-items: stretch;
  //   margin-block: .25rem;
  // }

  // .nav-item:hover,
  // .nav-item:hover a,
  // .nav-item:focus-within,
  // .nav-item:focus-within a {

  //   background: var(--clr-background);
  //   cursor: pointer;
  //   color: var(--clr-primary);
  // }

  a {
    display: inline-block;
    width: 100%;

    &:hover {
      background-color: var(--clr-background);
    }
  }

  .router-link-active {
    color: var(--clr-primary);
    box-shadow: none;
    font-weight: 600;
  }
}

.menu-separate {
  position: absolute;
  top: 100%;
  margin-top: 0.5rem;
  background-color: var(--clr-background-mute);
  padding-block: 0.75rem;
  padding-right: 1rem;
  border-radius: 0 0 var(--border-radius) var(--border-radius);
}

.stage-nav,
.stage-nav a {
  display: flex;
  gap: 0.75rem;
  padding-right: 0.5em;
}

.nav-logo svg {
  width: 100px;
  height: auto;
}

.mobile-nav-toggle {
  display: none;
}

.mobile-user-list {
  display: none;
}

.primary-navigation {
  display: flex;
  flex-direction: row;
  align-items: center;

  a {
    text-decoration: none;
    color: currentColor;
  }
}

// .nav-stage-menu {
//   position: absolute;
//   background: var(--clr-background-mute);
//   top: 100%;
//   padding: 1rem;
//   color: var(--clr-text);
//   z-index: 10;
// }

// .nav-stage-dropdown {

//   &:hover,
//   &:focus-visible {
//     >svg {
//       rotate: 0deg;
//       transition: rotate 200ms ease-in-out;
//     }
//   }

//   >svg {
//     rotate: -90deg;
//   }
// }

// @media (max-width: 780px) {
//   .primary-navigation {
//     display: none;
//     position: absolute;
//     top: 100%;
//     right: 0;
//     width: 100%;
//     padding: 1rem;
//     /* inset: 2rem auto; */
//     text-align: right;
//     background: var(--clr-background-mute);
//     z-index: 10;

//     ul {
//       padding: 0;
//     }

//     .nav-links {
//       display: flex;
//       flex-direction: column;
//       align-items: flex-end;
//       gap: 0.25rem;

//       .nav-item {
//         padding: 0;
//         margin-bottom: 0.25rem;
//       }
//     }
//   }

//   .primary-navigation[data-visible="true"] {
//     display: block;
//   }

//   .mobile-user-list {
//     display: block;
//     border-top: 3px solid var(--clr-primary);
//     margin-top: 0.75rem;

//     ul {
//       padding: 0;
//     }

//     li {
//       list-style: none;
//     }
//   }

//   .username {
//     display: none;
//   }

//   .mobile-nav-toggle {
//     display: block;
//     cursor: pointer;
//     background: transparent;
//     border: 0;
//     padding: 0.5em;
//   }

//   .nav-stage-menu {
//     right: 0;
//     width: 100%;
//   }
// }
</style>
