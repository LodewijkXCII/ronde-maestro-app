import type { Cyclist } from "./common";
import type { Race, Stage } from "./race";
import type { CyclistWithRelations } from "./startlist";

export type StageInfo = Stage & {
  race: Race;
};

export type ResultCyclistByStage = {
  id: number;
  position: number;
  points: number;
  cyclist: Cyclist;
};

export type ResultUsersByStage = {
  userId: string;
  name: string;
  points: number;
};
export type EntryWithResult = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  cyclist: CyclistWithRelations & {
    results: {
      points: number;
      position: number;
    }[];
  };
};

export type ResultResponse = {
  stage: StageInfo;
  cyclist: ResultCyclistByStage[];
  users: ResultUsersByStage[];
  entry: EntryWithResult[];
};
