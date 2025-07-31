import { isToday } from "date-fns";

export function stageUnderway(stageDate: Date | string): boolean {
  return isToday(stageDate);
}
