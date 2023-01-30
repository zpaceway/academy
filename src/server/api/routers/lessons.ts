import type { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const lessonsRouter = createTRPCRouter({
  getLessonsMetadata: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const prismaClient = ctx.prisma;
    return await generateLessonsMetadata(prismaClient, userId);
  }),

  getLesson: protectedProcedure
    .input(z.object({ lessonId: z.string().min(24) }))
    .query(async ({ ctx, input }) =>
      ctx.prisma.lesson.findUnique({ where: { id: input.lessonId } })
    ),

  likeLesson: protectedProcedure
    .input(z.object({ lessonId: z.string().min(24) }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const prismaClient = ctx.prisma;
      await prismaClient.lessonLiked.create({
        data: { userId, lessonId: input.lessonId },
      });

      return {
        status: "success",
      };
    }),

  dislikeLesson: protectedProcedure
    .input(z.object({ lessonId: z.string().min(24) }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const prismaClient = ctx.prisma;
      await prismaClient.lessonLiked.delete({
        where: {
          userId_lessonId: {
            userId,
            lessonId: input.lessonId,
          },
        },
      });

      return {
        status: "success",
      };
    }),

  markLessonAsCompleted: protectedProcedure
    .input(z.object({ lessonId: z.string().min(24) }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const prismaClient = ctx.prisma;
      await prismaClient.lessonCompleted.create({
        data: { userId, lessonId: input.lessonId },
      });

      return {
        status: "success",
      };
    }),

  markLessonAsIncompleted: protectedProcedure
    .input(z.object({ lessonId: z.string().min(24) }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const prismaClient = ctx.prisma;
      await prismaClient.lessonCompleted.delete({
        where: {
          userId_lessonId: {
            userId,
            lessonId: input.lessonId,
          },
        },
      });

      return {
        status: "success",
      };
    }),
});

async function generateLessonsMetadata(
  prismaClient: PrismaClient,
  userId: string
) {
  const lessonsLikedMappedById: Record<string, boolean> = {};
  const lessonsCompletedMappedById: Record<string, boolean> = {};
  const lessonsSavedMappedById: Record<string, boolean> = {};
  const lessonsRatedMappedById: Record<string, number> = {};

  const lessonsLikedPromise = prismaClient.lessonLiked.findMany({
    where: {
      userId: userId,
    },
  });
  const lessonsCompletedPromise = prismaClient.lessonCompleted.findMany({
    where: {
      userId: userId,
    },
  });
  const lessonsSavedPromise = prismaClient.lessonSaved.findMany({
    where: {
      userId: userId,
    },
  });
  const lessonsRatedPromise = prismaClient.lessonRated.findMany({
    where: {
      userId: userId,
    },
  });
  const lessonsCountPromise = prismaClient.lesson.count();

  const [
    lessonsLiked,
    lessonsCompleted,
    lessonsSaved,
    lessonsRated,
    lessonsCount,
  ] = await Promise.all([
    lessonsLikedPromise,
    lessonsCompletedPromise,
    lessonsSavedPromise,
    lessonsRatedPromise,
    lessonsCountPromise,
  ]);

  lessonsLiked.forEach((lessonLiked) => {
    lessonsLikedMappedById[lessonLiked.lessonId] = true;
  });
  lessonsCompleted.forEach((lessonCompleted) => {
    lessonsCompletedMappedById[lessonCompleted.lessonId] = true;
  });
  lessonsSaved.forEach((lessonSaved) => {
    lessonsSavedMappedById[lessonSaved.lessonId] = true;
  });
  lessonsRated.forEach((lessonRated) => {
    lessonsRatedMappedById[lessonRated.lessonId] = lessonRated.rate;
  });

  return {
    liked: lessonsLikedMappedById,
    completed: lessonsCompletedMappedById,
    saved: lessonsSavedMappedById,
    rated: lessonsRatedMappedById,
    count: lessonsCount,
    progress: parseFloat(
      ((Object.keys(lessonsCompleted).length / lessonsCount) * 100).toFixed(1)
    ),
  };
}
