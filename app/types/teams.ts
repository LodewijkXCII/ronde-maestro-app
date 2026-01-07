export type ReturnNewTeam = {
  insertedPouleId: {
    id: number;
  };
  insertUserInPoule: {
    id: number;
    createdAt: Date | null;
    updatedAt: Date | null;
    userId: string;
    pouleId: number;
  }[];
};
