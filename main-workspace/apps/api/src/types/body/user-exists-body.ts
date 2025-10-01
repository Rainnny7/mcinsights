import { z } from "zod";

export type UserExistsBody = z.infer<typeof userExistsBody>;

export const userExistsBody = z.object({
    email: z.string(),
});
