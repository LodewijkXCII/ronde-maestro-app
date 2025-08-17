import type { User } from "better-auth";

import { createAuthClient } from "better-auth/vue";

export type UserWithId = Omit<User, "id"> & {
  id: number;
};

export const useAuthStore = defineStore("useAuthstore", () => {
  const config = useRuntimeConfig();

  const authClient = createAuthClient({
    baseURL: `${config.public.apiBase}/auth`,
    fetchOptions: {
      credentials: "include",
    },
  });

  const {
    getSession,
    // useSession,
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
  const session = ref<Awaited<ReturnType<typeof authClient.getSession>> | null>(null);

  async function init() {
    // TODO IF !DATA NAVIGATE TO /
    const sessionData = await getSession();

    // if (!sessionData.data?.session) {
    //   return navigateTo("/inloggen");
    // }
    if (sessionData.data?.session) {
      session.value = sessionData;
    }
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
          if (ctx.error.status === 403) {
            // eslint-disable-next-line no-alert
            window.alert("Please verify your email address");
          }
          errorMessage.value = getErrorMessage(ctx.error.code, "nl");
        },
        onSuccess() {
          navigateTo("/dashboard");
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

  // async function resendVerification(email: string) {
  //   // const { csrf } = useCsrf();
  //   // const headers = new Headers();
  //   // headers.append("csrf-token", csrf);

  //   await sendVerificationEmail({
  //     email,
  //     callbackURL: "/inloggen",
  //   });
  // }

  async function uitloggen() {
    const { csrf } = useCsrf();
    const headers = new Headers();
    headers.append("csrf-token", csrf);
    await signOut({
      fetchOptions: {
        headers,
        onSuccess: () => {
          session.value = null;
          router.push("/inloggen"); // redirect to login page
        },
      },
    });
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
