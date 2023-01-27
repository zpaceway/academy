import { createTRPCRouter, protectedProcedure } from "../trpc";

export const chaptersRouter = createTRPCRouter({
  getChapters: protectedProcedure.query(async ({ ctx }) => {
    const chapters = await ctx.prisma.chapter.findMany({
      include: {
        lessons: true,
      },
    });

    return chapters;
  }),
});
