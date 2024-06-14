import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import db from "@/lib/pocketbase";
import { cookies } from "next/headers";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ title: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      console.log(Object.keys(ctx), "<---- create posts context");
      const user = await ctx.pb.getUser(cookies());
      console.log(user, "<---- user");
      const post = await ctx.pb.createPost(input.title, user?.id as string);
      return post;
    }),

  getLatest: publicProcedure
    .input(z.object({ userId: z.string(), limit: z.number().default(10) }))
    .query(async ({ input, ctx }) => {
      const posts = (await ctx.pb.getUsersPosts(input.userId)).slice(0, 5);
      return posts;
    }),

  delete: publicProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ input }) => {
      await db.deletePost(input.postId);
      return { success: true };
    }),
});
