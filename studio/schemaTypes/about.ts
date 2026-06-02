import { defineField, defineType } from "sanity";

export const about = defineType({
  name: "about",
  title: "About",
  type: "document",
  fields: [
    defineField({
      name: "previewParagraphs",
      title: "About preview (homepage)",
      type: "array",
      of: [{ type: "text", rows: 3 }],
      description: "Short paragraphs shown on the main About section.",
    }),
    defineField({
      name: "fullBio",
      title: "Full bio",
      type: "text",
      rows: 12,
      description: "Shown on the Read More about page.",
    }),
    defineField({
      name: "photo",
      title: "About photo",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    prepare: () => ({ title: "About" }),
  },
});
