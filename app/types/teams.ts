import type { RaceTotalPoints } from "./results";

export type ReturnNewTeam = {
  insertedPouleId: {
    id: number;
  };
  insertUserInPoule: UserPoule[];
};

export type UserPoule = {
  password: string | null;
  id: number;
  name: string;
  image: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  open: boolean | null;
  adminUserId: string;
  users: {
    user: {
      id: string;
      name: string;
      createdAt: Date;
      standings: {
        points: number;
        stageId: number;
      };
    };
  }[];
};

export type UserPouleWithResults = UserPoule & {
  resultByUser: RaceTotalPoints[]; // The array we created in the last step
};
