// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: "http://localhost:5959/api",
      s3BucketURL: "http://localhost:9000/images",
    },
  },

  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@pinia/nuxt",
    "@nuxt/icon",
    "@nuxtjs/color-mode",
    "nuxt-csurf",
    "@vee-validate/nuxt",
  ],
  css: [
    "~/assets/css/main.scss",
  ],

  eslint: {
    config: {
      standalone: false,
    },
  },

  colorMode: {
    classSuffix: "",
    preference: "system",
    fallback: "light",
  },
});
