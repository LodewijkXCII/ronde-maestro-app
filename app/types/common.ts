type Level = "UCI ProTeams" | "UCI WorldTeams" | "UCI Women ProTeams" | "UCI Women WorldTeams" | "Geen Team";

export type Cyclist = {
  id: number;
  firstName: string;
  lastName: string;
  image: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  team: {
    id: number;
    name: string;
    abbreviation: string;
    level: Level;
    image: string | null;
    countryId: number;
    createdAt: Date | null;
    updatedAt: Date | null;
  };
  country: SelectCountry;
};

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
