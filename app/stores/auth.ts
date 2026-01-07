import type { User } from "better-auth";

import { createAuthClient } from "better-auth/vue";

import type { UserPref } from "~/lib/user-schema";

export type UserWithId = Omit<User, "id"> & {
  id: number;
};

export const useAuthStore = defineStore("useAuthstore", () => {
  const config = useRuntimeConfig();
  const toastStore = useToastStore();

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

      await getUserPreference(session.value.data.user.id);
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

  async function getUserPreference(userId: string): Promise<UserPref> {
    const userData = localStorage.getItem("userPrefs");

    if (userData) {
      const extractedData = JSON.parse(userData);

      if (extractedData.needsUpdate === false || extractedData.updated === true) {
        return {
          startlistNotif: extractedData.startlistNotif,
          resultNotif: extractedData.resultNotif,
          reminderNotif: extractedData.reminderNotif,
        };
      }
    }

    try {
      const preferences = await $fetch<UserPref & { createdAt: string; updatedAt: string }>(`${config.public.apiBase}/users/preferences/${userId}`, {
        method: "get",
        credentials: "include",
      });

      let toastBody: ToastBody;

      if (!preferences) {
        toastBody = {
          title: "Geen voorkeuren gevonden",
          description: "Je krijgt op dit moment geen enkele email notificatie! Het is te adviseren om dit aan te passen.",
          responseStatus: "warning",

        };
        toastStore.showToast({ ...toastBody, link: "/gebruiker", linkText: "Pas gegevens aan" });
      }

      if (preferences.createdAt === preferences.updatedAt) {
        toastBody = {
          title: "Update je meldingsvoorkeuren!",
          description: "Je krijgt op dit moment geen enkele email notificatie! Het is te adviseren om dit aan te passen.",
          responseStatus: "warning",

        };
        toastStore.showToast({ ...toastBody, link: "/gebruiker", linkText: "Pas gegevens aan" });
      }

      const userPrefsStorage: UserPref & { updated: boolean; needsUpdate: boolean } = {
        needsUpdate: preferences.createdAt === preferences.updatedAt,
        updated: false,
        ...preferences,
      };

      localStorage.setItem("userPrefs", JSON.stringify(userPrefsStorage));

      return { startlistNotif: preferences.startlistNotif, resultNotif: preferences.resultNotif, reminderNotif: preferences.reminderNotif };
    }
    catch (error: any) {
      toastStore.showToast({
        title: "Er is een fout opgetreden",
        description: error.message,
        responseStatus: "warning",
      });

      return {
        startlistNotif: "none",
        resultNotif: "none",
        reminderNotif: "none",
      };
    }
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

  async function deleteUser() {
    if (!user.value) {
      console.error("No user found");
    }

    const { csrf } = useCsrf();
    const headers = new Headers();

    headers.append("csrf-token", csrf);

    await authClient.deleteUser({
      callbackURL: "/", // you can provide a callback URL to redirect after deletion
    });

    navigateTo("/");
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
    getUserPreference,
    deleteUser,
  };
});
