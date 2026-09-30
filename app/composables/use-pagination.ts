export function usePagination<T extends { userId: string }>(
  items: MaybeRefOrGetter<T[]>,
  pageSize = 10,
) {
  const authStore = useAuthStore();
  const page = ref(1);
  const currentUserId = computed(() => authStore.user?.id);

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(toValue(items).length / pageSize)),
  );

  const userPage = computed(() => {
    const index = toValue(items).findIndex(
      user => user.userId === toValue(currentUserId),
    );
    return index === -1 ? null : Math.floor(index / pageSize) + 1;
  });

  const pagedItems = computed(() => {
    return toValue(items).slice((page.value - 1) * pageSize, page.value * pageSize);
  });

  const showPagination = computed(() => totalPages.value > 1);

  function goToUser() {
    page.value = userPage.value ?? 1;
  }

  watch(() => toValue(items), goToUser, { immediate: true });

  return {
    page,
    totalPages,
    userPage,
    pagedItems,
    showPagination,
    goToUser,
  };
}
