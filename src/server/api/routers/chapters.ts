import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const chaptersRouter = createTRPCRouter({
  // getChapters: publicProcedure
  //   .input(z.object({ text: z.string() }))
  //   .query(({ input }) => {
  //     return {
  //       greeting: `Hello ${input.text}`,
  //     };
  //   }),

  getChapters: protectedProcedure.query(({ ctx }) => {
    const userId = ctx.session.user.id;
    return ctx.prisma.chapter.findMany({
      include: {
        lessons: {
          select: {
            id: true,
            name: true,
            video: true,
            html: true,
            chapterId: true,
            likedBy: true,
            completedBy: true,
            savedBy: true,
          },
        },
      },
    });
  }),
});
