export function riderSelected(cyclistId: number): boolean {
  const selectedRidersStore = useSelectedRidersStore();

  const isSelected = computed(() => {
    return selectedRidersStore.selectedRiders.some(rider => rider.cyclistId === cyclistId);
  });

  return isSelected.value;
}
