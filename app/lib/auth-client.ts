import { createAuthClient } from "better-auth/vue";

export const authClient = createAuthClient({
  baseURL: "http://localhost:5959/",
  fetchOptions: {
    credentials: "include",
  },
});
