import { createAuthClient } from "better-auth/vue";

// This function will be executed within the Nuxt context
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const authClient = createAuthClient({
    baseURL: config.public.apiBase,
    fetchOptions: {
      credentials: "include",
    },
  });

  // Provide the auth client to the Nuxt app instance
  return {
    provide: {
      authClient,
    },
  };
});
