import { Editor } from "@tinymce/tinymce-react";

interface Props {
  html: string;
}

const LessonHTML = ({ html }: Props) => {
  return (
    <div className="lesson-html-tinymce w-full">
      <Editor
        apiKey="c6i2490y1lc4o7kx35q09ot5iiadxyzhjvt4ex2tavp56rfu"
        initialValue={html}
        init={{
          menubar: false,
          toolbar: false,
          plugins: "autoresize",
          noneditable_class: "mceNonEditable",
          width: "100%",
          inline_boundaries: false,
          skin: "borderless",
          statusbar: false,
          content_style: "body { margin: 0; border: 0; }",
        }}
        disabled={true}
      />
    </div>
  );
};

export default LessonHTML;
