import type { CollectionConfig } from 'payload'

const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'priority', 'status'],
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
      label: 'Project name',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Pool & Outdoor', value: 'Pool & Outdoor' },
        { label: 'Landscaping', value: 'Landscaping' },
        { label: 'Bedrooms', value: 'Bedrooms' },
        { label: 'Primary Bedroom', value: 'Primary Bedroom' },
        { label: 'Kitchen', value: 'Kitchen' },
        { label: 'Bathrooms', value: 'Bathrooms' },
        { label: 'Basement', value: 'Basement' },
        { label: 'Living Areas', value: 'Living Areas' },
        { label: 'Exterior', value: 'Exterior' },
        { label: 'Other', value: 'Other' },
      ],
      defaultValue: 'Other',
    },
    {
      name: 'priority',
      type: 'select',
      options: [
        { label: 'Before move-in', value: 'before-move' },
        { label: 'Soon', value: 'soon' },
        { label: 'Someday', value: 'someday' },
      ],
      defaultValue: 'soon',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Planning', value: 'planning' },
        { label: 'In progress', value: 'progress' },
        { label: 'Complete', value: 'complete' },
      ],
      defaultValue: 'planning',
    },
    {
      name: 'costEst',
      type: 'text',
      label: 'Estimated cost ($)',
    },
    {
      name: 'contractor',
      type: 'text',
      label: 'Contractor / vendor',
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
      name: 'subtasks',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'done',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}

export default Projects
