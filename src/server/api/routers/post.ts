import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import db from "@/lib/pocketbase";

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
    .mutation(async ({ input }) => {
      // simulate a slow db call

      const post = await db.createPost(input.title);
      return post;
    }),

  getLatest: publicProcedure.query(async () => {
    const post = await db.getLatestPosts();
    console.log(post);
    return post[post.length - 1];
  }),
});
