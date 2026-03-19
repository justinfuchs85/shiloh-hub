import type { CollectionConfig } from 'payload'

const Notes: CollectionConfig = {
  slug: 'notes',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'space', 'createdAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title (optional)',
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
    },
    {
      name: 'author',
      type: 'select',
      required: true,
      options: [
        { label: 'Justin', value: 'Justin' },
        { label: 'Natalie', value: 'Natalie' },
      ],
      defaultValue: 'Justin',
    },
    {
      name: 'space',
      type: 'relationship',
      relationTo: 'spaces',
      hasMany: false,
    },
    {
      name: 'image',
      type: 'relationship',
      relationTo: 'media',
      hasMany: false,
    },
  ],
  timestamps: true,
}

export default Notes
