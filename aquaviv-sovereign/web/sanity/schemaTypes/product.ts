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
      name: 'store',
      title: 'Shopify Connection',
      type: 'object',
      fields: [
        {
          name: 'variantID',
          title: 'Variant GID',
          type: 'string',
          description: 'Paste the Shopify Global ID here (e.g. gid://shopify/ProductVariant/123456...)',
        },
        {
          name: 'price',
          title: 'Price',
          type: 'number',
        },
        {
          name: 'isAvailable',
          title: 'In Stock?',
          type: 'boolean',
          initialValue: true,
        }
      ]
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
  name: 'gallery',
  title: 'Image Gallery',
  type: 'array',
  description: 'Add extra angles, lifestyle shots, or close-ups.',
  of: [{ type: 'image', options: { hotspot: true } }],
}),

defineField({
  name: 'video',
  title: 'Product Video (MP4)',
  type: 'file',
  description: 'Upload a short, looping MP4 (max 10MB recommended) for the hero section.',
  options: { accept: 'video/mp4' },
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
    name: 'proTip',
    title: 'Pro Tip',
    type: 'text',
    rows: 3,
    description: 'A short, expert tip displayed inside the yellow box in the Ritual accordion.',
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
    defineField({
      name: 'longDescription',
      title: 'Deep Dive Description',
      type: 'array', 
      of: [{type: 'block'}], // Rich text for "The Science"
      description: 'The in-depth explanation of the product science.',
    }),
    defineField({
      name: 'ingredients',
      title: 'Ingredients & Sourcing',
      type: 'text', // Simple text for now, or use 'image' if you have a label photo
      rows: 4,
      description: 'e.g. Magnesium Chloride, Potassium, Sourced from the Great Salt Lake...',
    }),
    defineField({
      name: 'faqs',
      title: 'Product FAQs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'question', type: 'string', title: 'Question'},
            {name: 'answer', type: 'text', title: 'Answer', rows: 3}
          ]
        }
      ]
    }),
  ],
})