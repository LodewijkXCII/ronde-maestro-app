export type StandingsRow<T> =
  | { type: "user"; user: T; position: number }
  | { type: "gap" };

export function getResultWithUser<T extends { userId: string }>(
  userList: T[],
  currentUserId: string | undefined,
  limit: number,
): StandingsRow<T>[] {
  const topCount = 3;

  const toRow = (user: T, index: number): StandingsRow<T> => ({
    type: "user",
    user,
    position: index + 1,
  });

  const userIndex = currentUserId
    ? userList.findIndex((user) => user.userId === currentUserId)
    : -1;

  if (userIndex === -1 || userIndex < limit || limit <= topCount) {
    return userList.slice(0, limit).map(toRow);
  }

  const listSize = limit - topCount;
  const above = Math.floor((listSize - 1) / 2);
  let start = userIndex - above;
  let end = start + listSize;

  if (end > userList.length) {
    start -= end - userList.length;
    end = userList.length;
  }

  start = Math.max(start, topCount);

  const top = userList.slice(0, topCount).map(toRow);
  const around = userList
    .slice(start, end)
    .map((user, i) => toRow(user, i + start));

  return [...top, { type: "gap" }, ...around];
}
