import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "heroNameLine1",
      title: "Hero name (line 1)",
      type: "string",
      initialValue: "Steven",
    }),
    defineField({
      name: "heroNameLine2",
      title: "Hero name (line 2)",
      type: "string",
      initialValue: "Garza",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero subtitle",
      type: "string",
      initialValue: "Live + Studio Drummer · Austin, Texas",
    }),
    defineField({
      name: "heroBackground",
      title: "Hero background image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "email",
      title: "Booking email",
      type: "string",
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: "contactNote",
      title: "Contact section note",
      type: "string",
      initialValue: "For gigs, studio work, and touring —",
    }),
    defineField({
      name: "footerLocation",
      title: "Footer location",
      type: "string",
      initialValue: "Austin, Texas",
    }),
    defineField({
      name: "footerWebsite",
      title: "Footer website label",
      type: "string",
      initialValue: "stevengarza.live",
    }),
    defineField({
      name: "reelUrl",
      title: "Live reel link (play button)",
      type: "url",
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
          preview: {
            select: { title: "label", subtitle: "url" },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
