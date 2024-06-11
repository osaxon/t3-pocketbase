import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { loginSchema } from "@/zod-schemas/auth";
import type { RecordAuthResponse } from "pocketbase";
import type { UsersRecord } from "@/lib/pocketbase/pocketbase-types";
import cookie, { CookieSerializeOptions } from "cookie";

export const authRouter = createTRPCRouter({
  login: publicProcedure.input(loginSchema).mutation(async ({ input, ctx }) => {
    const parsedInput = loginSchema.safeParse(input);
    if (!parsedInput.success) {
      throw new Error("Invalid input");
    }

    console.log(Object.keys(ctx));
    ctx.setCookie(ctx.resHeaders, "pb_auth", "authCookie");

    console.log(ctx.getCookie(ctx.req, "pb_auth"));

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        credentials: "include",
      });

      if (response.ok) {
        return response.json() as Promise<RecordAuthResponse<UsersRecord>>;
      }
    } catch (error) {
      throw new Error("Could not login");
    }
  }),
});

export function getCookies(req: Request) {
  const cookieHeader = req.headers.get("Cookie");
  if (!cookieHeader) return {};
  return cookie.parse(cookieHeader);
}

export function getCookie(req: Request, name: string) {
  const cookieHeader = req.headers.get("Cookie");
  if (!cookieHeader) return;
  const cookies = cookie.parse(cookieHeader);
  return cookies[name];
}

export function setCookie(
  resHeaders: Headers,
  name: string,
  value: string,
  options?: CookieSerializeOptions,
) {
  resHeaders.append("Set-Cookie", cookie.serialize(name, value, options));
}
