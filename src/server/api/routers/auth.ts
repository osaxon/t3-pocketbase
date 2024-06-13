import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { loginSchema } from "@/zod-schemas/auth";
import type { RecordAuthResponse } from "pocketbase";
import type { UsersRecord } from "@/lib/pocketbase/pocketbase-types";

export const authRouter = createTRPCRouter({
  login: publicProcedure.input(loginSchema).mutation(async ({ input, ctx }) => {
    const parsedInput = loginSchema.safeParse(input);
    if (!parsedInput.success) {
      throw new Error("Invalid input");
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        credentials: "include",
      });

      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      throw new Error("Could not login");
    }
  }),
});
