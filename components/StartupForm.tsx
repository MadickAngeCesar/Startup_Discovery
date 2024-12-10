"use client";

import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from 'zod';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/actions";
import { FileUpload } from "./FileUpload";
import { uploadFile } from "@/lib/upload";

const StartupForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState("");
  const [debouncedPitch, setDebouncedPitch] = useState(pitch);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Debounce pitch updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPitch(pitch);
    }, 100);

    return () => clearTimeout(timer);
  }, [pitch]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
        if (!selectedFile) {
            setErrors(prev => ({ ...prev, image: "Please select an image" }));
            return;
        }

        const form = e.currentTarget;
        const formData = new FormData();
        
        // Manually append form fields to FormData
        formData.append("title", form.title.value);
        formData.append("description", form.description.value);
        formData.append("category", form.category.value);
        formData.append("preview", form.preview.value);
        
        const formValues = {
            title: form.title.value,
            description: form.description.value,
            category: form.category.value,
            preview: form.preview.value,
            image: selectedFile,
            pitch: debouncedPitch,
        }

        console.log('Form Values:', formValues);
        console.log('Form Data Entries:', Array.from(formData.entries()));

        await formSchema.parseAsync(formValues);

        // Upload the image first
        const { url: imageUrl } = await uploadFile(selectedFile);
        
        // Create the pitch with the image URL
        const result = await createPitch(formData, debouncedPitch, imageUrl);
        
        if(result.status === 'SUCCESS'){
            toast({
                title: "SUCCESS",
                description: "Your startup pitch has been created successfully",
            });
            router.push(`/startup/${result._id}`)
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            const fieldErrors: Record<string, string> = {};
            error.errors.forEach((err) => {
                if (err.path) {
                    fieldErrors[err.path[0]] = err.message;
                }
            });
            setErrors(fieldErrors);
        }
        console.log('Errors:', errors);
        toast({
            title: "Error",
            description: "Failed to create startup pitch. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="startup-form">
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
        />
        {errors.description && (
          <p className="startup-form_error">{errors.description}</p>
        )}
      </div>
      <div>
        <label className="startup-form_label">Upload Image</label>
        <FileUpload
          onFileSelect={(file) => {
            setSelectedFile(file);
            setErrors(prev => {
              const updatedErrors = { ...prev };
              delete updatedErrors.image;
              return updatedErrors;
            });
          }}
          className="w-full"
        />
        {errors.image && <p className="text-sm text-red-500 mt-1">{errors.image}</p>}
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
        />
        {errors.category && (
          <p className="startup-form_error">{errors.category}</p>
        )}
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
        />
        {errors.preview && <p className="startup-form_error">{errors.preview}</p>}
      </div>

      <div data-color-mode="light">
        <label htmlFor="pitch" className="startup-form_label">
          Pitch
        </label>
        <MDEditor
          value={pitch}
          onChange={(value) => {
            setPitch(value || "");
          }}
          id="pitch"
          height={300}
          preview="edit"
          hideToolbar={true}
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{
            placeholder: "Briefly describe your idea and what problem it solves",
            "data-color-mode": "light",
            spellCheck: false,
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />
        {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
      </div>

      <Button
        type="submit"
        className="startup-form_btn text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting ..." : "Submit"}
        <Send className="size-6 ml-2" />
      </Button>

      {/* Display form-level errors from state */}
      {errors.form && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md">
          {errors.form}
        </div>
      )}
      
      {/* Display success message when form is submitted successfully */}
      {/* Removed this section as it's not needed anymore */}
    </form>
  );
};

export default StartupForm;
