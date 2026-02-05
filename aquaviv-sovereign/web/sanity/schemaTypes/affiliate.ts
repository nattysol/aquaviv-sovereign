import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'affiliate',
  title: 'Affiliate Partners',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Partner Name',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
    }),
    defineField({
      name: 'password', 
      title: 'Access Key (Password)',
      type: 'string',
      description: 'Simple access key for their dashboard.',
      hidden: true, // Hide from UI if possible, or use a secure hash in production
    }),
    defineField({
      name: 'code',
      title: 'Discount Code',
      type: 'string',
      description: 'The code they share (e.g., SOVEREIGN20). Must match a Shopify Discount Code.',
    }),
    defineField({
      name: 'commissionRate',
      title: 'Commission Rate (%)',
      type: 'number',
      initialValue: 20,
    }),
    defineField({
      name: 'totalEarnings',
      title: 'Total Earnings ($)',
      type: 'number',
      initialValue: 0,
      readOnly: true, // Updated via Webhook
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['active', 'pending', 'banned'] },
      initialValue: 'pending',
    }),
  ],
})