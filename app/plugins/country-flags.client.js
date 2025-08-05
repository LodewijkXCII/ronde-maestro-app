import { defineNuxtPlugin } from "#app";
import CountryFlag from "vue-country-flag-next";

export default defineNuxtPlugin((nuxtApp) => {
  // Register the component globally
  nuxtApp.vueApp.component("CountryFlag", CountryFlag);
});
