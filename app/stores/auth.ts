import type { User } from "better-auth";

import { createAuthClient } from "better-auth/vue";

export type UserWithId = Omit<User, "id"> & {
  id: number;
};

export const useAuthStore = defineStore("useAuthstore", () => {
  const config = useRuntimeConfig();
  const clientBaseUrl = config.public.clientBase;

  const authClient = createAuthClient({
    baseURL: `${config.public.apiBase}/auth`,
    fetchOptions: {
      credentials: "include",
    },
  });

  function getAbsoluteCallbackURL(path: string): string {
    // Concatenate the dynamic base URL with the desired relative path
    return `${clientBaseUrl}${path}`;
  }

  const {
    getSession,
    signIn,
    signOut,
    signUp,
    sendVerificationEmail,
  } = authClient;

  const errorCodes = {
    INVALID_EMAIL_OR_PASSWORD: {
      en: "user already registered",
      nl: "Onjuist email of wachtwoord",
    },
    FAILED_TO_CREATE_USER: {
      en: "Failed to create user",
      nl: "Gebruikersnaam al in gerbuikt, kies een andere",
    },
    USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: {
      en: "User already exists. Use another email.",
      nl: "E-mailadres al in gebruik.",
    },
    EMAIL_NOT_VERIFIED: {
      en: "Email not verified",
      nl: "Email niet verifieerd",
    },
    // Add other custom error codes here
  };

  function getErrorMessage(code: string, lang: "en" | "nl") {
    return errorCodes[code as keyof typeof errorCodes][lang];
  }

  const router = useRouter();
  const session = ref<Awaited<ReturnType<typeof authClient.getSession>> | null>(null);

  async function init() {
    const sessionData = await getSession();

    if (sessionData.data?.session) {
      session.value = sessionData;
    }
  }

  const user = computed(() => session.value?.data?.user);
  
  const loading = computed(() => session.value?.isPending);
  const errorMessage = ref("");
  const showVerificationComponent = ref(false);

  async function inloggen(body: { email: string; password: string }) {
    const { csrf } = useCsrf();
    const headers = new Headers();
    headers.append("csrf-token", csrf);

    await signIn.email({
      email: body.email,
      password: body.password,
      callbackURL: getAbsoluteCallbackURL("/dashboard"),
      fetchOptions: {
        headers,
        onError(ctx) {
          if (ctx.error.status === 403) {
            showVerificationComponent.value = true;
            navigateTo("/inloggen");
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
      callbackURL: getAbsoluteCallbackURL("/dashboard"),
      fetchOptions: {
        headers,
        onError(ctx) {
          errorMessage.value = getErrorMessage(ctx.error.code, "nl");
        },
        onSuccess() {
          // Todo send to other page for verification button
          // inloggen({ email: body.email, password: body.password });
          showVerificationComponent.value = true;
        },
      },
    });
  }

  async function resendVerification(email: string) {
    await sendVerificationEmail({
      email,
      callbackURL: getAbsoluteCallbackURL("/dashboard"),
    });
  }

  async function changePassword({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) {
    const { csrf } = useCsrf();
    const headers = new Headers();
    headers.append("csrf-token", csrf);
    return await authClient.changePassword({
      newPassword, // required
      currentPassword, // required
      revokeOtherSessions: true,
    });
  }

  async function resetPassword(newPassword: string, token: string) {
    const { csrf } = useCsrf();
    const headers = new Headers();
    headers.append("csrf-token", csrf);

    return await authClient.resetPassword({
      newPassword, // required
      token, // required
    });
  }

  async function resetPasswordRequest(email: string) {
    const { csrf } = useCsrf();
    const headers = new Headers();
    headers.append("csrf-token", csrf);

    return await authClient.requestPasswordReset({
      email,
      redirectTo: getAbsoluteCallbackURL("/wachtwoord-vergeten"),
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
    resendVerification,
    changePassword,
    resetPassword,
    resetPasswordRequest,
    showVerificationButton: showVerificationComponent,
  };
});
