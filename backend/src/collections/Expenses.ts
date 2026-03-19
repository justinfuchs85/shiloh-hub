import type { CollectionConfig } from 'payload'

const Expenses: CollectionConfig = {
  slug: 'expenses',
  admin: {
    useAsTitle: 'description',
    defaultColumns: ['description', 'est', 'actual'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'description',
      type: 'text',
      required: true,
    },
    {
      name: 'est',
      type: 'text',
      label: 'Estimated ($)',
    },
    {
      name: 'actual',
      type: 'text',
      label: 'Actual ($)',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}

export default Expenses
