import type { EntryWithResult } from "~/types/results";

export default function firstEntry(entries: EntryWithResult[]): Date | null {
  if (!entries) {
    return null;
  }

  let firstEntry: Date = new Date();

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (entry?.createdAt && (entry.createdAt < firstEntry)) {
      firstEntry = entry.createdAt;
    }
  }

  return firstEntry;
}
