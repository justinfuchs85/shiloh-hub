import type { CollectionConfig } from 'payload'

const Utilities: CollectionConfig = {
  slug: 'utilities',
  admin: {
    useAsTitle: 'type',
    defaultColumns: ['type', 'provider', 'status', 'cost'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'type',
      type: 'text',
      required: true,
      label: 'Service type (e.g. Electric)',
    },
    {
      name: 'provider',
      type: 'text',
      label: 'Provider name',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'website',
      type: 'text',
    },
    {
      name: 'account',
      type: 'text',
      label: 'Account number',
    },
    {
      name: 'username',
      type: 'text',
      label: 'Online username',
    },
    {
      name: 'cost',
      type: 'text',
      label: 'Est. monthly cost ($)',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Not set up', value: 'Not set up' },
        { label: 'Transfer in progress', value: 'Transfer in progress' },
        { label: 'Active', value: 'Active' },
        { label: 'Cancelled', value: 'Cancelled' },
      ],
      defaultValue: 'Not set up',
    },
    {
      name: 'notes',
      type: 'text',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}

export default Utilities
