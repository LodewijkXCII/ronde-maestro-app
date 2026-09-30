export function placedUser(absolutePosition: number) {
  return {
    winner: absolutePosition === 1,
    second: absolutePosition === 2,
    third: absolutePosition === 3,
  };
}
