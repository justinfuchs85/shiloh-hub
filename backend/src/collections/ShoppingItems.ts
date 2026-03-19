import type { CollectionConfig } from 'payload'

const ShoppingItems: CollectionConfig = {
  slug: 'shopping-items',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'room', 'priority', 'status', 'priceEst'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'room',
      type: 'relationship',
      relationTo: 'shopping-rooms',
      required: true,
    },
    {
      name: 'priority',
      type: 'select',
      options: [
        { label: 'Must have', value: 'Must have' },
        { label: 'Nice to have', value: 'Nice to have' },
        { label: 'Someday', value: 'Someday' },
      ],
      defaultValue: 'Must have',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Need to buy', value: 'Need to buy' },
        { label: 'Ordered', value: 'Ordered' },
        { label: 'Delivered', value: 'Delivered' },
        { label: 'Done', value: 'Done' },
      ],
      defaultValue: 'Need to buy',
    },
    {
      name: 'store',
      type: 'text',
      label: 'Store / Brand',
    },
    {
      name: 'priceEst',
      type: 'text',
      label: 'Estimated price',
    },
    {
      name: 'priceActual',
      type: 'text',
      label: 'Actual price',
    },
    {
      name: 'dims',
      type: 'text',
      label: 'Dimensions',
    },
    {
      name: 'qty',
      type: 'number',
      defaultValue: 1,
    },
    {
      name: 'assignee',
      type: 'select',
      options: [
        { label: 'Unassigned', value: '' },
        { label: 'Justin', value: 'Justin' },
        { label: 'Natalie', value: 'Natalie' },
      ],
      defaultValue: '',
    },
    {
      name: 'link',
      type: 'text',
      label: 'Product URL',
    },
    {
      name: 'image',
      type: 'text',
      label: 'Product image URL',
    },
    {
      name: 'notes',
      type: 'text',
    },
    {
      name: 'done',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}

export default ShoppingItems
