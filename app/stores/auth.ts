import { authClient } from "~/lib/auth-client";

type ErrorTypes = Partial<
  Record<
    keyof typeof authClient.$ERROR_CODES,
    {
      en: string;
      nl: string;
    }
  >
>;

const errorCodes = {
  INVALID_EMAIL_OR_PASSWORD: {
    en: "user already registered",
    nl: "Onjuist email of wachtwoord",
  },
} satisfies ErrorTypes;

function getErrorMessage(code: string, lang: "en" | "nl") {
  if (code in errorCodes) {
    return errorCodes[code as keyof typeof errorCodes][lang];
  }
  return "";
}

const {
  useSession,
  signIn,
  signOut,
  signUp,
} = authClient;

export const useAuthStore = defineStore("useAuthstore", () => {
  const router = useRouter();
  const session = ref<ReturnType<typeof authClient.useSession> | null>(null);

  async function init() {
    // TODO IF !DATA NAVIGATE TO /
    const data = await useSession();

    if (!data) {
      return navigateTo("/");
    }
    session.value = data;
  }

  const user = computed(() => session.value?.value.data?.user);
  const loading = computed(() => session.value?.value.isPending);
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
