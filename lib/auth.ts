
"use server";
import { auth } from "@/auth"
import { parseServerActionResponse } from "./utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";

export const createPitch = async (
  form: FormData,
  pitch: string,
  imageUrl: string
) => {
  const session = await auth()

  if (!session)
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });

  const { title, description, category, preview } = Object.fromEntries(
    form.entries()
  );

  try {
    // First, ensure the user exists in Sanity
    const userDoc = {
      _type: "user",
      _id: session.id,
      name: session.user?.name || "Anonymous",
      email: session.user?.email || "",
      image: session.user?.image || "",
    };

    try {
      await writeClient.createIfNotExists(userDoc);
    } catch (error) {
      console.error("Error creating user:", error);
    }

    const doc = {
      _type: "startup",
      title,
      slug: {
        _type: "slug",
        current: slugify(title as string, { lower: true }),
      },
      description,
      category,
      pitch,
      image: imageUrl,
      preview,
      author: {
        _type: "reference",
        _ref: session.id,
      },
      views: 0,
    };

    const startup = await writeClient.create(doc);

    return parseServerActionResponse({
      data: startup,
      status: "SUCCESS",
    });
  } catch (error) {
    return parseServerActionResponse({
      error: error instanceof Error ? error.message : "Error creating startup",
      status: "ERROR",
    });
  }
};

export const auth = async () => {
  // ...existing auth logic...
};