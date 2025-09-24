export type ToastBody = {
  title: string;
  description: string;
  responseStatus: "success" | "warning" | "error" | "neutral";
};

export const useToastStore = defineStore("useToastStore", () => {
  const title = ref("");
  const description = ref("");
  const show = ref(false);
  const response = ref<ToastBody["responseStatus"]>("warning");

  function showToast({ title: newTitle, description: newDescription, responseStatus }: ToastBody) {
    title.value = newTitle;
    description.value = newDescription;
    show.value = true;
    response.value = responseStatus;
  }

  function hideToast() {
    show.value = false;
  }

  return {
    title,
    description,
    show,
    response,
    showToast,
    hideToast,
  };
});
