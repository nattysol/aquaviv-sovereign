import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'chatLog',
  title: 'Chat Logs',
  type: 'document',
  fields: [
    defineField({
      name: 'userMessage',
      title: 'User Question',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'aiReply',
      title: 'AI Response',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'timestamp',
      title: 'Time',
      type: 'datetime',
    }),
    defineField({
      name: 'isFlagged',
      title: 'Needs Human Follow-up?',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'userMessage',
      subtitle: 'timestamp',
    },
  },
})