import type { CollectionConfig } from 'payload'

const Milestones: CollectionConfig = {
  slug: 'milestones',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'date', 'type'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'MMM d, yyyy',
        },
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Key date', value: 'key' },
        { label: 'Deadline', value: 'deadline' },
        { label: 'Completed', value: 'done' },
      ],
      defaultValue: 'key',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}

export default Milestones
