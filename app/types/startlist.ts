export type TeamWithStartlistCyclists = {
  team: Team;
  cyclists: CyclistWithRaceDetails[];
};

export type StartlistTeamsAndRiders = TeamWithStartlistCyclists[];

export type Team = {
  id: number;
  name: string;
  image: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  abbreviation: string;
  level: Level;
  countryId: number;
  country: {
    abbreviation: string;
    id: number;
    name: string;
  };
};

export type StartlistWithTeam = {
  id: number;
  teamId: number;
  raceId: number;
  createdAt: Date;
  updatedAt: Date;
  team: Team;
};

type Level = "UCI ProTeams" | "UCI WorldTeams" | "UCI Women ProTeams" | "UCI Women WorldTeams" | "Geen Team";

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

export type SelectSpeciality = {
  id: number;
  name: string;
  image: string;
};
export type SelectCountry = {
  id: number;
  name: string;
  abbreviation: string;
};
