import type { SelectCountry, SelectSpeciality, Team } from "./common";

export type TeamWithStartlistCyclists = {
  team: Team;
  cyclists: CyclistWithRaceDetails[];
};

export type StartlistTeamsAndRiders = TeamWithStartlistCyclists[];

export type StartlistWithTeam = {
  id: number;
  teamId: number;
  raceId: number;
  createdAt: Date;
  updatedAt: Date;
  team: Team;
};

export type CyclistWithRaceDetails = CyclistWithRelations
  & { startlistDetails: StartlistDetails };

export type CyclistWithRelations = {
  id: number;
  image: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  countryId: number;
  firstName: string;
  lastName: string;
  fullName?: string;
  teamId: number;
  country: SelectCountry;
  team: Team;
  specialities: { speciality: SelectSpeciality }[];
};
export type StartlistDetails = {
  raceNumber: number;
  withdraw: boolean;
  raceId: number;
};
