import { defineType, defineField } from "sanity";

export const startup = defineType ({
    name: "startup",
    title: "Startup",
    type: "document",
    fields: [
        defineField({
            name: "title",
            type: "string",
        }),
        defineField({
            name: "slug",
            type: "slug",
            options: {
                source: "title",
            },
        }),
        defineField({
            name: "author",
            type: "reference",
            to: [{ type: "author" }],
        }),
        defineField({
            name: "views",
            type: "number",
        }),
        defineField({
            name: "description",
            type: "text",
        }),
        defineField({
            name: "category",
            type: "string", // enum
            validation: (Rule) => Rule.required().min(1).max(20).error("Category is required"), 
        }),
        defineField({
            name: "image",
            type: "url",
            validation: (Rule) => Rule.required().error("Image URL is required"),
        }),
        defineField({
            name: "pitch",
            type: "markdown",
        }),
    ],
})