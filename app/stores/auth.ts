import type { createAuthClient } from "better-auth/vue";

export const useAuthStore = defineStore("useAuthstore", () => {
  const nuxtApp = useNuxtApp();

  const authClient = nuxtApp.$authClient as ReturnType<typeof createAuthClient>;

  const {
    useSession,
    signIn,
    signOut,
    signUp,
  } = authClient;

  const errorCodes = {
    INVALID_EMAIL_OR_PASSWORD: {
      en: "user already registered",
      nl: "Onjuist email of wachtwoord",
    },
    // Add other custom error codes here
  };

  function getErrorMessage(code: string, lang: "en" | "nl") {
    if (code in errorCodes) {
      return errorCodes[code as keyof typeof errorCodes][lang];
    }
    return "";
  }

  const router = useRouter();
  const session = ref<Awaited<ReturnType<typeof authClient.useSession>> | null>(null);

  async function init() {
    // TODO IF !DATA NAVIGATE TO /
    const data = await useSession(async () => await $fetch);

    if (!data) {
      return navigateTo("/inloggen");
    }
    session.value = data;
  }

  const user = computed(() => session.value?.data?.user);
  const loading = computed(() => session.value?.isPending);
  const errorMessage = ref("");

  async function inloggen(body: { email: string; password: string }) {
    const { csrf } = useCsrf();
    const headers = new Headers();
    headers.append("csrf-token", csrf);

    await signIn.email({
      email: body.email,
      password: body.password,
      callbackURL: "/dashboard",
      fetchOptions: {
        headers,
        onError(ctx) {
          errorMessage.value = getErrorMessage(ctx.error.code, "nl");
        },
      },
    });
  }

  async function registreren(body: { email: string; password: string; userName: string }) {
    const { csrf } = useCsrf();
    const headers = new Headers();
    headers.append("csrf-token", csrf);

    await signUp.email({
      email: body.email,
      password: body.password,
      name: body.userName,
      callbackURL: "/dashboard",
      fetchOptions: {
        headers,
        onError(ctx) {
          errorMessage.value = getErrorMessage(ctx.error.code, "nl");
        },
      },
    });
  }

  async function uitloggen() {
    const { csrf } = useCsrf();
    const headers = new Headers();
    headers.append("csrf-token", csrf);
    await signOut({
      fetchOptions: {
        headers,
        onSuccess: () => {
          router.push("/inloggen"); // redirect to login page
        },
      },
    });
    // TODO REMOVE COOKIES AND ALL OTHER STUFF
  }

  return {
    init,
    session,
    user,
    loading,
    inloggen,
    uitloggen,
    registreren,
    errorMessage,
  };
});
