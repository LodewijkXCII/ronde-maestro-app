import * as z from "zod";

export const schema = z.object({
  email: z.string().email("Onjuist emailadres").nonempty(),
  password: z.string().nonempty().min(8, "Het wachtwoord moet uit minimaal 8 karakters bestaan."),
  oldPassword: z.string().min(8, "Het wachtwoord moet uit minimaal 8 karakters bestaan.").optional(),
  confirm: z.string().nonempty(),
  userName: z.string().nonempty({ message: "Naam mag niet leeg zijn." }),
}).refine(data => data.password === data.confirm, {
  message: "Wachtwoord is niet gelijk.",
  path: ["confirm"],
}); ;

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
