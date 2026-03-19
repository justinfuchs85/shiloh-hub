import type { CollectionConfig } from 'payload'

const Photos: CollectionConfig = {
  slug: 'photos',
  admin: {
    useAsTitle: 'caption',
    defaultColumns: ['caption', 'category', 'order'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'url',
      type: 'text',
      label: 'Image URL',
      admin: {
        description: 'Direct image URL. Or upload a file using the Media collection.',
      },
    },
    {
      name: 'media',
      type: 'relationship',
      relationTo: 'media',
      hasMany: false,
      label: 'Uploaded file (optional — use instead of URL)',
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Exterior', value: 'Exterior' },
        { label: 'Main Floor', value: 'Main Floor' },
        { label: 'Kitchen', value: 'Kitchen' },
        { label: 'Primary Bedroom', value: 'Primary Bedroom' },
        { label: "Ethan's Room", value: "Ethan's Room" },
        { label: "Elle's Room", value: "Elle's Room" },
        { label: "Riley's Room", value: "Riley's Room" },
        { label: 'Bathrooms', value: 'Bathrooms' },
        { label: 'Basement', value: 'Basement' },
        { label: 'Pool & Outdoor', value: 'Pool & Outdoor' },
        { label: 'Garage', value: 'Garage' },
        { label: 'MLS', value: 'MLS' },
        { label: 'Other', value: 'Other' },
      ],
      defaultValue: 'Other',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}

export default Photos
