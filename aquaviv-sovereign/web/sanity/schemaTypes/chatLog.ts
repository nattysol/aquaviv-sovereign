import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'chatLog',
  title: 'Chat Logs',
  type: 'document',
  fields: [
    defineField({
      name: 'userName', // <--- NEW
      title: 'User Name',
      type: 'string',
    }),
    defineField({
      name: 'userEmail', // <--- NEW
      title: 'User Email',
      type: 'string',
    }),
    defineField({
      name: 'userMessage',
      title: 'User Question',
      type: 'text',
    }),
    defineField({
      name: 'aiReply',
      title: 'AI Response',
      type: 'text',
    }),
    defineField({
      name: 'timestamp',
      title: 'Time',
      type: 'datetime',
    }),
    defineField({
      name: 'isFlagged',
      title: 'Flag for Review',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})