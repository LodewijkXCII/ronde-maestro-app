import type { SelectCountry } from "./common";

export type SelectRaceWithRelations = Race & {
  stages: Stage[];
};
export type ClassicsRaces = {
  name: string;
  startDate: Date;
  finishDate: Date;
  races: Race[] | null;
  year: number;
  seasonTimeId: number | null;
};

export type Race = {
  id: number;
  name: string;
  image: string | null;
  coverImage: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  countryId: number;
  year: number;
  seasonTimeId: number;
  startDate: Date;
  finishDate: Date;
  country: SelectCountry;
  seasonTime: {
    id: number;
    name: string;
  };
};

export type Stage = {
  date: Date;
  id: number;
  image: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  raceId: number;
  stageNr: number;
  startCity: string;
  finishCity: string;
  distance: number;
  done: boolean | null;
  stageTypeId: number;
  stageType: {
    id: number;
    name: string;
    image: string;
  };
};
