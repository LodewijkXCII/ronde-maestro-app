export type ToastBody = {
  title: string;
  description: string;
  responseStatus: "success" | "warning" | "error" | "neutral";
  linkText?: string;
  link?: string;
};

export const useToastStore = defineStore("useToastStore", () => {
  const title = ref("");
  const description = ref("");
  const show = ref(false);
  const response = ref<ToastBody["responseStatus"]>("warning");
  const toastLink = ref<string | undefined>(undefined);
  const toastLinkText = ref<string | undefined>(undefined);

  function showToast({ title: newTitle, description: newDescription, responseStatus, linkText: newLinkText, link: newLink }: ToastBody) {
    title.value = newTitle;
    description.value = newDescription;
    show.value = true;
    response.value = responseStatus;
    toastLink.value = newLink;
    toastLinkText.value = newLinkText;
  }

  function hideToast() {
    show.value = false;
  }

  return {
    title,
    description,
    show,
    response,
    toastLink,
    toastLinkText,
    showToast,
    hideToast,
  };
});
