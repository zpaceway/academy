import type { PrismaClient } from "@prisma/client";
import { z } from "zod";
import lessonChangeFormSchema from "../../../schemas/lessonChangeFormSchema";
import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc";

export const lessonsRouter = createTRPCRouter({
  getLessonsMetadata: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const prismaClient = ctx.prisma;
    return await generateLessonsMetadata(prismaClient, userId);
  }),

  getLesson: protectedProcedure
    .input(z.object({ lessonId: z.string().min(24) }))
    .query(async ({ ctx, input }) =>
      ctx.prisma.lesson.findUnique({
        where: { id: input.lessonId },
        include: {
          comments: { include: { user: true }, orderBy: { createdAt: "asc" } },
        },
      })
    ),

  addLessonComment: protectedProcedure
    .input(
      z.object({ content: z.string().min(1), lessonId: z.string().min(24) })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.lessonComment.create({
        data: {
          userId: ctx.session.user.id,
          lessonId: input.lessonId,
          content: input.content,
        },
      });

      return {
        status: "success",
      };
    }),

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

  rateLesson: protectedProcedure
    .input(
      z.object({ lessonId: z.string().min(24), rate: z.number().min(1).max(5) })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const prismaClient = ctx.prisma;

      await prismaClient.lessonRated.upsert({
        where: {
          userId_lessonId: {
            userId,
            lessonId: input.lessonId,
          },
        },
        update: { userId, lessonId: input.lessonId, rate: input.rate },
        create: { userId, lessonId: input.lessonId, rate: input.rate },
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

  updateLessonContent: adminProcedure
    .input(lessonChangeFormSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.lesson.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          video: input.video,
          html: input.html,
          isDraft: input.isDraft,
        },
      });
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
