export type SelectRaceWithRelations = {
  id: number;
  name: string;
  image: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  countryId: number;
  year: number;
  seasonTimeId: number;
  startDate: Date;
  finishDate: Date;
  country: {
    id: number;
    name: string;
    abbreviation: string;
  };
  seasonTime: {
    id: number;
    name: string;
  };
  stages: Stage[];
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
