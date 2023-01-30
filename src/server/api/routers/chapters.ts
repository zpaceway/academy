import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const chaptersRouter = createTRPCRouter({
  getChapters: protectedProcedure.query(async ({ ctx }) => {
    const chapters = await ctx.prisma.chapter.findMany({
      include: {
        lessons: {
          where: {
            isDraft: {
              not: true,
            },
          },
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: [
        {
          order: "asc",
        },
      ],
    });

    return chapters;
  }),

  updateAndCreateChapters: protectedProcedure
    .input(
      z.object({
        chapters: z.array(
          z.object({
            id: z.string().min(1),
            name: z.string().min(1),
            order: z.number(),
            lessons: z.array(
              z.object({
                id: z.string().min(1),
                name: z.string().min(1),
                order: z.number(),
              })
            ),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [oldChapterIds, oldLessonIds] = await Promise.all([
        ctx.prisma.chapter
          .findMany({
            select: {
              id: true,
            },
          })
          .then((chapters) => chapters.map((chapter) => chapter.id)),
        ctx.prisma.lesson
          .findMany({
            select: {
              id: true,
            },
          })
          .then((lessons) => lessons.map((lesson) => lesson.id)),
      ]);
      const possibleChapterIds = input.chapters.map((chapter) => chapter.id);
      const possibleLessonIds = input.chapters
        .map((chapter) => chapter.lessons.map((lesson) => lesson.id))
        .flat();

      const promises: Promise<unknown>[] = input.chapters.map((chapter) =>
        ctx.prisma.chapter
          .update({
            where: {
              id: chapter.id,
            },
            data: {
              name: chapter.name,
              order: chapter.order,
            },
          })
          .then(() => {
            Promise.all(
              chapter.lessons.map((lesson) =>
                ctx.prisma.lesson
                  .update({
                    where: {
                      id: lesson.id,
                    },
                    data: {
                      name: lesson.name,
                      order: lesson.order,
                      chapterId: chapter.id,
                      video: "",
                      isDraft: false,
                      html: "",
                    },
                  })
                  .catch(() =>
                    ctx.prisma.lesson.create({
                      data: {
                        name: lesson.name,
                        order: lesson.order,
                        chapterId: chapter.id,
                        video: "",
                        isDraft: false,
                        html: "",
                      },
                    })
                  )
              )
            ).catch(console.error);
          })
          .catch(() =>
            ctx.prisma.chapter
              .create({
                data: {
                  name: chapter.name,
                  order: chapter.order,
                },
              })
              .then((_chapter) => {
                Promise.all(
                  chapter.lessons.map((lesson) =>
                    ctx.prisma.lesson
                      .update({
                        where: {
                          id: lesson.id,
                        },
                        data: {
                          name: lesson.name,
                          order: lesson.order,
                          chapterId: _chapter.id,
                          video: "",
                          isDraft: false,
                          html: "",
                        },
                      })
                      .catch(() =>
                        ctx.prisma.lesson.create({
                          data: {
                            name: lesson.name,
                            order: lesson.order,
                            chapterId: _chapter.id,
                            video: "",
                            isDraft: false,
                            html: "",
                          },
                        })
                      )
                  )
                ).catch(console.error);
              })
          )
      );

      oldChapterIds.forEach((oldChapterId) => {
        if (!possibleChapterIds.includes(oldChapterId)) {
          promises.push(
            ctx.prisma.chapter.delete({
              where: {
                id: oldChapterId,
              },
            })
          );
        }
      });

      oldLessonIds.forEach((oldLessonId) => {
        if (!possibleLessonIds.includes(oldLessonId)) {
          promises.push(
            ctx.prisma.lesson.delete({
              where: {
                id: oldLessonId,
              },
            })
          );
          promises.push(
            ctx.prisma.lessonCompleted.deleteMany({
              where: {
                lessonId: oldLessonId,
              },
            })
          );
          promises.push(
            ctx.prisma.lessonLiked.deleteMany({
              where: {
                lessonId: oldLessonId,
              },
            })
          );
          promises.push(
            ctx.prisma.lessonRated.deleteMany({
              where: {
                lessonId: oldLessonId,
              },
            })
          );
          promises.push(
            ctx.prisma.lessonSaved.deleteMany({
              where: {
                lessonId: oldLessonId,
              },
            })
          );
        }
      });

      await Promise.allSettled(promises);

      return input.chapters;
    }),
});
