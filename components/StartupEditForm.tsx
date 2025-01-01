"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import React from "react";
import MDEditor from "@uiw/react-md-editor";
import { z } from "zod";
import { writeClient } from "@/app/lib/write-client";
import { Startup } from "@/sanity/types";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  link: z.string().url("Must be a valid URL"),
  preview: z.string().url("Must be a valid URL"),
  pitch: z.string().min(1, "Pitch is required"),
});

type FormData = z.infer<typeof formSchema>;

const StartupEditForm = ({ post }: { post: Startup & { _type: "startup", _updatedAt: string, _rev: string } }) => {
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [pitch, setPitch] = React.useState(post.pitch || "");
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const title = formData.get("title")?.toString() ?? "";
      const description = formData.get("description")?.toString() ?? "";
      const category = formData.get("category")?.toString() ?? "";
      const link = formData.get("link")?.toString() ?? "";
      const preview = formData.get("preview")?.toString() ?? "";

      const formValues: FormData = {
        title,
        description,
        category,
        link,
        preview,
        pitch,
      };

      await formSchema.parseAsync(formValues);

      await writeClient
        .patch(post._id)
        .set({
          title: formValues.title,
          description: formValues.description,
          category: formValues.category,
          image: formValues.link,
          preview: formValues.preview,
          pitch: formValues.pitch,
        })
        .commit();

      toast({
        title: "Success",
        description: "Your startup has been updated successfully",
      });

      router.push(`/startup/${post._id}`);
      router.refresh();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = (error as z.ZodError).flatten().fieldErrors;
        const mappedErrors: Record<string, string> = {};
        Object.keys(fieldErrors).forEach((field) => {
          mappedErrors[field] = fieldErrors[field]?.join(", ") || "";
        });
        setErrors(mappedErrors);

        toast({
          title: "Error",
          description: "Please check your inputs and try again",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "An unknown error occurred",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="startup-form">
      <div>
        <label htmlFor="title" className="startup-form_label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          className="startup-form_input"
          required
          placeholder="Startup Title"
          defaultValue={post.title}
        />
        {errors.title && <p className="startup-form_error">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="startup-form_label">
          Description
        </label>
        <Input
          id="description"
          name="description"
          className="startup-form_textarea"
          required
          placeholder="Startup description"
          defaultValue={post.description}
        />
        {errors.description && (
          <p className="startup-form_error">{errors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="startup-form_label">
          Category
        </label>
        <Input
          id="category"
          name="category"
          className="startup-form_input"
          required
          placeholder="Startup category (e.g. SaaS, Health, etc.)"
          defaultValue={post.category}
        />
        {errors.category && (
          <p className="startup-form_error">{errors.category}</p>
        )}
      </div>

      <div>
        <label htmlFor="link" className="startup-form_label">
          Image URL
        </label>
        <Input
          id="link"
          name="link"
          className="startup-form_input"
          required
          placeholder="Startup Image URL"
          defaultValue={post.image}
        />
        {errors.link && <p className="startup-form_error">{errors.link}</p>}
      </div>

      <div>
        <label htmlFor="preview" className="startup-form_label">
          Preview URL
        </label>
        <Input
          id="preview"
          name="preview"
          className="startup-form_input"
          required
          placeholder="Startup Preview URL"
          defaultValue={post.preview}
        />
        {errors.preview && <p className="startup-form_error">{errors.preview}</p>}
      </div>

      <div data-color-mode="light">
        <label htmlFor="pitch" className="startup-form_label">
          Pitch
        </label>
        <MDEditor
          value={pitch}
          onChange={(value) => setPitch(value as string)}
          id="pitch"
          height={300}
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{
            placeholder: "Briefly describe your idea and what problem it solves",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />
        {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
      </div>

      <Button type="submit" className="startup-form_btn text-white">
        Update
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default StartupEditForm;
