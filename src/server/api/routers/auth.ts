import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { loginSchema } from "@/zod-schemas/auth";

export const authRouter = createTRPCRouter({
  login: publicProcedure.input(loginSchema).mutation(({ input }) => {
    return input;
  }),
});
