import type { CyclistWithRelations } from "./startlist";

export type ValidEntry = {
  cyclistId: number;
};

export type GetEntry = {
  id: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  cyclist: CyclistWithRelations & {
    results: {
      points: number;
      position: number;
    };
  };
};
