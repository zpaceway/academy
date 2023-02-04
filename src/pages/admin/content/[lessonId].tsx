import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import LoadingScreen from "../../../components/LoadingScreen";
import AdminNavBar from "../../../components/Admin/AdminNavBar";
import { apiAjax, apiHook } from "../../../utils/api";
import { GiHamburgerMenu } from "react-icons/gi";
import AdminButton from "../../../components/Admin/AdminButton";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  Controller,
  type UseFormRegister,
  type UseFormWatch,
} from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import lessonChangeFormSchema, {
  type LessonChangeFormSchema,
} from "../../../schemas/lessonChangeFormSchema";

interface LessonFieldChangeInlineProps {
  label: string;
  name: keyof LessonChangeFormSchema;
  register: UseFormRegister<LessonChangeFormSchema>;
  watch: UseFormWatch<LessonChangeFormSchema>;
}

const LessonFieldChangeInline = ({
  label,
  name,
  register,
  watch,
}: LessonFieldChangeInlineProps) => {
  return (
    <div>
      <div className="text-gray-500">{label}</div>
      <div className="flex">
        <div className="flex flex-col overflow-hidden">
          <input
            type="text"
            className="flex border border-gray-200 p-4 outline-none"
            {...register(name)}
          />
          <div className="h-0 select-none border-gray-200 px-4 opacity-0">
            {watch(name)}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminLessonChange = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [navigatingTo, setNavigatingTo] = useState("");
  const { data: lesson } = apiHook.lessons.getLesson.useQuery(
    {
      lessonId: router.query.lessonId as string,
    },
    { refetchOnWindowFocus: false }
  );
  const [isAdminNavBarOpened, setIsAdminNavBarOpened] = useState<boolean>();

  const { register, watch, handleSubmit, control, reset } =
    useForm<LessonChangeFormSchema>({
      resolver: zodResolver(lessonChangeFormSchema),
      defaultValues: useMemo(() => {
        return {
          id: lesson?.id || "",
          name: lesson?.name || "",
          video: lesson?.video,
          html: lesson?.html,
          isDraft: !!lesson?.isDraft,
        };
      }, [lesson]),
    });

  useEffect(() => {
    lesson && reset(lesson);
  }, [lesson, reset]);

  useEffect(() => {
    if (window.innerWidth >= 640) {
      return setIsAdminNavBarOpened(true);
    }
    return setIsAdminNavBarOpened(false);
  }, []);

  const onSubmit = useCallback((data: LessonChangeFormSchema) => {
    apiAjax.lessons.updateLessonContent
      .mutate(data)
      .catch(console.error)
      .finally(() => setIsSubmitting(false));
  }, []);

  if (isAdminNavBarOpened === undefined || !lesson) {
    return <LoadingScreen />;
  }

  return (
    <div className="fixed inset-0 flex">
      <AdminNavBar
        onToggle={() => setIsAdminNavBarOpened((state) => !state)}
        isOpened={isAdminNavBarOpened}
      />
      <div className="flex w-full flex-col gap-4 overflow-auto bg-white p-4">
        <div className="flex gap-2">
          {!isAdminNavBarOpened && (
            <AdminButton
              className="aspect-square"
              onClick={() => setIsAdminNavBarOpened((state) => !state)}
            >
              <GiHamburgerMenu />
            </AdminButton>
          )}
          <AdminButton
            onClick={() => {
              setNavigatingTo("/admin/content");
              router
                .push("/admin/content")
                .catch(console.error)
                .finally(() => setNavigatingTo(""));
            }}
            loading={navigatingTo === "/admin/content"}
          >
            Content
          </AdminButton>
          <AdminButton
            onClick={() => {
              setIsSubmitting(true);
              handleSubmit(onSubmit)().catch(console.error);
            }}
            loading={isSubmitting}
          >
            Save
          </AdminButton>
        </div>
        <div className="flex flex-col gap-2">
          <LessonFieldChangeInline
            register={register}
            watch={watch}
            label="Name"
            name="name"
          />
          <LessonFieldChangeInline
            register={register}
            watch={watch}
            label="Video"
            name="video"
          />
          <Controller
            name="html"
            control={control}
            render={({ field: { onChange } }) => {
              return (
                <div>
                  <div className="text-gray-500">HTML</div>
                  <Editor
                    initialValue={lesson.html}
                    apiKey="c6i2490y1lc4o7kx35q09ot5iiadxyzhjvt4ex2tavp56rfu"
                    init={{
                      height: 500,
                      menubar: true,
                      skin: "snow",
                      icons: "thin",
                      plugins:
                        "directionality forecolor autoresize searchreplace image emoticons advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table code help wordcount",
                      toolbar:
                        "undo redo | styles | forecolor | bold italic | link image | fontsize | emoticons",
                    }}
                    onEditorChange={onChange}
                  />
                </div>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminLessonChange;
