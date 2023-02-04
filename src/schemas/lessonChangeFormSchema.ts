import { z } from "zod";

const lessonChangeFormSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  video: z.string().optional(),
  html: z.string().optional(),
  isDraft: z.boolean().default(false),
});

type LessonChangeFormSchema = z.TypeOf<typeof lessonChangeFormSchema>;

export default lessonChangeFormSchema;
export type { LessonChangeFormSchema };
