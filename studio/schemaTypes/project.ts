import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project / Band",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      description: "Lower numbers appear first.",
    }),
    defineField({
      name: "thumbnail",
      title: "List thumbnail",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "video1",
      title: "Video 1",
      type: "file",
      options: { accept: "video/*" },
    }),
    defineField({
      name: "video2",
      title: "Video 2",
      type: "file",
      options: { accept: "video/*" },
    }),
    defineField({
      name: "video3",
      title: "Video 3",
      type: "file",
      options: { accept: "video/*" },
    }),
  ],
  orderings: [
    { title: "Sort order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
    { title: "Name", name: "titleAsc", by: [{ field: "title", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", media: "thumbnail" },
  },
});
