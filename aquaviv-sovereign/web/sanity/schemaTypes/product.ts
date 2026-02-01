import { defineField, defineType } from 'sanity'
import { Droplet } from 'lucide-react'

export default defineType({
  name: 'product',
  title: 'IP Assets (Products)',
  type: 'document',
  icon: Droplet,
  fields: [
    defineField({
      name: 'title',
      title: 'Commercial Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Technical Tagline',
      type: 'string',
      description: 'e.g., Daily Restore & Cellular Hydration Complex',
    }),
    defineField({
      name: 'price',
      title: 'Base Price (USD)',
      type: 'number',
    }),
    defineField({
      name: 'mainImage',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'benefits',
      title: 'Clinical Benefits',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Add short, punchy benefit lines (e.g., "Restores electrolyte balance")',
    }),
    defineField({
      name: 'ritual',
      title: 'Ritual Instructions',
      type: 'text',
      rows: 3,
      description: 'How should the user consume this? (The "Laboratory" guidance)',
    }),
    defineField({
      name: 'shopifyId_1',
      title: 'Shopify Variant ID (1 Bottle)',
      type: 'string',
    }),
    defineField({
      name: 'shopifyId_3',
      title: 'Shopify Variant ID (3 Bottles)',
      type: 'string',
    }),
    defineField({
      name: 'shopifyId_6',
      title: 'Shopify Variant ID (6 Bottles)',
      type: 'string',
    }),
  ],
})