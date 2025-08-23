<template>
  <footer>
    <div class="footer-wrapper footer-top wrapper">
      <div>
        <NuxtLink to="/" class="nav-logo">
          <AppLogo />
        </NuxtLink>
        <p class="copyright">
          &copy; 2021 - {{ new Date().getFullYear() }} by ZweersDesign
        </p>
      </div>

      <AppAuthButton :show-navbar-content="false" />
    </div>
    <div class="footer-wrapper footer-bottom wrapper">
      <div class="bottom-links">
        <NuxtLink to="https://www.rondemaestro.com/spelregels">
          Spelregels
        </NuxtLink>
        <NuxtLink to="https://www.rondemaestro.com/spelregels">
          Terms of service
        </NuxtLink>
        <NuxtLink to="https://www.rondemaestro.com/spelregels">
          Contact
        </NuxtLink>
      </div>
    </div>
  </footer>
</template>

<style>
footer {
  padding: 1rem;
  background: var(--clr-background-mute);
  min-height: var(--navbar-height);
  box-shadow: 0px -12px 28px -7px rgba(0, 0, 0, 0.35);
  margin-top: 2rem;

  & .copyright {
    margin-top: 1em;
    font-size: var(--fs-200);
    text-transform: uppercase;
  }
}

.footer-wrapper {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding-block: 1rem;
  justify-content: space-between;

  &.footer-top {
    border-top: 1px solid var(--clr-primary);
    border-bottom: 2px solid var(--clr-background);
  }
  &.footer-bottom {
    & .bottom-links {
      display: flex;
      gap: 1rem;
      font-size: var(--fs-300);

      & a {
        color: var(--clr-text);
        text-decoration-color: var(--clr-primary);

        &:hover {
          color: var(--clr-primary);
        }
      }
    }
  }
}
</style>
