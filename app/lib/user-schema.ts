import * as z from "zod";

export const userSchema = z.object({
  email: z.string().email("Onjuist emailadres").nonempty(),
  password: z.string().nonempty().min(8, "Het wachtwoord moet uit minimaal 8 karakters bestaan."),
  confirm: z.string().nonempty(),
  name: z.string().nonempty({ message: "Naam mag niet leeg zijn." }),
});

export const schema = userSchema.refine(data => data.password === data.confirm, {
  message: "Wachtwoord is niet gelijk.",
  path: ["confirm"],
});

export const accountSchema = userSchema.pick({
  name: true,
  email: true,
});

export type AccountSchema = z.infer<typeof accountSchema>;

export const passwordSchema = userSchema.pick({
  password: true,
  confirm: true,
}).extend({
  oldPassword: z.string().nonempty(),
});

const options = ["email", "push", "email_push", "none"] as const;

export const userPrefSchema = z.object({
  startlistNotif: z.enum(options),
  reminderNotif: z.enum(options),
  resultNotif: z.enum(options),
});

export type UserPref = {
  startlistNotif: "push" | "email" | "email_push" | "none";
  reminderNotif: "push" | "email" | "email_push" | "none";
  resultNotif: "push" | "email" | "email_push" | "none";
};
