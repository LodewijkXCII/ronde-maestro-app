import * as z from "zod";

export const teamSchema = z.object({
  open: z.boolean().default(true),
  name: z.string().nonempty({ message: "Naam mag niet leeg zijn." }),
  password: z.string().optional(),

});

export type TeamSchema = z.infer<typeof teamSchema>;
