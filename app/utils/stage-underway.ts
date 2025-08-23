import { isPast } from "date-fns";

export function stageUnderway(stageDate: Date | string): boolean {
  if (isPast(stageDate)) {
    return true;
  }
  return false;
}
