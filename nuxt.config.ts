// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "RondeMaestro | Het wielerspel waarbij je elke dag dezelfde kansen hebt!",
      htmlAttrs: {
        lang: "nl",
      },
      link: [
        { rel: "icon", type: "image/x-ixon", href: "/favicon.ico" },
      ],
    },
  },

  runtimeConfig: {
    public: {
      // eslint-disable-next-line node/no-process-env
      apiBase: process.env.API_BASE || "http://localhost:3000/api",
      // eslint-disable-next-line node/no-process-env
      s3BucketURL: process.env.AWS_ENDPOINT_URL_S3 || "http://localhost:9000/images",
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
