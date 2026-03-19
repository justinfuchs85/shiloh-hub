import type { CollectionConfig } from 'payload'

const InventoryItems: CollectionConfig = {
  slug: 'inventory-items',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'owner', 'space'],
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
      required: true,
      label: 'Item name',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Undecided', value: 'Undecided' },
        { label: 'Keep', value: 'Keep' },
        { label: 'Sell', value: 'Sell' },
        { label: 'Donate', value: 'Donate' },
        { label: 'Trash', value: 'Trash' },
      ],
      defaultValue: 'Undecided',
    },
    {
      name: 'owner',
      type: 'select',
      options: [
        { label: 'Justin', value: 'Justin' },
        { label: 'Natalie', value: 'Natalie' },
        { label: 'Both / Shared', value: 'Both' },
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
      name: 'duplicate',
      type: 'checkbox',
      label: 'Mark as duplicate (we both have one)',
      defaultValue: false,
    },
    {
      name: 'notes',
      type: 'text',
      label: 'Notes (condition, estimated value, etc.)',
    },
    {
      name: 'photo',
      type: 'relationship',
      relationTo: 'media',
      hasMany: false,
    },
  ],
}

export default InventoryItems
