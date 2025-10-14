// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "RondeMaestro | Het wielerspel waarbij je elke dag dezelfde kansen hebt!",
      charset: "utf-16",
      viewport: "width=device-width, initial-scale=1, maximum-scale=1",
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
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
      // Add a client URL for callbacks:
      // eslint-disable-next-line node/no-process-env
      clientBase: process.env.NUXT_PUBLIC_CLIENT_BASE || "http://localhost:3000",
      // eslint-disable-next-line node/no-process-env
      s3BucketURL: process.env.NUXT_PUBLIC_S3 || "https://ronde-maestro-v2.s3.eu-central-1.amazonaws.com",
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
    "@vite-pwa/nuxt",
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

  pwa: {
    manifest: {
      name: "RondeMaestro",
      short_name: "RondeMaestro",
      description: "RondeMaestro | Het wielerspel waarbij je elke dag dezelfde kansen hebt!",
      theme_color: "#F2F3F5",
      background_color: "#F2F3F5",
      icons: [
        {
          src: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
  },
});
