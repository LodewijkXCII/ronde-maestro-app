import { isPast, isToday } from "date-fns";

export function stageUnderway(stageDate: Date | string): boolean {
  if (isToday(stageDate) || isPast(stageDate)) {
    return true;
  }

  return false;
}
