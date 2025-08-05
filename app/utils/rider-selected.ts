export function riderSelected(cyclistId: number): boolean {
  const selectedRidersStore = useSelectedRidersStore();
  const foundRider = selectedRidersStore.selectedRiders.find(rider => rider.cyclistId === cyclistId);

  if (foundRider) {
    return true;
  }
  return false;
}
