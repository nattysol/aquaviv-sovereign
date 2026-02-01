import { defineField, defineType } from 'sanity'
import { Users } from 'lucide-react'

export default defineType({
  name: 'affiliate',
  title: 'Affiliate Partners',
  type: 'document',
  icon: Users,
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'slug',
      title: 'Dashboard Handle',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'category',
      title: 'Professional Category',
      type: 'string',
      options: {
        list: [
          { title: 'Wellness Influencer', value: 'influencer' },
          { title: 'Holistic Practitioner', value: 'practitioner' },
          { title: 'Health Coach', value: 'coach' },
        ],
      },
    }),
    defineField({
      name: 'socialReach',
      title: 'Social Reach / Audience Size',
      type: 'string',
      description: 'e.g., "@wellnessbyjane (50k)"',
    }),
    defineField({
      name: 'status',
      title: 'Application Status',
      type: 'string',
      initialValue: 'pending',
      options: {
        list: [
          { title: 'Pending Review', value: 'pending' },
          { title: 'Approved (Active)', value: 'approved' },
          { title: 'Rejected', value: 'rejected' },
        ],
      },
    }),
  ],
})